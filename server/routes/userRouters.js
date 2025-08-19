import { Router } from "express";
import { authenticateUser, loginUser, logoutUser, registerUser, getCurrentUser } from "../controllers/userController.js";

export const userRouters = new Router();

userRouters.post("/signup", registerUser)

userRouters.post("/login", loginUser)

userRouters.post("/logout", logoutUser)

userRouters.post("/authenticateUser", authenticateUser)

userRouters.get("/me", getCurrentUser)