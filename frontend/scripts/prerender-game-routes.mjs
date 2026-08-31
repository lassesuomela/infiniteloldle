import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";
import { JSDOM } from "jsdom";
import { gameRoutes } from "./seo-routes.mjs";

const previewPort = 4173;
const baseUrl = `http://127.0.0.1:${previewPort}`;
const buildDir = path.resolve("build");

function waitForServer(proc, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Timed out waiting for preview server."));
    }, timeoutMs);

    const onData = (chunk) => {
      const text = chunk.toString();
      if (text.includes("Local")) {
        clearTimeout(timeout);
        proc.stdout.off("data", onData);
        proc.stderr.off("data", onData);
        resolve();
      }
    };
    proc.stdout.on("data", onData);
    proc.stderr.on("data", onData);
  });
}

const preview = spawn("npm", ["run", "preview", "--", "--host", "127.0.0.1", "--port", String(previewPort)], {
  stdio: ["ignore", "pipe", "pipe"],
  env: process.env,
  detached: true,
});

try {
  await waitForServer(preview);

  const browser = await chromium.launch();
  const page = await browser.newPage({
    userAgent: "InfiniteLoLdlePrerenderBot/1.0",
  });

  for (const route of gameRoutes) {
    await page.goto(`${baseUrl}${route}?prerender=1`, { waitUntil: "networkidle" });
    await page.waitForSelector("h1");
    const html = await page.content();
    const dom = new JSDOM(html);
    dom.window.document.querySelectorAll("noscript").forEach((node) => node.remove());

    const outputPath = path.join(buildDir, route, "index.html");
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, dom.serialize(), "utf8");
  }

  await browser.close();
  console.log(`Prerendered ${gameRoutes.length} game routes.`);
} finally {
  try {
    process.kill(-preview.pid, "SIGTERM");
  } catch (error) {
    // already stopped
  }
  preview.unref();
}
