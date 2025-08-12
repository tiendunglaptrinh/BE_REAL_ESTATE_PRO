import express from "express";
import SiteController from "../controllers/SiteController.js";
import JWTService from "../services/jwtService.js"

const siteRouter = express.Router();

siteRouter.post("/refresh-token", JWTService.refreshTokenService);
export default siteRouter;