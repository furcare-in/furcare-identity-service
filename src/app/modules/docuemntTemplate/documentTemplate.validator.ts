// @ts-nocheck
import pkg from "@prisma/client";
const { DocumentTemplateLanguage, DocumentTemplateType } = pkg;
import { z } from "zod";

const createDocumentTemplateSchema = z.object({
  body: z.strictObject({
    type: z.nativeEnum(DocumentTemplateType),
    name: z.string(),
    body: z.array(
      z.strictObject({
        language: z.nativeEnum(DocumentTemplateLanguage),
        body: z.string(),
      }),
    ),
    businessBranchId: z.string(),
  }),
});

const updateDocumentTemplateSchema = z.object({
  body: z.strictObject({
    type: z.nativeEnum(DocumentTemplateType).optional(),
    name: z.string().optional(),
    body: z
      .array(
        z.strictObject({
          language: z.nativeEnum(DocumentTemplateLanguage),
          body: z.string(),
        }),
      )
      .optional(),
    businessBranchId: z.string().optional(),
    active: z.boolean().optional(),
  }),
});

const documentTemplateValidator = {
  createDocumentTemplateSchema,
  updateDocumentTemplateSchema,
};
export default documentTemplateValidator;
