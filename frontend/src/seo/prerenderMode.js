export default function isPrerenderMode() {
  if (typeof window === "undefined") {
    return false;
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get("prerender") === "1") {
    return true;
  }

  return navigator.userAgent.includes("InfiniteLoLdlePrerender");
}
