"use client";

import { useEffect } from "react";

interface CustomizationInjectorProps {
  customCSS?: string | null;
  customJS?: string | null;
  fontFamily?: string | null;
  fontSize?: string | null;
  themePreset?: string | null;
}

// Theme CSS definitions - SCOPED to docs container only
const THEME_STYLES: Record<string, string> = {
  light: `
    [data-docs-container][data-theme="light"] {
      --background: 0 0% 100%;
      --foreground: 240 10% 3.9%;
      --card: 0 0% 100%;
      --card-foreground: 240 10% 3.9%;
      --primary: 263.4 70% 50.4%;
      --primary-foreground: 210 40% 98%;
      --secondary: 240 4.8% 95.9%;
      --secondary-foreground: 240 5.9% 10%;
      --muted: 240 4.8% 95.9%;
      --muted-foreground: 240 3.8% 46.1%;
      --accent: 240 4.8% 95.9%;
      --accent-foreground: 240 5.9% 10%;
      --border: 240 5.9% 90%;
      --input: 240 5.9% 90%;
      --ring: 263.4 70% 50.4%;
    }
    [data-docs-container][data-theme="light"] {
      background-color: hsl(0 0% 100%);
      color: hsl(240 10% 3.9%);
    }
  `,
  purple: `
    [data-docs-container][data-theme="purple"] {
      --background: 270 20% 10%;
      --foreground: 0 0% 98%;
      --card: 270 20% 12%;
      --card-foreground: 0 0% 98%;
      --primary: 270 80% 60%;
      --primary-foreground: 0 0% 98%;
      --secondary: 270 60% 50%;
      --secondary-foreground: 0 0% 98%;
      --muted: 270 15% 20%;
      --muted-foreground: 270 10% 70%;
      --accent: 270 30% 25%;
      --accent-foreground: 0 0% 98%;
      --border: 270 30% 30%;
      --input: 270 30% 30%;
      --ring: 270 80% 60%;
    }
    [data-docs-container][data-theme="purple"],
    [data-docs-container][data-theme="purple"] .bg-background {
      background: linear-gradient(135deg, hsl(270 20% 10%) 0%, hsl(270 25% 8%) 100%);
      color: hsl(0 0% 98%);
    }
  `,
  blue: `
    [data-docs-container][data-theme="blue"] {
      --background: 217 33% 17%;
      --foreground: 0 0% 98%;
      --card: 217 33% 20%;
      --card-foreground: 0 0% 98%;
      --primary: 217 91% 60%;
      --primary-foreground: 0 0% 98%;
      --secondary: 217 70% 50%;
      --secondary-foreground: 0 0% 98%;
      --muted: 217 30% 25%;
      --muted-foreground: 217 20% 70%;
      --accent: 217 40% 30%;
      --accent-foreground: 0 0% 98%;
      --border: 217 40% 35%;
      --input: 217 40% 35%;
      --ring: 217 91% 60%;
    }
    [data-docs-container][data-theme="blue"],
    [data-docs-container][data-theme="blue"] .bg-background {
      background: linear-gradient(135deg, hsl(217 33% 17%) 0%, hsl(217 40% 12%) 100%);
      color: hsl(0 0% 98%);
    }
  `,
  green: `
    [data-docs-container][data-theme="green"] {
      --background: 142 30% 12%;
      --foreground: 0 0% 98%;
      --card: 142 30% 15%;
      --card-foreground: 0 0% 98%;
      --primary: 142 76% 36%;
      --primary-foreground: 0 0% 98%;
      --secondary: 142 60% 40%;
      --secondary-foreground: 0 0% 98%;
      --muted: 142 25% 20%;
      --muted-foreground: 142 15% 70%;
      --accent: 142 35% 25%;
      --accent-foreground: 0 0% 98%;
      --border: 142 35% 30%;
      --input: 142 35% 30%;
      --ring: 142 76% 36%;
    }
    [data-docs-container][data-theme="green"],
    [data-docs-container][data-theme="green"] .bg-background {
      background: linear-gradient(135deg, hsl(142 30% 12%) 0%, hsl(142 35% 8%) 100%);
      color: hsl(0 0% 98%);
    }
  `,
  minimal: `
    [data-docs-container][data-theme="minimal"] {
      --background: 0 0% 98%;
      --foreground: 220 13% 18%;
      --card: 0 0% 100%;
      --card-foreground: 220 13% 18%;
      --primary: 220 9% 46%;
      --primary-foreground: 0 0% 98%;
      --secondary: 220 9% 46%;
      --secondary-foreground: 0 0% 98%;
      --muted: 220 9% 96%;
      --muted-foreground: 220 9% 46%;
      --accent: 220 9% 96%;
      --accent-foreground: 220 13% 18%;
      --border: 220 13% 91%;
      --input: 220 13% 91%;
      --ring: 220 9% 46%;
    }
    [data-docs-container][data-theme="minimal"] {
      background-color: hsl(0 0% 98%);
      color: hsl(220 13% 18%);
    }
  `,
};

