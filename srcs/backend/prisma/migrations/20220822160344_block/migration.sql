/*
  Warnings:

  - You are about to drop the `Blocked` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Blocked" DROP CONSTRAINT "Blocked_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "blockeds" INTEGER[];

-- DropTable
DROP TABLE "Blocked";
