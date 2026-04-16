import { Report, Prisma, ReportType } from "@prisma/client";
import prisma from "../../../utils/prisma.js";
import calculatePagination, {
  PaginationOptions,
} from "../../../utils/pagination.js";
import reportAnalytics from "./report.analytics.js";

const createReport = async (data: Report) => {
  return prisma.report.create({ data });
};

const getReportById = async (id: string) => {
  return prisma.report.findUnique({ where: { id } });
};

const getPaginatedReports = async (
  filters: { search?: string; businessBranchId?: string; businessUnitId?: string } & Partial<Report>,
  options: PaginationOptions,
) => {
  const {
    limit: take,
    skip,
    page,
    sortBy,
    sortOrder,
  } = calculatePagination(options);
  const { search, businessBranchId, businessUnitId, ...filterData } = filters;

  const conditions: Prisma.ReportWhereInput[] = [];

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

  // Scope filtering: include branch-level reports and unit-level reports for current context.
  if (businessBranchId && businessUnitId) {
    conditions.push({
      OR: [{ businessBranchId: { equals: businessBranchId } }, { businessUnitId: { equals: businessUnitId } }],
    });
  } else if (businessBranchId) {
    conditions.push({ businessBranchId: { equals: businessBranchId } });
  } else if (businessUnitId) {
    conditions.push({ businessUnitId: { equals: businessUnitId } });
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
    await prisma.report.findMany({
      where: whereConditions,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
    }),
    await prisma.report.count({ where: whereConditions }),
  ]);

  return {
    meta: { total, page, limit: take },
    data: result,
  };
};

const updateReport = async (id: string, data: Partial<Report>) => {
  return prisma.report.update({ where: { id }, data });
};

const deleteReport = async (id: string) => {
  return prisma.report.delete({ where: { id } });
};

const getReportFieldCatalog = (type?: ReportType) => {
  return reportAnalytics.getFieldCatalog(type);
};

const getReportData = async (input: {
  type: ReportType;
  fields?: string[];
  startDate: string;
  endDate: string;
  frequency?: "day" | "week" | "month";
  businessBranchId?: string;
  businessUnitId?: string;
  branchId?: string;
}) => {
  return reportAnalytics.generateReportData(input);
};

const reportService = {
  createReport,
  getReportById,
  getPaginatedReports,
  updateReport,
  deleteReport,
  getReportFieldCatalog,
  getReportData,
};
export default reportService;
