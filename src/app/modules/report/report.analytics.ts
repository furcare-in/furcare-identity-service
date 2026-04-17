// @ts-nocheck
import pkg from "@prisma/client";
const { ReportFrequency, ReportType } = pkg;
import prisma from "../../../utils/prisma.js";

type ReportValueType = "number" | "currency" | "percentage";

export type TReportFieldDefinition = {
  key: string;
  label: string;
  valueType: ReportValueType;
  description?: string;
};

type TReportTypeDefinition = {
  type: ReportType;
  label: string;
  fields: TReportFieldDefinition[];
};

type TScope = {
  businessBranchId?: string;
  businessUnitId?: string;
  branchIds: string[];
};

type TReportDataInput = {
  type: ReportType;
  fields?: string[];
  startDate: string;
  endDate: string;
  frequency?: ReportFrequency;
  businessBranchId?: string;
  businessUnitId?: string;
  branchId?: string;
};

type TBucket = {
  start: Date;
  end: Date;
};

type TDayData = {
  date: string;
  statistics: Record<string, number>;
  appointmentsWithDoctors?: Array<{
    appointmentId: string;
    appointmentType: string;
    petNames: string[];
    doctor: {
      id: string;
      name: string;
    } | null;
  }>;
};

type TReportDataOutput = {
  type: ReportType;
  frequency: ReportFrequency;
  fields: TReportFieldDefinition[];
  dayWiseData: TDayData[];
  totals: Record<string, number>;
};

const REPORT_TYPE_DEFINITIONS: Record<ReportType, TReportTypeDefinition> = {
  appointments: {
    type: "appointments",
    label: "Appointments",
    fields: [
      { key: "scheduledAppointmentsCount", label: "Scheduled Appointments", valueType: "number" },
      { key: "cancelledAppointmentsCount", label: "Cancelled Appointments", valueType: "number" },
      { key: "rescheduledAppointmentsCount", label: "Rescheduled Appointments", valueType: "number" },
      { key: "virtualAppointmentsCount", label: "Virtual Appointments", valueType: "number" },
      { key: "appointmentSlotsCount", label: "Appointment Slots", valueType: "number" },
      { key: "appointmentTimeSlotsCount", label: "Appointment Time", valueType: "number" },
      { key: "doctorsCount", label: "Doctors", valueType: "number" },
      { key: "revenue", label: "Appointment Revenue", valueType: "currency" },
      { key: "appointmentTypesCount", label: "Appointment Types", valueType: "number" },
    ],
  },
  admin: {
    type: "admin",
    label: "Admin",
    fields: [
      { key: "activeStaffCount", label: "Active Staff", valueType: "number" },
      { key: "inactiveStaffCount", label: "Inactive Staff", valueType: "number" },
      { key: "onboardedStaffCount", label: "Onboarded Staff", valueType: "number" },
      { key: "activeRolesCount", label: "Active Roles", valueType: "number" },
      { key: "activeGroupsCount", label: "Active Groups", valueType: "number" },
      { key: "activeDepartmentsCount", label: "Departments", valueType: "number" },
      { key: "activeServicesCount", label: "Services", valueType: "number" },
    ],
  },
  client_and_patient: {
    type: "client_and_patient",
    label: "Client & Patient",
    fields: [
      { key: "newClientsCount", label: "New Clients", valueType: "number" },
      { key: "activeClientsCount", label: "Active Clients", valueType: "number" },
      { key: "newPatientsCount", label: "New Patients", valueType: "number" },
      { key: "activePatientsCount", label: "Active Patients", valueType: "number" },
      { key: "visitsCount", label: "Visits", valueType: "number" },
      { key: "animalTypeBreedsCount", label: "Animal Type", valueType: "number" },
      { key: "avgPatientAgeMonths", label: "Patient Age (avg months)", valueType: "number" },
      { key: "deceasedPatientsCount", label: "Deceased Patients", valueType: "number" },
      { key: "avgPatientsPerClient", label: "Avg Patients per Client", valueType: "number" },
      { key: "vaccinationsDueSoonCount", label: "Vaccinations Due Soon", valueType: "number" },
      { key: "vaccinationsPastDueCount", label: "Vaccinations Past Due", valueType: "number" },
      { key: "referredClientsCount", label: "Referred Clients", valueType: "number" },
    ],
  },
  inventory: {
    type: "inventory",
    label: "Inventory",
    fields: [
      { key: "activeProductsCount", label: "All Products", valueType: "number" },
      { key: "productNamesCount", label: "All Products (Name)", valueType: "number" },
      { key: "productCategoriesCount", label: "Product Category", valueType: "number" },
      { key: "onHandQtyTotal", label: "On Hand Qty", valueType: "number" },
      { key: "thresholdQtyTotal", label: "Threshold Qty", valueType: "number" },
      { key: "lowStockProductsCount", label: "Low Stock Products", valueType: "number" },
      { key: "outOfStockProductsCount", label: "Availability (Out of Stock)", valueType: "number" },
      { key: "inventoryValueAtCost", label: "Inventory Cost Value", valueType: "currency" },
      { key: "inventoryValueAtSale", label: "Inventory Sales Value", valueType: "currency" },
      { key: "expiringProductsCount", label: "Expiry Date (Expiring)", valueType: "number" },
      { key: "activeSuppliersCount", label: "Supplier", valueType: "number" },
    ],
  },
  communication: {
    type: "communication",
    label: "Communication",
    fields: [
      { key: "postsCreatedCount", label: "Posts Created", valueType: "number" },
      { key: "totalViews", label: "Total Views", valueType: "number" },
      { key: "totalLikes", label: "Total Likes", valueType: "number" },
      { key: "uniqueAuthorsCount", label: "Active Authors", valueType: "number" },
      { key: "distinctTagsCount", label: "Distinct Tags", valueType: "number" },
      { key: "postsByCategoryCount", label: "Posts by Category", valueType: "number" },
    ],
  },
  visits: {
    type: "visits",
    label: "Visits",
    fields: [
      { key: "scheduledVisitsCount", label: "Visits (Scheduled)", valueType: "number" },
      { key: "inProgressVisitsCount", label: "Visits (In Progress)", valueType: "number" },
      { key: "completedVisitsCount", label: "Visits (Completed)", valueType: "number" },
      { key: "cancelledVisitsCount", label: "Visits (Cancelled)", valueType: "number" },
      { key: "totalVisitsCount", label: "Visits", valueType: "number" },
      { key: "animalTypeBreedsCount", label: "Animal Type", valueType: "number" },
      { key: "avgPatientAgeMonths", label: "Patient Age (avg months)", valueType: "number" },
      { key: "vaccinationsCount", label: "Vaccinations", valueType: "number" },
      { key: "vaccinationsDueSoonCount", label: "Patients with Vaccination Due Soon", valueType: "number" },
      { key: "vaccinationsPastDueCount", label: "Patients with Vaccination Past Due", valueType: "number" },
      { key: "vaccinationsUpToDateCount", label: "Patients with Vaccination Up-to-Date", valueType: "number" },
      { key: "prescriptionsCount", label: "Prescriptions", valueType: "number" },
      { key: "fluidTherapyCount", label: "Prescription - Fluid Therapy", valueType: "number" },
      { key: "euthanasiaCount", label: "Prescription - Euthanasia", valueType: "number" },
      { key: "anaesthesiaCount", label: "Prescription - Anesthesia", valueType: "number" },
      { key: "diagnosticsCount", label: "Diagnostics", valueType: "number" },
      { key: "diagnosticTypesCount", label: "Diagnostics Type", valueType: "number" },
      { key: "diagnosticCentersCount", label: "Diagnostic Center", valueType: "number" },
      { key: "diagnosticStatusCount", label: "Diagnostic Status", valueType: "number" },
      { key: "pendingPaymentsCount", label: "Pending Payments", valueType: "number" },
      { key: "completedPaymentsCount", label: "Completed Payments", valueType: "number" },
      { key: "revenueCollected", label: "Revenue Collected", valueType: "currency" },
      { key: "avgVisitValue", label: "Average Visit Value", valueType: "currency" },
    ],
  },
  leads: {
    type: "leads",
    label: "Leads",
    fields: [
      { key: "allLeadsCount", label: "All Leads", valueType: "number" },
      { key: "leadTypesConfiguredCount", label: "Lead Type", valueType: "number" },
      { key: "leadTypeDistinctCount", label: "Lead Types (Distinct Names)", valueType: "number" },
      { key: "activeLeadTypesCount", label: "Status (Active Lead Types)", valueType: "number" },
      { key: "customerWithLeadCount", label: "Customer Name (with Lead)", valueType: "number" },
      { key: "distinctLeadSourcesConfiguredCount", label: "Distinct Lead Sources", valueType: "number" },
      { key: "referredClientsCount", label: "Referred Clients", valueType: "number" },
    ],
  },
};

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

