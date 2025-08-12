import "./Game.css";
import "./Main.css";

import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Game from "./components/games/Game";
import Scoreboard from "./views/Scoreboard";
import Legal from "./views/Legal";
import About from "./views/About";
import Splash from "./views/Splash";
import Item from "./views/Item";
import OldItem from "./views/OldItem";
import Stats from "./views/Stats";
import MyStats from "./views/MyStats";

import { Provider } from "react-redux";
import store from "./store/store";
import Ability from "./views/Ability";

function App() {
  return (
    <Provider store={store}>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/game/splash" element={<Splash />} />
          <Route path="/game/ability" element={<Ability />} />
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
    </Provider>
  );
}

export default App;
