import express from "express";
import AdminController from "../controllers/AdminController.js";
import { adminAuthMiddleware, authMiddleware } from "../middleware/AuthMiddleware.js";

const adminRouter = express.Router();

adminRouter.get("/all-accounts",adminAuthMiddleware,  AdminController.getAllAccounts);

export default adminRouter;