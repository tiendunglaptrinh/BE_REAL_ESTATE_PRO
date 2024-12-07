import express from "express";
import SiteController from "../controllers/SiteController.js";

const siteRouter = express.Router();
siteRouter.use("/", SiteController.index);

export default siteRouter;