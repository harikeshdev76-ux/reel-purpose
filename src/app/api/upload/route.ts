import { NextResponse } from "next/server";
import cuid from "cuid";
import { uploadToR2 } from "@/lib/r2";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Allowed content types mapped to file extensions.
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Unsupported file type. Use JPG, PNG, or WebP." },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 5MB)." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `products/${cuid()}.${ext}`;
    const url = await uploadToR2(buffer, key, file.type);

    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Upload error:", message);
    return NextResponse.json(
      { error: "Upload failed", detail: message },
      { status: 500 },
    );
  }
}
