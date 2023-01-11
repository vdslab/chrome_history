import React from "react";
import HistoryChart from "./HistoryChart";
import data from "./_dammy.json";

const App = () => {
  return (
    <div>
      <h1>My new React App</h1>
      <HistoryChart {...data} />
    </div>
  );
};

export default App;
