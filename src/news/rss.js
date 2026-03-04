import Parser from "rss-parser";

const parser = new Parser();

/*
Better quality feeds (finance + AI)
*/
const feeds = [
  "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
  "https://www.cnbc.com/id/10001147/device/rss/rss.html",
  "https://feeds.feedburner.com/TechCrunch/"
];

function cleanText(text = "") {
  return text.replace(/\s+/g, " ").trim();
}

function isBasicQuality(item) {
  if (!item.title) return false;
  if (item.title.length < 25) return false;

  const t = item.title.toLowerCase();

  const keywords = [
    "ai",
    "artificial",
    "finance",
    "market",
    "bank",
    "stock",
    "tech"
  ];

  return keywords.some(k => t.includes(k));
}

export async function fetchNews() {
  console.log("Fetching news feeds...");

  let items = [];

  for (const feed of feeds) {
    try {
      const res = await parser.parseURL(feed);
      items = items.concat(res.items || []);
    } catch (e) {
      console.log("Feed failed:", feed);
    }
  }

  if (!items.length) {
    throw new Error("No RSS items fetched");
  }

  /*
    Randomize order
  */
  items = items.sort(() => Math.random() - 0.5);

  const results = [];

  for (const item of items) {
    if (!isBasicQuality(item)) continue;

    results.push({
      title: cleanText(item.title),
      link: item.link || "",
      content: cleanText(
        item.contentSnippet ||
        item.content ||
        item.summary ||
        item.title
      )
    });

    if (results.length >= 3) break; // keep small batch
  }

  /*
    Fallback if filters too strict
  */
  if (!results.length) {
    const fallback = items[0];

    results.push({
      title: cleanText(fallback.title),
      link: fallback.link || "",
      content: cleanText(
        fallback.contentSnippet ||
        fallback.content ||
        fallback.title
      )
    });
  }

  console.log("News candidates:", results.length);

  return results;
}