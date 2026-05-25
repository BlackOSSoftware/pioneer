import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { connectDB } from "@/lib/mongodb";
import { VisitingCardShare } from "@/models/VisitingCardShare";
import { isAdminRequest, adminUnauthorized } from "@/lib/admin-auth";

export async function GET(req) {
  try {
    await connectDB();
    if (req.nextUrl.searchParams.get("admin") === "1") {
      if (!(await isAdminRequest())) return adminUnauthorized();
      const shares = await VisitingCardShare.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, shares });
    }

    const token = req.nextUrl.searchParams.get("token")?.trim();
    if (!token) {
      return NextResponse.json({ success: false, message: "Token required" }, { status: 400 });
    }
    const share = await VisitingCardShare.findOne({ token, isActive: true }).lean();
    if (!share) {
      return NextResponse.json({ success: false, message: "Link not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, share });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await isAdminRequest())) return adminUnauthorized();
  try {
    const body = await req.json();
    const advisorName = body?.advisorName?.trim();
    const advisorPhone = body?.advisorPhone?.trim();
    if (!advisorName || !advisorPhone) {
      return NextResponse.json({ success: false, message: "Advisor name and phone are required." }, { status: 400 });
    }

    await connectDB();
    const token = randomBytes(12).toString("hex");
    const share = await VisitingCardShare.create({
      token,
      advisorName,
      advisorPhone,
      advisorEmail: body?.advisorEmail?.trim() || "",
      companyName: body?.companyName?.trim() || "Pioneer Wealth",
      subtitle: body?.subtitle?.trim() || "Financial Planning & Mutual Funds",
      companyPhone: body?.companyPhone?.trim() || "+91 98765 43210",
      role: body?.role?.trim() || "Wealth Advisor",
    });

    return NextResponse.json({ success: true, share }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!(await isAdminRequest())) return adminUnauthorized();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ success: false, message: "id required" }, { status: 400 });
  }
  try {
    await connectDB();
    await VisitingCardShare.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
