import React, {useState, useEffect} from 'react';
import axios from "axios";

const url = "http://localhost:8081/api";

export default function ScoreBoardData() {

    const [players, setPlayers] = useState([]);

    useEffect(() => {
        axios.get(url + "/scoreboard")
        .then(response => {

            const data = response.data.scores;
        
            console.log(data);
            setPlayers(data);
        
        }).catch(error => {
            console.log(error);
        })

      }, [])

    return (
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nickname</th>
                    <th scope="col">Correct guesses</th>
                    <th scope="col">Registered</th>
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
        </table>
    )
}
