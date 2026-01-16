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
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.status !== "READY" && project.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Project is not ready to publish" },
        { status: 400 }
      );
    }

    // Generate published URL (in production, this would deploy to a hosting service)
    const publishedUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/docs/${project.id}`;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedUrl,
      },
    });

    return NextResponse.json({ 
      project: updatedProject,
      publishedUrl,
    });
  } catch (error) {
    console.error("Error publishing project:", error);
    return NextResponse.json(
      { error: "Failed to publish project" },
      { status: 500 }
    );
  }
}

