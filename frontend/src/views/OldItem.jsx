import React from "react";
import OldItemGame from "../components/games/OldItemGame";
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
        title="League Legacy Item Quiz"
        description="Guess legacy League of Legends items by icon clues. Play unlimited legacy-item quiz rounds in InfiniteLoLdle."
        path="/game/item/legacy"
      />
      <StructuredData data={webAppSchema} />
      <StructuredData
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Legacy Item Mode", path: "/game/item/legacy" },
        ])}
      />

      <h1 className="text-center pt-4 pb-3">League Legacy Item Quiz</h1>
      <p>
        Test your memory of removed and historic League of Legends items. Infinite rounds let you
        revisit older item knowledge without a daily cap.
      </p>
      <p>
        Related quizzes: <Link to="/game/champion">Champion</Link>,{" "}
        <Link to="/game/ability">Ability</Link>, <Link to="/game/splash">Splash art</Link>,{" "}
        <Link to="/game/item">Item</Link>.
      </p>

      {!prerenderMode ? <OldItemGame /> : null}
    </div>
  );
}
