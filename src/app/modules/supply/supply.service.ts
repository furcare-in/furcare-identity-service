import { Supply, Prisma } from "@prisma/client";
import prisma from "../../../utils/prisma.js";
import calculatePagination, {
  PaginationOptions,
} from "../../../utils/pagination.js";
import ApiError from "../../../errors/ApiError.js";
import httpStatus from "http-status";

const createSupply = async (
  payload: Supply & { items: { name: string; vendorId: string }[] },
) => {
  const { items, ...data } = payload;
  const businessBranch = await prisma.businessBranch.findUnique({
    where: { id: data.businessBranchId },
    include: { businessUnit: { include: { vendors: true } } },
  });
  if (
    items.some(
      (i) =>
        !businessBranch?.businessUnit.vendors
          .map((v) => v.id)
          .includes(i.vendorId),
    )
  )
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "One or more vendor not found in business unit",
    );

  return prisma.$transaction(async (tx) => {
    const newSupply = await tx.supply.create({ data });
    await tx.item.createMany({
      data: items.map((i) => ({ ...i, supplyId: newSupply.id })),
    });
    return newSupply;
  });
};

const getSupplyById = async (id: string) => {
  return prisma.supply.findUnique({ where: { id } });
};

const getPaginatedSupplys = async (
  filters: { search?: string } & Partial<Supply>,
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

  const conditions: Prisma.SupplyWhereInput[] = [];

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
    await prisma.supply.findMany({
      where: whereConditions,
      orderBy: { [sortBy]: sortOrder },
      include: { items: { include: { vendor: true } } },
      skip,
      take,
    }),
    await prisma.supply.count({ where: whereConditions }),
  ]);

  return {
    meta: { total, page, limit: take },
    data: result,
  };
};

const updateSupply = async (id: string, data: Partial<Supply>) => {
  return prisma.supply.update({ where: { id }, data });
};

const addItemToSupply = async (
  supplyId: string,
  items: { name: string; vendorId: string }[],
) => {
  const supply = await prisma.supply.findUnique({
    where: { id: supplyId },
    include: {
      businessBranch: {
        include: { businessUnit: { include: { vendors: true } } },
      },
    },
  });
  if (!supply) throw new ApiError(httpStatus.NOT_FOUND, "Supply not found");

  const vendors = await prisma.vendor.findMany({
    where: { id: { in: items.map((item) => item.vendorId) } },
  });
  if (vendors.find((vendor) => vendor === null))
    throw new ApiError(httpStatus.NOT_FOUND, "One or more vendor not found");

  if (
    !vendors
      .map((vendor) => vendor.id)
      .every((vendor) =>
        supply.businessBranch.businessUnit.vendors
          .map((v) => v.id)
          .includes(vendor),
      )
  )
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "One or more vendor not found in business unit",
    );

  return prisma.item.createMany({
    data: items.map((item) => ({ ...item, supplyId })),
  });
};

const removeItemFromSupply = async (supplyId: string, itemId: string) => {
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (item?.supplyId !== supplyId)
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found in supply");
  return prisma.item.delete({ where: { id: itemId } });
};

const deleteSupply = async (id: string) => {
  return prisma.supply.delete({ where: { id } });
};

const supplyService = {
  createSupply,
  getSupplyById,
  getPaginatedSupplys,
  updateSupply,
  addItemToSupply,
  removeItemFromSupply,
  deleteSupply,
};
export default supplyService;