const isValidObjectId = (value?: string): value is string =>
  Boolean(value && OBJECT_ID_REGEX.test(value));

const startOfDay = (input: Date) => {
  const date = new Date(input);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (input: Date) => {
  const date = new Date(input);
  date.setHours(23, 59, 59, 999);
  return date;
};

const addFrequency = (date: Date, frequency: ReportFrequency) => {
  const next = new Date(date);
  if (frequency === "day") next.setDate(next.getDate() + 1);
  if (frequency === "week") next.setDate(next.getDate() + 7);
  if (frequency === "month") next.setMonth(next.getMonth() + 1);
  return next;
};

const parseDateInput = (dateValue: string, fallback?: Date) => {
  const parsed = new Date(dateValue);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  return fallback ?? new Date();
};

const createBuckets = (
  startDateRaw: string,
  endDateRaw: string,
  frequency: ReportFrequency,
) => {
  const startDate = startOfDay(parseDateInput(startDateRaw));
  const endDate = endOfDay(parseDateInput(endDateRaw, startDate));

  if (startDate > endDate) return [] as TBucket[];

  const buckets: TBucket[] = [];
  let cursor = startDate;

  while (cursor <= endDate) {
    const next = addFrequency(cursor, frequency);
    const bucketEnd = new Date(next.getTime() - 1);
    buckets.push({
      start: cursor,
      end: bucketEnd > endDate ? endDate : bucketEnd,
    });
    cursor = next;
  }

  return buckets;
};

const findBucketIndex = (date: Date, buckets: TBucket[]) => {
  for (let index = 0; index < buckets.length; index += 1) {
    if (date >= buckets[index].start && date <= buckets[index].end) return index;
  }
  return -1;
};

const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0);

const resolveScope = async ({
  businessBranchId,
  businessUnitId,
  branchId,
}: Pick<TReportDataInput, "businessBranchId" | "businessUnitId" | "branchId">): Promise<TScope> => {
  const normalizedBranchId = businessBranchId ?? branchId;

  if (isValidObjectId(normalizedBranchId)) {
    return {
      businessBranchId: normalizedBranchId,
      businessUnitId: isValidObjectId(businessUnitId) ? businessUnitId : undefined,
      branchIds: [normalizedBranchId],
    };
  }

  if (isValidObjectId(businessUnitId)) {
    const branches = await prisma.businessBranch.findMany({
      where: { businessUnitId: Number(businessUnitId) },
      select: { id: true },
    });
    return {
      businessUnitId,
      branchIds: branches.map((branch) => branch.id),
    };
  }

  return { branchIds: [] };
};

const normalizeRequestedFields = (type: ReportType, fields?: string[]) => {
  const typeDefinition = REPORT_TYPE_DEFINITIONS[type];
  const allFields = typeDefinition.fields;
  if (!fields?.length) return allFields;

  const matcher = new Map<string, TReportFieldDefinition>();
  allFields.forEach((field) => {
    matcher.set(field.key.toLowerCase(), field);
    matcher.set(field.label.toLowerCase(), field);
  });

  const selected: TReportFieldDefinition[] = [];
  const seen = new Set<string>();

  fields.forEach((rawField) => {
    const match = matcher.get(rawField.trim().toLowerCase());
    if (!match) return;
    if (seen.has(match.key)) return;
    selected.push(match);
    seen.add(match.key);
  });

  return selected.length > 0 ? selected : allFields;
};

const initDayWiseData = (buckets: TBucket[], fieldKeys: string[]) =>
  buckets.map((bucket) => ({
    date: bucket.start.toISOString().split("T")[0],
    statistics: Object.fromEntries(fieldKeys.map((fieldKey) => [fieldKey, 0])),
  })) as TDayData[];

const buildTotals = (dayWiseData: TDayData[], fieldKeys: string[]) =>
  Object.fromEntries(
    fieldKeys.map((fieldKey) => [
      fieldKey,
      sum(dayWiseData.map((day) => Number(day.statistics[fieldKey] ?? 0))),
    ]),
  );

