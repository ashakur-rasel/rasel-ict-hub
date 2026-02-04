import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
      assignmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment",
            required: true
      },
      studentName: { type: String, required: true },
      studentEmail: { type: String, required: true },
      content: { type: String }, // স্টুডেন্টের লেখা টেক্সট বা কোড
      attachment: { type: String }, // স্টুডেন্টের ড্রাইভ লিঙ্ক
      submittedAt: { type: Date, default: Date.now },
      marks: { type: Number, default: 0 },
      feedback: { type: String, default: "" },
      status: { type: String, default: "Pending" } // Pending, Marked
});

export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);