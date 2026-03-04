import fetch from "node-fetch";
import "dotenv/config";

const ACCESS_KEY = process.env.ACCESS_KEY;

export async function fetchBackgroundImage(topic = "finance") {
  try {
    throw error("Testing fallback image"); // ← test fallback
    if (!ACCESS_KEY) {
      console.log("Unsplash key missing → using fallback image");
      return fallbackImage();
    }

    const queryMap = {
      ai: "artificial intelligence abstract futuristic",
      market: "stock market chart abstract dark",
      finance: "digital finance abstract gradient",
      tech: "futuristic technology abstract background"
    };

    const query = queryMap[topic] || "abstract finance gradient";

    const url =
      `https://api.unsplash.com/photos/random` +
      `?query=${encodeURIComponent(query)}` +
      `&orientation=squarish` +
      `&content_filter=high` +
      `&client_id=${ACCESS_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data?.urls?.full) { // ← upgraded from regular → full
      console.log("Unsplash returned empty image");
      return fallbackImage();
    }

    return data.urls.full;

  } catch (err) {
    console.log("Image fetch failed → using fallback");
    return fallbackImage();
  }
}

function fallbackImage() {
  return "https://images.unsplash.com/photo-1656006456698-a981822e4d80?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxODMwOTh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzIxODU1Mjh8&ixlib=rb-4.1.0&q=85";
}