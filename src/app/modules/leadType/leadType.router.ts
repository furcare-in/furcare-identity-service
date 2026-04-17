// @ts-nocheck
import { Router } from "express";
import leadTypeController from "./leadType.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import leadTypeValidator from "./leadType.validator.js";

const leadTypeRouter = Router();

leadTypeRouter.post(
    "/",
    validateRequest(leadTypeValidator.createLeadTypeSchema),
    leadTypeController.createLeadType
);

leadTypeRouter.get("/", leadTypeController.getPaginatedLeadTypes);

leadTypeRouter.get("/:id", leadTypeController.getLeadTypeById);

leadTypeRouter.put(
    "/:id",
    validateRequest(leadTypeValidator.updateLeadTypeSchema),
    leadTypeController.updateLeadType
);

leadTypeRouter.delete("/:id", leadTypeController.deleteLeadType);

export default leadTypeRouter;
