import express from "express";
import PostController from "../controllers/PostController.js";

const postRouter = express.Router();

postRouter.get('/all-posts', PostController.getAllPost);
postRouter.post('/create', PostController.create);

export default postRouter;