const parseAppointmentDate = (appointmentDate: string, createdAt: Date) => {
  const candidate = new Date(appointmentDate);
  if (!Number.isNaN(candidate.getTime())) return candidate;
  return createdAt;
};

const isVirtualAppointment = (appointmentType: string) =>
  appointmentType.trim().toLowerCase().includes("virtual");

const analyzeAppointments = async (
  buckets: TBucket[],
  dayWiseData: TDayData[],
  fieldKeys: string[],
  scope: TScope,
) => {
  const appointments = await prisma.appointment.findMany({
    where: {
      active: true,
      ...(scope.branchIds.length > 0 ? { branchId: { in: scope.branchIds } } : {}),
    },
    select: {
      id: true,
      appointmentDate: true,
      appointmentType: true,
      doctorId: true,
      petNames: true,
      createdAt: true,
    },
  });

  const appointmentById = new Map(appointments.map((appointment) => [appointment.id, appointment]));

  const appointmentsInBuckets = appointments
    .map((appointment) => ({
      ...appointment,
      bucketIndex: findBucketIndex(
        parseAppointmentDate(appointment.appointmentDate, appointment.createdAt),
        buckets,
      ),
    }))
    .filter((appointment) => appointment.bucketIndex >= 0);

  const doctorIds = Array.from(
    new Set(
      appointmentsInBuckets
        .map((appointment) => appointment.doctorId)
        .filter((id): id is string => typeof id === "string" && isValidObjectId(id)), // skip "system_ai" and any non-ObjectID strings
    ),
  );

  const doctors = doctorIds.length
    ? await prisma.staff.findMany({
        where: { id: { in: doctorIds } },
        select: { id: true, name: true },
      })
    : [];
  const doctorMap = new Map(doctors.map((doctor) => [doctor.id, doctor.name]));

  const bucketDoctorSet = new Map<number, Set<string>>();
  const bucketTypeSet = new Map<number, Set<string>>();
  const bucketTimeSlotSet = new Map<number, Set<string>>();

  dayWiseData.forEach((day) => {
    day.appointmentsWithDoctors = [];
  });

  appointmentsInBuckets.forEach((appointment) => {
    const { bucketIndex } = appointment;

    if (fieldKeys.includes("scheduledAppointmentsCount")) {
      dayWiseData[bucketIndex].statistics.scheduledAppointmentsCount += 1;
    }
    if (fieldKeys.includes("virtualAppointmentsCount") && isVirtualAppointment(appointment.appointmentType)) {
      dayWiseData[bucketIndex].statistics.virtualAppointmentsCount += 1;
    }

    if (!bucketDoctorSet.has(bucketIndex)) bucketDoctorSet.set(bucketIndex, new Set());
    if (appointment.doctorId) bucketDoctorSet.get(bucketIndex)?.add(appointment.doctorId);

    if (!bucketTypeSet.has(bucketIndex)) bucketTypeSet.set(bucketIndex, new Set());
    bucketTypeSet.get(bucketIndex)?.add(appointment.appointmentType);

    // Track distinct time slots (hour:minute) from appointmentDate
    if (!bucketTimeSlotSet.has(bucketIndex)) bucketTimeSlotSet.set(bucketIndex, new Set());
    const aptDate = parseAppointmentDate(appointment.appointmentDate, appointment.createdAt);
    const timeSlot = `${aptDate.getHours()}:${String(aptDate.getMinutes()).padStart(2, "0")}`;
    bucketTimeSlotSet.get(bucketIndex)?.add(timeSlot);

    dayWiseData[bucketIndex].appointmentsWithDoctors?.push({
      appointmentId: appointment.id,
      appointmentType: appointment.appointmentType,
      petNames: appointment.petNames,
      doctor: appointment.doctorId
        ? {
            id: appointment.doctorId,
            name: doctorMap.get(appointment.doctorId) ?? "Unknown",
          }
        : null,
    });
  });

  if (fieldKeys.includes("doctorsCount")) {
    dayWiseData.forEach((day, index) => {
      day.statistics.doctorsCount = bucketDoctorSet.get(index)?.size ?? 0;
    });
  }

  if (fieldKeys.includes("appointmentTypesCount")) {
    dayWiseData.forEach((day, index) => {
      day.statistics.appointmentTypesCount = bucketTypeSet.get(index)?.size ?? 0;
    });
  }

  // Appointment Slots: distinct appointment types configured (same as appointmentTypesCount)
  if (fieldKeys.includes("appointmentSlotsCount")) {
    dayWiseData.forEach((day, index) => {
      day.statistics.appointmentSlotsCount = bucketTypeSet.get(index)?.size ?? 0;
    });
  }

  // Appointment Time: distinct clock-time slots used in the bucket
  if (fieldKeys.includes("appointmentTimeSlotsCount")) {
    dayWiseData.forEach((day, index) => {
      day.statistics.appointmentTimeSlotsCount = bucketTimeSlotSet.get(index)?.size ?? 0;
    });
  }

  if (fieldKeys.includes("cancelledAppointmentsCount")) {
    const visitCancellations = await prisma.visit.findMany({
      where: {
        status: "Cancelled",
        moduleId: { not: null },
        ...(scope.branchIds.length > 0 ? { businessBranchId: { in: scope.branchIds } } : {}),
      },
      select: { moduleId: true, date: true },
    });

    const uniquePerBucket = new Map<number, Set<string>>();
    visitCancellations.forEach((cancellation) => {
      if (!cancellation.moduleId) return;
      if (!appointmentById.has(cancellation.moduleId)) return;
      const bucketIndex = findBucketIndex(cancellation.date, buckets);
      if (bucketIndex < 0) return;
      if (!uniquePerBucket.has(bucketIndex)) uniquePerBucket.set(bucketIndex, new Set());
      uniquePerBucket.get(bucketIndex)?.add(cancellation.moduleId);
    });

    dayWiseData.forEach((day, index) => {
      day.statistics.cancelledAppointmentsCount = uniquePerBucket.get(index)?.size ?? 0;
    });
  }

  if (fieldKeys.includes("rescheduledAppointmentsCount")) {
    dayWiseData.forEach((day) => {
      day.statistics.rescheduledAppointmentsCount = 0;
    });
  }

  if (fieldKeys.includes("revenue")) {
    const appointmentIds = Array.from(appointmentById.keys());
    if (appointmentIds.length > 0) {
      const paidVisits = await prisma.visit.findMany({
        where: {
          moduleId: { in: appointmentIds },
          paymentStatus: "Completed",
          totalAmount: { not: null },
          ...(scope.branchIds.length > 0 ? { businessBranchId: { in: scope.branchIds } } : {}),
        },
        select: { date: true, totalAmount: true },
      });

      paidVisits.forEach((visit) => {
        const bucketIndex = findBucketIndex(visit.date, buckets);
        if (bucketIndex < 0) return;
        dayWiseData[bucketIndex].statistics.revenue += Number(visit.totalAmount ?? 0);
      });
    }
  }
};

