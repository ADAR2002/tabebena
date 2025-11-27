import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiParam, 
  ApiQuery,
  ApiBearerAuth
} from '@nestjs/swagger';
import { CreateVisitDto } from '../dto/create-visit.dto';
import { UpdateVisitDto } from '../dto/update-visit.dto';
import { VisitResponseDto } from '../dto/visit-response.dto';

// Create Visit
const CreateVisitOperation = {
  summary: 'Create a new visit',
  description: 'Creates a new medical visit record for a patient.'
};

const CreateVisitBody = {
  type: CreateVisitDto,
  description: 'Visit details to create',
  examples: {
    basic: {
      summary: 'Basic visit',
      value: {
        patientId: '123e4567-e89b-12d3-a456-426614174000',
        visitDate: '2023-01-01T10:00:00.000Z',
        reason: 'Routine checkup',
        consultationFee: 100.50
      }
    },
    full: {
      summary: 'Full visit details',
      value: {
        patientId: '123e4567-e89b-12d3-a456-426614174000',
        visitDate: '2023-01-01T10:00:00.000Z',
        reason: 'Annual physical examination',
        diagnosis: 'Hypertension stage 1',
        treatment: 'Lifestyle modifications and follow up in 3 months',
        prescription: 'Lisinopril 10mg once daily',
        vitalSigns: 'BP: 145/90, HR: 78',
        notes: 'Patient to monitor blood pressure at home',
        consultationFee: 150.00,
        paidAmount: 150.00
      }
    }
  }
};

// Update Visit
const UpdateVisitOperation = {
  summary: 'Update a visit',
  description: 'Updates an existing visit with the provided data.'
};

const UpdateVisitBody = {
  type: UpdateVisitDto,
  description: 'Visit data to update',
  examples: {
    diagnosis: {
      summary: 'Update diagnosis',
      value: {
        diagnosis: 'Hypertension stage 1',
        treatment: 'Prescribed medication',
        notes: 'Patient to return in 2 weeks for follow-up'
      }
    },
    payment: {
      summary: 'Update payment',
      value: {
        paidAmount: 150.00
      }
    }
  }
};

// Common Params
const VisitIdParam = {
  name: 'id',
  required: true,
  description: 'The ID of the visit',
  example: '123e4567-e89b-12d3-a456-426614174000'
};

const PatientIdParam = {
  name: 'patientId',
  required: true,
  description: 'The ID of the patient',
  example: '123e4567-e89b-12d3-a456-426614174000'
};

// Decorator Functions
export function ApiCreateVisit() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation(CreateVisitOperation),
    ApiBody(CreateVisitBody),
    ApiResponse({ 
      status: 201, 
      description: 'Visit created successfully', 
      type: VisitResponseDto 
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Bad request - Invalid input data' 
    }),
    ApiResponse({ 
      status: 404, 
      description: 'Patient not found' 
    })
  );
}

export function ApiFindAllVisits() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ 
      summary: 'Get all visits or filter by patient ID',
      description: 'Retrieves a list of visits. Can be filtered by patient ID.'
    }),
    ApiQuery({
      name: 'patientId',
      required: false,
      description: 'Filter visits by patient ID',
      example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'List of visits', 
      type: [VisitResponseDto] 
    })
  );
}

export function ApiFindVisitById() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ 
      summary: 'Get a visit by ID',
      description: 'Retrieves a specific visit by its unique identifier.'
    }),
    ApiParam(VisitIdParam),
    ApiResponse({ 
      status: 200, 
      description: 'Visit found', 
      type: VisitResponseDto 
    }),
    ApiResponse({ 
      status: 404, 
      description: 'Visit not found' 
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Invalid ID format' 
    })
  );
}

export function ApiGetPatientVisits() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ 
      summary: 'Get all visits for a specific patient',
      description: 'Retrieves all visits associated with a specific patient.'
    }),
    ApiParam(PatientIdParam),
    ApiResponse({ 
      status: 200, 
      description: 'List of patient visits', 
      type: [VisitResponseDto] 
    }),
    ApiResponse({ 
      status: 404, 
      description: 'Patient not found' 
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Invalid patient ID format' 
    })
  );
}

export function ApiUpdateVisit() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation(UpdateVisitOperation),
    ApiParam(VisitIdParam),
    ApiBody(UpdateVisitBody),
    ApiResponse({ 
      status: 200, 
      description: 'Visit updated successfully', 
      type: VisitResponseDto 
    }),
    ApiResponse({ 
      status: 404, 
      description: 'Visit not found' 
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Invalid input data' 
    })
  );
}

export function ApiDeleteVisit() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ 
      summary: 'Delete a visit',
      description: 'Deletes a specific visit by its ID.'
    }),
    ApiParam(VisitIdParam),
    ApiResponse({ 
      status: 204, 
      description: 'Visit deleted successfully' 
    }),
    ApiResponse({ 
      status: 404, 
      description: 'Visit not found' 
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Invalid ID format' 
    })
  );
}
