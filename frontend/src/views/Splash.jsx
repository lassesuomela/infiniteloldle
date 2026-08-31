import React from "react";
import SplashArtGame from "../components/games/SplashArtGame";
import { Link } from "react-router-dom";
import PageMeta from "../seo/PageMeta";
import StructuredData from "../seo/StructuredData";
import isPrerenderMode from "../seo/prerenderMode";
import { breadcrumbSchema, webAppSchema } from "../seo/schema";

export default function Splash() {
  const prerenderMode = isPrerenderMode();

  return (
    <div className="container pb-5 mb-5">
      <PageMeta
        title="League Splash Art Quiz"
        description="Guess League of Legends champions from splash art clues. Play unlimited splash-art rounds in InfiniteLoLdle."
        path="/game/splash"
      />
      <StructuredData data={webAppSchema} />
      <StructuredData
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Splash Art Mode", path: "/game/splash" },
        ])}
      />

      <h1 className="text-center pt-4 pb-3">League Splash Art Quiz</h1>
      <p>
        This mode tests your champion knowledge from splash art segments and reveal states. You can
        play continuously with unlimited rounds instead of waiting for a daily reset.
      </p>
      <p>
        Related quizzes: <Link to="/game/champion">Champion</Link>,{" "}
        <Link to="/game/ability">Ability</Link>, <Link to="/game/item">Item</Link>,{" "}
        <Link to="/game/item/legacy">Legacy item</Link>.
      </p>

      {!prerenderMode ? <SplashArtGame /> : null}
    </div>
  );
}
