import React, { useEffect, useMemo, useState } from "react";
import getVisitsArray from "./getHistory";
import VisitsChart from "./VisitsChart";
import { ErrorBoundary } from "./ErrorBound";

export default function VisitsHistoryChart({ filter }) {
  const [history, setHistory] = useState([]);
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    const limitTime =
      filter.length >= 6
        ? new Date(filter).getTime() - 24 * 60 * 60 * 1000
        : new Date().getTime() - Number(filter) * 60 * 60 * 1000;

    const options = {
      text: "",
      maxResults: 10000,
      endTime:
        filter.length >= 4 ? new Date(filter).getTime() : new Date().getTime(),
      startTime: limitTime,
    };

    (async () => {
      getVisitsArray(options).then(({ visits, historys }) => {
        setVisits(visits);
        setHistory(historys);
      });
    })();
  }, [filter]);

  const { nodes, links, family } = useMemo(() => {
    if (!visits || visits.length == 0) {
      return { nodes: null, links: null, family: null };
    }

    const uniqueVisits = Array.from(
      new Map(
        visits.flat().map((item) => {
          const key = item.id + item.referringVisitId;
          return [key, item];
        })
      ).values()
    ).sort((l, r) => {
      return l.visitTime - r.visitTime;
    });

    const linkVisits = uniqueVisits.filter(
      (item) => item.transition === "link"
    );

    const uniqueIdVisits = Array.from(
      new Map(
        linkVisits.map((item) => {
          const key = item.id;
          return [key, item];
        })
      ).values()
    );

    const nodes = uniqueIdVisits.map((visit) => {
      const hist = history.find((h) => h.id === visit.id);
      return {
        data: {
          id: visit.id,
          title: hist.title,
          url: hist.url,
          time: hist.visitTime,
        },
      };
    });

    const raw_links = linkVisits
      .map((visit) => {
        const source = linkVisits.find((from) => {
          return visit.referringVisitId === from.visitId;
        });
        if (!source) {
          return;
        }

        return {
          data: {
            target: visit.id,
            source: source.id,
          },
        };
      })
      .filter((item) => item);

    const uniqueRawLinks = Array.from(
      new Map(
        raw_links.map((item) => {
          const key = item.data.target + item.data.source;
          return [key, item];
        })
      ).values()
    );

    const raw_family = [];
    const links = [];
    const rootChildren = [];
    uniqueRawLinks.forEach(({ data: { target, source } }) => {
      // link
      const alreadyParent =
        raw_family.some(({ data: { parent } }) => target === parent) &&
        links.length != 1;

      const isChild2Child = raw_family.some(({ data: { children } }) => {
        return children.some((id) => id === target);
      });

      const isBack = alreadyParent || isChild2Child;
      links.push({
        data: {
          target,
          source,
          isBack,
        },
      });

      // family
      const fidx = raw_family.findIndex(({ parent }) => parent === source);

      if (fidx < 0) {
        if (alreadyParent) {
          return;
        }

        raw_family.push({
          data: {
            parent: source,
            children: [target],
          },
        });
        rootChildren.push(source);
        return;
      }

      const newChild = [...new Set([...family[fidx].data.children, target])];
      raw_family[fidx].data.children = newChild;
    });

    const oneNodeIds = nodes
      .filter(({ data: { id, url } }) => {
        return links.some(({ data: { source, target } }) => {
          return id === source || id === target;
        });
      })
      .map(({ data: { id } }) => {
        return id;
      });

    const roots = rootChildren.concat(oneNodeIds);
    const family = [
      ...raw_family,
      { data: { parent: "root", children: roots } },
    ];

    nodes.push({ data: { id: "root", title: "root", url: "root" } });

    return { nodes, links, family };
  }, [visits]);

  //   const node = visits.map((value) => {
  //     const historyItem = history.find((h) => h.id === value[0].id);
  //     return {
  //       data: {
  //         id: value[0].id,
  //         index: 0,
  //         title: historyItem.title,
  //         url: historyItem.url,
  //       },
  //     };
  //   });

  const findsource = (referringId) => {
    if (referringId === 0) {
      return;
    } else {
      for (const v of visits) {
        for (const w of v) {
          if (referringId === Number(w.visitId)) {
            return { id: w.id, time: w.visitTime };
          }
        }
      }
    }
  };

  const reverseFamily = visits.map((value) => {
    return {
      target: value[0].id,
      source: value
        .map((v) => {
          const sourceid = findsource(Number(v.referringVisitId));
          if (sourceid) {
            return sourceid.id;
          }
        })
        .filter((element) => element),
      time: value
        .map((w) => {
          const sourcetime = findsource(Number(w.referringVisitId));
          if (sourcetime) {
            return sourcetime.time;
          }
        })
        .filter((element) => element),
    };
  });

  //   const edges = reverseFamily
  //     .map((value) => {
  //       const data = value;
  //       return value.source.map((element, index) => {
  //         return {
  //           data: {
  //             target: data.target,
  //             source: element,
  //             time: data.time[index],
  //             isBack: true,
  //           },
  //         };
  //       });
  //     })
  //     .filter((element) => element.length)
  //     .flat();
  // var referrer = document.referrer;
  if (!nodes || !links || !family) {
    return (
      <div>
        <p>getting your visits...</p>
      </div>
    );
  }
  return (
    <>
      <ErrorBoundary>
        <VisitsChart {...{ nodes, links, family }} />
      </ErrorBoundary>
    </>
  );
}
