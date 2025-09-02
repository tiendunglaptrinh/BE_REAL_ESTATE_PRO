import express from "express";
import MessageController from "../controllers/MessageController.js";
import {userAuthMiddleware} from "../middleware/AuthMiddleware.js";

const messageRouter = express.Router();

messageRouter.post("/send-message", userAuthMiddleware, MessageController.sendMessageToChatBot);
messageRouter.get("/get-conversation", userAuthMiddleware, MessageController.getMessageConversation);

export default messageRouter;