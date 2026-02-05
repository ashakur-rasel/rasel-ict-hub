import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Exam from "@/models/Result";

// ১. সব এক্সাম এবং সিঙ্গেল এক্সাম দেখা
export async function GET(req) {
      await dbConnect();
      try {
            const { searchParams } = new URL(req.url);
            const id = searchParams.get("id");

            if (id) {
                  const exam = await Exam.findById(id);
                  return NextResponse.json({ success: true, exam });
            }

            const exams = await Exam.find({}).sort({ date: -1 });
            return NextResponse.json({ success: true, exams });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}

// ২. নতুন এক্সাম তৈরি
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

// ৩. এক্সাম এডিট বা মডিফাই করা
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

// ৪. এক্সাম ডিলিট করা
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