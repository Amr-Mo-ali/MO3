import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { badRequest, requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await req.json();
  const data: Record<string, unknown> = {};

  if (typeof body.name === "string") data.name = body.name.trim();
  if (typeof body.role === "string") data.role = body.role.trim();
  if (typeof body.company === "string") data.company = body.company.trim();
  if (typeof body.quote === "string") data.quote = body.quote.trim();
  if (body.rating !== undefined) {
    const rating = Number(body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return badRequest("Rating must be an integer from 1 to 5.");
    }
    data.rating = rating;
  }
  if (typeof body.photo === "string") data.photo = body.photo.trim() || null;
  if (typeof body.order === "number") data.order = body.order;
  if (typeof body.isVisible === "boolean") data.isVisible = body.isVisible;

  const testimonial = await prisma.testimonial.update({
    where: { id: params.id },
    data,
  });

  revalidatePath("/");
  return NextResponse.json(testimonial);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdminSession();
  if (error) return error;

  await prisma.testimonial.delete({ where: { id: params.id } });
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
