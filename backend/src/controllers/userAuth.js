import User from "../models/userModel.js"
import { userValidator } from "../utils/validator.js";
import bcrypt, { hash } from "bcrypt";
import jwt from 'jsonwebtoken';
import { redisClient } from "../config/redis.js";
import Submission from "../models/submissionModel.js"
import crypto from 'crypto';
import { mailSender } from "../utils/mailSender.js";
import OTP from "../models/otpModel.js";
import otpGenerator from "otp-generator";
import { otpTemplate } from "../mail_templates/emailVerificationTemplate.js";
import { registrationTemplate } from "../mail_templates/registrationConfirmationTemplate.js";

import uploadOnCloudinary from "../utils/cloudinaryUploader.js";

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

export const sendOTP = async (req, res) => {
    try{

        //fetch email from request ki body
        const {emailId,userName} = req.body;
        console.log(userName);

        //check if user already exist
        const checkUserPresent = await User.findOne({emailId});
          

        //if User already exist, then return a response
        if(checkUserPresent)
        {
            // Return 401 Unauthorized status code with error message
            return res.status(401).json({
                success: false,
                message: "User already registered", 
            })
        }

        const checkUserNameTaken = await User.findOne({userName});

        console.log(checkUserNameTaken);

        if(checkUserNameTaken)
            {
                // Return 401 Unauthorized status code with error message
                return res.status(401).json({
                    success: false,
                    message: "UserName already taken", 
                })
            }

        //generate Otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        // console.log("OTP Generated: ",otp);

        //check unique otp or not
        const result = await OTP.findOne({otp: otp});

        while(result)
        {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = {emailId, otp};

        //create an entry for db
        const otpBody = await OTP.create(otpPayload);
        // console.log(otpBody);

        const emailTemplate = otpTemplate(otp);

        // Send Email using `mailsender.js`
        await mailSender (emailId, "Your OTP Code", emailTemplate);


        //return response successful
        res.status(200).json({
            success: true,
            message: "Otp Sent Succesfully",
            otp,
        });  

    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error While Sending OTP",
        });
    }
}

export const register = async (req,res) => {
    try {
        const {firstName,lastName,userName, emailId, password,otp} = req.body;
        if(!firstName || !lastName || !emailId || !password || !userName|| !otp){
            return res.status(403).json({
                success: false,
                message: "All fields are required.",
            });
        }
        // console.log(req.body);

        const recentOtp = await OTP.findOne({emailId}).sort({createdAt: -1});
        // console.log("Recent OTP: ", recentOtp);  //recentOtp is the Otp send to the user via mail which was then stored in db
        //validate OTP
        if(!recentOtp)
        {
            //OTP Not Found
            return res.status(400).json({
                success: false,
                message: "OTP Not Found.",
            });
        }
        else if(otp !== recentOtp.otp)
        {
            //Invalid OTP
            return res.status(400).json({
                success: false,
                message: "Invalid OTP.",
            });
        }

        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(409).send("Error: Username is already taken.");
        }

        userValidator(req.body);

        req.body.role = 'user'; // only users will be registered through this route

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        req.body.password = hashedPassword;

        delete req.body.otp;

        const userData = {
            firstName,
            lastName,
            userName,
            emailId,
            password: hashedPassword,
            role: 'user',
          };

          const profilePhotoLocalPath = req.file?.path;
          if (profilePhotoLocalPath) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
      
            if (uploadResult && uploadResult.secure_url) {
              userData.profilePhoto = uploadResult.secure_url;
            } else {
              return res.status(500).json({
                success: false,
                message: "Failed to upload profile photo. Please try again.",
              });
            }
          }

        // will already throw if email is already present in duplicate.
        const user = await User.create(userData); 

        const reply = {
            firstName : user.firstName,
            userName : user.userName,
            emailId : user.emailId,
            _id : user._id,
            role: 'user',
            profilePhoto : user.profilePhoto,
        }
        const token = jwt.sign({emailId,userName,role:'user'},process.env.JWT_SECRET_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge : 24*60*60*1000}); // here millisecond parameter
        // console.log(token);

        try {
            const subject = "Welcome to AlgoPractise!";
            const body = registrationTemplate(user.firstName, user.role);
            await mailSender(user.emailId, subject, body);
        } catch (emailError) {
            console.error("Welcome email failed to send:", emailError);
        }

        res.status(201).json({
            user : reply,
            message : "User Registered Successfully"
        });

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

        req.body.role = 'admin';

        // will already throw if email is already present in duplicate.
        const user = await User.create(req.body); 

        // const token = jwt.sign({emailId,userName,role:'admin'},process.env.JWT_SECRET_KEY,{expiresIn: 60*60});
        // res.cookie('token',token,{maxAge : 60*60*1000}); // here millisecond parameter
        // console.log(token);

        // here no need to set cookies as another admin will be creating another admin.

        try {
            const subject = "Welcome to AlgoPractise (Admin)!";
            const body = registrationTemplate(user.firstName, user.role);
            await mailSender(user.emailId, subject, body);
        } catch (emailError) {
            console.error("Admin welcome email failed to send:", emailError);
        }

        res.status(201).send("Admin Registered Successfully");

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
        const user = await User.findOne({ $or: [{ emailId: emailId },{ userName: userName }]}).select('+role');;
        
        if (!user) {
            throw new Error("User not found!");
        }

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

        const reply = {
            firstName : user.firstName,
            userName : user.userName,
            emailId : user.emailId,
            _id : user._id,
            role: user.role,
            profilePhoto: user.profilePhoto
        }

        res.cookie('token',token,{maxAge : 24*60*60*1000}); // here millisecond parameter
        res.status(200).json({
            user : reply,
            message : "LogIn Successful !"
        });
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
            return res.status(200).send("Invalid token, logged out.");
        }
        // console.log(payload);

        await redisClient.set(`token:${token}`,"blocked");
        // await redisClient.get(`token:${token}`);
        await redisClient.expireAt(`token:${token}`,payload.exp);
        res.cookie("token",null,{expireAt:new Date(Date.now())});
        res.status(200).send("User logged out succesfully!");
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

