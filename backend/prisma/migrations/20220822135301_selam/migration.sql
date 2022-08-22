/*
  Warnings:

  - You are about to drop the column `friendNick` on the `Friend` table. All the data in the column will be lost.
  - You are about to drop the column `is_blocked` on the `Friend` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Friend_friendNick_key";

-- AlterTable
ALTER TABLE "Friend" DROP COLUMN "friendNick",
DROP COLUMN "is_blocked";

-- CreateTable
CREATE TABLE "Blocked" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "blockedId" INTEGER NOT NULL,

    CONSTRAINT "Blocked_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Blocked" ADD CONSTRAINT "Blocked_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
