import { z } from "zod";

const createServiceSchema = z.object({
  body: z.strictObject({
    name: z.string(),
    description: z.string().optional(),
    duration: z.number().optional(),
    price: z.number().optional(),
    departmentId: z.string(),
    isCustom: z.boolean().optional(),
  }),
});

const updateServiceSchema = z.object({
  body: z.strictObject({
    name: z.string().optional(),
    description: z.string().optional(),
    duration: z.number().optional(),
    price: z.number().optional(),
  }),
});

const serviceValidator = {
  createServiceSchema,
  updateServiceSchema,
};
export default serviceValidator;
