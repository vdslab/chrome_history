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

function InputDate({ yesterday }) {
  if (yesterday) {
    return (
      <div className="field is-grouped is-grouped-multiline">
        <p className="control">
          <input className="input" type="date" defaultValue="0" />
        </p>
      </div>
    );
  } else {
    return <div></div>;
  }
}

function Form(props) {
  function handleSubmit(event) {
    event.preventDefault();
    const date =
      event.target[0].value === "-1"
        ? event.target[1].value
        : event.target[0].value;
    props.onFormSubmit(date);
  }

  const [yesterday, setYesterday] = useState(false);

  const selectChange = (value) => {
    if (value === "-1") {
      setYesterday(true);
    } else {
      setYesterday(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <div className="select">
          <select
            defaultValue="過去24時間"
            onChange={(event) => selectChange(event.target.value)}
          >
            <option value="6">過去６時間</option>
            <option value="12">過去12時間</option>
            <option value="24">過去24時間</option>
            <option value="-1">昨日以降</option>
          </select>
        </div>
      </div>

      <InputDate yesterday={yesterday} />

      <button className="button is-primary" type="submit" value="submit">
        適用
      </button>
    </form>
  );
}

function FormModal({ show, setShow, setFilter }) {
  function reloadDate(props) {
    setFilter(props);
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

  const [filtering, setFiltering] = useState("24");
  console.log(filtering);

  return (
    <div>
      <div className="container">
        <button className="button" onClick={openModal}>
          日付でフィルタリング
        </button>
        <FormModal show={show} setShow={setShow} setFilter={setFiltering} />
      </div>

      <div className="section">
        <div className="container">
          <div className="box">
            <ErrorBoundary>
              <VisitsHistoryChart filter={filtering} />
            </ErrorBoundary>
          </div>
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
