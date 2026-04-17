// @ts-nocheck
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import pick from "../../../helpers/pick.js";
import reportService from "./report.service.js";
import pkg from "@prisma/client";
const { ReportType } = pkg;

const createReport = catchAsync(async (req, res) => {
  const data = req.body;
  const response = await reportService.createReport(data);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "report created successfully",
    data: response,
  });
});

const getReportById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await reportService.getReportById(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "report fetched successfully",
    data: response,
  });
});

const getPaginatedReports = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["search", "businessBranchId", "businessUnitId"]);
  const options = pick(req.query, ["sort_by", "sort_order", "limit", "page"]);
  const response = await reportService.getPaginatedReports(filters, options);

  res.status(httpStatus.OK).json({
    success: true,
    message: "reports fetched successfully",
    data: response,
  });
});

const updateReport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const response = await reportService.updateReport(id, data);

  res.status(httpStatus.OK).json({
    success: true,
    message: "report updated successfully",
    data: response,
  });
});

const deleteReport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await reportService.deleteReport(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "report deleted successfully",
    data: response,
  });
});

const getReportFieldCatalog = catchAsync(async (req, res) => {
  const { type } = req.query as { type?: ReportType };
  const response = await reportService.getReportFieldCatalog(type);

  res.status(httpStatus.OK).json({
    success: true,
    message: "report field catalog fetched successfully",
    data: response,
  });
});

const getReportData = catchAsync(async (req, res) => {
  const response = await reportService.getReportData(req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: "report data fetched successfully",
    data: response,
  });
});

const reportController = {
  createReport,
  getReportById,
  getPaginatedReports,
  updateReport,
  deleteReport,
  getReportFieldCatalog,
  getReportData,
};
export default reportController;
