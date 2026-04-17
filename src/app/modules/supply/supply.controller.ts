// @ts-nocheck
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import pick from "../../../helpers/pick.js";
import supplyService from "./supply.service.js";

const createSupply = catchAsync(async (req, res) => {
  const payload = req.body;
  const response = await supplyService.createSupply(payload);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "supply created successfully",
    data: response,
  });
});

const getSupplyById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await supplyService.getSupplyById(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "supply fetched successfully",
    data: response,
  });
});

const getPaginatedSupplys = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["search", "businessBranchId"]);
  const options = pick(req.query, ["sort_by", "sort_order", "limit", "page"]);
  const response = await supplyService.getPaginatedSupplys(filters, options);

  res.status(httpStatus.OK).json({
    success: true,
    message: "supplys fetched successfully",
    data: response,
  });
});

const updateSupply = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const response = await supplyService.updateSupply(id, data);

  res.status(httpStatus.OK).json({
    success: true,
    message: "supply updated successfully",
    data: response,
  });
});

const addItemToSupply = catchAsync(async (req, res) => {
  const supplyId = req.params.id;
  const { items } = req.body;
  const response = await supplyService.addItemToSupply(supplyId, items);

  res.status(httpStatus.OK).json({
    success: true,
    message: "item added successfully",
    data: response,
  });
});

const removeItemFromSupply = catchAsync(async (req, res) => {
  const { id: supplyId, itemId } = req.params;
  const response = await supplyService.removeItemFromSupply(supplyId, itemId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "item removed successfully",
    data: response,
  });
});

const deleteSupply = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await supplyService.deleteSupply(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "supply deleted successfully",
    data: response,
  });
});

const supplyController = {
  createSupply,
  getSupplyById,
  getPaginatedSupplys,
  updateSupply,
  addItemToSupply,
  removeItemFromSupply,
  deleteSupply,
};
export default supplyController;
