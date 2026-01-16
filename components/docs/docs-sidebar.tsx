"use client";

import { cn } from "@/lib/utils";
import { DocsSearch } from "./docs-search";

interface Section {
  id: string;
  title: string;
  content?: string;
}

interface DocsSidebarProps {
  sections: Section[];
  hasReadme?: boolean;
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function DocsSidebar({
  sections,
  hasReadme,
  activeId,
  onSelect,
}: DocsSidebarProps) {
  return (
    <nav className="p-4 sm:p-6 space-y-4">
      {/* Search */}
      <DocsSearch sections={sections} onSelect={onSelect} />
      
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">
          Documentation
        </p>
      </div>
      {sections.map((section, index) => {
        const sectionId = section.id || `section-${index}`;
        const isActive = activeId === sectionId;
        return (
          <a
            key={sectionId}
            href={`#${sectionId}`}
            onClick={(e) => {
              e.preventDefault();
              onSelect?.(sectionId);
            }}
            className={cn(
              "block px-3 py-2.5 text-sm rounded-lg transition-colors",
              "truncate",
              isActive
                ? "bg-accent text-foreground font-medium border-l-2 border-foreground/30"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
            title={section.title}
          >
            {section.title}
          </a>
        );
      })}
      {hasReadme && (
        <>
          <div className="my-4 border-t border-border" />
          <a
            href="#readme"
            onClick={(e) => {
              e.preventDefault();
              onSelect?.("readme");
            }}
            className={cn(
              "block px-3 py-2.5 text-sm rounded-lg transition-colors",
              activeId === "readme"
                ? "bg-accent text-foreground font-medium border-l-2 border-foreground/30"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            README
          </a>
        </>
      )}
    </nav>
  );
}
