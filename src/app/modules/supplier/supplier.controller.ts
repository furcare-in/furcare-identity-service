// @ts-nocheck
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import { supplierService } from "./supplier.service.js";
import pick from "../../../utils/pick.js";

const createSupplier = catchAsync(async (req, res) => {
    const result = await supplierService.createSupplier(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Supplier created successfully",
        data: result,
    });
});

const getAllSuppliers = catchAsync(async (req, res) => {
    const filters = pick(req.query, ["search", "businessBranchId", "active"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await supplierService.getAllSuppliers(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Suppliers fetched successfully",
        data: result,
    });
});

const getSupplierById = catchAsync(async (req, res) => {
    const result = await supplierService.getSupplierById(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Supplier fetched successfully",
        data: result,
    });
});

const updateSupplier = catchAsync(async (req, res) => {
    const result = await supplierService.updateSupplier(req.params.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Supplier updated successfully",
        data: result,
    });
});

const deleteSupplier = catchAsync(async (req, res) => {
    const result = await supplierService.deleteSupplier(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Supplier deleted successfully",
        data: result,
    });
});

export const supplierController = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
};
