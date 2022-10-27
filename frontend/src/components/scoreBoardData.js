import React, {useState, useEffect} from 'react';
import axios from "axios";

const url = "https://www.infiniteloldle.com/api";

export default function ScoreBoardData() {

    const [players, setPlayers] = useState([]);
    const [playerData, setPlayerData] = useState([]);


    useEffect(() => {
        axios.get(url + "/scoreboard")
        .then(response => {

            const data = response.data.scores;
            setPlayers(data);
        
        }).catch(error => {
            console.log(error);
        })

        axios.get(url + "/user")
        .then(response => {

            const data = response.data.player;
            setPlayerData(data);
        
        }).catch(error => {
            console.log(error);
        })

      }, [])

    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Nickname</th>
                    <th>Correct guesses</th>
                    <th>Registered</th>
                </tr>
            </thead>
            <tbody>
            {
                players.map((player, i) => (
                    <tr>
                        <td>{i + 1}</td>
                        <td>{player.nickname}</td>
                        <td>{player.score}</td>
                        <td>{player.timestamp}</td>
                    </tr>
                ))
            }
            </tbody>

            <td>???</td>
            <td>{playerData.nickname}</td>
            <td>{playerData.score}</td>
            <td>{playerData.timestamp}</td>
        </table>
    )
}
