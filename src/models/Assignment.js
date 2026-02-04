import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
      title: { type: String, required: true },
      description: { type: String, required: true }, // Rich text editor content
      attachment: { type: String }, // Drive link
      deadline: { type: Date, required: true },
      createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema);