import Submission from '../models/submissionModel.js';
import User from '../models/userModel.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.result._id;

    const user = await User.findById(userId).select('solvedProblems');
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

    res.status(200).json({
      problemsSolved,
      totalSubmissions,
      acceptanceRate: acceptanceRate.toFixed(1),
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
      error: error.message
    });
  }
};
