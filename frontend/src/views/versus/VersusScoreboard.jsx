import React from "react";

export default function VersusScoreboard({ scoreboard, room, myPlayerId, onPlayAgain }) {
  const medalEmojis = ["🥇", "🥈", "🥉"];
  const isHost = room && room.hostId === myPlayerId;

  const myEntry = scoreboard.find((e) => e.id === myPlayerId);
  const myRank = scoreboard.findIndex((e) => e.id === myPlayerId);
  const isVictory = myRank === 0;
  const winner = scoreboard[0];

  const headerStyle = {
    backgroundImage: isVictory
      ? "linear-gradient(#408140, #5cb85c)"
      : "linear-gradient(#7a1a1a, #c0392b)",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6">
        <div className="text-center" style={headerStyle}>
          <h2 className="text-white fw-bold mb-2">
            {isVictory ? "Victory!" : "Defeat"}
          </h2>
          {myEntry && (
            <p className="mb-1" style={{ color: "rgba(255,255,255,0.9)" }}>
              {myEntry.nickname}
            </p>
          )}
          {winner && !isVictory && (
            <p className="mb-0" style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9em" }}>
              🏆 <strong>{winner.nickname}</strong> wins!
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
                      {entry.id === myPlayerId && (
                        <span className="badge bg-info text-dark">You</span>
                      )}
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

        {isHost ? (
          <button className="btn btn-warning w-100 py-3" onClick={onPlayAgain}>
            Play Again (return to lobby)
          </button>
        ) : (
          <div className="text-center text-muted py-3">
            <span className="spinner-grow spinner-grow-sm me-2" />
            Waiting for host to start a new game...
          </div>
        )}
      </div>
    </div>
  );
}
