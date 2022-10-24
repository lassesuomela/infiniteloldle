import "./Game.css";
import "./Main.css";

import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Game from "./components/Game";
import ScoreBoard from "./views/ScoreBoard";
import Register from "./views/Register";

function App() {
  return (
    <>
      <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<Game />} />
            <Route path="/register" element={<Register />} />
            <Route path="/scoreboard" element={<ScoreBoard />} />
            <Route path="*" element={<Navigate to="/"/>} />
          </Routes>
        </div>
      <Footer />
    </>
    
  );
}

export default App;
