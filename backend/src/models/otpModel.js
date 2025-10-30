//Model 9
import mongoose from "mongoose";
//const mailSender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({
    emailId: {
        type: String,
        required: true,
    },

    otp: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5*60,
    },

});

//a function -> to send emails
// async function sendVerificationEmail(email, otp) {
//     try{
//         const mailResponse = await mailSender(email, "Verification Email from StudyNotion", otp);
//         console.log("Email Sent Successfully: ", mailResponse);
//     }
//     catch(err)
//     {
//         console.log("Error Occured while Sending Mails: ", err);
//         throw err;
//     }
// }

// otpSchema.pre("save", async function(next){
//     await sendVerificationEmail(this.email, this.otp);
//     next();
// })


const OTP = mongoose.model("OTP", otpSchema);

export default OTP;