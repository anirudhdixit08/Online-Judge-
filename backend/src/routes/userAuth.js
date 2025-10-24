import express from 'express';
import { register, login,logout } from '../controllers/userAuth.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const authRouter = express.Router();


authRouter.post('/register',register);

authRouter.post('/login',login);

authRouter.post('/logout',isAuthenticated,logout);

// authRouter.get('/get-profile',getProfile);

export default authRouter;