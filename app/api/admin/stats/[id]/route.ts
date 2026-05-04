import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { badRequest, requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await req.json();
  const data: Record<string, unknown> = {};

  if (typeof body.label === "string") data.label = body.label.trim();
  if (body.value !== undefined) {
    const value = Number(body.value);
    if (!Number.isFinite(value)) return badRequest("Value must be a number.");
    data.value = value;
  }
  if (typeof body.prefix === "string") data.prefix = body.prefix.trim() || null;
  if (typeof body.suffix === "string") data.suffix = body.suffix.trim() || null;
  if (typeof body.order === "number") data.order = body.order;
  if (typeof body.isVisible === "boolean") data.isVisible = body.isVisible;

  const stat = await prisma.stat.update({
    where: { id: params.id },
    data,
  });

  revalidatePath("/");
  return NextResponse.json(stat);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdminSession();
  if (error) return error;

  await prisma.stat.delete({ where: { id: params.id } });
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
