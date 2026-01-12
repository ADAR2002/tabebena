/*
  Warnings:

  - You are about to drop the `DoctorDayOff` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "DoctorDayOff_userId_dayOfWeek_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DoctorDayOff";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DoctorSchedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "eventType" TEXT NOT NULL DEFAULT 'WORK',
    "isDayOff" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DoctorSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DoctorSchedule" ("createdAt", "dayOfWeek", "endTime", "eventType", "id", "startTime", "updatedAt", "userId") SELECT "createdAt", "dayOfWeek", "endTime", "eventType", "id", "startTime", "updatedAt", "userId" FROM "DoctorSchedule";
DROP TABLE "DoctorSchedule";
ALTER TABLE "new_DoctorSchedule" RENAME TO "DoctorSchedule";
CREATE INDEX "DoctorSchedule_userId_idx" ON "DoctorSchedule"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
