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
exports.UpdateDoctorProfileDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateDoctorProfileDto {
    bio;
    specialtyId;
    certificates;
    clinicImages;
    consultationFee;
    experienceYears;
}
exports.UpdateDoctorProfileDto = UpdateDoctorProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Biography of the doctor' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'ID of the specialty' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "specialtyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'array',
        items: { type: 'string', format: 'binary' },
        required: false,
        description: 'Certificate files to upload (PDF, PNG, JPG)'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateDoctorProfileDto.prototype, "certificates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'array',
        items: { type: 'string', format: 'binary' },
        required: false,
        description: 'Clinic images to upload (PNG, JPG)'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateDoctorProfileDto.prototype, "clinicImages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Consultation fee' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "consultationFee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Years of experience' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "experienceYears", void 0);
//# sourceMappingURL=update-doctor-profile.dto.js.map