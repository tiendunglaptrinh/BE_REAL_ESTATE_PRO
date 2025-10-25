import express from "express";
import AdminController from "../controllers/AdminController.js";
import { adminAuthMiddleware, userAuthMiddleware } from "../middleware/AuthMiddleware.js";

const adminRouter = express.Router();

adminRouter.get("/all-accounts",adminAuthMiddleware,  AdminController.getAllAccounts);
adminRouter.get("/list-post-info",adminAuthMiddleware,  AdminController.getListPostMange);
adminRouter.get("/statistic-post",adminAuthMiddleware,  AdminController.statisticPost);
adminRouter.get("/list-status",adminAuthMiddleware,  AdminController.getListStatus);

adminRouter.post("/ban-account",adminAuthMiddleware,  AdminController.banAccount);
adminRouter.post("/unban-account",adminAuthMiddleware,  AdminController.unBanAccount);
adminRouter.post("/approve-status",adminAuthMiddleware,  AdminController.approveStatus);
adminRouter.post("/cancel-status",adminAuthMiddleware,  AdminController.cancelStatus);  

export default adminRouter;