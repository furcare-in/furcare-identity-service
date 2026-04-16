import { Department, Prisma } from "@prisma/client";
import prisma from "../../../utils/prisma.js";
import calculatePagination, {
  PaginationOptions,
} from "../../../utils/pagination.js";

const createDepartment = async (data: Department) => {
  return prisma.department.create({ data });
};

const getDepartmentById = async (id: string) => {
  return prisma.department.findUnique({ where: { id } });
};

const getPaginatedDepartments = async (
  filters: { search?: string; businessUnitId?: string } & Partial<Department>,
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

  const conditions: Prisma.DepartmentWhereInput[] = [];

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
    const deptsToBusinessUnit =
      await prisma.businessUnitsToDepartments.findMany({
        where: { businessUnitId },
      });

    conditions.push({
      id: { in: deptsToBusinessUnit.map((d) => d.departmentId) },
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
    await prisma.department.findMany({
      where: whereConditions,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
    }),
    await prisma.department.count({ where: whereConditions }),
  ]);

  return {
    meta: { total, page, limit: take },
    data: result,
  };
};

const updateDepartment = async (id: string, data: Partial<Department>) => {
  return prisma.department.update({ where: { id }, data });
};

const deleteDepartment = async (id: string) => {
  return prisma.department.delete({ where: { id } });
};

const departmentService = {
  createDepartment,
  getDepartmentById,
  getPaginatedDepartments,
  updateDepartment,
  deleteDepartment,
};
export default departmentService;
