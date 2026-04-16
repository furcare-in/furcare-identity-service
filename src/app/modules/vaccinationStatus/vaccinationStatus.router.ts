import { Router } from "express";
import { vaccinationStatusController } from "./vaccinationStatus.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import { vaccinationStatusValidator } from "./vaccinationStatus.validator.js";
import auth from "../../middleware/auth.js";

const vaccinationStatusRouter = Router();

// Create a new vaccination status record
vaccinationStatusRouter.post(
    "/",
    auth(),
    validateRequest(vaccinationStatusValidator.create),
    vaccinationStatusController.createVaccination
);

// Get all vaccination records (paginated, filterable)
vaccinationStatusRouter.get(
    "/",
    auth(),
    vaccinationStatusController.getAllVaccinations
);

// Get all vaccination records for a specific pet
vaccinationStatusRouter.get(
    "/pet/:petId",
    auth(),
    vaccinationStatusController.getVaccinationsByPet
);

// Get a single vaccination record by ID
vaccinationStatusRouter.get(
    "/:id",
    auth(),
    vaccinationStatusController.getVaccinationById
);

// Update a vaccination record
vaccinationStatusRouter.patch(
    "/:id",
    auth(),
    validateRequest(vaccinationStatusValidator.update),
    vaccinationStatusController.updateVaccination
);

// Delete a vaccination record
vaccinationStatusRouter.delete(
    "/:id",
    auth(),
    vaccinationStatusController.deleteVaccination
);

export default vaccinationStatusRouter;
