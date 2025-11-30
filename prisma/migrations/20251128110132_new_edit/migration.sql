-- AlterTable
ALTER TABLE "ClinicLocation" ADD COLUMN "clinicName" TEXT;
ALTER TABLE "ClinicLocation" ADD COLUMN "clinicPhone" TEXT;
ALTER TABLE "ClinicLocation" ADD COLUMN "region" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "dateOfBirth" DATETIME;
ALTER TABLE "User" ADD COLUMN "gender" TEXT;
