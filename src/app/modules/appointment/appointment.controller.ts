import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import appointmentServices from "./appointment.service.js";

const getAllAppointments = catchAsync(async (req, res) => {
  const { branchId, startDate, endDate } = req.query;
  const response = await appointmentServices.getAllAppointments({
    branchId: branchId as string,
    startDate: startDate as string,
    endDate: endDate as string,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "Appointment fetched successfully",
    data: response,
  });
});

const createAppointment = catchAsync(async (req, res) => {
  const data = req.body;
  const response = await appointmentServices.createAppointment(data);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Appointment created successfully",
    data: response,
  });
});

const getAppointmentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await appointmentServices.getAppointmentById(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Appointment fetched successfully",
    data: response,
  });
});

const getAppointmentByBranchId = catchAsync(async (req, res) => {
  const {branchId} = req.params;

  const response = await appointmentServices.getAppointmentByBranchId(branchId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Appointment fetched successfully",
    data: response,
  });
});

const updateAppointment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const response = await appointmentServices.updateAppointment(id, data);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Appointment updated successfully",
    data: response,
  });
});

const deleteAppointment = catchAsync(async (req, res) => {
  const { id } = req.params;
  await appointmentServices.deleteAppointment(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Appointment deleted successfully",
    data: null,
  });
});


const appointmentController = {
  getAllAppointments, 
  getAppointmentByBranchId,
  getAppointmentById, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment, 
};
export default appointmentController;
