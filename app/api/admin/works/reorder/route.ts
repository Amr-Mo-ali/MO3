import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }
  return session;
}

export async function PATCH(req: NextRequest) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const items = Array.isArray(body.items) ? body.items : [];

  if (!items.length) {
    return NextResponse.json({ error: "Order payload is required" }, { status: 400 });
  }

  try {
    const updates = items.map((item: any) =>
      prisma.work.update({
        where: { id: String(item.id) },
        data: { order: Number(item.order) },
      })
    );

    await prisma.$transaction(updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Unable to reorder works" }, { status: 500 });
  }
}
