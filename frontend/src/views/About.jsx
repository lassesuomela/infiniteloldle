import React from "react";
import AboutComponent from "../components/About";
import { Link } from "react-router-dom";
import PageMeta from "../seo/PageMeta";
import StructuredData from "../seo/StructuredData";
import { breadcrumbSchema, webAppSchema } from "../seo/schema";

export default function About() {
  return (
    <div className="container mb-5 pb-4">
      <PageMeta
        title="About InfiniteLoLdle"
        description="Learn what InfiniteLoLdle is, how each game mode works, and why it is an independent unlimited LoLdle alternative."
        path="/about"
      />
      <StructuredData data={webAppSchema} />
      <StructuredData
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <h1 className="text-center pb-3 pt-4">About InfiniteLoLdle</h1>
      <p>
        InfiniteLoLdle is an unlimited League of Legends guessing game inspired by Wordle-style
        formats and LoLdle. It includes champion, ability, splash-art, item, and legacy-item quiz
        modes so you can keep playing beyond a single daily puzzle.
      </p>
      <p>
        InfiniteLoLdle is an independent fan project and is not affiliated with Riot Games. League
        of Legends is a trademark of Riot Games.
      </p>

      <div className="d-flex justify-content-center">
        <div className="card p-5 w-100 w-md-75 text-start">
          <AboutComponent />
        </div>
      </div>
      <p className="pt-3">
        Explore modes: <Link to="/game/champion">Champion</Link>,{" "}
        <Link to="/game/ability">Ability</Link>, <Link to="/game/splash">Splash</Link>,{" "}
        <Link to="/game/item">Item</Link>, <Link to="/game/item/legacy">Legacy item</Link>.
      </p>
    </div>
  );
}
