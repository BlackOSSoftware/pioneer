import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";
import { getSiteContentDoc } from "@/lib/cms-store";
import { mergeSiteContent } from "@/lib/cms-defaults";
import { isAdminRequest, adminUnauthorized } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  if (!(await isAdminRequest())) return adminUnauthorized();
  try {
    const doc = await getSiteContentDoc();
    return NextResponse.json(
      { success: true, data: mergeSiteContent(doc) },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  if (!(await isAdminRequest())) return adminUnauthorized();
  try {
    const body = await req.json();
    const about = typeof body.about === "object" && body.about ? body.about : null;
    const products = typeof body.products === "object" && body.products ? body.products : null;
    const services = typeof body.services === "object" && body.services ? body.services : null;
    const insurance = typeof body.insurance === "object" && body.insurance ? body.insurance : null;

    if (!about || !products || !services || !insurance) {
      return NextResponse.json({ success: false, message: "Complete CMS payload is required." }, { status: 400 });
    }

    await connectDB();
    await SiteContent.findOneAndUpdate(
      { singletonKey: "main" },
      { $set: { about, products, services, insurance } },
      { upsert: true, new: true }
    );

    const doc = await SiteContent.findOne({ singletonKey: "main" }).lean();
    return NextResponse.json(
      { success: true, data: mergeSiteContent(doc) },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  if (!(await isAdminRequest())) return adminUnauthorized();
  try {
    const body = await req.json();
    const section = typeof body.section === "string" ? body.section : "";
    const value = typeof body.value === "object" && body.value ? body.value : null;
    const allowedSections = new Set(["about", "products", "services", "insurance"]);

    if (!allowedSections.has(section) || !value) {
      return NextResponse.json({ success: false, message: "Valid CMS section and value are required." }, { status: 400 });
    }

    await getSiteContentDoc();
    await SiteContent.findOneAndUpdate(
      { singletonKey: "main" },
      { $set: { [section]: value } },
      { upsert: true, new: true }
    );

    const doc = await SiteContent.findOne({ singletonKey: "main" }).lean();
    return NextResponse.json(
      { success: true, data: mergeSiteContent(doc) },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
