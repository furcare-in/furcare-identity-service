// @ts-nocheck
import { z } from "zod";

const createDepartmentSchema = z.object({
  body: z.strictObject({
    name: z.string(),
  }),
});

const updateDepartmentSchema = z.object({
  body: z.strictObject({
    name: z.string().optional(),
  }),
});

const departmentValidator = {
  createDepartmentSchema,
  updateDepartmentSchema,
};
export default departmentValidator;
