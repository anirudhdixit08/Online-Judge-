import express from 'express';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { submitCode } from '../controllers/userSubmission.js';

const submitRouter = express.Router();

submitRouter.post("/submit/:id",isAuthenticated,submitCode);

export default submitRouter;