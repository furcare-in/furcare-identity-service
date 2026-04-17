// @ts-nocheck
import pkg from "@prisma/client";
const { Role, Prisma } = pkg;
import prisma from "../../../utils/prisma.js";
import calculatePagination, {
  PaginationOptions,
} from "../../../utils/pagination.js";

const createRole = async (payload: Role & { branchAccess: string[] }) => {
  const { branchAccess, ...data } = payload;

  const newRole = await prisma.role.create({ data });
  return newRole;
};

const getRoleById = async (id: string) => {
  return prisma.role.findUnique({ where: { id: Number(id) } });
};

const getPaginatedRoles = async (
  filters: { search?: string } & Partial<Role>,
  options: PaginationOptions,
) => {
  const {
    limit: take,
    skip,
    page,
    sortBy,
    sortOrder,
  } = calculatePagination(options);
  const { search, ...filterData } = filters;

  const conditions: Prisma.RoleWhereInput[] = [];

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
    await prisma.role.findMany({
      where: whereConditions,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
    }),
    await prisma.role.count({ where: whereConditions }),
  ]);

  return {
    meta: { total, page, limit: take },
    data: result,
  };
};

const updateRole = async (id: string, data: Partial<Role>) => {
  return prisma.role.update({ where: { id: Number(id) }, data });
};

const deleteRole = async (id: string) => {
  return prisma.role.delete({ where: { id: Number(id) } });
};

const roleService = {
  createRole,
  getRoleById,
  getPaginatedRoles,
  updateRole,
  deleteRole,
};
export default roleService;
