import express from 'express';
import { login, register ,logout, sendVerifyOtp,verifyAccount,isAuthenticated,sendResetOtp, resetPassword} from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();
export default authRouter;