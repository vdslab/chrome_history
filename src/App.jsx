import React, { useEffect, useState } from "react";
import HistoryChart from "./HistoryChart";
// import data from "./_dammy.json";

// const node = [];
// const nodeIDs = [];
// const link = [];

const App = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const nodeIDs = [];
  useEffect(() => {
    // TODO: 何もしないので別の関数に切り出したい
  }, [nodes, links]);

  chrome.history.onVisited.addListener((re) => {
    if (!nodeIDs.includes(re.id)) {
      nodes.push({ data: { id: re.id, url: re.url } });
      setNodes([...nodes]);
      nodeIDs.push(re.id);
    }

    if (nodeIDs.length !== 1) {
      links.push({
        data: { target: re.id, source: nodeIDs[nodeIDs.length - 2] },
      });
      setLinks([...links]);
    }
    // console.log(node);
    // console.log(link);
  });

  return (
    <div>
      <h1>My new React App</h1>
      <HistoryChart {...{ nodes, links }} />
    </div>
  );
};

export default App;
