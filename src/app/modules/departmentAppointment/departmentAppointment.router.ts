import { Router } from "express";
import departmentAppointmentController from "./departmentAppointment.controller.js";

const departmentAppointmentRouter = Router();

departmentAppointmentRouter.route("/")
    .get(departmentAppointmentController.getAppointmentSlots)
    .post(departmentAppointmentController.createAppointmentSlot);

departmentAppointmentRouter.route("/:id")
    .delete(departmentAppointmentController.deleteAppointmentSlot);

departmentAppointmentRouter.route("/branch/:branchId")
    .get(departmentAppointmentController.getAppointmentSlotsByBranchId);

export default departmentAppointmentRouter;
