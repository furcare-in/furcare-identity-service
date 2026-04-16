import { z } from "zod";

const createSupplySchema = z.object({
  body: z.strictObject({
    name: z.string(),
    businessBranchId: z.string(),
    items: z.array(
      z.object({
        name: z.string(),
        vendorId: z.string(),
      }),
    ),
  }),
});

const updateSupplySchema = z.object({
  body: z.strictObject({
    name: z.string().optional(),
    active: z.boolean().optional(),
  }),
});

const addItemToSupply = z.object({
  body: z.strictObject({
    items: z.array(z.strictObject({ name: z.string(), vendorId: z.string() })),
  }),
});

const supplyValidator = {
  createSupplySchema,
  updateSupplySchema,
  addItemToSupply,
};
export default supplyValidator;
