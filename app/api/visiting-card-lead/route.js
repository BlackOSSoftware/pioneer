import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { VisitingCardLead } from "@/models/VisitingCardLead";
import { VisitingCardShare } from "@/models/VisitingCardShare";

const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

export async function POST(req) {
  try {
    const body = await req.json();
    const token = body?.token?.trim();
    const userName = body?.userName?.trim();
    const userPhone = body?.userPhone?.trim();

    if (!token || !userName || !userPhone) {
      return NextResponse.json(
        { success: false, message: "Token, name, and mobile are required." },
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
    const share = await VisitingCardShare.findOne({ token, isActive: true }).lean();
    if (!share) {
      return NextResponse.json({ success: false, message: "Invalid or expired link." }, { status: 404 });
    }

    const lead = await VisitingCardLead.create({
      userName,
      userPhone,
      companyName: share.companyName || "Pioneer Wealth",
      subtitle: share.subtitle || "",
      companyPhone: share.companyPhone || "",
      source: "Visiting Card Share Link",
      shareToken: token,
      cardAdvisorName: share.advisorName || "",
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to save lead." },
      { status: 500 }
    );
  }
}
