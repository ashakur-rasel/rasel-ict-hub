import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Submission from "@/models/Submission";
import Assignment from "@/models/Assignment"; // Required for populate to work

// 1. Fetch Submissions with Assignment Details
export async function GET(req) {
      await dbConnect();
      try {
            const { searchParams } = new URL(req.url);
            const assignmentId = searchParams.get("assignmentId");
            const studentEmail = searchParams.get("studentEmail");

            let query = {};
            if (assignmentId) query.assignmentId = assignmentId;
            if (studentEmail) query.studentEmail = studentEmail;

            // .populate fetches the actual assignment details instead of just the ID
            const submissions = await Submission.find(query)
                  .populate("assignmentId")
                  .sort({ submittedAt: -1 });

            return NextResponse.json({ success: true, data: submissions });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}

// 2. Student Submission with "One-Time" Security
export async function POST(req) {
      await dbConnect();
      try {
            const body = await req.json();
            const { assignmentId, studentEmail } = body;

            // Prevent duplicate submissions for the same assignment by the same student
            const existingSubmission = await Submission.findOne({ assignmentId, studentEmail });

            if (existingSubmission) {
                  return NextResponse.json({
                        success: false,
                        message: "MISSION ALREADY LOGGED: You cannot submit twice."
                  }, { status: 400 });
            }

            const newSubmission = await Submission.create({
                  ...body,
                  status: "Pending",
                  submittedAt: new Date()
            });

            return NextResponse.json({ success: true, data: newSubmission });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
}

// ... Keep your PATCH and DELETE methods as they were

// 3. PATCH: Teacher Updates Marks/Feedback
export async function PATCH(req) {
      await dbConnect();
      try {
            const { id, marks, feedback } = await req.json();
            const updated = await Submission.findByIdAndUpdate(
                  id,
                  { marks, feedback, status: "Marked" },
                  { new: true }
            );
            return NextResponse.json({ success: true, data: updated });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}

// 4. DELETE: Student Unsubmits (Only if not marked)
export async function DELETE(req) {
      await dbConnect();
      try {
            const id = new URL(req.url).searchParams.get("id");
            const submission = await Submission.findById(id);
            if (submission?.status === "Marked") {
                  return NextResponse.json({ success: false, message: "Cannot delete marked work!" });
            }
            await Submission.findByIdAndDelete(id);
            return NextResponse.json({ success: true, message: "Removed!" });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}