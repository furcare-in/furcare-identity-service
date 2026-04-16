import { AnimalGender, SterilizationStatus } from "@prisma/client";
import { z } from "zod";

const petSchema = z.strictObject({
  name: z.string(),
  gender: z.nativeEnum(AnimalGender),
  dob: z.string().datetime(),
  weight: z.number(),
  animalClassId: z.string().min(1, "Animal Type is required"), // Prevent empty string crash
  breed: z.string(),
  color: z.string(),
  sterilizationStatus: z.nativeEnum(SterilizationStatus),
  patientType: z.string(),
});

const createClientSchema = z.object({
  body: z.strictObject({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    email: z.string().email(),
    password: z.string().optional(),
    address: z.string(),
    country: z.string(),
    state: z.string(),
    city: z.string(),
    postalCode: z.string(),
    referredBy: z.string().optional(),
    discounts: z.string().optional(),
    businessBranchId: z.string(),
    pets: z.array(petSchema).min(1, "At least 1 pet is required"),
  }),
});

const updateClientSchema = z.object({
  body: z.strictObject({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    referredBy: z.string().optional(),
    discounts: z.string().optional(),
    pets: z.array(z.any()).optional(),
    additionalOwners: z.array(z.any()).optional(),
    observations: z.string().optional(),
  }),
});

const addPetsToClientSchema = z.object({
  body: z.strictObject({ pets: z.array(petSchema) }),
});

const clientValidator = {
  createClientSchema,
  updateClientSchema,
  addPetsToClientSchema,
};
export default clientValidator;
