import React from 'react'
import SplashArtGame from "../components/splashArtGame";
import {Helmet} from "react-helmet";

export default function Splash() {
  return (
    <div>
      <Helmet>
        <title>Infiniteloldle - Splash art game</title>
        <meta name="description" content="Infiniteloldle.com - Guess League of Legends champions infinitely by their splash arts." />
      </Helmet>
      <SplashArtGame />
    </div>
  )
}
