import express from 'express';
import { isAuthenticated, isAuthorised } from '../middleware/authMiddleware.js';
import { generateUploadSignature, saveMetaData, deleteEditorial } from '../controllers/editorialVideo.js';

const editorialRouter = express.Router();

editorialRouter.get("/create/:problemId",isAuthorised,generateUploadSignature);
editorialRouter.post("/save",isAuthorised,saveMetaData);
editorialRouter.delete("/delete/:videoId",isAuthorised,deleteEditorial);

export default editorialRouter;