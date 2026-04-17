// @ts-nocheck
import { z } from "zod";

const createDiagnosticIntegrationSchema = z.object({
  body: z.object({
    name: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional().or(z.literal("")),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    postalCode: z.string(),
    url: z.string().optional().or(z.literal("")),
    isInternal: z.boolean().optional(),
    businessBranchId: z.string(),
  }),
});

const updateDiagnosticIntegrationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional().or(z.literal("")),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    url: z.string().optional().or(z.literal("")),
    isInternal: z.boolean().optional(),
    businessBranchId: z.string().optional(),
    active: z.boolean().optional(),
  }),
});

const diagnosticIntegrationValidator = {
  createDiagnosticIntegrationSchema,
  updateDiagnosticIntegrationSchema,
};
export default diagnosticIntegrationValidator;
