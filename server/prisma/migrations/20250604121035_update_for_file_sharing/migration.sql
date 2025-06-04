/*
  Warnings:

  - Added the required column `userId` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `folders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" ADD COLUMN     "userId" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "folders" ADD COLUMN     "userId" VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE "shared_file_links" (
    "id" VARCHAR(255) NOT NULL,
    "link" VARCHAR(255) NOT NULL,
    "expiryDate" TIMESTAMP(6) NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "fileId" VARCHAR(255) NOT NULL,

    CONSTRAINT "shared_file_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shared_file_links_link_key" ON "shared_file_links"("link");

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "authenticated_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "authenticated_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_file_links" ADD CONSTRAINT "shared_file_links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "authenticated_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_file_links" ADD CONSTRAINT "shared_file_links_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
