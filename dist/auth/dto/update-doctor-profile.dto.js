"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDoctorProfileDto = exports.GenderDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var GenderDto;
(function (GenderDto) {
    GenderDto["MALE"] = "MALE";
    GenderDto["FEMALE"] = "FEMALE";
    GenderDto["OTHER"] = "OTHER";
})(GenderDto || (exports.GenderDto = GenderDto = {}));
class ClinicLocationDto {
    address;
    city;
    latitude;
    longitude;
    region;
    clinicName;
    clinicPhone;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        required: true,
        description: 'Clinic address',
        example: '123 Medical Center, Healthcare St.'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ClinicLocationDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: true,
        description: 'Clinic city',
        example: 'Riyadh'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ClinicLocationDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: true,
        description: 'Latitude coordinate of the clinic location',
        example: 24.7136
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ClinicLocationDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: true,
        description: 'Longitude coordinate of the clinic location',
        example: 46.6753
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ClinicLocationDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Region / area of the clinic',
        example: 'Al Olaya'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClinicLocationDto.prototype, "region", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Clinic name',
        example: 'Tabebena Clinic'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClinicLocationDto.prototype, "clinicName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Clinic phone number',
        example: '+966500000000'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClinicLocationDto.prototype, "clinicPhone", void 0);
class UpdateDoctorProfileDto {
    bio;
    specialty;
    certificates;
    clinicImages;
    consultationFee;
    experienceYears;
    profilePhotoUrl;
    clinicLocation;
    dateOfBirth;
    gender;
}
exports.UpdateDoctorProfileDto = UpdateDoctorProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Biography of the doctor',
        example: 'Experienced cardiologist with 10+ years of practice'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Name of the specialty',
        example: 'Cardiology'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "specialty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'array',
        items: { type: 'string' },
        required: false,
        description: 'Array of certificate image URLs',
        example: ['https://example.com/cert1.jpg', 'https://example.com/cert2.jpg']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    __metadata("design:type", Array)
], UpdateDoctorProfileDto.prototype, "certificates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'array',
        items: { type: 'string' },
        required: false,
        description: 'Array of clinic image URLs',
        example: ['https://example.com/clinic1.jpg', 'https://example.com/clinic2.jpg']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    __metadata("design:type", Array)
], UpdateDoctorProfileDto.prototype, "clinicImages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Consultation fee in local currency',
        example: 150.50,
        minimum: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateDoctorProfileDto.prototype, "consultationFee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Years of experience',
        example: 5,
        minimum: 0,
        maximum: 100
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateDoctorProfileDto.prototype, "experienceYears", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'URL of the profile photo',
        example: 'https://example.com/profile.jpg'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "profilePhotoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Clinic location details',
        type: ClinicLocationDto
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", ClinicLocationDto)
], UpdateDoctorProfileDto.prototype, "clinicLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Date of birth of the doctor',
        example: '1985-05-10',
        format: 'date'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Gender of the doctor',
        example: 'MALE',
        enum: GenderDto
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(GenderDto),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "gender", void 0);
//# sourceMappingURL=update-doctor-profile.dto.js.map