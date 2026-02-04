import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/Student"; // যদি ফাইলের নাম Student.js হয়

export async function GET() {
      await dbConnect();
      try {
            // শুধু স্টুডেন্টদের ফিল্টার করে নিয়ে আসা
            const students = await User.find({ role: "student" }).select("-password");
            return NextResponse.json({ success: true, students });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}