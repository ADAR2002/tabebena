"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const supabase_module_1 = require("./supabase/supabase.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./prisma/prisma.module");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./auth/auth.module");
const patients_module_1 = require("./patients/patients.module");
const visits_module_1 = require("./visits/visits.module");
const schedule_module_1 = require("./schedule/schedule.module");
const users_module_1 = require("./users/users.module");
const doctors_module_1 = require("./doctors/doctors.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            supabase_module_1.SupabaseModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ".env",
            }),
            prisma_module_1.PrismaModule,
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            patients_module_1.PatientsModule,
            visits_module_1.VisitsModule,
            schedule_module_1.ScheduleModule,
            users_module_1.UsersModule,
            doctors_module_1.DoctorsModule,
            supabase_module_1.SupabaseModule
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map