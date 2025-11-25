import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  LoginCredentialsDto,
  RegisterCredentialsDto,
} from '../dto/auth-credentials.dto';
import { RequestOtpDto } from '../dto/otp-request.dto';

// ديكورات Swagger لواجهة برمجة التطبيقات (API)

export const ApiTagsAuth = () => ApiTags('Authentication');

export const RequestOtpDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'طلب كلمة مرور لمرة واحدة (OTP)',
      description:
        'إرسال رمز التحقق إلى البريد الإلكتروني المقدم لتسجيل الطبيب',
    }),
    ApiResponse({
      status: 201,
      description: 'تم إرسال رمز التحقق بنجاح',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
          },
          expiresAt: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiResponse({ status: 400, description: 'بيانات الطلب غير صالحة' }),
    ApiResponse({
      status: 401,
      description: 'غير مصرح به - يلزم التحقق من البريد الإلكتروني',
    }),
    ApiResponse({
      status: 429,
      description: 'تم تجاوز عدد المحاولات المسموح بها',
    }),
    ApiResponse({ status: 500, description: 'خطأ في الخادم الداخلي' }),
    ApiBody({
      type: RequestOtpDto,
      description: 'بيانات طلب OTP',
      examples: {
        doctor: {
          summary: 'طلب OTP للطبيب',
          value: {
            email: 'doctor@example.com',
            isDoctor: true,
          },
        },
      },
    }),
  );

export const VerifyOtpAndSignUpDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'التحقق من OTP وإكمال التسجيل',
      description: 'التحقق من رمز التحقق وإكمال تسجيل الطبيب',
    }),
    ApiResponse({
      status: 201,
      description: 'تم إنشاء الحساب بنجاح',
      schema: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              email: { type: 'string' },
              role: { type: 'string', enum: ['DOCTOR', 'PATIENT'] },
              profileComplete: { type: 'boolean' },
            },
          },
        },
      },
    }),
    ApiResponse({ status: 400, description: 'بيانات الطلب غير صالحة' }),
    ApiResponse({
      status: 401,
      description: 'رمز التحقق غير صالح أو منتهي الصلاحية',
    }),
    ApiResponse({ status: 404, description: 'لم يتم العثور على طلب OTP' }),
    ApiResponse({ status: 500, description: 'خطأ في الخادم الداخلي' }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'doctor@example.com',
          },
          otp: { type: 'string', example: '123456' },
          userDetails: {
            type: 'object',
            properties: {
              email: { type: 'string' ,example: 'doctor@example.com'},
              password: { type: 'string' ,example: 'SecurePass123!'},
              firstName: { type: 'string' ,example: 'أحمد'},
              lastName: { type: 'string' ,example: 'علي'},
              phone: { type: 'string' ,example: '1234567890'},
              isDoctor: { type: 'boolean' ,example: true},
            },
          },
        },
        required: ['email', 'otp', 'userDetails'],
      },
    }),
  );

export const SignUpDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'تسجيل مريض جديد',
      description: 'إنشاء حساب مريض جديد. للأطباء، يرجى استخدام مسار OTP.',
    }),
    ApiResponse({
      status: 201,
      description: 'تم إنشاء الحساب بنجاح',
      schema: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              email: { type: 'string' },
              role: { type: 'string', enum: ['DOCTOR', 'PATIENT'] },
              profileComplete: { type: 'boolean' },
            },
          },
        },
      },
    }),
    ApiResponse({ status: 400, description: 'بيانات الطلب غير صالحة' }),
    ApiResponse({ status: 409, description: 'البريد الإلكتروني مسجل مسبقاً' }),
    ApiResponse({ status: 500, description: 'خطأ في الخادم الداخلي' }),
    ApiBody({
      type: RegisterCredentialsDto,
      description: 'بيانات تسجيل المريض',
      examples: {
        patient: {
          summary: 'تسجيل مريض',
          value: {
            email: 'patient@example.com',
            password: 'SecurePass123!',
            firstName: 'أحمد',
            lastName: 'علي',
            phone: '+1234567890',
            dateOfBirth: '1990-01-01',
            gender: 'MALE',
            isDoctor: false,
          },
        },
      },
    }),
  );

export const SignInDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'تسجيل الدخول',
      description: 'مصادقة المستخدم وإرجاع رمز JWT للتفويض.',
    }),
    ApiResponse({
      status: 201,
      description: 'تم تسجيل الدخول بنجاح',
      schema: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              email: { type: 'string' },
              role: { type: 'string', enum: ['DOCTOR', 'PATIENT'] },
              profileComplete: { type: 'boolean' },
            },
          },
        },
      },
    }),
    ApiResponse({ status: 400, description: 'بيانات الاعتماد غير صالحة' }),
    ApiResponse({
      status: 401,
      description: 'غير مصرح به - بيانات الاعتماد غير صحيحة',
    }),
    ApiResponse({ status: 500, description: 'خطأ في الخادم الداخلي' }),
    ApiBody({
      type: LoginCredentialsDto,
      description: 'بيانات تسجيل الدخول',
      examples: {
        login: {
          summary: 'تسجيل الدخول',
          value: {
            email: 'user@example.com',
            password: 'SecurePass123!',
          },
        },
      },
    }),
  );

