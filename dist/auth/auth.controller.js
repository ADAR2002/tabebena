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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const otp_request_dto_1 = require("./dto/otp-request.dto");
const auth_credentials_dto_1 = require("./dto/auth-credentials.dto");
const swagger_decorators_1 = require("./decorators/swagger.decorators");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async requestOtp(requestOtpDto) {
        if (!requestOtpDto.isDoctor) {
            throw new common_1.UnauthorizedException('OTP verification is only required for doctors');
        }
        return this.authService.requestOtp(requestOtpDto.email, requestOtpDto.isDoctor);
    }
    async verifyOtpAndSignUp(email, otp, userDetails) {
        if (email !== userDetails.email) {
            throw new common_1.UnauthorizedException('Email in OTP verification does not match user details');
        }
        return this.authService.verifyOtpAndCreateUser({ email, otp }, userDetails);
    }
    async signUp(registerCredentialsDto) {
        return this.authService.signUp(registerCredentialsDto);
    }
    async login(authCredentialsDto) {
        return this.authService.signIn(authCredentialsDto);
    }
    async getProfile(req) {
        const user = await this.authService.getUserProfile(req.user.userId);
        return user;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('request-otp'),
    (0, swagger_decorators_1.RequestOtpDoc)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otp_request_dto_1.RequestOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestOtp", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, swagger_decorators_1.VerifyOtpAndSignUpDoc)(),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('otp')),
    __param(2, (0, common_1.Body)('userDetails')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, auth_credentials_dto_1.RegisterCredentialsDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtpAndSignUp", null);
__decorate([
    (0, common_1.Post)('signup'),
    (0, swagger_decorators_1.SignUpDoc)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_credentials_dto_1.RegisterCredentialsDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)('signin'),
    (0, swagger_decorators_1.SignInDoc)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_credentials_dto_1.LoginCredentialsDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    (0, swagger_decorators_1.GetProfileDoc)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_decorators_1.ApiTagsAuth)(),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map