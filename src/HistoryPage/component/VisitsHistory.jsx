import React, { useState } from "react";
import { FormModal } from "./Modal";
import { ErrorBoundary } from "../ErrorBound";
import VisitsHistoryChart from "../VisitHistory";

export function VisitsHistory() {
  const [show, setShow] = useState("modal");
  const openModal = () => {
    setShow("modal is-active");
  };

  const [filtering, setFiltering] = useState(0);

  return (
    <div className="container">
      <div className="section">
        <button className="button" onClick={openModal}>
          日付でフィルタリング
        </button>
        <FormModal show={show} setShow={setShow} setFilter={setFiltering} />

        <div className="box">
          <ErrorBoundary>
            <VisitsHistoryChart filter={filtering} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
