import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSelector } from "react-redux";

export default function About() {
  const [isCopied, setIsCopied] = useState(false);
  const isColorBlindMode = useSelector(
    (state) => state.colorBlindReducer.isColorBlindMode
  );
  return (
    <div id="about">
      <h3>Inspiration</h3>
      <p>
        This site is inspired by <a href="https://loldle.net">loldle.net</a>, a
        game where you have to guess League of Legends champions daily.
      </p>
      <h3>How to play</h3>

      <p>
        After you have created your nickname, you will be assigned a champion
        that you are trying to guess.
      </p>
      <p>
        In the text box you can start typing your champions name and press enter
        or click the champion you want, to select it as your guess. After that
        click Guess button to send your guess.
      </p>
      <p>
        If your guess was actually correct or not will be determined by the
        colors below.
      </p>

      <p>
        After you guess correctly, the champion will be removed from your
        champion pool and you will not get the same champion again. Only after
        you have guessed every single champion will your champion pool reset.
      </p>

      <h4 className="pb-3">Meaning of the colors</h4>

      <div className="d-flex pb-2 align-items-center">
        <div className={`demo ${isColorBlindMode ? "cb-" : ""}correct`}></div>
        <p className="my-auto mx-auto">Correct guess</p>
      </div>

      <div className="d-flex pb-2 align-items-center">
        <div
          className={`demo ${isColorBlindMode ? "cb-" : ""}incorrect-greater`}
        ></div>
        <p className="my-auto mx-auto">Correct value is higher</p>
      </div>

      <div className="d-flex pb-2 align-items-center">
        <div className={`demo ${isColorBlindMode ? "cb-" : ""}partial`}></div>
        <p className="my-auto mx-auto">Value is partially correct</p>
      </div>

      <div className="d-flex pb-2 align-items-center">
        <div
          className={`demo ${isColorBlindMode ? "cb-" : ""}incorrect-less`}
        ></div>
        <p className="my-auto mx-auto">Correct value is lower</p>
      </div>

      <div className="d-flex">
        <div className={`demo ${isColorBlindMode ? "cb-" : ""}incorrect`}></div>
        <p className="my-auto mx-auto">Incorrect guess</p>
      </div>

      <h4 className="pb-3 pt-4">Scoring system</h4>

      <p>
        You will be rewarded one point for each correct guess you make. After
        you have guessed every single champion in the game your prestige will
        increase. After that your champion pool is reset and every single
        champion in the game will be available in your champion pool.
      </p>

      <h4 className="pb-3 pt-4">Contact Us</h4>
      <p>
        If you want to contact us regarding this site. You can do that by
        sending email to <strong>infiniteloldle@gmail.com</strong>.{" "}
        <CopyToClipboard text="infiniteloldle@gmail.com">
          <button className="btn btn-dark" onClick={() => setIsCopied(true)}>
            {isCopied ? "Copied!" : "Copy"}
          </button>
        </CopyToClipboard>
      </p>
    </div>
  );
}
