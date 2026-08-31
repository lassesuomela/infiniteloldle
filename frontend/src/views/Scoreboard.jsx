import React from "react";
import ScoreBoardData from "../components/ScoreBoardData";
import { Link } from "react-router-dom";
import PageMeta from "../seo/PageMeta";
import StructuredData from "../seo/StructuredData";
import { breadcrumbSchema } from "../seo/schema";

export default function ScoreBoard() {
  return (
    <>
      <div className="container pb-5 mb-5">
        <PageMeta
          title="League Guessing Game Leaderboard"
          description="View top InfiniteLoLdle players and compare scores across unlimited League of Legends guessing rounds."
          path="/leaderboard"
        />
        <StructuredData
          data={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Leaderboard", path: "/leaderboard" },
          ])}
        />

        <h1 className="text-center pt-4 pb-3">Leaderboard</h1>
        <p>
          Track top scores from the InfiniteLoLdle community across champion and quiz gameplay.
          Jump back into the game to improve your own position.
        </p>

        <ScoreBoardData />
        <p className="pt-3">
          Play now: <Link to="/game/champion">Champion</Link>,{" "}
          <Link to="/game/ability">Ability</Link>, <Link to="/game/splash">Splash</Link>,{" "}
          <Link to="/game/item">Item</Link>.
        </p>
      </div>
    </>
  );
}
