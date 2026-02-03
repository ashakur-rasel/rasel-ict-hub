import dbConnect from "@/lib/dbConnect";
import Student from "@/models/Student";
import Teacher from "@/models/Teacher";
import { NextResponse } from "next/server";

export async function GET() {
      try {
            await dbConnect();
            const students = await Student.find().sort({ createdAt: -1 });
            const totalStudents = await Student.countDocuments();
            return NextResponse.json({ success: true, students, stats: { totalStudents, activeChapters: 12, attendance: "92%" } }, { status: 200 });
      } catch (error) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}

export async function POST(req) {
      try {
            await dbConnect();
            const { searchParams } = new URL(req.url);
            const role = searchParams.get("role");
            const body = await req.json();

            if (role === "admin") {
                  await Teacher.create({ name: body.name, email: body.email, phone: body.phone, password: body.password });
                  return NextResponse.json({ success: true, message: "Super Admin Registered! 🛡️" });
            } else {
                  // এখানে college যোগ করা হয়েছে
                  await Student.create({
                        name: body.name,
                        email: body.email,
                        phone: body.phone,
                        college: body.college || "N/A", // নতুন স্টুডেন্টের জন্য কলেজ ডাটা
                        studentId: body.studentId || body.roll,
                        password: body.password
                  });
                  return NextResponse.json({ success: true, message: "Student Registered! 🎓" });
            }
      } catch (error) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}

export async function PUT(req) {
      try {
            await dbConnect();
            const body = await req.json();
            const { id, name, roll, college, email, phone, password } = body;

            const updateData = { name, studentId: roll, college: college, email, phone };
            if (password) updateData.password = password;

            // updatedNode পাঠিয়েছি যাতে ফ্রন্টএন্ডের সাথে মিলে যায়
            const result = await Student.findByIdAndUpdate(id, updateData, { new: true });
            return NextResponse.json({ success: true, updatedNode: result });
      } catch (error) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}
export async function DELETE(req) {
      try {
            await dbConnect();
            const { searchParams } = new URL(req.url);
            const id = searchParams.get("id");

            if (!id) return NextResponse.json({ success: false, message: "ID Required" }, { status: 400 });

            await Student.findByIdAndDelete(id);
            return NextResponse.json({ success: true, message: "Node Deleted!" });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
}