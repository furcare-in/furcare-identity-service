// @ts-nocheck
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError.js";
import prisma from "../../../utils/prisma.js";
import pkg from "@prisma/client";
const { AppointmentType,
  Prisma,
  RecurrenceType, } = pkg;

type CreateStaffScheduleInput = {
  groupId: string;
  departmentId?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  appointmentType: string;
  recurrence: string;
  staffId?: string | null;
  overrideExisting?: boolean;
};

type BulkSlotInput = {
  startTime: string;
  endTime: string;
  departmentId?: string | null;
};

type CreateBulkStaffSchedulesInput = {
  groupId: string;
  staffIds: string[];
  dates: string[];
  slots: BulkSlotInput[];
  appointmentType: string;
  recurrence: string;
  overrideExisting?: boolean;
};

type TimeWindow = {
  start: number;
  end: number;
};

type ExistingInterval = TimeWindow & {
  id: string;
};

const MAX_STAFF_IDS = 300;
const MAX_DATES = 31;
const MAX_SLOTS = 24;
const MAX_EXPANDED_ROWS = 5000;
const CREATE_MANY_CHUNK_SIZE = 500;

const normalizeEnumValues = (data: {
  appointmentType: string;
  recurrence: string;
}) => {
  const appointmentType: AppointmentType =
    data.appointmentType === "Regular"
      ? AppointmentType.Regular
      : AppointmentType.Virtual;
  const recurrence: RecurrenceType =
    data.recurrence === "Does not repeat"
      ? RecurrenceType.DoesNotRepeat
      : RecurrenceType.EveryWeekday;
  return { appointmentType, recurrence };
};

const timeToMinutes = (value: string) => {
  const [hoursRaw, minutesRaw] = value.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }
  return hours * 60 + minutes;
};

const toTimeWindow = (startTime: string, endTime: string): TimeWindow | null => {
  const startValue = timeToMinutes(startTime);
  const endValue = timeToMinutes(endTime);
  if (startValue == null || endValue == null) return null;
  if (startValue === endValue) return null;
  return endValue > startValue
    ? { start: startValue, end: endValue }
    : { start: startValue, end: endValue + 24 * 60 };
};

const hasTimeOverlap = (left: TimeWindow, right: TimeWindow) => {
  return left.start < right.end && right.start < left.end;
};

const getBucketKey = (staffId: string, date: string) => `${staffId}|${date}`;

const createStaffSchedule = async (data: CreateStaffScheduleInput) => {
  const { appointmentType, recurrence } = normalizeEnumValues(data);

  // Check if group exists and is active
  const group = await prisma.group.findFirst({
    where: { id: Number(data.groupId) },
  });
  // if (!group) {
  //   throw new Error("Group not found or inactive");
  // }
  void group;

  const timeOverlapFilter = {
    OR: [
      {
        AND: [
          { startTime: { lte: data.startTime } },
          { endTime: { gt: data.startTime } },
        ],
      },
      {
        AND: [
          { startTime: { lt: data.endTime } },
          { endTime: { gte: data.endTime } },
        ],
      },
    ],
  };

  const conflictFilter = data.staffId
    ? {
        active: true,
        date: data.date,
        staffId: data.staffId,
        ...timeOverlapFilter,
      }
    : {
        active: true,
        groupId: data.groupId,
        date: data.date,
        staffId: null,
        ...timeOverlapFilter,
      };

  const existingConflicts = await prisma.staffSchedule.findMany({
    where: conflictFilter,
    select: { id: true },
  });

  if (existingConflicts.length > 0 && !data.overrideExisting) {
    throw new Error("Schedule already exists for the selected time");
  }

  if (existingConflicts.length > 0 && data.overrideExisting) {
    await prisma.staffSchedule.updateMany({
      where: {
        id: {
          in: existingConflicts.map((schedule) => schedule.id),
        },
      },
      data: {
        active: false,
      },
    });
  }

  return await prisma.staffSchedule.create({
    data: {
      groupId: data.groupId,
      departmentId: data.departmentId || null,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      staffId: data.staffId,
      appointmentType,
      recurrence,
    },
    include: {
      Group: true,
    },
  });
};

