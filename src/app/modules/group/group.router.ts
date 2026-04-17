// @ts-nocheck
import { Router } from "express";
import groupController from "./group.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import groupValidator from "./group.validator.js";

const groupRouter = Router();

groupRouter
  .route("/")
  .post(
    validateRequest(groupValidator.createGroupSchema),
    groupController.createGroup,
  )
  .get(groupController.getPaginatedGroups);
groupRouter
  .route("/:id")
  .get(groupController.getGroupById)
  .patch(
    validateRequest(groupValidator.updateGroupSchema),
    groupController.updateGroup,
  )
  .delete(groupController.deleteGroup);
groupRouter
  .route("/:id/resources")
  .post(
    validateRequest(groupValidator.addOrRemoveResourceFromGroup),
    groupController.addResourceToGroup,
  )
  .delete(
    validateRequest(groupValidator.addOrRemoveResourceFromGroup),
    groupController.removeResourceFromGroup,
  );

export default groupRouter;
