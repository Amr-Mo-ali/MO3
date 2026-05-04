import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { badRequest, requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(testimonials);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await req.json();
  const name = String(body.name ?? "").trim();
  const role = String(body.role ?? "").trim();
  const company = String(body.company ?? "").trim();
  const quote = String(body.quote ?? "").trim();
  const rating = Number(body.rating);
  const photo = String(body.photo ?? "").trim();
  const isVisible = typeof body.isVisible === "boolean" ? body.isVisible : true;
  const order = typeof body.order === "number" ? body.order : undefined;

  if (!name || !role || !company || !quote || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return badRequest("Name, role, company, quote, and rating from 1 to 5 are required.");
  }

  const maxOrder = await prisma.testimonial.aggregate({ _max: { order: true } });
  const testimonial = await prisma.testimonial.create({
    data: {
      name,
      role,
      company,
      quote,
      rating,
      photo: photo || null,
      isVisible,
      order: order ?? (maxOrder._max.order ?? 0) + 1,
    },
  });

  revalidatePath("/");
  return NextResponse.json(testimonial, { status: 201 });
}
