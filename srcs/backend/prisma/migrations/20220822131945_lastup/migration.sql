/*
  Warnings:

  - A unique constraint covering the columns `[friendNick]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `friendNick` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Friend" ADD COLUMN     "friendNick" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Friend_friendNick_key" ON "Friend"("friendNick");
