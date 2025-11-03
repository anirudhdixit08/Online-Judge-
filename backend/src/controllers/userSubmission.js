import Problem from "../models/problemModel.js";
import Submission from "../models/submissionModel.js";
import User from "../models/userModel.js";
import { getLanguageById,submitBatch,submitToken } from "../utils/problemUtility.js";
import { getStatusDescription } from "./userProblem.js";

// export const submitCode = async (req,res) => {
//     try {
        
//         const problemId = req.params.id;
//         const userId = req.result._id;
//         let {code,language} = req.body;

//         if(language === 'cpp'){
//             language = 'c++';
//         }

//         if(!userId){
//             return res.status(401).send("Unauthorized: Please log in to run code.");
//         }
//         else if( !problemId || !code || !language){
//             return res.status(400).send('Some fields are missing!');
//         }

//         const problem = await Problem.findById(problemId);

//         // first we store the code in db with status pending and then update later
//         // suppose frontend se code aaya but judge0 se response nhi aaya or time lag gya
//         // then we should have code stored in our db
//         const submittedResult = await Submission.create({
//             userId,
//             problemId,
//             code,
//             language,
//             status :'pending',
//             totalTestcases : problem.hiddenTestCases.length + problem.visibleTestCases.length
//         });

//         // now submit this code to Judge0
//         const languageId = getLanguageById(language);
//         if (!languageId) {
//             return res.status(400).send(`Language '${language}' is not supported.`);
//         }
//         const visibleCases = problem.visibleTestCases || [];
//         const hiddenCases = problem.hiddenTestCases || [];
//         const allTestCases = visibleCases.concat(hiddenCases);

//         const submissions= allTestCases.map((testcase) => ({
//             source_code : code,
//             language_id : languageId,
//             stdin : testcase.input,
//             expected_output : testcase.output
//         }));

//         const submitResult = await submitBatch(submissions);
//         const resultTokens = submitResult.map((value)=> value.token);
//         const testResults = await submitToken(resultTokens);

//         // now we need to update submitted result
//         // for runtime add runtime of all cases
//         // for memory take maximum of all memory of test cases

//         let testCasesPassed = 0;
//         let runtime =0;
//         let memory =0;
//         let status = 'accepted';
//         let errorMessage = null;

//         for(let i=0; i<testResults.length; ++i){
//             const test = testResults[i];
//             if(test.status_id == 3){
//                 testCasesPassed++;
//                 runtime = runtime + parseFloat(test.time);
//                 memory = Math.max(memory,test.memory);
//             }
//             else if(test.status_id == 4){
//                 status = 'wrong answer';
//                 errorMessage = test.stderr;
//             }
//             else{
//                 status = 'error';
//                 errorMessage = test.stderr;
//             }
//         }

//         // store updated in Db
//         submittedResult.status = status;
//         submittedResult.testCasesPassed = testCasesPassed;
//         submittedResult.runtime = runtime;
//         submittedResult.memory = memory;
//         submittedResult.errorMessage = errorMessage;

//         await submittedResult.save();

//         if(status == 'accepted'){
//             if(!req.result.solvedProblems.includes(problemId)){
//                 req.result.solvedProblems.push(problemId);
//                 await req.result.save();
//             }
//         }
//         const accepted = (status =='accepted');
//         res.status(201).json({
//             accepted,
//             totalTestcases : submittedResult.totalTestCases,
//             testCasesPassed,
//             runtime,
//             memory 
//         });

//     } catch (error) {
//             return res.status(500).send("Internal Sever Error : "+ error);
//     }
// }

