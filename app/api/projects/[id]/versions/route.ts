import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project || project.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const versions = await prisma.projectVersion.findMany({
      where: { projectId: id },
      orderBy: { versionNumber: "desc" },
      take: 20,
    });

    return NextResponse.json({ versions });
  } catch (error) {
    console.error("Error fetching versions:", error);
    return NextResponse.json({ error: "Failed to fetch versions" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;
    const body = await request.json();
    const { changelog } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project || project.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Get current version number
    const latestVersion = await prisma.projectVersion.findFirst({
      where: { projectId: id },
      orderBy: { versionNumber: "desc" },
    });

    const nextVersion = (latestVersion?.versionNumber || 0) + 1;

    // Create new version
    await prisma.projectVersion.create({
      data: {
        projectId: id,
        versionNumber: nextVersion,
        documentation: project.documentation || "",
        changelog: changelog || null,
      },
    });

    return NextResponse.json({ success: true, versionNumber: nextVersion });
  } catch (error) {
    console.error("Error creating version:", error);
    return NextResponse.json({ error: "Failed to create version" }, { status: 500 });
  }
}
