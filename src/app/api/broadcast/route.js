import dbConnect from "@/lib/dbConnect";
import GlobalConfig from "@/models/GlobalConfig";
import { NextResponse } from "next/server";

// 1. Fetch current Config & History
export async function GET() {
      try {
            await dbConnect();
            const config = await GlobalConfig.findOne({});

            // Get the last 15 entries, newest first
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

// 2. Update Status & Push to History
export async function POST(req) {
      try {
            await dbConnect();
            const body = await req.json();
            const { actionType, liveLink, globalNotice } = body;

            let updateData = {};
            let historyContent = "";

            // Logic based on the button clicked in Admin UI
            if (actionType === "live") {
                  updateData = { liveLink: liveLink, isLive: true };
                  historyContent = `Live Session Started: ${liveLink}`;
            } else if (actionType === "terminate") {
                  updateData = { liveLink: "", isLive: false };
                  historyContent = "Live Session Terminated";
            } else if (actionType === "notice") {
                  updateData = { globalNotice: globalNotice };
                  historyContent = `Notice Updated: ${globalNotice}`;
            }

            const updateQuery = { $set: updateData };

            // Push to history array and keep only the latest 50 entries
            if (historyContent) {
                  updateQuery.$push = {
                        history: {
                              $each: [{ type: actionType, content: historyContent, date: new Date() }],
                              $position: 0, // Insert at the beginning of the array
                              $slice: 50    // Keep the array size at 50
                        }
                  };
            }

            const config = await GlobalConfig.findOneAndUpdate({}, updateQuery, { upsert: true, new: true });
            return NextResponse.json({ success: true, config });
      } catch (e) {
            return NextResponse.json({ success: false, error: e.message });
      }
}

// 3. Delete a specific history log item
export async function DELETE(req) {
      try {
            await dbConnect();
            const { searchParams } = new URL(req.url);
            const historyId = searchParams.get('id');

            if (!historyId) return NextResponse.json({ success: false, error: "ID required" });

            await GlobalConfig.updateOne(
                  {},
                  { $pull: { history: { _id: historyId } } }
            );

            return NextResponse.json({ success: true });
      } catch (e) {
            return NextResponse.json({ success: false, error: e.message });
      }
}