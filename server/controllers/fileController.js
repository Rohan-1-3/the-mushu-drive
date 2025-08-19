import expressAsyncHandler from "express-async-handler";
import multer from "multer";
import { v4 as uuid } from "uuid";
import { PrismaClient } from "@prisma/client";
import { supabase, generateFilePath } from "../configs/supabase.js";
import { generateUniqueFileName } from "../utils/nameResolution.js";

const prisma = new PrismaClient();

const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    }
});

const uploadSingle = upload.single("file");
const uploadMultiple = upload.array("files", 3);

const fileUpload = async (file, fileConfigs) => {
    const fileId = uuid();
    
    // Generate unique filename to handle duplicates
    const uniqueFileName = await generateUniqueFileName(
        file.originalname, 
        fileConfigs.userId, 
        fileConfigs.folderId
    );
    
    const filePath = generateFilePath(fileConfigs.userId, uniqueFileName);
    
    try {
        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('files') // Make sure this bucket exists in Supabase
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (uploadError) {
            console.error('Supabase upload error details:', {
                message: uploadError.message,
                statusCode: uploadError.statusCode,
                error: uploadError
            });
            throw new Error(`Failed to upload file to Supabase: ${uploadError.message}`);
        }

        console.log('File uploaded successfully to Supabase:', uploadData);

        // Get public URL for the uploaded file
        const { data: urlData } = supabase.storage
            .from('files')
            .getPublicUrl(filePath);

        console.log('Generated public URL:', urlData.publicUrl);

        // Save file metadata to Neon database
        return await prisma.file.create({
            data: {
                id: fileId,
                name: uniqueFileName, // Use the unique filename
                size: file.size,
                mimetype: file.mimetype,
                url: urlData.publicUrl,
                supabasePath: filePath,
                userId: fileConfigs.userId,
                folderId: fileConfigs.folderId
            }
        });
    } catch (error) {
        console.error('File upload process error:', error);
        throw error;
    }
}

export const uploadSingleFile = [
    uploadSingle,
    expressAsyncHandler(async (req, res, next) => {
        const file = req.file;
        const fileConfigs = {
            userId : req.user.id,
            folderId: req.body.folderId || null
        }
        
        if (file) {
            try {
                const fileData = await fileUpload(file, fileConfigs);
                return res.status(200).json({
                    message: "File uploaded successfully",
                    file: {
                        id: fileData.id,
                        name: fileData.name,
                        size: fileData.size,
                        mimetype: fileData.mimetype,
                        url: fileData.url,
                        private: fileData.private,
                        folderId: fileData.folderId,
                        userId: fileData.userId,
                        createdAt: fileData.createdAt
                    }
                });
            } catch (error) {
                console.error('File upload error:', error);
                return res.status(500).json({
                    error: "File upload failed",
                    details: error.message
                });
            }
        }

        return res.status(400).json({
            error: "File upload failed - no file provided"
        });
    })
]

export const uploadMultipleFiles = [
    uploadMultiple,
    expressAsyncHandler(async (req, res, next) => {
        const files = req.files
        const fileConfigs = {
            userId : req.user.id,
            folderId: req.body.folderId || null
        }
        const filesUploaded = []
        if (files) {
            try {
                for (const file of files) {
                    const fileData = await fileUpload(file, fileConfigs)
                    filesUploaded.push(fileData)
                }
                return res.status(200).json({
                    message: "Files uploaded successfully",
                    files: filesUploaded.map(file => ({
                        id: file.id,
                        name: file.name,
                        size: file.size,
                        mimetype: file.mimetype,
                        url: file.url,
                        private: file.private,
                        folderId: file.folderId,
                        userId: file.userId,
                        createdAt: file.createdAt
                    }))
                });
            } catch (error) {
                console.error('Multiple files upload error:', error);
                return res.status(500).json({
                    error: "Files upload failed",
                    details: error.message
                });
            }
        }
    })
]

export const getFileDownloadUrl = expressAsyncHandler(async (req, res, next) => {
    const fileId = req.params.id;
    
    const file = await prisma.file.findUnique({
        where: { id: fileId }
    });

    if (!file) {
        return res.status(404).json({ error: "File not found" });
    }

    // Check if user has access to this file
    if (file.userId !== req.user.id && file.private) {
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        // For private files, generate a signed URL (valid for 1 hour)
        if (file.private) {
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                .from('files')
                .createSignedUrl(file.supabasePath, 3600); // 1 hour expiry

            if (signedUrlError) {
                console.error('Error creating signed URL:', signedUrlError);
                return res.status(500).json({ 
                    error: "Failed to generate download URL",
                    details: signedUrlError.message 
                });
            }

            return res.status(200).json({
                downloadUrl: signedUrlData.signedUrl,
                expiresIn: 3600
            });
        } else {
            // For public files, return the public URL
            return res.status(200).json({
                downloadUrl: file.url
            });
        }
    } catch (error) {
        console.error('Error generating download URL:', error);
        return res.status(500).json({
            error: "Failed to generate download URL",
            details: error.message
        });
    }
});

