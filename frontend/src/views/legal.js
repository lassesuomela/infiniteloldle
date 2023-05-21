import React from "react";
import LegalComponent from "../components/legal";
import { Helmet } from "react-helmet";

export default function Legal() {
  return (
    <div className="container">
      <Helmet>
        <title>Infiniteloldle - Legal disclaimer</title>
        <meta
          name="description"
          content="Infiniteloldle.com - Legal disclaimer and privacy policy section."
        />
      </Helmet>

      <h3 className="text-center pb-3 pt-4">Legal</h3>

      <div className="d-flex justify-content-center">
        <div className="card p-5 w-75 text-start">
          <LegalComponent />
        </div>
      </div>
    </div>
  );
}