const analyzeAdmin = async (
  buckets: TBucket[],
  dayWiseData: TDayData[],
  fieldKeys: string[],
  scope: TScope,
) => {
  const [staffs, roles, groups, departments, services] = await Promise.all([
    prisma.staff.findMany({
      where: {
        ...(scope.branchIds.length > 0
          ? { OR: [{ businessBranchId: { in: scope.branchIds } }, { branches: { some: { branchId: { in: scope.branchIds } } } }] }
          : {}),
      },
      select: { createdAt: true, active: true, onboardingCompleted: true },
    }),
    prisma.role.findMany({
      where: {
        ...(scope.businessUnitId ? { businessUnitId: scope.businessUnitId } : {}),
        ...(scope.branchIds.length > 0 ? { OR: [{ businessBranchId: { in: scope.branchIds } }, { businessBranchId: null }] } : {}),
      },
      select: { createdAt: true, active: true },
    }),
    prisma.group.findMany({
      where: {
        ...(scope.branchIds.length > 0 ? { businessBranchId: { in: scope.branchIds } } : {}),
      },
      select: { createdAt: true, active: true },
    }),
    prisma.departmentsToBranches.findMany({
      where: {
        ...(scope.branchIds.length > 0 ? { branchId: { in: scope.branchIds } } : {}),
      },
      select: { createdAt: true, active: true },
    }),
    prisma.servicesToBranches.findMany({
      where: {
        ...(scope.branchIds.length > 0 ? { branchId: { in: scope.branchIds } } : {}),
      },
      select: { createdAt: true, active: true },
    }),
  ]);

  const applyCount = <TRecord extends { createdAt: Date }>(
    key: string,
    records: TRecord[],
    predicate?: (record: TRecord) => boolean,
  ) => {
    if (!fieldKeys.includes(key)) return;
    records.forEach((record) => {
      if (predicate && !predicate(record)) return;
      const bucketIndex = findBucketIndex(record.createdAt, buckets);
      if (bucketIndex < 0) return;
      dayWiseData[bucketIndex].statistics[key] += 1;
    });
  };

  applyCount("activeStaffCount", staffs, (item) => item.active);
  applyCount("inactiveStaffCount", staffs, (item) => !item.active);
  applyCount("onboardedStaffCount", staffs, (item) => item.onboardingCompleted);
  applyCount("activeRolesCount", roles, (item) => item.active);
  applyCount("activeGroupsCount", groups, (item) => item.active);
  applyCount("activeDepartmentsCount", departments, (item) => item.active);
  applyCount("activeServicesCount", services, (item) => item.active);
};

const analyzeClientAndPatient = async (
  buckets: TBucket[],
  dayWiseData: TDayData[],
  fieldKeys: string[],
  scope: TScope,
) => {
  const [clients, pets, vaccinations, visits] = await Promise.all([
    prisma.client.findMany({
      where: {
        ...(scope.branchIds.length > 0 ? { businessBranchId: { in: scope.branchIds } } : {}),
      },
      select: { createdAt: true, active: true, referredBy: true },
    }),
    prisma.pet.findMany({
      where: {
        ...(scope.branchIds.length > 0 ? { client: { businessBranchId: { in: scope.branchIds } } } : {}),
      },
      select: { createdAt: true, active: true, dob: true, breed: true, animalClassId: true },
    }),
    prisma.vaccinationStatus.findMany({
      where: {
        ...(scope.branchIds.length > 0 ? { businessBranchId: { in: scope.branchIds } } : {}),
        nextDueDate: { not: null },
      },
      select: { nextDueDate: true, status: true },
    }),
    (fieldKeys.includes("visitsCount")
      ? prisma.visit.findMany({
          where: {
            ...(scope.branchIds.length > 0 ? { businessBranchId: { in: scope.branchIds } } : {}),
            date: { gte: buckets[0]?.start, lte: buckets[buckets.length - 1]?.end },
          },
          select: { date: true },
        })
      : Promise.resolve([])),
  ]);

  const clientCountsPerBucket = new Array(dayWiseData.length).fill(0);
  const petCountsPerBucket = new Array(dayWiseData.length).fill(0);
  const petAgeMonthsSumPerBucket = new Array(dayWiseData.length).fill(0);
  const petAgeCountPerBucket = new Array(dayWiseData.length).fill(0);
  const animalTypeBreedSetsPerBucket = Array.from({ length: dayWiseData.length }, () => new Set<string>());

  const now = new Date();

  clients.forEach((client) => {
    const bucketIndex = findBucketIndex(client.createdAt, buckets);
    if (bucketIndex < 0) return;
    clientCountsPerBucket[bucketIndex] += 1;

    if (fieldKeys.includes("newClientsCount")) dayWiseData[bucketIndex].statistics.newClientsCount += 1;
    if (fieldKeys.includes("activeClientsCount") && client.active) {
      dayWiseData[bucketIndex].statistics.activeClientsCount += 1;
    }
    if (fieldKeys.includes("referredClientsCount") && client.referredBy?.trim()) {
      dayWiseData[bucketIndex].statistics.referredClientsCount += 1;
    }
  });

  pets.forEach((pet) => {
    const bucketIndex = findBucketIndex(pet.createdAt, buckets);
    if (bucketIndex < 0) return;
    petCountsPerBucket[bucketIndex] += 1;

    if (fieldKeys.includes("newPatientsCount")) dayWiseData[bucketIndex].statistics.newPatientsCount += 1;
    if (fieldKeys.includes("activePatientsCount") && pet.active) {
      dayWiseData[bucketIndex].statistics.activePatientsCount += 1;
    }
    if (fieldKeys.includes("deceasedPatientsCount") && !pet.active) {
      dayWiseData[bucketIndex].statistics.deceasedPatientsCount += 1;
    }

    // Animal Type: track distinct "breed (animalClassId)" combos per bucket
    if (fieldKeys.includes("animalTypeBreedsCount")) {
      const combo = `${pet.animalClassId}::${pet.breed}`.toLowerCase();
      animalTypeBreedSetsPerBucket[bucketIndex].add(combo);
    }

    // Patient Age: compute months from dob
    if (fieldKeys.includes("avgPatientAgeMonths") && pet.dob) {
      const dobDate = new Date(pet.dob);
      const ageMs = now.getTime() - dobDate.getTime();
      const ageMonths = Math.floor(ageMs / (1000 * 60 * 60 * 24 * 30.44));
      petAgeMonthsSumPerBucket[bucketIndex] += ageMonths;
      petAgeCountPerBucket[bucketIndex] += 1;
    }
  });

  vaccinations.forEach((vaccination) => {
    if (!vaccination.nextDueDate) return;
    const bucketIndex = findBucketIndex(vaccination.nextDueDate, buckets);
    if (bucketIndex < 0) return;
    if (fieldKeys.includes("vaccinationsDueSoonCount") && vaccination.status === "Due Soon") {
      dayWiseData[bucketIndex].statistics.vaccinationsDueSoonCount += 1;
    }
    if (fieldKeys.includes("vaccinationsPastDueCount") && vaccination.status === "Past Due") {
      dayWiseData[bucketIndex].statistics.vaccinationsPastDueCount += 1;
    }
  });

  if (fieldKeys.includes("visitsCount")) {
    visits.forEach((visit) => {
      const bucketIndex = findBucketIndex(visit.date, buckets);
      if (bucketIndex < 0) return;
      dayWiseData[bucketIndex].statistics.visitsCount += 1;
    });
  }

  if (fieldKeys.includes("avgPatientsPerClient")) {
    dayWiseData.forEach((day, index) => {
      const clientsCount = clientCountsPerBucket[index];
      const petsCount = petCountsPerBucket[index];
      day.statistics.avgPatientsPerClient = clientsCount > 0 ? Number((petsCount / clientsCount).toFixed(2)) : 0;
    });
  }

  if (fieldKeys.includes("animalTypeBreedsCount")) {
    dayWiseData.forEach((day, index) => {
      day.statistics.animalTypeBreedsCount = animalTypeBreedSetsPerBucket[index].size;
    });
  }

  if (fieldKeys.includes("avgPatientAgeMonths")) {
    dayWiseData.forEach((day, index) => {
      const count = petAgeCountPerBucket[index];
      day.statistics.avgPatientAgeMonths = count > 0 ? Math.round(petAgeMonthsSumPerBucket[index] / count) : 0;
    });
  }
};

