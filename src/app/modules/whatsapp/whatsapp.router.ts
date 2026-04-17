// @ts-nocheck
import express from "express";
import { WhatsAppController } from "./whatsapp.controller.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

// Meta webhook verification (no auth — Meta calls this)
router.get("/webhook", WhatsAppController.verifyWebhook);

// Meta webhook incoming messages (no auth — Meta calls this)
router.post("/webhook", WhatsAppController.handleWebhook);

// Protected routes (staff access)
router.post("/initiate", auth(), WhatsAppController.initiateConversation);
router.get("/conversations", auth(), WhatsAppController.getConversations);
router.get("/conversations/:id/messages", auth(), WhatsAppController.getMessages);
router.post("/send", auth(), WhatsAppController.sendMessage);
router.post("/send-media", auth(), WhatsAppController.sendMediaMessage);
router.get("/media/:mediaId", auth(), WhatsAppController.getMedia);

export const whatsappRouter = router;
