// @ts-nocheck
import pkg from "@prisma/client";
const { AnimalClass,
  AppointmentSlot,
  BranchesToAnimalClasses,
  BusinessBranch,
  ContentCategory,
  DepartmentsToBranches,
  Prisma,
  ServicesToBranches, } = pkg;
import prisma from "../../../utils/prisma.js";
import calculatePagination, {
  PaginationOptions,
} from "../../../utils/pagination.js";
import contentLibraryData from "../../../helpers/contentData.js";
import ApiError from "../../../errors/ApiError.js";
import httpStatus from "http-status";

const hydrateServiceDetails = async <
  T extends { services?: Array<{ serviceId: string } & Record<string, unknown>> },
>(
  branches: T[],
) => {
  if (!branches.length) return branches;

  const serviceIds = Array.from(
    new Set(
      branches.flatMap((branch) =>
        (branch.services || []).map((service) => service.serviceId),
      ),
    ),
  );

  if (!serviceIds.length) return branches;

  const services = await prisma.service.findMany({
    where: { id: { in: serviceIds } },
  });
  const servicesById = new Map(services.map((service) => [service.id, service]));

  return branches.map((branch) => ({
    ...branch,
    // Drop orphaned links where service no longer exists in services table.
    services: (branch.services || []).flatMap((service) => {
      const serviceDetails = servicesById.get(service.serviceId);
      return serviceDetails ? [{ ...service, serviceDetails }] : [];
    }),
  }));
};

const createBusinessBranch = async (
  payload: BusinessBranch & {
    services: { serviceId: string; basePrice: number }[];
    departments: { departmentId: string }[];
    appointmentSlots: {
      name: string;
      departmentId: string;
      reasons: string[];
    }[];
  },
) => {
  const { appointmentSlots, departments, services, ...data } = payload;

  return prisma.$transaction(async (tx) => {
    const newBranch = await tx.businessBranch.create({ data });
    await tx.servicesToBranches.createMany({
      data: services.map((s) => ({ ...s, branchId: newBranch.id })),
    });
    await tx.departmentsToBranches.createMany({
      data: departments.map((d) => ({ ...d, branchId: newBranch.id })),
    });
    await tx.appointmentSlot.createMany({
      data: appointmentSlots.map((a) => ({
        ...a,
        branchId: newBranch.id,
      })),
    });
    await tx.content.createMany({
      data: contentLibraryData
        .map((content) =>
          content.items.map((contentItem) => ({
            businessBranchId: newBranch.id,
            title: contentItem.title,
            category: content.category as ContentCategory,
            body: contentItem.content,
            animalClassId:
              contentItem.animalClassId === ""
                ? null
                : contentItem.animalClassId,
          })),
        )
        .flat(),
    });
    return newBranch;
  });
};

const getBusinessBranchById = async (id: string) => {
  const branch = await prisma.businessBranch.findUnique({
    where: { id: Number(id) },
    include: {
      services: true,
      departments: { include: { departmentDetails: true } },
      appointmentSlots: { include: { department: true } },
      animalClasses: { include: { animalClassDetails: true } },
    },
  });

  if (!branch) return null;

  const [hydratedBranch] = await hydrateServiceDetails([branch]);
  return hydratedBranch;
};

const getPaginatedBusinessBranchs = async (
  filters: { search?: string } & Partial<BusinessBranch>,
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

  const conditions: Prisma.BusinessBranchWhereInput[] = [];

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
      AND: Object.keys(filterData)
        .filter((key) => filterData[key as keyof typeof filterData] !== undefined)
        .map((key) => {
        let value = filterData[key as keyof typeof filterData];
        
        // Handle string "null" from frontend
        if (value === "null") value = null;
        
        // Cast to Number for known Int fields (foreign keys)
        if (["id", "businessUnitId", "businessBranchId"].includes(key) && value !== null) {
          const numValue = Number(value);
          if (isNaN(numValue)) {
            // If it's a legacy MongoDB ID string, we can't filter by it perfectly yet.
            // Returning the condition as undefined so it gets ignored by the filter.
            return undefined as any;
          }
          value = numValue;
        }

        return {
          [key]: {
            equals: value,
          },
        };
      })
      .filter((condition) => condition !== undefined),
    });
  }

  const whereConditions = conditions.length ? { AND: conditions } : {};

  const [result, total] = await Promise.all([
    await prisma.businessBranch.findMany({
      where: whereConditions,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
      include: {
        services: true,
        departments: { include: { departmentDetails: true } },
        appointmentSlots: { include: { department: true } },
        animalClasses: { include: { animalClassDetails: true } },
      },
    }),
    await prisma.businessBranch.count({ where: whereConditions }),
  ]);

  const hydratedResult = await hydrateServiceDetails(result);

  return {
    meta: { total, page, limit: take },
    data: hydratedResult,
  };
};

const updateBusinessBranch = async (id: string, data: Partial<AnimalClass>) => {
  return prisma.businessBranch.update({ where: { id: Number(id) }, data });
};

const deleteBusinessBranch = async (id: string) => {
  return prisma.businessBranch.delete({ where: { id: Number(id) } });
};

const addAnimalClassToBranch = async (
  branchId: string,
  animalClassId: string,
) => {
  return prisma.branchesToAnimalClasses.create({
    data: { branchId, animalClassId },
  });
};

const removeAnimalClassFromBranch = async (
  branchId: string,
  animalClassId: string,
) => {
  return prisma.branchesToAnimalClasses.delete({
    where: { branchId_animalClassId: { branchId, animalClassId } },
  });
};

const updateAnimalClassInBranch = async (
  branchId: string,
  animalClassId: string,
  data: Partial<BranchesToAnimalClasses>,
) => {
  return prisma.branchesToAnimalClasses.update({
    where: { branchId_animalClassId: { branchId, animalClassId } },
    data,
  });
};

