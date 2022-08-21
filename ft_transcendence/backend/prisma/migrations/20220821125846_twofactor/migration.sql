/*
  Warnings:

  - Added the required column `two_factor_enabled` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "two_factor_enabled" BOOLEAN NOT NULL,
ADD COLUMN     "two_factor_secret" TEXT;
