import { z } from "zod";

// Type-safe dosing rule schema
const dosingRuleSchema = z.object({
    species: z.string().default("All Species"),
    minDoseMgPerKg: z.number().min(0, "Min dose must be ≥ 0"),
    maxDoseMgPerKg: z.number().min(0, "Max dose must be ≥ 0"),
    doseUnit: z.string().default("mg/kg"),
    frequency: z.string().optional().default(""),
    route: z.string().optional().default(""),
    form: z.string().optional().default(""),
    instructions: z.string().optional().default(""),
});

const create = z.object({
    body: z.strictObject({
        name: z.string().trim(),
        description: z.string().optional().nullable(),
        sku: z.string().optional().nullable(),
        category: z.string().optional().nullable(),

        costPrice: z.number().optional().nullable(),
        sellingPrice: z.number(),

        quantity: z.number().default(0).optional().nullable(),
        minQuantity: z.number().default(0).optional().nullable(),

        serialNumber: z.string().optional().nullable(),
        lotNumber: z.string().optional().nullable(),
        expiryDate: z.string().datetime({ offset: true }).optional().or(z.string().optional()), // Allow ISO string

        // Pharmaceutical fields
        strength: z.number().optional().nullable(),
        unit: z.string().optional().nullable(),
        dispensableUnit: z.string().optional().nullable(),
        doseUnit: z.string().optional().nullable(),
        standardDose: z.string().optional().nullable(),
        usageInstructions: z.string().optional().nullable(),

        // Typed dosing rules (from API)
        dosings: z.array(dosingRuleSchema).optional().nullable(),
        breedSensitivities: z.any().optional().nullable(),

        // Denormalized dose metadata (from first dosing rule)
        doseMinPerKg: z.number().min(0).optional().nullable(),
        doseMaxPerKg: z.number().min(0).optional().nullable(),

        // OpenFDA tracking
        variants: z.any().optional().nullable(),
        genericName: z.string().optional().nullable(),
        hasClinicalReference: z.boolean().optional().nullable(),
        clinicalRulesApplied: z.boolean().optional().nullable(),


        // Vaccine fields
        vaccineComponents: z.string().optional().nullable(),

        // Location
        location: z.string().optional().nullable(),

        supplierId: z.string().optional().nullable(),
        businessBranchId: z.string(),

        active: z.boolean().optional().nullable(),
    }),
});

const update = z.object({
    body: z.strictObject({
        name: z.string().trim().optional().nullable(),
        description: z.string().optional().nullable(),
        sku: z.string().optional().nullable(),
        category: z.string().optional().nullable(),

        costPrice: z.number().optional().nullable(),
        sellingPrice: z.number().optional().nullable(),

        quantity: z.number().optional().nullable(),
        minQuantity: z.number().optional().nullable(),

        serialNumber: z.string().optional().nullable(),
        lotNumber: z.string().optional().nullable(),
        expiryDate: z.string().datetime({ offset: true }).optional().or(z.string().optional()),

        // Pharmaceutical fields
        strength: z.number().optional().nullable(),
        unit: z.string().optional().nullable(),
        dispensableUnit: z.string().optional().nullable(),
        doseUnit: z.string().optional().nullable(),
        standardDose: z.string().optional().nullable(),
        usageInstructions: z.string().optional().nullable(),

        // Typed dosing rules (from API)
        dosings: z.array(dosingRuleSchema).optional().nullable(),
        breedSensitivities: z.any().optional().nullable(),

        // Denormalized dose metadata (from first dosing rule)
        doseMinPerKg: z.number().min(0).optional().nullable(),
        doseMaxPerKg: z.number().min(0).optional().nullable(),

        // OpenFDA tracking
        variants: z.any().optional().nullable(),
        genericName: z.string().optional().nullable(),
        hasClinicalReference: z.boolean().optional().nullable(),
        clinicalRulesApplied: z.boolean().optional().nullable(),

        // Vaccine fields
        vaccineComponents: z.string().optional().nullable(),

        // Location
        location: z.string().optional().nullable(),

        supplierId: z.string().optional().nullable(),
        // BusinessBranchId usually doesn't change
        active: z.boolean().optional().nullable(),
    }),
});

const calculateDosage = z.object({
    body: z.object({
        species: z.string(),
        breed: z.string().optional().nullable(),
        weightKg: z.number(),
        disclaimerAccepted: z.boolean(),
        form: z.string().optional().nullable(),
        route: z.string().optional().nullable(),
    }),
});

export const productValidator = {
    create,
    update,
    calculateDosage,
};
