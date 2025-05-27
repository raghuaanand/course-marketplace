/*
  Warnings:

  - Added the required column `courseId` to the `lessons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `lessons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "enrollmentCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "lesson_progress" ADD COLUMN     "watchedDuration" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "courseId" TEXT NOT NULL,
ADD COLUMN     "position" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
