import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function VersusLanding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [view, setView] = useState("landing"); // landing | create | join
  const [joinCode, setJoinCode] = useState(searchParams.get("code") || "");

  useEffect(() => {
    // If code is in URL params, auto-navigate to room
    const code = searchParams.get("code");
    if (code) {
      navigate("/game/versus/room", {
        state: { action: "join", code: code.trim().toUpperCase() },
      });
    }
  }, [searchParams, navigate]);

  const handleCreate = (e) => {
    e.preventDefault();
    navigate("/game/versus/room", {
      state: { action: "create" },
    });
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    navigate("/game/versus/room", {
      state: {
        action: "join",
        code: joinCode.trim().toUpperCase(),
      },
    });
  };

  return (
    <div className="container main pt-4 pb-5">
      <Helmet>
        <title>Infinite LoLdle - Versus Mode</title>
        <meta
          name="description"
          content="Play Infinite LoLdle in real-time versus mode against other players."
        />
      </Helmet>

      <h2 className="text-center mb-4">⚔️ Versus Mode</h2>
      <p className="text-center text-muted mb-5">
        Compete against 2–16 players in real-time guessing rounds
      </p>

      {view === "landing" && (
        <div className="row justify-content-center g-4">
          <div className="col-12 col-md-5">
            <div
              className="card bg-dark border-secondary h-100 text-center p-4"
              style={{ cursor: "pointer" }}
              onClick={() => setView("create")}
            >
              <div className="card-body">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "3rem", color: "#c89b3c" }}
                >
                  add_circle
                </span>
                <h4 className="card-title mt-3 text-white">Create Room</h4>
                <p className="card-text text-muted">
                  Start a new game and invite friends with a code
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-5">
            <div
              className="card bg-dark border-secondary h-100 text-center p-4"
              style={{ cursor: "pointer" }}
              onClick={() => setView("join")}
            >
              <div className="card-body">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "3rem", color: "#c89b3c" }}
                >
                  login
                </span>
                <h4 className="card-title mt-3 text-white">Join Room</h4>
                <p className="card-text text-muted">
                  Enter a room code to join an existing game
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "create" && (
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <div className="card bg-dark border-secondary p-4">
              <h4 className="text-white mb-4">Create a Room</h4>
              <ul className="text-muted mb-4 ps-3">
                <li>Choose game modes, rounds and player cap after creating</li>
                <li>Share the room code or link with friends to invite them</li>
                <li>Start when everyone is ready — you're the host</li>
              </ul>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setView("landing")}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-warning flex-grow-1"
                  onClick={handleCreate}
                >
                  Create Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "join" && (
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <div className="card bg-dark border-secondary p-4">
              <h4 className="text-white mb-4">Join a Room</h4>
              <form onSubmit={handleJoin}>
                <div className="mb-3">
                  <label className="form-label text-white">Room Code</label>
                  <input
                    type="text"
                    className="form-control bg-secondary text-white border-0"
                    placeholder="Enter 6-character code"
                    maxLength={6}
                    value={joinCode}
                    onChange={(e) =>
                      setJoinCode(e.target.value.toUpperCase())
                    }
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setView("landing")}
                  >
                    Back
                  </button>
                  <button type="submit" className="btn btn-warning flex-grow-1">
                    Join Room
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