export const submitCode = async (req,res) => {
    try {
        const problemId = req.params.id;
        const userId = req.result._id;
        let {code,language} = req.body;

        if(language === 'cpp'){
            language = 'c++';
        }

        if(!userId){
            return res.status(401).json({ success: false, message: "Unauthorized: Please log in to run code." });
        }
        else if( !problemId || !code || !language){
            return res.status(400).json({ success: false, message: 'Some fields are missing!' });
        }

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ success: false, message: 'Problem not found!' });
        }

        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status :'pending',
            totalTestCases : problem.hiddenTestCases.length + problem.visibleTestCases.length 
        });

        const languageId = getLanguageById(language);
        if (!languageId) {
            return res.status(400).json({ success: false, message: `Language '${language}' is not supported.` });
        }

        const visibleCases = problem.visibleTestCases || [];
        const hiddenCases = problem.hiddenTestCases || [];
        const allTestCases = visibleCases.concat(hiddenCases);

        const submissions = allTestCases.map((testcase) => ({
            source_code : code,
            language_id : languageId,
            stdin : testcase.input,
            expected_output : testcase.output
        }));

        const submitResult = await submitBatch(submissions);
        const resultTokens = submitResult.map((value)=> value.token);
        const testResults = await submitToken(resultTokens);

        // --- FIX: Improved Status/Error Logic ---
        let testCasesPassed = 0;
        let totalRuntime = 0;
        let maxMemory = 0;
        let finalStatus = 'accepted';
        let finalErrorMessage = null;

        for(const test of testResults){
            if(test.status_id === 3){ // Accepted
                testCasesPassed++;
                totalRuntime += parseFloat(test.time);
                maxMemory = Math.max(maxMemory, test.memory);
            } else {
                finalStatus = getStatusDescription(test.status_id);
                
                if (test.status_id === 6) { // Compilation Error
                    finalErrorMessage = test.compile_output ? Buffer.from(test.compile_output, 'base64').toString('utf-8') : 'Compilation Error';
                } else if (test.stderr) { // Runtime Error, etc.
                    finalErrorMessage = Buffer.from(test.stderr, 'base64').toString('utf-8');
                } else { // Wrong Answer (no stderr)
                    finalErrorMessage = "Output did not match expected output.";
                }
                
                // Stop processing on the first error
                break; 
            }
        }

        // store updated in Db
        submittedResult.status = finalStatus;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.runtime = totalRuntime;
        submittedResult.memory = maxMemory;
        submittedResult.errorMessage = finalErrorMessage;

        await submittedResult.save();

        if(finalStatus === 'accepted'){
            if(!req.result.solvedProblems.includes(problemId)){
                req.result.solvedProblems.push(problemId);
                await req.result.save();
            }
        }
        
        const accepted = (finalStatus === 'accepted');
        
        res.status(201).json({
            accepted,
            status: finalStatus,
            error: finalErrorMessage,
            totalTestCases : submittedResult.totalTestCases,
            testCasesPassed,
            runtime: totalRuntime,
            memory: maxMemory 
        });

    } catch (error) {
            console.error("Submit Code Error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
    }
}

export const runCode = async (req,res) => {
    try {
        
        const problemId = req.params.id;
        const userId = req.result._id;
        let {code,language} = req.body;

        if(language === 'cpp'){
            language = 'c++';
        }

        if(!userId){
            return res.status(401).send("Unauthorized: Please log in to submit code.");
        }
        else if( !problemId || !code || !language){
            return res.status(400).send('Some fields are missing!');
        }

        const problem = await Problem.findById(problemId);


        // now submit this code to Judge0
        // const languageId = getLanguageById(language);

        const languageId = getLanguageById(language);
        if (!languageId) {
            return res.status(400).send(`Language '${language}' is not supported.`);
        }

        let testCasesToRun = [];
        let isCustomRun = false;
        let visibleTestCasesForResponse = [];

        // if (customInput !== undefined && customInput !== null) {

        //     isCustomRun = true;

        //      if (!problem.referenceCode || !Array.isArray(problem.referenceCode)) {
        //           return res.status(400).send(`Reference code definitions not found for this problem.`);
        //      }

        //     const referenceSolution = problem.referenceCode.find(rc => rc.language === language);
        //     if (!referenceSolution || !referenceSolution.solutionCode) {
        //          return res.status(400).send(`Reference solution for '${language}' not found or is empty for this problem.`);
        //     }

        //     const visibleCases = problem.visibleTestCases || [];
        //     const hiddenCases = problem.hiddenTestCases || [];
        //     const allTestCases = visibleCases.concat(hiddenCases);

        //     const submissions= allTestCases.map((testcase) => ({
        //         source_code : code,
        //         language_id : languageId,
        //         stdin : testcase.input,
        //         expected_output : testcase.output
        //     }));

        // const submitResult = await submitBatch(submissions);
        // const resultTokens = submitResult.map((value)=> value.token);
        // const testResults = await submitToken(resultTokens);
            

        // } else {
             const submissions= problem.visibleTestCases.map((testcase) => ({
                source_code : code,
                language_id : languageId,
                stdin : testcase.input,
                expected_output : testcase.output
            }));
    
            const submitResult = await submitBatch(submissions);
            const resultTokens = submitResult.map((value)=> value.token);
            const testResults = await submitToken(resultTokens);

            return res.status(201).json(testResults);
        // } 

    } catch (error) {
            return res.status(500).send("Internal Sever Error : "+ error);
    }
}

