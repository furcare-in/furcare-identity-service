// @ts-nocheck
import pkg from "@prisma/client";
const { AnimalGender,
  ContentCategory,
  SterilizationStatus, } = pkg;
import { z } from "zod";

const createContentSchema = z.object({
  body: z.object({
    category: z.nativeEnum(ContentCategory),
    gender: z.nativeEnum(AnimalGender),
    animalClassId: z.string().optional(),
    animalBreed: z.string().optional(),
    ageRange: z.number().int().positive().optional(),
    healthConcerns: z.array(z.string()).min(1),
    sterilizationStatus: z.nativeEnum(SterilizationStatus),
    body: z.string(),
    title: z.string(),
    businessBranchId: z.string().optional().nullable(),
    active: z.boolean().optional(),
  }),
});

const updateContentSchema = z.object({
  body: z.object({
    category: z.nativeEnum(ContentCategory).optional(),
    gender: z.nativeEnum(AnimalGender).optional(),
    animalClassId: z.string().optional(),
    animalBreed: z.string().optional(),
    ageRange: z.number().int().positive().optional(),
    healthConcerns: z.array(z.string()).optional(),
    sterilizationStatus: z.nativeEnum(SterilizationStatus).optional(),
    body: z.string().optional(),
    title: z.string().optional(),
    businessBranchId: z.string().optional().nullable(),
    active: z.boolean().optional(),
  }),
});

const contentLibraryValidator = {
  createContentSchema,
  updateContentSchema,
};
export default contentLibraryValidator;
