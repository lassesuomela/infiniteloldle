import React from "react";
import LegalComponent from "../components/Legal";
import { Link } from "react-router-dom";
import PageMeta from "../seo/PageMeta";
import StructuredData from "../seo/StructuredData";
import { breadcrumbSchema } from "../seo/schema";

export default function Legal() {
  return (
    <div className="container pb-5">
      <PageMeta
        title="Legal and Privacy"
        description="Read the legal disclaimer and privacy information for InfiniteLoLdle, including Riot Games trademark and affiliation statements."
        path="/legal"
      />
      <StructuredData
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Legal", path: "/legal" },
        ])}
      />

      <h1 className="text-center pb-3 pt-4">Legal</h1>

      <div className="d-flex justify-content-center pb-5">
        <div className="card p-5 w-100 w-md-75 text-start">
          <LegalComponent />
        </div>
      </div>
      <p>
        Return to <Link to="/">homepage</Link> or continue to{" "}
        <Link to="/game/champion">champion mode</Link>.
      </p>
    </div>
  );
}