export const getAllAdmins = async (req, res) => {
    try {
      // Find all users with the role 'admin'
      const admins = await User.find({ role: 'admin' }).select('userName firstName lastName emailId');
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching admins",
        error: error.message
      });
    }
  };

export const getProfile = (req, res) => {
    try {
      if (!req.result) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const userProfile = req.result.toObject();
      delete userProfile.password;
      res.status(200).json(userProfile);
  
    } catch (error) {
      console.error("Error in getProfile:", error);
      res.status(500).json({ message: "Server error, could not get profile" });
    }
  };

export const updateProfile = async (req, res) => {
    try {
        const userId = req.result._id; 
        const { firstName, lastName, userName } = req.body;

        const updateData = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (userName) updateData.userName = userName;

        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            
            if (uploadResult && uploadResult.secure_url) {
                updateData.profilePhoto = uploadResult.secure_url;
            } else {
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload image to cloud.",
                });
            }
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const reply = {
            firstName: updatedUser.firstName,
            userName: updatedUser.userName,
            emailId: updatedUser.emailId,
            lastName: updatedUser.lastName,
            _id: updatedUser._id,
            role: updatedUser.role,
            profilePhoto: updatedUser.profilePhoto
        };

        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            user: reply
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "Username is already taken." });
        }
        res.status(500).json({ success: false, message: `Error: ${error.message}` });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = req.result; 

        if (!oldPassword || !newPassword) {
            throw new Error("Please provide both old and new passwords.");
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            throw new Error("Incorrect current password.");
        }
        if (oldPassword === newPassword) {
             throw new Error("New password cannot be the same as the old password.");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: "Password changed successfully!" 
        });

    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message || "Could not change password" 
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { emailId } = req.body;

        if (!emailId) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User is not registered with this email",
            });
        }
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        let result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }
        const otpPayload = { emailId, otp };
        await OTP.create(otpPayload);
        const emailBody = otpTemplate(otp); 
        
        await mailSender(
            emailId,
            "Reset Your Password - AlgoPractise",
            emailBody
        );

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully to your email",
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending OTP",
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { emailId, otp, newPassword, confirmPassword } = req.body;

        if (!emailId || !otp || !newPassword || !confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        const recentOtp = await OTP.findOne({ emailId }).sort({ createdAt: -1 });

        if (!recentOtp) {
            return res.status(400).json({
                success: false,
                message: "OTP not found or expired",
            });
        }

        if (otp !== recentOtp.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();
        await OTP.deleteOne({ _id: recentOtp._id });

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. You can now login.",
        });

    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting password",
        });
    }
};