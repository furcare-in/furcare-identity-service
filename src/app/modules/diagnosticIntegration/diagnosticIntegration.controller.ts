import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import pick from "../../../helpers/pick.js";
import diagnosticIntegrationService from "./diagnosticIntegration.service.js";

const createDiagnosticIntegration = catchAsync(async (req, res) => {
  const data = req.body;
  const response =
    await diagnosticIntegrationService.createDiagnosticIntegration(data);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "diagnosticIntegration created successfully",
    data: response,
  });
});

const getDiagnosticIntegrationById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response =
    await diagnosticIntegrationService.getDiagnosticIntegrationById(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "diagnosticIntegration fetched successfully",
    data: response,
  });
});

const getPaginatedDiagnosticIntegrations = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["search", "businessBranchId"]);
  const options = pick(req.query, ["sort_by", "sort_order", "limit", "page"]);
  const response =
    await diagnosticIntegrationService.getPaginatedDiagnosticIntegrations(
      filters,
      options,
    );

  res.status(httpStatus.OK).json({
    success: true,
    message: "diagnosticIntegrations fetched successfully",
    data: response,
  });
});

const updateDiagnosticIntegration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const response =
    await diagnosticIntegrationService.updateDiagnosticIntegration(id, data);

  res.status(httpStatus.OK).json({
    success: true,
    message: "diagnosticIntegration updated successfully",
    data: response,
  });
});

const deleteDiagnosticIntegration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response =
    await diagnosticIntegrationService.deleteDiagnosticIntegration(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "diagnosticIntegration deleted successfully",
    data: response,
  });
});

const diagnosticIntegrationController = {
  createDiagnosticIntegration,
  getDiagnosticIntegrationById,
  getPaginatedDiagnosticIntegrations,
  updateDiagnosticIntegration,
  deleteDiagnosticIntegration,
};
export default diagnosticIntegrationController;
