/*
  Warnings:

  - You are about to drop the column `specialtyId` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "bio" TEXT,
    "role" TEXT NOT NULL,
    "specialty" TEXT,
    "profileComplete" BOOLEAN NOT NULL DEFAULT false,
    "consultationFee" REAL,
    "experienceYears" INTEGER,
    "profilePhotoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("bio", "consultationFee", "createdAt", "email", "experienceYears", "firstName", "id", "lastName", "password", "phone", "profileComplete", "profilePhotoUrl", "role", "updatedAt") SELECT "bio", "consultationFee", "createdAt", "email", "experienceYears", "firstName", "id", "lastName", "password", "phone", "profileComplete", "profilePhotoUrl", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
