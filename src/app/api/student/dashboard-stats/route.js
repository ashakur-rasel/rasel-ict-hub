import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Attendance from "@/models/Attendance";
import Result from "@/models/Result";
import GlobalConfig from "@/models/GlobalConfig";
import Lesson from "@/models/Lesson";
import Assignment from "@/models/Assignment";
import Submission from "@/models/Submission";
import Exam from "@/models/Exam";

export async function GET(req) {
      await dbConnect();
      try {
            const { searchParams } = new URL(req.url);
            const studentId = searchParams.get("studentId");

            if (!studentId) return NextResponse.json({ success: false, error: "ID Required" }, { status: 400 });

            // 1. Attendance Data
            const allAttendance = await Attendance.find({});
            let presentDays = 0;
            allAttendance.forEach(record => {
                  const entry = record.students.find(s => s.studentId.toString() === studentId);
                  if (entry && entry.status === "Present") presentDays++;
            });

            // 2. Syllabus Stats (LNS)
            const allLessons = await Lesson.find({});
            const totalChapters = allLessons.length;
            const totalSections = allLessons.reduce((acc, curr) => acc + curr.topics.length, 0);

            // 3. Task Stats (TSK)
            const totalAssignments = await Assignment.countDocuments();
            const mySubmissions = await Submission.countDocuments({ studentId });

            // 4. Exam Stats (EXM)
            const totalExamsAvailable = await Exam.countDocuments();
            const myResults = await Result.find({ studentId });
            const examsCompleted = myResults.length;
            const avgScore = examsCompleted > 0
                  ? (myResults.reduce((acc, curr) => acc + curr.score, 0) / examsCompleted).toFixed(1)
                  : 0;

            const config = await GlobalConfig.findOne({}) || { globalNotice: "Welcome!", isLive: false };

            return NextResponse.json({
                  success: true,
                  stats: {
                        attendanceRate: allAttendance.length > 0 ? ((presentDays / allAttendance.length) * 100).toFixed(1) : 0,
                        avgScore,
                        pendingTasks: totalAssignments - mySubmissions,
                        totalPresent: presentDays,
                        totalClasses: allAttendance.length,
                        totalChapters,
                        totalSections,
                        totalAssignments,
                        totalExamsAvailable,
                        examsCompleted,
                        mySubmissions
                  },
                  config,
                  chartData: [
                        { name: 'Present', value: presentDays, fill: '#10b981' },
                        { name: 'Absent', value: allAttendance.length - presentDays, fill: '#ef4444' }
                  ]
            });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}