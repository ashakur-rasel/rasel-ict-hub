import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
      chapter: {
            type: String,
            required: true,
            unique: true // একটি চ্যাপ্টার একবারই ডাটাবেসে থাকবে
      },
      chapterTitle: { type: String, required: true },
      topics: [{
            topicName: { type: String, required: true },
            content: { type: String, required: true },
            images: [String], // একাধিক ছবির জন্য Array
            order: { type: Number, default: 0 }
      }]
}, { timestamps: true });

export default mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);