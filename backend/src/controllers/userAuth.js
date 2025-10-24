import User from "../models/userModel.js"
import { userValidator } from "../utils/validator.js";
import bcrypt, { hash } from "bcrypt";
import jwt from 'jsonwebtoken';

const register = async (req,res) => {
    try {
        const {firstName,lastName,userName, emailId, password} = req.body;

        userValidator(req.body);

        const salt = bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(password,salt);

        req.body.password = hashedPassword;

        jwt.sign({emailId,userName},process.env.JWT_SECRET_KEY,{expiresIn: 60*60});


        await User.create(req.body); // will already throw if email is already present in duplicate.
    } catch (error) {
        res.status(400).send(`Error : ${error}`);
    }
}