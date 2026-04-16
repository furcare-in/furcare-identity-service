import { z } from "zod";

const createVendorSchema = z.object({
  body: z.strictObject({
    name: z.string(),
    businessUnitId: z.string(),
  }),
});

const updateVendorSchema = z.object({
  body: z.strictObject({
    name: z.string().optional(),
  }),
});

const vendorValidator = {
  createVendorSchema,
  updateVendorSchema,
};
export default vendorValidator;
