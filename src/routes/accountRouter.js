import express from "express";
import AccountController from '../controllers/AccountController.js'

const accountRouter = express.Router();

accountRouter.get('/all-accounts', AccountController.getAllAccounts);

accountRouter.post('/create/step1', AccountController.createAccountStep1);
accountRouter.post('/create/step2', AccountController.createAccountStep2);
accountRouter.post('/create/step3', AccountController.createAccountStep3);
accountRouter.post('/login', AccountController.login)

export default accountRouter;