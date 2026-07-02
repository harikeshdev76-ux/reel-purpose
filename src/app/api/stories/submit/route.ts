import { NextResponse } from "next/server";
import cuid from "cuid";
import { prisma } from "@/lib/prisma";
import { uploadToR2 } from "@/lib/r2";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = String(form.get("name") ?? "").trim();
    const location = String(form.get("location") ?? "").trim();
    const story = String(form.get("story") ?? "").trim();
    const image = form.get("image");

    if (!name) {
      return NextResponse.json(
        { error: "Please enter your name." },
        { status: 400 },
      );
    }
    if (story.length < 20) {
      return NextResponse.json(
        { error: "Your story must be at least 20 characters." },
        { status: 400 },
      );
    }
    if (story.length > 1000) {
      return NextResponse.json(
        { error: "Your story must be 1000 characters or fewer." },
        { status: 400 },
      );
    }

    let imageUrl: string | null = null;
    if (image instanceof File && image.size > 0) {
      const ext = ALLOWED_TYPES[image.type];
      if (!ext) {
        return NextResponse.json(
          { error: "Unsupported image type. Use JPG, PNG, or WebP." },
          { status: 400 },
        );
      }
      if (image.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "Image too large (max 5MB)." },
          { status: 400 },
        );
      }
      const buffer = Buffer.from(await image.arrayBuffer());
      imageUrl = await uploadToR2(buffer, `stories/${cuid()}.${ext}`, image.type);
    }

    await prisma.purposeStory.create({
      data: {
        name,
        location: location || null,
        story,
        imageUrl,
        // status defaults to PENDING
      },
    });

    return NextResponse.json(
      { success: true, message: "Story submitted! We'll review it shortly." },
      { status: 201 },
    );
  } catch (err) {
    console.error("Story submit error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
