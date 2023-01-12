import React, { useState } from "react";
import HistoryChart from "./HistoryChart";

<<<<<<< HEAD
const node = [];
const nodeIDs = [];
const link = [];

chrome.history.onVisited.addListener((re) => {
  if (!nodeIDs.includes(re.id)) {
    node.push({ data: { id: re.id, url: re.url } });
    nodeIDs.push(re.id);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "ready-post-data") {
    sendResponse("ok");
    chrome.runtime.sendMessage("get-data", (response) => {
      // console.log("received data", response);
      const { nodes, links } = response;
      setNodes(nodes);
      setLinks(links);
    });
  } else {
    sendResponse("not get");
  }
  var referrer = document.referrer;
  // console.log("ref", referrer);
});
=======
const App = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "ready-post-data") {
      sendResponse("ok");
      chrome.runtime.sendMessage("get-data", (response) => {
        console.log("received data", response);
        const { nodes, links } = response;
        setNodes(nodes);
        setLinks(links);
      });
    } else {
      sendResponse("not get");
    }
    var referrer = document.referrer;
    console.log("ref", referrer);
  });
>>>>>>> 03e12d218f0bea9eba77447074d557be9d625814

  return (
    <div>
      <h1>My new React App</h1>
      <HistoryChart {...{ nodes, links }} />
    </div>
  );
};

export default App;
