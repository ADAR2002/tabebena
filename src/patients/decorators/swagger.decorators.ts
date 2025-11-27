import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { Patient } from '../entities/patient.entity';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

// Controller Decorators
export function ApiPatientController() {
  return applyDecorators(
    ApiTags('المرضى - Patients'),
    ApiBearerAuth(),
  );
}

// Create Patient Decorators
export function ApiCreatePatient() {
  return applyDecorators(
    ApiOperation({
      summary: 'إنشاء مريض جديد',
      description: 'تسجيل بيانات مريض جديد في النظام',
    }),
    ApiResponse({ 
      status: 201, 
      description: 'تم إنشاء المريض بنجاح',
      type: Patient 
    }),
    ApiResponse({ 
      status: 400, 
      description: 'بيانات غير صالحة',
      schema: {
        example: {
          statusCode: 400,
          message: ['error message'],
          error: 'Bad Request'
        }
      }
    }),
    ApiBody({ 
      type: CreatePatientDto,
      examples: {
        basic: {
          summary: 'مثال بسيط',
          value: {
            fullName: 'أحمد محمد',
            dateOfBirth: '1990-01-01',
            gender: 'MALE',
            phone: '0512345678',
            bloodType: 'A_POSITIVE',
            allergies: 'لا يوجد',
            medicalHistory: 'لا يوجد'
          }
        }
      }
    }),
  );
}

// Find All Patients Decorators
export function ApiFindAllPatients() {
  return applyDecorators(
    ApiOperation({
      summary: 'عرض قائمة المرضى',
      description: 'استرجاع قائمة المرضى مع الترقيم',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'رقم الصفحة',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      example: 10,
      description: 'عدد العناصر في الصفحة',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'بحث بالاسم أو رقم الهاتف',
    }),
    ApiResponse({ 
      status: 200, 
      description: 'تم استرجاع البيانات بنجاح',
      schema: {
        example: {
          data: [
            {
              id: '550e8400-e29b-41d4-a716-446655440000',
              fullName: 'أحمد محمد',
              phone: '0512345678',
              // ... other patient fields
            }
          ],
          meta: {
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1
          }
        }
      }
    }),
  );
}

// Search Patients Decorators
export function ApiSearchPatients() {
  return applyDecorators(
    ApiOperation({
      summary: 'بحث عن المرضى',
      description: 'بحث عن المرضى باستخدام الاسم أو رقم الهاتف',
    }),
    ApiQuery({ 
      name: 'q', 
      required: true, 
      description: 'كلمة البحث (الاسم أو رقم الهاتف)',
      example: 'أحمد',
    }),
    ApiResponse({ 
      status: 200, 
      description: 'نتائج البحث',
      schema: {
        example: {
          data: [
            {
              id: '550e8400-e29b-41d4-a716-446655440000',
              fullName: 'أحمد محمد',
              phone: '0512345678',
              // ... other patient fields
            }
          ],
          meta: {
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1
          }
        }
      }
    }),
  );
}

// Find Patient by Phone Decorators
export function ApiFindPatientByPhone() {
  return applyDecorators(
    ApiOperation({
      summary: 'البحث عن مريض برقم الهاتف',
      description: 'البحث عن مريض باستخدام رقم الهاتف',
    }),
    ApiParam({ 
      name: 'phone', 
      required: true, 
      description: 'رقم هاتف المريض',
      example: '0512345678',
    }),
    ApiResponse({ 
      status: 200, 
      description: 'تم العثور على المريض', 
      type: Patient,
      content: {
        'application/json': {
          example: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            fullName: 'أحمد محمد',
            dateOfBirth: '1990-01-01T00:00:00.000Z',
            gender: 'MALE',
            phone: '0512345678',
            bloodType: 'A_POSITIVE',
            allergies: 'لا يوجد',
            medicalHistory: 'لا يوجد',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z'
          }
        }
      }
    }),
    ApiResponse({ 
      status: 404, 
      description: 'لم يتم العثور على المريض',
      schema: {
        example: {
          statusCode: 404,
          message: 'Patient with phone 0512345678 not found',
          error: 'Not Found'
        }
      }
    }),
  );
}

// Update Patient by Phone Decorators
export function ApiUpdatePatientByPhone() {
  return applyDecorators(
    ApiOperation({
      summary: 'تحديث بيانات مريض',
      description: 'تحديث بيانات مريض باستخدام رقم الهاتف',
    }),
    ApiParam({ 
      name: 'phone', 
      required: true, 
      description: 'رقم هاتف المريض',
      example: '0512345678',
    }),
    ApiBody({ 
      type: UpdatePatientDto,
      examples: {
        basic: {
          summary: 'تحديث بسيط',
          value: {
            fullName: 'أحمد محمد الجديد',
            bloodType: 'B_POSITIVE',
            medicalHistory: 'حساسية من البنسلين'
          }
        }
      }
    }),
    ApiResponse({ 
      status: 200, 
      description: 'تم تحديث بيانات المريض', 
      type: Patient,
      content: {
        'application/json': {
          example: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            fullName: 'أحمد محمد الجديد',
            dateOfBirth: '1990-01-01T00:00:00.000Z',
            gender: 'MALE',
            phone: '0512345678',
            bloodType: 'B_POSITIVE',
            allergies: 'لا يوجد',
            medicalHistory: 'حساسية من البنسلين',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-02T00:00:00.000Z'
          }
        }
      }
    }),
    ApiResponse({ 
      status: 404, 
      description: 'لم يتم العثور على المريض',
      schema: {
        example: {
          statusCode: 404,
          message: 'Patient with phone 0512345678 not found',
          error: 'Not Found'
        }
      }
    }),
  );
}

// Delete Patient by Phone Decorators
export function ApiDeletePatientByPhone() {
  return applyDecorators(
    ApiOperation({
      summary: 'حذف مريض',
      description: 'حذف مريض باستخدام رقم الهاتف',
    }),
    ApiParam({ 
      name: 'phone', 
      required: true, 
      description: 'رقم هاتف المريض',
      example: '0512345678',
    }),
    ApiResponse({ 
      status: 200, 
      description: 'تم حذف المريض بنجاح',
      schema: {
        example: {
          message: 'Patient with phone 0512345678 has been deleted'
        }
      }
    }),
    ApiResponse({ 
      status: 404, 
      description: 'لم يتم العثور على المريض',
      schema: {
        example: {
          statusCode: 404,
          message: 'Patient with phone 0512345678 not found',
          error: 'Not Found'
        }
      }
    }),
  );
}