export const getSingleFile = expressAsyncHandler(async (req, res, next)=>{
    const fileId = req.params.id;
    const file = await prisma.file.findUnique({
        where: { id: fileId },
        include: { user: true, folder: true }
    });

    if (!file) {
        return res.status(404).json({ error: "File not found" });
    }

    // Return file metadata with Supabase URL
    return res.status(200).json({
        ...file,
        downloadUrl: file.url // The public URL from Supabase
    });
})

export const getAllFiles = expressAsyncHandler(async (req, res, next)=>{
    const files = await prisma.file.findMany({
        where: { userId: req.user.id },
        include: { user: true, folder: true }
    });

   if (!files) {
       return res.status(404).json({ error: "No files found" });
   }

   // Add download URLs to each file
   const filesWithUrls = files.map(file => ({
       ...file,
       downloadUrl: file.url
   }));

   return res.status(200).json(filesWithUrls);
})

export const changeFileName = expressAsyncHandler(async (req, res, next) => {
    const fileId = req.params.id;
    const newName = req.body.name;
    const userId = req.user.id;

    // First get the current file to check ownership and get folder context
    const currentFile = await prisma.file.findFirst({
        where: { 
            id: fileId,
            userId: userId 
        }
    });

    if (!currentFile) {
        return res.status(404).json({
            error: "File not found or you don't have permission to rename it"
        });
    }

    // Generate unique name in case of duplicates
    const uniqueName = await generateUniqueFileName(newName, userId, currentFile.folderId);

    const file = await prisma.file.update({
        where: { id: fileId },
        data: { name: uniqueName }
    });

    if(file){
        return res.status(200).json({
            newName: uniqueName,
            fileId,
            message: uniqueName !== newName 
                ? `File renamed to "${uniqueName}" to avoid conflicts`
                : "File name updated successfully"
        });
    }

    return res.status(404).json({
        error: "File not found"
    });
});

export const deleteSingleFile = expressAsyncHandler(async (req, res, next)=>{
    const fileId = req.params.id;

    try {
        // First get the file to get the Supabase path
        const file = await prisma.file.findUnique({
            where: { id: fileId }
        });

        if (!file) {
            return res.status(404).json({
                error: "File not found"
            });
        }

        // Delete from Supabase storage
        if (file.supabasePath) {
            const { error: deleteError } = await supabase.storage
                .from('files')
                .remove([file.supabasePath]);

            if (deleteError) {
                console.error('Error deleting from Supabase:', deleteError);
                // Continue with database deletion even if Supabase deletion fails
            }
        }

        // Delete from database
        await prisma.file.delete({
            where: { id: fileId }
        });

        return res.status(200).json({
            message: "File deleted successfully"
        });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                error: "File not found"
            });
        }
        throw error; // Re-throw other errors for expressAsyncHandler
    }
});

export const deleteMultipleFiles = expressAsyncHandler(async (req, res, next)=>{
    const fileIds = req.body.fileIds;
    
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
        return res.status(400).json({
            error: "No file IDs provided or invalid format"
        });
    }
    
    try {
        // Get all files to delete from Supabase
        const files = await prisma.file.findMany({
            where: {
                id: {
                    in: fileIds
                }
            }
        });

        // Delete from Supabase storage
        const supabasePaths = files
            .filter(file => file.supabasePath)
            .map(file => file.supabasePath);

        if (supabasePaths.length > 0) {
            const { error: deleteError } = await supabase.storage
                .from('files')
                .remove(supabasePaths);

            if (deleteError) {
                console.error('Error deleting from Supabase:', deleteError);
                // Continue with database deletion even if Supabase deletion fails
            }
        }

        // Delete from database
        const result = await prisma.file.deleteMany({
            where: {
                id: {
                    in: fileIds
                }
            }
        });

        if (result.count === 0) {
            return res.status(404).json({
                error: "No files were found to delete"
            });
        }

        if (result.count === fileIds.length) {
            return res.status(200).json({
                message: "All files successfully deleted",
                deletedCount: result.count
            });
        }

        return res.status(200).json({
            message: "Some files were deleted successfully",
            deletedCount: result.count,
            totalRequested: fileIds.length
        });
    } catch (error) {
        console.error('Error deleting multiple files:', error);
        return res.status(500).json({
            error: "Failed to delete files",
            details: error.message
        });
    }
})