export const runCustom = async (req, res) => {
    try {
        const problemId = req.params.id;
        const userId = req.result._id;
        let { code, language, customInput } = req.body;

        if(language === 'cpp'){
            language = 'c++';
        }

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Please log in to run code."
            });
        }
        if (!problemId || !code || !language || customInput === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Code, language, problem ID, and customInput are required.'
            });
        }

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found!'
            });
        }

        const languageId = getLanguageById(language);
        if (!languageId) {
            return res.status(400).json({
                success: false,
                message: `Language '${language}' is not supported.`
            });
        }

        const referenceSolution = problem.referenceCode.find(rc => rc.language === language);
        if (!referenceSolution || !referenceSolution.solutionCode) {
            return res.status(400).json({ 
                success: false, 
                message: `Reference solution for '${language}' not found. Cannot run custom test.` 
            });
        }
        const refSubmission = {
            source_code: referenceSolution.solutionCode,
            language_id: languageId,
            stdin: customInput
        };

        const refSubmitResult = await submitBatch([refSubmission]);
        const refTestResult = (await submitToken([refSubmitResult[0].token]))[0];

        if (refTestResult.status_id > 4) {
            return res.status(400).json({
                success: false,
                message: "Custom input failed: The reference solution could not be executed.",
                error: refTestResult.stderr ? Buffer.from(refTestResult.stderr, 'base64').toString('utf-8') : "Execution error"
            });
        }
        
        const expectedOutput = refTestResult.stdout;

        const submissions = [{
            source_code: code,
            language_id: languageId,
            stdin: customInput,
            expected_output: expectedOutput
        }];

        const submitResult = await submitBatch(submissions);
        const resultTokens = submitResult.map((value) => value.token);
        const testResults = await submitToken(resultTokens);

        const userResult = testResults[0];

        let error = null;
        if (userResult.status_id === 6) { 
            error = userResult.compile_output ? Buffer.from(userResult.compile_output, 'base64').toString('utf-8') : 'Compilation Error';
        } else if (userResult.status_id > 4) { 
            error = userResult.stderr ? Buffer.from(userResult.stderr, 'base64').toString('utf-8') : getStatusDescription(userResult.status_id);
        }

        // Build the clean response object
        const response = {
            status: getStatusDescription(userResult.status_id),
            output: userResult.stdout,    
            expectedOutput: expectedOutput,                      
            error: error                                         
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error("Run Custom Code Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const getAllSubmissions = async (req, res) => {
  try {
    const userId = req.result._id;

    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter = { userId: userId };

    const totalSubmissions = await Submission.countDocuments(filter);

    if (totalSubmissions === 0) {
      return res.status(200).json({
        message: "No submissions found for this user.",
        submissions: [],
        currentPage: 1,
        totalPages: 0,
        totalSubmissions: 0
      });
    }

    const submissions = await Submission.find(filter)
      .sort({ createdAt: -1 }) 
      .populate('problemId', 'title difficulty tags') 
      .skip(skip)
      .limit(limitNum);

    const validSubmissions = submissions.filter(sub => sub.problemId);

    res.status(200).json({
      message: "Submissions fetched successfully",
      submissions: validSubmissions,
      currentPage: pageNum,
      totalPages: Math.ceil(totalSubmissions / limitNum),
      totalSubmissions
    });

  } catch (error) {
    console.error("Error in getAllSubmissions:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

export const getSubmissionById = async (req, res) => {
    try {
      const submissionId = req.params.id;
      const userId = req.result._id;
  
      if (!submissionId) {
        return res.status(400).json({ 
          success: false, 
          message: "Submission ID is required." 
        });
      }

      const submission = await Submission.findById(submissionId);
  
      if (!submission) {
        return res.status(404).json({ 
          success: false, 
          message: "Submission not found." 
        });
      }
  
      if (submission.userId.toString() != userId) {
        return res.status(403).json({ 
          success: false, 
          message: "You are not authorized to view this submission." 
        });
      }

      res.status(200).json(submission);
  
    } catch (error) {
      console.error("Get Submission By ID Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
  };