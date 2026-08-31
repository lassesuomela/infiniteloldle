import React from "react";
import ItemGame from "../components/games/ItemGame";
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
        title="League Item Quiz"
        description="Guess League of Legends items by icon clues in unlimited rounds. Practice item recognition in InfiniteLoLdle."
        path="/game/item"
      />
      <StructuredData data={webAppSchema} />
      <StructuredData
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Item Mode", path: "/game/item" },
        ])}
      />

      <h1 className="text-center pt-4 pb-3">League Item Quiz</h1>
      <p>
        Guess modern League of Legends items from icon-based clues. The mode is unlimited, so you
        can keep playing as long as you want.
      </p>
      <p>
        Related quizzes: <Link to="/game/champion">Champion</Link>,{" "}
        <Link to="/game/ability">Ability</Link>, <Link to="/game/splash">Splash art</Link>,{" "}
        <Link to="/game/item/legacy">Legacy item</Link>.
      </p>

      {!prerenderMode ? <ItemGame /> : null}
    </div>
  );
}
