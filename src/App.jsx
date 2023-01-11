import React, { useState } from "react";
import HistoryChart from "./HistoryChart";

const App = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  return (
    <div>
      <h1>My new React App</h1>
      <HistoryChart {...{ nodes, links }} />
    </div>
  );
};

export default App;
