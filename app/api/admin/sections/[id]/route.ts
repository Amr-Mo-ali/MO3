import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueSlug(title: string, excludeId?: string) {
  const baseSlug = slugify(title) || "section";
  let slug = baseSlug;
  let count = 1;

  while (
    await prisma.section.findFirst({
      where: {
        slug,
        id: excludeId ? { not: excludeId } : undefined,
      },
    })
  ) {
    count += 1;
    slug = `${baseSlug}-${count}`;
  }

  return slug;
}

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }
  return session;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sectionId = params.id;
  if (!sectionId) {
    return NextResponse.json({ error: "Invalid section id" }, { status: 400 });
  }

  const body = await req.json();
  const title = body.title ? String(body.title).trim() : undefined;
  const slug = body.slug ? String(body.slug).trim() : undefined;
  const order = typeof body.order === "number" ? body.order : undefined;
  const isVisible = typeof body.isVisible === "boolean" ? body.isVisible : undefined;

  if (!title && !slug && order === undefined && isVisible === undefined) {
    return NextResponse.json({ error: "No update data provided" }, { status: 400 });
  }

  try {
    const section = await prisma.section.findUnique({ where: { id: sectionId } });
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    let newSlug = slug;
    if (title && !slug) {
      newSlug = await generateUniqueSlug(title, sectionId);
    }

    const updatedSection = await prisma.section.update({
      where: { id: sectionId },
      data: {
        title: title ?? section.title,
        slug: newSlug ?? section.slug,
        order: order ?? section.order,
        isVisible: isVisible ?? section.isVisible,
      },
    });

    return NextResponse.json({
      id: updatedSection.id,
      title: updatedSection.title,
      slug: updatedSection.slug,
      order: updatedSection.order,
      isVisible: updatedSection.isVisible,
    });
  } catch (error) {
    return NextResponse.json({ error: "Unable to update section" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sectionId = params.id;
  if (!sectionId) {
    return NextResponse.json({ error: "Invalid section id" }, { status: 400 });
  }

  const worksCount = await prisma.work.count({ where: { sectionId } });
  if (worksCount > 0) {
    return NextResponse.json(
      { error: "Cannot delete a section that contains works. Remove works first." },
      { status: 400 }
    );
  }

  try {
    await prisma.section.delete({ where: { id: sectionId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Unable to delete section" }, { status: 500 });
  }
}
