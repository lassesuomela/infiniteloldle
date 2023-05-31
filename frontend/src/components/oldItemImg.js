import React from "react";

export default function OldItemImg(props) {
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
        src={"/old_items/" + props.itemId + ".png"}
        alt={props.name}
        className="championData mx-auto"
      />
    </div>
  );
}
