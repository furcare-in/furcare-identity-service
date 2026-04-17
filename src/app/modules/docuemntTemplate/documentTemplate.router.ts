// @ts-nocheck
import { Router } from "express";
import documentTemplateController from "./documentTemplate.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import documentTemplateValidator from "./documentTemplate.validator.js";

const documentTemplateRouter = Router();

documentTemplateRouter
  .route("/")
  .post(
    validateRequest(documentTemplateValidator.createDocumentTemplateSchema),
    documentTemplateController.createDocumentTemplate,
  )
  .get(documentTemplateController.getPaginatedDocumentTemplates);
documentTemplateRouter
  .route("/:id")
  .get(documentTemplateController.getDocumentTemplateById)
  .patch(
    validateRequest(documentTemplateValidator.updateDocumentTemplateSchema),
    documentTemplateController.updateDocumentTemplate,
  )
  .delete(documentTemplateController.deleteDocumentTemplate);

export default documentTemplateRouter;
