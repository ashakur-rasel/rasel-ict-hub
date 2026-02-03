import dbConnect from "@/lib/dbConnect";
import Attendance from "@/models/Attendance";
import Student from "@/models/Student";
import { NextResponse } from "next/server";

export async function GET(req) {
      try {
            await dbConnect();
            const { searchParams } = new URL(req.url);
            const date = searchParams.get("date"); // YYYY-MM-DD format from input

            let record = await Attendance.findOne({ date });

            if (!record) {
                  const students = await Student.find({}).select("name _id");
                  return NextResponse.json({ success: true, isNew: true, students });
            }
            return NextResponse.json({ success: true, isNew: false, record });
      } catch (e) {
            return NextResponse.json({ success: false, error: e.message }, { status: 500 });
      }
}

export async function POST(req) {
      try {
            await dbConnect();
            const { date, students } = await req.json();
            const record = await Attendance.findOneAndUpdate(
                  { date },
                  { $set: { students } },
                  { upsert: true, new: true }
            );
            return NextResponse.json({ success: true, record });
      } catch (e) {
            return NextResponse.json({ success: false, error: e.message }, { status: 500 });
      }
}

export async function DELETE(req) {
      try {
            await dbConnect();
            const { searchParams } = new URL(req.url);
            const date = searchParams.get("date");
            await Attendance.findOneAndDelete({ date });
            return NextResponse.json({ success: true });
      } catch (e) {
            return NextResponse.json({ success: false }, { status: 500 });
      }
}