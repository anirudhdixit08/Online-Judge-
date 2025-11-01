import express from 'express';
import { getProblemOfTheDay } from '../controllers/problemController.js';

const potdRouter = express.Router();

potdRouter.get('/get-potd', getProblemOfTheDay);

export default potdRouter;