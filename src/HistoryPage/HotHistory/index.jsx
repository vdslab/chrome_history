import React, { Suspense, useEffect, useState } from "react";
import HistoryChart from "./HistoryChart";
import { ErrorBoundary } from "../ErrorBound";

export default function HotHistoryChart() {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [family, setFamily] = useState([]);

  useEffect(() => {
    (async () => {
      const port = chrome.runtime.connect();
      const { nodes, links, family } = await chrome.runtime.sendMessage(
        "get-data"
      );
      setNodes(nodes);
      setLinks(links);
      setFamily(family);
    })();
  }, []);

  // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //   if (message === "ready-post-data") {
  //     sendResponse("ok");
  //     chrome.runtime.sendMessage("get-data", (response) => {
  //       const { nodes, links, family } = response;
  //       setNodes(nodes);
  //       setLinks(links);
  //       setFamily(family);
  //     });
  //   } else {
  //     sendResponse("not get");
  //   }
  // });

  if (!nodes || !links || !family) {
    return <p>loading</p>;
  }

  return (
    <>
      <HistoryChart {...{ nodes, links, family }} />
    </>
  );
}
