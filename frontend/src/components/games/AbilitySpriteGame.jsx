import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Select from "react-select";
import Victory from "./components/Victory";
import ChampionImg from "./components/ChampionImg";
import Config from "../../configs/config";
import {
  saveGamesPlayed,
  saveTries,
  saveFirstTries,
} from "../../utils/saveStats";
import { Reroll } from "../../utils/reroll";
import LazyLoad from "react-lazy-load";
import {
  SelectStyles,
  customFilterOptionChamps,
  SelectTheme,
} from "./styles/selectStyles";
import { useSelector } from "react-redux";
import {
  clearAbilityHistory,
  getAbilityGuessHistory,
  addToAbilityGuessHistory,
} from "../history";

export default function AbilityGuessingGame() {
  const [validGuesses, setValidGuesses] = useState([]);
  const [champions, setChampions] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setGuess] = useState(validGuesses[0]);
  const [correctGuess, setCorrectGuess] = useState(false);
  const [sprite, setSprite] = useState("");
  const [title, setTitle] = useState("");

  const isColorBlindMode = useSelector(
    (state) => state.colorBlindReducer.isColorBlindMode
  );

  const isMonochrome = useSelector(
    (state) => state.monochromeReducer.isMonochrome
  );

  const randomRotate = useSelector(
    (state) => state.randomRotateReducer.randomRotate
  );

  useEffect(() => {
    FetchChampions();
    fetchAbilityImage();
    setHistory();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setHistory = () => {
    const history = getAbilityGuessHistory().reverse();

    if (history.length > 0) {
      setChampions(history);
      setGuesses(history.map((item) => item.name));
    }
  };

  const FetchChampions = () => {
    axios
      .get(Config.url + "/champions")
      .then((response) => {
        if (response.data.status === "success") {
          const data = response.data.champions;
          data.sort((a, b) => a.value.localeCompare(b.value));

          const guessChampionKeys = new Set(
            getAbilityGuessHistory().map((champ) => champ.key)
          );

          const transformedData = data
            .filter((champion) => !guessChampionKeys.has(champion.value))
            .map((champion) => ({
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

  const fetchAbilityImage = () => {
    axios
      .get(Config.url + "/ability", {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.status === "success") {
          if (response.data.result) {
            setSprite(response.data.result);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const guess = (e) => {
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
        Config.url + "/ability",
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

        const isCorrect = response.data.correctGuess;
        const key = response.data.championKey;
        const name = response.data.name;

        console.log(response.data);
        setChampions((champions) => [{ key, isCorrect, name }, ...champions]);
        addToAbilityGuessHistory({ key, isCorrect, name });

        const abilityImgEl = document.getElementById("abilityImg");

        if (isCorrect) {
          if (guesses.length === 0) {
            saveFirstTries();
          }
          saveGamesPlayed();
          setCorrectGuess(true);
          clearAbilityHistory();
          setTitle(response.data.title);

          if (abilityImgEl) abilityImgEl.style.filter = "";
        } else {
          applyBlur(guesses.length + 1);
        }
      })
      .catch((error) => {
        console.log(error);
        setChampions([]);
      });
  };

  const applyBlur = useCallback(
    (guessCount) => {
      const abilityImgEl = document.getElementById("abilityImg");
      if (!abilityImgEl) return;

      const initialBlur = 1.0;
      let blurVal = initialBlur;

      for (let i = 0; i < guessCount; i++) {
        blurVal -= blurVal * 0.4;
      }

      abilityImgEl.style.filter = `blur(${blurVal.toFixed(3)}em) ${
        isMonochrome ? "grayscale(1)" : ""
      }`;
    },
    [isMonochrome]
  );

  useEffect(() => {
    if (sprite) {
      applyBlur(guesses.length);
    }
  }, [sprite, guesses, isMonochrome, applyBlur]);

  const restart = () => {
    setTimeout(() => applyBlur(0), 0);

    fetchAbilityImage();
    FetchChampions();

    setGuesses([]);
    setChampions([]);
    setGuess();
    setCorrectGuess(false);
  };

  const handleReroll = () => {
    clearAbilityHistory();
    setGuesses([]);
    setChampions([]);
    Reroll("ability");
  };

  return (
    <div className="container main pt-4 pb-5 mb-5">
      <h3 className="text-center pb-3">Whose ability is this?</h3>

      <div
        className="container d-flex justify-content-center shadow"
        id="abilityContainer"
      >
        <img
          src={`data:image/webp;base64,${sprite}`}
          style={{
            filter: `${isMonochrome ? "grayscale(1)" : ""}`,
            transform: `${randomRotate ? "rotate(180deg)" : ""}`,
          }}
          className="rounded p-4"
          id="abilityImg"
          alt="Ability image."
          draggable="false"
        />
      </div>

      <div className="d-flex justify-content-center mt-4 pt-3 mb-3">
        <form
          className="form-control row g-3 mb-2"
          onSubmit={guess}
          id="guess-form"
        >
          <Select
            className="select"
            options={validGuesses}
            onChange={(selectedOption) => setGuess(selectedOption.value)}
            isDisabled={correctGuess}
            styles={SelectStyles}
            placeholder="Type champion name"
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
              <button
                className="btn btn-outline-dark mb-3 mt-1 min-vw-25"
                onClick={restart}
              >
                Next
              </button>
            ) : (
              <button className="btn btn-dark mb-3 mt-1 min-vw-25">
                Guess
              </button>
            )}
            {!correctGuess && guesses.length >= 10 ? (
              <button
                className="btn btn-outline-dark mb-3 mt-1 min-vw-25"
                onClick={handleReroll}
              >
                Reroll
              </button>
            ) : (
              ""
            )}
          </div>
        </form>
      </div>

      <div id="abilitiesImgs" className="container">
        {champions.map((champ) => (
          <ChampionImg
            key={champ.key}
            championKey={champ.key}
            isCorrect={champ.isCorrect}
            isColorBlindMode={isColorBlindMode}
            name={champ.name}
          />
        ))}
      </div>

      {correctGuess ? (
        <Victory
          id="victory"
          championKey={champions[0].key}
          champion={currentGuess}
          tries={guesses.length}
          title={title}
        />
      ) : (
        ""
      )}
    </div>
  );
}
