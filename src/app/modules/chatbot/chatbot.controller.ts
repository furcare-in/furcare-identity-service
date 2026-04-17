// @ts-nocheck
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import { ChatbotService } from "./chatbot.service.js";
import crypto from "crypto";

const sendMessage = catchAsync(async (req: Request, res: Response) => {
    const { message, sessionId, businessBranchId } = req.body;
    
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return sendResponse(res, {
            statusCode: httpStatus.UNAUTHORIZED,
            success: false,
            message: "Authorization token is required",
            data: null,
        });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "Message is required",
            data: null,
        });
    }

    // Use provided sessionId or generate one
    const chatSessionId = sessionId || crypto.randomUUID();

    const result = await ChatbotService.sendMessage(
        chatSessionId,
        message.trim(),
        businessBranchId,
        token
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Message processed successfully",
        data: result,
    });
});

const clearSession = catchAsync(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const token = req.headers.authorization?.split(" ")[1];

    if (!sessionId) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "Session ID is required",
            data: null,
        });
    }

    if (!token) {
        return sendResponse(res, {
            statusCode: httpStatus.UNAUTHORIZED,
            success: false,
            message: "Authorization token is required",
            data: null,
        });
    }

    await ChatbotService.clearSession(sessionId, token);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Chat session cleared",
        data: null,
    });
});

// ─── Fix 7: File Upload Proxy Controller ──────────────────────────────────────
const sendMessageWithFile = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return sendResponse(res, {
            statusCode: httpStatus.UNAUTHORIZED,
            success: false,
            message: "Authorization token is required",
            data: null,
        });
    }

    const formData = {
        message: req.body?.message || "",
        sessionId: req.body?.sessionId || null,
        businessBranchId: req.body?.businessBranchId || null,
        file: (req as any).file || null,
    };

    const result = await ChatbotService.sendMessageWithFile(formData, token);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "File analyzed successfully",
        data: result,
    });
});

export const ChatbotController = {
    sendMessage,
    clearSession,
    sendMessageWithFile,
};
