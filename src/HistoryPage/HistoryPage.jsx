import React, { useEffect, useState } from "react";
import getVisitsArray from "./getHistory";
import HotHistoryChart from "./HotHistoryChart";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    const limitTime = new Date().getTime() - 60 * 60 * 1000;
    const options = {
      text: "",
      maxResults: 100,
      startTime: limitTime,
    };

    setVisits(getVisitsArray(options));
  }, []);

  const node = visits.map((value) => {
    return { id: value[0].id, index: 0 };
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
        return { taeget: data.target, source: element, time: data.time[index] };
      });
    })
    .filter((element) => element.length)
    .flat();
  // var referrer = document.referrer;

  return (
    <div>
      <HotHistoryChart />
    </div>
  );
}
