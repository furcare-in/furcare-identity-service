import { LeadType, Prisma } from "@prisma/client";
import prisma from "../../../utils/prisma.js";
import calculatePagination, { PaginationOptions } from "../../../utils/pagination.js";

const createLeadType = async (data: LeadType): Promise<LeadType> => {
    return await prisma.leadType.create({
        data,
    });
};

const getPaginatedLeadTypes = async (
    filters: { search?: string; businessBranchId?: string },
    options: PaginationOptions
) => {
    const {
        limit: take,
        skip,
        page,
        sortBy,
        sortOrder,
    } = calculatePagination(options);
    const { search, businessBranchId, ...filterData } = filters;

    const andConditions: Prisma.LeadTypeWhereInput[] = [];

    if (search) {
        andConditions.push({
            OR: ["name", "description"].map((field) => ({
                [field]: {
                    contains: search,
                    mode: "insensitive",
                },
            })),
        });
    }

    if (businessBranchId) {
        andConditions.push({
            businessBranchId: businessBranchId,
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    const whereConditions: Prisma.LeadTypeWhereInput = andConditions.length
        ? { AND: andConditions }
        : {};

    const [result, total] = await Promise.all([
        prisma.leadType.findMany({
            where: whereConditions,
            skip,
            take,
            orderBy: {
                [sortBy]: sortOrder,
            },
        }),
        prisma.leadType.count({
            where: whereConditions,
        }),
    ]);

    return {
        meta: {
            page,
            limit: take,
            total,
        },
        data: result,
    };
};

const getLeadTypeById = async (id: string): Promise<LeadType | null> => {
    return await prisma.leadType.findUnique({
        where: {
            id,
        },
    });
};

const updateLeadType = async (
    id: string,
    data: Partial<LeadType>
): Promise<LeadType> => {
    return await prisma.leadType.update({
        where: {
            id,
        },
        data,
    });
};

const deleteLeadType = async (id: string): Promise<LeadType> => {
    return await prisma.leadType.delete({
        where: {
            id,
        },
    });
};

const leadTypeService = {
    createLeadType,
    getPaginatedLeadTypes,
    getLeadTypeById,
    updateLeadType,
    deleteLeadType,
};

export default leadTypeService;
