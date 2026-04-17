// @ts-nocheck
import { Router } from "express";
import { supplierController } from "./supplier.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import { supplierValidator } from "./supplier.validator.js";
import auth from "../../middleware/auth.js";

const supplierRouter = Router();

supplierRouter.post(
    "/",
    auth(),
    validateRequest(supplierValidator.create),
    supplierController.createSupplier
);

supplierRouter.get(
    "/",
    auth(),
    supplierController.getAllSuppliers
);

supplierRouter.get(
    "/:id",
    auth(),
    supplierController.getSupplierById
);

supplierRouter.patch(
    "/:id",
    auth(),
    validateRequest(supplierValidator.update),
    supplierController.updateSupplier
);

supplierRouter.delete(
    "/:id",
    auth(),
    supplierController.deleteSupplier
);

export default supplierRouter;
