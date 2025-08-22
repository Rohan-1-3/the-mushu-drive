/*
  Warnings:

  - You are about to drop the column `private` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `files` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "private",
DROP COLUMN "url";
