import fs from "node:fs/promises";
import path from "node:path";
import { JSDOM } from "jsdom";
import { SITE_URL, staticContentRoutes } from "./seo-routes.mjs";

const buildDir = path.resolve("build");

function setMeta(doc, attr, key, value) {
  let tag = doc.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = doc.createElement("meta");
    tag.setAttribute(attr, key);
    doc.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
}

function setCanonical(doc, href) {
  let tag = doc.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = doc.createElement("link");
    tag.setAttribute("rel", "canonical");
    doc.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

function addJsonLd(doc, data) {
  const script = doc.createElement("script");
  script.setAttribute("type", "application/ld+json");
  script.textContent = JSON.stringify(data);
  doc.head.appendChild(script);
}

function baseSchemas(pathname) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "InfiniteLoLdle",
      url: SITE_URL,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: pathname, item: `${SITE_URL}${pathname}` },
      ],
    },
  ];
}

const indexHtml = await fs.readFile(path.join(buildDir, "index.html"), "utf8");

for (const route of staticContentRoutes) {
  const dom = new JSDOM(indexHtml);
  const { document } = dom.window;
  const canonical = `${SITE_URL}${route.path}`;

  document.title = route.title;
  setMeta(document, "name", "description", route.description);
  setCanonical(document, canonical);
  setMeta(document, "property", "og:title", route.title);
  setMeta(document, "property", "og:description", route.description);
  setMeta(document, "property", "og:url", canonical);
  setMeta(document, "property", "og:type", "website");
  setMeta(document, "name", "twitter:card", "summary_large_image");
  setMeta(document, "name", "twitter:title", route.title);
  setMeta(document, "name", "twitter:description", route.description);

  const root = document.getElementById("root");
  root.innerHTML = route.content;
  document.querySelectorAll("noscript").forEach((node) => node.remove());

  for (const schema of baseSchemas(route.path === "/" ? "" : route.path)) {
    addJsonLd(document, schema);
  }

  if (route.path === "/") {
    addJsonLd(document, {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "InfiniteLoLdle",
      applicationCategory: "GameApplication",
      operatingSystem: "Web",
      description: "An unlimited League of Legends guessing game.",
      url: SITE_URL,
    });
  }

  const outputPath =
    route.path === "/" ? path.join(buildDir, "index.html") : path.join(buildDir, route.path, "index.html");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, dom.serialize(), "utf8");
}

console.log(`Generated static SEO shells for ${staticContentRoutes.length} routes.`);
