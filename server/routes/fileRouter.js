import { Router } from "express";
import { changeFileName, deleteMultipleFiles, deleteSingleFile, getAllFiles, getFileDownloadUrl, getSingleFile, uploadMultipleFiles, uploadSingleFile } from "../controllers/fileController.js";
import { isOwner, requireAuth } from "../configs/auth.js";

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
// // update name
fileRouter.put("/m/:id", requireAuth, changeFileName)
// // delete
fileRouter.delete("/m/delete-multiple", requireAuth, deleteMultipleFiles)
fileRouter.delete("/m/:id", requireAuth, deleteSingleFile)

// // share file
// fileRouter.post("/m/:id/share", requireAuth)
// // revoke share access
// fileRouter.delete("/m/:id/share", requireAuth)

