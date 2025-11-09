import express from 'express';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import chatWithAI from '../controllers/aiChatBot.js';


const aiRouter =  express.Router();

aiRouter.post('/chat', isAuthenticated, chatWithAI);

export default aiRouter;