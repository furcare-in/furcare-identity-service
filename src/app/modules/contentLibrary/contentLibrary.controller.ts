import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError.js";
import catchAsync from "../../../utils/catchAsync.js";
import contentLibraryService from "./contentLibrary.service.js";

const getContentLibrary = catchAsync(async (req, res) => {
  const { search, businessBranchId } = req.query;
  const filters = { search, businessBranchId };
  const response = await contentLibraryService.getContentLibrary(filters);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Content library fetched successfully",
    data: response,
  });
});

const getContentById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const response = await contentLibraryService.getContentById(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Content fetched successfully",
    data: response,
  });
});

const updateContent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const response = await contentLibraryService.updateContent(id, data);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Content updated successfully",
    data: response,
  });
});

const createContent = catchAsync(async (req, res) => {
  const response = await contentLibraryService.createContent(req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Content created successfully",
    data: response,
  });
});

const createFolder = catchAsync(async (req, res) => {
  const { category } = req.body;
  // Mock folder creation - Category management is handled via Enums in this version
  res.status(httpStatus.OK).json({
    success: true,
    message: "Folder created successfully",
    data: category,
  });
});

const contentLibraryController = {
  getContentLibrary,
  getContentById,
  updateContent,
  createContent,
  createFolder
};
export default contentLibraryController;
