import express from "express";
import AccountController from "../controllers/AccountController.js";
import { userAuthMiddleware, authMiddleware } from "../middleware/AuthMiddleware.js";

const accountRouter = express.Router();

accountRouter.post("/create/step1", AccountController.createAccountStep1);
accountRouter.post("/create/step2", AccountController.createAccountStep2);
accountRouter.post("/create/step3", AccountController.createAccountStep3);
accountRouter.post("/create/step4", AccountController.createAccountStep4);
accountRouter.post("/login", AccountController.login);

accountRouter.get("/get-info", userAuthMiddleware, AccountController.getInfoUser);
accountRouter.patch("/update-info", userAuthMiddleware, AccountController.updateInfo);

// api return currentUser for authenticate by session cookie
accountRouter.get('/me', authMiddleware, AccountController.getCurrentUser);
accountRouter.get('/contact', authMiddleware, AccountController.getConTact);
accountRouter.get('/wallet', authMiddleware, AccountController.getMoneyWallet);

export default accountRouter;