export function CustomizationInjector({
  customCSS,
  customJS,
  fontFamily,
  fontSize,
  themePreset,
}: CustomizationInjectorProps) {
  useEffect(() => {
    // Apply font family - SCOPED to docs container only
    const docsContainer = document.querySelector('[data-docs-container]');
    if (fontFamily && docsContainer) {
      // Apply font only to docs container
      const fontFamilyWithFallback = `"${fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
      
      const styleId = "leaflett-font-family";
      let styleElement = document.getElementById(styleId);
      
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      
      styleElement.textContent = `
        [data-docs-container], [data-docs-container] * {
          font-family: ${fontFamilyWithFallback} !important;
        }
      `;
    } else {
      // Remove font style if no font is selected
      const styleElement = document.getElementById("leaflett-font-family");
      if (styleElement) {
        styleElement.remove();
      }
    }

    // Apply font size - SCOPED to docs container only
    const docsContainerForSize = document.querySelector('[data-docs-container]');
    if (fontSize && docsContainerForSize) {
      const sizeStyleId = "leaflett-font-size";
      let sizeStyleElement = document.getElementById(sizeStyleId);
      
      if (!sizeStyleElement) {
        sizeStyleElement = document.createElement("style");
        sizeStyleElement.id = sizeStyleId;
        document.head.appendChild(sizeStyleElement);
      }
      
      sizeStyleElement.textContent = `
        [data-docs-container], [data-docs-container] * {
          font-size: ${fontSize} !important;
        }
      `;
    } else {
      const sizeStyleElement = document.getElementById("leaflett-font-size");
      if (sizeStyleElement) {
        sizeStyleElement.remove();
      }
    }

    // Apply theme preset - SCOPED to docs container only
    const docsContainerForTheme = document.querySelector('[data-docs-container]');
    if (docsContainerForTheme) {
      if (themePreset) {
        if (themePreset === "default") {
          docsContainerForTheme.removeAttribute("data-theme");
        } else {
          docsContainerForTheme.setAttribute("data-theme", themePreset);
        }
      }
    }

    // Inject theme CSS - SCOPED to docs container only
    const themeStyleId = "leaflett-theme-styles";
    let themeStyleElement = document.getElementById(themeStyleId);
    
    if (!themeStyleElement) {
      themeStyleElement = document.createElement("style");
      themeStyleElement.id = themeStyleId;
      document.head.appendChild(themeStyleElement);
    }
    
    if (themePreset && themePreset !== "default" && THEME_STYLES[themePreset]) {
      themeStyleElement.textContent = THEME_STYLES[themePreset];
    } else {
      themeStyleElement.textContent = "";
    }

    // Inject custom CSS - SCOPED to docs container
    if (customCSS) {
      const styleId = "leaflett-custom-css";
      let styleElement = document.getElementById(styleId);
      
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      
      // Scope custom CSS to docs container
      const scopedCSS = customCSS
        .split('\n')
        .map(line => {
          // Don't scope @ rules, keyframes, etc.
          if (line.trim().startsWith('@') || line.trim().startsWith('/*') || line.trim() === '' || line.trim().endsWith('*/')) {
            return line;
          }
          // Scope regular CSS rules
          if (line.includes('{') && !line.trim().startsWith('@')) {
            return line.replace(/^([^{]+)\{/g, '[data-docs-container] $1{');
          }
          return line;
        })
        .join('\n');
      
      styleElement.textContent = scopedCSS;
    }

    // Inject custom JavaScript
    if (customJS) {
      const scriptId = "leaflett-custom-js";
      let scriptElement = document.getElementById(scriptId);
      
      if (!scriptElement) {
        scriptElement = document.createElement("script");
        scriptElement.id = scriptId;
        document.body.appendChild(scriptElement);
      }
      
      // Execute the script
      try {
        new Function(customJS)();
      } catch (error) {
        console.error("Error executing custom JavaScript:", error);
      }
    }

    // Cleanup function
    return () => {
      if (fontFamily) {
        const styleElement = document.getElementById("leaflett-font-family");
        if (styleElement) {
          styleElement.remove();
        }
      }
      if (fontSize) {
        const sizeStyleElement = document.getElementById("leaflett-font-size");
        if (sizeStyleElement) {
          sizeStyleElement.remove();
        }
      }
      // Remove theme from docs container only
      const docsContainer = document.querySelector('[data-docs-container]');
      if (docsContainer && themePreset) {
        docsContainer.removeAttribute("data-theme");
      }
    };
  }, [customCSS, customJS, fontFamily, fontSize, themePreset]);

  return null;
}