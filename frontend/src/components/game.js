import React, {useState, useEffect} from 'react'
import axios from "axios";
import Titles from "./gameTitle";
import ChampionDetails from "./championDetails";
import Select from 'react-select';
import Victory from "./victory";
import NewUser from "./newUser";

const url = "https://www.infiniteloldle.com/api";

export default function Game() {

  const [validGuesses, setValidGuesses] = useState([]);
  const [champions, setChampions] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setGuess] = useState(validGuesses[0]);
  const [correctGuess, setCorrectGuess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {

    if(localStorage.getItem("token")){
      setIsValidToken(true);
    }

    FetchChampions();

  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const FetchChampions = () => {

    axios.get(url + "/champions").then(response => {

      if(response.data.status === "success"){
        const data = response.data.champions;
  
        setValidGuesses(data);
      }

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

    axios.post(url + "/guess", {guess:currentGuess}, {headers: {'authorization': 'Bearer ' + localStorage.getItem("token")}}).then(response => {

      if(response.data.status !== "success"){
        setIsValidToken(false);
        return;
      }

      const correct = response.data.correctGuess;

      const data = response.data.properties;

      setChampions(champions => [data, ...champions]);

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

  return (
    <div className="container main pt-4 pb-5 mb-5">

      <h3 className="text-center pb-3">Start guessing your champion</h3>

      {
        !isValidToken ? <NewUser /> : ""
      }

      <div className="d-flex justify-content-center mt-4 mb-3">

        <form className="form-control row g-3 mb-4" onSubmit={Guess} id="guess-form">

          <Select 
            options={validGuesses}
            onChange={selectedOption => setGuess(selectedOption.value)}
            isDisabled={correctGuess}
          />

          <div className="d-flex justify-content-evenly">
            <button className="btn btn-dark mb-3 mt-1 min-vw-25">Guess</button>
            {
              correctGuess ? 
              <button className="btn btn-light mb-3 mt-1 min-vw-25" onClick={Restart}>Reset</button>
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
            <ChampionDetails championKey={champ[0].championKey} gender={champ[0].gender} genre={champ[0].genre} resource={champ[0].resource} rangeTypes={champ[0].rangeType} positions={champ[0].position} releaseYear={champ[0].releaseYear} regions={champ[0].region} damageType={champ[0].damageType} similarites={champ[1]}/>
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
