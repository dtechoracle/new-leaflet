"use client";

import { cn } from "@/lib/utils";

interface Section {
  id: string;
  title: string;
}

interface TocSidebarProps {
  items: Section[];
  activeId?: string;
}

export function TocSidebar({ items, activeId }: TocSidebarProps) {
  return (
    <div className="p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        On This Page
      </p>
      <nav className="space-y-2">
        {items.map((section, index) => {
          const sectionId = section.id || `section-${index}`;
          const isActive = activeId === sectionId;
          return (
            <div
              key={sectionId}
              className={cn(
                "flex items-center gap-2 text-sm py-1",
                isActive
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  isActive ? "bg-purple-400" : "bg-white/20"
                )}
              />
              {section.title}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
