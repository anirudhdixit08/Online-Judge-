import express from 'express';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { runCode, submitCode } from '../controllers/userSubmission.js';
import submitCodeRateLimiter from '../middleware/rateLimiter.js';

const submitRouter = express.Router();

submitRouter.post("/submit/:id",isAuthenticated,submitCodeRateLimiter,submitCode);

submitRouter.post("/run/:id",isAuthenticated,submitCodeRateLimiter,runCode);

export default submitRouter;