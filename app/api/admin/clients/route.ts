import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clients = await prisma.client.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const name = (typeof body.name === "string" ? body.name.trim() : "");
  const logo = (typeof body.logo === "string" ? body.logo.trim() : "");
  const isVisible = typeof body.isVisible === "boolean" ? body.isVisible : true;
  const order = typeof body.order === "number" ? body.order : undefined;

  if (!name || !logo) {
    return NextResponse.json({ error: "Name and logo are required." }, { status: 400 });
  }

  const maxOrder = await prisma.client.aggregate({ _max: { order: true } });
  const nextOrder = order ?? (maxOrder._max.order ?? 0) + 1;

  const client = await prisma.client.create({
    data: {
      name,
      logo,
      isVisible,
      order: nextOrder,
    },
  });

  return NextResponse.json(client, { status: 201 });
}
