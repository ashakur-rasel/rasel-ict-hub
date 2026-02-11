import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Result from "@/models/Result";
import Exam from "@/models/Exam";

export async function GET(req) {
      await dbConnect();
      try {
            const { searchParams } = new URL(req.url);
            const examId = searchParams.get("examId"); // For Leaderboard
            const id = searchParams.get("id");         // For Specific Result
            const studentId = searchParams.get("studentId"); // For Security Check

            // CASE 1: Security Check (Check if student already attempted)
            if (studentId && examId && !id) {
                  const existing = await Result.findOne({ studentId, examId });
                  return NextResponse.json({
                        success: true,
                        alreadySubmitted: !!existing,
                        resultId: existing?._id || null
                  });
            }

            // CASE 2: Single Result View (Student Scorecard)
            if (id) {
                  const result = await Result.findById(id).populate("examId");
                  if (!result) return NextResponse.json({ success: false, error: "Result not found" }, { status: 404 });

                  const detailedAnswers = result.answers.map(ans => {
                        const originalQue = result.examId.questions.id(ans.questionId);
                        return {
                              ...ans.toObject(),
                              questionText: originalQue?.questionText || "Question text missing",
                              correctAnswer: originalQue?.correctAnswer || "N/A"
                        };
                  });

                  return NextResponse.json({
                        success: true,
                        data: { ...result.toObject(), answers: detailedAnswers }
                  });
            }

            // CASE 3: Leaderboard (All results for one exam)
            if (examId) {
                  const scoreboard = await Result.find({ examId }).sort({ score: -1, createdAt: 1 });
                  return NextResponse.json({ success: true, results: scoreboard });
            }

            return NextResponse.json({ success: false, error: "Parameters missing" }, { status: 400 });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
}

// POST remains the same as your previous logic...

export async function POST(req) {
      await dbConnect();
      try {
            const body = await req.json();
            const { examId, answers, studentId, studentName } = body;

            const exam = await Exam.findById(examId);
            if (!exam) return NextResponse.json({ success: false, error: "Exam not found" }, { status: 404 });

            let autoScore = 0;
            const verifiedAnswers = answers.map((studentAns) => {
                  const originalQue = exam.questions.id(studentAns.questionId);
                  const isCorrect = originalQue && originalQue.correctAnswer === studentAns.selectedOption;

                  if (isCorrect) autoScore++;

                  return {
                        ...studentAns,
                        isCorrect: isCorrect
                  };
            });

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