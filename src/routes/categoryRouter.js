import express from "express";
import CategoryController from "../controllers/CategoryController.js";
import { adminAuthMiddleware, userAuthMiddleware } from "../middleware/AuthMiddleware.js";

const categoryRouter = express.Router();

categoryRouter.get("/all",  CategoryController.getAllCategory);
categoryRouter.get("/sell",  CategoryController.getSellCategory);
categoryRouter.get("/rent",  CategoryController.getRentCategory);

export default categoryRouter;