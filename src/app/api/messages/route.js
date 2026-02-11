import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";

export async function GET(req) {
      await dbConnect();
      try {
            const { searchParams } = new URL(req.url);
            const senderId = searchParams.get("senderId");
            const receiverId = searchParams.get("receiverId");

            let query = {};

            if (senderId === "teacher_admin" && !receiverId) {
                  query = {
                        $or: [{ senderId: "teacher_admin" }, { receiverId: "teacher_admin" }]
                  };
            } else if (senderId && receiverId) {
                  query = {
                        $or: [
                              { senderId, receiverId },
                              { senderId: receiverId, receiverId: senderId }
                        ]
                  };
            }

            const history = await Message.find(query).sort({ timestamp: 1 });
            return NextResponse.json({ success: true, history });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}

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

export async function PUT(req) {
      await dbConnect();
      try {
            const { senderId, receiverId } = await req.json();
            await Message.updateMany(
                  { senderId, receiverId, isRead: false },
                  { $set: { isRead: true } }
            );
            return NextResponse.json({ success: true });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}