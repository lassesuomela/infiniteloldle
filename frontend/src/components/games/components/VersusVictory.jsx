import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";

const COUNTDOWN_SECONDS = 10;

/**
 * Victory/Defeat modal for versus game mode.
 * Shows the result, winner's nickname, and a countdown before auto-closing.
 */
export default function VersusVictory({ isVictory, nickname, onNextGame }) {
  const [isShown, setIsShown] = useState(true);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (!isShown) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsShown(false);
          if (onNextGame) onNextGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isShown]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal
      show={isShown}
      onHide={() => setIsShown(false)}
      size="lg"
      centered
      className="transparentModal"
    >
      <Modal.Body>
        <div className="container d-flex justify-content-center">
          <div
            className="card w-100 w-md-75 text-center"
            style={{
              backgroundImage: isVictory
                ? "linear-gradient(#408140, #5cb85c)"
                : "linear-gradient(#7a1a1a, #c0392b)",
              border: "none",
              color: "#fff",
            }}
          >
            <Modal.Header closeButton className="btn-close-white" style={{ border: "none" }} />

            <div className="pb-5 pt-2">
              <h1 className="pb-2" style={{ color: "#fff" }}>
                {isVictory ? "Victory!" : "Defeat"}
              </h1>

              {nickname ? (
                <p className="mb-3" style={{ color: "#fff", fontSize: "1.2em" }}>
                  {nickname}
                </p>
              ) : null}

              <p className="smaller mt-2" style={{ color: "rgba(255,255,255,0.85)" }}>
                Next game in {countdown}s…
              </p>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
