import User from "../models/userModel.js"
import { userValidator } from "../utils/validator.js";
import bcrypt, { hash } from "bcrypt";
import jwt from 'jsonwebtoken';
import { redisClient } from "../redis.js";

export const register = async (req,res) => {
    try {
        const {firstName,lastName,userName, emailId, password} = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).send("Error: Username is already taken.");
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(409).send("Error: Username is already taken.");
        }

        userValidator(req.body);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        req.body.password = hashedPassword;

        // will already throw if email is already present in duplicate.
        const user = await User.create(req.body); 

        const token = jwt.sign({emailId,userName},process.env.JWT_SECRET_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge : 60*60*1000}); // here millisecond parameter
        console.log(token);

        res.status(201).send("User Registered Successfully");

    } catch (error) {
        res.status(400).send(`Error : ${error}`);
    }
}

export const login = async(req,res) =>{
    try {
        const {emailId, userName, password} = req.body;

        if (!(emailId || userName) || !password) {
            return res.status(400).json({
              success: false,
              message: "Username/Email and Password are required.",
            });
          }
        
        const isEmail = emailId ? true : false;
        const query = isEmail ? { emailId} : { userName };

        const user = await User.findOne(query);
        
        const isMatch = await bcrypt.compare(password,user.password);

        if(!user || !isMatch)
            throw new Error("Invalid Credentials");
        
        const token = jwt.sign({emailId,userName},process.env.JWT_SECRET_KEY,{expiresIn: 60*60});
        console.log(token);
        res.cookie('token',token,{maxAge : 60*60*1000}); // here millisecond parameter
        res.status(200).send("User Logged In Successfully");
    } catch (error) {
        res.status(401).send(`Error : ${error}`);
    }
}
export const logout = async(req,res) =>{
    try {

        const {token} = res.cookies;
        console.log(token);
        const payload = jwt.decode(token);
        console.log(payload);

        await redisClient.set(`token:${token}`,"blocked");
        await redisClient.expireAt(`token:${token}`,payload.exp);
        res.cookie("token",null,{expireAt:new Date(Date.now())});
    } catch (error) {
        
    }
}

