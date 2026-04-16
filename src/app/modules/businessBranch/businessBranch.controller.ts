import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import pick from "../../../helpers/pick.js";
import businessBranchService from "./businessBranch.service.js";

const createBusinessBranch = catchAsync(async (req, res) => {
  const data = req.body;
  const response = await businessBranchService.createBusinessBranch(data);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "businessBranch created successfully",
    data: response,
  });
});

const getBusinessBranchById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await businessBranchService.getBusinessBranchById(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "businessBranch fetched successfully",
    data: response,
  });
});

const getPaginatedBusinessBranchs = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["search", "businessUnitId"]);
  const options = pick(req.query, ["sort_by", "sort_order", "limit", "page"]);
  const response = await businessBranchService.getPaginatedBusinessBranchs(
    filters,
    options,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Categories fetched successfully",
    data: response,
  });
});

const updateBusinessBranch = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const response = await businessBranchService.updateBusinessBranch(id, data);

  res.status(httpStatus.OK).json({
    success: true,
    message: "businessBranch updated successfully",
    data: response,
  });
});

const deleteBusinessBranch = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await businessBranchService.deleteBusinessBranch(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "businessBranch deleted successfully",
    data: response,
  });
});

const addAnimalClassToBranch = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { animalClassId } = req.body;
  const response = await businessBranchService.addAnimalClassToBranch(
    id,
    animalClassId,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "AnimalClass added successfully",
    data: response,
  });
});

const removeAnimalClassFromBranch = catchAsync(async (req, res) => {
  const { id, animalClassId } = req.params;
  const response = await businessBranchService.removeAnimalClassFromBranch(
    id,
    animalClassId,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "AnimalClass updated successfully",
    data: response,
  });
});

const updateAnimalClassInBranch = catchAsync(async (req, res) => {
  const { id, animalClassId } = req.params;
  const data = req.body;
  const response = await businessBranchService.updateAnimalClassInBranch(
    id,
    animalClassId,
    data,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "AnimalClass updated successfully",
    data: response,
  });
});

const addDepartmentsToBranch = catchAsync(async (req, res) => {
  const branchId = req.params.id;
  const { departmentIds } = req.body;

  const response = await businessBranchService.addDepartmentsToBranch(
    branchId,
    departmentIds,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Departments added successfully",
    data: response,
  });
});

const removeDepartmentFromBranch = catchAsync(async (req, res) => {
  const { id: branchId, departmentId } = req.params;
  const response = await businessBranchService.removeDepartmentFromBranch(branchId, departmentId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Department removed successfully",
    data: response,
  });
});

const updateDepartmentInBranch = catchAsync(async (req, res) => {
  const { id: branchId, departmentId } = req.params;
  const data = req.body;

  const response = await businessBranchService.updateDepartmentInBranch(
    branchId,
    departmentId,
    data,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Departments updated successfully",
    data: response,
  });
});

const addServicesToBranch = catchAsync(async (req, res) => {
  const branchId = req.params.id;
  const { services } = req.body;

  const response = await businessBranchService.addServicesToBranch(
    branchId,
    services,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Services added successfully",
    data: response,
  });
});

const removeServiceFromBranch = catchAsync(async (req, res) => {
  const { id: branchId, serviceId } = req.params;
  const response = await businessBranchService.removeServiceFromBranch(branchId, serviceId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Service removed successfully",
    data: response,
  });
});

const updateServiceInBranch = catchAsync(async (req, res) => {
  const { id: branchId, serviceId } = req.params;
  const data = req.body;

  const response = await businessBranchService.updateServiceInBranch(
    branchId,
    serviceId,
    data,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Services updated successfully",
    data: response,
  });
});

const addAppointmentSlotsToBranch = catchAsync(async (req, res) => {
  const branchId = req.params.id;
  const { appointmentSlots } = req.body;

  const response = await businessBranchService.addAppointmentSlotsToBranch(
    branchId,
    appointmentSlots,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "AppointmentSlots added successfully",
    data: response,
  });
});

const updateAppointmentSlotInBranch = catchAsync(async (req, res) => {
  const { id: branchId, appointmentSlotId } = req.params;
  const data = req.body;

  const response = await businessBranchService.updateAppointmentSlotInBranch(
    branchId,
    appointmentSlotId,
    data,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "AppointmentSlot updated successfully",
    data: response,
  });
});

const businessBranchController = {
  createBusinessBranch,
  getBusinessBranchById,
  getPaginatedBusinessBranchs,
  updateBusinessBranch,
  deleteBusinessBranch,
  addAnimalClassToBranch,
  removeAnimalClassFromBranch,
  updateAnimalClassInBranch,
  addDepartmentsToBranch,
  removeDepartmentFromBranch,
  updateDepartmentInBranch,
  addServicesToBranch,
  removeServiceFromBranch,
  updateServiceInBranch,
  addAppointmentSlotsToBranch,
  updateAppointmentSlotInBranch,
};
export default businessBranchController;
