// @ts-nocheck
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync.js';
import staffScheduleService from './staffSchedule.service.js';

const createStaffSchedule = catchAsync(async (req: Request, res: Response) => {
  const scheduleData = {
    groupId: req.body.groupId,
    departmentId: req.body.departmentId || null,
    date: req.body.date,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    appointmentType: req.body.appointmentType,
    recurrence: req.body.recurrence,
    staffId: req.body.staffId || null,
    overrideExisting: req.body.overrideExisting === true
  };

  const result = await staffScheduleService.createStaffSchedule(scheduleData);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Staff schedule created successfully',
    data: result
  });
});

const createBulkStaffSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await staffScheduleService.createBulkStaffSchedules({
    groupId: req.body.groupId,
    staffIds: Array.isArray(req.body.staffIds) ? req.body.staffIds : [],
    dates: Array.isArray(req.body.dates) ? req.body.dates : [],
    slots: Array.isArray(req.body.slots) ? req.body.slots : [],
    appointmentType: req.body.appointmentType,
    recurrence: req.body.recurrence,
    overrideExisting: req.body.overrideExisting !== false,
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Staff schedules created successfully',
    data: result,
  });
});

const getStaffSchedulesByDateRange = catchAsync(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.params;
  const result = await staffScheduleService.getStaffSchedulesByDateRange(startDate, endDate);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Staff schedules fetched successfully',
    data: result
  });
});

// const getStaffSchedulesByStaffAndDateRange = catchAsync(async (req: Request, res: Response) => {
//   const { staffId, startDate, endDate } = req.params;
//   const result = await staffScheduleService.getStaffSchedulesByStaffAndDateRange(
//     staffId,
//     startDate,
//     endDate
//   );

//   res.status(httpStatus.OK).json({
//     success: true,
//     message: 'Staff schedules fetched successfully',
//     data: result
//   });
// });

const getStaffSchedulesByGroupAndDateRange = catchAsync(async (req: Request, res: Response) => {
  const { groupId, startDate, endDate } = req.params;
  const result = await staffScheduleService.getStaffSchedulesByGroupAndDateRange(
    groupId,
    startDate,
    endDate
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Staff schedules fetched successfully',
    data: result
  });
});

const updateStaffSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await staffScheduleService.updateStaffSchedule(id, req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Staff schedule updated successfully",
    data: result,
  });
});

const deleteStaffSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await staffScheduleService.deleteStaffSchedule(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Staff schedule deleted successfully",
    data: null,
  });
});

const staffScheduleController = {
  createStaffSchedule,
  createBulkStaffSchedule,
  getStaffSchedulesByDateRange,
//   getStaffSchedulesByStaffAndDateRange,
  getStaffSchedulesByGroupAndDateRange,
  updateStaffSchedule,
  deleteStaffSchedule,
};

export default staffScheduleController;
