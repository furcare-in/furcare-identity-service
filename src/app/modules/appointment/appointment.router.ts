import { Router } from "express";
import appointmentController from "./appointment.controller.js";
const appointmentRouter = Router();

appointmentRouter.route("/").get(appointmentController.getAllAppointments);
appointmentRouter.route("/:id").get(appointmentController.getAppointmentById);
appointmentRouter.route("/branch/:branchId").get(appointmentController.getAppointmentByBranchId);
appointmentRouter.route("/").post(appointmentController.createAppointment);
appointmentRouter.route("/:id").patch(appointmentController.updateAppointment);
appointmentRouter.route("/:id").delete(appointmentController.deleteAppointment);

export default appointmentRouter;
