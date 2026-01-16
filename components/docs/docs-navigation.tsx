"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface Section {
  id: string;
  title: string;
}

interface DocsNavigationProps {
  items: Section[];
  activeIndex: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function DocsNavigation({
  items,
  activeIndex,
  onPrevious,
  onNext,
}: DocsNavigationProps) {
  const previousSection = activeIndex > 0 ? items[activeIndex - 1] : null;
  const nextSection =
    activeIndex < items.length - 1 ? items[activeIndex + 1] : null;

  if (!previousSection && !nextSection) {
    return null;
  }

  return (
    <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border flex flex-row items-center justify-between gap-2 sm:gap-4">
      {previousSection ? (
        <Button
          variant="outline"
          className="flex items-center gap-2 flex-1 sm:flex-initial min-w-0"
          onClick={onPrevious}
        >
          <ChevronLeft className="h-4 w-4 flex-shrink-0" />
          <div className="text-left min-w-0 hidden sm:block">
            <div className="text-xs text-muted-foreground">Previous</div>
            <div className="text-sm font-medium truncate">{previousSection.title}</div>
          </div>
          <span className="text-sm font-medium truncate sm:hidden">{previousSection.title}</span>
        </Button>
      ) : (
        <div className="flex-1" />
      )}

      {nextSection && (
        <Button
          variant="outline"
          className="flex items-center gap-2 flex-1 sm:flex-initial min-w-0"
          onClick={onNext}
        >
          <div className="text-right min-w-0 flex-1 hidden sm:block">
            <div className="text-xs text-muted-foreground">Next</div>
            <div className="text-sm font-medium truncate">{nextSection.title}</div>
          </div>
          <span className="text-sm font-medium truncate sm:hidden">{nextSection.title}</span>
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
        </Button>
      )}
    </div>
  );
}
