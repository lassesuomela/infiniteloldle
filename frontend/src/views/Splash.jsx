import React from "react";
import SplashArtGame from "../components/games/SplashArtGame";
import { Helmet } from "react-helmet";

export default function Splash() {
  return (
    <div>
      <Helmet>
        <title>Infinite LoLdle - Guessing splash art game</title>
        <meta
          name="description"
          content="Infiniteloldle.com - Guess League of Legends champions infinitely by their splash arts."
        />
      </Helmet>
      <SplashArtGame />
    </div>
  );
}
