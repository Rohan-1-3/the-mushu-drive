import expressAsyncHandler from "express-async-handler";
import multer from "multer";
import { v4 as uuid } from "uuid";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadSingle = upload.single("file");
const uploadMultiple = upload.array("files", 10);

const fileUpload = async (file, fileConfigs) => {
    const fileId = uuid();
    return await prisma.file.create({
        data: {
            id: fileId,
            name: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            buffer: file.buffer,
            userId: fileConfigs.userId,
            folderId: fileConfigs.folderId
        }
    });
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
            const fileData = await fileUpload(file, fileConfigs)
            return res.status(200).json({
                message: "File uploaded successfully",
                file: {
                    id: fileData.id,
                    name: fileData.name,
                    size: fileData.size,
                    mimetype: fileData.mimetype,
                    private: fileData.private,
                    folderId: fileData.folderId,
                    userId: fileData.userId
                }
            });
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
                    private: file.private,
                    folderId: file.folderId,
                    userId: file.userId
                }))
            });
        }
    })
]

export const getSingleFile = expressAsyncHandler(async (req, res, next)=>{
    const fileId = req.params.id;
    const file = await prisma.file.findUnique({
        where: { id: fileId },
        include: { user: true, folder: true }
    });

    if (!file) {
        return res.status(404).json({ error: "File not found" });
    }

    return res.status(200).json(file);
})

export const getAllFiles = expressAsyncHandler(async (req, res, next)=>{
    const files = await prisma.file.findMany({
        where: { userId: req.user.id },
        include: { user: true, folder: true }
    });

   if (!files) {
       return res.status(404).json({ error: "No files found" });
   }

   return res.status(200).json(files);
})

export const changeFileName = expressAsyncHandler(async (req, res, next) => {
    const fileId = req.params.id;
    const newName = req.body.name;

    const file = await prisma.file.update({
        where: { id: fileId },
        data: { name: newName }
    });

    if(file){
        return res.status(200).json({
            newName,
            fileId,
            message: "File name updated successfully"
        });
    }

    return res.status(404).json({
        error: "File not found"
    });
});

export const deleteSingleFile = expressAsyncHandler(async (req, res, next)=>{
    const fileId = req.params.id;

    try {
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
})