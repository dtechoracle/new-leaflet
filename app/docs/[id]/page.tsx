import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DocsPageClient } from "@/components/docs/docs-page-client";

export const revalidate = 0; // Disable caching for this page

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublishedDocsPage({ params }: PageProps) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project || project.status !== "PUBLISHED") {
    notFound();
  }

  let documentation: any = null;
  if (project.documentation) {
    try {
      documentation = JSON.parse(project.documentation);
    } catch {
      documentation = null;
    }
  }

  const sections = (documentation?.sections || []) as Array<{
    id?: string;
    title: string;
    content?: string;
  }>;

  return (
    <DocsPageClient
      project={{
        id: project.id,
        name: project.name,
        description: project.description,
        logoUrl: project.logoUrl,
        primaryColor: project.primaryColor,
        customCSS: project.customCSS,
        customJS: project.customJS,
        fontFamily: project.fontFamily,
        fontSize: project.fontSize,
        themePreset: project.themePreset,
      }}
      sections={sections}
      readme={documentation?.readme ?? null}
    />
  );
}