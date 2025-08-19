import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
import { v4 as uuid } from "uuid";
import { validateRequest } from "../configs/validateRequest.js";
import { body } from "express-validator";
import { generateUniqueFolderName } from "../utils/nameResolution.js";

const prisma = new PrismaClient();

const validateFolderName = [
    body("folderName").trim().notEmpty().withMessage("Folder name cannot be empty.").bail()
        .isLength({ min: 1, max: 30 }).withMessage("Folder name length to be between 1 and 30.")
        .escape()
]

// const validateParentId = [
//     body("parentId").optional().isUUID().withMessage("Parent ID must be a valid UUID")
// ]

const updateFolderHierarchyTimestamps = async (folderId, userId) => {
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
const forceDeleteFolderContentsWithTransaction = async (folderId, userId, tx) => {
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

export const createFolder = [
    validateFolderName, validateRequest, expressAsyncHandler(async (req, res) => {
        const { folderName, parentId } = req.body
        const folderId = uuid();
        const userId = req.user.id

        // If parentId is provided, verify it exists and belongs to user
        if (parentId) {
            const parentFolder = await prisma.folder.findFirst({
                where: {
                    id: parentId,
                    userId: userId
                }
            });

            if (!parentFolder) {
                return res.status(404).json({
                    message: "Parent folder not found or you don't have permission to access it."
                });
            }
        }

        // Generate unique folder name to handle duplicates
        const uniqueFolderName = await generateUniqueFolderName(folderName, userId, parentId);

        const folder = await prisma.folder.create({
            data: {
                id: folderId,
                userId: userId,
                name: uniqueFolderName,
                parentId: parentId || null
            }
        })

        if (folder) {
            if(parentId){
                await prisma.folder.update({
                    where: { id: parentId },
                    data: {
                        updatedAt: new Date() // Update parent folder's timestamp 
                    }
                });
            }

            await updateFolderHierarchyTimestamps(folderId, userId); // Update timestamps for all parent folders

            return res.status(200).json({
                ...folder,
                message: uniqueFolderName !== folderName 
                    ? `Folder created as "${uniqueFolderName}" to avoid conflicts`
                    : "Folder creation was successful."
            })
        }

        return res.status(400).json({
            message: "Folder creation was unsuccessful."
        })
    })
]

export const getFolder = expressAsyncHandler(async (req, res) => {
    const folderId = req.params.id
    const userId = req.user.id;

    const folder = await prisma.folder.findFirst({
        where: { 
            id: folderId,
            userId: userId 
        },
        include: { 
            files: true,
            subfolders: {
                include: {
                    _count: {
                        select: {
                            files: true,
                            subfolders: true
                        }
                    }
                }
            },
            parent: {
                select: {
                    id: true,
                    name: true
                }
            },
            _count: {
                select: {
                    files: true,
                    subfolders: true
                }
            }
        }
    })

    if (folder) {
        return res.status(200).json({
            ...folder,
            message: "Folder retrieved successfully."
        })
    }

    return res.status(404).json({
        message: "Folder not found or you don't have permission to access it."
    })
})

export const getAllFolders = expressAsyncHandler(async (req, res)=>{
    const userId = req.user.id;
    const { parentId } = req.query; // Optional query parameter to get folders under a specific parent

    const whereClause = {
        userId: userId,
        parentId: parentId || null // If no parentId provided, get root folders (parentId = null)
    };

    const folders = await prisma.folder.findMany({
        where: whereClause,
        include: {
            _count: {
                select: {
                    files: true,
                    subfolders: true
                }
            },
            parent: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
        orderBy: {
            name: 'asc'
        }
    })

    return res.status(200).json({
        folders,
        parentFolder: parentId ? await prisma.folder.findUnique({
            where: { id: parentId },
            select: { id: true, name: true, parentId: true }
        }) : null,
        message: parentId ? "Subfolders retrieved successfully." : "Root folders retrieved successfully."
    });
})

export const updateFolder = [
    validateFolderName, validateRequest, expressAsyncHandler(async (req, res) => {
        const folderId = req.params.id;
        const { folderName } = req.body;
        const userId = req.user.id;

        // Check if folder exists and belongs to user
        const existingFolder = await prisma.folder.findFirst({
            where: {
                id: folderId,
                userId: userId
            }
        });

        if (!existingFolder) {
            return res.status(404).json({
                message: "Folder not found or you don't have permission to update it."
            });
        }

        // Generate unique folder name to handle duplicates
        const uniqueFolderName = await generateUniqueFolderName(folderName, userId, existingFolder.parentId);

        const updatedFolder = await prisma.folder.update({
            where: { id: folderId },
            data: { name: uniqueFolderName }
        });

        await updateFolderHierarchyTimestamps(folderId, userId); // Update timestamps for all parent folders
        
        return res.status(200).json({
            ...updatedFolder,
            message: uniqueFolderName !== folderName 
                ? `Folder renamed to "${uniqueFolderName}" to avoid conflicts`
                : "Folder updated successfully."
        });
    })
]

export const deleteFolder = expressAsyncHandler(async (req, res) => {
    const folderId = req.params.id;
    const userId = req.user.id;
    const { force } = req.query; // Add ?force=true to URL for force delete

    // Check if folder exists and belongs to user
    const existingFolder = await prisma.folder.findFirst({
        where: {
            id: folderId,
            userId: userId
        },
        include: {
            _count: {
                select: { 
                    files: true,
                    subfolders: true 
                }
            }
        }
    });

    if (!existingFolder) {
        return res.status(404).json({
            message: "Folder not found or you don't have permission to delete it."
        });
    }

    const parentId = existingFolder.parentId;

    if (force === 'true') {
        try {
            // Force delete: recursively delete all contents using transaction
            await prisma.$transaction(async (tx) => {
                await forceDeleteFolderContentsWithTransaction(folderId, userId, tx);
                await tx.folder.delete({ where: { id: folderId } });
            }, {
                timeout: 60000 // 1 minute timeout for large operations
            });

            // Update parent folder hierarchy timestamps
            await updateFolderHierarchyTimestamps(parentId, userId);

            return res.status(200).json({
                message: "Folder and all its contents deleted successfully."
            });
        } catch (error) {
            console.error('Force delete error:', error);
            return res.status(500).json({
                message: "Failed to delete folder and its contents."
            });
        }
    } else {
        // Normal delete: check if folder is empty
        if (existingFolder._count.files > 0) {
            return res.status(400).json({
                message: "Cannot delete folder that contains files. Please remove all files first or use force delete."
            });
        }

        if (existingFolder._count.subfolders > 0) {
            return res.status(400).json({
                message: "Cannot delete folder that contains subfolders. Please remove all subfolders first or use force delete."
            });
        }

        try {
            await prisma.folder.delete({
                where: { id: folderId }
            });

            // Update parent folder hierarchy timestamps
            await updateFolderHierarchyTimestamps(parentId, userId);

            return res.status(200).json({
                message: "Folder deleted successfully."
            });
        } catch (error) {
            console.error('Delete error:', error);
            return res.status(500).json({
                message: "Failed to delete folder."
            });
        }
    }
})

export const getFolderFiles = expressAsyncHandler(async (req, res) => {
    const folderId = req.params.id;
    const userId = req.user.id;

    // Check if folder exists and belongs to user
    const folder = await prisma.folder.findFirst({
        where: {
            id: folderId,
            userId: userId
        },
        include: {
            files: {
                select: {
                    id: true,
                    name: true,
                    size: true,
                    mimetype: true,
                    url: true,
                    createdAt: true,
                    updatedAt: true
                }
            },
            subfolders: {
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            files: true,
                            subfolders: true
                        }
                    }
                }
            },
            parent: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    if (!folder) {
        return res.status(404).json({
            message: "Folder not found or you don't have permission to access it."
        });
    }

    return res.status(200).json({
        folder: {
            id: folder.id,
            name: folder.name,
            parentId: folder.parentId,
            parent: folder.parent,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt
        },
        files: folder.files,
        subfolders: folder.subfolders,
        message: "Folder contents retrieved successfully."
    });
})

// Bulk delete multiple folders with force option
export const bulkDeleteFolders = expressAsyncHandler(async (req, res) => {
    const { folderIds, force = false } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(folderIds) || folderIds.length === 0) {
        return res.status(400).json({
            message: "Please provide an array of folder IDs to delete."
        });
    }

    try {
        const results = [];
        const parentIds = new Set();

        for (const folderId of folderIds) {
            const existingFolder = await prisma.folder.findFirst({
                where: {
                    id: folderId,
                    userId: userId
                },
                include: {
                    _count: {
                        select: { 
                            files: true,
                            subfolders: true 
                        }
                    }
                }
            });

            if (!existingFolder) {
                results.push({
                    folderId,
                    success: false,
                    message: "Folder not found or you don't have permission to delete it."
                });
                continue;
            }

            if (existingFolder.parentId) {
                parentIds.add(existingFolder.parentId);
            }

            if (force) {
                try {
                    await prisma.$transaction(async (tx) => {
                        await forceDeleteFolderContentsWithTransaction(folderId, userId, tx);
                        await tx.folder.delete({ where: { id: folderId } });
                    }, {
                        timeout: 60000
                    });

                    results.push({
                        folderId,
                        success: true,
                        message: "Folder and contents deleted successfully."
                    });
                } catch (error) {
                    results.push({
                        folderId,
                        success: false,
                        message: "Failed to delete folder and its contents."
                    });
                }
            } else {
                if (existingFolder._count.files > 0 || existingFolder._count.subfolders > 0) {
                    results.push({
                        folderId,
                        success: false,
                        message: "Folder is not empty. Use force delete to remove contents."
                    });
                    continue;
                }

                try {
                    await prisma.folder.delete({ where: { id: folderId } });
                    results.push({
                        folderId,
                        success: true,
                        message: "Folder deleted successfully."
                    });
                } catch (error) {
                    results.push({
                        folderId,
                        success: false,
                        message: "Failed to delete folder."
                    });
                }
            }
        }

        // Update all affected parent folder timestamps
        for (const parentId of parentIds) {
            await updateFolderHierarchyTimestamps(parentId, userId);
        }

        const successCount = results.filter(r => r.success).length;
        const failureCount = results.filter(r => !r.success).length;

        return res.status(200).json({
            results,
            summary: {
                total: folderIds.length,
                successful: successCount,
                failed: failureCount
            },
            message: `Bulk delete completed. ${successCount} folders deleted successfully, ${failureCount} failed.`
        });
    } catch (error) {
        console.error('Bulk delete error:', error);
        return res.status(500).json({
            message: "Failed to complete bulk delete operation."
        });
    }
});

// Utility functions for file operations (can be imported in file controllers)
export const getFileFolderId = async (fileId, userId) => {
    const file = await prisma.file.findFirst({
        where: {
            id: fileId,
            userId: userId
        },
        select: {
            folderId: true
        }
    });
    
    return file?.folderId || null;
};

// Function to update folder timestamps when file operations occur
export const updateFolderTimestampForFile = async (fileId, userId) => {
    const folderId = await getFileFolderId(fileId, userId);
    if (folderId) {
        await updateFolderHierarchyTimestamps(folderId, userId);
    }
};

// Function to update folder timestamps when files are added to a folder
export const updateFolderTimestampForUpload = async (folderId, userId) => {
    await updateFolderHierarchyTimestamps(folderId, userId);
};

