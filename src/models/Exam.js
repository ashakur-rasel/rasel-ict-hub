import mongoose from "mongoose";

const ExamSchema = new mongoose.Schema({
      title: { type: String, required: true },
      date: { type: Date, required: true },
      startTime: { type: String, required: false }, // e.g., "10:00 AM"
      duration: { type: Number, required: true }, // Minutes
      totalMarks: { type: Number, default: 0 },
      questions: [
            {
                  questionText: { type: String, required: true },
                  options: {
                        a: { type: String, required: true },
                        b: { type: String, required: true },
                        c: { type: String, required: true },
                        d: { type: String, required: true },
                  },
                  correctAnswer: { type: String, enum: ['a', 'b', 'c', 'd'], required: true },
            }
      ],
      status: { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming' },
      createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Exam || mongoose.model("Exam", ExamSchema);