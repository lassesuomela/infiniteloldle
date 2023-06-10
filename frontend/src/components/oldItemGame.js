import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import NewUser from "./newUser";
import Victory from "./victory";
import OldItemImg from "./oldItemImg";
import Config from "../configs/config";

export default function Game() {
  const [validGuesses, setValidGuesses] = useState([]);
  const [champions, setChampions] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setGuess] = useState(validGuesses[0]);
  const [correctGuess, setCorrectGuess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [spriteUrl, setSpriteUrl] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsValidToken(true);
    }

    FetchItems();
    FetchItemImage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const FetchItems = () => {
    axios
      .get(Config.url + "/oldItems")
      .then((response) => {
        if (response.data.status === "success") {
          const data = response.data.items;

          setValidGuesses(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const FetchItemImage = () => {
    axios
      .get(Config.url + "/oldItem", {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.status === "success") {
          if (response.data.result) {
            const url = "/old_items/" + response.data.result + ".webp";
            setSpriteUrl(url);
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
          setIsValidToken(false);
          return;
        }

        const isCorrect = response.data.correctGuess;

        const itemId = response.data.itemId;
        const name = response.data.name;

        setChampions((champions) => [[itemId, name, isCorrect], ...champions]);

        const spriteImg = document.getElementById("spriteImg");

        if (isCorrect) {
          setCorrectGuess(true);

          spriteImg.style.filter = "";
        } else {
          let blurVal = parseFloat(spriteImg.style.filter.substring(5, 8));

          blurVal -= blurVal * 0.4;

          spriteImg.style.filter = "blur(" + blurVal.toString() + "em)";
        }
      })
      .catch((error) => {
        console.log(error);
        setChampions([]);
      });
  };

  const Restart = () => {
    const spriteImg = document.getElementById("spriteImg");
    spriteImg.style.filter = "blur(1.0em)";

    FetchItemImage();
    FetchItems();

    setGuesses([]);
    setChampions([]);
    setGuess();
    setCorrectGuess(false);
  };

  return (
    <div className="container main pt-4 pb-5 mb-5">
      <h3 className="text-center pb-3">Which removed item is this?</h3>

      {!isValidToken ? <NewUser /> : ""}

      <div
        className="container d-flex justify-content-center shadow"
        id="itemContainer"
      >
        <img
          src={spriteUrl}
          style={{ filter: "blur(1.0em)" }}
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
          </div>
        </form>
      </div>

      <div id="championsImgs" className="container">
        {champions.map((item) => (
          <OldItemImg itemId={item[0]} name={item[1]} isCorrect={item[2]} />
        ))}
      </div>

      {correctGuess ? (
        <Victory
          id="victory"
          championKey={champions[0][0]}
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
