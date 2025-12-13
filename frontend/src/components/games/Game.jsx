import React, { useState, useEffect } from "react";
import axios from "axios";
import Titles from "./components/GameTitle";
import ChampionDetails from "./components/ChampionDetails";
import Select from "react-select";
import Victory from "./components/Victory";
import {
  saveGamesPlayed,
  saveTries,
  saveFirstTries,
} from "../../utils/saveStats";
import Config from "../../configs/config";
import { Reroll } from "../../utils/reroll";
import { Helmet } from "react-helmet";
import LazyLoad from "react-lazy-load";
import { useSelector } from "react-redux";

import {
  SelectStyles,
  customFilterOptionChamps,
  SelectTheme,
} from "./styles/selectStyles";

export default function Game() {
  const [validGuesses, setValidGuesses] = useState([]);
  const [champions, setChampions] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setGuess] = useState(validGuesses[0]);
  const [correctGuess, setCorrectGuess] = useState(false);
  const [title, setTitle] = useState("");
  const [guessCount, setGuessCount] = useState(0);
  const [abilityClueData, setAbilityClueData] = useState(null);
  const [splashClueData, setSplashClueData] = useState(null);
  const [showAbilityClue, setShowAbilityClue] = useState(false);
  const [showSplashClue, setShowSplashClue] = useState(false);

  const isColorBlindMode = useSelector(
    (state) => state.colorBlindReducer.isColorBlindMode
  );

  const hideResource = useSelector(
    (state) => state.hideResourceReducer.hideResource
  );

  useEffect(() => {
    FetchChampions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const FetchChampions = () => {
    axios
      .get(Config.url + "/champions")
      .then((response) => {
        if (response.data.status === "success") {
          const data = response.data.champions;
          data.sort((a, b) => a.value.localeCompare(b.value));
          const transformedData = data.map((champion) => ({
            value: champion.value,
            label: champion.value,
            image: champion.image,
          }));
          setValidGuesses(transformedData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const Guess = (e) => {
    e.preventDefault();

    if (!currentGuess) {
      return;
    }

    if (guesses.indexOf(currentGuess) !== -1) {
      return;
    }

    setValidGuesses(validGuesses.filter((item) => item.label !== currentGuess));
    setGuesses((guesses) => [...guesses, currentGuess]);

    axios
      .post(
        Config.url + "/guess",
        { guess: currentGuess },
        {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        }
      )
      .then((response) => {
        if (response.data.status !== "success") {
          return;
        }
        saveTries(1);

        const correct = response.data.correctGuess;
        const data = response.data.properties;
        const currentGuessCount = response.data.guessCount;

        if (currentGuessCount !== undefined) {
          setGuessCount(currentGuessCount);
        }

        setChampions((champions) => [data, ...champions]);

        if (correct) {
          if (guesses.length === 0) {
            saveFirstTries();
          }
          saveGamesPlayed();
          setCorrectGuess(true);
          setTitle(response.data.title);
        }
      })
      .catch((error) => {
        console.log(error);
        setChampions([]);
      });
  };

  const Restart = () => {
    FetchChampions();

    setGuesses([]);
    setChampions([]);
    setGuess();
    setCorrectGuess(false);
    setGuessCount(0);
    setAbilityClueData(null);
    setSplashClueData(null);
    setShowAbilityClue(false);
    setShowSplashClue(false);
  };

  const FetchAbilityClue = () => {
    axios
      .get(Config.url + "/clue/ability", {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.status === "success" && response.data.clue) {
          setAbilityClueData(response.data.clue);
        }
      })
      .catch((error) => {
        console.log("Error fetching ability clue:", error);
      });
  };

  const FetchSplashClue = () => {
    axios
      .get(Config.url + "/clue/champion", {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.status === "success" && response.data.clue) {
          setSplashClueData(response.data.clue);
        }
      })
      .catch((error) => {
        console.log("Error fetching splash clue:", error);
      });
  };

  const toggleAbilityClue = () => {
    if (!abilityClueData) {
      FetchAbilityClue();
    }
    setShowAbilityClue(!showAbilityClue);
  };

  const toggleSplashClue = () => {
    if (!splashClueData) {
      FetchSplashClue();
    }
    setShowSplashClue(!showSplashClue);
  };

  return (
    <div className="container main pt-4 pb-5 mb-5">
      <Helmet>
        <title>
          Infinite LoLdle - Ultimate LoL quiz - Champion guessing game
        </title>
        <meta
          name="description"
          content="The ultimate quiz game for League of Legends enthusiasts. Guess League of Legends champions infinitely."
        />
      </Helmet>

      <h3 className="text-center pb-3">Start guessing your champion</h3>

      <div className="d-flex justify-content-center mt-4 mb-3">
        <form
          className="form-control row g-3 mb-4"
          onSubmit={Guess}
          id="guess-form"
        >
          <Select
            className="select"
            options={validGuesses}
            onChange={(selectedOption) => setGuess(selectedOption.value)}
            isDisabled={correctGuess}
            styles={SelectStyles}
            placeholder="Type champions name"
            filterOption={customFilterOptionChamps}
            formatOptionLabel={(data) => (
              <div className="select-option">
                <LazyLoad offset={200}>
                  <img
                    src={"/40_40/champions/" + data.image + ".webp"}
                    alt="Champion icon"
                  />
                </LazyLoad>
                <span>{data.label}</span>
              </div>
            )}
            theme={SelectTheme}
          />

          <div className="d-flex justify-content-evenly">
            {correctGuess ? (
              <>
                <button
                  className="btn btn-outline-dark mb-3 mt-1 min-vw-25"
                  onClick={Restart}
                >
                  Next
                </button>
              </>
            ) : (
              <button className="btn btn-dark mb-3 mt-1 min-vw-25">
                Guess
              </button>
            )}
            {!correctGuess && guesses.length >= 10 ? (
              <button
                className="btn btn-outline-dark mb-3 mt-1 min-vw-25"
                onClick={() => Reroll("champion")}
              >
                Reroll
              </button>
            ) : (
              ""
            )}
          </div>
        </form>
      </div>

      {/* Clue Box - Show when guessCount > 0 */}
      {!correctGuess && guessCount > 0 && (
        <div className="d-flex justify-content-center mb-4">
          <div className="card" style={{ maxWidth: "600px", width: "100%" }}>
            <div className="card-body text-center">
              <h5 className="card-title">💡 Clues</h5>
              
              {/* Buttons for clues */}
              <div className="d-flex justify-content-center gap-2 mb-3">
                <button
                  className={`btn ${guessCount >= 5 ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={toggleAbilityClue}
                  disabled={guessCount < 5}
                >
                  {guessCount >= 5 
                    ? (showAbilityClue ? "Hide Ability Clue" : "Show Ability Clue")
                    : `Ability Clue (${5 - guessCount} more)`}
                </button>
                <button
                  className={`btn ${guessCount >= 10 ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={toggleSplashClue}
                  disabled={guessCount < 10}
                >
                  {guessCount >= 10 
                    ? (showSplashClue ? "Hide Splash Clue" : "Show Splash Clue")
                    : `Splash Clue (${10 - guessCount} more)`}
                </button>
              </div>

              {/* Display clues */}
              {showAbilityClue && abilityClueData && (
                <div className="mt-3 mb-3">
                  <p className="text-muted mb-2">Ability Clue:</p>
                  <img
                    src={`data:image/webp;base64,${abilityClueData.data}`}
                    alt="Ability clue"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      border: "2px solid #dee2e6",
                    }}
                  />
                </div>
              )}

              {showSplashClue && splashClueData && (
                <div className="mt-3">
                  <p className="text-muted mb-2">Splash Art Clue:</p>
                  <img
                    src={`data:image/webp;base64,${splashClueData.data}`}
                    alt="Splash art clue"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      border: "2px solid #dee2e6",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="scroll-container">
        {champions.length > 0 ? <Titles /> : ""}

        <div id="champions">
          {champions.map((champ) => (
            <ChampionDetails
              key={champ[0].championKey}
              championKey={champ[0].championKey}
              gender={champ[0].gender}
              genre={champ[0].genre}
              resource={champ[0].resource}
              rangeTypes={champ[0].rangeType}
              positions={champ[0].position}
              releaseYear={champ[0].releaseYear}
              regions={champ[0].region}
              damageType={champ[0].damageType}
              similarites={champ[1]}
              isColorBlindMode={isColorBlindMode}
              hideResource={hideResource}
              name={champ[0].guessedChampion}
            />
          ))}
        </div>
      </div>

      {correctGuess ? (
        <Victory
          id="victory"
          championKey={champions[0][0].championKey}
          champion={champions[0][0].guessedChampion}
          tries={guesses.length}
          title={title}
        />
      ) : (
        ""
      )}
    </div>
  );
}
