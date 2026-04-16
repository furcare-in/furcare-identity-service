import { Service, Prisma } from "@prisma/client";
import prisma from "../../../utils/prisma.js";
import calculatePagination, {
  PaginationOptions,
} from "../../../utils/pagination.js";

const createService = async (data: Service) => {
  return prisma.service.create({ data });
};

const getServiceById = async (id: string) => {
  return prisma.service.findUnique({ where: { id } });
};

const getPaginatedServices = async (
  filters: { search?: string; businessUnitId?: string } & Partial<Service>,
  options: PaginationOptions,
) => {
  const {
    limit: take,
    skip,
    page,
    sortBy,
    sortOrder,
  } = calculatePagination(options);
  const { search, businessUnitId, ...filterData } = filters;

  const conditions: Prisma.ServiceWhereInput[] = [];

  // partial match
  if (search) {
    conditions.push({
      OR: ["name"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });
  }
  // filter by business unit
  if (businessUnitId) {
    const servicesToBusinessUnit =
      await prisma.businessUnitsToServices.findMany({
        where: { businessUnitId },
      });

    conditions.push({
      id: { in: servicesToBusinessUnit.map((s) => s.serviceId) },
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
    await prisma.service.findMany({
      where: whereConditions,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
    }),
    await prisma.service.count({ where: whereConditions }),
  ]);

  return {
    meta: { total, page, limit: take },
    data: result,
  };
};

const updateService = async (id: string, data: Partial<Service>) => {
  return prisma.service.update({ where: { id }, data });
};

const deleteService = async (id: string) => {
  return prisma.service.delete({ where: { id } });
};

const serviceService = {
  createService,
  getServiceById,
  getPaginatedServices,
  updateService,
  deleteService,
};
export default serviceService;
