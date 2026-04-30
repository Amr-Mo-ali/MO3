import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
  const previousClient = await prisma.client.findUnique({ where: { id: clientId } });

  if (!previousClient) {
    return NextResponse.json({ error: "Client not found." }, { status: 404 });
  }

  if (typeof body.name === "string") data.name = body.name.trim();
  if (typeof body.logo === "string") data.logo = body.logo.trim();
  if (typeof body.isVisible === "boolean") data.isVisible = body.isVisible;
  if (typeof body.order === "number") data.order = body.order;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid client fields provided." }, { status: 400 });
  }

  const client = await prisma.$transaction(async (tx) => {
    if (typeof data.order === "number" && data.order !== previousClient.order) {
      const targetOrder = Math.max(1, data.order);
      if (targetOrder > previousClient.order) {
        await tx.client.updateMany({
          where: {
            id: { not: clientId },
            order: { gt: previousClient.order, lte: targetOrder },
          },
          data: { order: { decrement: 1 } },
        });
      } else {
        await tx.client.updateMany({
          where: {
            id: { not: clientId },
            order: { gte: targetOrder, lt: previousClient.order },
          },
          data: { order: { increment: 1 } },
        });
      }
      data.order = targetOrder;
    }

    return tx.client.update({
      where: { id: clientId },
      data,
    });
  });

  revalidatePath("/");

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

  await prisma.$transaction(async (tx) => {
    const client = await tx.client.findUnique({ where: { id: clientId } });
    if (!client) {
      throw new Error("CLIENT_NOT_FOUND");
    }

    await tx.client.delete({ where: { id: clientId } });
    await tx.client.updateMany({
      where: { order: { gt: client.order } },
      data: { order: { decrement: 1 } },
    });
  });
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
