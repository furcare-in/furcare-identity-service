import { z } from "zod";

const createOrUpdateOrthopedicExamSchema = z.object({
  body: z.object({
    visitId: z.string({ required_error: "VisitId is required" }),
    petId: z.string({ required_error: "PetId is required" }),
    businessBranchId: z.string({ required_error: "BusinessBranchId is required" }),
    
    // CHANGE THESE THREE LINES:
    physical: z.record(z.any()).nullish(),
    assessment: z.record(z.any()).nullish(),
    plan: z.record(z.any()).nullish(),
  }),
});

export const OrthopedicExamValidator = {
  createOrUpdateOrthopedicExamSchema,
};