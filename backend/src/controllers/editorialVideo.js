import {v2 as cloudinary} from "cloudinary";
import Problem from "../models/problemModel.js";
import User from "../models/userModel.js"; 
import Editorial from "../models/editorialModel.js";

const generateUploadSignature = async (req,res) => {
    try {
        
        const {problemId, userId} = req.body;

        // verifying if problem exists or not
        const problem = await Problem.findById(problemId);
        if(!problem){
            return res.status(404).json({error : 'Problem Not Found !'});
        }

        // generating unique public id for the video
        const timeStamp = Math.round(new Date().getTime() / 1000);
        const publicId = `algoforge-editorials/${problemId}`

    } catch (error) {
        
    }
}