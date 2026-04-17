// @ts-nocheck
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import departmentAppointmentService from "./departmentAppointment.service.js";

const createAppointmentSlot = catchAsync(async (req, res) => {
    const result = await departmentAppointmentService.createAppointmentSlot(req.body);
    res.status(httpStatus.CREATED).json({
        success: true,
        message: "Appointment slot created successfully",
        data: result,
    });
});

const getAppointmentSlots = catchAsync(async (req, res) => {
    const filters = req.query;
    const result = await departmentAppointmentService.getAppointmentSlots(filters);
    res.status(httpStatus.OK).json({
        success: true,
        message: "Appointment slots fetched successfully",
        data: result,
    });
});

const getAppointmentSlotsByBranchId = catchAsync(async (req, res) => {
    const { branchId } = req.params;
    const result = await departmentAppointmentService.getAppointmentSlotsByBranchId(branchId);
    res.status(httpStatus.OK).json({
        success: true,
        message: "Appointment slots fetched successfully",
        data: result,
    });
});

const deleteAppointmentSlot = catchAsync(async (req, res) => {
    const { id } = req.params;
    await departmentAppointmentService.deleteAppointmentSlot(id);
    res.status(httpStatus.OK).json({
        success: true,
        message: "Appointment slot deleted successfully",
    });
});

const departmentAppointmentController = {
    createAppointmentSlot,
    getAppointmentSlots,
    getAppointmentSlotsByBranchId,
    deleteAppointmentSlot,
};

export default departmentAppointmentController;
