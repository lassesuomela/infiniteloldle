import React from "react";
import Stats from "../components/MyStats";
import { Helmet } from "react-helmet";

export default function MyStats() {
  return (
    <>
      <div className="container pb-5" id="myStats">
        <Helmet>
          <title>Infinite LoLdle - My statistics</title>
          <meta
            name="description"
            content="Infiniteloldle.com - My statistics"
          />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <h3 className="text-center pb-3 pt-4">My stats</h3>

        <div className="text-center card p-5 pb-5">
          <Stats />
        </div>
        <br />
      </div>
    </>
  );
}
