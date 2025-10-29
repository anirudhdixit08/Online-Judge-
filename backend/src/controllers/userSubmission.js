import Problem from "../models/problemModel.js";
import Submission from "../models/submissionModel.js";
import { getLanguageById,submitBatch,submitToken } from "../utils/problemUtility.js";

export const submitCode = async (req,res) => {
    try {
        
        const problemId = req.params.id;
        const userId = req.result._id;
        const {code,language} = req.body;

        if(!userId){
            return res.status(401).send("Unauthorized: Please log in to run code.");
        }
        else if( !problemId || !code || !language){
            return res.status(400).send('Some fields are missing!');
        }

        const problem = await Problem.findById(problemId);

        // first we store the code in db with status pending and then update later
        // suppose frontend se code aaya but judge0 se response nhi aaya or time lag gya
        // then we should have code stored in our db
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status :'pending',
            totalTestcases : problem.hiddenTestCases.length 
        });

        // now submit this code to Judge0
        const languageId = getLanguageById(language);
        if (!languageId) {
            return res.status(400).send(`Language '${language}' is not supported.`);
        }
        const visibleCases = problem.visibleTestCases || [];
        const hiddenCases = problem.hiddenTestCases || [];
        const allTestCases = visibleCases.concat(hiddenCases);

        const submissions= allTestCases.map((testcase) => ({
            source_code : code,
            language_id : languageId,
            stdin : testcase.input,
            expected_output : testcase.output
        }));

        const submitResult = await submitBatch(submissions);
        const resultTokens = submitResult.map((value)=> value.token);
        const testResults = await submitToken(resultTokens);

        // now we need to update submitted result
        // for runtime add runtime of all cases
        // for memory take maximum of all memory of test cases

        let testCasesPassed = 0;
        let runtime =0;
        let memory =0;
        let status = 'accepted';
        let errorMessage = null;

        for(let i=0; i<testResults.length; ++i){
            const test = testResults[i];
            if(test.status_id == 3){
                testCasesPassed++;
                runtime = runtime + parseFloat(test.time);
                memory = Math.max(memory,test.memory);
            }
            else if(test.status_id == 4){
                status = 'wrong answer';
                errorMessage = test.stderr;
            }
            else{
                status = 'error';
                errorMessage = test.stderr;
            }
        }

        // store updated in Db
        submittedResult.status = status;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;
        submittedResult.errorMessage = errorMessage;

        await submittedResult.save();

        if(status == 'accepted'){
            if(!req.result.solvedProblems.includes(problemId)){
                req.result.solvedProblems.push(problemId);
                await req.result.save();
            }
        }
        return res.status(201).send(submittedResult);

    } catch (error) {
            return res.status(500).send("Internal Sever Error : "+ error);
    }
}

export const runCode = async (req,res) => {
    try {
        
        const problemId = req.params.id;
        const userId = req.result._id;
        const {code,language} = req.body;

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

            return res.status(201).send(testResults);
        // } 

    } catch (error) {
            return res.status(500).send("Internal Sever Error : "+ error);
    }
}
