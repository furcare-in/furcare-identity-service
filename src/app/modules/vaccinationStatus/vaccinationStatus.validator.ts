import { z } from "zod";

const create = z.object({
    body: z.strictObject({
        petId: z.string(),
        productId: z.string().optional().nullable(),
        vaccineName: z.string().trim(),
        isCore: z.boolean().default(false),
        vaccineType: z.string().optional().nullable(),
        administeredDate: z.string().datetime({ offset: true }).optional().nullable().or(z.string().optional().nullable()),
        nextDueDate: z.string().datetime({ offset: true }).optional().nullable().or(z.string().optional().nullable()),
        status: z.string().default("On Track"),
        visitId: z.string().optional().nullable(),
        isManuallyEntered: z.boolean().default(false),
        businessBranchId: z.string(),
    }),
});

const update = z.object({
    body: z.strictObject({
        vaccineName: z.string().trim().optional(),
        isCore: z.boolean().optional(),
        vaccineType: z.string().optional().nullable(),
        administeredDate: z.string().datetime({ offset: true }).optional().or(z.string().optional()),
        nextDueDate: z.string().datetime({ offset: true }).optional().nullable().or(z.string().optional().nullable()),
        status: z.string().optional(),
        visitId: z.string().optional().nullable(),
        isManuallyEntered: z.boolean().optional(),
    }),
});

export const vaccinationStatusValidator = {
    create,
    update,
};
