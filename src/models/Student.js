import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
      name: {
            type: String,
            required: [true, "Name is required"]
      },
      email: {
            type: String,
            unique: true,
            required: [true, "Email is required"],
            lowercase: true
      },
      phone: {
            type: String,
            required: [true, "Phone number is required"]
      },
      studentId: {
            type: String,
            unique: true,
            required: [true, "Unique Student ID is required"]
      },
      college: { // নতুন ফিল্ড যোগ করা হলো
            type: String,
            default: "N/A"
      },
      password: {
            type: String,
            required: [true, "Password is required"]
      },
      role: {
            type: String,
            default: "student"
      },
      createdAt: {
            type: Date,
            default: Date.now
      },
});

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
