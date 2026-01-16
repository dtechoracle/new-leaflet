import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createGitHubClient } from "@/lib/github";

interface ScanRequest {
  repositoryOwner: string;
  repositoryName: string;
}

interface RepositoryFileSummary {
  name: string;
  path: string;
  type: string;
}

interface DocumentationSection {
  id: string;
  title: string;
  content: string;
}

interface GeneratedDocumentation {
  title: string;
  description: string;
  readme: string;
  structure: RepositoryFileSummary[];
  packageInfo: unknown;
  sections: DocumentationSection[];
  generatedAt: string;
}

function buildAiPrompt(params: {
  repoName: string;
  repoDescription: string;
  readme: string;
  packageJson: unknown;
  structure: RepositoryFileSummary[];
}): string {
  const { repoName, repoDescription, readme, packageJson, structure } = params;

  const truncatedReadme =
    readme.length > 8000 ? `${readme.slice(0, 8000)}\n\n...[truncated]` : readme;

  const structurePreview = structure
    .slice(0, 40)
    .map((f) => `- ${f.path}`)
    .join("\n");

  const packagePreview =
    typeof packageJson === "object" && packageJson !== null
      ? JSON.stringify(packageJson).slice(0, 2000)
      : "None / not a JS project";

  return [
    `You are an expert technical writer generating documentation for a codebase called "${repoName}".`,
    ``,
    `High-level repository description (from GitHub):`,
    repoDescription || "No description provided.",
    ``,
    `Key files in the root of the repo:`,
    structurePreview || "No files found.",
    ``,
    `package.json (if present, truncated):`,
    packagePreview,
    ``,
    `README.md (if present, truncated):`,
    truncatedReadme || "No README found.",
    ``,
    `Return ONLY valid JSON with the following shape:`,
    `{"sections":[{"id":"overview","title":"...","content":"... (markdown ok)"},{"id":"getting-started","title":"...","content":"..."},{"id":"architecture","title":"...","content":"..."},{"id":"api-reference","title":"...","content":"..."}]}`,
    ``,
    `- "overview" should summarize the problem, what this repo does, and key concepts.`,
    `- "getting-started" should include install, setup, env vars and basic usage steps.`,
    `- "architecture" should explain main modules, data flow, and how things fit.`,
    `- "api-reference" should document important public functions, endpoints or components.`,
    `Do NOT include any text outside of the JSON.`,
  ].join("\n");
}

async function generateDocumentationWithAI(args: {
  base: Omit<GeneratedDocumentation, "sections" | "generatedAt">;
}): Promise<GeneratedDocumentation> {
  const apiKey = process.env.OPENAI_API_KEY;

  // If no key is configured, fall back to non‑AI docs
  if (!apiKey) {
    return {
      ...args.base,
      sections: [
        {
          id: "overview",
          title: "Overview",
          content:
            args.base.description || "No description available. Add one in GitHub.",
        },
        {
          id: "getting-started",
          title: "Getting Started",
          content:
            args.base.readme ||
            "Add a README.md with installation and setup instructions to improve this section.",
        },
        {
          id: "architecture",
          title: "Architecture",
          content:
            "Leaflet will describe your architecture once you provide an OpenAI API key and rescan this repository.",
        },
        {
          id: "api-reference",
          title: "API Reference",
          content:
            "API documentation will be generated from your exported functions, components, and routes.",
        },
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  const prompt = buildAiPrompt({
    repoName: args.base.title,
    repoDescription: args.base.description,
    readme: args.base.readme,
    packageJson: args.base.packageInfo,
    structure: args.base.structure,
  });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "You are a precise technical documentation generator.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenAI API error:", text);
      throw new Error("OpenAI API request failed");
    }

    const json = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    const rawContent = json.choices?.[0]?.message?.content ?? "";

    // The model returns JSON as text; parse it.
    let parsed: { sections?: DocumentationSection[] } = {};
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      console.warn("Failed to parse AI JSON, returning fallback docs");
      return {
        ...(await generateDocumentationWithAI({ base: args.base })),
        generatedAt: new Date().toISOString(),
      };
    }

    const aiSections = Array.isArray(parsed.sections)
      ? parsed.sections
      : await generateDocumentationWithAI({ base: args.base }).then(
          (f) => f.sections,
        );

    return {
      ...args.base,
      sections: aiSections,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error generating AI documentation:", error);
    // Fall back to non‑AI docs if anything goes wrong
    return generateDocumentationWithAI({ base: args.base });
  }
}

async function scanRepository(
  accessToken: string,
  owner: string,
  repo: string,
): Promise<GeneratedDocumentation> {
  const octokit = createGitHubClient(accessToken);

  // Get repository metadata
  const { data: repoData } = await octokit.rest.repos.get({
    owner,
    repo,
  });

  // Get README if exists
  let readme = "";
  try {
    const { data: readmeData } = await octokit.rest.repos.getReadme({
      owner,
      repo,
    });
    readme = Buffer.from(readmeData.content, "base64").toString("utf-8");
  } catch {
    // README doesn't exist
  }

  // Get package.json or similar config files
  let packageJson: unknown = null;
  try {
    const { data: pkgData } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: "package.json",
    });
    if ("content" in pkgData) {
      packageJson = JSON.parse(
        Buffer.from(pkgData.content, "base64").toString("utf-8"),
      );
    }
  } catch {
    // package.json doesn't exist
  }

  // Get directory structure (simplified - just root level)
  const { data: contents } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: "",
  });

  const structure: RepositoryFileSummary[] = Array.isArray(contents)
    ? contents
        .filter((item) => item.type === "file")
        .map((item) => ({
          name: item.name,
          path: item.path,
          type: item.type,
        }))
    : [];

  const base: Omit<GeneratedDocumentation, "sections" | "generatedAt"> = {
    title: repoData.name,
    description: repoData.description || "",
    readme,
    structure,
    packageInfo: packageJson,
  };

  return generateDocumentationWithAI({ base });
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ScanRequest = await request.json();
    const { repositoryOwner, repositoryName } = body;

    // Get user and GitHub connection
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

    // Check if project already exists
    const existingProject = await prisma.project.findFirst({
      where: {
        userId: user.id,
        repositoryName,
        repositoryOwner,
      },
    });

    let project;
    if (existingProject) {
      project = await prisma.project.update({
        where: { id: existingProject.id },
        data: {
          status: "SCANNING",
        },
      });
    } else {
      project = await prisma.project.create({
        data: {
          userId: user.id,
          name: repositoryName,
          repositoryName,
          repositoryOwner,
          repositoryUrl: `https://github.com/${repositoryOwner}/${repositoryName}`,
          status: "SCANNING",
        },
      });
    }

    // Scan repository
    const documentation = await scanRepository(
      user.githubConnection.accessToken,
      repositoryOwner,
      repositoryName
    );

    // Update project with documentation (store as JSON string for SQLite)
    await prisma.project.update({
      where: { id: project.id },
      data: {
        documentation: JSON.stringify(documentation),
        status: "READY",
      },
    });

    return NextResponse.json({
      projectId: project.id,
      documentation,
      status: "ready",
    });
  } catch (error) {
    console.error("Error scanning repository:", error);
    return NextResponse.json(
      { error: "Failed to scan repository" },
      { status: 500 }
    );
  }
}
