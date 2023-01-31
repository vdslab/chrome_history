import React from "react";
import HotHistoryChart from "./HotHistoryChart";
import VisitsHistoryChart from "./VisitsHIstoryChart";
import "bulma/css/bulma.css";
import { HashRouter, Routes, Route, Link } from "react-router-dom";

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
    <HashRouter>
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
                <Route path="HotHistory" element={<HotHistory />}></Route>
                <Route path="VisitsHistory" element={<VisitsHistory />} />
              </Routes>
            </div>
          </div>
        </div>
      </section>
    </HashRouter>
  );
}

function HotHistory() {
  return (
    <div className="section">
      <div className="container">
        <div className="box">
          <HotHistoryChart />
        </div>
      </div>
    </div>
  );
}

function VisitsHistory() {
  return (
    <div className="section">
      <div className="container">
        <div className="box">
          <VisitsHistoryChart />
        </div>
      </div>
    </div>
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
