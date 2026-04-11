import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";

const ALL_MODES = [
  { value: "champion", label: "Champion" },
  { value: "splash", label: "Splash Art" },
  { value: "item", label: "Item" },
  { value: "legacy_item", label: "Legacy Item" },
  { value: "ability", label: "Ability" },
];

export default function VersusLobby({
  room,
  myPlayerId,
  shareLink,
  onStartGame,
  onKickPlayer,
  onLeaveRoom,
  onUpdateSettings,
}) {
  const isHost = room.hostId === myPlayerId;
  const canStart = isHost && room.players.length >= 2;
  const [codeVisible, setCodeVisible] = useState(false);

  // Local settings state (host only)
  const [rounds, setRounds] = useState(room.settings.rounds);
  const [maxPlayers, setMaxPlayers] = useState(room.settings.maxPlayers);
  const [gameModes, setGameModes] = useState(room.settings.gameModes);

  const handleCopyCode = () => {
    toast.success("Room code copied!");
  };

  const handleCopyLink = () => {
    toast.success("Room link copied to clipboard!");
  };

  const toggleMode = (mode) => {
    if (gameModes.includes(mode)) {
      if (gameModes.length === 1) return; // must have at least 1
      setGameModes(gameModes.filter((m) => m !== mode));
    } else {
      setGameModes([...gameModes, mode]);
    }
  };

  const handleApplySettings = () => {
    onUpdateSettings({ rounds, maxPlayers, gameModes });
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-white mb-0">⚔️ Versus Lobby</h3>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={onLeaveRoom}
          >
            Leave
          </button>
        </div>

        {/* Room code */}
        <div className="card bg-dark border-secondary mb-4">
          <div className="card-body">
            <small className="text-muted d-block mb-2">Room Code</small>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div
                className="d-flex align-items-center gap-2 flex-grow-1"
                style={{ cursor: "pointer" }}
                onClick={() => setCodeVisible((v) => !v)}
              >
                <h2
                  className="text-warning mb-0"
                  style={{ letterSpacing: "0.3em", minWidth: "8rem" }}
                >
                  {codeVisible
                    ? room.code
                    : "•".repeat(room.code.length)}
                </h2>
                <span
                  className="material-symbols-outlined text-muted"
                  style={{ fontSize: "1.2rem" }}
                >
                  {codeVisible ? "visibility_off" : "visibility"}
                </span>
              </div>
              <div className="d-flex gap-2">
                <CopyToClipboard text={room.code} onCopy={handleCopyCode}>
                  <button className="btn btn-outline-secondary btn-sm">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "1rem", verticalAlign: "middle" }}
                    >
                      content_copy
                    </span>{" "}
                    Copy Code
                  </button>
                </CopyToClipboard>
                <CopyToClipboard text={shareLink} onCopy={handleCopyLink}>
                  <button className="btn btn-outline-warning btn-sm">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "1rem", verticalAlign: "middle" }}
                    >
                      share
                    </span>{" "}
                    Share Link
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          </div>
        </div>

        {/* Room settings */}
        <div className="card bg-dark border-secondary mb-4">
          <div className="card-body">
            <h6 className="text-muted mb-3">Room Settings</h6>
            {isHost ? (
              <>
                <div className="mb-3">
                  <label className="form-label text-white d-flex justify-content-between">
                    <span>Rounds</span>
                    <span className="text-warning fw-bold">{rounds}</span>
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min={1}
                    max={30}
                    value={rounds}
                    onChange={(e) => setRounds(Number(e.target.value))}
                  />
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">1</small>
                    <small className="text-muted">30</small>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label text-white d-flex justify-content-between">
                    <span>Max Players</span>
                    <span className="text-warning fw-bold">{maxPlayers}</span>
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min={2}
                    max={16}
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  />
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">2</small>
                    <small className="text-muted">16</small>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label text-white">Game Modes</label>
                  <div className="d-flex flex-wrap gap-2">
                    {ALL_MODES.map(({ value, label }) => {
                      const active = gameModes.includes(value);
                      const disabled = active && gameModes.length === 1;
                      return (
                        <button
                          key={value}
                          type="button"
                          className={`btn btn-sm ${active ? "btn-warning" : "btn-outline-secondary"}`}
                          disabled={disabled}
                          onClick={() => toggleMode(value)}
                          title={disabled ? "At least one mode must be selected" : ""}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <button
                  className="btn btn-outline-warning btn-sm w-100"
                  onClick={handleApplySettings}
                >
                  Apply Settings
                </button>
              </>
            ) : (
              <div className="row g-2">
                <div className="col-6">
                  <small className="text-muted d-block">Rounds</small>
                  <span className="text-white">{room.settings.rounds}</span>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block">Max Players</small>
                  <span className="text-white">{room.settings.maxPlayers}</span>
                </div>
                <div className="col-12">
                  <small className="text-muted d-block">Game Modes</small>
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {room.settings.gameModes.map((mode) => (
                      <span
                        key={mode}
                        className="badge bg-secondary text-capitalize"
                      >
                        {mode.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Players list */}
        <div className="card bg-dark border-secondary mb-4">
          <div className="card-body">
            <h6 className="text-muted mb-3">
              Players ({room.players.length}/{room.settings.maxPlayers})
            </h6>
            <ul className="list-unstyled mb-0">
              {room.players.map((player) => (
                <li
                  key={player.id}
                  className="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary"
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-white">{player.nickname}</span>
                    {player.id === room.hostId && (
                      <span className="badge bg-warning text-dark">Host</span>
                    )}
                    {player.id === myPlayerId && (
                      <span className="badge bg-info text-dark">You</span>
                    )}
                  </div>
                  {isHost && player.id !== myPlayerId && (
                    <button
                      className="btn btn-outline-danger btn-sm py-0"
                      onClick={() => onKickPlayer(player.id)}
                    >
                      Kick
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Start game button */}
        {isHost ? (
          <button
            className="btn btn-warning w-100 py-3"
            disabled={!canStart}
            onClick={onStartGame}
          >
            {canStart
              ? "Start Game"
              : `Waiting for players (need at least 2)`}
          </button>
        ) : (
          <div className="text-center text-muted">
            <span className="spinner-grow spinner-grow-sm me-2" />
            Waiting for host to start the game...
          </div>
        )}
      </div>
    </div>
  );
}
