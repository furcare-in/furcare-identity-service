// @ts-nocheck
import { Router } from "express";
import roleController from "./role.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import roleValidator from "./role.validator.js";

const roleRouter = Router();

roleRouter
  .route("/")
  .post(
    validateRequest(roleValidator.createRoleSchema),
    roleController.createRole,
  )
  .get(roleController.getPaginatedRoles);
roleRouter
  .route("/:id")
  .get(roleController.getRoleById)
  .patch(
    validateRequest(roleValidator.updateRoleSchema),
    roleController.updateRole,
  )
  .delete(roleController.deleteRole);

export default roleRouter;
