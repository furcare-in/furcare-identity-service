// @ts-nocheck
// @ts-nocheck
import pkg from "@prisma/client";
const { Staff, Prisma } = pkg;
import prisma from "../../../utils/prisma.js";
import calculatePagination, {
  PaginationOptions,
} from "../../../utils/pagination.js";
import { Argon2id } from "oslo/password";

const createStaff = async (
  payload: Staff & { roles: string[]; branchIndices?: number[] },
) => {
  // branchIndices can be sent by some clients but it is not a Staff scalar field.
  // Keep it out of prisma.staff.create payload to avoid unknown field errors.
  const { roles, branchIndices: _branchIndices, ...data } = payload as any;
  data.password = await new Argon2id().hash(data.password);
  const branchId = data.businessBranchId;

  return prisma.$transaction(async (tx) => {
    const staff = await tx.staff.create({ data, select: { id: true } });
    await tx.staffToRoles.createMany({
      data: roles.map((roleId: string) => ({ roleId, staffId: staff.id })),
    });
    if (branchId) {
      await tx.staffToBranches.createMany({
        data: [{ staffId: staff.id, branchId }],
      });
    }
    return staff;
  });
};

const getStaffById = async (id: string) => {
  return prisma.staff.findUnique({ where: { id: Number(id) } });
};

const getPaginatedStaffs = async (
  filters: { search?: string } & Partial<Staff>,
  options: PaginationOptions,
) => {
  const {
    limit: take,
    skip,
    page,
    sortBy,
    sortOrder,
  } = calculatePagination(options);
  const { search, businessBranchId, ...filterData } = filters as any;

  const conditions: Prisma.StaffWhereInput[] = [];

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

  // Filter by branch using junction table
  if (businessBranchId) {
    const branchIdNum = Number(businessBranchId);
    if (!isNaN(branchIdNum)) {
      conditions.push({
        OR: [
          {
            branches: {
              some: {
                branchId: branchIdNum,
              },
            },
          },
          { businessBranchId: branchIdNum },
        ],
      });
    }
  }

  // exact match for other fields
  if (Object.keys(filterData).length > 0) {
    conditions.push({
      AND: Object.keys(filterData)
        .filter((key) => filterData[key as keyof typeof filterData] !== undefined)
        .map((key) => {
          let value = filterData[key as keyof typeof filterData];
          if (value === "null") value = null;
          
          if (["id", "businessUnitId", "businessBranchId"].includes(key)) {
            if (value === null) {
              return undefined as any;
            }
            const numValue = Number(value);
            if (isNaN(numValue)) {
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
    await prisma.staff.findMany({
      where: whereConditions,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        roles: { include: { roleDetails: true } },
        active: true,
        shiftStartTime: true,
        shiftEndTime: true,
        customPermissions: true,
        groups: {
          select: {
            groupId: true,
          },
        },
      },
      skip,
      take,
    }),
    await prisma.staff.count({ where: whereConditions }),
  ]);

  const data = result.map(staff => ({
    ...staff,
    groupIds: staff.groups.map(g => g.groupId),
  }));

  return {
    meta: { total, page, limit: take },
    data,
  };
};

const updateStaff = async (
  id: string,
  payload: Partial<Staff> & {
    roles?: string[];
    branchIndices?: number[];
  },
) => {
  // roles/branchIndices are not scalar Staff fields.
  // roles must be updated through StaffToRoles relation.
  const { roles, branchIndices: _branchIndices, ...data } = payload as any;

  return prisma.$transaction(async (tx) => {
    const updatedStaff = await tx.staff.update({ where: { id: Number(id) }, data });

    if (Array.isArray(roles)) {
      await tx.staffToRoles.deleteMany({ where: { staffId: Number(id) } });
      if (roles.length > 0) {
        await tx.staffToRoles.createMany({
          data: roles.map((roleId: string) => ({ staffId: id, roleId })),
        });
      }
    }

    return updatedStaff;
  });
};

const deleteStaff = async (id: string) => {
  return prisma.staff.delete({ where: { id: Number(id) } });
};
const getDoctors = async (businessBranchId?: string) => {
  const whereCondition: any = {
    roles: {
      some: {
        roleDetails: {
          name: {
            in: ["doctor", "Doctor", "DOCTOR"],
          },
        },
      },
    },
    active: true,
  };

  if (businessBranchId) {
    const branchIdNum = Number(businessBranchId);
    if (!isNaN(branchIdNum)) {
      whereCondition.OR = [
        {
          branches: {
            some: {
              branchId: branchIdNum,
            },
          },
        },
        {
          businessBranchId: branchIdNum,
        },
      ];
    }
  }

  const result = await prisma.staff.findMany({
    where: whereCondition,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      roles: { include: { roleDetails: true } },
      active: true,
      shiftStartTime: true,
      shiftEndTime: true,
      groups: {
        select: {
          groupId: true,
        },
      },
    },
  });
  const data = result.map(staff => ({
    ...staff,
    groupIds: staff.groups.map(g => g.groupId),
  }));
  return data;
};

// Create admin without businessUnitId (for Super Admin portal)
const createAdminWithoutUnit = async (payload: {
  email: string;
  password: string;
  name: string;
  phone: string;
}) => {
  const hashedPassword = await new Argon2id().hash(payload.password);

  return prisma.staff.create({
    data: {
      email: payload.email,
      password: hashedPassword,
      name: payload.name,
      phone: payload.phone,
      onboardingCompleted: false,
      customPermissions: [],
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      onboardingCompleted: true,
    },
  });
};

// Complete onboarding - assign businessUnitId, create/assign role, and mark complete
const completeOnboarding = async (
  staffId: string,
  businessUnitId: string,
  businessBranchId?: string
) => {
  return prisma.$transaction(async (tx) => {
    // Find or create Admin role for this business unit
    let adminRole = await tx.role.findFirst({
      where: {
        name: "Admin",
        businessUnitId: businessUnitId
      }
    });

    // If Admin role doesn't exist for this business unit, create it
    if (!adminRole) {
      adminRole = await tx.role.create({
        data: {
          name: "Admin",
          businessUnitId: businessUnitId,
          accessLevel: "businessUnit",
          permissions: [],
          active: true,
          isStaff: true,
        }
      });
    }

    // Assign the Admin role to the staff member
    await tx.staffToRoles.create({
      data: {
        staffId: staffId,
        roleId: adminRole.id
      }
    });

    // Update staff with businessUnitId and mark onboarding complete
    return tx.staff.update({
      where: { id: Number(staffId) },
      data: {
        businessUnitId,
        businessBranchId: businessBranchId || null,
        onboardingCompleted: true,
      },
    });
  });
};

// Update custom permissions for a staff member
const updateCustomPermissions = async (
  staffId: string,
  permissions: Array<{ resource: string; action: string; enabled: boolean }>
) => {
  return prisma.staff.update({
    where: { id: Number(staffId) },
    data: {
      customPermissions: permissions,
    },
    select: {
      id: true,
      name: true,
      email: true,
      customPermissions: true,
    },
  });
};

const staffService = {
  createStaff,
  getStaffById,
  getPaginatedStaffs,
  updateStaff,
  getDoctors,
  deleteStaff,
  createAdminWithoutUnit,
  completeOnboarding,
  updateCustomPermissions,
};
export default staffService;
