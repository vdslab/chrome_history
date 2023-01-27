import React, { useEffect, useState } from "react";

async function getHistorys(options) {
  const history = await chrome.history.search(options);
  return history;
}

async function getVisits(options) {
  const visits = await chrome.history.getVisits(options);
  return visits;
}

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

    console.log(limitTime);

    getHistorys(options).then((historys) => {
      setHistory(historys);
      historys.forEach((history) => {
        console.log("id", history.id, "url", history.url);
        getVisits({ url: history.url }).then((visit) => {
          visits.push(visit);
          // console.log(visit);
          setVisits([...visits]);
        });
      });
    });
  }, []);

  // if (history.length !== 0) {
  //   console.log(history);
  // }
  if (visits.length !== 0) {
    console.log("visits", visits);
  }

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

  const links = reverseFamily
    .map((value) => {
      const data = value;
      return value.source.map((element, index) => {
        return { taeget: data.target, source: element, time: data.time[index] };
      });
    })
    .filter((element) => element.length)
    .flat();

  // console.log("ノード", node);
  console.log("リヴァー氏", reverseFamily);
  console.log("リンク", links);

  return (
    <>
      <div>
        <p>atnother page</p>
      </div>
    </>
  );
}