const analyzeInventory = async (
  buckets: TBucket[],
  dayWiseData: TDayData[],
  fieldKeys: string[],
  scope: TScope,
) => {
  const [products, suppliers] = await Promise.all([
    prisma.product.findMany({
      where: {
        ...(scope.branchIds.length > 0 ? { businessBranchId: { in: scope.branchIds } } : {}),
        active: true,
      },
      select: {
        createdAt: true,
        name: true,
        category: true,
        quantity: true,
        minQuantity: true,
        costPrice: true,
        sellingPrice: true,
        expiryDate: true,
      },
    }),
    prisma.supplier.findMany({
      where: {
        ...(scope.branchIds.length > 0 ? { businessBranchId: { in: scope.branchIds } } : {}),
        active: true,
      },
      select: { createdAt: true },
    }),
  ]);

  dayWiseData.forEach((day, index) => {
    const bucket = buckets[index];
    const activeProducts = products.filter((product) => product.createdAt <= bucket.end);
    const activeSuppliers = suppliers.filter((supplier) => supplier.createdAt <= bucket.end);

    if (fieldKeys.includes("activeProductsCount")) {
      day.statistics.activeProductsCount = activeProducts.length;
    }
    // Distinct product names count
    if (fieldKeys.includes("productNamesCount")) {
      const nameSet = new Set(activeProducts.map((p) => p.name?.trim().toLowerCase()).filter(Boolean));
      day.statistics.productNamesCount = nameSet.size;
    }
    // Distinct product categories count
    if (fieldKeys.includes("productCategoriesCount")) {
      const catSet = new Set(
        activeProducts.map((p) => (p as any).category?.trim().toLowerCase()).filter(Boolean),
      );
      day.statistics.productCategoriesCount = catSet.size;
    }
    // Total on-hand quantity
    if (fieldKeys.includes("onHandQtyTotal")) {
      day.statistics.onHandQtyTotal = activeProducts.reduce(
        (acc, p) => acc + (Number(p.quantity) || 0),
        0,
      );
    }
    // Total threshold (min) quantity
    if (fieldKeys.includes("thresholdQtyTotal")) {
      day.statistics.thresholdQtyTotal = activeProducts.reduce(
        (acc, p) => acc + (Number(p.minQuantity) || 0),
        0,
      );
    }
    if (fieldKeys.includes("lowStockProductsCount")) {
      day.statistics.lowStockProductsCount = activeProducts.filter((product) => {
        const minQuantity = Number(product.minQuantity ?? 0);
        return minQuantity > 0 && product.quantity <= minQuantity;
      }).length;
    }
    if (fieldKeys.includes("outOfStockProductsCount")) {
      day.statistics.outOfStockProductsCount = activeProducts.filter((product) => product.quantity <= 0).length;
    }
    if (fieldKeys.includes("inventoryValueAtCost")) {
      day.statistics.inventoryValueAtCost = Number(
        sum(activeProducts.map((product) => product.quantity * Number(product.costPrice ?? 0))).toFixed(2),
      );
    }
    if (fieldKeys.includes("inventoryValueAtSale")) {
      day.statistics.inventoryValueAtSale = Number(
        sum(activeProducts.map((product) => product.quantity * Number(product.sellingPrice ?? 0))).toFixed(2),
      );
    }
    if (fieldKeys.includes("expiringProductsCount")) {
      day.statistics.expiringProductsCount = activeProducts.filter((product) => {
        if (!product.expiryDate) return false;
        return product.expiryDate >= bucket.start && product.expiryDate <= bucket.end;
      }).length;
    }
    if (fieldKeys.includes("activeSuppliersCount")) {
      day.statistics.activeSuppliersCount = activeSuppliers.length;
    }
  });
};

