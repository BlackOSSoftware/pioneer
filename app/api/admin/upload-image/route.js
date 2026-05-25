import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { isAdminRequest, adminUnauthorized } from "@/lib/admin-auth";

function configureCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) {
    return false;
  }
  cloudinary.config({ cloud_name, api_key, api_secret });
  return true;
}

export async function POST(req) {
  if (!(await isAdminRequest())) return adminUnauthorized();
  if (!configureCloudinary()) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local.",
      },
      { status: 503 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ success: false, message: "Missing file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = file.type || "image/jpeg";
    const dataUri = `data:${mime};base64,${buffer.toString("base64")}`;

    const uploaded = await cloudinary.uploader.upload(dataUri, {
      folder: "pioneer-cms",
      resource_type: "image",
    });

    return NextResponse.json({
      success: true,
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
