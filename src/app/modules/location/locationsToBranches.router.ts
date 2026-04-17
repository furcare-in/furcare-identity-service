// @ts-nocheck
import { Router } from "express";
import locationController from "./location.controller.js";

const locationsToBranchesRouter = Router();

// POST /api/v1/locations-to-branches               - link a location to a branch
locationsToBranchesRouter.post("/", locationController.linkLocationToBranch);
// DELETE /api/v1/locations-to-branches/location/:locationId  - unlink
locationsToBranchesRouter.delete("/location/:locationId", locationController.unlinkLocationFromBranch);

export default locationsToBranchesRouter;
