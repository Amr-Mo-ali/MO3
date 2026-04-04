import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = params.id;
  if (!clientId) {
    return NextResponse.json({ error: "Invalid client ID." }, { status: 400 });
  }

  const body = await req.json();
  const data: Record<string, any> = {};

  if (typeof body.name === "string") data.name = body.name.trim();
  if (typeof body.logo === "string") data.logo = body.logo.trim();
  if (typeof body.isVisible === "boolean") data.isVisible = body.isVisible;
  if (typeof body.order === "number") data.order = body.order;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid client fields provided." }, { status: 400 });
  }

  const client = await prisma.client.update({
    where: { id: clientId },
    data,
  });

  return NextResponse.json(client);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = params.id;
  if (!clientId) {
    return NextResponse.json({ error: "Invalid client ID." }, { status: 400 });
  }

  await prisma.client.delete({ where: { id: clientId } });
  return NextResponse.json({ success: true });
}
