import React from "react";
import ItemGame from "../components/itemGame";
import { Helmet } from "react-helmet";

export default function Splash() {
  return (
    <div>
      <Helmet>
        <title>Infiniteloldle - Guessing items game</title>
        <meta
          name="description"
          content="Infiniteloldle.com - Guess League of Legends items by their icons."
        />
      </Helmet>
      <ItemGame />
    </div>
  );
}
