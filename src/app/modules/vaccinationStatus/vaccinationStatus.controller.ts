import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import { vaccinationStatusService } from "./vaccinationStatus.service.js";
import pick from "../../../utils/pick.js";

const createVaccination = catchAsync(async (req, res) => {
    const result = await vaccinationStatusService.createVaccination(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Vaccination status created successfully",
        data: result,
    });
});

const getAllVaccinations = catchAsync(async (req, res) => {
    const filters = pick(req.query, ["search", "petId", "businessBranchId", "status"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await vaccinationStatusService.getPaginatedVaccinations(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Vaccination records fetched successfully",
        data: result,
    });
});

const getVaccinationsByPet = catchAsync(async (req, res) => {
    const { petId } = req.params;
    const result = await vaccinationStatusService.getVaccinationsByPetId(petId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Pet vaccination records fetched successfully",
        data: result,
    });
});

const getVaccinationById = catchAsync(async (req, res) => {
    const result = await vaccinationStatusService.getVaccinationById(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Vaccination record fetched successfully",
        data: result,
    });
});

const updateVaccination = catchAsync(async (req, res) => {
    const result = await vaccinationStatusService.updateVaccination(req.params.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Vaccination status updated successfully",
        data: result,
    });
});

const deleteVaccination = catchAsync(async (req, res) => {
    const result = await vaccinationStatusService.deleteVaccination(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Vaccination record deleted successfully",
        data: result,
    });
});

export const vaccinationStatusController = {
    createVaccination,
    getAllVaccinations,
    getVaccinationsByPet,
    getVaccinationById,
    updateVaccination,
    deleteVaccination,
};
