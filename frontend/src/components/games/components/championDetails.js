import React from "react";

export default function ChampionDetails(props) {
  const checkColorBlindMode = () => {
    return props.isColorBlindMode ? "cb-" : "";
  };
  return (
    <div className="container text-center mb-2">
      <div className="row">
        <div className="col-1">
          <img
            id="championImg"
            key={props.championKey}
            src={"/champions/" + props.championKey + ".webp"}
            alt={props.championKey}
            className="championData mx-auto"
          />
        </div>
        <div
          className={
            "col-1 championData " +
            (props.similarites.sameGender
              ? checkColorBlindMode() + "correct"
              : checkColorBlindMode() + "incorrect")
          }
          id="gender"
        >
          <span className="align-center">
            {props.gender === 1
              ? "Male"
              : props.gender === 2
              ? "Female"
              : "Other"}
          </span>
        </div>
        <div
          className={
            "col-1 championData " +
            (props.similarites.sameResource
              ? checkColorBlindMode() + "correct"
              : checkColorBlindMode() + "incorrect")
          }
          id="resource"
        >
          <span className="align-center">
            {props.hideResource
              ? props.resource === "Mana"
                ? "Mana"
                : "Manaless"
              : props.resource}
          </span>
        </div>
        <div
          className={
            "col-1 championData " +
            (props.similarites.sameRangeType === "partial"
              ? checkColorBlindMode() + "partial"
              : props.similarites.sameRangeType
              ? checkColorBlindMode() + "correct"
              : checkColorBlindMode() + "incorrect")
          }
          id="range"
        >
          <span className="align-center breakWord">
            {props.rangeTypes.replace(/,/g, " ")}
          </span>
        </div>
        <div
          className={
            "col-2 championData " +
            (props.similarites.sameGenre === "partial"
              ? checkColorBlindMode() + "partial"
              : props.similarites.sameGenre
              ? checkColorBlindMode() + "correct"
              : checkColorBlindMode() + "incorrect")
          }
          id="genre"
        >
          <span className="align-center breakWord">
            {props.genre.replace(/,/g, " ")}
          </span>
        </div>
        <div
          className={
            "col-2 championData " +
            (props.similarites.samePosition === "partial"
              ? checkColorBlindMode() + "partial"
              : props.similarites.samePosition
              ? checkColorBlindMode() + "correct"
              : checkColorBlindMode() + "incorrect")
          }
          id="position"
        >
          <span className="align-center breakWord">
            {props.positions.replace(/,/g, " ")}
          </span>
        </div>
        <div
          className={
            "col-1 championData " +
            (props.similarites.sameReleaseYear === "="
              ? checkColorBlindMode() + "correct"
              : props.similarites.sameReleaseYear === "<"
              ? checkColorBlindMode() + "incorrect-less"
              : props.similarites.sameReleaseYear === ">"
              ? checkColorBlindMode() + "incorrect-greater"
              : "")
          }
          id="released"
        >
          <span className="align-center">{props.releaseYear}</span>
        </div>
        <div
          className={
            "col-2 championData " +
            (props.similarites.sameRegion === "partial"
              ? checkColorBlindMode() + "partial"
              : props.similarites.sameRegion
              ? checkColorBlindMode() + "correct"
              : checkColorBlindMode() + "incorrect")
          }
          id="region"
        >
          <span className="align-center regionText">
            {props.regions.replace(/,/g, "\n")}
          </span>
        </div>
        <div
          className={
            "col-1 championData " +
            (props.similarites.sameDamageType === "partial"
              ? checkColorBlindMode() + "partial"
              : props.similarites.sameDamageType
              ? checkColorBlindMode() + "correct"
              : checkColorBlindMode() + "incorrect")
          }
          id="region"
        >
          <span className="align-center breakWord">
            {props.damageType.replace(/,/g, " ")}
          </span>
        </div>
      </div>
    </div>
  );
}
