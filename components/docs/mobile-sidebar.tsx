"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocsSidebar } from "./docs-sidebar";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  title: string;
}

interface MobileSidebarProps {
  sections: Section[];
  hasReadme?: boolean;
  activeId?: string;
  onSelect?: (id: string) => void;
  themePreset?: string | null;
}

export function MobileSidebar({
  sections,
  hasReadme,
  activeId,
  onSelect,
  themePreset,
}: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Get theme-specific styles
  const getThemeStyles = () => {
    switch (themePreset) {
      case "light":
        return {
          sidebar: "bg-white border-r border-gray-200",
          header: "bg-white border-b border-gray-200",
          overlay: "bg-black/40",
          toggle: "bg-white border-gray-300",
        };
      case "purple":
        return {
          sidebar: "bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 border-r border-purple-500/30",
          header: "bg-purple-900/60 border-b border-purple-500/30",
          overlay: "bg-black/70",
          toggle: "bg-purple-900/90 border-purple-500/40",
        };
      case "blue":
        return {
          sidebar: "bg-gradient-to-br from-blue-950 via-sky-900 to-indigo-950 border-r border-blue-500/30",
          header: "bg-blue-900/60 border-b border-blue-500/30",
          overlay: "bg-black/70",
          toggle: "bg-blue-900/90 border-blue-500/40",
        };
      case "green":
        return {
          sidebar: "bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950 border-r border-green-500/30",
          header: "bg-green-900/60 border-b border-green-500/30",
          overlay: "bg-black/70",
          toggle: "bg-green-900/90 border-green-500/40",
        };
      case "minimal":
        return {
          sidebar: "bg-gray-50 border-r border-gray-300",
          header: "bg-white border-b border-gray-200",
          overlay: "bg-black/30",
          toggle: "bg-white border-gray-300",
        };
      default: // default dark
        return {
          sidebar: "bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border-r border-zinc-800",
          header: "bg-zinc-900/80 border-b border-zinc-800",
          overlay: "bg-black/80",
          toggle: "bg-zinc-900/95 border-zinc-800",
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "lg:hidden fixed top-[73px] left-2 sm:left-4 z-50",
          "backdrop-blur-sm border shadow-lg",
          themeStyles.toggle
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <>
          {/* Theme-aware overlay */}
          <div
            className={cn(
              "fixed inset-0 z-40 lg:hidden transition-opacity",
              themeStyles.overlay
            )}
            onClick={() => setIsOpen(false)}
          />
          {/* Theme-aware sidebar */}
          <aside 
            className={cn(
              "fixed inset-0 top-[73px] z-50 overflow-y-auto lg:hidden",
              "transition-transform duration-300 ease-in-out",
              themeStyles.sidebar
            )}
          >
            {/* Close button header */}
            <div className={cn(
              "sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b",
              themeStyles.header
            )}>
              <h2 className="text-sm font-semibold text-foreground">Navigation</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-accent/50"
                onClick={() => setIsOpen(false)}
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <DocsSidebar
              sections={sections}
              hasReadme={hasReadme}
              activeId={activeId}
              onSelect={(id) => {
                onSelect?.(id);
                setIsOpen(false);
              }}
            />
          </aside>
        </>
      )}
    </>
  );
}
