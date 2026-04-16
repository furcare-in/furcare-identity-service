import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import pick from "../../../helpers/pick.js";
import serviceService from "./service.service.js";

const createService = catchAsync(async (req, res) => {
  const data = req.body;
  const response = await serviceService.createService(data);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "service created successfully",
    data: response,
  });
});

const getServiceById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await serviceService.getServiceById(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "service fetched successfully",
    data: response,
  });
});

const getPaginatedServices = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["search", "businessUnitId"]);
  const options = pick(req.query, ["sort_by", "sort_order", "limit", "page"]);
  const response = await serviceService.getPaginatedServices(filters, options);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Categories fetched successfully",
    data: response,
  });
});

const updateService = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const response = await serviceService.updateService(id, data);

  res.status(httpStatus.OK).json({
    success: true,
    message: "service updated successfully",
    data: response,
  });
});

const deleteService = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await serviceService.deleteService(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "service deleted successfully",
    data: response,
  });
});

const serviceController = {
  createService,
  getServiceById,
  getPaginatedServices,
  updateService,
  deleteService,
};
export default serviceController;
