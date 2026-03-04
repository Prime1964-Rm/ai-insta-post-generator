import axios from "axios";

export async function generateSlides(newsText) {
    const prompt = `
    Return ONLY valid JSON.
    
    Create Instagram carousel slides.
    
    Rules:
    - 5 slides
    - Simple language
    - AI + Finance audience
    
    Slides:
    1 Hook
    2 News summary
    3 Why it matters
    4 Impact on investors
    5 CTA
    
    Format:
    {
     "slides":[
       {"title":"", "content":""}
     ]
    }
    
    News:
    ${newsText}
    `;

  const res = await axios.post("http://localhost:11434/api/generate", {
    model: "phi3",
    prompt,
    stream: false
  });

  return res.data.response;
}