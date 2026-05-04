import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { badRequest, requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const stats = await prisma.stat.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(stats);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await req.json();
  const label = String(body.label ?? "").trim();
  const value = Number(body.value);
  const prefix = String(body.prefix ?? "").trim();
  const suffix = String(body.suffix ?? "").trim();
  const isVisible = typeof body.isVisible === "boolean" ? body.isVisible : true;
  const order = typeof body.order === "number" ? body.order : undefined;

  if (!label || !Number.isFinite(value)) {
    return badRequest("Label and numeric value are required.");
  }

  const maxOrder = await prisma.stat.aggregate({ _max: { order: true } });
  const stat = await prisma.stat.create({
    data: {
      label,
      value,
      prefix: prefix || null,
      suffix: suffix || null,
      isVisible,
      order: order ?? (maxOrder._max.order ?? 0) + 1,
    },
  });

  revalidatePath("/");
  return NextResponse.json(stat, { status: 201 });
}
