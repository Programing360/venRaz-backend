import OpenAI from "openai";
import { AIIntentResult, IChatPayload } from "./chat.interface";
import { getAllProductsFromDB } from "../../../models/products/product.service";
import { WishlistService } from "../../../models/wishlist/wishlist.service";
import { CartServices } from "../../../models/card/cart.service";
import { ChatMessage, ChatMessageType } from "./chatHistory.model";

// 🎯 ১. সবকটি API Key একটি অ্যারেতে রাখা
const API_KEYS = [
  process.env.OPENROUTER_API_KEY_1,
  process.env.OPENROUTER_API_KEY_2,
  process.env.OPENROUTER_API_KEY_3,
]
  .map((key) => key?.trim())
  .filter(
    (key): key is string =>
      Boolean(key) && key !== "undefined" && key !== "null" && key !== "",
  ); // খালি বা undefined key গুলো বাদ দিবে

// 🎯 ২. ডাইনামিক্যালি OpenAI/OpenRouter ক্লায়েন্ট তৈরি করার হেলপার ফাংশন
const getOpenAIClient = (apiKey: string) => {
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "VenRaz Ecommerce",
    },
  });
};

// 🎯 ৩. API Key Rotate করে রিকোয়েস্ট পাঠানোর ফাংশন
const callAIWithKeyRotation = async (message: string): Promise<string> => {
  if (API_KEYS.length === 0) {
    throw new Error(
      "No OpenRouter API Keys provided in environment variables!",
    );
  }

  let lastError: any = null;

  // সবগুলো API Key একটি একটি করে লুপ চালিয়ে ট্রাই করা হবে
  for (let i = 0; i < API_KEYS.length; i++) {
    const currentApiKey = API_KEYS[i];
    console.log(`🤖 Attempting AI Request with API Key #${i + 1}...`);

    try {
      const client = getOpenAIClient(currentApiKey);

      const response = await client.chat.completions.create({
        model: "~openai/gpt-sol-latest", // ফ্রি এবং ফাস্ট মডেল
        messages: [
          {
            role: "system",
            content: `You are the AI Shopping Assistant for "VenRaz", a modern e-commerce platform in Bangladesh. 
Analyze user messages (Bangla, Banglish, or English) and convert them into structured JSON.
Keep Bangla replies concise, friendly, and under 30 words.

Rules & Intents:
1. "SEARCH_PRODUCT": Triggered when users ask to see/buy products (e.g., "pant dekhaw", "shoe"). Extract searchKeyword, category, minPrice, maxPrice. Extract only the EXACT core product search term into "searchKeyword" (e.g. "macbook", "apple", "shirt"). Do NOT add filler words like "laptop", "dekhaw", "chai", "price".
2. "PRODUCT_ADVICE": Triggered when users ask for opinion, review, specs of a product (e.g., "ai laptop kemon hobe?"). Provide concise evaluation in "replyText" and name in "searchKeyword".
3. "GET_CART": User wants to view cart.
4. "GET_WISHLIST": User wants to view wishlist.
5. "TRACK_ORDER": User asks about delivery status or provides order ID.
6. "FAQ": E-commerce policies, delivery timing, return policy.
7. "GENERAL_CHAT": Casual conversations.

Schema Requirement (Return ONLY raw valid JSON):
{
  "intent": "SEARCH_PRODUCT" | "PRODUCT_ADVICE" | "GET_CART" | "GET_WISHLIST" | "TRACK_ORDER" | "FAQ" | "GENERAL_CHAT",
  "searchParams": {
    "searchKeyword": "string or undefined",
    "category": "string or undefined",
    "minPrice": number or undefined,
    "maxPrice": number or undefined
  },
  "orderId": "string or undefined",
  "faqAnswer": "string or undefined",
  "replyText": "string or undefined"
}`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 400,
      } as any);

      const content = response.choices[0]?.message?.content;
      if (content) {
        console.log(`✅ Success with API Key #${i + 1}!`);
        return content; // সফল হলে এখান থেকেই উত্তর রিটার্ন করে বের হয়ে যাবে
      }
    } catch (error: any) {
      console.warn(`⚠️ API Key #${i + 1} failed:`, error?.message || error);
      lastError = error;
      // এরর হলে লুপ থামবে না, পরের API Key দিয়ে ট্রাই করবে (Loop continues to next iteration)
    }
  }

  // যদি সবগুলো API Key-তেই এরর আসে
  throw lastError || new Error("All API Keys failed.");
};

// 🎯 ৪. AI এবং Fast-Path দিয়ে Intent Extraction লজিক
const classifyUserIntent = async (message: string): Promise<AIIntentResult> => {
  const cleanMsg = message.trim().toLowerCase();

  // 🚀 FAST-PATH 1: সাধারণ গ্রিটিংস
  if (/^(hi|hello|hey|হ্যালো|হে|কেমন আছেন|সালাম|hlw)$/i.test(cleanMsg)) {
    return {
      intent: "GENERAL_CHAT",
      replyText: "হ্যালো! VenRaz-এ আপনাকে স্বাগতম। কীভাবে সাহায্য করতে পারি?",
    };
  }
  // 🚀 FAST-PATH 2: কার্ট এবং উইশলিস্ট
  if (/cart|কার্ট|ঝুড়ি/i.test(cleanMsg) && !cleanMsg.includes("add")) {
    return { intent: "GET_CART" };
  }
  if (/wishlist|উইশলিস্ট|পছন্দ/i.test(cleanMsg) && !cleanMsg.includes("add")) {
    return { intent: "GET_WISHLIST" };
  }
  // 🚀 FAST-PATH 3: FAQ
  if (
    cleanMsg.includes("ডেলিভারি") ||
    cleanMsg.includes("delivery") ||
    cleanMsg.includes("শিপিং")
  ) {
    return {
      intent: "FAQ",
      faqAnswer:
        "VenRaz-এ ঢাকার ভেতরে ক্যাশ অন ডেলিভারি চার্জ ৬০ টাকা এবং ঢাকার বাইরে ১২০ টাকা। সাধারণত ২-৪ কার্যদিবসের মধ্যে অর্ডার ডেলিভারি করা হয়।",
    };
  }

  // 🤖 ROTATED API CALL
  try {
    let rawText = await callAIWithKeyRotation(message);

    // Clean up Markdown wrap
    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
    }

    try {
      return JSON.parse(rawText) as AIIntentResult;
    } catch (parseErr) {
      console.error("JSON Parse Error, Raw Text was:", rawText);
      return {
        intent: "SEARCH_PRODUCT",
        searchParams: { searchKeyword: message },
      };
    }
  } catch (error) {
    console.error(
      "All OpenRouter API Keys Failed / Fallback triggered:",
      error,
    );

    // Default Fallback
    return {
      intent: "SEARCH_PRODUCT",
      searchParams: { searchKeyword: message },
    };
  }
};

// 🎯 ৫. মেইন চ্যাট সার্ভিস প্রসেসর
// export const processChatMessageService = async (payload: IChatPayload) => {
//   const { message, userFrequentCategory, userId } = payload;

//   // 1. ইউজারের পাঠানো মেসেজটি সেভ করুন
//   if (userId) {
//     await ChatMessage.create({
//       userId,
//       sender: "user",
//       message: message,
//     });
//   }

//   const aiParsed = await classifyUserIntent(message);

//   // (ধরি আপনার AI রেসপন্সটি তৈরি হলো botResponse ভেরিয়েবলে)
//   let botResponse = {
//     reply: "হ্যালো! কীভাবে সাহায্য করতে পারি?",
//     type: "TEXT" as ChatMessageType,
//     data: null,
//   };

//   // 2. AI Bot-এর রেসপন্স সেভ করার সময়
//   const botResponseType: ChatMessageType =
//     (aiParsed.type as ChatMessageType) || "TEXT";
//   if (userId) {
//     await ChatMessage.create({
//       userId,
//       sender: "bot",
//       message: botResponse.reply,
//       type: botResponseType,
//       data: botResponse.data,
//     });
//     return botResponse;
//   }

//   // 🛒 Intent: GET_CART
//   if (aiParsed.intent === "GET_CART") {
//     if (!userId) {
//       return {
//         reply: "আপনার কার্টের আইটেমগুলো দেখতে অনুগ্রহ করে প্রথমে লগইন করুন।",
//         type: "TEXT",
//       };
//     }
//     const cartData = await CartServices.getCartFromDB(userId);
//     const products = cartData?.items || [];

//     return {
//       reply:
//         products.length > 0
//           ? "আপনার কার্টে থাকা প্রোডাক্টগুলো নিচে দেওয়া হলো:"
//           : "আপনার কার্টটি বর্তমানে খালি রয়েছে।",
//       type: "PRODUCT_LIST",
//       data: products,
//     };
//   }

//   // 💖 Intent: GET_WISHLIST
//   if (aiParsed.intent === "GET_WISHLIST") {
//     if (!userId) {
//       return {
//         reply:
//           "আপনার উইশলিস্টের প্রোডাক্টগুলো দেখতে অনুগ্রহ করে প্রথমে লগইন করুন।",
//         type: "TEXT",
//       };
//     }

//     const wishlistData = await WishlistService.getWishlistFromDB(userId);
//     const products = (wishlistData?.productIds as any) || [];

//     return {
//       reply:
//         products.length > 0
//           ? "আপনার পছন্দের উইশলিস্ট প্রোডাক্টগুলো নিচে দেওয়া হলো:"
//           : "আপনার উইশলিস্টে কোনো প্রোডাক্ট যুক্ত করা নেই।",
//       type: "PRODUCT_LIST",
//       data: products,
//     };
//   }

//   // 💡 Intent: PRODUCT_ADVICE
//   if (aiParsed.intent === "PRODUCT_ADVICE") {
//     const queryTerm = aiParsed.searchParams?.searchKeyword || message;
//     const productData = await getAllProductsFromDB({
//       search: queryTerm,
//       limit: "4",
//     });

//     return {
//       reply: aiParsed.replyText || "প্রোডাক্টটি সম্পর্কিত তথ্য নিচে দেওয়া হলো:",
//       type:
//         productData.products && productData.products.length > 0
//           ? "PRODUCT_LIST"
//           : "TEXT",
//       data: productData.products || [],
//     };
//   }

//   // 🛍️ Intent: SEARCH_PRODUCT
//   if (aiParsed.intent === "SEARCH_PRODUCT") {
//     const searchParams = aiParsed.searchParams || {};
//     const queryTerm =
//       searchParams.searchKeyword !== undefined
//         ? searchParams.searchKeyword
//         : message;

//     const productData = await getAllProductsFromDB({
//       search: queryTerm,
//       category: searchParams.category,
//       minPrice: searchParams.minPrice
//         ? String(searchParams.minPrice)
//         : undefined,
//       maxPrice: searchParams.maxPrice
//         ? String(searchParams.maxPrice)
//         : undefined,
//       userFrequentCategory: userFrequentCategory,
//       limit: "6",
//     });

//     const hasProducts = productData.products && productData.products.length > 0;

//     return {
//       reply: hasProducts
//         ? "আপনার পছন্দের ওপর ভিত্তি করে VenRaz-এর কিছু বেস্ট প্রোডাক্ট নিচে দেওয়া হলো:"
//         : "দুঃখিত, আপনার খোঁজা প্রোডাক্টটি বর্তমানে পাওয়া যায়নি। অন্য কোনো ক্যাটাগরি চেষ্টা করে দেখতে পারেন।",
//       type: "PRODUCT_LIST",
//       data: productData.products,
//     };
//   }

//   // 📦 Intent: TRACK_ORDER
//   if (aiParsed.intent === "TRACK_ORDER") {
//     const orderId = aiParsed.orderId;
//     if (!orderId) {
//       return {
//         reply:
//           "আপনার অর্ডার ট্র্যাক করতে অনুগ্রহ করে সঠিক অর্ডার আইডিটি (যেমন: #12345) লিখুন।",
//         type: "TEXT",
//       };
//     }

//     return {
//       reply: `আপনার অর্ডারটি (#${orderId}) প্রসেসিং অবস্থায় রয়েছে। খুব শীঘ্রই ডেলিভারি পার্টনারের কাছে হস্তান্তরণ করা হবে।`,
//       type: "ORDER_STATUS",
//       data: { orderId, status: "Processing" },
//     };
//   }

//   // ❓ Intent: FAQ
//   if (aiParsed.intent === "FAQ") {
//     return {
//       reply:
//         aiParsed.faqAnswer ||
//         "VenRaz সম্পর্কিত অতিরিক্ত তথ্যের জন্য আমাদের সাপোর্ট সেন্টারে যোগাযোগ করতে পারেন।",
//       type: "TEXT",
//     };
//   }

//   // 💬 Intent: GENERAL_CHAT
//   return {
//     reply:
//       aiParsed.replyText ||
//       "হ্যালো! VenRaz ই-কমার্সে আপনাকে স্বাগতম। আজ কীভাবে সাহায্য করতে পারি?",
//     type: "TEXT",
//   };
// };

export const processChatMessageService = async (payload: IChatPayload) => {
  const { message, userFrequentCategory, userId } = payload;
  console.log("Incoming Payload:", { message, userId });
  // 1. ইউজারের পাঠানো মেসেজটি সেভ করুন
  if (userId) {
    const result = await ChatMessage.create({
      userId,
      sender: "user",
      message: message,
      type: "TEXT" as ChatMessageType,
    });
    console.log(result);
  }

  // Intent classify করা
  const aiParsed = await classifyUserIntent(message);

  // ফাইনাল রেসপন্স রাখার ভ্যারিয়েবল
  let botResponse: {
    reply: string;
    type: ChatMessageType;
    data?: any;
  } = {
    reply:
      "হ্যালো! VenRaz ই-কমার্সে আপনাকে স্বাগতম। আজ কীভাবে সাহায্য করতে পারি?",
    type: "TEXT" as ChatMessageType,
    data: null,
  };

  // 🛒 Intent 1: GET_CART
  if (aiParsed.intent === "GET_CART") {
    if (!userId) {
      botResponse = {
        reply: "আপনার কার্টের আইটেমগুলো দেখতে অনুগ্রহ করে প্রথমে লগইন করুন।",
        type: "TEXT",
      };
    } else {
      const cartData = await CartServices.getCartFromDB(userId);
      const products = cartData?.items || [];
      botResponse = {
        reply:
          products.length > 0
            ? "আপনার কার্টে থাকা প্রোডাক্টগুলো নিচে দেওয়া হলো:"
            : "আপনার কার্টটি বর্তমানে খালি রয়েছে।",
        type: "PRODUCT_LIST",
        data: products,
      };
    }
  }

  // 💖 Intent 2: GET_WISHLIST
  else if (aiParsed.intent === "GET_WISHLIST") {
    if (!userId) {
      botResponse = {
        reply:
          "আপনার উইশলিস্টের প্রোডাক্টগুলো দেখতে অনুগ্রহ করে প্রথমে লগইন করুন।",
        type: "TEXT",
      };
    } else {
      const wishlistData = await WishlistService.getWishlistFromDB(userId);
      const products = (wishlistData?.productIds as any) || [];
      botResponse = {
        reply:
          products.length > 0
            ? "আপনার পছন্দের উইশলিস্ট প্রোডাক্টগুলো নিচে দেওয়া হলো:"
            : "আপনার উইশলিস্টে কোনো প্রোডাক্ট যুক্ত করা নেই।",
        type: "PRODUCT_LIST",
        data: products,
      };
    }
  }

  // 💡 Intent 3: PRODUCT_ADVICE
  else if (aiParsed.intent === "PRODUCT_ADVICE") {
    const queryTerm = aiParsed.searchParams?.searchKeyword || message;
    const productData = await getAllProductsFromDB({
      search: queryTerm,
      limit: "4",
    });

    botResponse = {
      reply: aiParsed.replyText || "প্রোডাক্টটি সম্পর্কিত তথ্য নিচে দেওয়া হলো:",
      type:
        productData.products && productData.products.length > 0
          ? "PRODUCT_LIST"
          : "TEXT",
      data: productData.products || [],
    };
  }

  // 🛍️ Intent 4: SEARCH_PRODUCT
  else if (aiParsed.intent === "SEARCH_PRODUCT") {
    const searchParams = aiParsed.searchParams || {};
    const queryTerm =
      searchParams.searchKeyword !== undefined
        ? searchParams.searchKeyword
        : message;

    const productData = await getAllProductsFromDB({
      search: queryTerm,
      category: searchParams.category,
      minPrice: searchParams.minPrice
        ? String(searchParams.minPrice)
        : undefined,
      maxPrice: searchParams.maxPrice
        ? String(searchParams.maxPrice)
        : undefined,
      userFrequentCategory: userFrequentCategory,
      limit: "6",
    });

    const hasProducts = productData.products && productData.products.length > 0;

    botResponse = {
      reply: hasProducts
        ? "আপনার পছন্দের ওপর ভিত্তি করে VenRaz-এর কিছু বেস্ট প্রোডাক্ট নিচে দেওয়া হলো:"
        : "দুঃখিত, আপনার খোঁজা প্রোডাক্টটি বর্তমানে পাওয়া যায়নি। অন্য কোনো ক্যাটাগরি চেষ্টা করে দেখতে পারেন।",
      type: "PRODUCT_LIST",
      data: productData.products || [],
    };
  }

  // 📦 Intent 5: TRACK_ORDER
  else if (aiParsed.intent === "TRACK_ORDER") {
    const orderId = aiParsed.orderId;
    if (!orderId) {
      botResponse = {
        reply:
          "আপনার অর্ডার ট্র্যাক করতে অনুগ্রহ করে সঠিক অর্ডার আইডিটি (যেমন: #12345) লিখুন।",
        type: "TEXT",
      };
    } else {
      botResponse = {
        reply: `আপনার অর্ডারটি (#${orderId}) প্রসেসিং অবস্থায় রয়েছে। খুব শীঘ্রই ডেলিভারি পার্টনারের কাছে হস্তান্তর করা হবে।`,
        type: "ORDER_STATUS",
        data: { orderId, status: "Processing" },
      };
    }
  }

  // ❓ Intent 6: FAQ
  else if (aiParsed.intent === "FAQ") {
    botResponse = {
      reply:
        aiParsed.faqAnswer ||
        "VenRaz সম্পর্কিত অতিরিক্ত তথ্যের জন্য আমাদের সাপোর্ট সেন্টারে যোগাযোগ করতে পারেন।",
      type: "TEXT",
    };
  }

  // 💬 Intent 7: GENERAL_CHAT
  else {
    botResponse = {
      reply:
        aiParsed.replyText ||
        "হ্যালো! VenRaz ই-কমার্সে আপনাকে স্বাগতম। আজ কীভাবে সাহায্য করতে পারি?",
      type: "TEXT",
    };
  }

  // 2. 🚀 AI Bot-এর চূড়ান্ত রেসপন্সটি ডাটাবেজে সেভ করুন
  if (userId) {
    await ChatMessage.create({
      userId,
      sender: "bot",
      message: botResponse.reply,
      type: botResponse.type,
      data: botResponse.data,
    });
  }

  // 3. ফ্রন্টএন্ডে উত্তর রিটার্ন করুন
  return botResponse;
};
