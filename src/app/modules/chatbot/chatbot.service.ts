/*import { GoogleGenAI } from "@google/genai";
import prisma from "../../../utils/prisma.js";
import env from "../../../utils/env.js"; */
import axios from "axios";
import FormData from "form-data";
//const AI_BASE_URL = "https://ai.furcareindia.com";
const AI_BASE_URL = "http://localhost:8000";

const sendMessage = async (
    sessionId: string,
    message: string,
    businessBranchId: string | undefined,
    token: string
) => {
    try {
        const response = await axios.post(
            `${AI_BASE_URL}/api/v1/chatbot`,
            {
                message,
                sessionId,
                businessBranchId: businessBranchId || ""
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // The python API returns a wrapped ApiResponse. We extract the inner data.
        return response.data?.data || response.data;
    } catch (error: any) {
        console.error("Error proxying to AI service:", error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || "Failed to communicate with AI service");
    }
};

const clearSession = async (sessionId: string, token: string) => {
    try {
        const response = await axios.delete(
            `${AI_BASE_URL}/api/v1/chatbot/${sessionId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data?.data || response.data;
    } catch (error: any) {
        console.error("Error clearing session on AI service:", error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || "Failed to clear AI session");
    }
};

const sendMessageWithFile = async (
    formData: any, // FormData from multer
    token: string
) => {
    try {
        // Re-build a proper axios-compatible FormData from the multer file buffer
        const proxyForm = new FormData();

        // Copy scalar fields
        if (formData.message) proxyForm.append("message", formData.message);
        if (formData.sessionId) proxyForm.append("sessionId", formData.sessionId);
        if (formData.businessBranchId) proxyForm.append("businessBranchId", formData.businessBranchId);

        // Attach the file buffer
        if (formData.file) {
            proxyForm.append("file", formData.file.buffer, {
                filename: formData.file.originalname,
                contentType: formData.file.mimetype,
            });
        }

        const response = await axios.post(
            `${AI_BASE_URL}/api/v1/chatbot/upload`,
            proxyForm,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...proxyForm.getHeaders(),
                },
                maxBodyLength: Infinity,
            }
        );
        return response.data?.data || response.data;
    } catch (error: any) {
        console.error("Error proxying file to AI service:", error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || "Failed to send file to AI service");
    }
};

export const ChatbotService = {
    sendMessage,
    clearSession,
    sendMessageWithFile,
};
/* // const DEFAULT_MODEL = "gemini-2.5-flash-preview-09-2025";
const DEFAULT_MODEL = "gemini-2.5-flash";

const VET_SYSTEM_INSTRUCTION = `You are FurCare AI, an expert veterinary assistant integrated into a veterinary clinic management system.

Your capabilities:
1. Answer veterinary medical questions with professional, accurate knowledge covering:
   - Disease diagnosis, symptoms, and treatment protocols
   - Medication dosages and drug interactions for animals
   - Preventive care (vaccinations, deworming, nutrition)
   - Surgical procedures and post-operative care
   - Emergency and critical care
   - Species-specific care (dogs, cats, birds, reptiles, etc.)

2. When provided with patient medical records from the database, you can:
   - Summarize and explain medical notes in plain language
   - Identify patterns in visit history
   - Suggest follow-up actions based on medical history
   - Explain prescribed medications and treatment plans

Guidelines:
- Always be professional, clear, and concise
- If unsure about a diagnosis, recommend consulting a specialist
- Never replace professional veterinary judgment — always note when in-person examination is needed
- When discussing patient records, maintain confidentiality and professionalism
- Format responses with markdown for readability (headings, bullet points, bold for emphasis)
- Keep responses focused and relevant to the question asked
- If the question is not related to veterinary medicine or the patient database, politely redirect the conversation back to veterinary topics`;

// In-memory session store (keyed by sessionId)
const chatSessions: Map<string, any> = new Map();

const getOrCreateSession = (sessionId: string) => {
    if (chatSessions.has(sessionId)) {
        return chatSessions.get(sessionId);
    }

    const apiKey = env.ai.geminiApiKey;
    if (!apiKey) {
        throw new Error("Gemini API key not configured. Set GEMINI_API_KEY.");
    }

    const genAI = new GoogleGenAI({ apiKey });
    const model = env.ai.geminiModel || DEFAULT_MODEL;

    const chat = genAI.chats.create({
        model,
        config: {
            systemInstruction: VET_SYSTEM_INSTRUCTION,
        },
        history: [],
    });

    chatSessions.set(sessionId, chat);
    return chat;
};

const fetchPatientContext = async (businessBranchId?: string, searchTerm?: string) => {
    if (!searchTerm) return null;

    try {
        // Search for pets by name
        const pets = await prisma.pet.findMany({
            where: {
                name: { contains: searchTerm, mode: "insensitive" },
                ...(businessBranchId ? {
                    client: { businessBranchId }
                } : {}),
            },
            include: {
                client: true,
                animalClass: true,
                visits: {
                    orderBy: { createdAt: "desc" },
                    take: 10,
                },
            },
            take: 5,
        });

        if (pets.length === 0) return null;

        // Format the data for the AI
        const patientData = pets.map(pet => ({
            petName: pet.name,
            species: pet.animalClass?.name || "Unknown",
            breed: pet.breed,
            gender: pet.gender,
            color: pet.color,
            weight: pet.weight,
            dob: pet.dob,
            sterilizationStatus: pet.sterilizationStatus,
            ownerName: `${pet.client?.firstName || ""} ${pet.client?.lastName || ""}`.trim(),
            medicalRecords: pet.visits.map(v => ({
                date: v.date,
                reason: v.reason,
                notes: v.notes,
                status: v.status,
                author: v.author,
                markdown: v.markdown,
                assessment: v.assessment,
                vitals: v.vitals,
                prescriptions: v.prescriptions,
                vaccination: v.vaccination,
                diagnostics: v.diagnostics,
            })),
        }));

        return patientData;
    } catch (error) {
        console.error("Error fetching patient context:", error);
        return null;
    }
};

// Fetch all pets for a specific branch
const fetchPetListForBranch = async (businessBranchId: string) => {
    try {
        const pets = await prisma.pet.findMany({
            where: {
                client: { businessBranchId },
            },
            include: {
                client: true,
                animalClass: true,
            },
            orderBy: { name: "asc" },
        });

        return pets.map(pet => ({
            petName: pet.name,
            species: pet.animalClass?.name || "Unknown",
            breed: pet.breed,
            gender: pet.gender,
            ownerName: `${pet.client?.firstName || ""} ${pet.client?.lastName || ""}`.trim(),
        }));
    } catch (error) {
        console.error("Error fetching pet list:", error);
        return [];
    }
};

// Detect if user is asking to list pets/patients
const isAskingForPetList = (message: string): boolean => {
    const patterns = [
        /(?:list|show|get|fetch|display|give\s+me|what\s+are)\s+(?:all\s+)?(?:the\s+)?(?:pets?|patients?|animals?|pet\s*names?|patient\s*names?)/i,
        /(?:pets?|patients?|animals?)\s+(?:in|at|for|of)\s+(?:this|the|my|our)\s+(?:branch|clinic|hospital|location)/i,
        /(?:how\s+many|which)\s+(?:pets?|patients?|animals?)\s+(?:do\s+we\s+have|are\s+there|are\s+registered)/i,
        /(?:pet|patient|animal)\s+(?:list|names?|directory|roster)/i,
        /(?:all|our|the)\s+(?:registered\s+)?(?:pets?|patients?|animals?)$/i,
    ];
    return patterns.some(p => p.test(message));
};

// Simple heuristic to detect if the user is asking about a patient
const extractPatientSearchTerm = (message: string): string | null => {
    const patterns = [
        /(?:medical\s+(?:notes?|records?|history)|patient\s+(?:info|data|records?)|records?\s+(?:for|of))\s+(?:for\s+)?["']?([a-zA-Z]+)["']?/i,
        /(?:tell\s+me\s+about|show\s+me|look\s+up|find|search\s+for|check)\s+(?:patient\s+)?["']?([a-zA-Z]+)["']?(?:'s)?\s*(?:medical|records?|notes?|history|visits?|health)?/i,
        /(?:what|how)\s+(?:is|are|about)\s+(?:patient\s+)?["']?([a-zA-Z]+)["']?(?:'s)?\s+(?:medical|records?|notes?|history|condition|health|status)/i,
        /(?:patient|pet)\s+(?:named?\s+)?["']?([a-zA-Z]+)["']?/i,
    ];

    for (const pattern of patterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
            const commonWords = ["the", "a", "an", "my", "our", "their", "this", "that", "all", "any", "some", "about", "for"];
            if (!commonWords.includes(match[1].toLowerCase())) {
                return match[1];
                }
    }
    return null;
    const sendMessage = async (
    sessionId: string,
    userMessage: string,
    businessBranchId?: string
) => {
    const chat = getOrCreateSession(sessionId);
    let enrichedMessage = userMessage;

    // Check if user is asking to list all pets for the branch
    if (isAskingForPetList(userMessage) && businessBranchId) {
        const petList = await fetchPetListForBranch(businessBranchId);
        if (petList.length > 0) {
            enrichedMessage = `${userMessage}\n\n[SYSTEM CONTEXT - Pet List for this Branch (${petList.length} pets)]:\n${JSON.stringify(petList, null, 2)}\n\nPresent this pet list in a clean, readable format. Include pet name, species, breed, gender, and owner name.`;
        } else {
            enrichedMessage = `${userMessage}\n\n[SYSTEM CONTEXT]: No pets found registered for this branch.`;
        } else {
        // Check if the user is asking about a specific patient's records
        const searchTerm = extractPatientSearchTerm(userMessage);
        if (searchTerm) {
            const patientContext = await fetchPatientContext(businessBranchId, searchTerm);
            if (patientContext && patientContext.length > 0) {
                enrichedMessage = `${userMessage}\n\n[SYSTEM CONTEXT - Patient Records from Database]:\n${JSON.stringify(patientContext, null, 2)}\n\nPlease use the above patient data to answer the user's question. Present the information clearly and professionally.`;
            } else {
                enrichedMessage = `${userMessage}\n\n[SYSTEM CONTEXT]: No patient records found matching "${searchTerm}" in the database.`;
            }
        }
    }

    const response = await chat.sendMessage({
        message: enrichedMessage,
    });

    return {
        message: response.text || "I'm sorry, I couldn't generate a response. Please try again.",
        sessionId,
    };
};

const clearSession = (sessionId: string) => {
    chatSessions.delete(sessionId);
    };
    */
