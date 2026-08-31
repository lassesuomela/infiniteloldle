export const SITE_URL = "https://www.infiniteloldle.com";

export const canonicalRoutes = [
  "/",
  "/game/champion",
  "/game/ability",
  "/game/splash",
  "/game/item",
  "/game/item/legacy",
  "/leaderboard",
  "/stats",
  "/about",
  "/legal",
];

export const gameRoutes = [
  "/game/champion",
  "/game/ability",
  "/game/splash",
  "/game/item",
  "/game/item/legacy",
];

export const staticContentRoutes = [
  {
    path: "/",
    title: "Unlimited LoLdle – League of Legends Guessing Game | InfiniteLoLdle",
    description:
      "Play unlimited League of Legends guessing rounds in champion, ability, splash art, item, and legacy item modes. InfiniteLoLdle is an independent LoLdle alternative.",
    content: `
      <main class="container pb-5 mb-5">
        <h1 class="text-center pt-4 pb-3">Unlimited LoLdle – League of Legends Guessing Game</h1>
        <p>InfiniteLoLdle is an unlimited League of Legends guessing game inspired by Wordle-style formats and LoLdle.</p>
        <p>Play champion, ability, splash-art, item, and legacy-item quizzes without daily limits.</p>
        <h2>Game modes</h2>
        <ul>
          <li><a href="/game/champion">Champion mode</a></li>
          <li><a href="/game/ability">Ability mode</a></li>
          <li><a href="/game/splash">Splash-art mode</a></li>
          <li><a href="/game/item">Item mode</a></li>
          <li><a href="/game/item/legacy">Legacy item mode</a></li>
        </ul>
        <h2>FAQ</h2>
        <p><strong>Is this limited to one daily puzzle?</strong> No, rounds are unlimited.</p>
        <p><strong>Is this affiliated with Riot Games?</strong> No, it is an independent fan project.</p>
      </main>
    `,
  },
  {
    path: "/about",
    title: "About InfiniteLoLdle | InfiniteLoLdle",
    description:
      "Learn what InfiniteLoLdle is, how each game mode works, and why it is an independent unlimited LoLdle alternative.",
    content: `
      <main class="container mb-5 pb-4">
        <h1 class="text-center pt-4 pb-3">About InfiniteLoLdle</h1>
        <p>InfiniteLoLdle is an unlimited League of Legends guessing game inspired by LoLdle and Wordle-style formats.</p>
        <p>Modes include champion, ability, splash art, item, and legacy item quizzes designed for continued play beyond a single daily puzzle.</p>
        <p>InfiniteLoLdle is an independent project and is not affiliated with Riot Games. League of Legends is a Riot Games trademark.</p>
      </main>
    `,
  },
  {
    path: "/legal",
    title: "Legal and Privacy | InfiniteLoLdle",
    description:
      "Read the legal disclaimer and privacy information for InfiniteLoLdle, including Riot Games trademark and affiliation statements.",
    content: `
      <main class="container pb-5">
        <h1 class="text-center pt-4 pb-3">Legal</h1>
        <p>InfiniteLoLdle is not endorsed by Riot Games and does not reflect the views of Riot Games.</p>
        <p>Riot Games and League of Legends are trademarks or registered trademarks of Riot Games, Inc.</p>
      </main>
    `,
  },
  {
    path: "/leaderboard",
    title: "League Guessing Game Leaderboard | InfiniteLoLdle",
    description:
      "View top InfiniteLoLdle players and compare scores across unlimited League of Legends guessing rounds.",
    content: `
      <main class="container pb-5 mb-5">
        <h1 class="text-center pt-4 pb-3">Leaderboard</h1>
        <p>Track top InfiniteLoLdle players and compare progress across game rounds.</p>
        <p>Return to <a href="/game/champion">champion mode</a> or try <a href="/game/ability">ability mode</a>.</p>
      </main>
    `,
  },
  {
    path: "/stats",
    title: "InfiniteLoLdle Statistics | InfiniteLoLdle",
    description:
      "Review InfiniteLoLdle platform statistics, player activity, and gameplay trends for the unlimited League of Legends guessing game.",
    content: `
      <main class="container pb-5">
        <h1 class="text-center pt-4 pb-3">Statistics</h1>
        <p>This page summarizes public aggregate statistics including platform activity and gameplay trends.</p>
        <p>Statistics are displayed as public metrics and do not expose private player information.</p>
      </main>
    `,
  },
];
