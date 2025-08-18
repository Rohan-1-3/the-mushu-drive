/*
  Warnings:

  - You are about to drop the column `buffer` on the `files` table. All the data in the column will be lost.
  - Added the required column `supabasePath` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "buffer",
ADD COLUMN     "supabasePath" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
