import React, {useState, useEffect} from 'react'
import axios from "axios";
import "../Game.css";
import Titles from "./GameTitle";
import ChampionDetails from "./ChampionDetails";
import Select from 'react-select';

const url = "http://localhost:8081/api";
const token = localStorage.getItem("token");

axios.defaults.headers.common['authorization'] = "Bearer " + token;

export default function Game() {

  const [validGuesses, setValidGuesses] = useState([]);
  const [champions, setChampions] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setGuess] = useState(validGuesses[0]);

  useEffect(() => {
    FetchChampions();
  }, [])

  const FetchChampions = () => {
    axios.get(url + "/champions").then(response => {

      const data = response.data.champions;

      setValidGuesses(data);

    }).catch(error => {
      console.log(error);
    })
  }

  const Guess = (e) => {

    e.preventDefault();

    if(!currentGuess){
      console.log("Input is needed");
      return;
    }

    if(guesses.indexOf(currentGuess) !== -1){
      console.log("Duplicate");
      return;
    }

    setValidGuesses(validGuesses.filter(item => item.label !== currentGuess));

    setGuesses(guesses => [...guesses, currentGuess]);

    axios.post(url + "/guess", {guess:currentGuess}).then(response => {

      const correct = response.data.correctGuess;

      if(correct) {
        CorrectGuess(currentGuess);
        setGuesses([]);
        setChampions([]);
        FetchChampions();
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
    alert("Victory!\nChampion was: " + champion + "\n took " + guesses.length + " tries")
  }

  return (
    <div className="container">
      <form className="form-control row g-3 mb-3" onSubmit={Guess} id="guess-form">

        <Select 
          options={validGuesses}
          onChange={selectedOption => setGuess(selectedOption.value)}
        />

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
