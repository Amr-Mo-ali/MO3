import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }
  return session;
}

function parseTags(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter((tag) => tag.length > 0);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }
  return [];
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ error: "Invalid work id" }, { status: 400 });
  }

  const body = await req.json();
  const updates: any = {};

  if (typeof body.title === "string") {
    updates.title = body.title.trim();
  }
  if (typeof body.client === "string") {
    updates.client = body.client.trim();
  }
  if (typeof body.videoUrl === "string") {
    updates.videoUrl = body.videoUrl.trim();
  }
  if (typeof body.thumbnail === "string") {
    updates.thumbnail = body.thumbnail.trim();
  }
  if (typeof body.description === "string") {
    updates.description = body.description.trim();
  }
  if (typeof body.isVisible === "boolean") {
    updates.isVisible = body.isVisible;
  }
  if (typeof body.order === "number") {
    updates.order = body.order;
  }
  if (typeof body.sectionId === "number") {
    const section = await prisma.section.findUnique({ where: { id: body.sectionId } });
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }
    updates.section = { connect: { id: body.sectionId } };
  }
  if (body.tags !== undefined) {
    updates.tags = parseTags(body.tags);
  }

  try {
    const work = await prisma.work.update({
      where: { id },
      data: updates,
      include: {
        section: {
          select: { id: true, title: true },
        },
      },
    });
    return NextResponse.json(work);
  } catch (error) {
    return NextResponse.json({ error: "Unable to update work" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ error: "Invalid work id" }, { status: 400 });
  }

  try {
    await prisma.work.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Unable to delete work" }, { status: 500 });
  }
}
