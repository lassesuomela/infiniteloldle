import React from 'react'

export default function ChampionDetails(props) {
  return (
    <div className="container">
        <div className="row">
            <div className="col">
                <img src={"https://ddragon.leagueoflegends.com/cdn/12.19.1/img/champion/" + props.championKey + ".png"} alt="Champion" class="img-thumbnail"/>
            </div>
            <div className="col">
                {props.gender === 1 ? "Male" : props.gender === 2 ? "Female" : "Other"}
            </div>
            <div className="col">
                {props.resource}
            </div>
            <div className="col">
                {props.rangeTypes.replace(",", " ")}
            </div>
            <div className="col">
                {props.genre.replace(",", " ")}
            </div>
            <div className="col">
                {props.positions.replace(",", " ")}
            </div>
            <div className="col">
                {props.releaseYear}
            </div>
            <div className="col">
                {props.regions}
            </div>
            <div className="col">
                {props.skinCount}
            </div>
        </div>
    </div>
  )
}
