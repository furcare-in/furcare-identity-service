// @ts-nocheck
import pkg from "@prisma/client";
const { Group, Prisma } = pkg;
import prisma from "../../../utils/prisma.js";
import calculatePagination, {
  PaginationOptions,
} from "../../../utils/pagination.js";
import ApiError from "../../../errors/ApiError.js";
import httpStatus from "http-status";

const createGroup = async (payload: Group & { resources: string[] }) => {
  const { resources, ...data } = payload;
  const staff = await prisma.staff.findMany({
    where: { id: { in: resources } },
  });
  if (staff.some((staff) => staff.businessBranchId !== data.businessBranchId))
    throw new ApiError(httpStatus.BAD_REQUEST, "One or more invalid resources");

  return prisma.$transaction(async (tx) => {
    const newGroup = await tx.group.create({ data });
    await tx.groupsToStaff.createMany({
      data: resources.map((staffId) => ({ staffId, groupId: newGroup.id })),
    });
    return newGroup;
  });
};

const getGroupById = async (id: string) => {
  return prisma.group.findUnique({ where: { id: Number(id) } });
};

const getPaginatedGroups = async (
  filters: { search?: string } & Partial<Group>,
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

  const conditions: Prisma.GroupWhereInput[] = [];

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
    await prisma.group.findMany({
      where: whereConditions,
      orderBy: { [sortBy]: sortOrder },
      include: {
        resources: {
          include: {
            staffDetails: {
              select: {
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
      },
      skip,
      take,
    }),
    await prisma.group.count({ where: whereConditions }),
  ]);

  return {
    meta: { total, page, limit: take },
    data: result,
  };
};

const updateGroup = async (id: string, data: Partial<Group>) => {
  return prisma.group.update({ where: { id: Number(id) }, data });
};

const addRerouceToGroup = async (groupId: string, staffIds: string[]) => {
  const staffs = await prisma.staff.findMany({
    where: { id: { in: staffIds } },
  });
  if (staffs.some((staff) => staff === null))
    throw new ApiError(httpStatus.NOT_FOUND, "One or more staff not found");

  const group = await prisma.group.findUnique({ where: { id: Number(groupId) } });
  if (!group) throw new ApiError(httpStatus.NOT_FOUND, "Group not found");

  if (staffs.some((staff) => staff.businessBranchId !== group.businessBranchId))
    throw new ApiError(httpStatus.BAD_REQUEST, "One or more invalid resources");

  return prisma.groupsToStaff.createMany({
    data: staffIds.map((staffId) => ({ staffId, groupId })),
  });
};

const removeRerouceToGroup = async (groupId: string, staffIds: string[]) => {
  return prisma.groupsToStaff.deleteMany({
    where: {
      staffId: { in: staffIds },
      groupId,
    },
  });
};

const deleteGroup = async (id: string) => {
  return prisma.group.delete({ where: { id: Number(id) } });
};

const groupService = {
  createGroup,
  getGroupById,
  getPaginatedGroups,
  updateGroup,
  addRerouceToGroup,
  removeRerouceToGroup,
  deleteGroup,
};
export default groupService;
