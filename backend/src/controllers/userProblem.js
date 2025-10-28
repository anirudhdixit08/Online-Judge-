import { getLanguageById , submitBatch, submitToken} from "../utils/problemUtility.js";
import Problem from "../models/problemModel.js";
import User from "../models/userModel.js";

const getStatusDescription = (statusId) => {
    switch (statusId) {
        case 6: return "Compilation Error";
        case 5: return "Time Limit Exceeded";
        case 4: return "Wrong Answer";
        case 7: case 8: case 9: case 10: case 11: case 12:
            return "Runtime Error";
        case 13: case 14:
            return "System Error";
        default:
            return "Unknown Error";
    }
}

export const createProblem = async (req,res) => {

    const {title,description, difficulty, tags, visibleTestCases,
        hiddenTestCases,startCode,referenceCode,problemCreator} = req.body;

    const validationErrors = [];
    try {
        for (const {language,solutionCode} of referenceCode){
            const languageId = getLanguageById(language);
            // creating batch submissions for Judge0
            const submissions = visibleTestCases.map((element) => ({
                source_code : solutionCode,
                language_id : languageId,
                stdin : element.input,
                expected_output : element.output
            }));

            // this will be the array of objects with token as a key and value and
            // using this we will get the status of our submissions
            const submitResult = await submitBatch(submissions);

            const resultTokens = submitResult.map((value)=> value.token); // array of tokens
            // console.log(resultTokens);


            const testResults = await submitToken(resultTokens);
            // console.log(testResults);

            for (let i = 0; i < testResults.length; i++) {
                const test = testResults[i];
                if (test.status_id !== 3) {
                    const statusDescription = getStatusDescription(test.status_id);
                    let details = 'N/A';
                    if (test.status_id === 6) { // Compilation Error
                        details = test.compile_output ? Buffer.from(test.compile_output, 'base64').toString('utf-8') : 'No compile output.';
                    } else { // Runtime Error, TLE,
                        details = test.stderr ? Buffer.from(test.stderr, 'base64').toString('utf-8') : 'No runtime error output.';
                    }
                    // const stderr = test.stderr ? Buffer.from(test.stderr, 'base64').toString('utf-8') : 'N/A';
                    validationErrors.push(
                        `Failed for '${language}': ${statusDescription} on Visible Test Case #${i + 1}. (Details: ${details})`
                    );
                }
            }
        }

        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: "Reference code failed validation. Please fix these errors:",
                errors: validationErrors
            });
        }

        //now we can store the question in our Database
        const newProblem = await Problem.create({...req.body, 
            problemCreator : req.result._id}) // req.result we will get from our isAuthorised middleware

        await User.findByIdAndUpdate(req.result._id,
            { $push: { createdProblems: newProblem._id } } );

        return res.status(201).send("Problem Saved Successfully !");

    } catch (error) {
        return res.status(400).send("Error : " + error);
    }
}

export const updateProblem = async(req,res) => {
    const {id} = req.params;
    try {
        
        if(!id){
            return res.status(400).send("Missing problem ID field!");
        }

        const {title,description, difficulty, tags, visibleTestCases,
            hiddenTestCases,startCode,referenceCode,problemCreator} = req.body;

        const validationErrors = [];
        for (const {language,solutionCode} of referenceCode){
            const languageId = getLanguageById(language);


            const submissions = visibleTestCases.map((element) => ({
                source_code : solutionCode,
                language_id : languageId,
                stdin : element.input,
                expected_output : element.output
            }));

            const submitResult = await submitBatch(submissions);

            const resultTokens = submitResult.map((value)=> value.token);


            const testResults = await submitToken(resultTokens);

            for (let i = 0; i < testResults.length; i++) {
                const test = testResults[i];
                if (test.status_id !== 3) {
                    const statusDescription = getStatusDescription(test.status_id);
                    let details = 'N/A';
                    if (test.status_id === 6) { 
                        details = test.compile_output ? Buffer.from(test.compile_output, 'base64').toString('utf-8') : 'No compile output.';
                    } else { 
                        details = test.stderr ? Buffer.from(test.stderr, 'base64').toString('utf-8') : 'No runtime error output.';
                    }
                    validationErrors.push(
                        `Failed for '${language}': ${statusDescription} on Visible Test Case #${i + 1}. (Details: ${details})`
                    );
                }
            }
        }

        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: "Reference code failed validation. Please fix these errors:",
                errors: validationErrors
            });
        }

        const prob = await Problem.findById(id);
        if(!prob){
            return res.status(404).send("Invalid id field!");
        }

        const updatedProb = await Problem.findByIdAndUpdate(id, {...req.body}, {runValidators : true});
        return res.status(200).json({
            message: "Problem updated successfully!",
            problem: updatedProb
        });

    } catch (err) {
        return res.status("Error : "+ err);
    }
}

export const deleteProblem = async (req,res) => {
    const {id} = req.params;
    try {
        
        if(!id){
            return res.status(400).send("ID is missing");
        }

        const deletedProb = await Problem.findByIdAndDelete(id);
        if(!deletedProb){
            return res.status(400).send("Invalid problem id");
        }

        return res.status(200).send("Problem Deleted!");

    } catch (error) {
        return res.status(400).send("Error : + ",error);
    }
}

export const getProblemById = async (req,res) => {
    const {id} = req.params;
    try {
        
        if(!id){
            return res.status(400).send("ID is missing");
        }

        const prob = await Problem.findById(id);
        if(!prob){
            return res.status(400).send("Invalid problem id");
        }

        return res.status(200).send(prob);

    } catch (error) {
        return res.status(400).send("Error : + ",error);
    }
}

export const getAllProblems = async (req,res) => {
    try {
        const problems = await Problem.find({}).select('_id title difficulty tags');
        if(!problems || problems.length==0){
            return res.status(400).send("Problems are missing");
        }
        return res.status(200).json(problems);

    } catch (error) {
        return res.status(400).send("Error : " + error);
    }
}

export const getProblemByFilter = async (req,res) => {
    try {
        const { difficulty, tags, search, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (difficulty) {
            filter.difficulty = difficulty;
        }
        if (tags) {
            // assuiming tags are comma separated
            const tagsArray = tags.split(',').map(tag => tag.trim());
            filter.tags = { $all: tagsArray }; // $all = find docs containing all tags
        }
        if (search) {
            // case-insensitive search on the title
            filter.title = { $regex: search, $options: 'i' };
        }

        // pagination logic
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        
        const problems = await Problem.find(filter)
            .select('-hiddenTestCases -problemCreator')
            .sort({ createdAt: -1 }) // Show newest first
            .skip(skip)
            .limit(limitNum);

        // total count for pagination
        const totalProblems = await Problem.countDocuments(filter);

        if(!problems || problems.length === 0){
            return res.status(404).send("No problems found matching your criteria.");
        }

        return res.status(200).json({
            message: "Problems fetched successfully",
            problems,
            currentPage: pageNum,
            totalPages: Math.ceil(totalProblems / limitNum),
            totalProblems
        });

    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
}

export const getSolvedProblems = async(req,res) => {
    try {
        const solvedProblems = req.result.solvedProblems
        const count = solvedProblems.length;
        const userId = req.result._id;
        const user = await User.findById(userId).populate({
            path : 'solvedProblems',
            select : '_id title difficulty tags'
        });
        res.status(200).send(user.solvedProblems);

    } catch (error) {
        res.status(500).send('Server Error : '+ error);
    }
}