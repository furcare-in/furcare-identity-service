// @ts-nocheck
import { Router } from "express";
import { productController } from "./product.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import { productValidator } from "./product.validator.js";
import auth from "../../middleware/auth.js";

const productRouter = Router();

productRouter.post(
    "/",
    auth(),
    validateRequest(productValidator.create),
    productController.createProduct
);

productRouter.get(
    "/",
    auth(),
    productController.getAllProducts
);

productRouter.get(
    "/openfda/search",
    auth(),
    productController.searchOpenFda
);

productRouter.get(
    "/openfda/details",
    auth(),
    productController.getOpenFdaDetails
);

productRouter.get(
    "/openfda/dose",
    auth(),
    productController.getOpenFdaDose
);

productRouter.get(
    "/veterinary/clinical-rules",
    auth(),
    productController.getClinicalRules
);

productRouter.get(
    "/:id",
    auth(),
    productController.getProductById
);

productRouter.patch(
    "/:id",
    auth(),
    validateRequest(productValidator.update),
    productController.updateProduct
);

productRouter.delete(
    "/:id",
    auth(),
    productController.deleteProduct
);

productRouter.post(
    "/:id/calculate",
    auth(),
    validateRequest(productValidator.calculateDosage),
    productController.calculateDosage
);

export default productRouter;
