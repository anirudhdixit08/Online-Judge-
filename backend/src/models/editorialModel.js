import mongoose from "mongoose";
const {Schema} = mongoose;

const editorialSchema = new Schema({
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
   },
   cloudinaryPublicId: {
    type: String,
    required: true,
    unique: true
  },
  secureUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  duration: {
    type: Number,
    required: true
  },
},{
    timestamps:true
});



const Editorial = mongoose.model("Editorial",editorialSchema);

export default Editorial;