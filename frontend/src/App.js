import "./Game.css";
import "./Main.css";

import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Game from "./components/Game";

function App() {
  return (
    <>
      <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<Game />} />
          </Routes>
        </div>
      <Footer />
    </>
    
  );
}

export default App;
