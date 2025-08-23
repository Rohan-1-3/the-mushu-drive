-- CreateTable
CREATE TABLE "shared_folder_links" (
    "id" VARCHAR(255) NOT NULL,
    "link" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(6) NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "folderId" VARCHAR(255) NOT NULL,

    CONSTRAINT "shared_folder_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shared_folder_links_link_key" ON "shared_folder_links"("link");

-- AddForeignKey
ALTER TABLE "shared_folder_links" ADD CONSTRAINT "shared_folder_links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "authenticated_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_folder_links" ADD CONSTRAINT "shared_folder_links_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
