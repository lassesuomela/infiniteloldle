import React, {useState, useEffect} from 'react'
import axios from "axios";
import Select from 'react-select';
import NewUser from "./newUser";
import Victory from "./victory";
import ChampionImg from "./championImg";

const url = "https://www.infiniteloldle.com/api";

export default function Game() {

  const [validGuesses, setValidGuesses] = useState([]);
  const [champions, setChampions] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setGuess] = useState(validGuesses[0]);
  const [correctGuess, setCorrectGuess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [spriteUrl, setSpriteUrl] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {

    if(localStorage.getItem("token")){
      setIsValidToken(true);
    }

    FetchChampions();
    FetchSplashArt();

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

  const FetchSplashArt = () => {

    axios.get(url + "/splash", {headers: {'authorization': 'Bearer ' + localStorage.getItem("token")}}).then(response => {

        if(response.data.status === "success"){

            const url = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + response.data.result.championKey + "_" + response.data.result.currentSplashId + ".jpg";
            setSpriteUrl(url);
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

    axios.post(url + "/splash", {guess:currentGuess}, {headers: {'authorization': 'Bearer ' + localStorage.getItem("token")}}).then(response => {

      if(response.data.status !== "success"){
        setIsValidToken(false);
        return;
      }

      const isCorrect = response.data.correctGuess;

      const key = response.data.championKey;

      console.log([key, isCorrect]);

      setChampions(champions => [[key, isCorrect], ...champions]);
      console.log(champions);

      const spriteImg = document.getElementById("spriteImg");

      if(isCorrect){
        setCorrectGuess(true)
        setTitle(response.data.title)

        spriteImg.style.width = "100%";
      }else{
        if(spriteImg.style.width !== "100%" ){
            spriteImg.style.width = 300 - (guesses.length + 1) * 25 + "%";
        }
      }

    }).catch(error => {
      console.log(error);
      setChampions([]);
    })
  }

  const Restart = () => {

    const spriteImg = document.getElementById("spriteImg");

    spriteImg.style.width = "300%";

    FetchSplashArt();
    FetchChampions();

    setGuesses([]);
    setChampions([]);
    setGuess();
    setCorrectGuess(false);
  }

  return (
    <div className="container main pt-4 pb-5 mb-5">

      <h3 className="text-center pb-3">Whose splash art is this?</h3>

      {
        !isValidToken ? <NewUser /> : ""
      }

        <div className="container" id="spriteContainer">
            <img src={spriteUrl} id="spriteImg" style={{"width":"300%"}} alt="Champion splash art" draggable="false"/>
        </div>

      <div className="d-flex justify-content-center mt-4 pt-3 mb-3">

        <form className="form-control row g-3 mb-2" onSubmit={Guess} id="guess-form">

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

        <div id="championsImgs" className="container">
            {
                champions.map(champ =>(
                    <ChampionImg championKey={champ[0]} isCorrect={champ[1]} />
                ))
            }
        
        </div>
            
        {
            correctGuess ? 
            <Victory id="victory" championKey={champions[0][0]} champion={currentGuess} tries={guesses.length} title={title} />
            : ""
        }
    </div>
  )
}
