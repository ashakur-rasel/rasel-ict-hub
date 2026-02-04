import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";

// ১. মেসেজ হিস্ট্রি নিয়ে আসা
export async function GET(req) {
      await dbConnect();
      try {
            const { searchParams } = new URL(req.url);
            const senderId = searchParams.get("senderId");
            const receiverId = searchParams.get("receiverId");

            // দুইজনের মধ্যকার সব মেসেজ খুঁজে বের করা
            const history = await Message.find({
                  $or: [
                        { senderId, receiverId },
                        { senderId: receiverId, receiverId: senderId }
                  ]
            }).sort({ timestamp: 1 }); // পুরনো মেসেজ আগে দেখাবে

            return NextResponse.json({ success: true, history });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}

// ২. নতুন মেসেজ পাঠানো
export async function POST(req) {
      await dbConnect();
      try {
            const body = await req.json();
            const newMessage = await Message.create(body);
            return NextResponse.json({ success: true, data: newMessage });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}