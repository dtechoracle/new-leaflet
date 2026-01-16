"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FontPreviewLoader } from "@/components/editor/font-preview-loader";
import { Code, Palette, Type, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvancedCustomizationProps {
  project: {
    customCSS?: string | null;
    customJS?: string | null;
    themePreset?: string | null;
    fontFamily?: string | null;
    fontSize?: string | null;
  };
  onChange: (field: string, value: string) => void;
}

const THEME_PRESETS = [
  { 
    value: "default", 
    label: "Default (Dark)", 
    colors: { primary: "#6366f1", secondary: "#8b5cf6", bg: "#0a0a0a" },
    description: "Classic dark theme with purple accents"
  },
  { 
    value: "light", 
    label: "Light", 
    colors: { primary: "#6366f1", secondary: "#8b5cf6", bg: "#ffffff" },
    description: "Clean light theme"
  },
  { 
    value: "purple", 
    label: "Purple Glow", 
    colors: { primary: "#a855f7", secondary: "#c084fc", bg: "#1a0a2e" },
    description: "Deep purple with glowing effects"
  },
  { 
    value: "blue", 
    label: "Blue Ocean", 
    colors: { primary: "#3b82f6", secondary: "#60a5fa", bg: "#0f172a" },
    description: "Cool blue tones"
  },
  { 
    value: "green", 
    label: "Forest", 
    colors: { primary: "#10b981", secondary: "#34d399", bg: "#0a1f0a" },
    description: "Natural green theme"
  },
  { 
    value: "minimal", 
    label: "Minimal", 
    colors: { primary: "#6b7280", secondary: "#9ca3af", bg: "#f9fafb" },
    description: "Minimalist gray theme"
  },
];

const FONT_FAMILIES = [
  { value: "Poppins", label: "Poppins", preview: "Aa" },
  { value: "Inter", label: "Inter", preview: "Aa" },
  { value: "Roboto", label: "Roboto", preview: "Aa" },
  { value: "Open Sans", label: "Open Sans", preview: "Aa" },
  { value: "Lato", label: "Lato", preview: "Aa" },
  { value: "Montserrat", label: "Montserrat", preview: "Aa" },
  { value: "Source Code Pro", label: "Source Code Pro", preview: "Aa" },
  { value: "Fira Code", label: "Fira Code", preview: "Aa" },
];

const FONT_SIZES = [
  { value: "14px", label: "Small", size: "14px" },
  { value: "16px", label: "Medium", size: "16px" },
  { value: "18px", label: "Large", size: "18px" },
  { value: "20px", label: "Extra Large", size: "20px" },
];

export function AdvancedCustomization({ project, onChange }: AdvancedCustomizationProps) {
  const [selectedTheme, setSelectedTheme] = useState(project.themePreset || "default");

  return (
    <div className="space-y-8">
      {/* Load font for preview */}
      <FontPreviewLoader fontFamily={project.fontFamily} />
      {/* Theme Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Palette className="h-5 w-5" />
            Theme Presets
          </CardTitle>
          <CardDescription className="text-base">
            Choose a pre-designed theme for your documentation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => {
                  setSelectedTheme(preset.value);
                  onChange("themePreset", preset.value);
                }}
                className={cn(
                  "relative p-4 rounded-xl border-2 transition-all text-left",
                  "hover:scale-[1.02] hover:shadow-lg",
                  selectedTheme === preset.value
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{preset.label}</h4>
                    <p className="text-xs text-muted-foreground">{preset.description}</p>
                  </div>
                  {selectedTheme === preset.value && (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <div
                    className="h-8 w-8 rounded-lg"
                    style={{ backgroundColor: preset.colors.primary }}
                  />
                  <div
                    className="h-8 w-8 rounded-lg"
                    style={{ backgroundColor: preset.colors.secondary }}
                  />
                  <div
                    className="h-8 w-8 rounded-lg border border-border"
                    style={{ backgroundColor: preset.colors.bg }}
                  />
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Font Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Type className="h-5 w-5" />
            Typography
          </CardTitle>
          <CardDescription className="text-base">
            Customize the typography of your documentation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Font Family */}
            <div className="space-y-3">
              <Label htmlFor="fontFamily" className="text-sm font-medium">
                Font Family
              </Label>
              <Select
                value={project.fontFamily || "Poppins"}
                onValueChange={(value) => onChange("fontFamily", value)}
              >
                <SelectTrigger id="fontFamily" className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((font) => {
                    const fontUrl = font.value.replace(/\s+/g, "+");
                    const fontFamily = `"${font.value}", sans-serif`;
                    return (
                      <SelectItem key={font.value} value={font.value}>
                        <div className="flex items-center gap-3">
                          <span 
                            className="text-lg font-medium" 
                            style={{ 
                              fontFamily: fontFamily,
                              fontFeatureSettings: font.value.includes("Code") ? '"liga" 1, "calt" 1' : "normal"
                            }}
                          >
                            {font.preview}
                          </span>
                          <span>{font.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {project.fontFamily && (
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                  <p 
                    className="text-sm leading-relaxed" 
                    style={{ 
                      fontFamily: `"${project.fontFamily}", sans-serif`,
                      fontFeatureSettings: project.fontFamily.includes("Code") ? '"liga" 1, "calt" 1' : "normal"
                    }}
                  >
                    The quick brown fox jumps over the lazy dog. 1234567890
                  </p>
                  <p 
                    className="text-xs mt-2 opacity-70" 
                    style={{ 
                      fontFamily: `"${project.fontFamily}", sans-serif`,
                      fontFeatureSettings: project.fontFamily.includes("Code") ? '"liga" 1, "calt" 1' : "normal"
                    }}
                  >
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  </p>
                </div>
              )}
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <Label htmlFor="fontSize" className="text-sm font-medium">
                Base Font Size
              </Label>
              <Select
                value={project.fontSize || "16px"}
                onValueChange={(value) => onChange("fontSize", value)}
              >
                <SelectTrigger id="fontSize" className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: size.size }}>Aa</span>
                        <span>{size.label} ({size.size})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {project.fontSize && (
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm" style={{ fontSize: project.fontSize }}>
                    Preview: This is how your text will look at {project.fontSize}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom CSS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Code className="h-5 w-5" />
            Custom CSS
          </CardTitle>
          <CardDescription className="text-base">
            Inject custom CSS to further customize your documentation appearance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="customCSS" className="text-sm font-medium">
              CSS Code
            </Label>
            <Textarea
              id="customCSS"
              value={project.customCSS || ""}
              onChange={(e) => onChange("customCSS", e.target.value)}
              placeholder="/* Your custom CSS here */&#10;.my-custom-class {&#10;  color: #fff;&#10;}"
              className="font-mono text-sm min-h-[250px] resize-y"
            />
            <p className="text-xs text-muted-foreground">
              CSS will be injected into the documentation page. Use with caution.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Custom JavaScript */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Code className="h-5 w-5" />
            Custom JavaScript
          </CardTitle>
          <CardDescription className="text-base">
            Inject custom JavaScript for advanced functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="customJS" className="text-sm font-medium">
              JavaScript Code
            </Label>
            <Textarea
              id="customJS"
              value={project.customJS || ""}
              onChange={(e) => onChange("customJS", e.target.value)}
              placeholder="// Your custom JavaScript here&#10;console.log('Hello from custom JS');"
              className="font-mono text-sm min-h-[250px] resize-y"
            />
            <p className="text-xs text-muted-foreground">
              JavaScript will be executed on the documentation page. Use with caution.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}