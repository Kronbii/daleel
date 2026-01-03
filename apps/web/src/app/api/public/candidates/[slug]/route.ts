/**
 * Public API: Get candidate by slug
 * GET only
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@daleel/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const candidate = await prisma.candidate.findUnique({
      where: { slug },
      include: {
        district: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            nameFr: true,
            seatCount: true,
          },
        },
        currentList: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            nameFr: true,
            status: true,
          },
        },
        affiliations: {
          orderBy: { startDate: "desc" },
          include: {
            source: {
              select: {
                id: true,
                title: true,
                archivedUrl: true,
                archivedAt: true,
              },
            },
          },
        },
        statements: {
          include: {
            topic: true,
            source: {
              select: {
                id: true,
                title: true,
                archivedUrl: true,
                archivedAt: true,
              },
            },
          },
          orderBy: { occurredAt: "desc" },
        },
        submissions: {
          where: { status: "APPROVED" },
          orderBy: { submittedAt: "desc" },
        },
        rightOfReplies: {
          where: { status: "PUBLISHED" },
          orderBy: { submittedAt: "desc" },
        },
      },
    });

    if (!candidate) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    // Get all sources referenced
    const sourceIds = new Set<string>();
    candidate.affiliations.forEach((a) => sourceIds.add(a.sourceId));
    candidate.statements.forEach((s) => sourceIds.add(s.sourceId));

    const sources = await prisma.source.findMany({
      where: { id: { in: Array.from(sourceIds) } },
      select: {
        id: true,
        title: true,
        publisher: true,
        originalUrl: true,
        archivedUrl: true,
        archivedAt: true,
        archiveMethod: true,
        contentType: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...candidate,
        sources,
      },
    });
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch candidate" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

