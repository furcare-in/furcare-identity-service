// @ts-nocheck
import { z } from "zod";

const createLeadTypeSchema = z.object({
    body: z.object({
        name: z.string({ required_error: "Name is required" }),
        businessBranchId: z.string({ required_error: "Business Branch ID is required" }),
        sources: z.array(z.string()).min(1, "At least one source is required"),
        description: z.string().optional(),
    }),
});

const updateLeadTypeSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        businessBranchId: z.string().optional(),
        sources: z.array(z.string()).optional(),
        description: z.string().optional(),
    }),
});

const leadTypeValidator = {
    createLeadTypeSchema,
    updateLeadTypeSchema,
};

export default leadTypeValidator;
