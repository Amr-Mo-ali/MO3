import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await req.json();
  const data: Record<string, unknown> = {};

  if (typeof body.question === "string") data.question = body.question.trim();
  if (typeof body.answer === "string") data.answer = body.answer.trim();
  if (typeof body.order === "number") data.order = body.order;
  if (typeof body.isVisible === "boolean") data.isVisible = body.isVisible;

  const faq = await prisma.fAQ.update({
    where: { id: params.id },
    data,
  });

  revalidatePath("/");
  return NextResponse.json(faq);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdminSession();
  if (error) return error;

  await prisma.fAQ.delete({ where: { id: params.id } });
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
