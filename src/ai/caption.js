import axios from "axios";

export async function generateCaption(newsText) {
  const prompt = `
Write an Instagram caption for this AI + Finance news.

Rules:
- Short hook
- Simple explanation
- Why it matters for investors
- End with CTA
- Add 8 hashtags

News:
${newsText}
`;

  const res = await axios.post("http://localhost:11434/api/generate", {
    model: "phi3",
    prompt,
    stream: false
  });

  return res.data.response.trim();
}