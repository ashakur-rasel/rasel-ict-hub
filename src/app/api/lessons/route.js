import dbConnect from "@/lib/dbConnect";
import Lesson from "@/models/Lesson";
import { NextResponse } from "next/server";

export async function GET(req) {
      try {
            await dbConnect();
            const { searchParams } = new URL(req.url);
            const chapter = searchParams.get("chapter");

            const lessons = chapter
                  ? await Lesson.findOne({ chapter })
                  : await Lesson.find().sort({ chapter: 1 });

            return NextResponse.json({ success: true, lessons });
      } catch (error) { return NextResponse.json({ success: false, error: error.message }); }
}

export async function POST(req) {
      try {
            await dbConnect();
            const body = await req.json();
            const { chapter, chapterTitle, topicName, content, images } = body;

            const updatedLesson = await Lesson.findOneAndUpdate(
                  { chapter },
                  {
                        $set: { chapterTitle },
                        $push: {
                              topics: {
                                    topicName,
                                    content,
                                    images: images || [] // ইমেজ এরে সেভ করা
                              }
                        }
                  },
                  { upsert: true, new: true }
            );

            return NextResponse.json({ success: true, lesson: updatedLesson });
      } catch (e) {
            return NextResponse.json({ success: false, error: e.message });
      }
}
export async function DELETE(req) {
      try {
            await dbConnect();
            const { searchParams } = new URL(req.url);
            const chapter = searchParams.get("chapter");
            const topicId = searchParams.get("topicId");

            await Lesson.findOneAndUpdate(
                  { chapter },
                  { $pull: { topics: { _id: topicId } } } // নির্দিষ্ট টপিক রিমুভ করা
            );

            return NextResponse.json({ success: true, message: "Topic Deleted" });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}