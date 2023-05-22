import React from "react";
import OldItemGame from "../components/oldItemGame";
import { Helmet } from "react-helmet";

export default function Splash() {
  return (
    <div>
      <Helmet>
        <title>Infiniteloldle - Item sprite game for deleted items</title>
        <meta
          name="description"
          content="Infiniteloldle.com - Guess League of Legends items by their sprites."
        />
      </Helmet>
      <OldItemGame />
    </div>
  );
}
