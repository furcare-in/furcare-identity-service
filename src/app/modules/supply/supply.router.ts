import { Router } from "express";
import supplyController from "./supply.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import supplyValidator from "./supply.validator.js";

const supplyRouter = Router();

supplyRouter
  .route("/")
  .post(
    validateRequest(supplyValidator.createSupplySchema),
    supplyController.createSupply,
  )
  .get(supplyController.getPaginatedSupplys);
supplyRouter
  .route("/:id/items")
  .post(
    validateRequest(supplyValidator.addItemToSupply),
    supplyController.addItemToSupply,
  );
supplyRouter
  .route("/:id/items/:itemId")
  .delete(supplyController.removeItemFromSupply);
supplyRouter
  .route("/:id")
  .get(supplyController.getSupplyById)
  .patch(
    validateRequest(supplyValidator.updateSupplySchema),
    supplyController.updateSupply,
  )
  .delete(supplyController.deleteSupply);

export default supplyRouter;
