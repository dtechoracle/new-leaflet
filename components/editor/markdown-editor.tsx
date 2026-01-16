"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Edit2 } from "lucide-react";
import { MarkdownRenderer } from "@/components/docs/markdown-renderer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Section {
  id?: string;
  title: string;
  content?: string;
}

interface MarkdownEditorProps {
  sections: Section[];
  readme?: string | null;
  onSave?: (sections: Section[], readme: string | null) => Promise<void>;
  onChange?: (sections: Section[], readme: string | null) => void;
  themePreset?: string | null;
}

export function MarkdownEditor({ sections, readme, onSave, onChange, themePreset }: MarkdownEditorProps) {
  const [editingSections, setEditingSections] = useState<Section[]>(sections);
  const [editingReadme, setEditingReadme] = useState<string | null>(readme || null);
  const [activeTab, setActiveTab] = useState<string>("sections");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState<Record<number | string, boolean>>({});

  // Update local state when props change (after save)
  useEffect(() => {
    // Use JSON stringify for deep comparison to detect actual changes
    const currentSectionsStr = JSON.stringify(editingSections);
    const newSectionsStr = JSON.stringify(sections);
    const readmeChanged = editingReadme !== (readme || null);
    
    if (currentSectionsStr !== newSectionsStr || readmeChanged) {
      setEditingSections(sections);
      setEditingReadme(readme || null);
      // Reset preview mode when content changes externally
      setPreviewMode({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, readme]);

  const handleSectionChange = (index: number, field: "title" | "content", value: string) => {
    const updated = [...editingSections];
    updated[index] = { ...updated[index], [field]: value };
    setEditingSections(updated);
    // Notify parent of changes
    onChange?.(updated, editingReadme);
  };

  const handleReadmeChange = (value: string) => {
    setEditingReadme(value);
    // Notify parent of changes
    onChange?.(editingSections, value);
  };

  const togglePreview = (index: number | string) => {
    setPreviewMode((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold">Edit Documentation</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Edit your documentation content using Markdown. Changes will be saved when you click the "Save Changes" button at the top.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sections">Sections ({editingSections.length})</TabsTrigger>
          <TabsTrigger value="readme">README</TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="space-y-4 mt-6">
          {editingSections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Section {index + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePreview(index)}
                  >
                    {previewMode[index] ? (
                      <>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`section-title-${index}`}>Title</Label>
                  <Input
                    id={`section-title-${index}`}
                    value={section.title}
                    onChange={(e) => handleSectionChange(index, "title", e.target.value)}
                    className="mt-1"
                  />
                </div>
                {previewMode[index] ? (
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <MarkdownRenderer
                      content={section.content || ""}
                      themePreset={themePreset}
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor={`section-content-${index}`}>Content (Markdown)</Label>
                    <Textarea
                      id={`section-content-${index}`}
                      value={section.content || ""}
                      onChange={(e) => handleSectionChange(index, "content", e.target.value)}
                      className="mt-1 font-mono text-sm min-h-[300px]"
                      placeholder="# Your markdown content here..."
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Supports Markdown syntax including code blocks, lists, links, and more.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="readme" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>README</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePreview("readme")}
                >
                  {previewMode["readme"] ? (
                    <>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </>
                  )}
                </Button>
              </div>
              <CardDescription>
                Edit the README content for your documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {previewMode["readme"] ? (
                <div className="border border-border rounded-lg p-4 bg-muted/30">
                  <MarkdownRenderer
                    content={editingReadme || ""}
                    themePreset={themePreset}
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="readme-content">README Content (Markdown)</Label>
                  <Textarea
                    id="readme-content"
                    value={editingReadme || ""}
                    onChange={(e) => handleReadmeChange(e.target.value)}
                    className="mt-1 font-mono text-sm min-h-[400px]"
                    placeholder="# Your README content here..."
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports Markdown syntax including code blocks, lists, links, and more.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
