import React from 'react';

export default function ChampionDetails(props) {

  return (
    <div className="container">
        <div className="row">
            <div className="col">
                <img src={"https://ddragon.leagueoflegends.com/cdn/12.19.1/img/champion/" + props.championKey + ".png"} alt="Champion" class="img-thumbnail"/>
            </div>
            <div className="col" id="gender">
                <span className={props.similarites.sameGender ? "correct" : "incorrect"}>{props.gender === 1 ? "Male" : props.gender === 2 ? "Female" : "Other"}</span>
            </div>
            <div className="col" id="resource">
                <span className={props.similarites.sameResource ? "correct" : "incorrect"}>{props.resource}</span>
            </div>
            <div className="col" id="range">
                <span className={props.similarites.sameRangeType ? "correct" : "incorrect" ? props.similarites.sameRangeType === "partial" : "partial"}>{props.rangeTypes.replace(/,/g, " ")}</span>
            </div>
            <div className="col" id="genre">
                <span className={props.similarites.sameGenre ? "correct" : "incorrect" ? props.similarites.sameGenre === "partial" : "partial"}>{props.genre.replace(/,/g, " ")}</span>
            </div>
            <div className="col" id="position">
                <span className={props.similarites.samePosition === "partial" ? "partial" : props.similarites.samePosition ? "correct" : "incorrect"}>{props.positions.replace(/,/g, " ")}</span>
            </div>
            <div className="col" id="released">
                <span className={props.similarites.sameReleaseYear === "=" ? "correct" : "incorrect"}>{props.similarites.sameReleaseYear + props.releaseYear}</span>
            </div>
            <div className="col" id="region">
                <span className={props.similarites.sameRegion ? "correct" : "incorrect"}>{props.regions}</span>
            </div>
            <div className="col" id="skinCount">
                <span className={props.similarites.sameSkinCount === "=" ? "correct" : "incorrect"}>{props.similarites.sameSkinCount + props.skinCount}</span>
            </div>
        </div>
    </div>
  )
}
