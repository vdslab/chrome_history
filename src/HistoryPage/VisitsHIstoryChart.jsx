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

    // console.log(getVisitsArray(options));
    (async () => {
      getVisitsArray(options).then(({ visits, historys }) => {
        console.log(visits);
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

  const node = visits.map((value) => {
    const historyItem = history.find((h) => h.id === value[0].id);
    return {
      data: {
        id: value[0].id,
        index: 0,
        title: historyItem.title,
        url: historyItem.url,
      },
    };
  });

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

  const edges = reverseFamily
    .map((value) => {
      const data = value;
      return value.source.map((element, index) => {
        return {
          data: {
            target: data.target,
            source: element,
            time: data.time[index],
            isBack: true,
          },
        };
      });
    })
    .filter((element) => element.length)
    .flat();
  // var referrer = document.referrer;

  //   console.log("reverse family", reverseFamily);
  //   console.log("node", node);
  //   console.log("edges", edges);
  //   console.log("visits", visits);

  return (
    <div>
      <p>visits chart</p>
      <div>
        <HistoryChart {...{ nodes: node, links: edges }} />
      </div>
    </div>
  );
}
