// @ts-nocheck
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import pick from "../../../helpers/pick.js";
import roleService from "./role.service.js";

const createRole = catchAsync(async (req, res) => {
  const data = req.body;
  const response = await roleService.createRole(data);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "role created successfully",
    data: response,
  });
});

const getRoleById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await roleService.getRoleById(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "role fetched successfully",
    data: response,
  });
});

const getPaginatedRoles = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["search", "businessBranchId"]);
  const options = pick(req.query, ["sort_by", "sort_order", "limit", "page"]);
  const response = await roleService.getPaginatedRoles(filters, options);

  res.status(httpStatus.OK).json({
    success: true,
    message: "roles fetched successfully",
    data: response,
  });
});

const updateRole = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const response = await roleService.updateRole(id, data);

  res.status(httpStatus.OK).json({
    success: true,
    message: "role updated successfully",
    data: response,
  });
});

const deleteRole = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await roleService.deleteRole(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "role deleted successfully",
    data: response,
  });
});

const roleController = {
  createRole,
  getRoleById,
  getPaginatedRoles,
  updateRole,
  deleteRole,
};
export default roleController;
