import React from "react";
import { Link } from "react-router-dom";
import PageMeta from "../seo/PageMeta";
import StructuredData from "../seo/StructuredData";
import { breadcrumbSchema, homeFaqSchema, webAppSchema, websiteSchema } from "../seo/schema";

export default function Home() {
  return (
    <main className="container pb-5 mb-5">
      <PageMeta
        title="Unlimited LoLdle – League of Legends Guessing Game"
        description="Play unlimited League of Legends guessing rounds in champion, ability, splash art, item, and legacy item modes. InfiniteLoLdle is an independent LoLdle alternative."
        path="/"
      />
      <StructuredData data={websiteSchema} />
      <StructuredData data={webAppSchema} />
      <StructuredData
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
        ])}
      />
      <StructuredData data={homeFaqSchema} />

      <h1 className="text-center pt-4 pb-3">
        Unlimited LoLdle – League of Legends Guessing Game
      </h1>
      <p>
        InfiniteLoLdle is an unlimited League of Legends guessing game inspired by LoLdle and
        Wordle-style formats. Instead of one daily puzzle, you can continue playing new rounds
        across multiple quiz modes.
      </p>
      <p>
        Play by champion clues, champion abilities, splash art, item icons, or legacy item icons.
        If you want an unlimited LoLdle alternative, this gives you repeatable rounds without daily
        lockouts.
      </p>

      <h2 className="pt-2">Game modes</h2>
      <ul>
        <li>
          <Link to="/game/champion">Champion mode</Link>
        </li>
        <li>
          <Link to="/game/ability">Ability mode</Link>
        </li>
        <li>
          <Link to="/game/splash">Splash-art mode</Link>
        </li>
        <li>
          <Link to="/game/item">Item mode</Link>
        </li>
        <li>
          <Link to="/game/item/legacy">Legacy item mode</Link>
        </li>
      </ul>

      <h2 className="pt-2">Frequently asked questions</h2>
      <h3 className="h5">Is InfiniteLoLdle limited to one puzzle per day?</h3>
      <p>No. You can play unlimited rounds in every mode.</p>
      <h3 className="h5">Is InfiniteLoLdle affiliated with Riot Games?</h3>
      <p>
        No. InfiniteLoLdle is an independent project. League of Legends is a trademark of Riot
        Games.
      </p>

      <p className="pt-2">
        Explore more: <Link to="/leaderboard">Leaderboard</Link>, <Link to="/stats">Statistics</Link>,{" "}
        <Link to="/about">About</Link>, <Link to="/legal">Legal</Link>.
      </p>
    </main>
  );
}
