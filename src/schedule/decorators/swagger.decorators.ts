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
  summary: 'Add a new schedule interval',
  description: 'Creates a new interval (WORK or BREAK) for a specific day of the week.'
};

const CreateScheduleBody = {
  type: CreateScheduleDto,
  description: 'Interval details to create',
  examples: {
    work: {
      summary: 'WORK interval',
      value: {
        dayOfWeek: 'MONDAY',
        startTime: '08:00',
        endTime: '10:00',
        eventType: 'WORK'
      }
    },
    break: {
      summary: 'BREAK interval',
      value: {
        dayOfWeek: 'MONDAY',
        startTime: '10:00',
        endTime: '10:30',
        eventType: 'BREAK'
      }
    }
  }
};

// Update Schedule
const UpdateScheduleOperation = {
  summary: 'Update a schedule interval',
  description: 'Updates an existing schedule interval with the provided data.'
};

const UpdateScheduleBody = {
  type: UpdateScheduleDto,
  description: 'Interval data to update',
  examples: {
    timeChange: {
      summary: 'Update time range',
      value: {
        startTime: '09',
        endTime: '11'
      }
    },
    changeType: {
      summary: 'Change event type',
      value: {
        eventType: 'BREAK'
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
      description: 'Bad request - Invalid time range' 
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

export function ApiToggleDayOff() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Toggle day off for a schedule',
      description: 'Toggles the isDayOff flag for a specific day.'
    }),
    ApiBody({
      description: 'Day of week to toggle for the user (ID is userId)',
      schema: {
        type: 'object',
        properties: {
          dayOfWeek: { type: 'string', enum: Object.keys(DayOfWeek), example: 'MONDAY' }
        },
        required: ['dayOfWeek']
      }
    }),
    ApiResponse({ status: 200, description: 'Day off toggled' })
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
      description: 'Bad request - Invalid time range' 
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
