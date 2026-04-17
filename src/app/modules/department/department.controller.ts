// @ts-nocheck
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import pick from "../../../helpers/pick.js";
import departmentService from "./department.service.js";

const createDepartment = catchAsync(async (req, res) => {
  const data = req.body;
  const response = await departmentService.createDepartment(data);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "department created successfully",
    data: response,
  });
});

const getDepartmentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await departmentService.getDepartmentById(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "department fetched successfully",
    data: response,
  });
});

const getPaginatedDepartments = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["search", "businessUnitId"]);
  const options = pick(req.query, ["sort_by", "sort_order", "limit", "page"]);
  const response = await departmentService.getPaginatedDepartments(
    filters,
    options,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Categories fetched successfully",
    data: response,
  });
});

const updateDepartment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const response = await departmentService.updateDepartment(id, data);

  res.status(httpStatus.OK).json({
    success: true,
    message: "department updated successfully",
    data: response,
  });
});

const deleteDepartment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await departmentService.deleteDepartment(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "department deleted successfully",
    data: response,
  });
});

const departmentController = {
  createDepartment,
  getDepartmentById,
  getPaginatedDepartments,
  updateDepartment,
  deleteDepartment,
};
export default departmentController;
