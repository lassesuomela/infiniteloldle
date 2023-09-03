import React, { useState, useEffect } from "react";
import axios from "axios";
import Titles from "./gameTitle";
import ChampionDetails from "./championDetails";
import Select from "react-select";
import Victory from "./victory";
import { saveGamesPlayed, saveTries, saveFirstTries } from "./saveStats";
import Config from "../configs/config";
import { Reroll } from "./reroll";
import { Helmet } from "react-helmet";
import LazyLoad from "react-lazy-load";

export default function Game() {
  const [validGuesses, setValidGuesses] = useState([]);
  const [champions, setChampions] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setGuess] = useState(validGuesses[0]);
  const [correctGuess, setCorrectGuess] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    FetchChampions();
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
  };

  const SelectStyles = {
    singleValue: (provided) => ({
      ...provided,
      marginTop: "0.4em",
      marginBottom: "0.4em",
    }),
  };

  const customFilterOption = (option, inputValue) => {
    return option.label.toLowerCase().startsWith(inputValue.toLowerCase());
  };

  return (
    <div className="container main pt-4 pb-5 mb-5">
      <Helmet>
        <title>
          Infiniteloldle - Ultimate LoL quiz - Champion guessing game
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
            filterOption={customFilterOption}
            formatOptionLabel={(data) => (
              <div className="select-option">
                <LazyLoad offset={200}>
                  <img
                    src={"/champions/" + data.image + ".webp"}
                    alt="Champion icon"
                  />
                </LazyLoad>
                <span>{data.label}</span>
              </div>
            )}
          />

          <div className="d-flex justify-content-evenly">
            {correctGuess ? (
              <>
                <button
                  className="btn btn-outline-dark mb-3 mt-1 min-vw-25"
                  onClick={Restart}
                >
                  Reset
                </button>
              </>
            ) : (
              <button className="btn btn-dark mb-3 mt-1 min-vw-25">
                Guess
              </button>
            )}
            {!correctGuess && guesses.length >= 10 ? (
              <button
                className="btn btn-dark mb-3 mt-1 min-vw-25"
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
          />
        ))}
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
