// @ts-nocheck
import { z } from "zod";

export const businessBranchBaseSchema = z.object({
  name: z.string(),
  type: z.string(),
  practice: z.string(),
  currency: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  postalCode: z.string(),
});

const createBusinessBranchSchema = z.object({
  body: businessBranchBaseSchema.extend({
    businessUnitId: z.string(),

    services: z.array(
      z.object({
        serviceId: z.string(),
        basePrice: z.number(),
      }),
    ).optional().default([]),
    departments: z.array(
      z.object({
        departmentId: z.string(),
      }),
    ).optional().default([]),
    appointmentSlots: z.array(
      z.object({
        name: z.string(),
        departmentId: z.string(),
        reasons: z.array(z.string()),
      }),
    ).optional().default([]),
  }),
});

const updateBusinessBranchSchema = z.object({
  body: z.strictObject({
    name: z.string().optional(),
    type: z.string().optional(),
    practice: z.string().optional(),
    currency: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    businessUnitId: z.string().optional(),
    active: z.boolean().optional(),
  }),
});

const addAnimalClassToBranchSchema = z.object({
  body: z.strictObject({
    animalClassId: z.string(),
  }),
});

const updateAnimalClassInBranchSchema = z.object({
  body: z.strictObject({
    active: z.boolean().optional(),
  }),
});

const addDepartmentInBusinessBranchSchema = z.object({
  body: z.strictObject({
    departmentIds: z.array(z.string()),
  }),
});

const addServicesInBusinessBranchSchema = z.object({
  body: z.strictObject({
    services: z.array(
      z.strictObject({
        serviceId: z.string(),
        basePrice: z.number(),
      }),
    ),
  }),
});

const addAppointmentSlotsInBusinessBranchSchema = z.object({
  body: z.strictObject({
    appointmentSlots: z.array(
      z.strictObject({
        name: z.string(),
        description: z.string().optional(),
        departmentId: z.string(),
        reasons: z.array(z.string()),
      }),
    ),
  }),
});

const updateDepartmentInBranchSchema = z.object({
  body: z.strictObject({
    active: z.boolean().optional(),
  }),
});

const updateServiceInBranchSchema = z.object({
  body: z.strictObject({
    active: z.boolean().optional(),
    basePrice: z.number().optional(),
  }),
});

const updateAppointmentSlotInBranchSchema = z.object({
  body: z.strictObject({
    name: z.string().optional(),
    description: z.string().optional(),
    departmentId: z.string().optional(),
    reasons: z.array(z.string()).optional(),
    active: z.boolean().optional(),
  }),
});

const businessBranchValidator = {
  createBusinessBranchSchema,
  updateBusinessBranchSchema,
  addAnimalClassToBranchSchema,
  updateAnimalClassInBranchSchema,
  addDepartmentInBusinessBranchSchema,
  updateDepartmentInBranchSchema,
  addServicesInBusinessBranchSchema,
  updateServiceInBranchSchema,
  addAppointmentSlotsInBusinessBranchSchema,
  updateAppointmentSlotInBranchSchema,
};

export default businessBranchValidator;
