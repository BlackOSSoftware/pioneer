import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PageInquiry from "@/models/PageInquiry";
import { isAdminRequest, adminUnauthorized } from "@/lib/admin-auth";

const ALLOWED = new Set(["product", "service", "insurance"]);

export async function POST(req) {
  try {
    const body = await req.json();
    const source = typeof body.source === "string" ? body.source.trim().toLowerCase() : "";
    if (!ALLOWED.has(source)) {
      return NextResponse.json({ success: false, message: "Invalid source" }, { status: 400 });
    }
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const message = String(body.message || "").trim();
    const context = typeof body.context === "object" && body.context ? body.context : {};

    if (!name || !email) {
      return NextResponse.json({ success: false, message: "Name and email are required" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Invalid email" }, { status: 400 });
    }

    await connectDB();
    await PageInquiry.create({ source, context, name, email, phone, message });
    return NextResponse.json({ success: true, message: "Submitted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message || "Failed" }, { status: 500 });
  }
}

export async function GET() {
  if (!(await isAdminRequest())) return adminUnauthorized();
  try {
    await connectDB();
    const list = await PageInquiry.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, inquiries: list });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message, inquiries: [] }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!(await isAdminRequest())) return adminUnauthorized();
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "No id" }, { status: 400 });
    await connectDB();
    await PageInquiry.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
