import React from "react";

export default function VersusScoreboard({ scoreboard, onPlayAgain }) {
  const medalEmojis = ["🥇", "🥈", "🥉"];

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6">
        <div className="text-center mb-4">
          <span
            className="material-symbols-outlined text-warning"
            style={{ fontSize: "4rem" }}
          >
            emoji_events
          </span>
          <h2 className="text-white">Game Over!</h2>
          {scoreboard.length > 0 && (
            <p className="text-muted">
              🎉 <strong className="text-warning">{scoreboard[0].nickname}</strong> wins!
            </p>
          )}
        </div>

        <div className="card bg-dark border-secondary mb-4">
          <div className="card-body">
            <h6 className="text-muted mb-3">Final Scoreboard</h6>
            {scoreboard.length === 0 ? (
              <p className="text-muted text-center">No scores available</p>
            ) : (
              <ol className="list-unstyled mb-0">
                {scoreboard.map((entry, index) => (
                  <li
                    key={entry.id}
                    className={`d-flex justify-content-between align-items-center py-2 border-bottom border-secondary ${
                      index === 0 ? "text-warning" : "text-white"
                    }`}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: "1.5rem", minWidth: "2rem" }}>
                        {index < 3 ? medalEmojis[index] : `#${entry.rank}`}
                      </span>
                      <span className={index === 0 ? "fw-bold" : ""}>
                        {entry.nickname}
                      </span>
                    </div>
                    <span className="fw-bold">
                      {entry.score} pt{entry.score !== 1 ? "s" : ""}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <button className="btn btn-warning w-100 py-3" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}
