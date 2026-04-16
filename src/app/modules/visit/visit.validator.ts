import { z } from "zod";

const createVisitSchema = z.object({
    body: z.strictObject({
        date: z.string().optional(), // Made optional as frontend might not send it for notes
        reason: z.string().optional(), // Made optional
        notes: z.string().optional(),
        status: z.enum(["Scheduled", "In Progress", "Completed", "Cancelled"]).optional(),
        clientId: z.string().optional(), // Might be inferred or sent later
        petId: z.string().optional(), // Often in URL
        moduleId: z.string().optional(),
        businessBranchId: z.string().optional(),
        // Medical Record Fields
        author: z.string().optional(),
        markdown: z.string().optional(),
        selectedOptions: z.any().optional(),
        vaccination: z.any().optional(),
        prescriptions: z.any().optional(),
        assessment: z.any().optional(),
        vitals: z.any().optional(),
        documents: z.any().optional(),
        diagnostics: z.any().optional(),
    }),
});

const updateVisitSchema = z.object({
    body: z.strictObject({
        date: z.string().optional(),
        reason: z.string().optional(),
        notes: z.string().optional(),
        status: z.enum(["Scheduled", "In Progress", "Completed", "Cancelled"]).optional(),
        clientId: z.string().optional(),
        petId: z.string().optional(),
        moduleId: z.string().optional(),
        businessBranchId: z.string().optional(),
        // Medical Record Fields
        author: z.string().optional(),
        markdown: z.string().optional(),
        selectedOptions: z.any().optional(),
        vaccination: z.any().optional(),
        prescriptions: z.any().optional(),
        assessment: z.any().optional(),
        vitals: z.any().optional(),
        documents: z.any().optional(),
        diagnostics: z.any().optional(),
        // Payment & Order Fields
        totalAmount: z.number().optional(),
        oneTimeDiscount: z.number().optional(),
        paymentStatus: z.enum(["Pending", "In Progress", "Completed", "Failed"]).optional(),
        paymentMethod: z.string().nullable().optional(),
        invoiceNumber: z.string().optional(),
        paymentDate: z.string().or(z.date()).optional(),
    }),
});

const aiAutofillSchema = z.object({
    body: z.strictObject({
        doctorSummary: z.string().min(1, "doctorSummary is required"),
        selectedOptionsTemplate: z.record(z.any()),
        assessmentTemplate: z.record(z.any()).optional(),
        vitalsTemplate: z.record(z.any()).optional(),
        promptTemplate: z.string().optional(),
        apiKeyOverride: z.string().optional(),
        patientContext: z
            .object({
                petName: z.string().optional(),
                animalType: z.string().optional(),
                breed: z.string().optional(),
                gender: z.string().optional(),
                age: z.string().optional(),
            })
            .optional(),
        model: z.string().optional(),
    }),
});

export const VisitValidation = {
    createVisitSchema,
    updateVisitSchema,
    aiAutofillSchema,
};
