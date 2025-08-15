import express from "express";
import LocationController from "../controllers/LocationController.js";
import { adminAuthMiddleware, userAuthMiddleware } from "../middleware/AuthMiddleware.js";

const locationRouter = express.Router();

locationRouter.get("/all", LocationController.getLocation);
locationRouter.get("/province", LocationController.getProvince);
locationRouter.get("/province/:provinceCode/ward", LocationController.getWardFromProvince);

export default locationRouter;