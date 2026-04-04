import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  const folder = typeof body.folder === "string" ? body.folder : undefined;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary environment variables are not configured." },
      { status: 500 }
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const params: Array<[string, string]> = [["timestamp", String(timestamp)]];

  if (folder) {
    params.push(["folder", folder]);
  }
  if (uploadPreset) {
    params.push(["upload_preset", uploadPreset]);
  }

  params.sort(([a], [b]) => a.localeCompare(b));
  const signatureBase = params.map(([key, value]) => `${key}=${value}`).join("&");
  const signature = crypto
    .createHash("sha1")
    .update(signatureBase + apiSecret)
    .digest("hex");

  return NextResponse.json({
    cloudName,
    apiKey,
    signature,
    timestamp,
    folder,
    uploadPreset,
  });
}
