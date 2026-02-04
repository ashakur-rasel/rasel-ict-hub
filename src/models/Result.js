import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema({
      examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
      studentId: { type: String, required: true },
      studentName: { type: String, required: true },
      answers: [
            {
                  questionId: String,
                  selectedOption: String, // a, b, c, or d
                  isCorrect: Boolean
            }
      ],
      score: { type: Number, required: true },
      totalQuestions: { type: Number, required: true },
      submittedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Result || mongoose.model("Result", ResultSchema);