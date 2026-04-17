// @ts-nocheck
// @ts-nocheck
import prisma from "../../../utils/prisma.js";
import env from "../../../utils/env.js";
import { handleBotMessage } from "./whatsapp.bot.js";

const GRAPH_URL = `https://graph.facebook.com/${env.whatsapp.apiVersion}`;

// ─── Webhook verification ──────────────────────────────────────────────────
const verifyWebhook = (
    mode: string,
    token: string,
    challenge: string
): string | null => {
    if (mode === "subscribe" && token === env.whatsapp.verifyToken) {
        return challenge;
    }
    return null;
};

// ─── Handle incoming webhook from Meta ────────────────────────────────────
const handleIncomingWebhook = async (body: any): Promise<void> => {
    console.log("[WhatsApp Webhook] Received:", JSON.stringify(body).substring(0, 500));

    if (body.object !== "whatsapp_business_account") {
        console.log("[WhatsApp Webhook] Ignored — object is not whatsapp_business_account:", body.object);
        return;
    }

    for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
            const value = change.value;

            // Handle message status updates (sent, delivered, read)
            if (value?.statuses?.length) {
                console.log("[WhatsApp Webhook] Status update:", JSON.stringify(value.statuses));
            }

            if (!value?.messages?.length) continue;

            for (const message of value.messages) {
                const customerPhone: string = message.from;
                const waMessageId: string = message.id;
                const customerName: string =
                    value.contacts?.[0]?.profile?.name || customerPhone;
                const msgType: string = message.type || "text";

                console.log(`[WhatsApp Webhook] Incoming ${msgType} from ${customerPhone} (${customerName})`);

                // Extract body text and media ID based on message type
                let msgBody = "";
                let mediaId: string | undefined;

                if (msgType === "text") {
                    msgBody = message.text?.body || "";
                } else if (msgType === "interactive") {
                    const iType = message.interactive?.type;
                    if (iType === "button_reply") {
                        msgBody = message.interactive.button_reply.id;
                    } else if (iType === "list_reply") {
                        msgBody = message.interactive.list_reply.id;
                    }
                } else if (msgType === "image") {
                    msgBody = message.image?.caption || "📷 Image";
                    mediaId = message.image?.id;
                } else if (msgType === "audio" || msgType === "voice") {
                    msgBody = "🎵 Audio message";
                    mediaId = message.audio?.id || message.voice?.id;
                } else if (msgType === "video") {
                    msgBody = message.video?.caption || "🎥 Video";
                    mediaId = message.video?.id;
                } else if (msgType === "document") {
                    msgBody = message.document?.filename || "📎 Document";
                    mediaId = message.document?.id;
                } else if (msgType === "sticker") {
                    msgBody = "🪄 Sticker";
                    mediaId = message.sticker?.id;
                } else {
                    msgBody = `[${msgType}]`;
                }

                try {
                    // Upsert conversation
                    const conversation = await prisma.whatsAppConversation.upsert({
                        where: { customerPhone },
                        update: {
                            customerName,
                            lastMessage: msgBody,
                            lastMessageTime: new Date(),
                            unreadCount: { increment: 1 },
                        },
                        create: {
                            customerPhone,
                            customerName,
                            lastMessage: msgBody,
                            lastMessageTime: new Date(),
                            unreadCount: 1,
                        },
                    });

                    // Save the message
                    await prisma.whatsAppMessage.create({
                        data: {
                            conversationId: conversation.id,
                            waMessageId,
                            direction: "inbound",
                            body: msgBody,
                            type: msgType === "voice" ? "audio" : msgType,
                            status: "received",
                            mediaId: mediaId ?? null,
                            timestamp: new Date(Number(message.timestamp) * 1000),
                        },
                    });

                    console.log(`[WhatsApp Webhook] Saved inbound message ${waMessageId} for conversation ${conversation.id}`);

                    // Bot: handle state machine response
                    try {
                        await handleBotMessage(customerPhone, Number(conversation.id), msgBody);
                        console.log(`[WhatsApp Bot] Replied to ${customerPhone}`);
                    } catch (botErr) {
                        console.error(`[WhatsApp Bot] Failed to reply to ${customerPhone}:`, botErr);
                    }
                } catch (err) {
                    console.error(`[WhatsApp Webhook] Error saving message from ${customerPhone}:`, err);
                }
            }
        }
    }
};

