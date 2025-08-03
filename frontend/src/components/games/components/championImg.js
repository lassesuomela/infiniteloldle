import React from "react";
import { Tooltip } from "react-tooltip";

export default function ChampionImg(props) {
  const checkColorBlindMode = () => {
    return props.isColorBlindMode ? "cb-" : "";
  };
  return (
    <div
      className={
        "container text-center mb-2 p-2 " +
        (props.isCorrect
          ? checkColorBlindMode() + "correct"
          : checkColorBlindMode() + "incorrect")
      }
    >
      <img
        id={`championImg-${props.championKey}`}
        key={props.championKey}
        src={"/champions/" + props.championKey + ".webp"}
        alt={props.championKey}
        className="championData mx-auto"
      />
      <Tooltip
        anchorSelect={`#championImg-${props.championKey}`}
        place="bottom"
      >
        {props.name}
      </Tooltip>
    </div>
  );
}
