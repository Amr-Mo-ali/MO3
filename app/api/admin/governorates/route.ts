import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin";
import { EGYPT_GOVERNORATES, governorateNameFromSlug } from "@/lib/governorates";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const active = await prisma.activeGovernorate.findMany({ orderBy: { order: "asc" } });
  const activeSet = new Set(active.map((item) => item.slug));

  return NextResponse.json(
    EGYPT_GOVERNORATES.map((item, index) => ({
      ...item,
      order: active.find((activeItem) => activeItem.slug === item.slug)?.order ?? index + 1,
      isActive: activeSet.has(item.slug),
    }))
  );
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await req.json();
  const slugs = Array.isArray(body.slugs) ? body.slugs.map((item) => String(item)) : [];

  await prisma.$transaction(async (tx) => {
    await tx.activeGovernorate.deleteMany();

    if (slugs.length) {
      await tx.activeGovernorate.createMany({
        data: slugs.map((slug, index) => ({
          slug,
          name: governorateNameFromSlug(slug),
          order: index + 1,
        })),
      });
    }
  });

  revalidatePath("/");
  return NextResponse.json({ success: true });
}
