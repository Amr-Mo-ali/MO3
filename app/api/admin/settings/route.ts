import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.siteConfig.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const values = body?.values ?? body;

  if (!values || typeof values !== "object" || Array.isArray(values)) {
    return NextResponse.json({ error: "Invalid settings payload." }, { status: 400 });
  }

  const entries = Object.entries(values).filter(([, value]) => typeof value === "string") as Array<[string, string]>;

  await Promise.all(
    entries.map(([key, value]) =>
      prisma.siteConfig.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  return NextResponse.json({ success: true });
}
