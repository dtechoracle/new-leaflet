"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  title: string;
  content?: string;
}

interface DocsSearchProps {
  sections: Section[];
  onSelect?: (sectionId: string) => void;
}

export function DocsSearch({ sections, onSelect }: DocsSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    const matches: Array<{ section: Section; score: number; matches: string[] }> = [];

    sections.forEach((section) => {
      const titleMatch = section.title.toLowerCase().includes(searchTerm);
      const contentMatch = section.content?.toLowerCase().includes(searchTerm) || false;
      
      if (titleMatch || contentMatch) {
        const score = titleMatch ? 2 : 1; // Title matches are more important
        const matchSnippets: string[] = [];
        
        // Find matching snippets
        if (contentMatch && section.content) {
          const content = section.content.toLowerCase();
          const index = content.indexOf(searchTerm);
          if (index !== -1) {
            const start = Math.max(0, index - 50);
            const end = Math.min(content.length, index + searchTerm.length + 50);
            matchSnippets.push(section.content.slice(start, end));
          }
        }
        
        matchSnippets.push(section.title);
        
        matches.push({ section, score, matches: matchSnippets });
      }
    });

    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [query, sections]);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelect = (section: Section) => {
    const sectionId = section.id || `section-${sections.indexOf(section)}`;
    onSelect?.(sectionId);
    setIsOpen(false);
    setQuery("");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 rounded-lg",
          "text-sm text-muted-foreground",
          "border border-border/50 bg-background/50",
          "hover:bg-accent hover:text-foreground",
          "transition-colors"
        )}
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search docs...</span>
        <kbd className="hidden sm:inline-flex h-5 px-1.5 items-center gap-1 rounded border border-border bg-muted text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search documentation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 pr-9"
          autoFocus
        />
        <button
          onClick={() => {
            setIsOpen(false);
            setQuery("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </button>
      </div>

      {query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((result, index) => (
                <button
                  key={`${result.section.id || index}-${index}`}
                  onClick={() => handleSelect(result.section)}
                  className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="font-medium text-sm mb-1">{result.section.title}</div>
                  {result.matches.length > 0 && result.matches[0] !== result.section.title && (
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {result.matches[0]}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
