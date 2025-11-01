import express from 'express';
import { isAuthenticated, isAuthorised } from '../middleware/authMiddleware.js';
import { createProblem, updateProblem, deleteProblem, 
    getProblemById, getAllProblems,getProblemByFilter,
    getSolvedProblems, problemSubmissions,getProblemOfTheDay
} from '../controllers/userProblem.js';

const problemRouter = express.Router();


problemRouter.post('/create',isAuthorised,createProblem);

problemRouter.delete('/delete/:id',isAuthorised,deleteProblem);

problemRouter.put('/update/:id',isAuthorised,updateProblem);

// the order matters here for get
// static routes before dynamic routes
problemRouter.get('/all-problems',isAuthenticated,getAllProblems);

potdRouter.get('/potd', getProblemOfTheDay);

problemRouter.get('/solved-problems',isAuthenticated,getSolvedProblems);

problemRouter.get('/submissions/:id',isAuthenticated,problemSubmissions);

problemRouter.get('/', isAuthenticated, getProblemByFilter);

// this should be at last anythings that is unmatched by above will be this
problemRouter.get('/:pid',isAuthenticated,getProblemById);

export default problemRouter;