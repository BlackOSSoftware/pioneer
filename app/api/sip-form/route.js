import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CalculatorForm } from "@/models/CalculatorForm";

export async function POST(req) {
  try {
    const data = await req.json();
    const name = String(data?.name ?? "").trim();
    const email = String(data?.email ?? "").trim();
    const mobile = String(data?.mobile ?? "").trim();
    const goal = String(data?.goal ?? "").trim();
    const calculatorType = String(data?.calculatorType ?? "Calculator").trim();

    if (!name || !email || !mobile || !goal) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();
    await CalculatorForm.create({ name, email, mobile, goal, calculatorType });

    return NextResponse.json({ success: true, message: "Data Saved" }, { status: 200 });
  } catch (err) {
    console.error("sip-form POST error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Could not save form" },
      { status: 503 }
    );
  }
}
