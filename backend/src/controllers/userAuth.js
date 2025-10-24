import User from "../models/userModel.js"
import { userValidator } from "../utils/validator.js";
import bcrypt, { hash } from "bcrypt";
import jwt from 'jsonwebtoken';

export const register = async (req,res) => {
    try {
        const {firstName,lastName,userName, emailId, password} = req.body;

        userValidator(req.body);

        const salt = bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(password,salt);

        req.body.password = hashedPassword;

        // will already throw if email is already present in duplicate.
        const user = await User.create(req.body); 

        const token = jwt.sign({emailId,userName},process.env.JWT_SECRET_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge : 60*60*1000}); // here millisecond parameter

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
        const query = isEmail ? { emailId} : { username };

        const user = await User.findOne(query);
        
        const isMatch = bcrypt.compare(password,user.password);

        if(!user || !isMatch)
            throw new Error("Invalid Credentials");
        
        const token = jwt.sign({emailId,userName},process.env.JWT_SECRET_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge : 60*60*1000}); // here millisecond parameter
        res.status(200).send("User Logged In Successfully");
    } catch (error) {
        res.status(401).send(`Error : ${error}`);
    }
}
export const logout = async(req,res) =>{
    try {
        
    } catch (error) {
        
    }
}

