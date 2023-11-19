import React from "react";
import { Tooltip } from "react-tooltip";

export default function ItemImg(props) {
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
        id="itemImg"
        key={props.itemId}
        src={props.path + props.itemId + ".webp"}
        alt={props.name}
        className="championData mx-auto"
        data-tooltip-id="item-tooltip"
        data-tooltip-content={props.name}
      />
      <Tooltip id="champion-tooltip" />
    </div>
  );
}
