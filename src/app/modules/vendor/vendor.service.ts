import { Vendor, Prisma } from "@prisma/client";
import prisma from "../../../utils/prisma.js";
import calculatePagination, {
  PaginationOptions,
} from "../../../utils/pagination.js";

const createVendor = async (data: Vendor) => {
  return prisma.vendor.create({ data });
};

const getVendorById = async (id: string) => {
  return prisma.vendor.findUnique({ where: { id } });
};

const getPaginatedVendors = async (
  filters: { search?: string } & Partial<Vendor>,
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

  const conditions: Prisma.VendorWhereInput[] = [];

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
    await prisma.vendor.findMany({
      where: whereConditions,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
    }),
    await prisma.vendor.count({ where: whereConditions }),
  ]);

  return {
    meta: { total, page, limit: take },
    data: result,
  };
};

const updateVendor = async (id: string, data: Partial<Vendor>) => {
  return prisma.vendor.update({ where: { id }, data });
};

const deleteVendor = async (id: string) => {
  return prisma.vendor.delete({ where: { id } });
};

const vendorService = {
  createVendor,
  getVendorById,
  getPaginatedVendors,
  updateVendor,
  deleteVendor,
};
export default vendorService;
