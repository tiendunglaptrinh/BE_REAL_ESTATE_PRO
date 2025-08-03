import express from "express";
import PostController from "../controllers/PostController.js";
import { authMiddleware } from "../middleware/AuthMiddleware.js";

const postRouter = express.Router();

postRouter.get('/get-posts', PostController.getPosts);
postRouter.get('/get-post/:id', PostController.getpost);
postRouter.get('/search-post/:search-info', PostController.getPostBySearch);
postRouter.get('/get-post/:province', PostController.getPostFilterProvince);
postRouter.get('/get-post/:ward', PostController.getPostFilterWard);
postRouter.post('/create/step1',authMiddleware, PostController.createPostStep1);
postRouter.post('/create/step2',authMiddleware, PostController.createPostStep2);
postRouter.post('/create/step3',authMiddleware, PostController.createPostStep3);

export default postRouter;