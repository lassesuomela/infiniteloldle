import React from "react";

export default function ItemImg(props) {
  return (
    <div
      className={
        "container text-center mb-2 p-2 " +
        (props.isCorrect ? "correct" : "incorrect")
      }
    >
      <img
        id="itemImg"
        key={props.itemId}
        src={"/items/" + props.itemId + ".webp"}
        alt={props.name}
        className="championData mx-auto"
      />
    </div>
  );
}
