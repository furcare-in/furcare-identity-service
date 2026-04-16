import { z } from "zod";

const createAnimalClassSchema = z.object({
  body: z.strictObject({
    name: z.string(),
    breeds: z.array(z.string()),
  }),
});

const updateAnimalClassSchema = z.object({
  body: z.strictObject({
    name: z.string().optional(),
    breeds: z.array(z.string()).optional(),
  }),
});

const animalClassValidator = {
  createAnimalClassSchema,
  updateAnimalClassSchema,
};
export default animalClassValidator;
