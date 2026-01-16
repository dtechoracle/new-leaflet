import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { authorName, authorEmail, content } = body;

    if (!content) {
      return NextResponse.json({ error: "Content required" }, { status: 400 });
    }

    // Get the parent comment to check if it has an email
    const parentComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!parentComment) {
      return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
    }

    // Create reply
    const reply = await prisma.comment.create({
      data: {
        projectId: parentComment.projectId,
        sectionId: parentComment.sectionId,
        authorName: authorName || "Anonymous",
        authorEmail: authorEmail || null,
        content,
        parentId: id,
      },
      include: {
        replies: true,
      },
    });

    // TODO: Send email notification to parent comment author if they provided an email
    // This would require an email service integration (e.g., Resend, SendGrid)
    if (parentComment.authorEmail) {
      // Email notification logic would go here
      console.log(`Would send email notification to ${parentComment.authorEmail} about reply to their comment`);
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json({ error: "Failed to create reply" }, { status: 500 });
  }
}

