import express from 'express';
import { isAuthenticated, isAuthorised } from '../middleware/authMiddleware.js';
import { createProblem } from '../controllers/userProblem.js';

const problemRouter = express.Router();


problemRouter.post('/create',isAuthorised,createProblem);

// problemRouter.get('/:id',isAuthenticated,fetchProblemById);

// problemRouter.get('/',isAuthenticated,fetchAllProblems);

// problemRouter.patch('/:id',isAuthorised,updateProblem);

// problemRouter.delete('/:id',isAuthorised,deleteProblem);

// problemRouter.get('/solved-problems',isAuthenticated,fetchSolvedProblems);

export default problemRouter;