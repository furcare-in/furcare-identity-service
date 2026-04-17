// @ts-nocheck
import pkg from "@prisma/client";
const { Supplier, Prisma } = pkg;
import prisma from "../../../utils/prisma.js";
import calculatePagination, {
    PaginationOptions,
} from "../../../utils/pagination.js";

const createSupplier = async (data: any) => {
    return prisma.supplier.create({ data });
};

const getSupplierById = async (id: string) => {
    return prisma.supplier.findUnique({
        where: { id: Number(id) },
        include: {
            businessBranch: true,
            products: true,
        }
    });
};

const getAllSuppliers = async (
    filters: { search?: string, businessBranchId?: string } & any,
    options: PaginationOptions,
) => {
    const { limit, skip, page, sortBy, sortOrder } = calculatePagination(options);
    const { search, businessBranchId, ...filterData } = filters;

    const conditions: Prisma.SupplierWhereInput[] = [{ active: true }];

    // Filter by businessBranchId if provided
    if (businessBranchId) {
        conditions.push({ businessBranchId });
    }

    if (search) {
        conditions.push({
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
                { phoneNumber: { contains: search, mode: "insensitive" } },
            ],
        });
    }

    if (Object.keys(filterData).length > 0) {
        conditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    const whereConditions = conditions.length ? { AND: conditions } : {};

    const [result, total] = await Promise.all([
        prisma.supplier.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        }),
        prisma.supplier.count({ where: whereConditions }),
    ]);

    return {
        meta: { page, limit, total },
        data: result,
    };
};

const updateSupplier = async (id: string, data: any) => {
    return prisma.supplier.update({ where: { id: Number(id) }, data });
};

const deleteSupplier = async (id: string) => {
    return prisma.supplier.delete({ where: { id: Number(id) } });
};

export const supplierService = {
    createSupplier,
    getSupplierById,
    getAllSuppliers,
    updateSupplier,
    deleteSupplier,
};
