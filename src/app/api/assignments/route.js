import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Assignment from "@/models/Assignment";

// ১. সব অ্যাসাইনমেন্ট পাওয়ার জন্য (History)
export async function GET() {
      await dbConnect();
      try {
            const assignments = await Assignment.find({}).sort({ createdAt: -1 });
            return NextResponse.json({ success: true, assignments });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}

// ২. নতুন অ্যাসাইনমেন্ট তৈরি করার জন্য
export async function POST(req) {
      await dbConnect();
      try {
            const body = await req.json();
            const newAssignment = await Assignment.create(body);
            return NextResponse.json({ success: true, data: newAssignment });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}

// ৩. অ্যাসাইনমেন্ট এডিট (Update) করার জন্য
export async function PUT(req) {
      await dbConnect();
      try {
            const body = await req.json();
            const { id, ...updateData } = body;
            const updated = await Assignment.findByIdAndUpdate(id, updateData, { new: true });
            return NextResponse.json({ success: true, data: updated });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}

// ৪. ডিলিট করার জন্য
export async function DELETE(req) {
      await dbConnect();
      try {
            const { searchParams } = new URL(req.url);
            const id = searchParams.get("id");
            await Assignment.findByIdAndDelete(id);
            return NextResponse.json({ success: true, message: "Assignment Deleted" });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}