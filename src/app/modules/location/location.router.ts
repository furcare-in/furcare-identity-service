import { Router } from "express";
import locationController from "./location.controller.js";

const locationRouter = Router();

// GET /api/v1/locations?branchId=xxx  - list by branch
// POST /api/v1/locations               - create new location
locationRouter.get("/", locationController.getLocationsByBranch);
locationRouter.post("/", locationController.createLocation);

// GET/PATCH/DELETE /api/v1/locations/:id
locationRouter.route("/:id")
    .get(locationController.getLocationById)
    .patch(locationController.updateLocation)
    .delete(locationController.deleteLocation);

export default locationRouter;
