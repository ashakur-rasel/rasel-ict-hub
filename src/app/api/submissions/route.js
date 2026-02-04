import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Submission from "@/models/Submission";

// ১. নির্দিষ্ট অ্যাসাইনমেন্টের সব সাবমিশন দেখার জন্য (Teacher's View)
export async function GET(req) {
      await dbConnect();
      try {
            const { searchParams } = new URL(req.url);
            const assignmentId = searchParams.get("assignmentId");
            const submissions = await Submission.find({ assignmentId }).sort({ submittedAt: -1 });
            return NextResponse.json({ success: true, submissions });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}

// ২. টিচার যখন নাম্বার এবং কমেন্ট আপডেট করবে (Grading)
export async function PATCH(req) {
      await dbConnect();
      try {
            const body = await req.json();
            const { id, marks, feedback } = body;
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
// ৩. সাবমিশন ডিলিট করার জন্য (Student can unsubmit)
export async function DELETE(req) {
      await dbConnect();
      try {
            const { searchParams } = new URL(req.url);
            const id = searchParams.get("id");

            // এখানে চেক করা যেতে পারে টিচার মার্কিং করেছে কি না
            const submission = await Submission.findById(id);
            if (submission.status === "Marked") {
                  return NextResponse.json({ success: false, message: "Cannot delete after marking!" });
            }

            await Submission.findByIdAndDelete(id);
            return NextResponse.json({ success: true, message: "Submission removed!" });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}
// নতুন সাবমিশন তৈরি করার জন্য (Student Submission)
export async function POST(req) {
      await dbConnect();
      try {
            const body = await req.json();
            const newSubmission = await Submission.create(body);
            return NextResponse.json({ success: true, data: newSubmission });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}