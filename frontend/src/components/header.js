import React from "react";
import { Link } from "react-router-dom";
import Settings from "../components/settings";

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark mb-5">
      <div className="container-fluid">
        <img src={"./favicon.png"} className="m-2" alt="Logo" />
        <Link className="navbar-brand" to="/">
          Infiniteloldle
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Champions
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/splash">
                Splash
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/item">
                Item
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/oldItem">
                Removed item
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="leaderboard">
                Leaderboard
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <div className="d-flex justify-content-start">
              <button className="btn btn-dark darkBtn p-2 pb-0">
                <li className="nav-item">
                  <Link className="nav-link" to="about">
                    <span className="material-symbols-outlined">help</span>
                  </Link>
                </li>
              </button>
              <button className="btn btn-dark darkBtn p-2 pb-0">
                <li className="nav-item">
                  <Link className="nav-link" to="legal">
                    <span className="material-symbols-outlined">gavel</span>
                  </Link>
                </li>
              </button>
              <button className="btn btn-dark darkBtn p-2 pb-0">
                <li className="nav-item">
                  <Link className="nav-link" to="stats">
                    <span className="material-symbols-outlined">
                      leaderboard
                    </span>
                  </Link>
                </li>
              </button>
              <button className="btn btn-dark darkBtn p-2 pb-0">
                <li className="nav-item">
                  <Link className="nav-link" to="stats">
                    <span className="material-symbols-outlined">
                      monitoring
                    </span>
                  </Link>
                </li>
              </button>
              <Settings />
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}
