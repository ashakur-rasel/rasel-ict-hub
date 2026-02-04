import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
      chapter: { type: String, required: true },
      chapterTitle: { type: String, required: true },
      title: { type: String, required: true },
      fileType: { type: String, required: true }, // pdf, doc, ppt, image
      driveLink: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);