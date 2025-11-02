import express from 'express';
import { register, login,logout,
    adminRegister,deleteProfile,sendOTP,getAllAdmins } from '../controllers/userAuth.js';
import { isAuthenticated,isAuthorised } from '../middleware/authMiddleware.js';
import { getDashboardStats, getRecentActivity,
    getRecentCreatedProblems } from '../controllers/userDashboard.js';

const authRouter = express.Router();


authRouter.post('/register',register);

authRouter.post('/login',login);

authRouter.post("/sendotp", sendOTP)

authRouter.post('/logout',logout);

authRouter.post('/admin/register',isAuthorised,adminRegister)

authRouter.get('/dashboard-stats',isAuthenticated,getDashboardStats);

authRouter.get('/recent-activity',isAuthenticated,getRecentActivity);

authRouter.get('/recent-created-problems', isAuthenticated, isAuthorised, getRecentCreatedProblems);

authRouter.delete('/delete',isAuthenticated,deleteProfile);

authRouter.get('/all-admins',isAuthorised,getAllAdmins);

authRouter.get('/check',isAuthenticated,(req,res) => {

    // any error will already be handled by isAuthenticated Middleware.
    
    const reply = {
        firstName : req.result.firstName,
        userName : req.result.userName,
        emailId : req.result.emailId,
        _id : req.result._id,
        role : req.result.role
    };

    res.status(200).json({
        user : reply,
        message : 'Valid User!'
    });

})

// authRouter.get('/get-profile',getProfile);  

export default authRouter;