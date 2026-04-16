import { BusinessBranch, BusinessUnit, Staff } from "@prisma/client";
import prisma from "../../../utils/prisma.js";
import { Argon2id } from "oslo/password";

const onboardBusinessUnit = async (
  payload: BusinessUnit & {
    businessBranches: BusinessBranch[];
    services: { serviceId: string; basePrice: number }[];
    animalClasses: string[];
    appointmentSlots: {
      name: string;
      description: string;
      departmentId: string;
    }[];
    staffs: Staff[];
    vendors: { name: string }[];
    diagnosticIntegrations: { name: string }[];
  },
) => {
  const {
    services,
    animalClasses,

    businessBranches,
    appointmentSlots,
    diagnosticIntegrations,

    staffs,
    vendors,
    ...data
  } = payload;

  return prisma.$transaction(async (tx) => {
    const newBusinessUnit = await tx.businessUnit.create({ data });

    // Create default roles for this business unit
    const defaultRoles = ["Admin", "Doctor", "Nurse", "Receptionist"];
    const createdRoles = await Promise.all(
      defaultRoles.map((roleName) =>
        tx.role.create({
          data: {
            name: roleName,
            businessUnitId: newBusinessUnit.id,
            accessLevel: "businessUnit",
            permissions: [],
            active: true,
            isStaff: true,
          },
        })
      )
    );

    // Create branches first (needed for staff assignment) using Promise.all to ensure order
    const createdBranches = await Promise.all(
      businessBranches.map((branch) =>
        tx.businessBranch.create({
          data: {
            ...branch,
            businessUnitId: newBusinessUnit.id,
          },
        })
      )
    );

    // Store staff IDs and their branch assignments for later
    const staffBranchAssignments: { staffId: string; branchIndices: number[] }[] = [];

    // Create staff members and assign roles
    for (const staffData of staffs) {
      const { roles, branchIndices, ...staffWithoutRoles } = staffData as any;

      console.log(`Creating staff: ${staffWithoutRoles.name}, Phone: ${staffWithoutRoles.phone}, Email: ${staffWithoutRoles.email}`);

      // Hash password
      const hashedPassword = await new Argon2id().hash(staffWithoutRoles.password);

      // Create staff member (keep businessBranchId for backward compatibility)
      const newStaff = await tx.staff.create({
        data: {
          name: staffWithoutRoles.name,
          email: staffWithoutRoles.email,
          phone: staffWithoutRoles.phone,
          password: hashedPassword,
          businessUnitId: newBusinessUnit.id,
          businessBranchId: createdBranches[0]?.id || null, // Keep for backward compatibility
          active: true,
          onboardingCompleted: true,
          customPermissions: [],
        },
      });

      // If roles are provided, look them up and assign them
      if (roles && Array.isArray(roles) && roles.length > 0) {
        // Find role IDs by role names (case-insensitive)
        const roleRecords = createdRoles.filter((role) =>
          roles.some((requestedRole) => role.name.toLowerCase() === requestedRole.toLowerCase())
        );

        // Create StaffToRoles entries
        if (roleRecords.length > 0) {
          await tx.staffToRoles.createMany({
            data: roleRecords.map((role) => ({
              staffId: newStaff.id,
              roleId: role.id,
            })),
          });
        }
      }

      // Store for StaffToBranches creation later
      staffBranchAssignments.push({
        staffId: newStaff.id,
        branchIndices: branchIndices || [0], // Default to first branch
      });
    }

    // Create StaffToBranches entries for all staff
    if (staffBranchAssignments.length > 0) {
      const allBranchAssignments = staffBranchAssignments.flatMap(({ staffId, branchIndices }) => {
        return branchIndices
          .map((index: number) => {
            const branch = createdBranches[index] || createdBranches[0];
            return branch ? { staffId, branchId: branch.id } : null;
          })
          .filter((entry): entry is { staffId: string; branchId: string } => entry !== null);
      });

      if (allBranchAssignments.length > 0) {
        await tx.staffToBranches.createMany({
          data: allBranchAssignments,
        });
      }
    }

    if (vendors.length > 0) {
      await tx.vendor.createMany({
        data: vendors.map((vendor) => ({
          ...vendor,
          businessUnitId: newBusinessUnit.id,
        })),
      });
    }

    if (services.length > 0) {
      await tx.businessUnitsToServices.createMany({
        data: services
          .map((service) => service.serviceId)
          .map((serviceId) => ({
            serviceId,
            businessUnitId: newBusinessUnit.id,
          })),
      });
    }
    if (appointmentSlots.length > 0) {
      const uniqueDepartments = [...new Set(appointmentSlots.map((aps) => aps.departmentId))];
      if (uniqueDepartments.length > 0) {
        await tx.businessUnitsToDepartments.createMany({
          data: uniqueDepartments.map(
            (departmentId) => ({
              departmentId,
              businessUnitId: newBusinessUnit.id,
            }),
          ),
        });
      }
    }

    // Note: Branches were created earlier, before staff creation
    if (animalClasses.length > 0 && createdBranches.length > 0) {
      await tx.branchesToAnimalClasses.createMany({
        data: animalClasses
          .map((animalClass) => {
            return createdBranches.map((branch) => {
              return { branchId: branch.id, animalClassId: animalClass };
            });
          })
          .flat(),
      });
    }
    if (services.length > 0 && createdBranches.length > 0) {
      await tx.servicesToBranches.createMany({
        data: services
          .map((service) => {
            return createdBranches.map((branch) => {
              return { branchId: branch.id, ...service };
            });
          })
          .flat(),
      });
    }
    if (appointmentSlots.length > 0 && createdBranches.length > 0) {
      await tx.departmentsToBranches.createMany({
        data: appointmentSlots
          .map((slot) => {
            return createdBranches.map((branch) => {
              return { branchId: branch.id, departmentId: slot.departmentId };
            });
          })
          .flat(),
      });
    }
    if (appointmentSlots.length > 0 && createdBranches.length > 0) {
      await tx.appointmentSlot.createMany({
        data: appointmentSlots
          .map((slot) => {
            return createdBranches.map((branch) => ({
              ...slot,
              branchId: branch.id,
            }));
          })
          .flat(),
      });
    }
    if (diagnosticIntegrations.length > 0 && createdBranches.length > 0) {
      await tx.diagnosticIntegration.createMany({
        data: diagnosticIntegrations
          .map((diag) => {
            return createdBranches.map((branch) => ({
              ...diag,
              businessBranchId: branch.id,
            }));
          })
          .flat(),
      });
    }

    return { ...newBusinessUnit, branches: createdBranches };
  });
};

