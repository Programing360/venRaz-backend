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
    model: "gemini-2.0-flash", // Fixed: gemini-3.6-flash থেকে কমপ্যাটিবল মডেলে চ্যাঞ্জ করা হয়েছে
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      maxOutputTokens: 250,
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error("AI থেকে সঠিক রেসপন্স পাওয়া যায়নি।");
  }

  return JSON.parse(responseText);
};

/**
 * 2. AI Smart Search & Query Parser (Enhanced Number & Price Support)
 */
export const parseSearchQueryWithAI = async (userQuery: string) => {
  const prompt = `
Analyze this e-commerce search query: "${userQuery}".
Extract intent, keywords, brand, category, and target price / price range.

Rules:
1. If the input is ONLY a number or exact price (e.g., "334", "334 tk", "under 500"), set "exactPrice" or "maxPrice" accordingly, and set "searchKeyword" to empty string ("").
2. If it contains product/brand names along with price (e.g. "Samsung under 20000"), extract "searchKeyword" as "Samsung" and "maxPrice" as 20000.
3. Extract category or brand if explicitly mentioned or strongly implied.

Return ONLY a JSON object:
{
  "searchKeyword": "Main keyword/brand without price terms (or empty string if only price was searched)",
  "category": "Extracted category or empty string",
  "brand": "Extracted brand name or empty string",
  "exactPrice": null,
  "minPrice": null,
  "maxPrice": null
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
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
        brand: "",
        exactPrice: !isNaN(Number(userQuery)) ? Number(userQuery) : null,
        minPrice: null,
        maxPrice: null,
      };
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error("AI Search Parse Error:", error);
    const isNumber = !isNaN(Number(userQuery));
    return {
      searchKeyword: isNumber ? "" : userQuery,
      category: "",
      brand: "",
      exactPrice: isNumber ? Number(userQuery) : null,
      minPrice: null,
      maxPrice: null,
    };
  }
};

/**
 * 3. NEW: AI Product Auto Background Selector
 * Cloudinary Auto-Tagging থেকে পাওয়া ট্যাগ থেকে সেরা ব্যাকগ্রাউন্ড সিলেক্ট করবে
 */
export const suggestBestBackground = async (
  productTags: string[],
  availableBackgrounds: string[],
) => {
  if (!productTags || productTags.length === 0) {
    return availableBackgrounds[0] || "minimal_studio_bg";
  }

  const prompt = `
You are an expert e-commerce product visual designer.
Based on these product tags: [${productTags.join(", ")}], 
select the single BEST matching background ID from this list: ${JSON.stringify(availableBackgrounds)}.

Return ONLY a JSON object:
{
  "selectedBg": "chosen_background_id_from_list"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 50,
      },
    });

    const responseText = response.text;
    if (!responseText) return availableBackgrounds[0];

    const parsed = JSON.parse(responseText);
    return parsed.selectedBg || availableBackgrounds[0];
  } catch (error) {
    console.error("AI Background Suggestion Error:", error);
    return availableBackgrounds[0]; // Failure হলে ডিফল্ট ব্যাকগ্রাউন্ড
  }
};
