import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
      date: { type: String, required: true, unique: true }, // Format: YYYY-MM-DD
      students: [
            {
                  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
                  name: String,
                  status: { type: String, enum: ["Present", "Absent"], default: "Present" }
            }
      ]
}, { timestamps: true });

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);