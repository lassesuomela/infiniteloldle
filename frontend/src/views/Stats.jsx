import React from "react";
import StatsData from "../components/StatsData";
import { Link } from "react-router-dom";
import PageMeta from "../seo/PageMeta";
import StructuredData from "../seo/StructuredData";
import { breadcrumbSchema } from "../seo/schema";

export default function ScoreBoard() {
  return (
    <>
      <div className="container pb-5">
        <PageMeta
          title="InfiniteLoLdle Statistics"
          description="Review InfiniteLoLdle platform statistics, player activity, and gameplay trends for the unlimited League of Legends guessing game."
          path="/stats"
        />
        <StructuredData
          data={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Statistics", path: "/stats" },
          ])}
        />

        <h1 className="text-center pb-3 pt-4">Statistics</h1>
        <p>
          This page summarizes public InfiniteLoLdle metrics such as user activity, regional usage,
          and gameplay totals. These numbers are aggregate platform statistics and do not expose
          private player data.
        </p>
        <p>
          For your own rounds, use <Link to="/stats/me">My stats</Link>. To continue playing, go to{" "}
          <Link to="/game/champion">Champion mode</Link>.
        </p>
        <div className="text-center card p-5 pb-5">
          <StatsData />
        </div>
        <br />
      </div>
    </>
  );
}
