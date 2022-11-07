import React from 'react';

export default function ChampionDetails(props) {

    return (
        <div className="container text-center mb-2">
            <div className="row">
                <div className="col-1">

                    <img id="championImg" key={"https://ddragon.leagueoflegends.com/cdn/12.19.1/img/champion/" + props.championKey + ".png"} src={"https://ddragon.leagueoflegends.com/cdn/12.19.1/img/champion/" + props.championKey + ".png"} alt={props.championKey} className="championData mx-auto"/>
                
                </div>
                <div className={"col-1 championData " + (props.similarites.sameGender ? "correct" : "incorrect")} id="gender">
                    <span className="align-center">{props.gender === 1 ? "Male" : props.gender === 2 ? "Female" : "Other"}</span>
                </div>
                <div className={"col-1 championData " + (props.similarites.sameResource ? "correct" : "incorrect")} id="resource">
                    <span className="align-center">{props.resource}</span>
                </div>
                <div className={"col-1 championData " + (props.similarites.sameRangeType === "partial" ? "partial" : props.similarites.sameRangeType ? "correct" : "incorrect")} id="range">
                    <span className="align-center">{props.rangeTypes.replace(/,/g, " ")}</span>
                </div>
                <div className={"col-2 championData " + (props.similarites.sameGenre === "partial" ? "partial" : props.similarites.sameGenre ? "correct" : "incorrect")} id="genre">
                    <span className="align-center breakWord">{props.genre.replace(/,/g, " ")}</span>
                </div>
                <div className={"col-2 championData " + (props.similarites.samePosition === "partial" ? "partial" : props.similarites.samePosition ? "correct" : "incorrect")} id="position">
                    <span className="align-center breakWord">{props.positions.replace(/,/g, " ")}</span>
                </div>
                <div className={"col-1 championData " + (props.similarites.sameReleaseYear === "=" ? "correct" : props.similarites.sameReleaseYear === "<" ? "incorrect-less" : props.similarites.sameReleaseYear === ">" ? "incorrect-greater" : "")} id="released">
                    <span className="align-center">{props.releaseYear}</span>
                </div>
                <div className={"col-2 championData " + (props.similarites.sameRegion ? "correct" : "incorrect")} id="region">
                    <span className="align-center regionText">{props.regions.replace(/,/g, "\n")}</span>
                </div>
                <div className={"col-1 championData " + (props.similarites.sameDamageType ? "correct" : "incorrect")} id="region">
                    <span className="align-center">{props.damageType}</span>
                </div>
            </div>
        </div>
    )
}
