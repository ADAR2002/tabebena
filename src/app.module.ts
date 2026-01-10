import { SupabaseModule } from "./supabase/supabase.module";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { PatientsModule } from "./patients/patients.module";
import { VisitsModule } from "./users/visits/visits.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { UsersModule } from "./users/users.module";
import { DoctorsModule } from "./doctors/doctors.module";
import { AppointmentsModule } from './appointments/appointments.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [
    SupabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    PrismaModule,
    DatabaseModule,
    AuthModule,
    PatientsModule,
    VisitsModule,
    ScheduleModule,
    UsersModule,
    DoctorsModule,
    SupabaseModule,
    AppointmentsModule,
    HomeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