export const GetProfileDoc = () =>
  applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'الحصول على الملف الشخصي للمستخدم',
      description:
        'استرجاع الملف الشخصي الكامل للمستخدم المصادق عليه بما في ذلك معلومات الطبيب المحددة.',
    }),
    ApiResponse({
      status: 200,
      description: 'تم استرداد الملف الشخصي بنجاح',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          email: { type: 'string' },
          firstName: { type: 'string', nullable: true },
          lastName: { type: 'string', nullable: true },
          phone: { type: 'string', nullable: true },
          dateOfBirth: { type: 'string', format: 'date', nullable: true },
          gender: {
            type: 'string',
            enum: ['MALE', 'FEMALE', 'OTHER'],
            nullable: true,
          },
          role: { type: 'string', enum: ['DOCTOR', 'PATIENT'] },
          profileComplete: { type: 'boolean' },
          doctorProfile: {
            type: 'object',
            nullable: true,
            properties: {
              specialty: { type: 'string' },
              licenseNumber: { type: 'string' },
              experience: { type: 'number' },
              education: { type: 'string' },
              hospital: { type: 'string' },
              consultationFee: { type: 'number' },
              availableDays: { type: 'array', items: { type: 'string' } },
              startTime: { type: 'string', format: 'time' },
              endTime: { type: 'string', format: 'time' },
            },
          },
          patientProfile: {
            type: 'object',
            nullable: true,
            properties: {
              bloodType: { type: 'string', nullable: true },
              height: { type: 'number', nullable: true },
              weight: { type: 'number', nullable: true },
              allergies: { type: 'array', items: { type: 'string' } },
              medicalConditions: { type: 'array', items: { type: 'string' } },
              medications: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'غير مصرح به - يلزم تسجيل الدخول',
    }),
    ApiResponse({ status: 404, description: 'لم يتم العثور على المستخدم' }),
    ApiResponse({ status: 500, description: 'خطأ في الخادم الداخلي' }),
  );

export const UpdateDoctorProfileDoc = () =>
  applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'تحديث ملف الطبيب الشخصي',
      description: 'تحديث معلومات ملف الطبيب الشخصي بما في ذلك الشهادات وصور العيادة',
    }),
    ApiResponse({
      status: 200,
      description: 'تم تحديث الملف الشخصي بنجاح',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          phone: { type: 'string' },
          bio: { type: 'string', nullable: true },
          role: { type: 'string', enum: ['DOCTOR'] },
          profileComplete: { type: 'boolean' },
          consultationFee: { type: 'number', nullable: true },
          experienceYears: { type: 'number', nullable: true },
          profilePhotoUrl: { type: 'string', nullable: true },
          specialty: {
            type: 'object',
            nullable: true,
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              icon: { type: 'string', nullable: true },
            },
          },
          certificates: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                institution: { type: 'string' },
                year: { type: 'number' },
                imageUrl: { type: 'string' },
              },
            },
          },
          clinicImages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                imageUrl: { type: 'string' },
                caption: { type: 'string', nullable: true },
                isPrimary: { type: 'boolean' },
                displayOrder: { type: 'number' },
              },
            },
          },
        },
      },
    }),
    ApiResponse({ status: 400, description: 'بيانات الطلب غير صالحة' }),
    ApiResponse({ status: 401, description: 'غير مصرح به - يلزم تسجيل الدخول' }),
    ApiResponse({ status: 403, description: 'ممنوع - يجب أن تكون طبيباً' }),
    ApiResponse({ status: 500, description: 'خطأ في الخادم الداخلي' }),
    ApiConsumes('multipart/form-data'),
  );

export const CheckAuthDoc = () =>
  applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'التحقق من حالة المصادقة',
      description:
        'التحقق مما إذا كان رمز JWT الحالي صالحاً وإرجاع معلومات المستخدم الأساسية.',
    }),
    ApiResponse({
      status: 200,
      description: 'حالة المصادقة الحالية',
      schema: {
        type: 'object',
        properties: {
          isAuthenticated: { type: 'boolean', example: true },
          role: { type: 'string', enum: ['DOCTOR', 'PATIENT'] },
          profileComplete: { type: 'boolean' },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'غير مصرح به - رمز غير صالح' }),
  );

// يمكن إضافة المزيد من الديكورات حسب الحاجة
