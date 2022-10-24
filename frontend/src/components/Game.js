import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Titles from "./GameTitle";
import ChampionDetails from "./ChampionDetails";
import Select from 'react-select';
import Victory from "./Victory";

const url = "http://localhost:8081/api";
const token = localStorage.getItem("token");

axios.defaults.headers.common['authorization'] = "Bearer " + token;

export default function Game() {

  const [validGuesses, setValidGuesses] = useState([]);
  const [champions, setChampions] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setGuess] = useState(validGuesses[0]);
  const [correctGuess, setCorrectGuess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {

    if(!token){
      navigate("/register");
    }

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

      const data = response.data.properties;

      setChampions(champions => [data, ...champions]);

      console.log(champions)

      if(correct){
        setCorrectGuess(true)
      }

    }).catch(error => {
      console.log(error);
      setChampions([]);
    })
  }

  const Restart = () => {
    FetchChampions();

    setGuesses([]);
    setChampions([]);
    setGuess();
    setCorrectGuess(false);
  }

  if(!token){
    return "";
  }
  
  return (
    <div className="container main pt-4">

      <h3 className="text-center pb-3">Start guessing your champion</h3>

      <div className="searchBox mt-4 mb-3">

        <form className="form-control row g-3 mb-4 w-25" onSubmit={Guess} id="guess-form">

          <Select 
            options={validGuesses}
            onChange={selectedOption => setGuess(selectedOption.value)}
            isDisabled={correctGuess}
          />

          <div className="d-flex justify-content-evenly">
            <button className="btn btn-dark mb-3 mt-1 w-25">Guess</button>
            {
              correctGuess ? 
              <button className="btn btn-light mb-3 mt-1 w-25" onClick={Restart}>Reset</button>
              : ""
            }

          </div>
        </form>

      </div>

      {
        champions.length > 0 ? <Titles /> : ""
      }
      
      <div id="champions">
        {
          champions.map(champ =>(

            <ChampionDetails championKey={champ[0].championKey} gender={champ[0].gender} genre={champ[0].genre} resource={champ[0].resource} rangeTypes={champ[0].rangeType} positions={champ[0].position} releaseYear={champ[0].releaseYear} regions={champ[0].region} similarites={champ[1]}/>
          ))
        }
        
      </div>
        
      {
        correctGuess ? 
        <Victory id="victory" championKey={champions[0][0].championKey} champion={champions[0][0].guessedChampion} tries={guesses.length} />
        : ""
      }
    </div>
  )
}
