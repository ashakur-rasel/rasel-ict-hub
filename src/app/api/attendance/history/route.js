import dbConnect from "@/lib/dbConnect";
import Attendance from "@/models/Attendance";
import { NextResponse } from "next/server";

export async function GET() {
      try {
            await dbConnect();
            // সব রেকর্ড নিয়ে আসবে এবং লেটেস্ট ডেট সবার আগে থাকবে
            const records = await Attendance.find({}).sort({ date: -1 });
            return NextResponse.json({ success: true, records });
      } catch (e) {
            return NextResponse.json({ success: false, error: e.message });
      }
}