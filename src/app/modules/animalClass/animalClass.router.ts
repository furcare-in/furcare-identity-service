import { Router } from "express";
import animalClassController from "./animalClass.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import animalClassValidator from "./animalClass.validator.js";

const animalClassRouter = Router();

animalClassRouter
  .route("/")
  .post(
    validateRequest(animalClassValidator.createAnimalClassSchema),
    animalClassController.createAnimalClass,
  )
  .get(animalClassController.getPaginatedAnimalClasss);
animalClassRouter
  .route("/:id")
  .get(animalClassController.getAnimalClassById)
  .patch(
    validateRequest(animalClassValidator.updateAnimalClassSchema),
    animalClassController.updateAnimalClass,
  )
  .delete(animalClassController.deleteAnimalClass);

export default animalClassRouter;
