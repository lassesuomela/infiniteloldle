import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Victory from "./components/victory";
import ItemImg from "./components/itemImg";
import Config from "../../configs/config";
import {
  saveGamesPlayed,
  saveTries,
  saveFirstTries,
} from "../../utils/saveStats";
import { Reroll } from "../../utils/reroll";
import {
  customFilterOptionItems,
  HoverSelectStyles,
  SelectTheme,
} from "./styles/selectStyles";
import { useSelector } from "react-redux";
import {
  getOldItemGuessHistory,
  addToOldItemGuessHistory,
  clearOldItemHistory,
} from "../history";

export default function OldItemGame() {
  const [validGuesses, setValidGuesses] = useState([]);
  const [items, setItems] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setGuess] = useState();
  const [correctGuess, setCorrectGuess] = useState(false);
  const [sprite, setSprite] = useState("");

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

  useEffect(() => {
    if (sprite) {
      ApplyBlur(guesses.length);
    }
  }, [sprite, guesses]);

  const SetHistory = () => {
    const history = getOldItemGuessHistory().reverse();

    if (history.length > 0) {
      setItems(history);
      setGuesses(history.map((item) => item.name));
    }
  };

  const FetchItems = () => {
    axios
      .get(Config.url + "/oldItems")
      .then((response) => {
        if (response.data.status === "success") {
          const data = response.data.items;
          data.sort((a, b) => a.value.localeCompare(b.value));

          // Remove already guessed items from valid guesses
          const guessHistoryNames = new Set(
            getOldItemGuessHistory().map((item) => item.name)
          );

          const transformedData = data
            .filter((item) => !guessHistoryNames.has(item.value))
            .map((champion) => ({
              value: champion.value,
              label: champion.value,
            }));

          setValidGuesses(transformedData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ApplyBlur = (guessCount) => {
    const spriteImg = document.getElementById("spriteImg");
    if (!spriteImg) return;

    const initialBlur = 1.0;
    let blurVal = initialBlur;

    for (let i = 0; i < guessCount; i++) {
      blurVal -= blurVal * 0.4;
    }

    spriteImg.style.filter = `blur(${blurVal.toFixed(3)}em) ${
      isMonochrome ? "grayscale(1)" : ""
    }`;
  };

  const FetchItemImage = () => {
    axios
      .get(Config.url + "/oldItem", {
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
        Config.url + "/oldItem",
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

        setItems((items) => [{ id: itemId, name, isCorrect }, ...items]);

        addToOldItemGuessHistory({ id: itemId, name, isCorrect });

        const spriteImg = document.getElementById("spriteImg");

        if (isCorrect) {
          if (guesses.length === 0) {
            saveFirstTries();
          }
          saveGamesPlayed();
          setCorrectGuess(true);
          spriteImg.style.filter = "";
          clearOldItemHistory();
        } else {
          ApplyBlur(guesses.length + 1);
        }
      })
      .catch((error) => {
        console.log(error);
        setItems([]);
      });
  };

  const Restart = () => {
    setTimeout(() => ApplyBlur(0), 0);

    FetchItemImage();
    FetchItems();

    setGuesses([]);
    setItems([]);
    setGuess();
    setCorrectGuess(false);
    clearOldItemHistory();
  };

  const HandleReroll = () => {
    clearOldItemHistory();
    setGuesses([]);
    setItems([]);
    Reroll("oldItem");
  };

  return (
    <div className="container main pt-4 pb-5 mb-5">
      <h3 className="text-center pb-3">Which legacy item is this?</h3>

      <div
        className="container d-flex justify-content-center shadow"
        id="itemContainer"
      >
        <img
          src={`data:image/webp;base64,${sprite}`}
          style={{
            filter: `blur(1.0em) ${isMonochrome ? "grayscale(1)" : ""}`,
            transform: `${randomRotate ? "rotate(180deg)" : ""}`,
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
            options={validGuesses}
            onChange={(selectedOption) => setGuess(selectedOption.value)}
            isDisabled={correctGuess}
            placeholder="Type items name"
            filterOption={customFilterOptionItems}
            styles={HoverSelectStyles}
            theme={SelectTheme}
            formatOptionLabel={(data) => (
              <div className="select-option">
                <span>{data.label}</span>
              </div>
            )}
          />

          <div className="d-flex justify-content-evenly">
            {correctGuess ? (
              <button
                className="btn btn-outline-dark mb-3 mt-1 min-vw-25"
                onClick={Restart}
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
            key={item.id}
            itemId={item.id}
            name={item.name}
            isCorrect={item.isCorrect}
            path="/old_items/"
            isColorBlindMode={isColorBlindMode}
          />
        ))}
      </div>

      {correctGuess ? (
        <Victory
          id="victory"
          championKey={items[0]?.id}
          champion={currentGuess}
          tries={guesses.length}
          isOldItem={true}
        />
      ) : (
        ""
      )}
    </div>
  );
}
