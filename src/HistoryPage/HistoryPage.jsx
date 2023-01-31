import React, { useState } from "react";
import HotHistoryChart from "./HotHistoryChart";
import VisitsHistoryChart from "./VisitsHIstoryChart";
import "bulma/css/bulma.css";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBound";

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
                    <Link to="/HotHistory">今の履歴</Link>
                  </li>
                  <li>
                    <Link to="/VisitsHistory">過去の履歴</Link>
                  </li>
                </ul>
              </aside>
            </div>
            <div className="column is-10">
              <Routes>
                <Route path="/HotHistory" element={<HotHistory />}></Route>
                <Route path="/VisitsHistory" element={<VisitsHistory />} />
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
          <ErrorBoundary>
            <HotHistoryChart />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

function Form(props) {
  function handleSubmit(event) {
    event.preventDefault();
    const date = event.target[0];
    const time = event.target[1];
    props.onFormSubmit({ d: date.value, t: time.value });
  }

  const [dropdown, setDropdown] = "no-active";

  return (
    <form onSubmit={handleSubmit}>
      <div className="section">
        <div className="select">
          <select defaultValue="全期間">
            <option>全期間</option>
            <option>今日</option>
            <option>昨日</option>
            <option>過去7日間</option>
            <option>過去30日間</option>
            <option>カスタム</option>
          </select>
        </div>
      </div>

      <div className="section">
        <div className="field is-grouped is-grouped-multiline">
          <p className="control">
            <label className="label">日にち</label>
            <input className="input" type="date" defaultValue="0" />
          </p>
          <p className="control">
            <label className="label">日にち</label>
            <input className="input" type="date" defaultValue="1" />
          </p>
        </div>
      </div>

      <button className="button is-primary" type="submit" value="submit">
        適用
      </button>
    </form>
  );
}

function FormModal({ show, setShow }) {
  const [date, setDate] = useState(0);
  const [time, setTime] = useState(1);
  function reloadDate(props) {
    setDate(props.d);
    setTime(props.t);
  }

  function closeModal() {
    setShow("modal");
  }

  return (
    <div className={show}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <div className="container">
            <p className="modal-card-title">日付でフィルタリング</p>
          </div>
          <button className="delete" onClick={closeModal}></button>
        </header>
        <section className="modal-card-body">
          <div className="content">
            <Form onFormSubmit={reloadDate} />
          </div>
        </section>
      </div>
    </div>
  );
}

function VisitsHistory() {
  const [show, setShow] = useState("modal");
  const openModal = () => {
    setShow("modal is-active");
  };

  return (
    <div>
      <div className="container">
        <button className="button" onClick={openModal}>
          日付でフィルタリング
        </button>
        <FormModal show={show} setShow={setShow} />
      </div>

      <div className="section">
        <div className="container">
          <div className="box">
            <ErrorBoundary>
            <VisitsHistoryChart {...{}} />
          </div>
          </ErrorBoundary>
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
