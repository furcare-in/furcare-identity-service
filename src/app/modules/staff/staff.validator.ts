// @ts-nocheck
import { z } from "zod";

export const staffBaseSchema = z.strictObject({
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  shiftStartTime: z.string().optional(),
  shiftEndTime: z.string().optional(),
  roles: z.array(z.string()).optional(),
  branchIndices: z.array(z.number()).optional(),
});

const createStaffSchema = z.object({
  body: staffBaseSchema.extend({
    businessUnitId: z.string(),
    businessBranchId: z.string(),
  }),
});

const updateStaffSchema = z.object({
  body: z.strictObject({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    roles: z.array(z.string()).optional(),
    businessUnitId: z.string().optional(),
    businessBranchId: z.string().optional(),
    active: z.boolean().optional(),
  }),
});

const staffValidator = {
  createStaffSchema,
  updateStaffSchema,
};
export default staffValidator;
