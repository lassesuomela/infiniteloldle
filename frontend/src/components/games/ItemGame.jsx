import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Victory from "./components/Victory";
import ItemImg from "./components/ItemImg";
import Config from "../../configs/config";
import {
  saveGamesPlayed,
  saveTries,
  saveFirstTries,
} from "../../utils/saveStats";
import { Reroll } from "../../utils/reroll";
import {
  SelectStyles,
  customFilterOptionItems,
  SelectTheme,
} from "./styles/selectStyles";
import { useSelector } from "react-redux";
import {
  addToItemGuessHistory,
  getItemGuessHistory,
  clearItemHistory,
} from "../history";

export default function ItemGame() {
  const [validGuesses, setValidGuesses] = useState([]);
  const [items, setItems] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setGuess] = useState(validGuesses[0]);
  const [correctGuess, setCorrectGuess] = useState(false);
  const [sprite, setSprite] = useState("");
  const [currentItemId, setCurrentItemId] = useState(null);
  const [guessCount, setGuessCount] = useState(0);

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
    FetchItems();
    FetchItemImage();
    SetHistory();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const SetHistory = () => {
    const history = getItemGuessHistory().reverse();

    if (history.length > 0) {
      setItems(history);
      setGuesses(history.map((item) => item.name));
    }
  };

  const FetchItems = () => {
    axios
      .get(Config.url + "/items")
      .then((response) => {
        if (response.data.status === "success") {
          const data = response.data.items;
          data.sort((a, b) => a.value.localeCompare(b.value));

          const guessHistoryNames = new Set(
            getItemGuessHistory().map((item) => item.name)
          );

          const transformedData = data
            .filter((item) => !guessHistoryNames.has(item.value))
            .map((item) => ({
              value: item.value,
              label: item.value,
            }));
          setValidGuesses(transformedData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const FetchItemImage = () => {
    axios
      .get(Config.url + "/item", {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.status === "success") {
          if (response.data.result) {
            setSprite(response.data.result);
          }
          if (response.data.itemId) {
            setCurrentItemId(response.data.itemId);
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
        Config.url + "/item",
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
        const itemId = response.data.itemId;
        const name = response.data.name;
        const currentGuessCount = response.data.guessCount;

        if (currentGuessCount !== undefined) {
          setGuessCount(currentGuessCount);
        }

        setItems((items) => [{ itemId, name, isCorrect }, ...items]);
        addToItemGuessHistory({ itemId, name, isCorrect });

        if (isCorrect) {
          if (guesses.length === 0) {
            saveFirstTries();
          }
          saveGamesPlayed();
          setCorrectGuess(true);
          clearItemHistory();
          // Fetch unblurred image on correct guess
          FetchItemImage();
        } else {
          // Fetch more-revealed (less blurred) image
          FetchItemImage();
        }
      })
      .catch((error) => {
        console.log(error);
        setItems([]);
      });
  };

  const Restart = () => {
    clearItemHistory();

    FetchItemImage();
    FetchItems();

    setGuesses([]);
    setItems([]);
    setGuess();
    setGuessCount(0);
    setCorrectGuess(false);
  };

  const HandleReroll = () => {
    clearItemHistory();
    setGuesses([]);
    setItems([]);
    Reroll("item");
  };

  return (
    <div className="container main pt-4 pb-5 mb-5">
      <h3 className="text-center pb-3">Which item is this?</h3>

      <div
        className="container d-flex justify-content-center shadow"
        id="spriteContainer"
      >
        <img
          src={sprite ? `data:image/webp;base64,${sprite}` : ""}
          style={{
            filter: isMonochrome ? "grayscale(1)" : "",
            transform: randomRotate ? "rotate(180deg)" : "",
          }}
          className="rounded p-4"
          id="spriteImg"
          alt="Item sprite."
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
            placeholder="Type item name"
            filterOption={customFilterOptionItems}
            styles={SelectStyles}
            theme={SelectTheme}
            formatOptionLabel={(data) => (
              <div className="select-option">
                <span>{data.label}</span>
              </div>
            )}
          />

          <div className="d-flex justify-content-evenly">
            {!correctGuess && (
              <button className="btn btn-dark mb-3 mt-1 min-vw-25">
                Guess
              </button>
            )}
            {!correctGuess && guesses.length >= 10 ? (
              <button
                className="btn btn-outline-dark mb-3 mt-1 min-vw-25"
                onClick={HandleReroll}
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
        {items.map((item) => (
          <ItemImg
            key={item.itemId}
            itemId={item.itemId}
            name={item.name}
            isCorrect={item.isCorrect}
            isColorBlindMode={isColorBlindMode}
            path="/items/"
          />
        ))}
      </div>

      {correctGuess ? (
        <Victory
          id="victory"
          championKey={currentItemId || items[0]?.itemId}
          champion={items[0]?.name}
          tries={guessCount}
          isItem={true}
        />
      ) : (
        ""
      )}
    </div>
  );
}
