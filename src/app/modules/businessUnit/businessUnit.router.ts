// @ts-nocheck
import { Router } from "express";
import businessUnitController from "./businessUnit.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import businessUnitValidator from "./businessUnit.validator.js";

const businessUnitRouter = Router();

businessUnitRouter.post(
  "/",
  validateRequest(businessUnitValidator.onboardBusinessUnitSchema),
  businessUnitController.onboardBusinessUnit,
);


businessUnitRouter.get("/latest", businessUnitController.getLatestBusinessUnit);

businessUnitRouter.get("/:id", businessUnitController.getBusinessUnitById);

// ✅ Update existing business unit (upsert flow from onboarding)
businessUnitRouter.patch("/:id", businessUnitController.updateBusinessUnit);

businessUnitRouter.post(
  "/:id/services",
  validateRequest(businessUnitValidator.addServiceSchema),
  businessUnitController.addServiceToBusinessUnit,
);

businessUnitRouter.post(
  "/:id/departments",
  validateRequest(businessUnitValidator.addDepartmentSchema),
  businessUnitController.addDepartmentToBusinessUnit,
);

export default businessUnitRouter;
