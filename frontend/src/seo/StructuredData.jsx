import React from "react";
import { Helmet } from "react-helmet";

export default function StructuredData({ data }) {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}
