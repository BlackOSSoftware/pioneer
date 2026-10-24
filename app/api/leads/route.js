import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CalculatorForm } from "@/models/CalculatorForm";
import { isAdminRequest, adminUnauthorized } from "@/lib/admin-auth";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildQuery({ q, calculatorType }) {
  const filter = {};

  if (calculatorType && calculatorType !== "all") {
    filter.calculatorType = calculatorType;
  }

  const needle = String(q || "").trim();
  if (needle) {
    const rx = new RegExp(escapeRegex(needle), "i");
    filter.$or = [
      { name: rx },
      { email: rx },
      { mobile: rx },
      { goal: rx },
      { calculatorType: rx },
    ];
  }

  return filter;
}

/**
 * GET /api/leads?page=1&limit=10&q=&calculatorType=
 * Paginated calculator leads for admin.
 */
export async function GET(req) {
  if (!(await isAdminRequest())) return adminUnauthorized();

  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limitRaw = parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT;
    const limit = Math.min(MAX_LIMIT, Math.max(1, limitRaw));
    const q = searchParams.get("q") || "";
    const calculatorType = searchParams.get("calculatorType") || "all";
    const exportAll = searchParams.get("export") === "1";

    const filter = buildQuery({ q, calculatorType });

    if (exportAll) {
      const leads = await CalculatorForm.find(filter)
        .sort({ createdAt: -1 })
        .limit(2000)
        .lean();
      return NextResponse.json({
        success: true,
        leads,
        pagination: {
          page: 1,
          limit: leads.length,
          total: leads.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      });
    }

    const skip = (page - 1) * limit;

    const [total, leads, calculatorTypes] = await Promise.all([
      CalculatorForm.countDocuments(filter),
      CalculatorForm.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      CalculatorForm.distinct("calculatorType"),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      success: true,
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        calculatorTypes: (calculatorTypes || []).filter(Boolean).sort(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        leads: [],
        pagination: { page: 1, limit: DEFAULT_LIMIT, total: 0, totalPages: 1, hasNext: false, hasPrev: false },
        message: error.message || "Failed to load leads",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  if (!(await isAdminRequest())) return adminUnauthorized();

  try {
    await connectDB();
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "No ID provided" }, { status: 400 });
    }

    const deleted = await CalculatorForm.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Lead deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Delete failed" },
      { status: 500 }
    );
  }
}
