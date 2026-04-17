// @ts-nocheck
import { Router } from "express";
import diagnosticIntegrationController from "./diagnosticIntegration.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import diagnosticIntegrationValidator from "./diagnosticIntegration.validator.js";

const diagnosticIntegrationRouter = Router();

diagnosticIntegrationRouter
  .route("/")
  .post(
    validateRequest(
      diagnosticIntegrationValidator.createDiagnosticIntegrationSchema,
    ),
    diagnosticIntegrationController.createDiagnosticIntegration,
  )
  .get(diagnosticIntegrationController.getPaginatedDiagnosticIntegrations);
diagnosticIntegrationRouter
  .route("/:id")
  .get(diagnosticIntegrationController.getDiagnosticIntegrationById)
  .patch(
    validateRequest(
      diagnosticIntegrationValidator.updateDiagnosticIntegrationSchema,
    ),
    diagnosticIntegrationController.updateDiagnosticIntegration,
  )
  .delete(diagnosticIntegrationController.deleteDiagnosticIntegration);

export default diagnosticIntegrationRouter;
