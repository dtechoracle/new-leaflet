import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, sectionId, timeSpent, referrer } = body;

    if (!projectId) {
      return NextResponse.json({ error: "Project ID required" }, { status: 400 });
    }

    // Get client IP and user agent
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Create analytics entry
    await prisma.projectAnalytics.create({
      data: {
        projectId,
        sectionId: sectionId || null,
        timeSpent: timeSpent || null,
        referrer: referrer || null,
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking analytics:", error);
    return NextResponse.json({ error: "Failed to track analytics" }, { status: 500 });
  }
}

