// @ts-nocheck
import pkg from "@prisma/client";
const { AccessLevel, Action, Resource } = pkg;
import { z } from "zod";

const createRoleSchema = z.object({
  body: z.object({
    name: z.string(),
    permissions: z.array(
      z.object({
        name: z.string().optional(),
        action: z.nativeEnum(Action),
        resource: z.nativeEnum(Resource),
      }),
    ),
    businessUnitId: z.string(),
    accessLevel: z.nativeEnum(AccessLevel),
    businessBranchId: z.string().optional(),
    isStaff: z.boolean().optional(),
  }),
});

const updateRoleSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    permissions: z
      .array(
        z.object({
          name: z.string().optional(),
          action: z.nativeEnum(Action),
          resource: z.nativeEnum(Resource),
        }),
      )
      .optional(),
    accessLevel: z.nativeEnum(AccessLevel).optional(),
    businessBranchId: z.string().optional(),
    isStaff: z.boolean().optional(),
  }),
});

const roleValidator = {
  createRoleSchema,
  updateRoleSchema,
};
export default roleValidator;
