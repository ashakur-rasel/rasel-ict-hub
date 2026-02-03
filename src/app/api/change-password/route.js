import dbConnect from "@/lib/dbConnect";
import Teacher from "@/models/Teacher";
import { NextResponse } from "next/server";

export async function PUT(req) {
      try {
            await dbConnect();
            const { email, oldPassword, newPassword } = await req.json();

            // 1. Prothome check korbo ei email er kono Admin ache kina
            const admin = await Teacher.findOne({ email });

            if (!admin) {
                  return NextResponse.json({ success: false, message: "Admin not found!" }, { status: 404 });
            }

            // 2. Old password match korche kina check koro
            if (admin.password !== oldPassword) {
                  return NextResponse.json({ success: false, message: "Current password does not match!" }, { status: 401 });
            }

            // 3. Sob thik thakle password update koro
            admin.password = newPassword;
            await admin.save();

            return NextResponse.json({
                  success: true,
                  message: "Security Protocol Updated: Password changed successfully! 🔐"
            });

      } catch (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
}