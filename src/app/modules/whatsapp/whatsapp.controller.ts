import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import { WhatsAppService } from "./whatsapp.service.js";

// GET /webhook  — Meta sends this to verify the endpoint
const verifyWebhook = (req: Request, res: Response) => {
    const mode = req.query["hub.mode"] as string;
    const token = req.query["hub.verify_token"] as string;
    const challenge = req.query["hub.challenge"] as string;

    const result = WhatsAppService.verifyWebhook(mode, token, challenge);
    if (result !== null) {
        res.status(200).send(result);
    } else {
        res.status(403).send("Forbidden");
    }
};

// POST /webhook  — Meta sends incoming messages here
const handleWebhook = catchAsync(async (req: Request, res: Response) => {
    await WhatsAppService.handleIncomingWebhook(req.body);
    // Always respond 200 quickly so Meta doesn't retry
    res.status(200).send("EVENT_RECEIVED");
});

// GET /conversations
const getConversations = catchAsync(async (req: Request, res: Response) => {
    const { businessBranchId } = req.query as { businessBranchId?: string };
    const data = await WhatsAppService.getConversations(businessBranchId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Conversations retrieved",
        data,
    });
});

// GET /conversations/:id/messages
const getMessages = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await WhatsAppService.getMessages(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Messages retrieved",
        data,
    });
});

// POST /initiate
const initiateConversation = catchAsync(async (req: Request, res: Response) => {
    const { customerPhone, businessBranchId, templateName, templateParams } = req.body;

    if (!customerPhone?.trim()) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "customerPhone is required",
            data: null,
        });
    }

    const data = await WhatsAppService.initiateConversation(
        customerPhone.trim(),
        businessBranchId,
        templateName,
        templateParams || []
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Conversation initiated",
        data,
    });
});

// POST /send
const sendMessage = catchAsync(async (req: Request, res: Response) => {
    const { conversationId, message } = req.body;

    if (!conversationId || !message?.trim()) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "conversationId and message are required",
            data: null,
        });
    }

    const data = await WhatsAppService.sendMessage(conversationId, message.trim());
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Message sent",
        data,
    });
});

// POST /send-media
const sendMediaMessage = catchAsync(async (req: Request, res: Response) => {
    const { conversationId, fileData, fileName, mimeType } = req.body;

    if (!conversationId || !fileData || !fileName || !mimeType) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "conversationId, fileData, fileName, and mimeType are required",
            data: null,
        });
    }

    const data = await WhatsAppService.sendMediaMessage(
        conversationId,
        fileData,
        fileName,
        mimeType
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Media message sent",
        data,
    });
});

// GET /media/:mediaId — proxy Meta media so frontend can display it
const getMedia = catchAsync(async (req: Request, res: Response) => {
    const { mediaId } = req.params;
    const { buffer, contentType } = await WhatsAppService.getMediaBuffer(mediaId);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "private, max-age=3600");
    res.send(buffer);
});

export const WhatsAppController = {
    verifyWebhook,
    handleWebhook,
    initiateConversation,
    getConversations,
    getMessages,
    sendMessage,
    sendMediaMessage,
    getMedia,
};
