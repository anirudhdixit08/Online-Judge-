import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { redisClient } from '../config/redis.js';

export const isAuthenticated = async(req,res,next) => {
    try {
        const {token} = req.cookies;
        if (!token){
            return res.status(401).send("Unauthorized: No token provided.");
        }

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (verifyError) {
            return res.status(401).send("Unauthorized: Invalid token.");
        }
        const {userName, emailId} = payload;
        if(!emailId || !userName){
            throw new Error('Invalid token');
        }

        const result = await User.findOne({ $or: [{ emailId: emailId },{ userName: userName }]});

        if(!result){
            throw new Error("User does not exist");
        }

        const isBlocked = await redisClient.exists(`token;${token}`);
        console.log("is blocked in redis : "+isBlocked);
        if(isBlocked){
            console.log("Token found in redis blocked list");
            throw new Error("Invalid token!");
        }

        req.result = result;

        next();

    } catch (error) {
        
    }
}