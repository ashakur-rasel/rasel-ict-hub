import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema(
      {
            name: {
                  type: String,
                  required: true
            },
            email: {
                  type: String,
                  required: true,
                  unique: true // একই ইমেইল দিয়ে দুইজন টিচার হবে না
            },
            phone: {
                  type: String,
                  required: true,
                  unique: true // একই ফোন নম্বর দিয়ে দুইজন টিচার হবে না
            },
            password: {
                  type: String,
                  required: true
            },
            role: {
                  type: String,
                  default: "admin" // এটি তোমাকে সুপার অ্যাডমিনের পাওয়ার দিবে
            }
      },
      { timestamps: true } // এটি রেজিস্ট্রেশনের সময় অটোমেটিক সেভ করে রাখবে
);

// মঙ্গুজ মডেলটি তৈরি বা রিট্রিভ করা
const Teacher = mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);

export default Teacher;