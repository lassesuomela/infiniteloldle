import React from "react";
import AboutComponent from "../components/About";
import { Helmet } from "react-helmet";

export default function About() {
  return (
    <div className="container mb-5 pb-4">
      <Helmet>
        <title>Infinite LoLdle - Ultimate LoL quiz - About</title>
        <meta
          name="description"
          content="Explore an endless world of knowledge and test your expertise as you guess and identify the champions."
        />
      </Helmet>

      <h3 className="text-center pb-3 pt-4">About</h3>

      <div className="d-flex justify-content-center">
        <div className="card p-5 w-100 w-md-75 text-start">
          <AboutComponent />
        </div>
      </div>
    </div>
  );
}
