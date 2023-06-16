import React from "react";
import OldItemGame from "../components/oldItemGame";
import { Helmet } from "react-helmet";

export default function Splash() {
  return (
    <div>
      <Helmet>
        <title>Infiniteloldle - Guessing legacy items game</title>
        <meta
          name="description"
          content="Infiniteloldle.com - Guess League of Legends legacy items by their icons."
        />
      </Helmet>
      <OldItemGame />
    </div>
  );
}
