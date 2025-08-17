import { Router } from "express";
import { changeFileName, deleteMultipleFiles, deleteSingleFile, getAllFiles, getSingleFile, uploadMultipleFiles, uploadSingleFile } from "../controllers/fileController.js";
import { isOwner, requireAuth } from "../configs/auth.js";

export const fileRouter = new Router();

// file Operations
// create
fileRouter.post("/upload", requireAuth, uploadSingleFile);
fileRouter.post("/upload-multiple", requireAuth, uploadMultipleFiles);
// // read
fileRouter.get("/m/0", requireAuth, getAllFiles);
fileRouter.get("/m/:id", requireAuth, getSingleFile)
// // update name
fileRouter.put("/m/:id", requireAuth, isOwner, changeFileName)
// // delete
fileRouter.delete("/m/delete-multiple", requireAuth, isOwner, deleteMultipleFiles)
fileRouter.delete("/m/:id", requireAuth, isOwner, deleteSingleFile)

// // share file
// fileRouter.post("/m/:id/share", requireAuth)
// // revoke share access
// fileRouter.delete("/m/:id/share", requireAuth)
// // download
// fileRouter.get("/m/:id/download", requireAuth)

// // folder operations
// fileRouter.post("/folders", requireAuth);

// fileRouter.get("/folders/:id", requireAuth);
// fileRouter.get("/folders/:id/files", requireAuth);

// fileRouter.put("/folders/:id", requireAuth);

// fileRouter.delete("/folders/:id", requireAuth);

// fileRouter.post("/folders/:id/share", requireAuth);
// fileRouter.delete("/folders/:id/share", requireAuth);
