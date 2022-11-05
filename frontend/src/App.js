import "./Game.css";
import "./Main.css";

import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/header";
import Footer from "./components/footer";
import Game from "./components/game";
import Scoreboard from "./views/scoreboard";
import Legal from "./views/legal";
import About from "./views/about";

function App() {
  return (
    <>
      <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<Game />} />
            <Route path="/leaderboard" element={<Scoreboard />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/"/>} />
          </Routes>
        </div>
      <Footer />
    </>
    
  );
}

export default App;
