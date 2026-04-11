import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function VersusLanding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [view, setView] = useState("landing"); // landing | create | join
  const [joinCode, setJoinCode] = useState(searchParams.get("code") || "");
  const [nickname, setNickname] = useState(() => {
    const stored = localStorage.getItem("nickname") || "";
    return stored.slice(0, 30);
  });

  useEffect(() => {
    // If code is in URL params, go straight to join view
    if (searchParams.get("code")) {
      setView("join");
    }
  }, [searchParams]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    localStorage.setItem("nickname", nickname.trim());
    navigate("/game/versus/room", {
      state: { action: "create", nickname: nickname.trim() },
    });
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!nickname.trim() || !joinCode.trim()) return;
    localStorage.setItem("nickname", nickname.trim());
    navigate("/game/versus/room", {
      state: {
        action: "join",
        code: joinCode.trim().toUpperCase(),
        nickname: nickname.trim(),
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
              <form onSubmit={handleCreate}>
                <div className="mb-3">
                  <label className="form-label text-white">Your Nickname</label>
                  <input
                    type="text"
                    className="form-control bg-secondary text-white border-0"
                    placeholder="Enter nickname"
                    maxLength={30}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
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
                    Create Room
                  </button>
                </div>
              </form>
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
                  <label className="form-label text-white">Your Nickname</label>
                  <input
                    type="text"
                    className="form-control bg-secondary text-white border-0"
                    placeholder="Enter nickname"
                    maxLength={30}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                  />
                </div>
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
