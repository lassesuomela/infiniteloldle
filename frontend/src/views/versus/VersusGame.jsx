import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import Config from "../../configs/config";
import {
  SelectStyles,
  SelectTheme,
} from "../../components/games/styles/selectStyles";
import PauseOverlay from "./PauseOverlay";
import ChampionDetails from "../../components/games/components/ChampionDetails";
import GameTitle from "../../components/games/components/GameTitle";

const MODE_LABELS = {
  champion: "Which champion is this?",
  splash: "Which champion's splash art is this?",
  item: "Which item is this?",
  legacy_item: "Which legacy item is this?",
  ability: "Which champion's ability is this?",
};

// Apply progressive blur: starts at 1em, reduces 40% per wrong guess
function getBlurValue(wrongGuesses) {
  let blur = 1.0;
  for (let i = 0; i < wrongGuesses; i++) {
    blur -= blur * 0.4;
  }
  return blur;
}

export default function VersusGame({
  room,
  myPlayerId,
  roundInfo,
  pauseState,
  roundEndInfo,
  scores,
  lastCorrect,
  guessResult,
  onSubmitGuess,
  onForceResume,
  onLeaveRoom,
}) {
  const [allOptions, setAllOptions] = useState([]);
  const [myGuesses, setMyGuesses] = useState([]); // champion names already guessed this round
  const [myWrongGuesses, setMyWrongGuesses] = useState(0); // count for blur
  const [myComparisons, setMyComparisons] = useState([]); // comparison rows for champion mode
  const [currentGuess, setCurrentGuess] = useState(null);
  const prevRoundRef = useRef(null);

  const isHost = room.hostId === myPlayerId;

  // Reset per-round state when round changes
  useEffect(() => {
    if (!roundInfo) return;
    if (prevRoundRef.current !== roundInfo.round) {
      prevRoundRef.current = roundInfo.round;
      setMyGuesses([]);
      setMyWrongGuesses(0);
      setMyComparisons([]);
      setCurrentGuess(null);
    }
  }, [roundInfo]);

  // Load options when mode changes
  useEffect(() => {
    if (!roundInfo) return;
    if (
      roundInfo.mode === "champion" ||
      roundInfo.mode === "splash" ||
      roundInfo.mode === "ability"
    ) {
      fetchChampions();
    } else if (roundInfo.mode === "item") {
      fetchItems();
    } else if (roundInfo.mode === "legacy_item") {
      fetchOldItems();
    }
  }, [roundInfo?.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // When guessResult arrives, record the wrong guess
  useEffect(() => {
    if (!guessResult) return;
    if (guessResult.champData) {
      const name = guessResult.champData.guessedChampion;
      setMyGuesses((prev) => [...prev, name]);
      setMyWrongGuesses((prev) => prev + 1);
      setMyComparisons((prev) => [guessResult, ...prev]);
    } else {
      setMyWrongGuesses((prev) => prev + 1);
    }
  }, [guessResult]);

  const fetchChampions = () => {
    axios
      .get(Config.url + "/champions")
      .then((res) => {
        if (res.data.status === "success") {
          setAllOptions(
            res.data.champions.map((c) => ({ value: c.value, label: c.value })),
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
          setAllOptions(
            res.data.items.map((i) => ({ value: i.value, label: i.value })),
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
          setAllOptions(
            res.data.items.map((i) => ({ value: i.value, label: i.value })),
          );
        }
      })
      .catch(console.error);
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!currentGuess) return;
      onSubmitGuess(currentGuess.value);
      setCurrentGuess(null);
    },
    [currentGuess, onSubmitGuess],
  );

  const currentScores = scores.length
    ? scores
    : room.players.map((p) => ({
        id: p.id,
        nickname: p.nickname,
        score: p.score,
      }));

  // Available options = all - already guessed by me this round
  const guessedSet = new Set(myGuesses);
  const availableOptions = allOptions.filter((o) => !guessedSet.has(o.value));

  // Image display for image-based modes
  const imageBase64 = roundInfo?.imageBase64 || null;
  const itemId = roundInfo?.roundData?.itemId || null;
  const blurValue = getBlurValue(myWrongGuesses);
  const hasImage = imageBase64 || (roundInfo?.mode === "item" && itemId);

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
                    </div>

                    {/* Round end message */}
                    {roundEndInfo && (
                      <div className="alert alert-success mb-3">
                        <strong>{roundEndInfo.winnerNickname}</strong> guessed
                        correctly! Answer:{" "}
                        <strong>{roundEndInfo.answer}</strong>
                        <div className="mt-1">
                          <small className="text-muted">
                            Next round starting...
                          </small>
                        </div>
                      </div>
                    )}

                    {/* Image display for image-based modes */}
                    {hasImage && (
                      <div className="text-center mb-3">
                        {imageBase64 ? (
                          <img
                            src={`data:image/webp;base64,${imageBase64}`}
                            alt="Guess this"
                            className="img-fluid rounded p-2"
                            style={{
                              maxHeight: "300px",
                              objectFit: "contain",
                            }}
                          />
                        ) : itemId ? (
                          <img
                            src={`/items/${itemId}.webp`}
                            alt="Item"
                            className="rounded"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "contain",
                              filter: roundEndInfo
                                ? "none"
                                : `blur(${blurValue.toFixed(3)}em)`,
                              transition: "filter 0.4s ease",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : null}
                        {!roundEndInfo && (
                          <div className="mt-1">
                            <small className="text-muted">
                              Guess to reveal the image
                            </small>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Guess form */}
                    {!roundEndInfo && (
                      <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                          <Select
                            options={availableOptions}
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

                    {/* Champion mode comparison grid */}
                    {roundInfo.mode === "champion" &&
                      myComparisons.length > 0 && (
                        <div className="mt-3">
                          <div className="scroll-container">
                            <GameTitle />
                            <div id="versus-champions">
                              {myComparisons.map((r, idx) => (
                                <ChampionDetails
                                  key={`${r.champData.championKey}-${idx}`}
                                  championKey={r.champData.championKey}
                                  gender={r.champData.gender}
                                  genre={r.champData.genre}
                                  resource={r.champData.resource}
                                  rangeTypes={r.champData.rangeType}
                                  positions={r.champData.position}
                                  releaseYear={r.champData.releaseYear}
                                  regions={r.champData.region}
                                  damageType={r.champData.damageType}
                                  similarites={r.similarities}
                                  isColorBlindMode={false}
                                  hideResource={false}
                                  name={r.champData.guessedChampion}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
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
                        className="d-flex align-items-center justify-content-between py-2 border-bottom border-secondary"
                      >
                        {/* Left side */}
                        <div className="d-flex align-items-center gap-2 text-truncate">
                          <span
                            className={
                              p.id === myPlayerId
                                ? "text-warning text-truncate"
                                : "text-white text-truncate"
                            }
                            style={{ maxWidth: "180px" }}
                          >
                            {p.nickname}
                          </span>
                        </div>

                        {/* Right side (score) */}
                        <span className="text-white fw-bold ms-3 flex-shrink-0">
                          {p.score}
                        </span>
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
