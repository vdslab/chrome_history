import React, { useEffect, useState } from "react";
import HistoryChart from "../HistoryChart";

export default function HotHistoryChart() {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [family, setFamily] = useState([]);

  useEffect(() => {
    chrome.runtime.sendMessage("get-data", (response) => {
      const { nodes, links, family } = response;
      setNodes(nodes);
      setLinks(links);
      setFamily(family);
      return true;
    });
  }, []);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "ready-post-data") {
      sendResponse("ok");
      chrome.runtime.sendMessage("get-data", (response) => {
        const { nodes, links, family } = response;
        setNodes(nodes);
        setLinks(links);
        setFamily(family);
      });
    } else {
      sendResponse("not get");
    }
  });

  return (
    <div>
      <HistoryChart {...{ nodes, links, family }} />
    </div>
  );
}
