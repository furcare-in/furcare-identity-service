// @ts-nocheck
import { Router } from "express";
import contentLibraryController from "./contentLibrary.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import contentLibraryValidator from "./contentLibrary.validator.js";

const contentLibraryRouter = Router();

contentLibraryRouter.route("/").get(contentLibraryController.getContentLibrary);
contentLibraryRouter
  .route("/:id")
  .get(contentLibraryController.getContentById)
  .patch(
    validateRequest(contentLibraryValidator.updateContentSchema),
    contentLibraryController.updateContent,
  );

contentLibraryRouter.route("/").post(
  validateRequest(contentLibraryValidator.createContentSchema),
  contentLibraryController.createContent
);
contentLibraryRouter.route("/create-folder").post(contentLibraryController.createFolder);

export default contentLibraryRouter;
