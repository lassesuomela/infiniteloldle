import "./Game.css";
import "./Main.css";

import * as Sentry from "@sentry/react";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
Sentry.init({
  dsn: "https://e42b9037954c7284ab059e22848fa3fa@o4506107190575104.ingest.us.sentry.io/4510851852402688",
  sendDefaultPii: false,
});

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import setupAxiosInterceptors from "./utils/axiosInterceptor";

import Footer from "./components/Footer";
import Game from "./components/games/Game";
import Header from "./components/Header";
import About from "./views/About";
import Item from "./views/Item";
import Legal from "./views/Legal";
import MyStats from "./views/MyStats";
import OldItem from "./views/OldItem";
import Scoreboard from "./views/Scoreboard";
import Splash from "./views/Splash";
import Stats from "./views/Stats";

import { Provider } from "react-redux";
import store from "./store/store";
import Ability from "./views/Ability";

function App() {
  useEffect(() => {
    const eject = setupAxiosInterceptors();
    return eject;
  }, []);

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
      <ToastContainer position="bottom-right" theme="dark" newestOnTop />
    </Provider>
  );
}

export default App;
