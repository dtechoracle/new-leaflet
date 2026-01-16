"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  themePreset?: string | null;
}

interface CodeBlockProps {
  className?: string;
  children: React.ReactNode;
  themePreset?: string | null;
}

function CodeBlock({ className, children, themePreset }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match?.[1] ?? "";
  const code = String(children ?? "").replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently fail if clipboard is not available
    }
  };

  // Theme-based styling
  const getThemeStyles = () => {
    switch (themePreset) {
      case "light":
        return {
          container: "bg-gray-50 border-gray-200/80 shadow-sm",
          header: "bg-white/80 border-b border-gray-200",
          button: "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300",
          buttonActive: "bg-green-100 text-green-700 border-green-300",
        };
      case "purple":
        return {
          container: "bg-gradient-to-br from-purple-950/40 via-purple-900/30 to-indigo-950/40 border-purple-500/30 shadow-lg shadow-purple-500/10",
          header: "bg-purple-900/40 border-b border-purple-500/30",
          button: "bg-purple-800/60 hover:bg-purple-700/80 text-purple-100 border-purple-500/40",
          buttonActive: "bg-green-500/20 text-green-300 border-green-400/50",
        };
      case "blue":
        return {
          container: "bg-gradient-to-br from-blue-950/40 via-sky-900/30 to-indigo-950/40 border-blue-500/30 shadow-lg shadow-blue-500/10",
          header: "bg-blue-900/40 border-b border-blue-500/30",
          button: "bg-blue-800/60 hover:bg-blue-700/80 text-blue-100 border-blue-500/40",
          buttonActive: "bg-green-500/20 text-green-300 border-green-400/50",
        };
      case "green":
        return {
          container: "bg-gradient-to-br from-green-950/40 via-emerald-900/30 to-teal-950/40 border-green-500/30 shadow-lg shadow-green-500/10",
          header: "bg-green-900/40 border-b border-green-500/30",
          button: "bg-green-800/60 hover:bg-green-700/80 text-green-100 border-green-500/40",
          buttonActive: "bg-emerald-500/20 text-emerald-300 border-emerald-400/50",
        };
      case "minimal":
        return {
          container: "bg-gray-50 border-gray-300/50 shadow-sm",
          header: "bg-white border-b border-gray-200",
          button: "bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-300",
          buttonActive: "bg-green-100 text-green-600 border-green-300",
        };
      default: // default dark
        return {
          container: "bg-gradient-to-br from-zinc-950/90 via-zinc-900/80 to-black/90 border-zinc-800/60 shadow-xl shadow-black/20",
          header: "bg-zinc-900/60 border-b border-zinc-800/60",
          button: "bg-zinc-800/80 hover:bg-zinc-700/90 text-zinc-200 border-zinc-700/60",
          buttonActive: "bg-green-500/20 text-green-400 border-green-500/50",
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div className="relative my-8 sm:my-10 group">
      {/* Modern code block container */}
      <div className={cn(
        "relative overflow-hidden rounded-2xl border backdrop-blur-sm",
        themeStyles.container,
        "transition-all duration-300 hover:shadow-2xl"
      )}>
        {/* Header bar with language and copy button */}
        <div className={cn(
          "flex items-center justify-between px-4 py-2.5 border-b",
          themeStyles.header
        )}>
          <div className="flex items-center gap-2">
            {language && (
              <>
                <div className="h-2 w-2 rounded-full bg-red-500/80" />
                <div className="h-2 w-2 rounded-full bg-yellow-500/80" />
                <div className="h-2 w-2 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {language}
                </span>
              </>
            )}
            {!language && (
              <span className="text-xs font-medium text-muted-foreground">Code</span>
            )}
          </div>
          
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-1.5",
              "text-xs font-medium transition-all duration-200",
              "border shadow-sm",
              copied ? themeStyles.buttonActive : themeStyles.button,
              "hover:scale-105 active:scale-95"
            )}
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        
        {/* Code content area */}
        <div className="relative">
          <pre
            className={cn(
              "overflow-x-auto m-0",
              "text-[13px] sm:text-sm lg:text-[15px]",
              "leading-[1.75] font-mono",
              "tracking-wide",
              className
            )}
            style={{
              fontFamily: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
              fontFeatureSettings: "'liga' 1, 'calt' 1",
              paddingLeft: '1.75rem',
              paddingRight: '1.75rem',
              paddingTop: '1.5rem',
              paddingBottom: '1.5rem',
            }}
          >
            <code 
              className={cn("block", className)} 
              style={{ 
                backgroundColor: 'transparent',
                color: 'inherit',
                padding: '0',
              }}
            >
              {code}
            </code>
          </pre>
          
          {/* Gradient fade overlay for long code blocks */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

export function MarkdownRenderer({ content, className, themePreset }: MarkdownRendererProps) {
  return (
    <div className={cn("prose prose-sm sm:prose-base lg:prose-lg prose-invert max-w-none dark:prose-invert", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          // Custom code block styling with copy button
          code({ inline, className, children, ...props }: any) {
            if (!inline) {
              return <CodeBlock className={className} themePreset={themePreset}>{children}</CodeBlock>;
            }

            return (
              <code
                className={cn(
                  "px-1.5 py-0.5 rounded-md",
                  "bg-muted/80 border border-border/30",
                  "text-sm font-mono font-medium",
                  "text-primary",
                  "shadow-sm",
                  className
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          // Custom heading styles
          h1: ({ children }: any) => (
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-8 sm:mt-12 mb-4 sm:mb-6 pb-2 border-b border-border scroll-mt-20">
              {children}
            </h1>
          ),
          h2: ({ children }: any) => (
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mt-6 sm:mt-10 mb-3 sm:mb-4 pb-2 border-b border-border scroll-mt-20">
              {children}
            </h2>
          ),
          h3: ({ children }: any) => (
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mt-6 sm:mt-8 mb-2 sm:mb-3 scroll-mt-20">
              {children}
            </h3>
          ),
          h4: ({ children }: any) => (
            <h4 className="text-base sm:text-lg lg:text-xl font-semibold mt-4 sm:mt-6 mb-2 scroll-mt-20">
              {children}
            </h4>
          ),
          // Custom list styles
          ul: ({ children }: any) => (
            <ul className="list-disc space-y-2 my-4 ml-4 sm:ml-6">
              {children}
            </ul>
          ),
          ol: ({ children }: any) => (
            <ol className="list-decimal space-y-2 my-4 ml-4 sm:ml-6">
              {children}
            </ol>
          ),
          // Custom link styles
          a: ({ href, children }: any) => (
            <a
              href={href}
              className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          // Custom blockquote
          blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-primary/50 pl-3 sm:pl-4 my-4 italic text-muted-foreground text-sm sm:text-base">
              {children}
            </blockquote>
          ),
          // Custom table
          table: ({ children }: any) => (
            <div className="overflow-x-auto my-4 sm:my-6 -mx-4 sm:mx-0">
              <table className="min-w-full border-collapse border border-border rounded-lg text-sm sm:text-base">
                {children}
              </table>
            </div>
          ),
          th: ({ children }: any) => (
            <th className="border border-border px-3 sm:px-4 py-2 bg-muted text-left font-semibold text-xs sm:text-sm">
              {children}
            </th>
          ),
          td: ({ children }: any) => (
            <td className="border border-border px-3 sm:px-4 py-2 text-xs sm:text-sm">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}