// ─── Send a message to a WhatsApp number ──────────────────────────────────
const sendMessage = async (
    conversationId: string,
    messageText: string
): Promise<{ waMessageId: string }> => {
    const conversation = await prisma.whatsAppConversation.findUniqueOrThrow({
        where: { id: Number(conversationId) },
    });

    const res = await fetch(
        `${GRAPH_URL}/${env.whatsapp.phoneNumberId}/messages`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.whatsapp.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: conversation.customerPhone,
                type: "text",
                text: { body: messageText },
            }),
        }
    );

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`WhatsApp API error ${res.status}: ${errText}`);
    }

    const responseData: any = await res.json();
    const waMessageId: string = responseData?.messages?.[0]?.id;

    // Persist outbound message
    await prisma.whatsAppMessage.create({
        data: {
            conversationId,
            waMessageId,
            direction: "outbound",
            body: messageText,
            type: "text",
            status: "sent",
        },
    });

    // Update conversation preview
    await prisma.whatsAppConversation.update({
        where: { id: Number(conversationId) },
        data: {
            lastMessage: messageText,
            lastMessageTime: new Date(),
        },
    });

    return { waMessageId };
};

// ─── Get all conversations ─────────────────────────────────────────────────
const getConversations = async (businessBranchId?: string) => {
    return prisma.whatsAppConversation.findMany({
        where: businessBranchId ? { businessBranchId } : {},
        orderBy: { lastMessageTime: "desc" },
    });
};

// ─── Initiate a conversation with a template message ──────────────────────
const initiateConversation = async (
    customerPhone: string,
    businessBranchId?: string,
    templateName: string = "furcare_greeting",
    templateParams: string[] = []
): Promise<{ conversationId: string }> => {
    const phone = customerPhone.replace(/[\s\-\+]/g, "");

    const templateBody: any = {
        name: templateName,
        language: { code: "en_US" },
    };

    if (templateParams.length > 0) {
        templateBody.components = [
            {
                type: "body",
                parameters: templateParams.map((val) => ({
                    type: "text",
                    text: String(val),
                })),
            },
        ];
    }

    const res = await fetch(
        `${GRAPH_URL}/${env.whatsapp.phoneNumberId}/messages`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.whatsapp.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: phone,
                type: "template",
                template: templateBody,
            }),
        }
    );

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`WhatsApp API error ${res.status}: ${errText}`);
    }

    const responseData: any = await res.json();
    const waMessageId: string = responseData?.messages?.[0]?.id;
    const greetingText = "Hello! How can we help you today?";

    const conversation = await prisma.whatsAppConversation.upsert({
        where: { customerPhone: phone },
        update: {
            lastMessage: greetingText,
            lastMessageTime: new Date(),
            ...(businessBranchId ? { businessBranchId } : {}),
        },
        create: {
            customerPhone: phone,
            customerName: phone,
            lastMessage: greetingText,
            lastMessageTime: new Date(),
            unreadCount: 0,
            ...(businessBranchId ? { businessBranchId } : {}),
        },
    });

    await prisma.whatsAppMessage.create({
        data: {
            conversationId: conversation.id,
            waMessageId,
            direction: "outbound",
            body: greetingText,
            type: "template",
            status: "sent",
        },
    });

    return { conversationId: String(conversation.id) };
};

