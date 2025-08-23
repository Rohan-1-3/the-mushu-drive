import prismaService from "../services/prismaService.js";

const prisma = prismaService.getClient();

export async function getAllFilesRecursive(folderId, userId) {
    let files = await prisma.file.findMany({
        where: { folderId, userId }
    });
    const subfolders = await prisma.folder.findMany({
        where: { parentId: folderId, userId },
        select: { id: true }
    });
    for (const subfolder of subfolders) {
        const subFiles = await getAllFilesRecursive(subfolder.id);
        files = files.concat(subFiles);
    }
    return files;
}

// Helper to recursively get all folder IDs (including the root folder)
export async function getAllFolderIdsRecursive(folderId, userId) {
    let ids = [folderId];
    const subfolders = await prisma.folder.findMany({
        where: { parentId: folderId, userId },
        select: { id: true }
    });
    for (const subfolder of subfolders) {
        const subIds = await getAllFolderIdsRecursive(subfolder.id);
        ids = ids.concat(subIds);
    }
    return ids;
}

export const updateFolderHierarchyTimestamps = async (folderId, userId) => {
    if (!folderId) return;
    
    let currentFolderId = folderId;
    const updatedFolders = new Set(); // Prevent infinite loops
    
    while (currentFolderId && !updatedFolders.has(currentFolderId)) {
        updatedFolders.add(currentFolderId);
        
        // Update current folder timestamp
        const updatedFolder = await prisma.folder.update({
            where: { 
                id: currentFolderId,
                userId: userId // Ensure user owns the folder
            },
            data: {
                updatedAt: new Date()
            },
            select: {
                parentId: true
            }
        }).catch(() => null); // Handle case where folder doesn't exist or user doesn't own it
        
        if (!updatedFolder) break;
        
        // Move to parent folder
        currentFolderId = updatedFolder.parentId;
    }
};

// Transaction-safe recursive function to force delete folder contents
export const forceDeleteFolderContentsWithTransaction = async (folderId, userId, tx) => {
    // Delete all files in this folder
    await tx.file.deleteMany({
        where: {
            folderId: folderId,
            userId: userId
        }
    });

    // Get all subfolders
    const subfolders = await tx.folder.findMany({
        where: {
            parentId: folderId,
            userId: userId
        },
        select: {
            id: true
        }
    });

    // Recursively delete each subfolder and its contents
    for (const subfolder of subfolders) {
        await forceDeleteFolderContentsWithTransaction(subfolder.id, userId, tx);
        await tx.folder.delete({
            where: { id: subfolder.id }
        });
    }
};