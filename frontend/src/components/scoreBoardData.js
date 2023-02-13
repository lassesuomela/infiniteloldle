import React, {useState, useEffect} from 'react';
import axios from "axios";
import ReactCountryFlag from "react-country-flag"

import Config from "../configs/config";

export default function ScoreBoardData() {

    const [players, setPlayers] = useState([]);
    const [playerData, setPlayerData] = useState("");
    const [playerCount, setPlayerCount] = useState(0);

    useEffect(() => {
        axios.get(Config.url + "/scoreboard")
        .then(response => {

            const data = response.data.scores;

            setPlayerCount(response.data.playerCount);
            setPlayers(data);
        
        }).catch(error => {
            console.log(error);
        })

        if(!localStorage.getItem("token")){
            return;
        }

        axios.get(Config.url + "/user", {headers: {'authorization': 'Bearer ' + localStorage.getItem("token")}})
        .then(response => {

            if(response.data.status === "success"){
                const data = response.data.player;
    
                setPlayerData(data);
            }
        
        }).catch(error => {
            console.log(error);
        })

      }, [])

    return (
        <>
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Nickname</th>
                    <th>Prestige</th>
                    <th>Correct guesses</th>
                    <th>Country</th>
                    <th>Registered</th>
                </tr>
            </thead>
            <tbody>
            {
                players.map((player, i) => (
                    <tr key={player.nickname + i}>
                        <td>{i + 1}</td>
                        <td>{player.nickname}</td>
                        <td>{player.prestige}</td>
                        <td>{player.score}</td>
                        <td>{player.country ? <ReactCountryFlag countryCode={player.country} svg /> : "n/a"}</td>
                        <td>{player.timestamp}</td>
                    </tr>
                ))
            }
            </tbody>

            <tbody>
                <tr>
                    <td>???</td>
                    <td>{playerData ? playerData.nickname : "-"}</td>
                    <td>{playerData ? playerData.prestige : "-"}</td>
                    <td>{playerData ? playerData.score : "-"}</td>
                    <td>{playerData.country ? <ReactCountryFlag countryCode={playerData.country} svg /> : "n/a"}</td>
                    <td>{playerData ? playerData.timestamp : "-"}</td>
                </tr>
            </tbody>

        </table>

        <div className="playerCount">
            <h5>Player count: <span>{playerCount}</span></h5>
        </div>
        </>
    )
}
