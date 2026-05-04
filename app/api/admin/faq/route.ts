import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { badRequest, requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const faqs = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(faqs);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await req.json();
  const question = String(body.question ?? "").trim();
  const answer = String(body.answer ?? "").trim();
  const isVisible = typeof body.isVisible === "boolean" ? body.isVisible : true;
  const order = typeof body.order === "number" ? body.order : undefined;

  if (!question || !answer) {
    return badRequest("Question and answer are required.");
  }

  const maxOrder = await prisma.fAQ.aggregate({ _max: { order: true } });
  const faq = await prisma.fAQ.create({
    data: {
      question,
      answer,
      isVisible,
      order: order ?? (maxOrder._max.order ?? 0) + 1,
    },
  });

  revalidatePath("/");
  return NextResponse.json(faq, { status: 201 });
}
