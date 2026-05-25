import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { VisitingCardLead } from "@/models/VisitingCardLead";
import { isAdminRequest, adminUnauthorized } from "@/lib/admin-auth";

const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

export async function POST(req) {
  try {
    const body = await req.json();
    const userName = body?.userName?.trim();
    const userPhone = body?.userPhone?.trim();

    if (!userName || !userPhone) {
      return NextResponse.json(
        { success: false, message: "Name and phone are required." },
        { status: 400 }
      );
    }

    if (!phoneRegex.test(userPhone)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    await connectDB();

    const lead = await VisitingCardLead.create({
      userName,
      userPhone,
      companyName: body?.companyName || "Pioneer Wealth",
      subtitle: body?.subtitle || "Financial Planning & Mutual Funds",
      companyPhone: body?.companyPhone || "+91 98765 43210",
      source: body?.source?.trim() || "Admin Visiting Card Studio",
      shareToken: body?.shareToken?.trim() || "",
      cardAdvisorName: body?.cardAdvisorName?.trim() || "",
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    const status = error.message?.includes("MongoDB") || error.message?.includes("MONGODB_URI") ? 503 : 500;
    return NextResponse.json(
      { success: false, message: "Failed to save visiting card lead.", error: error.message },
      { status }
    );
  }
}

export async function GET() {
  if (!(await isAdminRequest())) return adminUnauthorized();
  try {
    await connectDB();
    const leads = await VisitingCardLead.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    const status = error.message?.includes("MongoDB") || error.message?.includes("MONGODB_URI") ? 503 : 500;
    return NextResponse.json(
      { success: false, leads: [], message: "Failed to fetch data.", error: error.message },
      { status }
    );
  }
}

export async function DELETE(req) {
  if (!(await isAdminRequest())) return adminUnauthorized();
  try {
    await connectDB();
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "No ID provided." },
        { status: 400 }
      );
    }

    await VisitingCardLead.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Entry deleted." });
  } catch (error) {
    const status = error.message?.includes("MongoDB") || error.message?.includes("MONGODB_URI") ? 503 : 500;
    return NextResponse.json(
      { success: false, message: "Delete failed.", error: error.message },
      { status }
    );
  }
}
