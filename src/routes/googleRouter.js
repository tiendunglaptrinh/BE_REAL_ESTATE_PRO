import express from "express";
import { userAuthMiddleware } from "../middleware/AuthMiddleware.js";
import GoogleController from "../controllers/GoogleController.js";

const googleRouter = express.Router();

googleRouter.get("/google/callback", GoogleController.googleCallback);

export default googleRouter;