const analyzeCommunication = async (
  buckets: TBucket[],
  dayWiseData: TDayData[],
  fieldKeys: string[],
  scope: TScope,
) => {
  const posts = await prisma.portalPost.findMany({
    where: {
      ...(scope.branchIds.length > 0 ? { businessBranchId: { in: scope.branchIds } } : {}),
    },
    select: {
      createdAt: true,
      likes: true,
      views: true,
      tags: true,
      authorId: true,
      category: true,
    },
  });

  const authorSets = new Map<number, Set<string>>();
  const tagSets = new Map<number, Set<string>>();
  const categorySets = new Map<number, Set<string>>();

  posts.forEach((post) => {
    const bucketIndex = findBucketIndex(post.createdAt, buckets);
    if (bucketIndex < 0) return;

    if (fieldKeys.includes("postsCreatedCount")) dayWiseData[bucketIndex].statistics.postsCreatedCount += 1;
    if (fieldKeys.includes("totalViews")) dayWiseData[bucketIndex].statistics.totalViews += Number(post.views ?? 0);
    if (fieldKeys.includes("totalLikes")) dayWiseData[bucketIndex].statistics.totalLikes += Number(post.likes ?? 0);

    if (!authorSets.has(bucketIndex)) authorSets.set(bucketIndex, new Set());
    authorSets.get(bucketIndex)?.add(post.authorId);

    if (!tagSets.has(bucketIndex)) tagSets.set(bucketIndex, new Set());
    post.tags.forEach((tag) => {
      if (tag.trim()) tagSets.get(bucketIndex)?.add(tag.trim().toLowerCase());
    });

    if (!categorySets.has(bucketIndex)) categorySets.set(bucketIndex, new Set());
    if (post.category?.trim()) categorySets.get(bucketIndex)?.add(post.category.trim().toLowerCase());
  });

  dayWiseData.forEach((day, index) => {
    if (fieldKeys.includes("uniqueAuthorsCount")) {
      day.statistics.uniqueAuthorsCount = authorSets.get(index)?.size ?? 0;
    }
    if (fieldKeys.includes("distinctTagsCount")) {
      day.statistics.distinctTagsCount = tagSets.get(index)?.size ?? 0;
    }
    if (fieldKeys.includes("postsByCategoryCount")) {
      day.statistics.postsByCategoryCount = categorySets.get(index)?.size ?? 0;
    }
  });
};

/**
 * Safely parse a JSON field from Visit (prescriptions, diagnostics, etc.)
 * These are stored as Json? — could be null, array, or object.
 */
