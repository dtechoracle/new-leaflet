import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in our database
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      // We can create a minimal user record here; detailed profile
      // information can be filled later from the app if needed.
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          email: "",
          name: null,
        },
      });
    }

    // Check if GitHub is already connected in our DB
    const existingConnection = await prisma.gitHubConnection.findUnique({
      where: { userId: user.id },
    });

    if (existingConnection) {
      return NextResponse.json({
        connected: true,
        username: existingConnection.githubUsername,
      });
    }

    // Fall back to classic GitHub OAuth using app credentials
    const clientId = process.env.GITHUB_CLIENT_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const redirectUri = `${appUrl}/api/github/callback`;

    if (!clientId) {
      console.error("GITHUB_CLIENT_ID is not configured");
      return NextResponse.json(
        { 
          error: "GitHub OAuth is not configured. Please set GITHUB_CLIENT_ID in your environment variables.",
          details: "This is a server configuration issue. Check your Vercel environment variables."
        },
        { status: 500 },
      );
    }

    if (!appUrl || appUrl === "http://localhost:3000") {
      console.warn("NEXT_PUBLIC_APP_URL is not set or using default. This may cause OAuth callback issues in production.");
    }

    const state = Buffer.from(JSON.stringify({ userId: user.id })).toString(
      "base64",
    );

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=repo&state=${state}`;

    return NextResponse.json({
      connected: false,
      authUrl: githubAuthUrl,
    });
  } catch (error) {
    console.error("Error checking GitHub connection:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        error: "Failed to check GitHub connection",
        details: errorMessage,
        hint: "Check server logs for more details. This might be a database connection issue."
      },
      { status: 500 },
    );
  }
}
