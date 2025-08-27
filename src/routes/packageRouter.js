import express from "express";
import PackageController from "../controllers/PackageController.js";
import { adminAuthMiddleware, userAuthMiddleware, authMiddleware } from "../middleware/AuthMiddleware.js";

const packageRouter = express.Router();

packageRouter.get("/all", PackageController.getAllPackage);
packageRouter.get("/get-package-pricing", PackageController.getAllPackagePricing);
packageRouter.get("/get/:priority", PackageController.getPackagePricing);

export default packageRouter;