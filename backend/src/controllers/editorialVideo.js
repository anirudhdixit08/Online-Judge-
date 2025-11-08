import {v2 as cloudinary} from "cloudinary";
import Problem from "../models/problemModel.js";
import User from "../models/userModel.js"; 
import Editorial from "../models/editorialModel.js";

export const generateUploadSignature = async (req,res) => {
    try {
        
        const {problemId} = req.params;

        const userId = req.result._id;

        // verifying if problem exists or not
        const problem = await Problem.findById(problemId);
        if(!problem){
            return res.status(404).json({error : 'Problem Not Found !'});
        }

        // check if the editorial already exists!
        const existingEditorial = await Editorial.findOne({problemId});
        if(existingEditorial){
            return res.status(409).json({error : 'Editorial for this problem already exists !'});
        }

        // generating unique public id for the video
        const timestamp = Math.round(new Date().getTime() / 1000);
        const publicId = `algoforge-editorials/${problemId}/${userId}_${timestamp}`;

        // payload or paramters for digital signature
        const uploadParams = {
            timestamp,
            public_id : publicId
        }

        // generating signature
        const signature = cloudinary.utils.api_sign_request(
            uploadParams,
            process.env.CLOUDINARY_API_SECRET
        );

        res.status(201).json({
            signature,
            timestamp,
            public_id : publicId,
            api_key : process.env.CLOUDINARY_API_KEY,
            cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
            upload_url : `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`
        });
    } catch (error) {
        res.status(500).json({
            error, 
            message : "Failed to generate cloudinary upload credentials!"
        });
    }
}

export const saveMetaData = async (req,res) => {
    try {
        
        const {
            problemId,
            cloudinaryPublicId,
            secureUrl,
            duration
        } = req.body;

        const userId = req.result._id;
        
        //verify the upload with cloudinary
        const cloudinaryResource = await cloudinary.api.resource(
            cloudinaryPublicId,
            {resource_type : 'video'}
        );

        if(!cloudinaryResource){
            return res.status(400).json({error : 'Video not found on cloudinary!'});
        }

        //check if the video already exists for the problem and user
        const existingEditorial = await Editorial.findOne({
            problemId,
            userId,
            cloudinaryPublicId
        });

        if(existingEditorial){
            return res.status(409).json({error : 'Video already exists!'});
        }

        const thumbnailUrl = cloudinary.url(cloudinaryResource.public_id, {
            resource_type : 'video',
            transformation : [
                {width : 400, height : 225, crop : 'fill'},
                {quality : 'auto'},
                {start_offset : 'auto'}
            ],
            format : 'jpg'
        });

        // create and save
        const editorial = await Editorial.create({
            problemId,
            userId,
            cloudinaryPublicId,
            secureUrl,
            duration : cloudinaryResource.duration || duration,
            thumbnailUrl
        });

        res.status(201).json({
            message : 'Editorial Solution Uploaded Successfully!',
            editorial : {
                id : editorial._id,
                thumbnailUrl : editorial.thumbnailUrl,
                duration : editorial.duration,
                uploadedAt : editorial.createdAt
            }
        });

    } catch (error) {
        res.status(500).json({
            error, 
            message : "Failed to save meta data !"
        });
    }
}

export const deleteEditorial = async (req,res) => {
    try {
        
        const {videoId } = req.params;
        const userId = req.result._id;

        const video = await Editorial.findOne(videoId);
        
        if(!video){
            console.log('jo');
            return res.status(404).json({success: false, message: 'Video Not Found !'});
        }

        if (video.userId.toString() != userId) {
            return res.status(403).json({success: false, message: 'You are not authorized to delete this editorial.'});
        }

        const deleteResult = await cloudinary.uploader.destroy(video.cloudinaryPublicId,{
            resource_type : 'video', 
            invalidate : true
        });

        console.log(deleteResult.result);

        if (deleteResult.result !== 'ok' && deleteResult.result !== 'not found') {
            console.warn(
                `Cloudinary delete for ${video.cloudinaryPublicId} returned: ${deleteResult.result}. Proceeding with DB delete.`
            );
        }
        await Editorial.findByIdAndDelete(video._id);

        res.status(200).json({message : "Video Deleted Successfully!"})

    } catch (error) {
        res.status(500).json({error,message:"Failed to delete editorial!"});
    }
}

export const getEditorialForProblem = async (req,res) => {
    try {
        const { problemId } = req.params;

        if (!problemId) {
            return res.status(400).json({ error: "Problem ID is required." });
        }

        const editorial = await Editorial.findOne({ problemId })
            .populate('userId', 'userName');

        if (!editorial) {
            return res.status(404).json({ error: "No editorial found for this problem." });
        }
        res.status(200).json(editorial);

    } catch (error) {
        res.status(500).json({
            error, 
            message: "Failed to fetch editorial!"
        });
    }
}