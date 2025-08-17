/*
  Warnings:

  - Added the required column `buffer` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimetype` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" ADD COLUMN     "buffer" BYTEA NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "mimetype" VARCHAR(100) NOT NULL,
ADD COLUMN     "name" VARCHAR(255) NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
