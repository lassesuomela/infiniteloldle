import React from 'react';

export default function ChampionDetails(props) {

    return (
        <div className={"container text-center mb-2 p-2 " + (props.isCorrect ? "correct" : "incorrect")}>
            <img id="championImg" key={"https://ddragon.leagueoflegends.com/cdn/12.19.1/img/champion/" + props.championKey + ".png"} src={"https://ddragon.leagueoflegends.com/cdn/12.19.1/img/champion/" + props.championKey + ".png"} alt={props.championKey} className="championData mx-auto"/>
        </div>
    )
}
