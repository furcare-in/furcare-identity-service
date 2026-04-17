// @ts-nocheck
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import pick from "../../../helpers/pick.js";
import animalClassService from "./animalClass.service.js";

const createAnimalClass = catchAsync(async (req, res) => {
  const data = req.body;
  const response = await animalClassService.createAnimalClass(data);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "animalClass created successfully",
    data: response,
  });
});

const getAnimalClassById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await animalClassService.getAnimalClassById(id);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "animalClass fetched successfully",
    data: response,
  });
});

const getPaginatedAnimalClasss = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["search", "business_branch_id", "active"]);
  const options = pick(req.query, ["sort_by", "sort_order", "limit", "page"]);
  const response = await animalClassService.getPaginatedAnimalClasss(
    filters,
    options,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Categories fetched successfully",
    data: response,
  });
});

const updateAnimalClass = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const response = await animalClassService.updateAnimalClass(id, data);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "animalClass updated successfully",
    data: response,
  });
});

const deleteAnimalClass = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await animalClassService.deleteAnimalClass(id);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "animalClass deleted successfully",
    data: response,
  });
});

const animalClassController = {
  createAnimalClass,
  getAnimalClassById,
  getPaginatedAnimalClasss,
  updateAnimalClass,
  deleteAnimalClass,
};
export default animalClassController;
