import { Request, Response } from "express";
import { processChatMessageService } from "./chat.service";
import { ChatMessage } from "./chatHistory.model";

export const handleChatMessage = async (req: Request, res: Response) => {
  try {
    const { message, userFrequentCategory } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }
    console.log(req.user);
    const result = await processChatMessageService({
      message,
      userFrequentCategory,
      userId: req.user?._id, // Auth Middleware থাকলে
    });

    return res.status(200).json({
      success: true,
      message: "Chat response generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Chat Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process chat message",
    });
  }
};

// GET: /api/v1/chat/history/:userId
export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // শেষ ৫০টি মেসেজ সময়ের ক্রমানুসারে নিয়ে আসা
    const history = await ChatMessage.find({ userId })
      .sort({ createdAt: 1 }) // পুরনো থেকে নতুন সাজানো
      .limit(50);

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "History fetch failed", error });
  }
};
