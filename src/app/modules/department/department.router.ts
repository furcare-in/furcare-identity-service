// @ts-nocheck
import { Router } from "express";
import departmentController from "./department.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import departmentValidator from "./department.validator.js";

const departmentRouter = Router();

departmentRouter
  .route("/")
  .post(
    validateRequest(departmentValidator.createDepartmentSchema),
    departmentController.createDepartment,
  )
  .get(departmentController.getPaginatedDepartments);
departmentRouter
  .route("/:id")
  .get(departmentController.getDepartmentById)
  .patch(
    validateRequest(departmentValidator.updateDepartmentSchema),
    departmentController.updateDepartment,
  )
  .delete(departmentController.deleteDepartment);

export default departmentRouter;
