import React, { useEffect, useMemo, useState } from "react";
import getVisitsArray from "./getHistory";
import VisitsChart from "./VisitsChart";
import { ErrorBoundary } from "./ErrorBound";

export default function VisitsHistoryChart({ filter }) {
  const [history, setHistory] = useState([]);
  const [visits, setVisits] = useState([]);

  function getLimit(filter) {
    const startTime =
      filter.length >= 6
        ? new Date(filter).getTime() - 24 * 60 * 60 * 1000
        : new Date().getTime() - Number(filter) * 60 * 60 * 1000;
    const endTime =
      filter.length >= 4 ? new Date(filter).getTime() : new Date().getTime();
    return { startTime, endTime };
  }

  useEffect(() => {
    const { startTime, endTime } = getLimit(filter);

    const options = {
      text: "",
      maxResults: 10000,
      endTime,
      startTime,
    };

    getVisitsArray(options).then(({ visits, historys }) => {
      setVisits(visits);
      setHistory(historys);
    });
  }, [filter]);

  const { startTime, endTime } = getLimit(filter);

  const { nodes, links, family } = useMemo(() => {
    if (!visits || visits.length == 0 || !history || history.length == 0) {
      return { nodes: null, links: null, family: null };
    }

    const uniqueVisits = visits.flat().reduce((current, now) => {
      const { id, referringVisitId, transition, visitId, visitTime } = now;
      if (startTime > visitTime) {
        return current;
      }

      const idx = current.findIndex(({ id, referringVisitId }) => {
        return id === now.id && referringVisitId === now.referringVisitId;
      });

      if (idx < 0) {
        current.push({
          id,
          referringVisitId,
          transitions: [transition],
          visitIds: [visitId],
          visitTimes: [visitTime],
        });
        return current;
      }

      current[idx].transitions.push(transition);
      current[idx].visitIds.push(visitId);
      current[idx].visitTimes.push(visitTime);

      return current;
    }, []);

    const uniqueIdVisits = Array.from(
      new Map(
        uniqueVisits.map((item) => {
          const key = item.id;
          return [key, item];
        })
      ).values()
    );

    const nodes = uniqueIdVisits
      .map((visit) => {
        const hist = history.find((h) => h.id === visit.id);

        if (!hist) {
          return;
        }
        return {
          data: {
            id: visit.id,
            title: hist.title,
            url: hist.url,
            time: hist.visitTime,
          },
        };
      })
      .filter((item) => item);

    const raw_links = uniqueVisits
      .map((visit) => {
        const source = uniqueVisits.find((from) => {
          return from.visitIds.some((id) => id === visit.referringVisitId);
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
        return;
      }

      const newChild = [...new Set([...family[fidx].data.children, target])];
      raw_family[fidx].data.children = newChild;
    });

    return { nodes, links, family: raw_family };
  }, [visits, history]);
  // });

  if (new Date(filter).getTime() > new Date().getTime()) {
    return (
      <div>
        <p>no data. plese select before now</p>
      </div>
    );
  }

  if (filter <= 0) {
    return (
      <div>
        <p>no data. plese select time</p>
      </div>
    );
  }
  // // var referrer = document.referrer;

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
