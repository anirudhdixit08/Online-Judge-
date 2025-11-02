import Submission from '../models/submissionModel.js';
import User from '../models/userModel.js';
import Problem from '../models/problemModel.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.result._id;

    const user = await User.findById(userId).select('solvedProblems createdProblems');
    const problemsSolved = user.solvedProblems.length;

    const totalSubmissions = await Submission.countDocuments({ userId: userId });

    let acceptanceRate = 0;
    if (totalSubmissions > 0) {
      const acceptedSubmissions = await Submission.countDocuments({ 
        userId: userId, 
        status: 'accepted' 
      });
      acceptanceRate = (acceptedSubmissions / totalSubmissions) * 100;
    }
    
    const problemsCreated = user.createdProblems.length;

    res.status(200).json({
      problemsSolved,
      totalSubmissions,
      acceptanceRate: acceptanceRate.toFixed(1),
      problemsCreated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
      error: error.message
    });
  }
};

export const getRecentActivity = async (req, res) => {
    try {
      const userId = req.result._id;
  
      const recentSubmissions = await Submission.find({ userId: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('problemId', 'title');
  
      const validSubmissions = recentSubmissions.filter(sub => sub.problemId);
    
      res.status(200).json(validSubmissions);

      // res.status(200).json(recentSubmissions);
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching recent activity",
        error: error.message
      });
    }
  };

  export const getRecentCreatedProblems = async (req, res) => {
    try {
      const recentProblems = await Problem.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title difficulty createdAt');
  
      res.status(200).json(recentProblems);
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching recent problems",
        error: error.message
      });
    }
  };
