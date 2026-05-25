import { NextResponse } from "next/server";
import { getSiteContentDoc } from "@/lib/cms-store";
import { mergeSiteContent } from "@/lib/cms-defaults";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
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
