import prismaService from "../services/prismaService.js";

import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = prismaService.getClient();

/**
 * Generates a unique name by appending a suffix (number) if the name already exists
 * @param {string} baseName - The original name
 * @param {string} userId - The user ID
 * @param {string|null} folderId - The folder ID (null for root level)
 * @param {string} type - Either 'file' or 'folder'
 * @returns {Promise<string>} - A unique name with suffix if needed
 */
export const generateUniqueName = async (baseName, userId, folderId = null, type = 'file') => {
    // Helper function to check if name exists
    const nameExists = async (name) => {
        if (type === 'file') {
            const existingFile = await prisma.file.findFirst({
                where: {
                    name: name,
                    userId: userId,
                    folderId: folderId
                }
            });
            return !!existingFile;
        } else {
            const existingFolder = await prisma.folder.findFirst({
                where: {
                    name: name,
                    userId: userId,
                    parentId: folderId
                }
            });
            return !!existingFolder;
        }
    };

    // Check if the base name already exists
    if (!(await nameExists(baseName))) {
        return baseName;
    }

    // Extract file extension if it's a file
    let nameWithoutExt = baseName;
    let extension = '';
    
    if (type === 'file') {
        const lastDotIndex = baseName.lastIndexOf('.');
        if (lastDotIndex > 0) { // Don't treat files starting with . as having extensions
            nameWithoutExt = baseName.substring(0, lastDotIndex);
            extension = baseName.substring(lastDotIndex);
        }
    }

    // Try names with incrementing numbers
    let counter = 1;
    let uniqueName;
    
    do {
        if (type === 'file') {
            uniqueName = `${nameWithoutExt} (${counter})${extension}`;
        } else {
            uniqueName = `${nameWithoutExt} (${counter})`;
        }
        counter++;
    } while (await nameExists(uniqueName));

    return uniqueName;
};

/**
 * Generates a unique folder name for the given context
 * @param {string} folderName - The desired folder name
 * @param {string} userId - The user ID
 * @param {string|null} parentId - The parent folder ID (null for root level)
 * @returns {Promise<string>} - A unique folder name
 */
export const generateUniqueFolderName = async (folderName, userId, parentId = null) => {
    return generateUniqueName(folderName, userId, parentId, 'folder');
};

/**
 * Generates a unique file name for the given context
 * @param {string} fileName - The desired file name
 * @param {string} userId - The user ID
 * @param {string|null} folderId - The folder ID (null for root level)
 * @returns {Promise<string>} - A unique file name
 */
export const generateUniqueFileName = async (fileName, userId, folderId = null) => {
    return generateUniqueName(fileName, userId, folderId, 'file');
};
