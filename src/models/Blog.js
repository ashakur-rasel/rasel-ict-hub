// src/models/Blog.js
import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
      title: { type: String, required: true },
      content: { type: String, required: true },
      thumbnail: { type: String, required: true }, // Main Banner
      additionalImages: [{ type: String }], // একাধিক ড্রাইভ লিঙ্ক
      category: { type: String, default: "Tech Update" },
      status: { type: String, enum: ["published", "draft", "archived"], default: "published" },
      views: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);