import express from "express";
import StatusController from "../controllers/StatusController.js";
import { adminAuthMiddleware, userAuthMiddleware, authMiddleware } from "../middleware/AuthMiddleware.js";

const statusRouter = express.Router();

statusRouter.get("/get-lists", userAuthMiddleware,  StatusController.getPublishedStatus);
statusRouter.post("/create-status", userAuthMiddleware,  StatusController.createStatusByUser);


export default statusRouter;