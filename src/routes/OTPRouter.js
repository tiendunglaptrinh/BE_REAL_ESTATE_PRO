import express from "express";
import {userAuthMiddleware} from "../middleware/AuthMiddleware.js";
import OTPController from "../controllers/OTPController.js";

const OTPRouter = express.Router();

OTPRouter.post("/resend", OTPController.resendOTP);

export default OTPRouter;