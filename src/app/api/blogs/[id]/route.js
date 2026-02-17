import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
      await dbConnect();
      const { id } = await params; // Await params is mandatory in Next 15
      try {
            const blog = await Blog.findById(id);
            if (!blog) return NextResponse.json({ error: "Not Found" }, { status: 404 });
            blog.views += 1;
            await blog.save();
            return NextResponse.json(blog, { status: 200 });
      } catch (e) { return NextResponse.json({ error: "Fail" }, { status: 500 }); }
}

export async function PUT(req, { params }) {
      await dbConnect();
      const { id } = await params;
      try {
            const body = await req.json();
            const updated = await Blog.findByIdAndUpdate(id, body, { new: true });
            return NextResponse.json({ success: true, blog: updated });
      } catch (e) { return NextResponse.json({ error: "Update Fail" }, { status: 500 }); }
}

export async function DELETE(req, { params }) {
      await dbConnect();
      const { id } = await params;
      try {
            const deleted = await Blog.findByIdAndDelete(id);
            if (!deleted) return NextResponse.json({ error: "Not Found" }, { status: 404 });
            return NextResponse.json({ success: true }, { status: 200 });
      } catch (e) { return NextResponse.json({ error: "Delete Fail" }, { status: 500 }); }
}