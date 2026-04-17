// @ts-nocheck
import { z } from "zod";

const createGroupSchema = z.object({
  body: z.strictObject({
    name: z.string(),
    description: z.string().optional(),
    businessBranchId: z.string().optional(),
    resources: z.array(z.string()),
    shiftStartTime: z.string().optional(),
    shiftEndTime: z.string().optional(),
  }),
});

const updateGroupSchema = z.object({
  body: z.strictObject({
    name: z.string().optional(),
    description: z.string().optional(),
    businessBranchId: z.string().optional(),
    active: z.boolean().optional(),
  }),
});

const addOrRemoveResourceFromGroup = z.object({
  body: z.strictObject({
    staffIds: z.array(z.string()),
  }),
});

const groupValidator = {
  createGroupSchema,
  updateGroupSchema,
  addOrRemoveResourceFromGroup,
};
export default groupValidator;
