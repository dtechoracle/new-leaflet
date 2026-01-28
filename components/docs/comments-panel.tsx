"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  sectionId: string | null;
  authorName: string;
  content: string;
  createdAt: string;
  replies: Comment[];
}

interface CommentsPanelProps {
  projectId: string;
  sectionId?: string;
}

export function CommentsPanel({ projectId, sectionId }: CommentsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/comments?projectId=${projectId}${sectionId ? `&sectionId=${sectionId}` : ""}`
      );
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, projectId, sectionId]);

  // Auto-refresh comments every 10 seconds when panel is open
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      fetchComments();
    }, 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, projectId, sectionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          sectionId: sectionId || null,
          authorName: authorName || "Anonymous",
          authorEmail: authorEmail || null,
          content: content.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setContent("");
        setAuthorName("");
        setAuthorEmail("");
        // Refresh comments immediately
        await fetchComments();
      } else {
        alert(data.error || "Failed to submit comment. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-40 lg:z-50",
          "h-12 w-12 rounded-full",
          "bg-primary text-primary-foreground",
          "shadow-lg hover:shadow-xl",
          "flex items-center justify-center",
          "transition-all relative",
          "hover:scale-110 active:scale-95",
          isOpen && "rotate-90"
        )}
        aria-label="Toggle comments"
        style={{ position: "fixed" }}
      >
        <MessageCircle className="h-5 w-5" />
        {(() => {
          const totalComments = comments.reduce((acc, comment) => acc + 1 + (comment.replies?.length || 0), 0);
          return totalComments > 0 ? (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-background">
              {totalComments > 99 ? "99+" : totalComments}
            </span>
          ) : null;
        })()}
      </button>

      {/* Comments panel */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "w-[calc(100vw-3rem)] sm:w-96 max-w-[calc(100vw-3rem)] sm:max-w-md max-h-[600px]",
            // Solid, non-transparent surface so docs content doesn't bleed through
            "rounded-lg border border-border shadow-2xl flex flex-col",
            "bg-[#050509]"
          )}
          style={{ position: "fixed" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="font-semibold">Comments & Feedback</h3>
              {(() => {
                const totalComments = comments.reduce((acc, comment) => acc + 1 + (comment.replies?.length || 0), 0);
                return totalComments > 0 ? (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {totalComments} {totalComments === 1 ? "comment" : "comments"}
                  </p>
                ) : null;
              })()}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Comments list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="text-center text-sm text-muted-foreground py-8">
                Loading comments...
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-8">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-sm">{comment.authorName}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  {comment.replies.length > 0 && (
                    <div className="ml-4 space-y-2">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="bg-muted/30 rounded-lg p-2">
                          <div className="flex items-start justify-between mb-1">
                            <div className="font-medium text-xs">{reply.authorName}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(reply.createdAt)}
                            </div>
                          </div>
                          <p className="text-xs">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Comment form */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border space-y-3">
            <div>
              <Label htmlFor="authorName" className="text-xs">
                Name (optional)
              </Label>
              <Input
                id="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your name"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="content" className="text-xs">
                Comment
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add a comment or question..."
                className="min-h-[80px] text-sm"
                required
              />
            </div>
            <Button type="submit" size="sm" className="w-full" disabled={submitting}>
              <Send className="h-3.5 w-3.5 mr-2" />
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
