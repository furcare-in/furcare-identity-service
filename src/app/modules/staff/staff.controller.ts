import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import pick from "../../../helpers/pick.js";
import staffService from "./staff.service.js";

const createStaff = catchAsync(async (req, res) => {
  const data = req.body;
  const response = await staffService.createStaff(data);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "staff created successfully",
    data: response,
  });
});

const getStaffById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await staffService.getStaffById(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "staff fetched successfully",
    data: response,
  });
});

const getPaginatedStaffs = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["search", "businessBranchId"]);
  const options = pick(req.query, ["sort_by", "sort_order", "limit", "page"]);
  const response = await staffService.getPaginatedStaffs(filters, options);

  res.status(httpStatus.OK).json({
    success: true,
    message: "staffs fetched successfully",
    data: response,
  });
});

const updateStaff = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const response = await staffService.updateStaff(id, data);

  res.status(httpStatus.OK).json({
    success: true,
    message: "staff updated successfully",
    data: response,
  });
});

const deleteStaff = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await staffService.deleteStaff(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "staff deleted successfully",
    data: response,
  });
});

const getDoctors = catchAsync(async (req, res) => {
  const businessBranchId = req.query.businessBranchId as string;
  const response = await staffService.getDoctors(businessBranchId);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Doctors fetched successfully",
    data: response,
  });
});

const createAdminWithoutUnit = catchAsync(async (req, res) => {
  const data = req.body;
  const response = await staffService.createAdminWithoutUnit(data);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Admin created successfully. They will complete onboarding on first login.",
    data: response,
  });
});

const completeOnboarding = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { businessUnitId, businessBranchId } = req.body;
  const response = await staffService.completeOnboarding(
    id,
    businessUnitId,
    businessBranchId
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Onboarding completed successfully",
    data: response,
  });
});

const updateCustomPermissions = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { permissions } = req.body;
  const response = await staffService.updateCustomPermissions(id, permissions);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Permissions updated successfully",
    data: response,
  });
});

const staffController = {
  createStaff,
  getStaffById,
  getPaginatedStaffs,
  updateStaff,
  deleteStaff,
  getDoctors,
  createAdminWithoutUnit,
  completeOnboarding,
  updateCustomPermissions,
};
export default staffController;
