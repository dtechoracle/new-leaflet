import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;
    const body = await request.json();
    const { versionNumber } = body;

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

    // Get the version to rollback to
    const version = await prisma.projectVersion.findUnique({
      where: {
        projectId_versionNumber: {
          projectId: id,
          versionNumber,
        },
      },
    });

    if (!version) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    // Rollback project documentation
    await prisma.project.update({
      where: { id },
      data: {
        documentation: version.documentation,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error rolling back:", error);
    return NextResponse.json({ error: "Failed to rollback" }, { status: 500 });
  }
}