// add departments to branch
const addDepartmentsToBranch = async (
  branchId: string,
  departmentIds: string[],
) => {
  const branch = await prisma.businessBranch.findUnique({
    where: { id: Number(branchId) },
    include: { businessUnit: { include: { availableDepartments: true } } },
  });

  if (!branch) throw new ApiError(httpStatus.NOT_FOUND, "Branch not found");

  // First, verify all departments actually exist in the departments table
  const existingDepartments = await prisma.department.findMany({
    where: { id: { in: departmentIds } },
    select: { id: true },
  });

  const existingDepartmentIds = existingDepartments.map(d => d.id);
  const missingDepartmentIds = departmentIds.filter(id => !existingDepartmentIds.includes(id));

  if (missingDepartmentIds.length > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Departments not found: ${missingDepartmentIds.join(", ")}`,
    );
  }

  // Then check if they're available in the business unit
  if (
    !departmentIds.every((id) =>
      branch.businessUnit.availableDepartments
        .map((d) => d.departmentId)
        .includes(id),
    )
  )
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "One or more invalid departments",
    );

  return prisma.departmentsToBranches.createMany({
    data: departmentIds.map((departmentId) => ({ departmentId, branchId })),
  });
};

// remove a single department from branch
const removeDepartmentFromBranch = async (branchId: string, departmentId: string) => {
  return prisma.departmentsToBranches.delete({
    where: { departmentId_branchId: { branchId, departmentId } },
  });
};

// remove departments from branch
const updateDepartmentInBranch = async (
  branchId: string,
  departmentId: string,
  data: Partial<DepartmentsToBranches>,
) => {
  return prisma.departmentsToBranches.update({
    where: { departmentId_branchId: { branchId, departmentId } },
    data,
  });
};

// add services to branch
const addServicesToBranch = async (
  branchId: string,
  services: { serviceId: string; basePrice: number }[],
) => {
  const branch = await prisma.businessBranch.findUnique({
    where: { id: Number(branchId) },
    include: {
      businessUnit: { include: { availableServices: true } },
    },
  });

  if (!branch) throw new ApiError(httpStatus.NOT_FOUND, "Branch not found");
  if (
    !services
      .map((s) => s.serviceId)
      .every((serviceId) =>
        branch.businessUnit.availableServices
          .map((s) => s.serviceId)
          .includes(serviceId),
      )
  )
    throw new ApiError(httpStatus.BAD_REQUEST, "One or more invalid services");

  // Filter out existing services
  const existingServices = await prisma.servicesToBranches.findMany({
    where: {
      branchId,
      serviceId: { in: services.map((s) => s.serviceId) },
    },
  });
  const existingServiceIds = existingServices.map((s) => s.serviceId);
  const newServices = services.filter(
    (s) => !existingServiceIds.includes(s.serviceId),
  );

  if (newServices.length === 0) return [];

  return prisma.servicesToBranches.createMany({
    data: newServices.map((s) => ({ ...s, branchId })),
  });
};

// remove a single service from branch
const removeServiceFromBranch = async (branchId: string, serviceId: string) => {
  return prisma.servicesToBranches.delete({
    where: { serviceId_branchId: { serviceId, branchId } },
  });
};

// remove services from branch
const updateServiceInBranch = async (
  branchId: string,
  serviceId: string,
  data: Partial<ServicesToBranches>,
) => {
  return prisma.servicesToBranches.update({
    where: { serviceId_branchId: { serviceId, branchId } },
    data,
  });
};

// add appointmentslot to branch
const addAppointmentSlotsToBranch = async (
  branchId: string,
  appointmentSlots: {
    name: string;
    description?: string;
    departmentId: string;
    reasons: string[];
  }[],
) => {
  const branch = await prisma.businessBranch.findUnique({
    where: { id: Number(branchId) },
    include: { departments: true },
  });

  if (!branch) throw new ApiError(httpStatus.NOT_FOUND, "Branch not found");

  if (
    !appointmentSlots
      .map((aps) => aps.departmentId)
      .every((departmentId) =>
        branch.departments.map((d) => d.departmentId).includes(departmentId),
      )
  )
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "One or more invalid departments",
    );

  return prisma.appointmentSlot.createMany({
    data: appointmentSlots.map((aps) => ({ ...aps, branchId })),
  });
};

// update appointmentslot in branch
const updateAppointmentSlotInBranch = async (
  branchId: string,
  appointmentSlotId: string,
  data: Partial<AppointmentSlot>,
) => {
  const branch = await prisma.businessBranch.findUnique({
    where: { id: Number(branchId) },
    include: { appointmentSlots: true },
  });

  if (!branch) throw new ApiError(httpStatus.NOT_FOUND, "Branch not found");
  if (!branch.appointmentSlots.map((aps) => aps.id).includes(appointmentSlotId))
    throw new ApiError(httpStatus.NOT_FOUND, "Appointment slot not found");

  return prisma.appointmentSlot.update({
    where: { id: Number(appointmentSlotId) },
    data,
  });
};

const businessBranchService = {
  createBusinessBranch,
  getBusinessBranchById,
  getPaginatedBusinessBranchs,
  updateBusinessBranch,
  deleteBusinessBranch,
  addAnimalClassToBranch,
  removeAnimalClassFromBranch,
  updateAnimalClassInBranch,
  addDepartmentsToBranch,
  removeDepartmentFromBranch,
  updateDepartmentInBranch,
  addServicesToBranch,
  removeServiceFromBranch,
  updateServiceInBranch,
  addAppointmentSlotsToBranch,
  updateAppointmentSlotInBranch,
};
export default businessBranchService;
