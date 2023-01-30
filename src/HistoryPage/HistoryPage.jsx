import React, { useEffect, useState } from "react";
import HistoryChart from "../HistoryChart";

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

  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [family, setFamily] = useState([]);

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
    
    chrome.runtime.sendMessage("get-data", (response) => {
      const { nodes, links } = response;
      setNodes(nodes);
      setLinks(links);
      setFamily(family);
      return true;
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

  const family = links.map;

  // console.log("ノード", node);
  console.log("リヴァい", reverseFamily);
  console.log("リンク", links);



  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "ready-post-data") {
      sendResponse("ok");
      chrome.runtime.sendMessage("get-data", (response) => {
        // console.log("received data", response);
        const { nodes, links, family } = response;
        setNodes(nodes);
        setLinks(links);
        setFamily(family);
      });
    } else {
      sendResponse("not get");
    }
    var referrer = document.referrer;
    // console.log("ref", referrer);
  });

  return (
    <div>
      <h1>My new React App</h1>
      <HistoryChart {...{ nodes, links, family }} />
      <button
        onClick={() => {
          chrome.tabs.create({
            url: "history-page.html",
          });
        }}
      >
        click me
      </button>
    </div>
  );
}
