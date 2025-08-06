import React from "react";
import ItemGame from "../components/games/ItemGame";
import { Helmet } from "react-helmet";

export default function Splash() {
  return (
    <div>
      <Helmet>
        <title>Infinite LoLdle - Guessing items game</title>
        <meta
          name="description"
          content="Infiniteloldle.com - Guess League of Legends items by their icons."
        />
      </Helmet>
      <ItemGame />
    </div>
  );
}