const getBusinessUnitById = async (id: string) => {
  return prisma.businessUnit.findUnique({
    where: { id },
    include: {
      // Full branch details — same as getLatestBusinessUnit so the
      // onboarding page can load correctly when fetching by a specific ID.
      branches: {
        include: {
          services: {
            include: {
              serviceDetails: true,
            },
          },
          departments: {
            include: {
              departmentDetails: true,
            },
          },
          animalClasses: {
            include: {
              animalClassDetails: true,
            },
          },
          appointmentSlots: true,
          diagnosticIntegrations: true,
        },
      },
      availableServices: true,
      availableDepartments: true,
      staff: true,
      vendors: true,
    },
  });
};

const addServiceToBusinessUnit = async (id: string, payload: { serviceId: string }) => {
  return prisma.businessUnitsToServices.create({
    data: {
      businessUnitId: id,
      serviceId: payload.serviceId,
    },
  });
};

const addDepartmentToBusinessUnit = async (id: string, payload: { departmentId: string }) => {
  return prisma.businessUnitsToDepartments.create({
    data: {
      businessUnitId: id,
      departmentId: payload.departmentId,
    },
  });
};

const getLatestBusinessUnit = async () => {
  return prisma.businessUnit.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      branches: {
        include: {
          services: {
            include: {
              serviceDetails: true,
            },
          },
          departments: {
            include: {
              departmentDetails: true,
            },
          },
          animalClasses: {
            include: {
              animalClassDetails: true,
            },
          },
          appointmentSlots: true,
          diagnosticIntegrations: true,
        },
      },
      staff: true,
      vendors: true,
    },
  });
};

// ─── Update (Upsert) — called by PATCH /:id ──────────────────────────────────
const updateBusinessUnit = async (
  id: string,
  payload: BusinessUnit & {
    businessBranches: (BusinessBranch & { id?: string })[];
    services: { serviceId: string; basePrice: number }[];
    animalClasses: string[];
    staffs: Staff[];
    vendors: { name: string }[];
    diagnosticIntegrations: { name: string }[];
  },
) => {
  const {
    services,
    animalClasses,
    businessBranches,
    diagnosticIntegrations,
    staffs,
    vendors,
    ...data
  } = payload;

  return prisma.$transaction(async (tx) => {
    // 1. Update the core BusinessUnit record
    // Note: BusinessUnit schema only has name + type as updateable scalar fields
    const updatedBusinessUnit = await tx.businessUnit.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
      },
    });

    // 2. Sync branches: upsert existing, create new, delete removed
    const incomingBranchIds = businessBranches
      .filter((b) => b.id)
      .map((b) => b.id as string);

    // Delete branches that were removed in the UI
    await tx.businessBranch.deleteMany({
      where: {
        businessUnitId: id,
        id: { notIn: incomingBranchIds },
      },
    });

    const syncedBranches = [];
    for (const branch of businessBranches) {
      if (branch.id) {
        // Update existing branch
        // Note: Only update fields that exist in the BusinessBranch Prisma schema
        const updated = await tx.businessBranch.update({
          where: { id: branch.id },
          data: {
            name: branch.name,
            type: branch.type,
            practice: branch.practice,
            currency: branch.currency,
            addressLine1: branch.addressLine1,
            addressLine2: branch.addressLine2,
            country: branch.country,
            state: branch.state,
            city: branch.city,
            postalCode: branch.postalCode,
          },
        });
        syncedBranches.push(updated);
      } else {
        // Create new branch
        const created = await tx.businessBranch.create({
          data: {
            ...(branch as any),
            id: undefined,
            businessUnitId: id,
          },
        });
        syncedBranches.push(created);
      }
    }

    return { ...updatedBusinessUnit, branches: syncedBranches };
  });
};

const businessUnitService = {
  onboardBusinessUnit,
  updateBusinessUnit,
  getBusinessUnitById,
  addServiceToBusinessUnit,
  addDepartmentToBusinessUnit,
  getLatestBusinessUnit,
};
export default businessUnitService;
