import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import pick from "../../../helpers/pick.js";
import groupService from "./group.service.js";

const createGroup = catchAsync(async (req, res) => {
  const data = req.body;
  const response = await groupService.createGroup(data);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "group created successfully",
    data: response,
  });
});

const getGroupById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await groupService.getGroupById(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "group fetched successfully",
    data: response,
  });
});

const getPaginatedGroups = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["search", "businessBranchId"]);
  const options = pick(req.query, ["sort_by", "sort_order", "limit", "page"]);
  const response = await groupService.getPaginatedGroups(filters, options);

  res.status(httpStatus.OK).json({
    success: true,
    message: "groups fetched successfully",
    data: response,
  });
});

const updateGroup = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const response = await groupService.updateGroup(id, data);

  res.status(httpStatus.OK).json({
    success: true,
    message: "group updated successfully",
    data: response,
  });
});

const addResourceToGroup = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { staffIds } = req.body;
  const response = await groupService.addRerouceToGroup(id, staffIds);

  res.status(httpStatus.OK).json({
    success: true,
    message: "resource added successfully",
    data: response,
  });
});

const removeResourceFromGroup = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { staffIds } = req.body;
  const response = await groupService.removeRerouceToGroup(id, staffIds);

  res.status(httpStatus.OK).json({
    success: true,
    message: "resource removed successfully",
    data: response,
  });
});

const deleteGroup = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await groupService.deleteGroup(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "group deleted successfully",
    data: response,
  });
});

const groupController = {
  createGroup,
  getGroupById,
  getPaginatedGroups,
  updateGroup,
  addResourceToGroup,
  removeResourceFromGroup,
  deleteGroup,
};
export default groupController;
