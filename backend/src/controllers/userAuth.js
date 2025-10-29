import User from "../models/userModel.js"
import { userValidator } from "../utils/validator.js";
import bcrypt, { hash } from "bcrypt";
import jwt from 'jsonwebtoken';
import { redisClient } from "../config/redis.js";
import Submission from "../models/submissionModel.js"

export const register = async (req,res) => {
    try {
        const {firstName,lastName,userName, emailId, password} = req.body;
        // console.log(req.body);

        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(409).send("Error: Username is already taken.");
        }

        userValidator(req.body);

        req.body.user = 'user'; // only users will be registered through this route

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        req.body.password = hashedPassword;

        // will already throw if email is already present in duplicate.
        const user = await User.create(req.body); 

        const token = jwt.sign({emailId,userName,role:'user'},process.env.JWT_SECRET_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge : 60*60*1000}); // here millisecond parameter
        // console.log(token);

        res.status(201).send("User Registered Successfully");

    } catch (error) {
        res.status(400).send(`Error : ${error}`);
    }
}
export const adminRegister = async (req,res) => {
    try {
        const {firstName,lastName,userName, emailId, password} = req.body;
        // console.log(req.body);

        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(409).send("Error: Username is already taken.");
        }

        userValidator(req.body);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        req.body.password = hashedPassword;

        // will already throw if email is already present in duplicate.
        const user = await User.create(req.body); 

        const token = jwt.sign({emailId,userName,role:'user'},process.env.JWT_SECRET_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge : 60*60*1000}); // here millisecond parameter
        // console.log(token);

        res.status(201).send("User Registered Successfully");

    } catch (error) {
        res.status(400).send(`Error : ${error}`);
    }
}

export const login = async(req,res) =>{
    try {
        let {emailId, userName, password} = req.body;

        // console.log(req.body);
        if (!(emailId || userName) || !password) {
            return res.status(400).json({
              success: false,
              message: "Username/Email and Password are required.",
            });
          }
        
        const isEmail = emailId ? true : false;
        const user = await User.findOne({ $or: [{ emailId: emailId },{ userName: userName }]});
        
        if(isEmail){
            userName = user?.userName;
        }
        else{
            emailId = user?.emailId;
        }
        // console.log(emailId);
        // console.log(userName);
        
        // console.log(user);
        const isMatch = await bcrypt.compare(password,user.password);

        if(!user || !isMatch)
            throw new Error("Invalid Credentials");
        
        // console.log(emailId);
        // console.log(userName);
        const token = user?jwt.sign({emailId,userName,role:user.role},process.env.JWT_SECRET_KEY,{expiresIn: 60*60}):false;
        // console.log(token);
        res.cookie('token',token,{maxAge : 60*60*1000}); // here millisecond parameter
        res.status(200).send("User Logged In Successfully");
    } catch (error) {
        res.status(401).send(`Error : ${error}`);
    }
}

export const logout = async(req,res) =>{
    try {

        // console.log("logout called!");
        const {token} = req.cookies;
        if (!token) {
            return res.status(200).send("Already logged out.");
        }
        console.log(token);
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (verifyError) {
            res.cookie('token', '', { maxAge: 0, httpOnly: true });
            return res.status(401).send("Invalid token, logged out.");
        }
        // console.log(payload);

        await redisClient.set(`token:${token}`,"blocked");
        await redisClient.expireAt(`token:${token}`,payload.exp);
        res.cookie("token",null,{expireAt:new Date(Date.now())});
        res.status(503).send("User logged out succesfully!");
    } catch (error) {
        res.status(401).send('Error : ',error);
    }
}

export const deleteProfile = async (req,res) => {
    try {
        
        const userId = req.result._id;
        await User.findByIdAndDelete(userId);
        await Submission.deleteMany({userId}); // you could have also done this using post
        res.status(200).send("User Deleted Successfully");

    } catch (error) {
            res.status(500).send("Internal Server Error : " + error);
    }
}


