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
            return w.id;
          }
        }
      }
    }
  };

  const links = visits.map((value) => {
    return {
      target: value[0].id,
      source: value
        .map((v) => {
          return findsource(Number(v.referringVisitId));
        })
        .filter((element) => element !== undefined),
    };
  });
  console.log("ノード", node);
  console.log("リンク", links);

  return (
    <>
      <div>
        <p>atnother page</p>
      </div>
    </>
  );
}
