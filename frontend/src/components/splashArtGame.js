import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Victory from "./victory";
import ChampionImg from "./championImg";
import Config from "../configs/config";
import { saveGamesPlayed, saveTries, saveFirstTries } from "./saveStats";
import { Reroll } from "./reroll";
import LazyLoad from "react-lazy-load";
import { SelectStyles, customFilterOption } from "./selectStyles";
import { useSelector } from "react-redux";

export default function Game() {
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
    FetchSplashArt();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const FetchChampions = () => {
    axios
      .get(Config.url + "/champions")
      .then((response) => {
        if (response.data.status === "success") {
          const data = response.data.champions;

          setValidGuesses(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const FetchSplashArt = () => {
    axios
      .get(Config.url + "/splash", {
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
        Config.url + "/splash",
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

        setChampions((champions) => [[key, isCorrect], ...champions]);

        const spriteImg = document.getElementById("spriteImg");

        if (isCorrect) {
          if (guesses.length === 0) {
            saveFirstTries();
          }
          saveGamesPlayed();
          setCorrectGuess(true);
          setTitle(response.data.title);

          spriteImg.style.filter = "";
        } else {
          let blurVal = parseFloat(spriteImg.style.filter.substring(5, 8));

          blurVal -= blurVal * 0.4;

          spriteImg.style.filter = `blur(${blurVal.toString()}em) ${
            isMonochrome ? "grayscale(1)" : ""
          }`;
        }
      })
      .catch((error) => {
        console.log(error);
        setChampions([]);
      });
  };

  const Restart = () => {
    const spriteImg = document.getElementById("spriteImg");
    spriteImg.style.filter = `blur(1.0em) ${
      isMonochrome ? "grayscale(1)" : ""
    }`;
    FetchSplashArt();
    FetchChampions();

    setGuesses([]);
    setChampions([]);
    setGuess();
    setCorrectGuess(false);
  };

  return (
    <div className="container main pt-4 pb-5 mb-5">
      <h3 className="text-center pb-3">Whose splash art is this?</h3>

      <div
        className="container d-flex justify-content-center shadow"
        id="spriteContainer"
      >
        <img
          src={`data:image/webp;base64,${sprite}`}
          style={{
            filter: `blur(1.0em) ${isMonochrome ? "grayscale(1)" : ""}`,
            transform: `${randomRotate ? "rotate(180deg)" : ""}`,
          }}
          className="rounded p-4"
          id="spriteImg"
          alt="Champion splash art."
          draggable="false"
        />
      </div>

      <div className="d-flex justify-content-center mt-4 pt-3 mb-3">
        <form
          className="form-control row g-3 mb-2"
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
            filterOption={customFilterOption}
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
          />

          <div className="d-flex justify-content-evenly">
            <button className="btn btn-dark mb-3 mt-1 min-vw-25">Guess</button>
            {correctGuess ? (
              <button
                className="btn btn-light mb-3 mt-1 min-vw-25"
                onClick={Restart}
              >
                Reset
              </button>
            ) : (
              ""
            )}
            {!correctGuess && guesses.length >= 10 ? (
              <button
                className="btn btn-dark mb-3 mt-1 min-vw-25"
                onClick={() => Reroll("splash")}
              >
                Reroll
              </button>
            ) : (
              ""
            )}
          </div>
        </form>
      </div>

      <div id="championsImgs" className="container">
        {champions.map((champ) => (
          <ChampionImg
            key={champ[0].key}
            championKey={champ[0]}
            isCorrect={champ[1]}
            isColorBlindMode={isColorBlindMode}
          />
        ))}
      </div>

      {correctGuess ? (
        <Victory
          id="victory"
          championKey={champions[0][0]}
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