const createBulkStaffSchedules = async (
  data: CreateBulkStaffSchedulesInput
) => {
  const startedAt = Date.now();
  const overrideExisting = data.overrideExisting !== false;
  const { appointmentType, recurrence } = normalizeEnumValues(data);

  const uniqueStaffIds = Array.from(
    new Set((data.staffIds || []).map((id) => id?.trim()).filter(Boolean))
  ) as string[];
  const uniqueDates = Array.from(
    new Set((data.dates || []).map((date) => date?.trim()).filter(Boolean))
  ) as string[];
  const normalizedSlots = (data.slots || [])
    .map((slot) => ({
      startTime: slot.startTime?.trim(),
      endTime: slot.endTime?.trim(),
      departmentId: slot.departmentId || null,
    }))
    .filter((slot) => slot.startTime && slot.endTime) as Array<{
    startTime: string;
    endTime: string;
    departmentId: string | null;
  }>;

  if (uniqueStaffIds.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "At least one staff ID is required");
  }
  if (uniqueDates.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "At least one date is required");
  }
  if (normalizedSlots.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "At least one slot is required");
  }

  if (uniqueStaffIds.length > MAX_STAFF_IDS) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Too many staff IDs. Maximum supported is ${MAX_STAFF_IDS}`
    );
  }
  if (uniqueDates.length > MAX_DATES) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Too many dates. Maximum supported is ${MAX_DATES}`
    );
  }
  if (normalizedSlots.length > MAX_SLOTS) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Too many slots. Maximum supported is ${MAX_SLOTS}`
    );
  }

  const requestedCount =
    uniqueStaffIds.length * uniqueDates.length * normalizedSlots.length;
  if (requestedCount > MAX_EXPANDED_ROWS) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Too many schedules requested (${requestedCount}). Maximum supported is ${MAX_EXPANDED_ROWS}`
    );
  }

  const dedupeKeys = new Set<string>();
  const candidates: Array<{
    groupId: string;
    staffId: string;
    date: string;
    startTime: string;
    endTime: string;
    departmentId: string | null;
  }> = [];

  for (const staffId of uniqueStaffIds) {
    for (const date of uniqueDates) {
      for (const slot of normalizedSlots) {
        const window = toTimeWindow(slot.startTime, slot.endTime);
        if (!window) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            `Invalid time range ${slot.startTime} - ${slot.endTime}`
          );
        }
        const key = `${staffId}|${date}|${slot.startTime}|${slot.endTime}|${
          slot.departmentId || ""
        }`;
        if (dedupeKeys.has(key)) continue;
        dedupeKeys.add(key);
        candidates.push({
          groupId: data.groupId,
          staffId,
          date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          departmentId: slot.departmentId,
        });
      }
    }
  }

  const dedupedCount = candidates.length;
  if (dedupedCount === 0) {
    return {
      requestedCount,
      dedupedCount: 0,
      overriddenCount: 0,
      createdCount: 0,
      conflictCount: 0,
      failedCount: 0,
      durationMs: Date.now() - startedAt,
    };
  }

  const existingSchedules = await prisma.staffSchedule.findMany({
    where: {
      active: true,
      staffId: { in: uniqueStaffIds },
      date: { in: uniqueDates },
    },
    select: {
      id: true,
      staffId: true,
      date: true,
      startTime: true,
      endTime: true,
    },
  });

  const existingByBucket = new Map<string, ExistingInterval[]>();
  for (const schedule of existingSchedules) {
    if (!schedule.staffId) continue;
    const window = toTimeWindow(schedule.startTime, schedule.endTime);
    if (!window) continue;
    const bucketKey = getBucketKey(schedule.staffId, schedule.date);
    const values = existingByBucket.get(bucketKey) || [];
    values.push({ id: schedule.id, ...window });
    existingByBucket.set(bucketKey, values);
  }

  const plannedByBucket = new Map<string, TimeWindow[]>();
  const idsToDeactivate = new Set<string>();
  const rowsToCreate: Prisma.StaffScheduleCreateManyInput[] = [];
  let conflictCount = 0;

  for (const candidate of candidates) {
    const candidateWindow = toTimeWindow(candidate.startTime, candidate.endTime);
    if (!candidateWindow) {
      conflictCount += 1;
      continue;
    }
    const bucketKey = getBucketKey(candidate.staffId, candidate.date);
    const existingIntervals = existingByBucket.get(bucketKey) || [];
    const overlappingExisting = existingIntervals.filter((interval) =>
      hasTimeOverlap(candidateWindow, interval)
    );

    const plannedIntervals = plannedByBucket.get(bucketKey) || [];
    const overlapsPlanned = plannedIntervals.some((interval) =>
      hasTimeOverlap(candidateWindow, interval)
    );

    if (overlapsPlanned) {
      conflictCount += 1;
      continue;
    }

    if (overlappingExisting.length > 0 && !overrideExisting) {
      conflictCount += 1;
      continue;
    }

    if (overlappingExisting.length > 0 && overrideExisting) {
      overlappingExisting.forEach((interval) => idsToDeactivate.add(interval.id));
    }

    plannedIntervals.push(candidateWindow);
    plannedByBucket.set(bucketKey, plannedIntervals);

    rowsToCreate.push({
      groupId: candidate.groupId,
      departmentId: candidate.departmentId,
      date: candidate.date,
      startTime: candidate.startTime,
      endTime: candidate.endTime,
      appointmentType,
      recurrence,
      staffId: candidate.staffId,
    });
  }

  let overriddenCount = 0;
  let createdCount = 0;

  await prisma.$transaction(async (tx) => {
    if (overrideExisting && idsToDeactivate.size > 0) {
      const deactivateResult = await tx.staffSchedule.updateMany({
        where: {
          id: { in: Array.from(idsToDeactivate) },
          active: true,
        },
        data: { active: false },
      });
      overriddenCount = deactivateResult.count;
    }

    if (rowsToCreate.length === 0) return;

    for (let i = 0; i < rowsToCreate.length; i += CREATE_MANY_CHUNK_SIZE) {
      const chunk = rowsToCreate.slice(i, i + CREATE_MANY_CHUNK_SIZE);
      const createResult = await tx.staffSchedule.createMany({
        data: chunk,
      });
      createdCount += createResult.count;
    }
  });

  const failedCount = Math.max(0, dedupedCount - conflictCount - createdCount);

  return {
    requestedCount,
    dedupedCount,
    overriddenCount,
    createdCount,
    conflictCount,
    failedCount,
    durationMs: Date.now() - startedAt,
  };
};

