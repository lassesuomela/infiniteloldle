import React from 'react'
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav class="navbar navbar-expand-lg navbar-dark mb-5">
      <div class="container-fluid">
        <Link class="navbar-brand" to="/">Infiniteloldle</Link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <Link class="nav-link" to="register">Register</Link>
            </li>
            <li class="nav-item">
            <Link class="nav-link" to="scoreboard">Scoreboard</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
