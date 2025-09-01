import express from "express";
import PaymentController from "../controllers/PaymentController.js";
import { adminAuthMiddleware, userAuthMiddleware, authMiddleware } from "../middleware/AuthMiddleware.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order/:amount", userAuthMiddleware,  PaymentController.createOrder);
paymentRouter.post("/payment-wallet/new", userAuthMiddleware,  PaymentController.paymentNewPostByWallet);

// paymentRouter.get("/capture-order", userAuthMiddleware,  PaymentController.captureOrder);
// paymentRouter.get("/get-status-order",userAuthMiddleware,  PaymentController.getOrderStatus);

export default paymentRouter;