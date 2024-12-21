import express from "express";
import SiteController from "../controllers/SiteController.js";
import { refreshTokenService } from "../services/jwtService.js"

const siteRouter = express.Router();

siteRouter.post("/refresh-token", refreshTokenService);
export default siteRouter;