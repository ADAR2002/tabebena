import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiParam, 
  ApiBearerAuth
} from '@nestjs/swagger';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import { ScheduleResponseDto } from '../dto/schedule-response.dto';
import { DayOfWeek } from '@prisma/client';

// Create Schedule
const CreateScheduleOperation = {
  summary: 'Add a new schedule day',
  description: 'Creates a new doctor schedule for a specific day of the week.'
};

const CreateScheduleBody = {
  type: CreateScheduleDto,
  description: 'Schedule details to create',
  examples: {
    basic: {
      summary: 'Basic schedule',
      value: {
        dayOfWeek: 'MONDAY',
        startTime: '09:00',
        endTime: '17:00',
        slotDuration: 30,
        isActive: true
      }
    },
    halfDay: {
      summary: 'Half day schedule',
      value: {
        dayOfWeek: 'SATURDAY',
        startTime: '09:00',
        endTime: '13:00',
        slotDuration: 20,
        isActive: true
      }
    }
  }
};

// Update Schedule
const UpdateScheduleOperation = {
  summary: 'Update a schedule day',
  description: 'Updates an existing doctor schedule with the provided data.'
};

const UpdateScheduleBody = {
  type: UpdateScheduleDto,
  description: 'Schedule data to update',
  examples: {
    timeChange: {
      summary: 'Update time range',
      value: {
        startTime: '08:00',
        endTime: '16:00'
      }
    },
    slotDuration: {
      summary: 'Update slot duration',
      value: {
        slotDuration: 15
      }
    },
    deactivate: {
      summary: 'Deactivate schedule',
      value: {
        isActive: false
      }
    }
  }
};

// Common Params
const ScheduleIdParam = {
  name: 'id',
  required: true,
  description: 'The ID of the schedule',
  example: '123e4567-e89b-12d3-a456-426614174000'
};

const DayOfWeekParam = {
  name: 'dayOfWeek',
  required: true,
  description: 'Day of the week',
  enum: DayOfWeek,
  example: 'MONDAY'
};

// Decorator Functions
export function ApiCreateSchedule() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation(CreateScheduleOperation),
    ApiBody(CreateScheduleBody),
    ApiResponse({ 
      status: 201, 
      description: 'Schedule created successfully', 
      type: ScheduleResponseDto 
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Bad request - Invalid time range or slot duration' 
    }),
    ApiResponse({ 
      status: 409, 
      description: 'Conflict - Schedule for this day already exists' 
    })
  );
}

export function ApiFindAllSchedules() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Get all schedule days',
      description: 'Retrieves all doctor schedules for the authenticated user.'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'List of all schedules', 
      type: [ScheduleResponseDto] 
    })
  );
}

export function ApiFindScheduleById() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Get schedule by ID',
      description: 'Retrieves a specific schedule by its unique identifier.'
    }),
    ApiParam(ScheduleIdParam),
    ApiResponse({ 
      status: 200, 
      description: 'Schedule details', 
      type: ScheduleResponseDto 
    }),
    ApiResponse({ 
      status: 404, 
      description: 'Schedule not found' 
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Invalid ID format' 
    })
  );
}

export function ApiFindSchedulesByDay() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Get schedules by day of week',
      description: 'Retrieves all active schedules for a specific day of the week.'
    }),
    ApiParam(DayOfWeekParam),
    ApiResponse({ 
      status: 200, 
      description: 'Schedules for the specified day', 
      type: [ScheduleResponseDto] 
    })
  );
}

export function ApiUpdateSchedule() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation(UpdateScheduleOperation),
    ApiParam(ScheduleIdParam),
    ApiBody(UpdateScheduleBody),
    ApiResponse({ 
      status: 200, 
      description: 'Schedule updated successfully', 
      type: ScheduleResponseDto 
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Bad request - Invalid time range or slot duration' 
    }),
    ApiResponse({ 
      status: 404, 
      description: 'Schedule not found' 
    }),
    ApiResponse({ 
      status: 409, 
      description: 'Conflict - Schedule for this day already exists' 
    })
  );
}

export function ApiDeleteSchedule() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Delete a schedule day',
      description: 'Deletes a specific schedule by its ID.'
    }),
    ApiParam(ScheduleIdParam),
    ApiResponse({ 
      status: 200, 
      description: 'Schedule deleted successfully' 
    }),
    ApiResponse({ 
      status: 404, 
      description: 'Schedule not found' 
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Invalid ID format' 
    })
  );
}
