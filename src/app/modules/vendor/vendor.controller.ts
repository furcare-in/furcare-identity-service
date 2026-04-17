// @ts-nocheck
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import pick from "../../../helpers/pick.js";
import vendorService from "./vendor.service.js";

const createVendor = catchAsync(async (req, res) => {
  const data = req.body;
  const response = await vendorService.createVendor(data);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "vendor created successfully",
    data: response,
  });
});

const getVendorById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await vendorService.getVendorById(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "vendor fetched successfully",
    data: response,
  });
});

const getPaginatedVendors = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["search", "businessUnitId"]);
  const options = pick(req.query, ["sort_by", "sort_order", "limit", "page"]);
  const response = await vendorService.getPaginatedVendors(filters, options);

  res.status(httpStatus.OK).json({
    success: true,
    message: "vendors fetched successfully",
    data: response,
  });
});

const updateVendor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const response = await vendorService.updateVendor(id, data);

  res.status(httpStatus.OK).json({
    success: true,
    message: "vendor updated successfully",
    data: response,
  });
});

const deleteVendor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await vendorService.deleteVendor(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "vendor deleted successfully",
    data: response,
  });
});

const vendorController = {
  createVendor,
  getVendorById,
  getPaginatedVendors,
  updateVendor,
  deleteVendor,
};
export default vendorController;
