import { Router } from "express";
import authRouter from "../modules/auth/auth.router.js";
import animalClassRouter from "../modules/animalClass/animalClass.router.js";
import businessBranchRouter from "../modules/businessBranch/businessBranch.router.js";
import serviceRouter from "../modules/service/service.router.js";
import departmentRouter from "../modules/department/department.router.js";
import diagnosticIntegrationRouter from "../modules/diagnosticIntegration/diagnosticIntegration.router.js";
import roleRouter from "../modules/role/role.router.js";
import staffRouter from "../modules/staff/staff.router.js";
import reportRouter from "../modules/report/report.router.js";
import groupRouter from "../modules/group/group.router.js";
import vendorRouter from "../modules/vendor/vendor.router.js";
import supplyRouter from "../modules/supply/supply.router.js";
import contentLibraryRouter from "../modules/contentLibrary/contentLibrary.router.js";
import documentTemplateRouter from "../modules/docuemntTemplate/documentTemplate.router.js";
import clientRouter from "../modules/client/client.router.js";
import businessUnitRouter from "../modules/businessUnit/businessUnit.router.js";
import appointmentRouter from "../modules/appointment/appointment.router.js";
import staffScheduleRouter from "../modules/staffSchedule/staffSchedule.router.js";
import departmentAppointmentRouter from "../modules/departmentAppointment/departmentAppointment.router.js";
import leadTypeRouter from "../modules/leadType/leadType.router.js";
import productRouter from "../modules/product/product.router.js";
import supplierRouter from "../modules/supplier/supplier.router.js";
import { visitRouter } from "../modules/visit/visit.router.js";
import { portalRouter } from "../modules/portal/portal.router.js";
import vaccinationStatusRouter from "../modules/vaccinationStatus/vaccinationStatus.router.js";
import { anesthesiaRouter } from "../modules/anesthesia/anesthesia.router.js";
import { orthopedicExamRouter } from "../modules/orthopedic-exam/orthopedic-exam.router.js";
import { chatbotRouter } from "../modules/chatbot/chatbot.router.js";
import locationRouter from "../modules/location/location.router.js";
import locationsToBranchesRouter from "../modules/location/locationsToBranches.router.js";
import { whatsappRouter } from "../modules/whatsapp/whatsapp.router.js";
const v1router = Router();

const moduleRoutes = [
  { path: "/auth", router: authRouter },
  { path: "/animal-classes", router: animalClassRouter },
  { path: "/business-branches", router: businessBranchRouter },
  { path: "/business-units", router: businessUnitRouter },
  { path: "/services", router: serviceRouter },
  { path: "/departments", router: departmentRouter },
  { path: "/diagnostic-integrations", router: diagnosticIntegrationRouter },
  { path: "/roles", router: roleRouter },
  { path: "/staff", router: staffRouter },
  { path: "/reports", router: reportRouter },
  { path: "/groups", router: groupRouter },
  { path: "/vendors", router: vendorRouter },
  { path: "/supplies", router: supplyRouter },
  { path: "/content-library", router: contentLibraryRouter },
  { path: "/document-templates", router: documentTemplateRouter },
  { path: "/clients", router: clientRouter },
  { path: "/appointment", router: appointmentRouter },
  { path: "/staff-schedules", router: staffScheduleRouter },
  { path: "/department-appointment-slots", router: departmentAppointmentRouter },
  { path: "/department-appointment", router: departmentAppointmentRouter },
  { path: "/lead-types", router: leadTypeRouter },
  { path: "/products", router: productRouter },
  { path: "/suppliers", router: supplierRouter },
  { path: "/visits", router: visitRouter },
  { path: "/portal", router: portalRouter },
  { path: "/vaccination-status", router: vaccinationStatusRouter },
  { path: "/anesthesia", router: anesthesiaRouter },
  { path: "/orthopedic-exam", router: orthopedicExamRouter },
  { path: "/chatbot", router: chatbotRouter },
  { path: "/locations", router: locationRouter },
  { path: "/locations-to-branches", router: locationsToBranchesRouter },
  { path: "/whatsapp", router: whatsappRouter },
];

moduleRoutes.forEach((route) => v1router.use(route.path, route.router));

export default v1router;
