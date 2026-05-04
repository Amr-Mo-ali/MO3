import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { badRequest, requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const heroConfig = await prisma.heroConfig.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(heroConfig);
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await req.json();
  const title = String(body.title ?? "").trim();
  const subtitle = String(body.subtitle ?? "").trim();
  const ctaLabel = String(body.ctaLabel ?? "").trim();
  const ctaLink = String(body.ctaLink ?? "").trim();
  const videoUrl = String(body.videoUrl ?? "").trim();
  const posterUrl = String(body.posterUrl ?? "").trim();
  const isVisible = typeof body.isVisible === "boolean" ? body.isVisible : true;

  if (!title || !ctaLabel || !ctaLink || !videoUrl) {
    return badRequest("Title, CTA label, CTA link, and video URL are required.");
  }

  const existing = await prisma.heroConfig.findFirst({ orderBy: { updatedAt: "desc" } });
  const heroConfig = existing
    ? await prisma.heroConfig.update({
        where: { id: existing.id },
        data: {
          title,
          subtitle: subtitle || null,
          ctaLabel,
          ctaLink,
          videoUrl,
          posterUrl: posterUrl || null,
          isVisible,
        },
      })
    : await prisma.heroConfig.create({
        data: {
          title,
          subtitle: subtitle || null,
          ctaLabel,
          ctaLink,
          videoUrl,
          posterUrl: posterUrl || null,
          isVisible,
        },
      });

  revalidatePath("/");
  return NextResponse.json(heroConfig);
}
