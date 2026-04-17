// @ts-nocheck
// @ts-nocheck
import pkg from "@prisma/client";
const { Visit, Prisma } = pkg;
import prisma from "../../../utils/prisma.js";
import calculatePagination, {
    PaginationOptions,
} from "../../../utils/pagination.js";
import env from "../../../utils/env.js";
{/*import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path"; */}
import axios from "axios";

const createVisit = async (data: any) => {
    return prisma.visit.create({
        data,
        include: {
            client: true,
            pet: {
                include: {
                    client: true,
                    animalClass: true
                }
            },
        }
    });
};

const getVisitById = async (id: string) => {
    return prisma.visit.findUnique({
        where: { id: Number(id) },
        include: {
            client: true,
            pet: {
                include: {
                    client: true,
                    animalClass: true
                }
            },
        },
    });
};

const getPaginatedVisits = async (
    filters: { search?: string; businessBranchId?: string } & Partial<Visit>,
    options: PaginationOptions
) => {
    const {
        limit: take,
        skip,
        page,
        sortBy,
        sortOrder,
    } = calculatePagination(options);
    const { search, businessBranchId, ...filterData } = filters;
    const isPlaceholder = (value: unknown) => {
        if (value === undefined || value === null) return true;
        if (typeof value !== "string") return false;
        const normalized = value.trim().toLowerCase();
        return normalized === "" || normalized === "undefined" || normalized === "null";
    };
    const isValidObjectId = (value: string) => /^[0-9a-fA-F]{24}$/.test(value);

    const conditions: Prisma.VisitWhereInput[] = [];

    // Filter by businessBranchId if provided
    if (!isPlaceholder(businessBranchId) && !isNaN(Number(businessBranchId))) {
        conditions.push({ businessBranchId });
    }

    // Partial match search
    if (search) {
        conditions.push({
            OR: [
                { reason: { contains: search, mode: "insensitive" } },
                { notes: { contains: search, mode: "insensitive" } },
                {
                    pet: {
                        name: { contains: search, mode: "insensitive" },
                    },
                },
                {
                    client: {
                        OR: [
                            { firstName: { contains: search, mode: "insensitive" } },
                            { lastName: { contains: search, mode: "insensitive" } },
                        ],
                    },
                },
            ],
        });
    }

    // Exact match filters
    const cleanedFilterData = Object.fromEntries(
        Object.entries(filterData).filter(([key, value]) => {
            if (isPlaceholder(value)) return false;

            // Prevent Prisma ObjectId errors from malformed query params.
            if (["clientId", "petId", "moduleId"].includes(key)) {
                return !isNaN(Number(value));
            }

            return true;
        })
    );

    if (Object.keys(cleanedFilterData).length > 0) {
        conditions.push({
            AND: Object.keys(cleanedFilterData).map((key) => ({
                [key]: {
                    equals: cleanedFilterData[key as keyof typeof cleanedFilterData],
                },
            })),
        });
    }

    const whereConditions = conditions.length ? { AND: conditions } : {};

    const [result, total] = await Promise.all([
        prisma.visit.findMany({
            where: whereConditions,
            orderBy: { [sortBy]: sortOrder },
            skip,
            take,
            include: {
                client: true,
                pet: {
                    include: {
                        client: true,
                        animalClass: true
                    }
                },
            },
        }),
        prisma.visit.count({ where: whereConditions }),
    ]);

    return {
        meta: { total, page, limit: take },
        data: result,
    };
};

const updateVisit = async (id: string, data: any) => {
    return prisma.visit.update({
        where: { id: Number(id) },
        data,
        include: {
            client: true,
            pet: {
                include: {
                    client: true,
                    animalClass: true
                }
            },
        },
    });
};

const bulkUpdateVisit = async (updates: any[]) => {
    return prisma.$transaction(
        updates.map((update) => {
            const { id, ...data } = update;
            return prisma.visit.update({
                where: { id: Number(id) },
                data,
                include: {
                    client: true,
                    pet: true,
                },
            });
        })
    );
};

const deleteVisit = async (id: string) => {
    return prisma.visit.delete({ where: { id: Number(id) } });
};

type TAiAutofillInput = {
    doctorSummary: string;
    selectedOptionsTemplate: Record<string, unknown>;
    assessmentTemplate?: Record<string, unknown>;
    vitalsTemplate?: Record<string, unknown>;
    promptTemplate?: string;
    apiKeyOverride?: string;
    patientContext?: {
        petName?: string;
        animalType?: string;
        breed?: string;
        gender?: string;
        age?: string;
    };
    model?: string;
};
const generateMedicalRecordAutofill = async (input: TAiAutofillInput, token?: string) => {
    try {
        const response = await axios.post("http://localhost:8000/api/v1/visits/generate-autofill"/*"https://ai.furcareindia.com/api/v1/visits/generate-autofill"*/, {
            doctorSummary: input.doctorSummary,
            selectedOptionsTemplate: input.selectedOptionsTemplate,
            assessmentTemplate: input.assessmentTemplate || {},
            vitalsTemplate: input.vitalsTemplate || {},
            promptTemplate: input.promptTemplate,
            patientContext: input.patientContext || {},
            model: input.model
        }, {
            headers: {
                Authorization: token || ""
            }
        });

        if (response.data && response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data?.message || "Failed to generate autofill data from AI service");
        }
    } catch (error: any) {
        console.error("AI Service Error:", error?.response?.data || error.message);
        throw new Error(error?.response?.data?.message || error.message || "Failed to connect to AI service");
    }
};

