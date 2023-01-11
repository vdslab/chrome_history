import React, { useEffect, useState } from "react";
import HistoryChart from "./HistoryChart";

const App = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [nodeIDs, setNodeIds] = useState([]);
  useEffect(() => {
    // TODO: 何もしないので別の関数に切り出したい
  }, [nodeIDs]);

  chrome.history.onVisited.addListener((re) => {
    if (!nodeIDs.includes(re.id)) {
      nodes.push({ data: { id: re.id, url: re.url } });
      setNodes([...nodes]);
      nodeIDs.push(re.id);
      setNodeIds([...nodeIDs]);
    }

    if (nodeIDs.length !== 1) {
      links.push({
        data: { target: re.id, source: nodeIDs[nodeIDs.length - 2] },
      });
      setLinks([...links]);
    }
  });

  return (
    <div>
      <h1>My new React App</h1>
      <HistoryChart {...{ nodes, links }} />
    </div>
  );
};

export default App;
