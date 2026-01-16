"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Eye, Upload, Sparkles, BarChart3, History, FileText } from "lucide-react";

interface Section {
  id?: string;
  title: string;
  content?: string;
}
import { VersionHistory } from "@/components/docs/version-history";
import { AdvancedCustomization } from "@/components/editor/advanced-customization";
import { MarkdownEditor } from "@/components/editor/markdown-editor";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  customText: any;
  documentation: any;
  status: string;
  publishedUrl: string | null;
  customCSS?: string | null;
  customJS?: string | null;
  themePreset?: string | null;
  fontFamily?: string | null;
  fontSize?: string | null;
  updatedAt?: string;
}

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [markdownData, setMarkdownData] = useState<{ sections: Section[]; readme: string | null } | null>(null);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      // Add cache-busting to ensure fresh data
      const response = await fetch(`/api/projects/${projectId}?t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (!response.ok) throw new Error("Failed to fetch project");
      const data = await response.json();
      setProject(data.project);
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!project) return;
    
    setSaving(true);
    try {
      // Include markdown documentation if it was edited
      let documentationToSave = project.documentation;
      if (markdownData) {
        const updatedDocumentation = {
          sections: markdownData.sections,
          readme: markdownData.readme,
        };
        documentationToSave = JSON.stringify(updatedDocumentation);
      }
      
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: project.name,
          description: project.description,
          logoUrl: project.logoUrl,
          primaryColor: project.primaryColor,
          secondaryColor: project.secondaryColor,
          customText: project.customText,
          customCSS: project.customCSS,
          customJS: project.customJS,
          themePreset: project.themePreset,
          fontFamily: project.fontFamily,
          fontSize: project.fontSize,
          ...(markdownData && { documentation: documentationToSave }),
        }),
      });

      if (!response.ok) throw new Error("Failed to save");
      
      const data = await response.json();
      setProject(data.project);
      
      // Clear markdown data after successful save
      setMarkdownData(null);
      
      // Create a version snapshot
      try {
        await fetch(`/api/projects/${projectId}/versions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            changelog: markdownData ? "Documentation content and settings updated" : "Documentation updated",
          }),
        });
      } catch (err) {
        // Version creation is optional, don't fail the save
        console.warn("Failed to create version:", err);
      }
      
      // Refresh to get updated data
      await fetchProject();
      
      alert("Project saved successfully!");
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!project) return;
    
    setPublishing(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/publish`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to publish");
      
      const data = await response.json();
      setProject({ ...project, ...data.project });
      alert("Project published successfully!");
      router.push(`/docs/${projectId}`);
    } catch (error) {
      console.error("Error publishing project:", error);
      alert("Failed to publish project");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Project not found</p>
            <Link href="/dashboard">
              <Button className="mt-4">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Customize Documentation</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Customize the look and feel of your documentation site
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {project.publishedUrl && (
            <Link href={project.publishedUrl} target="_blank">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                <Eye className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
            </Link>
          )}
          <Link href={`/editor/${projectId}/analytics`}>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <BarChart3 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
          </Link>
          <VersionHistory projectId={projectId} onRollback={fetchProject} />
          <Button onClick={handleSave} disabled={saving} size="sm" className="text-xs sm:text-sm">
            <Save className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{saving ? "Saving..." : "Save Changes"}</span>
            <span className="sm:hidden">{saving ? "Saving..." : "Save"}</span>
          </Button>
          <Button onClick={handlePublish} disabled={publishing} variant="premium" size="sm" className="text-xs sm:text-sm">
            {publishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Settings</CardTitle>
            <CardDescription>Configure basic project information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={project.name}
                onChange={(e) => setProject({ ...project, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={project.description || ""}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                type="url"
                value={project.logoUrl || ""}
                onChange={(e) => setProject({ ...project, logoUrl: e.target.value })}
                className="mt-1"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </CardContent>
        </Card>

        {/* Color Customization */}
        <Card>
          <CardHeader>
            <CardTitle>Color Theme</CardTitle>
            <CardDescription>Customize your documentation colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="primaryColor"
                  type="color"
                  value={project.primaryColor || "#6366f1"}
                  onChange={(e) => setProject({ ...project, primaryColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={project.primaryColor || "#6366f1"}
                  onChange={(e) => setProject({ ...project, primaryColor: e.target.value })}
                  placeholder="#6366f1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={project.secondaryColor || "#8b5cf6"}
                  onChange={(e) => setProject({ ...project, secondaryColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={project.secondaryColor || "#8b5cf6"}
                  onChange={(e) => setProject({ ...project, secondaryColor: e.target.value })}
                  placeholder="#8b5cf6"
                />
              </div>
            </div>
            <div className="p-4 rounded-lg border border-white/10" style={{
              background: `linear-gradient(135deg, ${project.primaryColor || "#6366f1"}15 0%, ${project.secondaryColor || "#8b5cf6"}15 100%)`
            }}>
              <p className="text-sm text-muted-foreground">Preview</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Customization */}
      <div className="mt-6">
        <AdvancedCustomization
          project={project}
          onChange={(field, value) => setProject({ ...project, [field]: value })}
        />
      </div>

      {/* Markdown Editor */}
      {project.documentation && (() => {
        let parsedDoc: any = null;
        try {
          parsedDoc = typeof project.documentation === 'string' 
            ? JSON.parse(project.documentation) 
            : project.documentation;
        } catch {
          parsedDoc = null;
        }
        
        const sections = parsedDoc?.sections || [];
        const readme = parsedDoc?.readme || null;
        
        return (
          <div className="mt-8" key={`markdown-editor-${project.updatedAt || Date.now()}`}>
            <MarkdownEditor
              key={`editor-${project.id}-${project.updatedAt || Date.now()}`}
              sections={sections}
              readme={readme}
              themePreset={project.themePreset}
              onChange={(sections, readme) => {
                // Store markdown changes to be saved with the main save button
                setMarkdownData({ sections, readme });
              }}
            />
          </div>
        );
      })()}
    </div>
  );
}
