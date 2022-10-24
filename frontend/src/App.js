import "./Game.css";
import "./Main.css";

import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Game from "./components/Game";
import ScoreBoard from "./views/ScoreBoard";

function App() {
  return (
    <>
      <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<Game />} />
            <Route path="/scoreboard" element={<ScoreBoard />} />
          </Routes>
        </div>
      <Footer />
    </>
    
  );
}

export default App;
