import dbConnect from "@/lib/dbConnect";
import Student from "@/models/Student";
import Teacher from "@/models/Teacher";
import { NextResponse } from "next/server";

export async function POST(req) {
      try {
            await dbConnect();
            const { identifier, password, role } = await req.json();

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

            if (user.password !== password) {
                  return NextResponse.json({ success: false, message: "Invalid password!" }, { status: 401 });
            }

            // ✅ ফিক্স: পুরো ইউজার অবজেক্টটি পাঠানো হচ্ছে
            // পাসওয়ার্ডটি সিকিউরিটির জন্য বাদ দিয়ে পাঠানো ভালো
            const { password: _, ...userWithoutPassword } = user.toObject ? user.toObject() : user;

            return NextResponse.json({
                  success: true,
                  message: `Welcome back, ${user.name}! 🚀`,
                  user: {
                        ...userWithoutPassword,
                        role: role, // ফ্রন্টএন্ডের সুবিধার জন্য রোলটি ভেতরে ঢুকিয়ে দিলাম
                        studentId: user.studentId || user.email
                  }
            });

      } catch (error) {
            console.error("Login API Error:", error);
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
      }
}