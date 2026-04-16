import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import pick from "../../../helpers/pick.js";
import leadTypeService from "./leadType.service.js";

const createLeadType = catchAsync(async (req, res) => {
    const data = req.body;
    const response = await leadTypeService.createLeadType(data);

    res.status(httpStatus.CREATED).json({
        success: true,
        message: "Lead Type created successfully",
        data: response,
    });
});

const getPaginatedLeadTypes = catchAsync(async (req, res) => {
    const filters = pick(req.query, ["search", "businessBranchId"]);
    const options = pick(req.query, ["sort_by", "sort_order", "limit", "page"]);
    const response = await leadTypeService.getPaginatedLeadTypes(filters, options);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Lead Types fetched successfully",
        data: response,
    });
});

const getLeadTypeById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const response = await leadTypeService.getLeadTypeById(id);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Lead Type fetched successfully",
        data: response,
    });
});

const updateLeadType = catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const response = await leadTypeService.updateLeadType(id, data);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Lead Type updated successfully",
        data: response,
    });
});

const deleteLeadType = catchAsync(async (req, res) => {
    const { id } = req.params;
    const response = await leadTypeService.deleteLeadType(id);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Lead Type deleted successfully",
        data: response,
    });
});

const leadTypeController = {
    createLeadType,
    getPaginatedLeadTypes,
    getLeadTypeById,
    updateLeadType,
    deleteLeadType,
};

export default leadTypeController;
