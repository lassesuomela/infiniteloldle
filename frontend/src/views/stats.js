import React from "react";
import StatsData from "../components/statsData";
import { Helmet } from "react-helmet";

export default function ScoreBoard() {
  return (
    <>
      <div className="container">
        <Helmet>
          <title>Infiniteloldle - Statistics</title>
          <meta name="description" content="Infiniteloldle.com - Statistics" />
        </Helmet>

        <StatsData />
      </div>
    </>
  );
}
