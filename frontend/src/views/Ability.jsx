import React from "react";
import AbilitySpriteGame from "../components/games/AbilitySpriteGame";
import { Helmet } from "react-helmet";

export default function Ability() {
  return (
    <div>
      <Helmet>
        <title>Infinite LoLdle - Guessing champion abilities</title>
        <meta
          name="description"
          content="Infiniteloldle.com - Guess League of Legends champions infinitely by their abilities."
        />
      </Helmet>
      <AbilitySpriteGame />
    </div>
  );
}