const safeParseJsonArray = (value: unknown): unknown[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const analyzeVisits = async (
  buckets: TBucket[],
  dayWiseData: TDayData[],
  fieldKeys: string[],
  scope: TScope,
) => {
  // Determine which extra fields we need to load
  const needsPets = fieldKeys.includes("animalTypeBreedsCount") || fieldKeys.includes("avgPatientAgeMonths");
  const needsVaccinations =
    fieldKeys.includes("vaccinationsCount") ||
    fieldKeys.includes("vaccinationsDueSoonCount") ||
    fieldKeys.includes("vaccinationsPastDueCount") ||
    fieldKeys.includes("vaccinationsUpToDateCount");
  const needsAnaesthesia = fieldKeys.includes("anaesthesiaCount");

  const [visits, anesthesiaSessions] = await Promise.all([
    prisma.visit.findMany({
      where: {
        ...(scope.branchIds.length > 0 ? { businessBranchId: { in: scope.branchIds } } : {}),
        date: {
          gte: buckets[0]?.start,
          lte: buckets[buckets.length - 1]?.end,
        },
      },
      select: {
        id: true,
        date: true,
        status: true,
        paymentStatus: true,
        totalAmount: true,
        petId: true,
        prescriptions: true,
        diagnostics: true,
        vaccination: true,
      },
    }),
    needsAnaesthesia
      ? prisma.anesthesiaSession.findMany({
          where: {
            ...(scope.branchIds.length > 0 ? { businessBranchId: { in: scope.branchIds } } : {}),
            createdAt: {
              gte: buckets[0]?.start,
              lte: buckets[buckets.length - 1]?.end,
            },
          },
          select: { createdAt: true },
        })
      : Promise.resolve([]),
  ]);

  // If we need pet data for breed/age, batch-fetch all relevant pets
  let petMap = new Map<string, { dob: Date; breed: string; animalClassId: string }>();
  if (needsPets) {
    const petIds = Array.from(new Set(visits.map((v) => v.petId).filter(Boolean)));
    if (petIds.length > 0) {
      const pets = await prisma.pet.findMany({
        where: { id: { in: petIds } },
        select: { id: true, dob: true, breed: true, animalClassId: true },
      });
      petMap = new Map(pets.map((p) => [p.id, { dob: p.dob, breed: p.breed, animalClassId: p.animalClassId }]));
    }
  }

  const valueTotals = new Array(dayWiseData.length).fill(0);
  const valueCounts = new Array(dayWiseData.length).fill(0);
  const animalTypeBreedSetsPerBucket = Array.from({ length: dayWiseData.length }, () => new Set<string>());
  const petAgeMonthsSumPerBucket = new Array(dayWiseData.length).fill(0);
  const petAgeCountPerBucket = new Array(dayWiseData.length).fill(0);
  const diagnosticTypeSetsPerBucket = Array.from({ length: dayWiseData.length }, () => new Set<string>());
  const diagnosticCenterSetsPerBucket = Array.from({ length: dayWiseData.length }, () => new Set<string>());
  const diagnosticStatusSetsPerBucket = Array.from({ length: dayWiseData.length }, () => new Set<string>());

  const now = new Date();

  visits.forEach((visit) => {
    const bucketIndex = findBucketIndex(visit.date, buckets);
    if (bucketIndex < 0) return;

    if (fieldKeys.includes("totalVisitsCount")) dayWiseData[bucketIndex].statistics.totalVisitsCount += 1;
    if (fieldKeys.includes("scheduledVisitsCount") && visit.status === "Scheduled") {
      dayWiseData[bucketIndex].statistics.scheduledVisitsCount += 1;
    }
    if (fieldKeys.includes("inProgressVisitsCount") && visit.status === "In Progress") {
      dayWiseData[bucketIndex].statistics.inProgressVisitsCount += 1;
    }
    if (fieldKeys.includes("completedVisitsCount") && visit.status === "Completed") {
      dayWiseData[bucketIndex].statistics.completedVisitsCount += 1;
    }
    if (fieldKeys.includes("cancelledVisitsCount") && visit.status === "Cancelled") {
      dayWiseData[bucketIndex].statistics.cancelledVisitsCount += 1;
    }
    if (fieldKeys.includes("pendingPaymentsCount") && visit.paymentStatus === "Pending") {
      dayWiseData[bucketIndex].statistics.pendingPaymentsCount += 1;
    }
    if (fieldKeys.includes("completedPaymentsCount") && visit.paymentStatus === "Completed") {
      dayWiseData[bucketIndex].statistics.completedPaymentsCount += 1;
    }
    if (fieldKeys.includes("revenueCollected") && visit.paymentStatus === "Completed") {
      dayWiseData[bucketIndex].statistics.revenueCollected += Number(visit.totalAmount ?? 0);
    }
    if (visit.totalAmount !== null && visit.totalAmount !== undefined) {
      valueTotals[bucketIndex] += Number(visit.totalAmount);
      valueCounts[bucketIndex] += 1;
    }

    // Animal type / breed
    if (fieldKeys.includes("animalTypeBreedsCount") && visit.petId) {
      const pet = petMap.get(visit.petId);
      if (pet) {
        const combo = `${pet.animalClassId}::${pet.breed}`.toLowerCase();
        animalTypeBreedSetsPerBucket[bucketIndex].add(combo);
      }
    }

    // Patient Age
    if (fieldKeys.includes("avgPatientAgeMonths") && visit.petId) {
      const pet = petMap.get(visit.petId);
      if (pet?.dob) {
        const dobDate = new Date(pet.dob);
        const ageMs = now.getTime() - dobDate.getTime();
        const ageMonths = Math.floor(ageMs / (1000 * 60 * 60 * 24 * 30.44));
        petAgeMonthsSumPerBucket[bucketIndex] += ageMonths;
        petAgeCountPerBucket[bucketIndex] += 1;
      }
    }

    // Vaccinations from visit.vaccination JSON (can be array)
    if (needsVaccinations) {
      const vaccList = safeParseJsonArray((visit as any).vaccination);
      if (fieldKeys.includes("vaccinationsCount")) {
        dayWiseData[bucketIndex].statistics.vaccinationsCount += vaccList.length;
      }
    }

    // Prescriptions from visit.prescriptions JSON
    if ((visit as any).prescriptions !== undefined && (visit as any).prescriptions !== null) {
      const rxList = safeParseJsonArray((visit as any).prescriptions);
      if (fieldKeys.includes("prescriptionsCount")) {
        dayWiseData[bucketIndex].statistics.prescriptionsCount += rxList.length;
      }
      rxList.forEach((rx: any) => {
        const rxName = (rx?.name ?? rx?.productName ?? "").toString().toLowerCase();
        if (fieldKeys.includes("fluidTherapyCount") && rxName.includes("fluid")) {
          dayWiseData[bucketIndex].statistics.fluidTherapyCount += 1;
        }
        if (fieldKeys.includes("euthanasiaCount") && rxName.includes("euthanasia")) {
          dayWiseData[bucketIndex].statistics.euthanasiaCount += 1;
        }
      });
    }

    // Diagnostics from visit.diagnostics JSON
    if ((visit as any).diagnostics !== undefined && (visit as any).diagnostics !== null) {
      const diagList = safeParseJsonArray((visit as any).diagnostics);
      if (fieldKeys.includes("diagnosticsCount")) {
        dayWiseData[bucketIndex].statistics.diagnosticsCount += diagList.length;
      }
      diagList.forEach((diag: any) => {
        if (fieldKeys.includes("diagnosticTypesCount") && diag?.type) {
          diagnosticTypeSetsPerBucket[bucketIndex].add(String(diag.type).toLowerCase().trim());
        }
        if (fieldKeys.includes("diagnosticCentersCount") && (diag?.center ?? diag?.diagnosticCenterId ?? diag?.labName)) {
          const center = String(diag.center ?? diag.diagnosticCenterId ?? diag.labName).toLowerCase().trim();
          diagnosticCenterSetsPerBucket[bucketIndex].add(center);
        }
        if (fieldKeys.includes("diagnosticStatusCount") && diag?.status) {
          diagnosticStatusSetsPerBucket[bucketIndex].add(String(diag.status).toLowerCase().trim());
        }
      });
    }
  });

  // Anesthesia sessions (separate collection)
  if (needsAnaesthesia) {
    anesthesiaSessions.forEach((session: any) => {
      const bucketIndex = findBucketIndex(session.createdAt, buckets);
      if (bucketIndex < 0) return;
      dayWiseData[bucketIndex].statistics.anaesthesiaCount += 1;
    });
  }

  // Vaccination status counts from VaccinationStatus collection (linked by visitId)
  if (fieldKeys.includes("vaccinationsDueSoonCount") || fieldKeys.includes("vaccinationsPastDueCount") || fieldKeys.includes("vaccinationsUpToDateCount")) {
    const visitIds = visits.map((v) => v.id);
    if (visitIds.length > 0) {
      const vacStatuses = await prisma.vaccinationStatus.findMany({
        where: {
          visitId: { in: visitIds },
          ...(scope.branchIds.length > 0 ? { businessBranchId: { in: scope.branchIds } } : {}),
        },
        select: { visitId: true, status: true, nextDueDate: true },
      });

      // Map visitId -> bucketIndex
      const visitToBucket = new Map(visits.map((v) => [v.id, findBucketIndex(v.date, buckets)]));

      vacStatuses.forEach((vax) => {
        if (!vax.visitId) return;
        const bucketIndex = visitToBucket.get(vax.visitId) ?? -1;
        if (bucketIndex < 0) return;
        if (fieldKeys.includes("vaccinationsDueSoonCount") && vax.status === "Due Soon") {
          dayWiseData[bucketIndex].statistics.vaccinationsDueSoonCount += 1;
        }
        if (fieldKeys.includes("vaccinationsPastDueCount") && vax.status === "Past Due") {
          dayWiseData[bucketIndex].statistics.vaccinationsPastDueCount += 1;
        }
        if (fieldKeys.includes("vaccinationsUpToDateCount") && vax.status === "On Track") {
          dayWiseData[bucketIndex].statistics.vaccinationsUpToDateCount += 1;
        }
      });
    }
  }

  if (fieldKeys.includes("avgVisitValue")) {
    dayWiseData.forEach((day, index) => {
      const denominator = valueCounts[index];
      day.statistics.avgVisitValue = denominator > 0 ? Number((valueTotals[index] / denominator).toFixed(2)) : 0;
    });
  }

  if (fieldKeys.includes("animalTypeBreedsCount")) {
    dayWiseData.forEach((day, index) => {
      day.statistics.animalTypeBreedsCount = animalTypeBreedSetsPerBucket[index].size;
    });
  }

  if (fieldKeys.includes("avgPatientAgeMonths")) {
    dayWiseData.forEach((day, index) => {
      const count = petAgeCountPerBucket[index];
      day.statistics.avgPatientAgeMonths = count > 0 ? Math.round(petAgeMonthsSumPerBucket[index] / count) : 0;
    });
  }

  if (fieldKeys.includes("diagnosticTypesCount")) {
    dayWiseData.forEach((day, index) => {
      day.statistics.diagnosticTypesCount = diagnosticTypeSetsPerBucket[index].size;
    });
  }

  if (fieldKeys.includes("diagnosticCentersCount")) {
    dayWiseData.forEach((day, index) => {
      day.statistics.diagnosticCentersCount = diagnosticCenterSetsPerBucket[index].size;
    });
  }

  if (fieldKeys.includes("diagnosticStatusCount")) {
    dayWiseData.forEach((day, index) => {
      day.statistics.diagnosticStatusCount = diagnosticStatusSetsPerBucket[index].size;
    });
  }
};

const analyzeLeads = async (
  buckets: TBucket[],
  dayWiseData: TDayData[],
  fieldKeys: string[],
  scope: TScope,
) => {
  const [leadTypes, referredClients] = await Promise.all([
    prisma.leadType.findMany({
      where: {
        ...(scope.branchIds.length > 0 ? { businessBranchId: { in: scope.branchIds } } : {}),
      },
      select: {
        createdAt: true,
        name: true,
        sources: true,
      },
    }),
    prisma.client.findMany({
      where: {
        ...(scope.branchIds.length > 0 ? { businessBranchId: { in: scope.branchIds } } : {}),
        referredBy: { not: null },
      },
      select: {
        createdAt: true,
        firstName: true,
        lastName: true,
      },
    }),
  ]);

  const sourceSets = new Map<number, Set<string>>();
  const leadNameSets = new Map<number, Set<string>>();

  leadTypes.forEach((leadType) => {
    const bucketIndex = findBucketIndex(leadType.createdAt, buckets);
    if (bucketIndex < 0) return;

    // All Leads (treating each lead type entry as one "lead" record)
    if (fieldKeys.includes("allLeadsCount")) {
      dayWiseData[bucketIndex].statistics.allLeadsCount += 1;
    }
    if (fieldKeys.includes("leadTypesConfiguredCount")) {
      dayWiseData[bucketIndex].statistics.leadTypesConfiguredCount += 1;
    }
    // Active lead types count (same as all since LeadType has no active flag)
    if (fieldKeys.includes("activeLeadTypesCount")) {
      dayWiseData[bucketIndex].statistics.activeLeadTypesCount += 1;
    }

    // Distinct lead type names
    if (!leadNameSets.has(bucketIndex)) leadNameSets.set(bucketIndex, new Set());
    if (leadType.name?.trim()) leadNameSets.get(bucketIndex)?.add(leadType.name.trim().toLowerCase());

    if (!sourceSets.has(bucketIndex)) sourceSets.set(bucketIndex, new Set());
    leadType.sources.forEach((source) => {
      if (source.trim()) sourceSets.get(bucketIndex)?.add(source.trim().toLowerCase());
    });
  });

  referredClients.forEach((client) => {
    const bucketIndex = findBucketIndex(client.createdAt, buckets);
    if (bucketIndex < 0) return;
    if (fieldKeys.includes("referredClientsCount")) {
      dayWiseData[bucketIndex].statistics.referredClientsCount += 1;
    }
    // Customer Name = count of distinct clients with a lead/referral
    if (fieldKeys.includes("customerWithLeadCount")) {
      dayWiseData[bucketIndex].statistics.customerWithLeadCount += 1;
    }
  });

  if (fieldKeys.includes("distinctLeadSourcesConfiguredCount")) {
    dayWiseData.forEach((day, index) => {
      day.statistics.distinctLeadSourcesConfiguredCount = sourceSets.get(index)?.size ?? 0;
    });
  }

  if (fieldKeys.includes("leadTypeDistinctCount")) {
    dayWiseData.forEach((day, index) => {
      day.statistics.leadTypeDistinctCount = leadNameSets.get(index)?.size ?? 0;
    });
  }
};

const ANALYZERS: Record<ReportType, typeof analyzeAppointments> = {
  appointments: analyzeAppointments,
  admin: analyzeAdmin,
  client_and_patient: analyzeClientAndPatient,
  inventory: analyzeInventory,
  communication: analyzeCommunication,
  visits: analyzeVisits,
  leads: analyzeLeads,
};

const getFieldCatalog = (type?: ReportType) => {
  if (type) return REPORT_TYPE_DEFINITIONS[type];
  return {
    types: Object.values(REPORT_TYPE_DEFINITIONS),
  };
};

const generateReportData = async (input: TReportDataInput): Promise<TReportDataOutput> => {
  const frequency = input.frequency ?? "day";
  const buckets = createBuckets(input.startDate, input.endDate, frequency);
  if (buckets.length === 0) {
    return {
      type: input.type,
      frequency,
      fields: normalizeRequestedFields(input.type, input.fields),
      dayWiseData: [],
      totals: {},
    };
  }

  const selectedFields = normalizeRequestedFields(input.type, input.fields);
  const fieldKeys = selectedFields.map((field) => field.key);
  const dayWiseData = initDayWiseData(buckets, fieldKeys);
  const scope = await resolveScope(input);

  await ANALYZERS[input.type](buckets, dayWiseData, fieldKeys, scope);

  return {
    type: input.type,
    frequency,
    fields: selectedFields,
    dayWiseData,
    totals: buildTotals(dayWiseData, fieldKeys),
  };
};

const reportAnalytics = {
  getFieldCatalog,
  generateReportData,
};

export default reportAnalytics;
