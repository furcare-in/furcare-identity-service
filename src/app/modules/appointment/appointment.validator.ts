import { DocumentTemplateLanguage, DocumentTemplateType } from "@prisma/client";
import { z } from "zod";

const createAppointmentSchema = z.object({
  body: z.strictObject({
    name: z.string(),
    description: z.string(),
    departmentId: z.string(), 
    branchId: z.string(), 
    reasons: z.array(z.string()),
    active: z.boolean().optional(), 
  }),
});

const updateAppointmentSchema = z.object({
  body: z.strictObject({
    name: z.string().optional(),
    description: z.string().optional(),
    departmentId: z.string().optional(), 
    branchId: z.string().optional(), 
    reasons: z.array(z.string()).optional(),
    active: z.boolean().optional(), 
  }),
});

const appointmentValidator = {
  createAppointmentSchema,
  updateAppointmentSchema,
};
export default appointmentValidator;
