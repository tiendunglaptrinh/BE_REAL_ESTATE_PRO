import express from 'express';
import ContactController from '../controllers/ContactController.js';

import { userAuthMiddleware, adminAuthMiddleware} from '../middleware/AuthMiddleware.js';

const contactRouter = express.Router();

contactRouter.get("/all-sender", userAuthMiddleware,ContactController.getAllContactInSender);
contactRouter.get("/all-receive", userAuthMiddleware,ContactController.getAllContactInReceive);
contactRouter.post("/create", userAuthMiddleware, ContactController.createContact);

export default contactRouter;