import mongoose from "mongoose";

const potdSchema = new mongoose.Schema({
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem', 
    required: true,
  },
  date: {
    type: Date,
    required: true,
    unique: true, 
  }
}, { timestamps: true });

potdSchema.index({ date: -1 }); // compound index is created .

const ProblemOfTheDay = mongoose.model("ProblemOfTheDay", potdSchema);

export default ProblemOfTheDay;