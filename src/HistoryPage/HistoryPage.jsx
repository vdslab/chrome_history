import React from "react";
import HotHistoryChart from "./HotHistoryChart";
import VisitsHistoryChart from "./VisitsHIstoryChart";

export default function HistoryPage() {
  // var referrer = document.referrer;

  return (
    <div>
      <HotHistoryChart />
      <VisitsHistoryChart />
    </div>
  );
}
