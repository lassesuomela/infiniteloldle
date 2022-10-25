import React from 'react';

export default function ChampionDetails(props) {

  return (
    <div className="container text-center">
        <div className="row mb-2">
            <div className="col-1"></div>
            <div className="col-1">
                <img src={"https://ddragon.leagueoflegends.com/cdn/12.19.1/img/champion/" + props.championKey + ".png"} alt={props.championKey} className="championData"/>
            </div>
            <div className={props.similarites.sameGender ? "col-1 championData correct" : "col-1 championData incorrect"} id="gender">
                <span className="align-center">{props.gender === 1 ? "Male" : props.gender === 2 ? "Female" : "Other"}</span>
            </div>
            <div className={props.similarites.sameResource ? "col-1 championData correct" : "col-1 championData incorrect"} id="resource">
                <span className="align-center">{props.resource}</span>
            </div>
            <div className={props.similarites.sameRangeType === "partial" ? "col-1 championData partial" : props.similarites.sameRangeType ? "col-1 championData correct" : "col-1 championData incorrect"} id="range">
                <span className="align-center">{props.rangeTypes.replace(/,/g, " ")}</span>
            </div>
            <div className={props.similarites.sameGenre === "partial" ? "col-2 championData partial" : props.similarites.sameGenre ? "col-2 championData correct" : "col-2 championData incorrect"} id="genre">
                <span className="align-center breakWord">{props.genre.replace(/,/g, " ")}</span>
            </div>
            <div className={props.similarites.samePosition === "partial" ? "col-2 championData partial" : props.similarites.samePosition ? "col-2 championData correct" : "col-2 championData incorrect"} id="position">
                <span className="align-center breakWord">{props.positions.replace(/,/g, " ")}</span>
            </div>
            <div className={props.similarites.sameReleaseYear === "=" ? "col-1 championData correct" : "col-1 championData incorrect"} id="released">
                <span className="align-center">{props.similarites.sameReleaseYear + props.releaseYear}</span>
            </div>
            <div className={props.similarites.sameRegion ? "col-2 championData correct" : "col-2 championData incorrect"} id="region">
                <span className="align-center">{props.regions}</span>
            </div>
        </div>
    </div>
  )
}
