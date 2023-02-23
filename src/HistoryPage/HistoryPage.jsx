import React, { useState } from "react";
import HotHistoryChart from "./HotHistory";
import VisitsHistoryChart from "./VisitHistory";
import "bulma/css/bulma.css";
import {
  Route,
  Link,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
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

function Navigation() {
  return (
    <nav className="navbar">
      <aside className="navbar-menu is-active">
        <ul className="navbar-start">
          <li className="navbar-item">
            <Link to={"/index.html"}>Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="HotHistory">今の履歴</Link>
          </li>
          <li className="navbar-item">
            <Link to="VisitsHistory">過去の履歴</Link>
          </li>
        </ul>
      </aside>
    </nav>
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
            defaultValue="0"
            onChange={(event) => selectChange(event.target.value)}
          >
            <option value="0" hidden>
              履歴を取得する期間を選択
            </option>
            <option value="6">過去6時間</option>
            <option value="12">過去12時間</option>
            <option value="24">過去24時間</option>
            <option value="-1">昨日以前</option>
          </select>
        </div>
      </div>

      <InputDate yesterday={yesterday} />

      <button
        className="button is-primary "
        type="submit"
        value="submit"
        onClick={() => {
          props.close();
        }}
      >
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
      <div className="modal-background" onClick={() => closeModal()}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <div className="container">
            <p className="modal-card-title">日付でフィルタリング</p>
          </div>
          <button className="delete" onClick={() => closeModal()}></button>
        </header>
        <section className="modal-card-body">
          <div className="content">
            <Form onFormSubmit={reloadDate} close={closeModal} />
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

function Home() {
  const colSize = 6;
  const colMax = 12;
  const colPos = `is-${colSize} is-offset-${Math.floor(
    (colMax - colSize) / 2
  )}`;
  return (
    <div className="section">
      <div className="container">
        <div className="block has-text-centered">
          <h2 className="title has-text-link">History Tree</h2>
          <p className="subtitle">自分の履歴をグラフで見る</p>
        </div>

        <div className="columns">
          <div className={`column ${colPos}`}>
            <article className="message is-dark">
              <div className="message-header">
                <p>使い方</p>
              </div>
              <div className="message-body content">
                <h4>今の履歴</h4>
                <p>chromeのウィンドウを開いてからの履歴が描画されます</p>
                <h4>過去の履歴</h4>
                <p>
                  どの期間の履歴を描画するか選択して，履歴を描画することができます
                </p>
                <p>選択できる期間は以下の通りです</p>
                <ul>
                  <li>現在から6時間前まで</li>
                  <li>現在から12時間前まで</li>
                  <li>現在から24時間前まで</li>
                  <li>特定の日付における，0時から24時までの24時間</li>
                </ul>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        element={
          <div>
            <Header />
            <Navigation />
            <Outlet />
          </div>
        }
        path="/index.html"
      >
        <Route index element={<Home />}></Route>
        <Route element={<HotHistory />} path="HotHistory"></Route>
        <Route element={<VisitsHistory />} path="VisitsHistory"></Route>
      </Route>
    </>
  )
);

export default function HistoryPage() {
  // var referrer = document.referrer;

  return <RouterProvider router={router} />;
}
