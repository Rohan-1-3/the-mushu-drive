/*
  Warnings:

  - A unique constraint covering the columns `[name,userId,folderId]` on the table `files` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,userId,parentId]` on the table `folders` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "files_name_key";

-- DropIndex
DROP INDEX "folders_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "files_name_userId_folderId_key" ON "files"("name", "userId", "folderId");

-- CreateIndex
CREATE UNIQUE INDEX "folders_name_userId_parentId_key" ON "folders"("name", "userId", "parentId");
