import express from 'express';
import { register, login,logout, adminRegister,deleteProfile } from '../controllers/userAuth.js';
import { isAuthenticated,isAuthorised } from '../middleware/authMiddleware.js';

const authRouter = express.Router();


authRouter.post('/register',register);

authRouter.post('/login',login);

authRouter.post("/sendotp", sendOTP)

authRouter.post('/logout',isAuthenticated,logout);

authRouter.post('/admin/register',isAuthorised,adminRegister)

authRouter.delete('/delete',isAuthenticated,deleteProfile);

// authRouter.get('/get-profile',getProfile);  

export default authRouter;