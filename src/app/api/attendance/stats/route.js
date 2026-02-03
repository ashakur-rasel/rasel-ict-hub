import dbConnect from "@/lib/dbConnect";
import Attendance from "@/models/Attendance";
import { NextResponse } from "next/server";

export async function GET() {
      try {
            await dbConnect();
            const records = await Attendance.find({}).sort({ date: 1 });

            const chartData = records.map(rec => {
                  const presentCount = rec.students.filter(s => s.status === "Present").length;
                  const totalStudents = rec.students.length;
                  return {
                        name: rec.date.split('-').reverse().slice(0, 2).join('/'),
                        present: presentCount,
                        total: totalStudents, // টোটাল স্টুডেন্ট সংখ্যা
                        rate: totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : 0
                  };
            });

            let totalP = 0, totalA = 0;
            records.forEach(rec => {
                  totalP += rec.students.filter(s => s.status === "Present").length;
                  totalA += rec.students.filter(s => s.status === "Absent").length;
            });

            const donutData = [
                  { name: "Present", value: totalP, fill: "#10b981" },
                  { name: "Absent", value: totalA, fill: "#ef4444" }
            ];

            return NextResponse.json({ success: true, chartData, donutData });
      } catch (e) {
            return NextResponse.json({ success: false, error: e.message });
      }
}