export const VisitService = {
    createVisit,
    getVisitById,
    getPaginatedVisits,
    updateVisit,
    bulkUpdateVisit,
    deleteVisit,
    generateMedicalRecordAutofill,
};
{/*
    //const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

const DEFAULT_PROMPT_TEMPLATE = `You are a veterinary medical-record assistant.

You must convert the doctor summary into a JSON object that can auto-fill a predefined template.

Rules:
1) Return valid JSON only. No markdown, no prose, no code fences.
2) Keep all existing keys from selectedOptionsTemplate. Change only values when evidence exists in the summary.
3) For boolean options, set true only when explicitly supported by the summary.
4) For input/select values, use concise normalized values.
5) If information is not present, keep existing template value.
6) Never invent diagnoses, vitals, medications, or findings.

Patient Context:
{{PATIENT_CONTEXT}}

Doctor Summary:
{{DOCTOR_SUMMARY}}

Template JSON:
{{TEMPLATE_JSON}}

Return this JSON shape exactly:
{
  ...same shape as selectedOptionsTemplate...
}`;

const extractJson = (rawText: string): Record<string, unknown> => {
    const trimmed = rawText.trim();
    const parsed = JSON.parse(trimmed);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Model returned invalid JSON shape. Expected a JSON object.");
    }
    return parsed as Record<string, unknown>;
};

const replaceAllToken = (text: string, token: string, value: string): string => {
    return text.split(token).join(value);
};

const getPromptTemplate = (input: TAiAutofillInput): string => {
    if (input.promptTemplate?.trim()) {
        return input.promptTemplate.trim();
    }
    if (env.ai.medicalRecordPromptTemplate?.trim()) {
        return env.ai.medicalRecordPromptTemplate.trim();
    }

    const candidates = [
        path.join(process.cwd(), "prompts", "medical-record-autofill.txt"),
        path.join(process.cwd(), "prompt.txt"),
        path.join(process.cwd(), "..", "prompt.txt"),
    ];

    for (const filePath of candidates) {
        if (fs.existsSync(filePath)) {
            const filePrompt = fs.readFileSync(filePath, "utf8");
            if (filePrompt.trim()) {
                return filePrompt;
            }
        }
    }

    return DEFAULT_PROMPT_TEMPLATE;
};

const renderPrompt = (template: string, input: TAiAutofillInput): string => {
    const patientContext = input.patientContext ?? {};
    let rendered = replaceAllToken(template, "{{DOCTOR_SUMMARY}}", input.doctorSummary);
    rendered = replaceAllToken(
        rendered,
        "{{TEMPLATE_JSON}}",
        JSON.stringify(input.selectedOptionsTemplate, null, 2)
    );
    rendered = replaceAllToken(
        rendered,
        "{{PATIENT_CONTEXT}}",
        JSON.stringify(patientContext, null, 2)
    );

    // If prompt template doesn't expose placeholders, append context explicitly.
    if (!template.includes("{{DOCTOR_SUMMARY}}")) {
        rendered += `\n\nDoctor Summary:\n${input.doctorSummary}`;
    }
    if (!template.includes("{{TEMPLATE_JSON}}")) {
        rendered += `\n\nTemplate JSON:\n${JSON.stringify(input.selectedOptionsTemplate, null, 2)}`;
    }
    if (!template.includes("{{PATIENT_CONTEXT}}")) {
        rendered += `\n\nPatient Context:\n${JSON.stringify(patientContext, null, 2)}`;
    }

    return rendered;
};

const generateMedicalRecordAutofill = async (input: TAiAutofillInput) => {
    const apiKey = input.apiKeyOverride || env.ai.geminiApiKey;
    if (!apiKey) {
        throw new Error("Gemini API key not configured. Set GEMINI_API_KEY or pass apiKeyOverride.");

         const promptTemplate = getPromptTemplate(input);
    const model = env.ai.geminiModel || input.model || DEFAULT_GEMINI_MODEL;

    const prompt = renderPrompt(promptTemplate, input);

    const genAI = new GoogleGenAI({ apiKey });
    const response = await genAI.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        },
    });

    const jsonText = response.text ?? "";
    const parsed = extractJson(jsonText);
    const selectedOptionsCandidate = parsed.selectedOptions;
    const normalizedSelectedOptions =
        selectedOptionsCandidate &&
            typeof selectedOptionsCandidate === "object" &&
            !Array.isArray(selectedOptionsCandidate)
            ? (selectedOptionsCandidate as Record<string, unknown>)
            : parsed;

    return {
        selectedOptions: normalizedSelectedOptions,
        assessment: (parsed.assessment as Record<string, unknown>) ?? (input.assessmentTemplate ?? {}),
        vitals: (parsed.vitals as Record<string, unknown>) ?? (input.vitalsTemplate ?? {}),
    };
     */}