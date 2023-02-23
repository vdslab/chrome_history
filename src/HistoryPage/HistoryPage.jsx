import React from "react";
import "bulma/css/bulma.css";
import {
  Route,
  Link,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { HotHistory } from "./component/HotHistory";
import { VisitsHistory } from "./component/VisitsHistory";
import { Home } from "./component/Home";
import { Header } from "./component/Header";

export function Navigation() {
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
