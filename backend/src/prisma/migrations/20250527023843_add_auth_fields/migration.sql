/*
  Warnings:

  - You are about to drop the column `resetPasswordExpiresAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordToken` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "resetPasswordExpiresAt",
DROP COLUMN "resetPasswordToken",
ADD COLUMN     "emailVerificationExpires" TIMESTAMP(3),
ADD COLUMN     "emailVerificationToken" TEXT,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "passwordResetExpires" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT;
