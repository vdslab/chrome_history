import React from "react";
import HotHistoryChart from "./HotHistoryChart";
import VisitsHistoryChart from "./VisitsHIstoryChart";
import "bulma/css/bulma.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Header() {
  return (
    <header className="hero is-link">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">HistoryTree</h1>
        </div>
      </div>
    </header>
  );
}

function Router() {
  return (
    <BrowserRouter>
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-2">
              <aside className="menu">
                <ul className="menu-list">
                  <li>
                    <Link to="HotHistory">Hot</Link>
                  </li>
                  <li>
                    <Link to="VisitsHistory">Visits</Link>
                  </li>
                </ul>
              </aside>
            </div>
            <div className="column is-10">
              <Routes>
                <Route path="HotHistory" element={<HotHistoryChart />}></Route>
                <Route path="VisitsHistory" element={<VisitsHistoryChart />} />
              </Routes>
            </div>
          </div>
        </div>
      </section>
    </BrowserRouter>
  );
}

export default function HistoryPage() {
  // var referrer = document.referrer;

  return (
    <div>
      <Header />
      <Router />
    </div>
  );
}
