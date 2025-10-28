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

    console.log("Create Problem Called!");

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