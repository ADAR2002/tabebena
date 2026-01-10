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
    "dateOfBirth" DATETIME,
    "gender" TEXT,
    "refreshToken" TEXT,
    "openCount" INTEGER NOT NULL DEFAULT 0,
    "profileComplete" BOOLEAN NOT NULL DEFAULT false,
    "consultationFee" REAL,
    "experienceYears" INTEGER,
    "profilePhotoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("bio", "consultationFee", "createdAt", "dateOfBirth", "email", "experienceYears", "firstName", "gender", "id", "lastName", "password", "phone", "profileComplete", "profilePhotoUrl", "refreshToken", "role", "specialty", "updatedAt") SELECT "bio", "consultationFee", "createdAt", "dateOfBirth", "email", "experienceYears", "firstName", "gender", "id", "lastName", "password", "phone", "profileComplete", "profilePhotoUrl", "refreshToken", "role", "specialty", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
