import express from 'express';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { runCode, submitCode } from '../controllers/userSubmission.js';

const submitRouter = express.Router();

submitRouter.post("/submit/:id",isAuthenticated,submitCode);

submitRouter.post("/run/:id",isAuthenticated,runCode);

export default submitRouter;