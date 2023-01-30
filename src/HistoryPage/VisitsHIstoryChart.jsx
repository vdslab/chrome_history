import React, { useEffect, useState } from "react";
import getVisitsArray from "./getHistory";
import HistoryChart from "../HistoryChart";

export default function VisitsHistoryChart() {
  const [history, setHistory] = useState([]);
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    const limitTime = new Date().getTime() - 24 * 60 * 60 * 1000;
    const options = {
      text: "",
      maxResults: 100,
      startTime: limitTime,
    };

    (async () => {
      getVisitsArray(options).then(({ visits, historys }) => {
        setVisits(visits);
        setHistory(historys);
      });
    })();
  }, []);

  if (visits.length == 0) {
    return (
      <div>
        <p>visits unload</p>
      </div>
    );
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
  //   console.log(uniqueVisits);
  const linkVisits = uniqueVisits.filter((item) => item.transition === "link");
  //   console.log("linkVisits", linkVisits);

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
      },
    };
  });
  //   console.log("nodes", nodes);

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
  const links = Array.from(
    new Map(
      raw_links.map((item) => {
        const key = item.data.target + item.data.source;
        return [key, item];
      })
    ).values()
  );
  //   console.log("raw_links", raw_links);
  //   console.log("links", links);

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

  console.log("links", links);
  const family = [];
  links.forEach(({ data: { target, source } }) => {
    const fidx = family.findIndex(({ parent }) => parent === source);
    console.log(family, target, source);
    console.log(fidx);
    if (fidx < 0) {
      family.push({ parent: source, children: [target] });
    }

    family[fidx].children.push(target);
  });
  console.log(family);

  return (
    <div>
      <p>visits chart</p>
      <div>
        {/* <HistoryChart {...{ nodes: node, links: edges }} /> */}
        <HistoryChart {...{ nodes, links }} />
      </div>
    </div>
  );
}
