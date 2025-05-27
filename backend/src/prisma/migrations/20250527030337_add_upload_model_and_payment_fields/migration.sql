-- CreateEnum
CREATE TYPE "UploadType" AS ENUM ('AVATAR', 'THUMBNAIL', 'VIDEO', 'DOCUMENT', 'GENERAL');

-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "failureReason" TEXT,
ADD COLUMN     "paymentMethod" TEXT DEFAULT 'STRIPE';

-- CreateTable
CREATE TABLE "uploads" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "uploadType" "UploadType" NOT NULL DEFAULT 'GENERAL',
    "status" "UploadStatus" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "uploads_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
