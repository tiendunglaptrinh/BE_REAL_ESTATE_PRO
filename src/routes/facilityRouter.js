import express from "express";
import FacilityController from "../controllers/FacilityController.js";
import { userAuthMiddleware } from "../middleware/AuthMiddleware.js";

const facilityRouter = express.Router();

facilityRouter.get("/all", FacilityController.getAllFacility);
// facilityRouter.post( "/add", userAuthMiddleware, FacilityController.addCategory );

export default facilityRouter;