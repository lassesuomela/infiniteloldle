import React from "react";
import StatsData from "../components/statsData";
import { Helmet } from "react-helmet";

export default function ScoreBoard() {
  return (
    <>
      <div className="container pb-5">
        <Helmet>
          <title>Infiniteloldle - Statistics</title>
          <meta name="description" content="Infiniteloldle.com - Statistics" />
        </Helmet>

        <div className="pb-5">
          <StatsData />
        </div>
      </div>
    </>
  );
}
