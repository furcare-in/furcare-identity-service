import { Router } from "express";
import vendorController from "./vendor.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import vendorValidator from "./vendor.validator.js";

const vendorRouter = Router();

vendorRouter
  .route("/")
  .post(
    validateRequest(vendorValidator.createVendorSchema),
    vendorController.createVendor,
  )
  .get(vendorController.getPaginatedVendors);
vendorRouter
  .route("/:id")
  .get(vendorController.getVendorById)
  .patch(
    validateRequest(vendorValidator.updateVendorSchema),
    vendorController.updateVendor,
  )
  .delete(vendorController.deleteVendor);

export default vendorRouter;
