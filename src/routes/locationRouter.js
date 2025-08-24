import express from "express";
import LocationController from "../controllers/LocationController.js";
import { adminAuthMiddleware, userAuthMiddleware, authMiddleware } from "../middleware/AuthMiddleware.js";

const locationRouter = express.Router();

locationRouter.get("/all", LocationController.getLocation);
locationRouter.get("/province", LocationController.getProvince);
locationRouter.get("/province/:provinceCode/ward", LocationController.getWardFromProvince);

locationRouter.get("/geocode/:address",authMiddleware ,LocationController.geoCoding);

export default locationRouter;