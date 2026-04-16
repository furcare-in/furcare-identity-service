import { z } from "zod";
import { businessBranchBaseSchema } from "../businessBranch/businessBranch.validator.js";
import { staffBaseSchema } from "../staff/staff.validator.js";

const onboardBusinessUnitSchema = z.object({
  body: z.object({
    name: z.string(),
    type: z.string(),

    businessBranches: z.array(businessBranchBaseSchema).optional().default([]),
    animalClasses: z.array(z.string()).optional().default([]),

    services: z.array(
      z.object({
        serviceId: z.string(),
        basePrice: z.number(),
      }),
    ).optional().default([]),

    appointmentSlots: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        departmentId: z.string(),
      }),
    ).optional().default([]),

    staffs: z.array(staffBaseSchema).optional().default([]),

    vendors: z.array(z.object({ name: z.string() })).optional().default([]),
    diagnosticIntegrations: z.array(z.object({ name: z.string() })).optional().default([]),
  }),
});

const addServiceSchema = z.object({
  body: z.strictObject({
    serviceId: z.string(),
  }),
});

const addDepartmentSchema = z.object({
  body: z.strictObject({
    departmentId: z.string(),
  }),
});

const businessUnitValidator = {
  onboardBusinessUnitSchema,
  addServiceSchema,
  addDepartmentSchema,
};
export default businessUnitValidator;
