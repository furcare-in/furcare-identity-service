// @ts-nocheck
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import locationService from "./location.service.js";

const createLocation = catchAsync(async (req, res) => {
    const response = await locationService.createLocation(req.body);
    res.status(httpStatus.CREATED).json({ success: true, message: "Location created", data: response });
});

const getLocationById = catchAsync(async (req, res) => {
    const response = await locationService.getLocationById(req.params.id);
    res.status(httpStatus.OK).json({ success: true, message: "Location fetched", data: response });
});

const updateLocation = catchAsync(async (req, res) => {
    const response = await locationService.updateLocation(req.params.id, req.body);
    res.status(httpStatus.OK).json({ success: true, message: "Location updated", data: response });
});

const deleteLocation = catchAsync(async (req, res) => {
    const response = await locationService.deleteLocation(req.params.id);
    res.status(httpStatus.OK).json({ success: true, message: "Location deleted", data: response });
});

const getLocationsByBranch = catchAsync(async (req, res) => {
    const { branchId } = req.query as { branchId: string };
    const response = await locationService.getLocationsByBranch(branchId);
    res.status(httpStatus.OK).json({ success: true, message: "Locations fetched", data: response });
});

const linkLocationToBranch = catchAsync(async (req, res) => {
    const { locationId, businessBranchId } = req.body;
    const response = await locationService.linkLocationToBranch(locationId, businessBranchId);
    res.status(httpStatus.CREATED).json({ success: true, message: "Location linked to branch", data: response });
});

const unlinkLocationFromBranch = catchAsync(async (req, res) => {
    const response = await locationService.unlinkLocationFromBranch(req.params.locationId);
    res.status(httpStatus.OK).json({ success: true, message: "Location unlinked", data: response });
});

const locationController = {
    createLocation,
    getLocationById,
    updateLocation,
    deleteLocation,
    getLocationsByBranch,
    linkLocationToBranch,
    unlinkLocationFromBranch,
};

export default locationController;
