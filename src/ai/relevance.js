import ollama from "ollama";

/*
 Keyword scoring (fast + reliable)
*/
function keywordScore(text) {
  const t = text.toLowerCase();

  const aiKeywords = [
    "ai",
    "artificial intelligence",
    "llm",
    "openai",
    "deepseek",
    "machine learning",
    "automation",
    "chip",
    "nvidia"
  ];

  const financeKeywords = [
    "stock",
    "market",
    "invest",
    "bank",
    "earnings",
    "revenue",
    "shares",
    "ipo",
    "valuation",
    "funding"
  ];

  let score = 0;

  for (const k of aiKeywords) {
    if (t.includes(k)) score += 2;
  }

  for (const k of financeKeywords) {
    if (t.includes(k)) score += 2;
  }

  return score;
}

/*
 Main relevance function
*/
export async function isRelevant(text) {
  const score = keywordScore(text);

  /*
    Fast pass — avoid LLM call
  */
  if (score >= 2) {
    return true;
  }

  /*
    If weak score, use LLM fallback
  */
  try {
    const prompt = `
Decide if this news is about AI, finance, markets, startups, or technology investing.

Reply ONLY with YES or NO.

News:
${text}
`;

    const response = await ollama.chat({
      model: "phi3:mini",
      messages: [{ role: "user", content: prompt }]
    });

    const answer = response.message.content
      .toLowerCase()
      .trim();

    return answer.includes("yes");
  } catch (e) {
    console.log("Relevance model failed, using fallback");
    return false;
  }
}