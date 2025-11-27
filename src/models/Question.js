import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
     options: {
     type: [String],
     validate: {
      validator: function (arr) {
        return arr.length === 4;
      },
      message: "Each question must have exactly 4 options."
    }
  },
 
  correctAnswer: { type: Number, required: true, min: 0, max: 3 },
  
  explanation: { type: String, required: true }
}, {
  timestamps: true
});

const Question = mongoose.model("Question", questionSchema);
export default Question;
