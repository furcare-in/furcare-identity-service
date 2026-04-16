import { Prisma } from "@prisma/client";
import prisma from "../../../utils/prisma.js";
import calculatePagination, {
    PaginationOptions,
} from "../../../utils/pagination.js";

const createVaccination = async (data: any) => {
    return prisma.vaccinationStatus.create({
        data,
        include: {
            pet: true,
            product: true,
        },
    });
};

const getVaccinationById = async (id: string) => {
    return prisma.vaccinationStatus.findUnique({
        where: { id },
        include: {
            pet: true,
            product: true,
        },
    });
};

const getVaccinationsByPetId = async (petId: string) => {
    return prisma.vaccinationStatus.findMany({
        where: { petId },
        orderBy: { administeredDate: "desc" },
        include: {
            product: true,
        },
    });
};

const getPaginatedVaccinations = async (
    filters: { search?: string; petId?: string; businessBranchId?: string; status?: string } & any,
    options: PaginationOptions
) => {
    const { limit, skip, page, sortBy, sortOrder } = calculatePagination(options);
    const { search, petId, businessBranchId, status, ...filterData } = filters;

    const conditions: Prisma.VaccinationStatusWhereInput[] = [];

    if (petId) {
        conditions.push({ petId });
    }

    if (businessBranchId) {
        conditions.push({ businessBranchId });
    }

    if (status) {
        conditions.push({ status });
    }

    if (search) {
        conditions.push({
            OR: [
                { vaccineName: { contains: search, mode: "insensitive" } },
            ],
        });
    }

    const whereConditions = conditions.length ? { AND: conditions } : {};

    const [result, total] = await Promise.all([
        prisma.vaccinationStatus.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: {
                pet: true,
                product: true,
            },
        }),
        prisma.vaccinationStatus.count({ where: whereConditions }),
    ]);

    return {
        meta: { page, limit, total },
        data: result,
    };
};

const updateVaccination = async (id: string, data: any) => {
    return prisma.vaccinationStatus.update({
        where: { id },
        data,
        include: {
            pet: true,
            product: true,
        },
    });
};

const deleteVaccination = async (id: string) => {
    return prisma.vaccinationStatus.delete({ where: { id } });
};

export const vaccinationStatusService = {
    createVaccination,
    getVaccinationById,
    getVaccinationsByPetId,
    getPaginatedVaccinations,
    updateVaccination,
    deleteVaccination,
};
