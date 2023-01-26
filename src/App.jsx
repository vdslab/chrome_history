import React, { useState } from "react";
import HistoryChart from "./HistoryChart";

const App = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [family, setFamily] = useState([]);

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
};

export default App;
