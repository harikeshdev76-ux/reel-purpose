import { NextResponse } from "next/server";
import { StoryStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/requireAdmin";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.purposeStory.update({
    where: { id: params.id },
    data: { status: StoryStatus.REJECTED },
  });

  return NextResponse.json({ success: true });
}
