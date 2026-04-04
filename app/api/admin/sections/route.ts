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

async function generateUniqueSlug(title: string, excludeId?: number) {
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

export async function GET() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sections = await prisma.section.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { works: true } } },
  });

  const payload = sections.map((section: any) => ({
    id: section.id,
    title: section.title,
    slug: section.slug,
    order: section.order,
    isVisible: section.isVisible,
    worksCount: section._count.works,
  }));

  return NextResponse.json(payload);
}

export async function POST(req: NextRequest) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const title = String(body.title || "").trim();
  const isVisible = typeof body.isVisible === "boolean" ? body.isVisible : true;
  let order = typeof body.order === "number" ? body.order : undefined;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (order == null) {
    const maxOrder = await prisma.section.aggregate({ _max: { order: true } });
    order = (maxOrder._max.order ?? 0) + 1;
  }

  const slug = await generateUniqueSlug(title);

  try {
    const section = await prisma.section.create({
      data: {
        title,
        slug,
        order,
        isVisible,
      },
    });

    return NextResponse.json({
      id: section.id,
      title: section.title,
      slug: section.slug,
      order: section.order,
      isVisible: section.isVisible,
      worksCount: 0,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Unable to create section" }, { status: 500 });
  }
}