// ─── Send a media message (image, audio, document, video) ─────────────────
const sendMediaMessage = async (
    conversationId: string,
    fileData: string,   // base64-encoded
    fileName: string,
    mimeType: string
): Promise<{ waMessageId: string }> => {
    const conversation = await prisma.whatsAppConversation.findUniqueOrThrow({
        where: { id: Number(conversationId) },
    });

    // Upload media to Meta
    const buffer = Buffer.from(fileData, "base64");
    const blob = new Blob([buffer], { type: mimeType });
    const uploadForm = new FormData();
    uploadForm.append("messaging_product", "whatsapp");
    uploadForm.append("file", blob, fileName);
    uploadForm.append("type", mimeType);

    const uploadRes = await fetch(
        `${GRAPH_URL}/${env.whatsapp.phoneNumberId}/media`,
        {
            method: "POST",
            headers: { Authorization: `Bearer ${env.whatsapp.accessToken}` },
            body: uploadForm,
        }
    );

    if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        throw new Error(`WhatsApp media upload error ${uploadRes.status}: ${errText}`);
    }

    const uploadData: any = await uploadRes.json();
    const mediaId: string = uploadData.id;

    // Determine WhatsApp media type
    let mediaType: string;
    if (mimeType.startsWith("image/")) mediaType = "image";
    else if (mimeType.startsWith("video/")) mediaType = "video";
    else if (mimeType.startsWith("audio/")) mediaType = "audio";
    else mediaType = "document";

    // Build and send the message
    const msgPayload: any = {
        messaging_product: "whatsapp",
        to: conversation.customerPhone,
        type: mediaType,
        [mediaType]: { id: mediaId },
    };
    if (mediaType === "document") {
        msgPayload[mediaType].filename = fileName;
    }

    const sendRes = await fetch(
        `${GRAPH_URL}/${env.whatsapp.phoneNumberId}/messages`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.whatsapp.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(msgPayload),
        }
    );

    if (!sendRes.ok) {
        const errText = await sendRes.text();
        throw new Error(`WhatsApp send error ${sendRes.status}: ${errText}`);
    }

    const sendData: any = await sendRes.json();
    const waMessageId: string = sendData?.messages?.[0]?.id;

    await prisma.whatsAppMessage.create({
        data: {
            conversationId,
            waMessageId,
            direction: "outbound",
            body: fileName,
            type: mediaType,
            status: "sent",
            mediaId,
        },
    });

    await prisma.whatsAppConversation.update({
        where: { id: Number(conversationId) },
        data: {
            lastMessage: `📎 ${fileName}`,
            lastMessageTime: new Date(),
        },
    });

    return { waMessageId };
};

// ─── Proxy media from Meta (returns buffer + content-type) ────────────────
const getMediaBuffer = async (mediaId: string): Promise<{ buffer: Buffer; contentType: string }> => {
    // Step 1: get the media download URL
    const urlRes = await fetch(`${GRAPH_URL}/${mediaId}`, {
        headers: { Authorization: `Bearer ${env.whatsapp.accessToken}` },
    });
    if (!urlRes.ok) {
        const err = await urlRes.text();
        throw new Error(`Meta media URL fetch error ${urlRes.status}: ${err}`);
    }
    const urlData: any = await urlRes.json();
    const downloadUrl: string = urlData.url;
    const contentType: string = urlData.mime_type || "application/octet-stream";

    // Step 2: download the actual bytes
    const mediaRes = await fetch(downloadUrl, {
        headers: { Authorization: `Bearer ${env.whatsapp.accessToken}` },
    });
    if (!mediaRes.ok) {
        const err = await mediaRes.text();
        throw new Error(`Meta media download error ${mediaRes.status}: ${err}`);
    }
    const arrayBuffer = await mediaRes.arrayBuffer();
    return { buffer: Buffer.from(arrayBuffer), contentType };
};

// ─── Get messages for a conversation ──────────────────────────────────────
const getMessages = async (conversationId: string) => {
    // Mark messages as read
    await prisma.whatsAppConversation.update({
        where: { id: Number(conversationId) },
        data: { unreadCount: 0 },
    });

    return prisma.whatsAppMessage.findMany({
        where: { conversationId: Number(conversationId) },
        orderBy: { timestamp: "asc" },
    });
};

export const WhatsAppService = {
    verifyWebhook,
    handleIncomingWebhook,
    initiateConversation,
    sendMessage,
    sendMediaMessage,
    getMediaBuffer,
    getConversations,
    getMessages,
};
