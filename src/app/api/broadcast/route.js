import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const GlobalConfigSchema = new mongoose.Schema({
      liveLink: { type: String, default: "" },
      isLive: { type: Boolean, default: false },
      globalNotice: { type: String, default: "" },
      history: [{
            type: { type: String },
            content: String,
            date: { type: Date, default: Date.now }
      }]
});

const GlobalConfig = mongoose.models.GlobalConfig || mongoose.model("GlobalConfig", GlobalConfigSchema);

// ১. ডাটা রিড করার জন্য (GET)
export async function GET() {
      try {
            await dbConnect();
            const config = await GlobalConfig.findOne({});
            const historyLog = config?.history ? [...config.history].reverse() : [];
            return NextResponse.json({
                  success: true,
                  config: config || { liveLink: "", isLive: false, globalNotice: "" },
                  history: historyLog.slice(0, 15)
            });
      } catch (e) {
            return NextResponse.json({ success: false, error: e.message });
      }
}

// ২. ডাটা আপডেট ও হিস্ট্রি পুশ করার জন্য (POST)
export async function POST(req) {
      try {
            await dbConnect();
            const body = await req.json();
            const { actionType, liveLink, globalNotice, isLive } = body;

            let updateData = {};
            let historyContent = "";

            if (actionType === "live") {
                  updateData = { liveLink: liveLink, isLive: true };
                  historyContent = `Live Session: ${liveLink}`;
            } else if (actionType === "terminate") {
                  updateData = { liveLink: "", isLive: false };
                  historyContent = "Session Terminated";
            } else if (actionType === "notice") {
                  updateData = { globalNotice: globalNotice };
                  historyContent = globalNotice;
            }

            const updateQuery = { $set: updateData };
            if (historyContent) {
                  updateQuery.$push = {
                        history: {
                              $each: [{ type: actionType, content: historyContent, date: new Date() }],
                              $position: 0,
                              $slice: 50
                        }
                  };
            }

            const config = await GlobalConfig.findOneAndUpdate({}, updateQuery, { upsert: true, new: true });
            return NextResponse.json({ success: true, config });
      } catch (e) {
            return NextResponse.json({ success: false, error: e.message });
      }
}

// ৩. নির্দিষ্ট হিস্ট্রি ডিলিট করার জন্য (DELETE)
export async function DELETE(req) {
      try {
            await dbConnect();
            const { searchParams } = new URL(req.url);
            const historyId = searchParams.get('id');

            if (!historyId) {
                  return NextResponse.json({ success: false, error: "ID required" });
            }

            await GlobalConfig.updateOne(
                  {},
                  { $pull: { history: { _id: historyId } } }
            );

            return NextResponse.json({ success: true });
      } catch (e) {
            return NextResponse.json({ success: false, error: e.message });
      }
}