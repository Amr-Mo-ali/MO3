import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

function parseTags(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((tag: any) => String(tag).trim()).filter((tag: any) => tag.length > 0);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag: any) => tag.trim())
      .filter((tag: any) => tag.length > 0);
  }
  return [];
}

function parseOptionalString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function parseOptionalNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

export async function GET(req: NextRequest) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sectionId = req.nextUrl.searchParams.get("sectionId") ?? undefined;
  const where = sectionId ? { sectionId } : undefined;

  const works = await prisma.work.findMany({
    where,
    orderBy: { order: "asc" },
    include: {
      section: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return NextResponse.json(works);
}

export async function POST(req: NextRequest) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const title = String(body.title || "").trim();
  const client = String(body.client || "").trim();
  const videoUrl = String(body.videoUrl || "").trim();
  const thumbnail = String(body.thumbnail || "").trim();
  const description = String(body.description || "").trim();
  const sectionId = String(body.sectionId ?? "");
  const isVisible = typeof body.isVisible === "boolean" ? body.isVisible : true;
  const order = typeof body.order === "number" ? body.order : undefined;
  const tags = parseTags(body.tags);
  const locationLabel = parseOptionalString(body.locationLabel);
  const locationCity = parseOptionalString(body.locationCity);
  const locationCountry = parseOptionalString(body.locationCountry);
  const locationLat = parseOptionalNumber(body.locationLat);
  const locationLng = parseOptionalNumber(body.locationLng);
  const showOnMap = typeof body.showOnMap === "boolean" ? body.showOnMap : false;

  if (!title || !client || !videoUrl || !thumbnail || !sectionId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (showOnMap && (!locationCity || locationLat == null || locationLng == null)) {
    return NextResponse.json(
      { error: "City, latitude, and longitude are required when showing a work on the map." },
      { status: 400 }
    );
  }

  const section = await prisma.section.findUnique({ where: { id: sectionId } });
  if (!section) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  const realOrder =
    typeof order === "number"
      ? order
      : ((await prisma.work.aggregate({
          where: { sectionId },
          _max: { order: true },
        }))._max.order ?? 0) + 1;

  try {
    const work = await prisma.work.create({
      data: {
        title,
        client,
        videoUrl,
        thumbnail,
        description,
        tags,
        locationLabel,
        locationCity,
        locationCountry,
        locationLat: showOnMap ? locationLat ?? null : null,
        locationLng: showOnMap ? locationLng ?? null : null,
        showOnMap,
        isVisible,
        order: realOrder,
        section: { connect: { id: sectionId } },
      },
      include: {
        section: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    revalidatePath("/");

    return NextResponse.json(work, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Unable to create work" }, { status: 500 });
  }
}
