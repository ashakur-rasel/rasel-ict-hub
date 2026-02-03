import dbConnect from "@/lib/dbConnect";
import Student from "@/models/Student";
import Teacher from "@/models/Teacher"; // নতুন মডেলটি ইমপোর্ট করলাম
import { NextResponse } from "next/server";

export async function POST(req) {
      try {
            await dbConnect();
            // identifier ছাড়াও এখন 'role' ডাটাটি ফ্রন্টএন্ড থেকে আসবে
            const { identifier, password, role } = await req.json();

            // লজিক: যদি role 'admin' হয় তবে Teacher মডেলে খোঁজো, নাহলে Student মডেলে
            const Model = role === "admin" ? Teacher : Student;

            const user = await Model.findOne({
                  $or: [
                        { email: identifier.toLowerCase() },
                        { phone: identifier }
                  ]
            });

            if (!user) {
                  return NextResponse.json({
                        success: false,
                        message: `User not found in ${role === "admin" ? "Teacher" : "Student"} database!`
                  }, { status: 404 });
            }

            // পাসওয়ার্ড চেক
            if (user.password !== password) {
                  return NextResponse.json({ success: false, message: "Invalid password!" }, { status: 401 });
            }

            return NextResponse.json({
                  success: true,
                  message: `Welcome back, ${user.name}! 🚀`,
                  role: role,
                  userId: user.studentId || user.email // টিচারদের জন্য আইডি না থাকলে ইমেইল যাবে
            });

      } catch (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
}