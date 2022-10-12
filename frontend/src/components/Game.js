import React, {useState} from 'react'
import axios from "axios";
import "../Game.css";
import Titles from "./GameTitle";
import ChampionDetails from "./ChampionDetails";

const url = "http://localhost:8081/api";
const token = localStorage.getItem("token");

axios.defaults.headers.common['authorization'] = "Bearer " + token;

export default function Game() {

  const [champions, setChampions] = useState([]);
  const [guesses, setGuesses] = useState([]);

  const Guess = (e) => {
    e.preventDefault();

    const champion = e.target[0].value;
    e.target[0].value = "";

    if(!champion){
      console.log("Input is needed");
      return;
    }

    if(guesses.indexOf(champion) !== -1){
      console.log("Duplicate");
      return;
    }

    setGuesses(guesses => [...guesses, champion]);

    axios.post(url + "/guess", {guess:champion}).then(response => {

      const correct = response.data.correctGuess;

      if(correct) {
        CorrectGuess(champion);
        return;
      }

      const data = response.data.properties;

      setChampions(champions => [...champions, data].reverse());

    }).catch(error => {
      console.log(error);
      setChampions([]);
    })
  }

  const CorrectGuess = (champion) => {
    console.log("Champion was: " + champion);
  }

  return (
    <div className="container">
      <form className="form-control row g-3 mb-3" onSubmit={Guess} >
        <input type="text" className="form-control" id="champion" placeholder="Champion name" />

        <button className="btn btn-primary mb-3" >Guess</button>
      </form>

      <Titles />
      <div id="champions">
        {
          champions.map(champ =>(
            <ChampionDetails championKey={champ[0].championKey} gender={champ[0].gender} genre={champ[0].genre} resource={champ[0].resource} rangeTypes={champ[0].rangeType} positions={champ[0].position} releaseYear={champ[0].releaseYear} regions={champ[0].region} skinCount={champ[0].skinCount} similarites={champ[1]}/>
          ))
        }
        
      </div>
    </div>
  )
}
