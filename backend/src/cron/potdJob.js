import cron from 'node-cron';
import Problem from '../models/problemModel.js';
import ProblemOfTheDay from '../models/potdModel.js';

export const selectNewPOTD = async () => {
  console.log('Running cron job: Selecting new Problem of the Day...');
  
  try {
    let usedProblems = await ProblemOfTheDay.find().select('problem');
    let usedProblemIds = usedProblems.map(p => p.problem);

    let problemCount = await Problem.countDocuments({ 
      _id: { $nin: usedProblemIds }
    });

    if (problemCount === 0) {
      console.log('No new problems found. Resetting POTD history...');
      
      await ProblemOfTheDay.deleteMany({});
      
      usedProblemIds = []; 
      problemCount = await Problem.countDocuments(); 
      if (problemCount === 0) {
        console.log('No problems found in the database to select.');
        return;
      }
    }

    const randomSkip = Math.floor(Math.random() * problemCount);
    const newProblem = await Problem.findOne({
      _id: { $nin: usedProblemIds } 
    }).skip(randomSkip);

    if (!newProblem) {
      console.log('Could not select a new problem.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await ProblemOfTheDay.create({
      problem: newProblem._id,
      date: today
    });

    console.log(`Successfully selected new POTD: ${newProblem.title}`);

  } catch (error) {
    console.error('Error selecting new POTD:', error);
  }
};

export const startPotdJob = () => {
    cron.schedule('0 0 * * *', selectNewPOTD, {
    scheduled: true,
    timezone: "Asia/Kolkata"
    });
    console.log('Problem of the Day job scheduled.');
    };