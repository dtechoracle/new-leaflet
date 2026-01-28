import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    // Get overall stats
    const totalViews = await prisma.projectAnalytics.count({
      where: { projectId },
    });

    // Get views by section
    const sectionViews = await prisma.projectAnalytics.groupBy({
      by: ["sectionId"],
      where: { projectId },
      _count: { sectionId: true },
      orderBy: { _count: { sectionId: "desc" } },
      take: 10,
    });

    // Get total time spent
    const timeSpentData = await prisma.projectAnalytics.aggregate({
      where: {
        projectId,
        timeSpent: { not: null },
      },
      _sum: { timeSpent: true },
    });

    // Get top referrers
    const topReferrers = await prisma.projectAnalytics.groupBy({
      by: ["referrer"],
      where: {
        projectId,
        referrer: { not: null },
      },
      _count: { referrer: true },
      orderBy: { _count: { referrer: "desc" } },
      take: 10,
    });

    return NextResponse.json({
      totalViews,
      totalTimeSpent: timeSpentData._sum.timeSpent || 0,
      popularSections: sectionViews.map((sv) => ({
        sectionId: sv.sectionId,
        views: sv._count.sectionId,
      })),
      topReferrers: topReferrers.map((tr) => ({
        referrer: tr.referrer,
        count: tr._count.referrer,
      })),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}





