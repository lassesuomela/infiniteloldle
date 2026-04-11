import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Select from "react-select";
import Config from "../../configs/config";
import { SelectStyles, SelectTheme } from "../../components/games/styles/selectStyles";
import PauseOverlay from "./PauseOverlay";

const MODE_LABELS = {
  champion: "Which champion is this?",
  splash: "Which champion's splash art is this?",
  item: "Which item is this?",
  legacy_item: "Which legacy item is this?",
};

export default function VersusGame({
  room,
  myPlayerId,
  roundInfo,
  pauseState,
  roundEndInfo,
  scores,
  lastCorrect,
  onSubmitGuess,
  onForceResume,
  onLeaveRoom,
}) {
  const [options, setOptions] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const isHost = room.hostId === myPlayerId;

  // Load options when mode changes
  useEffect(() => {
    if (!roundInfo) return;

    setCurrentGuess(null);
    setImageData(null);
    setItemId(null);

    if (roundInfo.mode === "champion" || roundInfo.mode === "splash") {
      fetchChampions();
    } else if (roundInfo.mode === "item") {
      fetchItems();
      // Item image is from static URL
      if (roundInfo.roundData?.itemId) {
        setItemId(roundInfo.roundData.itemId);
      }
    } else if (roundInfo.mode === "legacy_item") {
      fetchOldItems();
      if (roundInfo.roundData?.oldItemKey) {
        fetchOldItemImage(roundInfo.roundData.oldItemKey);
      }
    }

    if (roundInfo.mode === "splash" && roundInfo.roundData?.championKey && roundInfo.roundData?.skinKey) {
      fetchSplashImage(roundInfo.roundData.championKey, roundInfo.roundData.skinKey);
    }
  }, [roundInfo]);

  const fetchChampions = () => {
    axios
      .get(Config.url + "/champions")
      .then((res) => {
        if (res.data.status === "success") {
          setOptions(
            res.data.champions.map((c) => ({ value: c.value, label: c.value }))
          );
        }
      })
      .catch(console.error);
  };

  const fetchItems = () => {
    axios
      .get(Config.url + "/items")
      .then((res) => {
        if (res.data.status === "success") {
          setOptions(
            res.data.items.map((i) => ({ value: i.value, label: i.value }))
          );
        }
      })
      .catch(console.error);
  };

  const fetchOldItems = () => {
    axios
      .get(Config.url + "/oldItems")
      .then((res) => {
        if (res.data.status === "success") {
          setOptions(
            res.data.items.map((i) => ({ value: i.value, label: i.value }))
          );
        }
      })
      .catch(console.error);
  };

  const fetchSplashImage = (championKey, skinKey) => {
    setIsLoadingImage(true);
    axios
      .get(Config.url + `/versus/splash/${championKey}/${skinKey}`)
      .then((res) => {
        if (res.data.status === "success") {
          setImageData(res.data.result);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingImage(false));
  };

  const fetchOldItemImage = (key) => {
    setIsLoadingImage(true);
    axios
      .get(Config.url + `/versus/oldItem/${key}`)
      .then((res) => {
        if (res.data.status === "success") {
          setImageData(res.data.result);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingImage(false));
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!currentGuess) return;
      onSubmitGuess(currentGuess.value);
      setCurrentGuess(null);
    },
    [currentGuess, onSubmitGuess]
  );

  const currentScores = scores.length
    ? scores
    : room.players.map((p) => ({ id: p.id, nickname: p.nickname, score: p.score }));

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-10 col-lg-8">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="text-white mb-0">⚔️ Versus</h5>
            {roundInfo && (
              <small className="text-muted">
                Round {roundInfo.round} / {roundInfo.maxRounds}
              </small>
            )}
          </div>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={onLeaveRoom}
          >
            Leave
          </button>
        </div>

        <div className="row g-3">
          {/* Game area */}
          <div className="col-12 col-md-8">
            <div className="card bg-dark border-secondary h-100">
              <div className="card-body">
                {!roundInfo ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-warning" />
                    <p className="text-muted mt-3">Loading round...</p>
                  </div>
                ) : (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="text-white mb-0">
                        {MODE_LABELS[roundInfo.mode] || "Guess the answer"}
                      </h6>
                      <span className="badge bg-secondary text-capitalize">
                        {roundInfo.mode.replace("_", " ")}
                      </span>
                    </div>

                    {/* Round end message */}
                    {roundEndInfo && (
                      <div className="alert alert-success mb-3">
                        <strong>{roundEndInfo.winnerNickname}</strong> guessed
                        correctly! Answer:{" "}
                        <strong>{roundEndInfo.answer}</strong>
                        <div className="mt-1">
                          <small className="text-muted">Next round starting...</small>
                        </div>
                      </div>
                    )}

                    {/* Image display */}
                    {(roundInfo.mode === "splash" || roundInfo.mode === "legacy_item") && (
                      <div className="text-center mb-3">
                        {isLoadingImage ? (
                          <div className="spinner-border spinner-border-sm text-secondary" />
                        ) : imageData ? (
                          <img
                            src={`data:image/webp;base64,${imageData}`}
                            alt="Guess this"
                            className="img-fluid rounded"
                            style={{ maxHeight: "300px", objectFit: "contain" }}
                          />
                        ) : null}
                      </div>
                    )}

                    {roundInfo.mode === "item" && itemId && (
                      <div className="text-center mb-3">
                        <img
                          src={`/items/${itemId}.webp`}
                          alt="Item"
                          className="rounded"
                          style={{ width: "80px", height: "80px", objectFit: "contain" }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    {/* Guess form */}
                    {!roundEndInfo && (
                      <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                          <Select
                            options={options}
                            value={currentGuess}
                            onChange={setCurrentGuess}
                            styles={SelectStyles}
                            theme={SelectTheme}
                            placeholder="Type to search..."
                            isClearable
                            isSearchable
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn btn-warning w-100"
                          disabled={!currentGuess}
                        >
                          Submit Guess
                        </button>
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Scoreboard sidebar */}
          <div className="col-12 col-md-4">
            <div className="card bg-dark border-secondary">
              <div className="card-body">
                <h6 className="text-muted mb-3">Scores</h6>
                <ul className="list-unstyled mb-0">
                  {[...currentScores]
                    .sort((a, b) => b.score - a.score)
                    .map((p) => (
                      <li
                        key={p.id}
                        className="d-flex justify-content-between py-1 border-bottom border-secondary"
                      >
                        <span
                          className={
                            p.id === myPlayerId ? "text-warning" : "text-white"
                          }
                        >
                          {p.nickname}
                          {p.id === myPlayerId && (
                            <small className="text-muted ms-1">(you)</small>
                          )}
                        </span>
                        <span className="text-white fw-bold">{p.score}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pause overlay */}
      {pauseState && (
        <PauseOverlay
          pauseState={pauseState}
          isHost={isHost}
          onForceResume={onForceResume}
        />
      )}
    </div>
  );
}
