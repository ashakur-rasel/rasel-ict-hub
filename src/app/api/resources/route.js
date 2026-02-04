import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; // তোমার ডাটাবেস কানেকশন পাথ অনুযায়ী ঠিক করে নিও
import Resource from "@/models/Resource"; // আমরা এখন এই মডেলটি তৈরি করবো

export async function GET() {
      await dbConnect();
      try {
            const resources = await Resource.find({}).sort({ uploadedAt: -1 });
            return NextResponse.json({ success: true, resources });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}

export async function POST(req) {
      await dbConnect();
      try {
            const body = await req.json();
            const newResource = await Resource.create(body);
            return NextResponse.json({ success: true, resource: newResource });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}

export async function DELETE(req) {
      await dbConnect();
      try {
            const { searchParams } = new URL(req.url);
            const id = searchParams.get("id");
            await Resource.findByIdAndDelete(id);
            return NextResponse.json({ success: true, message: "Resource Deleted" });
      } catch (error) {
            return NextResponse.json({ success: false, error: error.message });
      }
}