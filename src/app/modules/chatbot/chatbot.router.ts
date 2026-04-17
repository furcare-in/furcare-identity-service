// @ts-nocheck
import express from "express";
import { ChatbotController } from "./chatbot.controller.js";
import auth from "../../middleware/auth.js";
import multer from "multer";

const router = express.Router();

// Multer — store file in memory (buffer) so we can forward it to the AI service
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
});

// Send a message to the chatbot
router.post(
    "/",
    auth(),
    ChatbotController.sendMessage
);

// ─── Fix 7: File upload route — proxy to AI service ───────────────────────────
router.post(
    "/upload",
    auth(),
    upload.single("file"),
    ChatbotController.sendMessageWithFile
);

// Clear/reset a chat session
router.delete(
    "/:sessionId",
    auth(),
    ChatbotController.clearSession
);

export const chatbotRouter = router;
