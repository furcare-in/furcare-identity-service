// @ts-nocheck
import pkg from "@prisma/client";
const { ReportType, ReportFrequency } = pkg;
import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const createReportSchema = z.object({
  body: z.strictObject({
    name: z.string(),
    type: z.nativeEnum(ReportType),
    fields: z.array(z.string()),
    location: z.string().optional(),
    generateInBackground: z.boolean(),
    frequency: z.nativeEnum(ReportFrequency).optional(),
    businessBranchId: objectIdSchema.optional(),
    businessUnitId: objectIdSchema.optional(),
  }).superRefine((value, ctx) => {
    if (!value.businessBranchId && !value.businessUnitId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either businessBranchId or businessUnitId is required",
        path: ["businessBranchId"],
      });
    }
  }),
});

const updateReportSchema = z.object({
  body: z.strictObject({
    name: z.string().optional(),
    type: z.nativeEnum(ReportType).optional(),
    fields: z.array(z.string()).optional(),
    location: z.string().optional(),
    generateInBackground: z.boolean().optional(),
    frequency: z.nativeEnum(ReportFrequency).optional(),
    businessBranchId: objectIdSchema.optional(),
    businessUnitId: objectIdSchema.optional(),
    active: z.boolean().optional(),
  }),
});

const reportDataSchema = z.object({
  body: z.strictObject({
    type: z.nativeEnum(ReportType),
    fields: z.array(z.string()).optional(),
    startDate: z.string(),
    endDate: z.string(),
    frequency: z.nativeEnum(ReportFrequency).optional(),
    businessBranchId: objectIdSchema.optional(),
    businessUnitId: objectIdSchema.optional(),
    branchId: objectIdSchema.optional(),
  }),
});

const reportValidator = {
  createReportSchema,
  updateReportSchema,
  reportDataSchema,
};
export default reportValidator;
