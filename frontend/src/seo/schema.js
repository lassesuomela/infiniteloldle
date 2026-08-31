import { SITE_NAME, SITE_URL } from "./constants";

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Unlimited League of Legends guessing game with champion, ability, splash art, and item quiz modes.",
};

export const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  applicationCategory: "GameApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description:
    "An unlimited League of Legends guessing game inspired by LoLdle and Wordle-style trivia.",
};

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is InfiniteLoLdle?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "InfiniteLoLdle is an unlimited League of Legends guessing game inspired by LoLdle and Wordle-style formats.",
      },
    },
    {
      "@type": "Question",
      name: "Does InfiniteLoLdle have a daily puzzle limit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. InfiniteLoLdle supports unlimited rounds across champion, ability, splash art, and item quiz modes.",
      },
    },
  ],
};
