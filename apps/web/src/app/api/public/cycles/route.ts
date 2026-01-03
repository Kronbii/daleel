/**
 * Public API: Get election cycles
 * GET only
 */

import { NextResponse } from "next/server";
import { prisma } from "@daleel/db";

export async function GET() {
  try {
    const cycles = await prisma.electionCycle.findMany({
      orderBy: { year: "desc" },
      select: {
        id: true,
        name: true,
        year: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: cycles });
  } catch (error) {
    console.error("Error fetching cycles:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cycles" },
      { status: 500 }
    );
  }
}

// Block other methods
export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

