import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
      assignmentId: {
            type: mongoose.Schema.Types.ObjectId, // Fixed Reference
            ref: "Assignment",
            required: true,
      },
      studentId: { type: String, required: true },
      studentName: { type: String, required: true },
      studentEmail: { type: String, required: true },
      submissionLink: { type: String }, // For Drive/GitHub links
      attachment: { type: String },     // Keep for compatibility
      submittedAt: { type: Date, default: Date.now },
      marks: { type: Number, default: 0 },
      feedback: { type: String, default: "" },
      isMarked: { type: Boolean, default: false },
});

// Singleton pattern to prevent re-definition error in Next.js
export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);