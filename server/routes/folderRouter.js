import { Router } from "express";
import { hasAccess, isOwner, requireAuth } from "../configs/auth.js";
import { 
    createFolder, 
    getAllFolders, 
    getFolder, 
    updateFolder, 
    deleteFolder, 
    getFolderFiles,
    bulkDeleteFolders,
} from "../controllers/folderController.js";

export const folderRouter = new Router();

// Folder operations
folderRouter.post("/create", requireAuth, createFolder);

folderRouter.get("/f/0", requireAuth, getAllFolders);
folderRouter.get("/f/:id", requireAuth, getFolder);
folderRouter.get("/f/:id/files", requireAuth, getFolderFiles);

folderRouter.put("/f/:id", requireAuth, updateFolder);

folderRouter.delete("/f/:id", requireAuth, deleteFolder);
folderRouter.post("/bulk-delete", requireAuth, bulkDeleteFolders);

// folderRouter.put("/f/:id/move", requireAuth, moveFolder);
// folderRouter.post("/f/:id/share", requireAuth, shareFolder);
// folderRouter.delete("/f/:id/share", requireAuth, unshareFolder);