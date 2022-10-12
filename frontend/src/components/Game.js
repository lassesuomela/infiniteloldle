import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import "../Game.css";
import Titles from "./GameTitle";
import ChampionDetails from "./ChampionDetails";

const url = "http://localhost:8081/api";
const token = localStorage.getItem("token");

axios.defaults.headers.common['authorization'] = "Bearer " + token;

export default function Game() {

  const [guesses, setGuesses] = useState([]);

  const Guess = (e) => {
    e.preventDefault();

    const champion = e.target[0].value;

    axios.post(url + "/guess", {guess:champion}).then(response => {

      const data = response.data.properties;

      console.log(data)

      setGuesses(data);

    }).catch(error => {
      console.log(error);
    })
  }

  return (
    <div className="container">
      <form class="form-control" onSubmit={Guess} >
        <label className="control-label" for="champion">Champion</label>
        <input type="text" className="form-control" id="champion" placeholder="Champion" />

        <button className="btn btn-primary" >Guess</button>
      </form>

      <Titles />
      <div id="guesses">
        {
          guesses.map((guess) =>(
            <ChampionDetails guessedChampion={guess.guessedChampion} gender={guess.gender} genre={guess.genre} resource={guess.resource} rangeTypes={guess.rangeType} positions={guess.position} releaseYear={guess.releaseYear} regions={guess.region} skinCount={guess.skinCount}/>
          ))
        }
        
      </div>
    </div>
  )
}
