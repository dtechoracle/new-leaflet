import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserRepositories } from "@/lib/github";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: { githubConnection: true },
    });

    if (!user || !user.githubConnection) {
      return NextResponse.json(
        { error: "GitHub not connected" },
        { status: 400 }
      );
    }

    // Check if token is expired (simplified - in production, refresh if needed)
    if (
      user.githubConnection.tokenExpiresAt &&
      user.githubConnection.tokenExpiresAt < new Date()
    ) {
      return NextResponse.json(
        { error: "GitHub token expired. Please reconnect." },
        { status: 401 }
      );
    }

    // Fetch repositories
    const repos = await getUserRepositories(user.githubConnection.accessToken);

    return NextResponse.json({ repos });
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}





