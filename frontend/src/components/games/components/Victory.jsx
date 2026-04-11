import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Config from "../../../configs/config";

const COUNTDOWN_SECONDS = 10;

export default function Victory(props) {
  const [isShown, setIsShown] = useState(true);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [nickname, setNickname] = useState("");

  const isVictory = props.isVictory !== false; // default true for backward-compat

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(Config.url + "/user", {
          headers: { authorization: "Bearer " + token },
        })
        .then((response) => {
          if (response.data.status === "success" && response.data.player) {
            setNickname(response.data.player.nickname || "");
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!isShown) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsShown(false);
          if (props.onNextGame) props.onNextGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isShown]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Modal
        show={isShown}
        onHide={() => setIsShown(false)}
        size="lg"
        centered
        className="transparentModal"
      >
        <Modal.Body>
          <div className="container victory">
            <div
              className="card w-100 w-md-75 text-center"
              style={{
                backgroundImage: isVictory
                  ? "linear-gradient(#408140, #5cb85c)"
                  : "linear-gradient(#7a1a1a, #c0392b)",
              }}
            >
              <Modal.Header closeButton></Modal.Header>

              <div className="pb-5">
                <h1 className="pb-3" style={{ color: "#fff" }}>
                  {isVictory ? "Victory!" : "Defeat"}
                </h1>

                {nickname ? (
                  <p className="mb-2" style={{ color: "#fff", fontSize: "1.1em" }}>
                    {nickname}
                  </p>
                ) : null}

                <img
                  src={
                    (props.isItem
                      ? "/items/"
                      : props.isOldItem
                      ? "/old_items/"
                      : "/champions/") +
                    props.championKey +
                    ".webp"
                  }
                  alt={props.champion}
                  className={
                    "pb-3 " + (props.isItem || props.isOldItem ? "itemImg" : "")
                  }
                />

                <h2 style={{ color: "#fff" }}>{props.champion}</h2>

                <p className="mb-1 smaller" style={{ color: "#fff" }}>
                  {props.title}
                </p>

                {props.tries > 1 ? (
                  <p className="smaller" style={{ color: "#fff" }}>
                    It took {props.tries} tries
                  </p>
                ) : (
                  <p className="smaller" style={{ color: "#fff" }}>
                    First try!
                  </p>
                )}

                <p className="smaller mt-2" style={{ color: "rgba(255,255,255,0.85)" }}>
                  Next game in {countdown}s…
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
