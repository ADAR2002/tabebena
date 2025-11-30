"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckAuthDoc = exports.UpdateDoctorProfileDoc = exports.GetProfileDoc = exports.SignInDoc = exports.SignUpDoc = exports.VerifyOtpAndSignUpDoc = exports.RequestOtpDoc = exports.ApiTagsAuth = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_credentials_dto_1 = require("../dto/auth-credentials.dto");
const otp_request_dto_1 = require("../dto/otp-request.dto");
const ApiTagsAuth = () => (0, swagger_1.ApiTags)('Authentication');
exports.ApiTagsAuth = ApiTagsAuth;
const RequestOtpDoc = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'طلب كلمة مرور لمرة واحدة (OTP)',
    description: 'إرسال رمز التحقق إلى البريد الإلكتروني المقدم لتسجيل الطبيب',
}), (0, swagger_1.ApiResponse)({
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
}), (0, swagger_1.ApiResponse)({ status: 400, description: 'بيانات الطلب غير صالحة' }), (0, swagger_1.ApiResponse)({
    status: 401,
    description: 'غير مصرح به - يلزم التحقق من البريد الإلكتروني',
}), (0, swagger_1.ApiResponse)({
    status: 429,
    description: 'تم تجاوز عدد المحاولات المسموح بها',
}), (0, swagger_1.ApiResponse)({ status: 500, description: 'خطأ في الخادم الداخلي' }), (0, swagger_1.ApiBody)({
    type: otp_request_dto_1.RequestOtpDto,
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
}));
exports.RequestOtpDoc = RequestOtpDoc;
const VerifyOtpAndSignUpDoc = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'التحقق من OTP وإكمال التسجيل',
    description: 'التحقق من رمز التحقق وإكمال تسجيل الطبيب',
}), (0, swagger_1.ApiResponse)({
    status: 201,
    description: 'تم إنشاء الحساب بنجاح',
    schema: {
        type: 'object',
        properties: {
            accessToken: { type: 'string' },
            user: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string', enum: ['DOCTOR', 'PATIENT'] },
                    profileComplete: { type: 'boolean' },
                },
            },
        },
    },
}), (0, swagger_1.ApiResponse)({ status: 400, description: 'بيانات الطلب غير صالحة' }), (0, swagger_1.ApiResponse)({
    status: 401,
    description: 'رمز التحقق غير صالح أو منتهي الصلاحية',
}), (0, swagger_1.ApiResponse)({ status: 404, description: 'لم يتم العثور على طلب OTP' }), (0, swagger_1.ApiResponse)({ status: 500, description: 'خطأ في الخادم الداخلي' }), (0, swagger_1.ApiBody)({
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
                    email: { type: 'string', example: 'doctor@example.com' },
                    password: { type: 'string', example: 'SecurePass123!' },
                    firstName: { type: 'string', example: 'أحمد' },
                    lastName: { type: 'string', example: 'علي' },
                    phone: { type: 'string', example: '1234567890' },
                    isDoctor: { type: 'boolean', example: true },
                },
            },
        },
        required: ['email', 'otp', 'userDetails'],
    },
}));
exports.VerifyOtpAndSignUpDoc = VerifyOtpAndSignUpDoc;
const SignUpDoc = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'تسجيل مريض جديد',
    description: 'إنشاء حساب مريض جديد. للأطباء، يرجى استخدام مسار OTP.',
}), (0, swagger_1.ApiResponse)({
    status: 201,
    description: 'تم إنشاء الحساب بنجاح',
    schema: {
        type: 'object',
        properties: {
            accessToken: { type: 'string' },
            user: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string', enum: ['DOCTOR', 'PATIENT'] },
                    profileComplete: { type: 'boolean' },
                },
            },
        },
    },
}), (0, swagger_1.ApiResponse)({ status: 400, description: 'بيانات الطلب غير صالحة' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'البريد الإلكتروني مسجل مسبقاً' }), (0, swagger_1.ApiResponse)({ status: 500, description: 'خطأ في الخادم الداخلي' }), (0, swagger_1.ApiBody)({
    type: auth_credentials_dto_1.RegisterCredentialsDto,
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
}));
exports.SignUpDoc = SignUpDoc;
const SignInDoc = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'تسجيل الدخول',
    description: 'مصادقة المستخدم وإرجاع رمز JWT للتفويض.',
}), (0, swagger_1.ApiResponse)({
    status: 201,
    description: 'تم تسجيل الدخول بنجاح',
    schema: {
        type: 'object',
        properties: {
            accessToken: { type: 'string' },
            user: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string', enum: ['DOCTOR', 'PATIENT'] },
                    profileComplete: { type: 'boolean' },
                },
            },
        },
    },
}), (0, swagger_1.ApiResponse)({ status: 400, description: 'بيانات الاعتماد غير صالحة' }), (0, swagger_1.ApiResponse)({
    status: 401,
    description: 'غير مصرح به - بيانات الاعتماد غير صحيحة',
}), (0, swagger_1.ApiResponse)({ status: 500, description: 'خطأ في الخادم الداخلي' }), (0, swagger_1.ApiBody)({
    type: auth_credentials_dto_1.LoginCredentialsDto,
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
}));
exports.SignInDoc = SignInDoc;
const GetProfileDoc = () => (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)('JWT-auth'), (0, swagger_1.ApiOperation)({
    summary: 'الحصول على الملف الشخصي للمستخدم',
    description: 'استرجاع الملف الشخصي الكامل للمستخدم المصادق عليه بما في ذلك معلومات الطبيب المحددة.',
}), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'تم استرداد الملف الشخصي بنجاح',
    schema: {
        type: 'object',
        properties: {
            id: { type: 'string' },
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
                    clinicLocation: {
                        type: 'object',
                        nullable: true,
                        properties: {
                            id: { type: 'string' },
                            address: { type: 'string' },
                            city: { type: 'string' },
                            latitude: { type: 'number' },
                            longitude: { type: 'number' },
                            updatedAt: { type: 'string', format: 'date-time' }
                        },
                    },
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
}), (0, swagger_1.ApiResponse)({
    status: 401,
    description: 'غير مصرح به - يلزم تسجيل الدخول',
}), (0, swagger_1.ApiResponse)({ status: 404, description: 'لم يتم العثور على المستخدم' }), (0, swagger_1.ApiResponse)({ status: 500, description: 'خطأ في الخادم الداخلي' }));
exports.GetProfileDoc = GetProfileDoc;
const UpdateDoctorProfileDoc = () => (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)('JWT-auth'), (0, swagger_1.ApiBody)({
    schema: {
        type: 'object',
        properties: {
            profilePhotoUrl: {
                type: 'string',
                format: 'url',
                description: 'URL of the profile photo',
                example: 'https://example.com/profile.jpg'
            },
            certificates: {
                type: 'array',
                items: {
                    type: 'string',
                    format: 'url'
                },
                description: 'Array of certificate image URLs',
                example: ['https://example.com/cert1.jpg', 'https://example.com/cert2.jpg']
            },
            clinicImages: {
                type: 'array',
                items: {
                    type: 'string',
                    format: 'url'
                },
                description: 'Array of clinic image URLs',
                example: ['https://example.com/clinic1.jpg', 'https://example.com/clinic2.jpg']
            },
            bio: {
                type: 'string',
                description: 'Biography of the doctor',
                example: 'Experienced cardiologist with 10+ years of practice'
            },
            specialty: {
                type: 'string',
                description: 'Name of the specialty',
                example: 'Cardiology'
            },
            consultationFee: {
                type: 'number',
                format: 'float',
                description: 'Consultation fee in local currency',
                example: 150.50,
                minimum: 0
            },
            experienceYears: {
                type: 'integer',
                description: 'Years of experience',
                example: 5,
                minimum: 0,
                maximum: 100
            },
            dateOfBirth: {
                type: 'string',
                format: 'date',
                description: 'Date of birth of the doctor',
                example: '1985-05-10'
            },
            gender: {
                type: 'string',
                description: 'Gender of the doctor',
                enum: ['MALE', 'FEMALE', 'OTHER'],
                example: 'MALE'
            },
            clinicLocation: {
                type: 'object',
                description: 'Clinic location details',
                properties: {
                    address: {
                        type: 'string',
                        example: '123 Medical Center, Healthcare St.'
                    },
                    city: {
                        type: 'string',
                        example: 'Riyadh'
                    },
                    latitude: {
                        type: 'number',
                        format: 'float',
                        example: 24.7136
                    },
                    longitude: {
                        type: 'number',
                        format: 'float',
                        example: 46.6753
                    },
                    region: {
                        type: 'string',
                        description: 'Region / area of the clinic',
                        example: 'Al Olaya'
                    },
                    clinicName: {
                        type: 'string',
                        description: 'Clinic name',
                        example: 'Tabebena Clinic'
                    },
                    clinicPhone: {
                        type: 'string',
                        description: 'Clinic phone number',
                        example: '+966500000000'
                    }
                },
                required: ['address', 'city', 'latitude', 'longitude']
            },
        }
    }
}), (0, swagger_1.ApiOperation)({
    summary: 'تحديث ملف الطبيب الشخصي',
    description: 'تحديث معلومات ملف الطبيب الشخصي بما في ذلك الشهادات وصور العيادة',
}), (0, swagger_1.ApiResponse)({
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
            dateOfBirth: { type: 'string', format: 'date', nullable: true },
            gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'], nullable: true },
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
}), (0, swagger_1.ApiResponse)({ status: 400, description: 'بيانات الطلب غير صالحة' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'غير مصرح به - يلزم تسجيل الدخول' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'ممنوع - يجب أن تكون طبيباً' }), (0, swagger_1.ApiResponse)({ status: 500, description: 'خطأ في الخادم الداخلي' }));
exports.UpdateDoctorProfileDoc = UpdateDoctorProfileDoc;
const CheckAuthDoc = () => (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)('JWT-auth'), (0, swagger_1.ApiOperation)({
    summary: 'التحقق من حالة المصادقة',
    description: 'التحقق مما إذا كان رمز JWT الحالي صالحاً وإرجاع معلومات المستخدم الأساسية.',
}), (0, swagger_1.ApiResponse)({
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
}), (0, swagger_1.ApiResponse)({ status: 401, description: 'غير مصرح به - رمز غير صالح' }));
exports.CheckAuthDoc = CheckAuthDoc;
//# sourceMappingURL=swagger.decorators.js.map