export function detectTopic(text) {
    text = text.toLowerCase();
  
    if (text.match(/ai|artificial intelligence|openai|nvidia/)) return "ai";
    if (text.match(/stock|market|shares|nasdaq|dow|ipo/)) return "market";
    if (text.match(/tech|software|cloud|chip/)) return "tech";
    return "finance";
  }