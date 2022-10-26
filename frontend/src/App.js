import "./Game.css";
import "./Main.css";

import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/header";
import Footer from "./components/Footer";
import Game from "./components/Game";
import Scoreboard from "./views/scoreboard";
import Register from "./views/register";

function App() {
  return (
    <>
      <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<Game />} />
            <Route path="/register" element={<Register />} />
            <Route path="/scoreboard" element={<Scoreboard />} />
            <Route path="*" element={<Navigate to="/"/>} />
          </Routes>
        </div>
      <Footer />
    </>
    
  );
}

export default App;
