import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Result from "@/models/Result";
import Exam from "@/models/Exam";

export async function GET(req) {
      await dbConnect();
      try {
            const { searchParams } = new URL(req.url);
            const examId = searchParams.get("examId");

            if (!examId) {
                  return NextResponse.json({ success: false, error: "Exam ID is required" }, { status: 400 });
            }

            // ওই পরীক্ষার সব স্টুডেন্টের রেজাল্ট খুঁজে বের করা
            const scoreboard = await Result.find({ examId }).sort({ score: -1 });

            return NextResponse.json({ success: true, results: scoreboard });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
}

export async function POST(req) {
      await dbConnect();
      try {
            const body = await req.json();
            const { examId, answers, studentId, studentName } = body;

            // ১. ওই পরীক্ষার অরিজিনাল কোশ্চেনগুলো ডাটাবেস থেকে নিয়ে আসা
            const exam = await Exam.findById(examId);
            if (!exam) return NextResponse.json({ success: false, error: "Exam not found" }, { status: 404 });

            // ২. অটোমেটিক স্কোর ক্যালকুলেশন লজিক
            let autoScore = 0;
            const verifiedAnswers = answers.map((studentAns) => {
                  // ডাটাবেসের কোশ্চেন লিস্ট থেকে এই কোশ্চেনটা খুঁজে বের করা
                  const originalQue = exam.questions.id(studentAns.questionId);
                  const isCorrect = originalQue && originalQue.correctAnswer === studentAns.selectedOption;

                  if (isCorrect) autoScore++;

                  return {
                        ...studentAns,
                        isCorrect: isCorrect
                  };
            });

            // ৩. রেজাল্ট সেভ করা
            const finalResult = await Result.create({
                  examId,
                  studentId,
                  studentName,
                  answers: verifiedAnswers,
                  score: autoScore,
                  totalQuestions: exam.questions.length
            });

            return NextResponse.json({ success: true, data: finalResult });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
}