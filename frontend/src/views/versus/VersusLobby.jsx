import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";

export default function VersusLobby({
  room,
  myPlayerId,
  shareLink,
  onStartGame,
  onKickPlayer,
  onLeaveRoom,
}) {
  const isHost = room.hostId === myPlayerId;
  const canStart = isHost && room.players.length >= 2;

  const handleCopy = () => {
    toast.success("Room link copied to clipboard!");
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
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">Room Code</small>
                <h2 className="text-warning mb-0" style={{ letterSpacing: "0.3em" }}>
                  {room.code}
                </h2>
              </div>
              <CopyToClipboard text={shareLink} onCopy={handleCopy}>
                <button className="btn btn-outline-warning btn-sm">
                  <span className="material-symbols-outlined" style={{ fontSize: "1rem", verticalAlign: "middle" }}>
                    share
                  </span>{" "}
                  Share Link
                </button>
              </CopyToClipboard>
            </div>
          </div>
        </div>

        {/* Room settings */}
        <div className="card bg-dark border-secondary mb-4">
          <div className="card-body">
            <h6 className="text-muted mb-3">Room Settings</h6>
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
                      {mode.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
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
