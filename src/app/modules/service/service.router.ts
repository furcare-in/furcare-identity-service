import { Router } from "express";
import serviceController from "./service.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import serviceValidator from "./service.validator.js";

const serviceRouter = Router();

serviceRouter
  .route("/")
  .post(
    validateRequest(serviceValidator.createServiceSchema),
    serviceController.createService,
  )
  .get(serviceController.getPaginatedServices);
serviceRouter
  .route("/:id")
  .get(serviceController.getServiceById)
  .patch(
    validateRequest(serviceValidator.updateServiceSchema),
    serviceController.updateService,
  )
  .delete(serviceController.deleteService);

export default serviceRouter;
