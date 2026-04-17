// @ts-nocheck
import express from 'express';
import validateRequest from '../../middleware/validateRequest.js';
import staffScheduleController from './staffSchedule.controller.js';
import staffScheduleValidator from './staffSchedule.validator.js';

const staffScheduleRouter = express.Router();

// Create staff schedules in bulk
staffScheduleRouter.post(
  '/bulk',
  validateRequest(staffScheduleValidator.createBulkStaffScheduleSchema),
  staffScheduleController.createBulkStaffSchedule
);

// Create staff schedule
staffScheduleRouter.post(
  '/',
  validateRequest(staffScheduleValidator.createStaffScheduleSchema),
  staffScheduleController.createStaffSchedule
);

// Get schedules by date range
staffScheduleRouter.get(
  '/range/:startDate/:endDate',
  validateRequest(staffScheduleValidator.dateRangeSchema),
  staffScheduleController.getStaffSchedulesByDateRange
);

// Get schedules by staff and date range
// staffScheduleRouter.get(
//   '/staff/:staffId/range/:startDate/:endDate',
//   validateRequest(staffScheduleValidator.staffDateRangeSchema),
//   staffScheduleController.getStaffSchedulesByStaffAndDateRange
// );

// Get schedules by group and date range
staffScheduleRouter.get(
  '/group/:groupId/range/:startDate/:endDate',
  validateRequest(staffScheduleValidator.groupDateRangeSchema),
  staffScheduleController.getStaffSchedulesByGroupAndDateRange
);

// Update/reschedule schedule
staffScheduleRouter.put(
  '/:id/reschedule',
  validateRequest(staffScheduleValidator.updateStaffScheduleSchema),
  staffScheduleController.updateStaffSchedule
);

// Delete schedule
staffScheduleRouter.delete(
  '/:id',
  validateRequest(staffScheduleValidator.deleteStaffScheduleSchema),
  staffScheduleController.deleteStaffSchedule
);

export default staffScheduleRouter;
