import { Router } from "express";
import { changeFileName, deleteMultipleFiles, 
    deleteSharedFile, deleteSingleFile, 
    downloadFile, getAllFiles, 
    getAllSharedFiles, getFileDownloadUrl, 
    getSharedFileById, getSingleFile, shareAFile, 
    uploadMultipleFiles, uploadSingleFile } from "../controllers/fileController.js";
import { requireAuth } from "../configs/auth.js";

export const fileRouter = new Router();

// file Operations
// create
fileRouter.post("/upload", requireAuth, uploadSingleFile);
fileRouter.post("/upload-multiple", requireAuth, uploadMultipleFiles);
// // read
fileRouter.get("/m/0", requireAuth, getAllFiles);
fileRouter.get("/m/:id", requireAuth, getSingleFile)
// // download
fileRouter.get("/m/:id/download", requireAuth, getFileDownloadUrl)
fileRouter.get("/m/:id/download-file", requireAuth, downloadFile)
// // update name
fileRouter.put("/m/:id", requireAuth, changeFileName)
// // delete
fileRouter.delete("/m/delete-multiple", requireAuth, deleteMultipleFiles)
fileRouter.delete("/m/:id", requireAuth, deleteSingleFile)

// // share file
fileRouter.post("/m/:id/share", requireAuth, shareAFile)
// // revoke share access
fileRouter.delete("/m/:id/share", requireAuth, deleteSharedFile)

fileRouter.get("/m/:id/share", getSharedFileById)
fileRouter.get("/m/share/0", getAllSharedFiles)
