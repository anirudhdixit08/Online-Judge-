import mongoose from "mongoose";
const {Schema } = mongoose;

const submissionSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    problemId : {
        type : Schema.Types.ObjectId,
        ref : 'Problem',
        required : true
    },
    code : {
        type : String,
        required : true
    },
    language : {
        type : String,
        enum : ['c++', 'java', 'python', 'c', 'javascript'],
        required : true
    },
    status : {
        type : String,
        enum : ['pending','accepted','wrong answer','error'],
        default : 'pending'
    },
    runtime : {
        type : Number, // in seconds
        default : 0
    },
    memory : {
        type : Number, // in KB
        default : 0
    },
    errorMessage : {
        type : String,
        default : ''
    },
    testCasesPassed : {
        type : Number,
        default : 0
    },
    totalTestCases : {
        type : Number,
        default : 0
    }
}, {timestamps : true});

submissionSchema.index({userId:1,problemId:1}); // compound index created.

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;