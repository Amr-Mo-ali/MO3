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
  const ids = Array.isArray(body.ids) ? body.ids.map(Number) : [];

  if (!ids.length || ids.some((id: number) => Number.isNaN(id))) {
    return NextResponse.json({ error: "Invalid ids payload" }, { status: 400 });
  }

  try {
    await Promise.all(
      ids.map((id: number, index: number) =>
        prisma.section.update({ where: { id }, data: { order: index + 1 } })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Unable to save section order" }, { status: 500 });
  }
}
