import React from "react";
import HistoryChart from "./HistoryChart";
import data from "./_dammy.json";

const node = [];
const nodeIDs = [];
const link = [];

chrome.history.onVisited.addListener((re) => {
  if (!nodeIDs.includes(re.id)) {
    node.push({ data: { id: re.id, url: re.url } });
    nodeIDs.push(re.id);
  }

  if (nodeIDs.length !== 1) {
    link.push({
      data: { target: re.id, source: nodeIDs[nodeIDs.length - 2] },
    });
  }
  console.log(node);
  console.log(link);
});

const App = () => {
  return (
    <div>
      <h1>My new React App</h1>
      <HistoryChart {...data} />
    </div>
  );
};

export default App;
