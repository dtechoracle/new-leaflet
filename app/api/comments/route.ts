import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");
    const sectionId = searchParams.get("sectionId");

    if (!projectId) {
      return NextResponse.json({ error: "Project ID required" }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: {
        projectId,
        sectionId: sectionId || null,
        parentId: null, // Only get top-level comments
      },
      include: {
        replies: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify prisma is initialized
    if (!prisma || !prisma.comment) {
      console.error("Prisma client not initialized properly");
      return NextResponse.json({ 
        error: "Database connection error",
        details: "Prisma client not initialized"
      }, { status: 500 });
    }

    const body = await request.json();
    const { projectId, sectionId, authorName, authorEmail, content, parentId } = body;

    if (!projectId || !content) {
      return NextResponse.json({ error: "Project ID and content required" }, { status: 400 });
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        projectId,
        sectionId: sectionId || null,
        authorName: authorName || "Anonymous",
        authorEmail: authorEmail || null,
        content: content.trim(),
        parentId: parentId || null,
      },
      include: {
        replies: true,
      },
    });

    return NextResponse.json({ comment });
  } catch (error: any) {
    console.error("Error creating comment:", error);
    console.error("Error stack:", error?.stack);
    return NextResponse.json({ 
      error: error?.message || "Failed to create comment",
      details: process.env.NODE_ENV === "development" ? error?.stack : undefined
    }, { status: 500 });
  }
}
