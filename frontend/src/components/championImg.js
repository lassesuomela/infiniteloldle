import React from "react";

export default function ChampionDetails(props) {
  return (
    <div
      className={
        "container text-center mb-2 p-2 " +
        (props.isCorrect ? "correct" : "incorrect")
      }
    >
      <img
        id="championImg"
        key={props.championKey}
        src={"/champions/" + props.championKey + ".webp"}
        alt={props.championKey}
        className="championData mx-auto"
      />
    </div>
  );
}
