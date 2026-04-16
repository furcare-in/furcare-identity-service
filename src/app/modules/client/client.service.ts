import { Client, Prisma } from "@prisma/client";
import prisma from "../../../utils/prisma.js";
import calculatePagination, {
  PaginationOptions,
} from "../../../utils/pagination.js";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError.js";

const createClient = async (
  payload: Client & { pets: Prisma.PetUncheckedCreateInput[]; password?: string },
) => {
  const { pets, password, ...data } = payload;
  const clientCount = await prisma.client.count({});
  data.clientId = `AFT${clientCount + 1}`;
  return prisma.$transaction(async (tx) => {
    const newClient = await tx.client.create({ data });
    await tx.pet.createMany({
      data: pets.map((pet) => ({ ...pet, clientId: newClient.id })),
    });
    return newClient;
  });
};

const getClientById = async (id: string, businessBranchId?: string) => {
  const where: Prisma.ClientWhereUniqueInput = { id };

  const client = await prisma.client.findUnique({
    where,
    include: { pets: { where: { active: true } } },
  });

  // Verify branch access if businessBranchId is provided
  if (businessBranchId && client && client.businessBranchId !== businessBranchId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Access denied to this client");
  }

  return client;
};

const getPaginatedClients = async (
  filters: { search?: string; businessBranchId?: string } & Partial<Client>,
  options: PaginationOptions,
) => {
  const {
    limit: take,
    skip,
    page,
    sortBy,
    sortOrder,
  } = calculatePagination(options);
  const { search, businessBranchId, ...filterData } = filters;

  console.log("Client Service Filters:", filters);
  console.log("Processing businessBranchId:", businessBranchId);

  // STRICT RBAC: If no businessBranchId is provided, do NOT return any clients.
  // This prevents data leakage to users who haven't selected a branch or are in a different context.
  if (!businessBranchId) {
    console.warn("Strict RBAC: getPaginatedClients called without businessBranchId. Returning empty.");
    return {
      meta: { total: 0, page, limit: take },
      data: [],
    };
  }

  const conditions: Prisma.ClientWhereInput[] = [{ active: true }];

  // Filter by businessBranchId
  conditions.push({ businessBranchId });

  // partial match
  if (search) {
    conditions.push({
      OR: ["firstName", "lastName", "email", "phone"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });
  }
  // exact match
  if (Object.keys(filterData).length > 0) {
    conditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key as keyof typeof filterData],
        },
      })),
    });
  }

  const whereConditions = conditions.length ? { AND: conditions } : {};

  const [result, total] = await Promise.all([
    await prisma.client.findMany({
      where: whereConditions,
      orderBy: { [sortBy]: sortOrder },
      include: {
        pets: { where: { active: true }, select: { name: true } },
        _count: { select: { pets: { where: { active: true } 
        } } } },
      skip,
      take,
    }),
    await prisma.client.count({ where: whereConditions }),
  ]);

  return {
    meta: { total, page, limit: take },
    data: result,
  };
};

const updateClient = async (id: string, payload: Partial<Client> & { pets?: any[]; additionalOwners?: any[]; observations?: string }) => {
  const { pets, additionalOwners, observations, ...clientData } = payload;

  // Update client basic info
  const updatedClient = await prisma.client.update({
    where: { id },
    data: clientData
  });

  // Handle pet updates if provided
  if (pets && Array.isArray(pets)) {
    for (const pet of pets) {
      if (pet.id && !pet.isNew) {
        // Update existing pet
        const { id: petId, isNew, ...petData } = pet;
        await prisma.pet.update({
          where: { id: petId },
          data: petData
        });
      } else if (pet.isNew) {
        // Create new pet
        const { id: tempId, isNew, ...petData } = pet;
        await prisma.pet.create({
          data: {
            ...petData,
            clientId: id
          }
        });
      }
    }
  }

  // Note: additionalOwners and observations would need similar handling
  // if they are stored in separate tables. For now, they're ignored.

  return updatedClient;
};

const addPetsToClient = async (
  id: string,
  pets: Prisma.PetUncheckedCreateInput[],
) => {
  // return prisma.client.update({
  //   where: { id },
  //   data: { pets: { create: pets } },
  // });
  return prisma.pet.createMany({
    data: pets.map((pet) => ({ ...pet, clientId: id })),
  });
};

const removePetFromClient = async (clientId: string, petId: string) => {
  const pet = await prisma.pet.findUnique({ where: { id: petId } });
  if (pet?.clientId !== clientId)
    throw new ApiError(httpStatus.NOT_FOUND, "Pet not found");

  return prisma.pet.update({ where: { id: petId }, data: { active: false } });
};

const deleteClient = async (id: string) => {
  return prisma.client.update({ where: { id }, data: { active: false } });
};

const clientService = {
  createClient,
  getClientById,
  getPaginatedClients,
  updateClient,
  addPetsToClient,
  removePetFromClient,
  deleteClient,
};
export default clientService;
