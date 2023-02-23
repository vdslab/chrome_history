import React from "react";
import HotHistoryChart from "../HotHistory";
import { ErrorBoundary } from "../ErrorBound";

export function HotHistory() {
  return (
    <div className="section">
      <div className="container">
        <div className="box">
          <ErrorBoundary>
            <HotHistoryChart />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
