import "./Game.css";
import "./Main.css";

import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/header";
import Footer from "./components/footer";
import Game from "./components/game";
import Scoreboard from "./views/scoreboard";
import Legal from "./views/legal";
import About from "./views/about";
import Splash from "./views/splash";
import Item from "./views/item";
import OldItem from "./views/oldItem";
import Stats from "./views/stats";
import MyStats from "./views/myStats";

function App() {
  return (
    <>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/game/splash" element={<Splash />} />
          <Route path="/game/item" element={<Item />} />
          <Route path="/game/item/legacy" element={<OldItem />} />
          <Route path="/leaderboard" element={<Scoreboard />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/about" element={<About />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/stats/me" element={<MyStats />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
