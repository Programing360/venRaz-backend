import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

/**
 * 1. AI Product Description & Auto-Category Generator
 */
export const generateProductDescriptionService = async (
  title: string,
  category?: string,
  keywords?: string[],
  language: string = "en",
) => {
  const isBengali =
    language.toLowerCase() === "bn" || language.toLowerCase() === "bangla";
  const targetLanguage = isBengali ? "Bengali (বাংলা)" : "English";

  const prompt = `
You are an expert e-commerce copywriter. Write a compelling, SEO-optimized product description and bullet points strictly in ${targetLanguage} based on the details below.

Product Title: ${title}
Category: ${category || "General"}
Key Features/Keywords: ${keywords?.join(", ") || "High quality, authentic"}

IMPORTANT: The output values for "description" and "highlights" MUST be strictly in ${targetLanguage}.

Return ONLY a valid JSON object matching this schema (do not wrap in markdown or codeblocks):
{
  "description": "Product description in ${targetLanguage}",
  "highlights": ["Highlight 1 in ${targetLanguage}", "Highlight 2 in ${targetLanguage}"],
  "suggestedCategory": "Single best category name based on title (e.g. Organic Food, Grocery, Electronics)"
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash", // Stable model for reliability
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      maxOutputTokens: 250, // জেনারেট করার সময় অর্ধেকের বেশি কমিয়ে দেবে
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error("AI থেকে সঠিক রেসপন্স পাওয়া যায়নি।");
  }

  return JSON.parse(responseText);
};

/**
 * 2. AI Smart Search & Query Parser (Task 2)
 */
export const parseSearchQueryWithAI = async (userQuery: string) => {
  const prompt = `
Analyze this e-commerce search query: "${userQuery}".
Extract the core product keyword, category, and price range.

Return ONLY a JSON object:
{
  "searchKeyword": "Main search term without price or location terms",
  "category": "Extracted category or empty string",
  "minPrice": null,
  "maxPrice": null
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Fast response for search
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 150,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      return {
        searchKeyword: userQuery,
        category: "",
        minPrice: null,
        maxPrice: null,
      };
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error("AI Search Parse Error:", error);
    return {
      searchKeyword: userQuery,
      category: "",
      minPrice: null,
      maxPrice: null,
    };
  }
};
