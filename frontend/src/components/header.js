import React from 'react'
import { Link } from "react-router-dom";
import Settings from "../components/settings";

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark mb-5">
      <div className="container-fluid">
        <img src={"./favicon.png"} className="m-2" alt="Logo"/>
        <Link className="navbar-brand" to="/">Infiniteloldle</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">

            <li className="nav-item">
              <Link className="nav-link" to="/">Champions</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/splash">Splash</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="leaderboard">Leaderboard</Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="about">About</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="legal">Legal</Link>
            </li>

            <Settings />
          </ul>
        </div>
      </div>
    </nav>
  )
}
