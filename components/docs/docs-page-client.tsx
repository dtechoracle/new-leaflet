"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { DocsNavigation } from "@/components/docs/docs-navigation";
import { MobileSidebar } from "@/components/docs/mobile-sidebar";
import { MarkdownRenderer } from "@/components/docs/markdown-renderer";
import { AnalyticsTracker } from "@/components/docs/analytics-tracker";
import { CommentsPanel } from "@/components/docs/comments-panel";
import { CustomizationInjector } from "@/components/docs/customization-injector";
import { FontLoader } from "@/components/docs/font-loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Section {
  id?: string;
  title: string;
  content?: string;
}

interface DocsPageClientProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    logoUrl: string | null;
    primaryColor: string | null;
    customCSS?: string | null;
    customJS?: string | null;
    fontFamily?: string | null;
    fontSize?: string | null;
    themePreset?: string | null;
  };
  sections: Section[];
  readme?: string | null;
}

interface NavItem extends Section {
  id: string;
  kind: "section" | "readme";
}

export function DocsPageClient({ project, sections, readme }: DocsPageClientProps) {
  const { isSignedIn } = useAuth();
  const primaryColor = project.primaryColor || "#6366f1";

  const items: NavItem[] = useMemo(() => {
    const base: NavItem[] = sections.map((s, index) => ({
      id: s.id || `section-${index}`,
      title: s.title,
      content: s.content,
      kind: "section" as const,
    }));

    if (readme) {
      base.push({
        id: "readme",
        title: "README",
        content: readme,
        kind: "readme" as const,
      });
    }

    return base;
  }, [sections, readme]);

  const [activeIndex, setActiveIndex] = useState(0);

  const activeItem = items[activeIndex];

  const handleSelect = (id: string) => {
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      setActiveIndex(index);
      // Scroll main content to top on segment change
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goPrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goNext = () => {
    if (activeIndex < items.length - 1) {
      setActiveIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" data-docs-container>
      {/* Font Loader */}
      <FontLoader fontFamily={project.fontFamily} />
      
      {/* Customization Injector */}
      <CustomizationInjector
        customCSS={project.customCSS}
        customJS={project.customJS}
        fontFamily={project.fontFamily}
        fontSize={project.fontSize}
        themePreset={project.themePreset}
      />
      
      {/* Header with project info and theme toggle - Fixed */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl lg:mb-6"
        style={{
          borderBottomColor: `${primaryColor}20`,
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {project.logoUrl && (
              <div className="flex-shrink-0">
                <img
                  src={project.logoUrl}
                  alt={project.name}
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover border border-border"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg font-bold text-foreground truncate">{project.name}</h1>
              {project.description && (
                <p className="text-xs text-muted-foreground truncate hidden sm:block">
                  {project.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {isSignedIn && (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[73px]" />

      {/* Mobile Sidebar Toggle */}
      <MobileSidebar
        sections={items}
        hasReadme={!!readme}
        activeId={activeItem?.id}
        onSelect={handleSelect}
        themePreset={project.themePreset}
      />

      {/* Main Layout */}
      <div className="flex-1 flex relative">
        {/* Sidebar Navigation - Fixed */}
        <aside className="hidden lg:block w-64 border-r border-border bg-card/40 overflow-y-auto fixed left-0 top-[73px] bottom-0">
          <DocsSidebar
            sections={items}
            hasReadme={!!readme}
            activeId={activeItem?.id}
            onSelect={handleSelect}
          />
        </aside>

        {/* Spacer for fixed sidebar on desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0" />

        {/* Main Content - single active segment */}
        <main className="flex-1 min-w-0 w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {items.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  Documentation is being generated...
                </p>
              </div>
            ) : (
              <>
                {activeItem && (
                  <article className="mb-12 sm:mb-16">
                    <h2
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-border"
                      style={{ color: primaryColor }}
                    >
                      {activeItem.title}
                    </h2>
                    <MarkdownRenderer content={activeItem.content || ""} themePreset={project.themePreset} />
                    {/* Analytics tracking */}
                    <AnalyticsTracker projectId={project.id} sectionId={activeItem.id} />
                  </article>
                )}

                <DocsNavigation
                  items={items}
                  activeIndex={activeIndex}
                  onPrevious={goPrevious}
                  onNext={goNext}
                />
              </>
            )}
          </div>
        </main>
      </div>
      
      {/* Comments panel */}
      <CommentsPanel projectId={project.id} sectionId={activeItem?.id} />
    </div>
  );
}


