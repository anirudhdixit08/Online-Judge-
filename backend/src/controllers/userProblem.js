

export const createProblem = async (req,res) => {

    const {title,description, difficulty, tags, visibleTestCases,
        hiddenTestCases,startCode,referenceCode,problemCreator} = req.body;

    try {
        for (const {language,solutionCode} of referenceCode){
            
        }

    } catch (error) {
        
    }
}