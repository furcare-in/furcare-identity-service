// @ts-nocheck
import pkg from "@prisma/client";
const { AnimalClass, Prisma } = pkg;
import prisma from "../../../utils/prisma.js";
import calculatePagination, {
  PaginationOptions,
} from "../../../utils/pagination.js";

const createAnimalClass = async (data: AnimalClass) => {
  return prisma.animalClass.create({ data });
};

const getAnimalClassById = async (id: string) => {
  return prisma.animalClass.findUnique({ where: { id: Number(id) } });
};

const getPaginatedAnimalClasss = async (
  filters: {
    search?: string;
    business_branch_id?: string;
    active?: string;
  } & Partial<AnimalClass>,
  options: PaginationOptions,
) => {
  const {
    limit: take,
    skip,
    page,
    sortBy,
    sortOrder,
  } = calculatePagination(options);
  const { search, business_branch_id, active, ...filterData } = filters;

  const conditions: Prisma.AnimalClassWhereInput[] = [];

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
  // business branch filter
  if (business_branch_id) {
    const branchCoAnimalClassesWhereInput: Prisma.BranchesToAnimalClassesWhereInput[] =
      [{ branchId: business_branch_id }];
    if (active)
      branchCoAnimalClassesWhereInput.push({ active: active === "true" });

    const animalClasses = await prisma.branchesToAnimalClasses.findMany({
      where: { AND: branchCoAnimalClassesWhereInput },
      select: { animalClassId: true },
    });
    const classIds: string[] = animalClasses.map((c) => c.animalClassId ?? "");

    conditions.push({
      AND: { id: { in: classIds.filter((ci) => ci !== "") } },
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
    await prisma.animalClass.findMany({
      where: whereConditions,
      orderBy: { [sortBy]: sortOrder },
      include: {
        availableAt: business_branch_id
          ? {
            where: { branchId: Number(business_branch_id) },
            select: { active: true },
          }
          : false,
      },
      skip,
      take,
    }),
    await prisma.animalClass.count({ where: whereConditions }),
  ]);

  return {
    meta: { total, page, limit: take },
    data: result,
  };
};

const updateAnimalClass = async (id: string, data: Partial<AnimalClass>) => {
  return prisma.animalClass.update({ where: { id: Number(id) }, data });
};

const deleteAnimalClass = async (id: string) => {
  return prisma.animalClass.delete({ where: { id: Number(id) } });
};

const animalClassService = {
  createAnimalClass,
  getAnimalClassById,
  getPaginatedAnimalClasss,
  updateAnimalClass,
  deleteAnimalClass,
};
export default animalClassService;
