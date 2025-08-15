import express from "express";
import PropertyController from "../controllers/PropertyController.js";
import { userAuthMiddleware } from "../middleware/AuthMiddleware.js";

const propertyRouter = express.Router();

propertyRouter.get("/all", PropertyController.getAllProperty);
propertyRouter.post( "/add", userAuthMiddleware, PropertyController.addCategory );

export default propertyRouter;