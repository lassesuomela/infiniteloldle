import React from "react";
import { Helmet } from "react-helmet";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "./constants";

export default function PageMeta({ title, description, path, image, noindex = false }) {
  const canonical = `${SITE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;
  const imageUrl = image || DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}
    </Helmet>
  );
}
