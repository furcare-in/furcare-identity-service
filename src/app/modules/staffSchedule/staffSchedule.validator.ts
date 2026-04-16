import { z } from 'zod';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const createStaffScheduleSchema = z.object({
  body: z.object({
    groupId: z.string({
      required_error: 'Group ID is required'
    }),
    staffId: z.string().optional(),
    date: z.string({
      required_error: 'Date is required'
    }),
    startTime: z.string({
      required_error: 'Start time is required'
    }),
    endTime: z.string({
      required_error: 'End time is required'
    }),
    appointmentType: z.enum(['Regular', 'Virtual'], {
      required_error: 'Appointment type must be either Regular or Virtual'
    }),
    departmentId: z.string().optional(),
    recurrence: z.enum(['Does not repeat', 'Every weekday'], {
      required_error: 'Recurrence must be either "Does not repeat" or "Every weekday"'
    }),
    overrideExisting: z.boolean().optional()
  })
});

const createBulkStaffScheduleSchema = z.object({
  body: z.object({
    groupId: z.string({
      required_error: 'Group ID is required'
    }),
    staffIds: z.array(
      z.string({
        required_error: 'Staff ID is required'
      })
    ).min(1, 'At least one staff ID is required'),
    dates: z.array(
      z.string({
        required_error: 'Date is required'
      }).regex(DATE_PATTERN, 'Date must be in yyyy-MM-dd format')
    ).min(1, 'At least one date is required'),
    slots: z.array(
      z.object({
        startTime: z.string({
          required_error: 'Start time is required'
        }).regex(TIME_PATTERN, 'Start time must be in HH:mm format'),
        endTime: z.string({
          required_error: 'End time is required'
        }).regex(TIME_PATTERN, 'End time must be in HH:mm format'),
        departmentId: z.string().nullable().optional(),
      })
    ).min(1, 'At least one time slot is required'),
    appointmentType: z.enum(['Regular', 'Virtual'], {
      required_error: 'Appointment type must be either Regular or Virtual'
    }),
    recurrence: z.enum(['Does not repeat', 'Every weekday'], {
      required_error: 'Recurrence must be either "Does not repeat" or "Every weekday"'
    }),
    overrideExisting: z.boolean().optional()
  })
});

const updateStaffScheduleSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "Schedule ID is required",
    }),
  }),
  body: z.object({
    date: z.string({
      required_error: "Date is required",
    }),
    startTime: z.string({
      required_error: "Start time is required",
    }),
    endTime: z.string({
      required_error: "End time is required",
    }),
    appointmentType: z.enum(["Regular", "Virtual"], {
      required_error: "Appointment type must be either Regular or Virtual",
    }),
    departmentId: z.string().optional(),
    staffId: z.string().optional(),
  }),
});

const deleteStaffScheduleSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "Schedule ID is required",
    }),
  }),
});

const dateRangeSchema = z.object({
  params: z.object({
    startDate: z.string({
      required_error: 'Start date is required'
    }),
    endDate: z.string({
      required_error: 'End date is required'
    })
  })
});

// const staffDateRangeSchema = dateRangeSchema.extend({
//   params: z.object({
//     staffId: z.string({
//       required_error: 'Staff ID is required'
//     }),
//     startDate: z.string({
//       required_error: 'Start date is required'
//     }),
//     endDate: z.string({
//       required_error: 'End date is required'
//     })
//   })
// });

const groupDateRangeSchema = dateRangeSchema.extend({
  params: z.object({
    groupId: z.string({
      required_error: 'Group ID is required'
    }),
    startDate: z.string({
      required_error: 'Start date is required'
    }),
    endDate: z.string({
      required_error: 'End date is required'
    })
  })
});

const staffScheduleValidator = {
  createStaffScheduleSchema,
  createBulkStaffScheduleSchema,
  updateStaffScheduleSchema,
  deleteStaffScheduleSchema,
  dateRangeSchema,
//   staffDateRangeSchema,
  groupDateRangeSchema
};

export default staffScheduleValidator;
