/*
  Warnings:

  - Added the required column `name` to the `folders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "folders" ADD COLUMN     "name" VARCHAR(255) NOT NULL;