const getStaffSchedulesByDateRange = async (startDate: string, endDate: string) => {
  return await prisma.staffSchedule.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
      active: true,
    },
    include: {
      Group: true,
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
};

// const getStaffSchedulesByStaffAndDateRange = async (
//   staffId: string,
//   startDate: string,
//   endDate: string
// ) => {
//   return await prisma.staffSchedule.findMany({
//     where: {
//       staffId,
//       date: {
//         gte: startDate,
//         lte: endDate
//       },
//       active: true
//     },
//     include: {
//       Staff: true,
//       Group: true
//     },
//     orderBy: [
//       { date: 'asc' },
//       { startTime: 'asc' }
//     ]
//   });
// };

const getStaffSchedulesByGroupAndDateRange = async (
  groupId: string,
  startDate: string,
  endDate: string
) => {
  return await prisma.staffSchedule.findMany({
    where: {
      groupId,
      date: {
        gte: startDate,
        lte: endDate,
      },
      active: true,
    },
    include: {
      Staff: true,
      Group: true,
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
};

const updateStaffSchedule = async (
  id: string,
  data: {
    date: string;
    startTime: string;
    endTime: string;
    appointmentType: string;
    staffId?: string;
    departmentId?: string;
  }
) => {
  const appointmentType =
    data.appointmentType === "Regular" ? "Regular" : "Virtual";

  return await prisma.staffSchedule.update({
    where: { id: Number(id) },
    data: {
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      appointmentType,
      staffId: data.staffId,
      departmentId: data.departmentId,
    } as any,
    include: {
      Group: true,
      Staff: true,
    },
  });
};

const deleteStaffSchedule = async (id: string) => {
  // Soft delete so existing queries filtering active:true remain consistent
  return await prisma.staffSchedule.update({
    where: { id: Number(id) },
    data: { active: false },
  });
};

const staffScheduleService = {
  createStaffSchedule,
  createBulkStaffSchedules,
  getStaffSchedulesByDateRange,
  // getStaffSchedulesByStaffAndDateRange,
  getStaffSchedulesByGroupAndDateRange,
  updateStaffSchedule,
  deleteStaffSchedule,
};

export default staffScheduleService;
