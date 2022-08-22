/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `avatar` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lose` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nick` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `win` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT NOT NULL,
ADD COLUMN     "level" INTEGER NOT NULL,
ADD COLUMN     "lose" INTEGER NOT NULL,
ADD COLUMN     "nick" TEXT NOT NULL,
ADD COLUMN     "status" INTEGER NOT NULL,
ADD COLUMN     "win" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Friend" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "friendId" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "is_blocked" BOOLEAN NOT NULL,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchHistory" (
    "id" SERIAL NOT NULL,
    "user1" INTEGER NOT NULL,
    "user2" INTEGER NOT NULL,
    "user1_score" INTEGER NOT NULL,
    "user2_score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
