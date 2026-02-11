import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Exam from "@/models/Exam";

// 1. সব এক্সাম এবং সিঙ্গেল এক্সাম দেখা
export async function GET(req) {
      await dbConnect();
      try {
            const { searchParams } = new URL(req.url);
            const id = searchParams.get("id");

            if (id) {
                  const exam = await Exam.findById(id);
                  if (!exam) return NextResponse.json({ success: false, error: "Exam not found" }, { status: 404 });

                  // --- SECURITY LOCK LOGIC ---
                  const now = new Date();
                  const examDate = new Date(exam.date);
                  const [hours, minutes] = exam.startTime.split(':');
                  examDate.setHours(parseInt(hours), parseInt(minutes), 0);

                  // If current time is before the exam start time, lock the questions
                  if (now < examDate) {
                        return NextResponse.json({
                              success: false,
                              isLocked: true,
                              startTime: exam.startTime,
                              error: "Exam has not started yet. Access denied."
                        }, { status: 403 });
                  }
                  // ----------------------------

                  return NextResponse.json({ success: true, exam });
            }

            const exams = await Exam.find({}).sort({ date: -1 });
            return NextResponse.json({ success: true, exams });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}

// 2. নতুন এক্সাম তৈরি
export async function POST(req) {
      await dbConnect();
      try {
            const body = await req.json();
            const newExam = await Exam.create(body);
            return NextResponse.json({ success: true, data: newExam });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}

// 3. এক্সাম এডিট বা মডিফাই করা
export async function PATCH(req) {
      await dbConnect();
      try {
            const body = await req.json();
            const { id, ...updateData } = body;
            const updatedExam = await Exam.findByIdAndUpdate(id, updateData, { new: true });
            return NextResponse.json({ success: true, data: updatedExam });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}

// 4. এক্সাম ডিলিট করা
export async function DELETE(req) {
      await dbConnect();
      try {
            const { searchParams } = new URL(req.url);
            const id = searchParams.get("id");
            await Exam.findByIdAndDelete(id);
            return NextResponse.json({ success: true, message: "Exam Deleted Successfully" });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}