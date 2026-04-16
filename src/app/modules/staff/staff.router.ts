import { Router } from "express";
import staffController from "./staff.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import staffValidator from "./staff.validator.js";

const staffRouter = Router();

staffRouter
  .route("/")
  .post(
    validateRequest(staffValidator.createStaffSchema),
    staffController.createStaff,
  )
  .get(staffController.getPaginatedStaffs);

staffRouter
  .route("/doctors")
  .get(staffController.getDoctors);

staffRouter
  .route("/create-admin")
  .post(staffController.createAdminWithoutUnit);

staffRouter
  .route("/:id/complete-onboarding")
  .patch(staffController.completeOnboarding);

staffRouter
  .route("/:id/custom-permissions")
  .patch(staffController.updateCustomPermissions);

staffRouter
  .route("/:id")
  .get(staffController.getStaffById)
  .patch(
    validateRequest(staffValidator.updateStaffSchema),
    staffController.updateStaff,
  )
  .delete(staffController.deleteStaff);

export default staffRouter;

