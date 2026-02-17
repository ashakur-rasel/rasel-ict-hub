import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

// ১. ব্লগ পড়া (GET)
export async function GET(req) {
      await dbConnect();
      try {
            const { searchParams } = new URL(req.url);
            const limit = parseInt(searchParams.get("limit")) || 20;
            const skip = parseInt(searchParams.get("skip")) || 0;
            const adminMode = searchParams.get("admin") === "true";

            // অ্যাডমিন মোড হলে সব দেখাবে, না হলে শুধু published
            const query = adminMode ? {} : { status: "published" };

            const blogs = await Blog.find(query)
                  .sort({ createdAt: -1 })
                  .skip(skip)
                  .limit(limit)
                  .lean(); // পারফরম্যান্সের জন্য lean()

            const total = await Blog.countDocuments(query);

            return NextResponse.json({ blogs, total }, {
                  status: 200,
                  headers: { 'Cache-Control': 'no-store, max-age=0' } // ব্রাউজার ক্যাশ প্রতিরোধ
            });
      } catch (error) {
            return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
      }
}

// ২. নতুন ব্লগ যোগ করা (POST)
export async function POST(req) {
      await dbConnect();
      try {
            const body = await req.json();
            const newBlog = await Blog.create(body);
            return NextResponse.json({ success: true, message: "Blog published successfully!", blog: newBlog }, { status: 201 });
      } catch (error) {
            return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
      }
}