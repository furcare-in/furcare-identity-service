import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import businessUnitService from "./businessUnit.service.js";

const onboardBusinessUnit = catchAsync(async (req, res) => {
  const response = await businessUnitService.onboardBusinessUnit(req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Business unit created successfully",
    data: response,
  });
});


const getBusinessUnitById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await businessUnitService.getBusinessUnitById(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Business unit fetched successfully",
    data: response,
  });
});

const addServiceToBusinessUnit = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await businessUnitService.addServiceToBusinessUnit(id, req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Service added to business unit successfully",
    data: response,
  });
});

const addDepartmentToBusinessUnit = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await businessUnitService.addDepartmentToBusinessUnit(id, req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Department added to business unit successfully",
    data: response,
  });
});

const getLatestBusinessUnit = catchAsync(async (req, res) => {
  const response = await businessUnitService.getLatestBusinessUnit();
  res.status(httpStatus.OK).json({
    success: true,
    message: "Latest business unit fetched successfully",
    data: response,
  });
});

const updateBusinessUnit = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await businessUnitService.updateBusinessUnit(id, req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Business unit updated successfully",
    data: response,
  });
});

const businessUnitController = {
  onboardBusinessUnit,
  updateBusinessUnit,
  getBusinessUnitById,
  addServiceToBusinessUnit,
  addDepartmentToBusinessUnit,
  getLatestBusinessUnit,
};
export default businessUnitController;
