import React from "react";
import OldItemGame from "../components/games/OldItemGame";
import { Helmet } from "react-helmet";

export default function Splash() {
  return (
    <div>
      <Helmet>
        <title>Infinite LoLdle - Guessing legacy items game</title>
        <meta
          name="description"
          content="Infiniteloldle.com - Guess League of Legends legacy items by their icons."
        />
      </Helmet>
      <OldItemGame />
    </div>
  );
}
