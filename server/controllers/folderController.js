import prismaService from "../services/prismaService.js";
import expressAsyncHandler from "express-async-handler";
import { v4 as uuid } from "uuid";
import { validateRequest } from "../configs/validateRequest.js";
import { body } from "express-validator";
import { generateUniqueFolderName } from "../utils/nameResolution.js";
import { supabase } from "../configs/supabase.js";
import { forceDeleteFolderContentsWithTransaction, getAllFilesRecursive, getAllFolderIdsRecursive, updateFolderHierarchyTimestamps } from "../utils/fileAndFolders.js";

const prisma = prismaService.getClient();

const validateFolderName = [
    body("folderName").trim().notEmpty().withMessage("Folder name cannot be empty.").bail()
        .isLength({ min: 1, max: 30 }).withMessage("Folder name length to be between 1 and 30.")
        .escape()
]

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
                    id: folder.id,
                    name: folder.name,
                    createdAt: folder.createdAt,
                    parentId: folder.parentId,
                    userId: folder.userId,
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
                id: folder.id,
                name: folder.name,
                createdAt: folder.createdAt,
                parentId: folder.parentId,
                userId: folder.userId,
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
            folders: folders.map(folder => ({
                id: folder.id,
                name: folder.name,
                createdAt: folder.createdAt,
                parentId: folder.parentId,
                userId: folder.userId,
            })),
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
                createdAt: folder.createdAt,
                parentId: folder.parentId,
                userId: folder.userId,
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

export const shareFolder = expressAsyncHandler(async (req, res)=>{
    console.log("Sharing folder");
    const folderId = req.params.id;
    const userId = req.user.id;
    const { shareTime } = req.body; // in seconds

    // Check folder ownership
    const folder = await prisma.folder.findFirst({
        where: { id: folderId, userId }
    });
    if (!folder) {
        return res.status(404).json({ error: "Folder not found or you don't have permission to share it." });
    }
    console.log("Sharing folder");
    // Get all files recursively
    const files = await getAllFilesRecursive(folderId);
    console.log("Sharing folder");
    // Get all folder IDs recursively
    const folderIds = await getAllFolderIdsRecursive(folderId);
    console.log(files, folderIds);

    if (files.length === 0 && folderIds.length === 0) {
        return res.status(404).json({ error: "No files or folders found in this folder or its subfolders." });
    }

    // Delete previous sharedFile records for these files and user
    if (files.length > 0) {
        await prisma.sharedFile.deleteMany({
            where: {
                fileId: { in: files.map(f => f.id) },
                userId
            }
        });
    }
    // Delete previous sharedFolder records for these folders and user
    if (folderIds.length > 0) {
        await prisma.sharedFolder.deleteMany({
            where: {
                folderId: { in: folderIds },
                userId
            }
        });
    }

    // Create signed URLs and sharedFile records
    const results = [];
    try{
        for (const file of files) {
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('files')
            .createSignedUrl(file.supabasePath, shareTime);

        if (signedUrlError) {
            results.push({
                fileId: file.id,
                error: signedUrlError.message
            });
            continue;
        }

        await prisma.sharedFile.create({
            data: {
                id: uuid(),
                fileId: file.id,
                userId,
                expiresAt: new Date(Date.now() + shareTime * 1000),
                link: signedUrlData.signedUrl
            }
        });

        results.push({
            fileId: file.id,
            downloadUrl: signedUrlData.signedUrl
        });
    }

    // Create sharedFolder records for all folders
    for (const fId of folderIds) {
        // Generate a unique link for the folder (could be a UUID or a custom URL)
        const folderLink = uuid();
        await prisma.sharedFolder.create({
            data: {
                id: uuid(),
                folderId: fId,
                userId,
                expiresAt: new Date(Date.now() + shareTime * 1000),
                link: folderLink
            }
        });
        results.push({
            folderId: fId,
            folderLink
        });
    }
    }catch(err){
        console.error("Error sharing folder:", err);
        return res.status(500).json({ error: "Failed to share folder." });
    }

    return res.status(200).json({
        message: "Folder and its contents shared successfully.",
        results
    });
})

// Unshare a folder and all its subfolders/files
export const unshareFolder = expressAsyncHandler(async (req, res) => {
    const folderId = req.params.id;
    const userId = req.user.id;

    // Check folder ownership
    const folder = await prisma.folder.findFirst({
        where: { id: folderId, userId }
    });
    if (!folder) {
        return res.status(404).json({ error: "Folder not found or you don't have permission to unshare it." });
    }

    // Get all files recursively
    const files = await getAllFilesRecursive(folderId);
    // Get all folder IDs recursively
    const folderIds = await getAllFolderIdsRecursive(folderId);

    // Delete sharedFile records for these files and user
    if (files.length > 0) {
        await prisma.sharedFile.deleteMany({
            where: {
                fileId: { in: files.map(f => f.id) },
                userId
            }
        });
    }
    // Delete sharedFolder records for these folders and user
    if (folderIds.length > 0) {
        await prisma.sharedFolder.deleteMany({
            where: {
                folderId: { in: folderIds },
                userId
            }
        });
    }

    return res.status(200).json({
        message: "Folder and its contents unshared successfully."
    });
});

export const getSharedFolder = expressAsyncHandler(async (req, res)=>{
    const folderId = req.params.id;

    // Find the sharedFolder record for this folder that is not expired
    const sharedFolder = await prisma.sharedFolder.findFirst({
        where: {
            folderId,
            expiresAt: {
                gte: new Date()
            }
        },
        include: {
            folder: {
                include: {
                    files: {
                        select: {
                            id: true,
                            name: true,
                            size: true,
                            mimetype: true,
                            userId: true,
                            folderId: true,
                            updatedAt: true
                        }
                    },
                    subfolders: {
                        include: {
                            files: true
                        }
                    }
                }
            },
            user: {
                select: {
                    id: true,
                    username: true
                }
            }
        }
    });

    if (!sharedFolder) {
        return res.status(404).json({ error: "Shared folder not found or link expired." });
    }

    return res.status(200).json({
        message: "Shared folder retrieved successfully.",
        folder: sharedFolder.folder,
        sharedBy: sharedFolder.user,
        sharedFolderId: sharedFolder.id,
        expiresAt: sharedFolder.expiresAt
    });
})
