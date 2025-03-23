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

        <h3 className="text-center pb-3 pt-4">Statistics</h3>
        <div className="text-center card p-5 pb-5">
          <StatsData />
        </div>
        <br />
      </div>
    </>
  );
}
