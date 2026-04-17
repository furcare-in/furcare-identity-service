// @ts-nocheck
import { Router } from "express";
import reportController from "./report.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import reportValidator from "./report.validator.js";

const reportRouter = Router();

reportRouter
  .route("/field-catalog")
  .get(reportController.getReportFieldCatalog);

reportRouter
  .route("/report-data")
  .post(
    validateRequest(reportValidator.reportDataSchema),
    reportController.getReportData,
  );

reportRouter
  .route("/")
  .post(
    validateRequest(reportValidator.createReportSchema),
    reportController.createReport,
  )
  .get(reportController.getPaginatedReports);
reportRouter
  .route("/:id")
  .get(reportController.getReportById)
  .patch(
    validateRequest(reportValidator.updateReportSchema),
    reportController.updateReport,
  )
  .delete(reportController.deleteReport);

export default reportRouter;
