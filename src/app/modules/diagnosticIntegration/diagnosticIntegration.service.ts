// @ts-nocheck
import pkg from "@prisma/client";
const { DiagnosticIntegration, Prisma } = pkg;
import prisma from "../../../utils/prisma.js";
import calculatePagination, {
  PaginationOptions,
} from "../../../utils/pagination.js";

const createDiagnosticIntegration = async (data: DiagnosticIntegration) => {
  return prisma.diagnosticIntegration.create({ data });
};

const getDiagnosticIntegrationById = async (id: string) => {
  return prisma.diagnosticIntegration.findUnique({ where: { id: Number(id) } });
};

const getPaginatedDiagnosticIntegrations = async (
  filters: { search?: string } & Partial<DiagnosticIntegration>,
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

  const conditions: Prisma.DiagnosticIntegrationWhereInput[] = [];

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
    await prisma.diagnosticIntegration.findMany({
      where: whereConditions,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
    }),
    await prisma.diagnosticIntegration.count({ where: whereConditions }),
  ]);

  return {
    meta: { total, page, limit: take },
    data: result,
  };
};

const updateDiagnosticIntegration = async (
  id: string,
  data: Partial<DiagnosticIntegration>,
) => {
  return prisma.diagnosticIntegration.update({ where: { id: Number(id) }, data });
};

const deleteDiagnosticIntegration = async (id: string) => {
  return prisma.diagnosticIntegration.delete({ where: { id: Number(id) } });
};

const diagnosticIntegrationService = {
  createDiagnosticIntegration,
  getDiagnosticIntegrationById,
  getPaginatedDiagnosticIntegrations,
  updateDiagnosticIntegration,
  deleteDiagnosticIntegration,
};
export default diagnosticIntegrationService;
