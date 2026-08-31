import React from "react";
import { Link } from "react-router-dom";
import Game from "../components/games/Game";
import PageMeta from "../seo/PageMeta";
import StructuredData from "../seo/StructuredData";
import isPrerenderMode from "../seo/prerenderMode";
import { breadcrumbSchema, webAppSchema } from "../seo/schema";

export default function Champion() {
  const prerenderMode = isPrerenderMode();

  return (
    <div className="container pb-5 mb-5">
      <PageMeta
        title="League Champion Guessing Game"
        description="Guess League of Legends champions with unlimited rounds. Use champion attributes and clues to solve each puzzle in InfiniteLoLdle."
        path="/game/champion"
      />
      <StructuredData data={webAppSchema} />
      <StructuredData
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Champion Mode", path: "/game/champion" },
        ])}
      />

      <h1 className="text-center pt-4 pb-3">League Champion Guessing Game</h1>
      <p>
        Guess the League of Legends champion using role, region, resource, release year, and other
        clue columns. This mode is unlimited, so you can keep playing beyond a daily challenge.
      </p>
      <p>
        Related modes: <Link to="/game/ability">Ability</Link>,{" "}
        <Link to="/game/splash">Splash art</Link>, <Link to="/game/item">Item</Link>,{" "}
        <Link to="/game/item/legacy">Legacy item</Link>.
      </p>

      {!prerenderMode ? <Game /> : null}
    </div>
  );
}
