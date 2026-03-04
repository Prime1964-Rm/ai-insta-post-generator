import "dotenv/config";
import { fetchNews } from "./src/news/rss.js";
import { generateSlides } from "./src/ai/ollama.js";
import { renderSlides } from "./src/carousel/render.js";
import { generateCaption } from "./src/ai/caption.js";
import { isRelevant } from "./src/ai/relevance.js";
import { fetchBackgroundImage } from "./src/images/fetchimages.js";
import { detectTopic } from "./src/utils/topic.js";
import fs from "fs";

/*
 Extract valid JSON block from LLM output safely
*/
function extractJSON(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No JSON found in model output");
  }

  let json = text.substring(start, end + 1);

  // Fix smart quotes from LLM
  json = json
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");

  return json;
}

export const run = async () => {
  try {
    console.log("Fetching news feeds...");

    const news = await fetchNews();

    if (!news || news.length === 0) {
      throw new Error("No news returned from RSS");
    }

    console.log("News candidates:", news.length);

    let article = null;

    /*
      Try up to 5 articles until one passes relevance
    */
    for (let i = 0; i < news.length && i < 5; i++) {
      const candidate = news[i];

      console.log("\nChecking:", candidate.title);

      const relevant = await isRelevant(
        candidate.title + "\n" + candidate.content
      );

      if (relevant) {
        article = candidate;
        break;
      } else {
        console.log("Low-quality news skipped");
      }
    }

    if (!article) {
      console.log("\nNo relevant news found today.");
      return;
    }

    console.log("\nNews selected:");
    console.log(article.title);

    /*
      Detect topic for background image
    */
    const topic = detectTopic(article.title + article.content);

    console.log("Detected topic:", topic);

    /*
      Fetch background image
    */
    const imageUrl = await fetchBackgroundImage(topic);

    console.log("Background image fetched",imageUrl);

    /*
      Generate slides via Ollama
    */
    console.log("\nGenerating slides using Ollama...\n");

    const raw = await generateSlides(
      article.title + "\n" + article.content
    );

    let parsed = null;

try {
  const jsonString = extractJSON(raw);
  parsed = JSON.parse(jsonString);
} catch (err) {
  console.log("\nJSON parsing failed, skipping slides.");
  console.log("Raw model output:\n", raw);
}

if (!parsed?.slides?.length) {
  console.log("No valid slides detected, using fallback slide.");
  parsed = {
    slides: [
      {
        title: "Default Slide",
        content: "Couldn't generate slide automatically today."
      }
    ]
  };
}

    /*
      Render carousel images
    */
    console.log("\nRendering carousel images...");

    await renderSlides(parsed.slides, imageUrl);

    /*
      Generate caption
    */
    console.log("\nGenerating caption...");

    const caption = await generateCaption(
      article.title + "\n" + article.content
    );

    fs.writeFileSync("output/caption.txt", caption);

    /*
      Save metadata
    */
    fs.writeFileSync(
      "output/meta.json",
      JSON.stringify(
        {
          title: article.title,
          link: article.link,
          date: new Date(),
          image: imageUrl
        },
        null,
        2
      )
    );

    console.log("\nDone ✅");
    console.log("Check output folder.");
  } catch (error) {
    console.error("\nPipeline failed:", error);
  }
};

run();