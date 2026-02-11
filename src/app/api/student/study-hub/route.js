import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Lesson from "@/models/Lesson";

export async function GET(req) {
      await dbConnect();
      try {
            const { searchParams } = new URL(req.url);
            const chapter = searchParams.get("chapter");

            if (chapter) {
                  // Fetch specific chapter details
                  const lesson = await Lesson.findOne({ chapter });
                  return NextResponse.json({ success: true, lesson });
            }

            // Fetch all chapters for the main list
            const chapters = await Lesson.find({}).sort({ chapter: 1 }).select("chapter chapterTitle topics.topicName");
            return NextResponse.json({ success: true, chapters });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}