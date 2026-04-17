// @ts-nocheck
import { z } from "zod";

const create = z.object({
    body: z.strictObject({
        name: z.string().trim(),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().optional(),
        phoneNumber: z.string().optional(),
        category: z.string().optional(),
        address: z.string().optional(),
        status: z.string().optional(),
        businessBranchId: z.string(),
        active: z.boolean().optional(),
    }),
});

const update = z.object({
    body: z.strictObject({
        name: z.string().trim().optional(),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().optional(),
        phoneNumber: z.string().optional(),
        category: z.string().optional(),
        address: z.string().optional(),
        status: z.string().optional(),
        active: z.boolean().optional(),
    }),
});

export const supplierValidator = {
    create,
    update,
};
