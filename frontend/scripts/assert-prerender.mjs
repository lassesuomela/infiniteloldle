import fs from "node:fs/promises";
import path from "node:path";
import { canonicalRoutes } from "./seo-routes.mjs";

const buildDir = path.resolve("build");
const errors = [];

for (const route of canonicalRoutes) {
  const filePath = route === "/" ? path.join(buildDir, "index.html") : path.join(buildDir, route, "index.html");

  let html;
  try {
    html = await fs.readFile(filePath, "utf8");
  } catch (error) {
    errors.push(`Missing prerendered file: ${filePath}`);
    continue;
  }

  if (!/<title>.*<\/title>/i.test(html)) {
    errors.push(`Missing <title> in ${route}`);
  }
  if (!/<h1[\s>]/i.test(html)) {
    errors.push(`Missing <h1> in ${route}`);
  }
  if (!/rel="canonical"/i.test(html)) {
    errors.push(`Missing canonical link in ${route}`);
  }
  if (html.includes("You need to enable JavaScript to run this app.")) {
    errors.push(`Noscript placeholder still present in ${route}`);
  }
}

if (errors.length > 0) {
  console.error("SEO prerender assertions failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`SEO prerender assertions passed for ${canonicalRoutes.length} routes.`);
