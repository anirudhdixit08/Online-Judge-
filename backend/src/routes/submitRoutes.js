import express from 'express';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { getAllSubmissions, getSubmissionById, runCode, runCustom, submitCode } from '../controllers/userSubmission.js';
import submitCodeRateLimiter from '../middleware/rateLimiter.js';

const submitRouter = express.Router();

submitRouter.post("/submit/:id",isAuthenticated,submitCodeRateLimiter,submitCode);

submitRouter.post("/run/:id",isAuthenticated,submitCodeRateLimiter,runCode);

submitRouter.post("/run-custom/:id",isAuthenticated,submitCodeRateLimiter,runCustom);

submitRouter.get("/get-all-submissions",isAuthenticated,getAllSubmissions);

submitRouter.get("/:id",isAuthenticated,getSubmissionById);

export default submitRouter;