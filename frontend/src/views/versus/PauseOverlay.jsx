import React, { useState, useEffect } from "react";

export default function PauseOverlay({ pauseState, isHost, onForceResume }) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!pauseState?.pausedAt || !pauseState?.duration) return;

    let interval;

    const updateCountdown = () => {
      setSecondsLeft((prev) => {
        let remaining;

        if (!prev) {
          remaining = Math.ceil(pauseState.duration / 1000);
        } else {
          remaining = Math.max(0, prev - 1);
        }

        if (remaining === 0) {
          clearInterval(interval);
        }

        return remaining;
      });
    };

    updateCountdown();
    interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [pauseState?.pausedAt, pauseState?.duration]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div className="card bg-dark border-warning text-center p-5">
        <span
          className="material-symbols-outlined text-warning mb-3"
          style={{ fontSize: "3rem" }}
        >
          pause_circle
        </span>

        <h4 className="text-white">Game Paused</h4>
        <p className="text-muted">A player disconnected. Resuming in...</p>

        <div
          className="display-4 text-warning fw-bold mb-3"
          style={{ fontFamily: "monospace" }}
        >
          {secondsLeft}s
        </div>

        {isHost && (
          <button className="btn btn-warning mt-2" onClick={onForceResume}>
            Force Resume
          </button>
        )}
      </div>
    </div>
  );
}
