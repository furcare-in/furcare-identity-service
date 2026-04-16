import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import pick from "../../../utils/pick.js";
import clientService from "./client.service.js";

const createClient = catchAsync(async (req, res) => {
  const data = req.body;
  const response = await clientService.createClient(data);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "client created successfully",
    data: response,
  });
});

const getClientById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await clientService.getClientById(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "client fetched successfully",
    data: response,
  });
});

const getPaginatedClients = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["search", "businessBranchId"]);
  const options = pick(req.query, ["sort_by", "sort_order", "limit", "page"]);
  const response = await clientService.getPaginatedClients(filters, options);

  res.status(httpStatus.OK).json({
    success: true,
    message: "clients fetched successfully",
    data: response,
  });
});

const updateClient = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const response = await clientService.updateClient(id, data);

  res.status(httpStatus.OK).json({
    success: true,
    message: "client updated successfully",
    data: response,
  });
});

const addPetsToClient = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { pets } = req.body;
  const response = await clientService.addPetsToClient(id, pets);

  res.status(httpStatus.OK).json({
    success: true,
    message: "pets added successfully",
    data: response,
  });
});

const removePetFromClient = catchAsync(async (req, res) => {
  const { clientId, petId } = req.params;
  const response = await clientService.removePetFromClient(clientId, petId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "pet removed successfully",
    data: response,
  });
});

const deleteClient = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await clientService.deleteClient(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "client deleted successfully",
    data: response,
  });
});

const clientController = {
  createClient,
  getClientById,
  getPaginatedClients,
  updateClient,
  addPetsToClient,
  removePetFromClient,
  deleteClient,
};
export default clientController;
