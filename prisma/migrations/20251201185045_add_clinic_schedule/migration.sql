-- CreateTable
CREATE TABLE "ClinicSchedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "doctorUserId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "slotDuration" INTEGER NOT NULL DEFAULT 30,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "patientId" TEXT,
    "bookingStatus" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "notes" TEXT,
    "bookedAt" DATETIME,
    "bookedBy" TEXT DEFAULT 'DOCTOR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClinicSchedule_doctorUserId_fkey" FOREIGN KEY ("doctorUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicSchedule_patientId_key" ON "ClinicSchedule"("patientId");

-- CreateIndex
CREATE INDEX "ClinicSchedule_doctorUserId_idx" ON "ClinicSchedule"("doctorUserId");

-- CreateIndex
CREATE INDEX "ClinicSchedule_date_idx" ON "ClinicSchedule"("date");

-- CreateIndex
CREATE INDEX "ClinicSchedule_bookingStatus_idx" ON "ClinicSchedule"("bookingStatus");
