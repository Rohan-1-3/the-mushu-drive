/*
  Warnings:

  - You are about to drop the column `expiryDate` on the `shared_file_links` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `shared_file_links` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shared_file_links" DROP COLUMN "expiryDate",
ADD COLUMN     "expiresAt" TIMESTAMP(6) NOT NULL;
