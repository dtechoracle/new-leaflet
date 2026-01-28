"use client";

import { useEffect } from "react";

interface FontLoaderProps {
  fontFamily?: string | null;
}

const GOOGLE_FONTS: Record<string, string> = {
  "Poppins": "Poppins:300,400,500,600,700",
  "Inter": "Inter:300,400,500,600,700",
  "Roboto": "Roboto:300,400,500,700",
  "Open Sans": "Open+Sans:300,400,500,600,700",
  "Lato": "Lato:300,400,700",
  "Montserrat": "Montserrat:300,400,500,600,700",
  "Source Code Pro": "Source+Code+Pro:300,400,500,600,700",
  "Fira Code": "Fira+Code:300,400,500,600,700",
};

export function FontLoader({ fontFamily }: FontLoaderProps) {
  useEffect(() => {
    if (!fontFamily || !GOOGLE_FONTS[fontFamily]) return;

    // Check if font is already loaded
    const fontId = `font-${fontFamily.replace(/\s+/g, "-").toLowerCase()}`;
    if (document.getElementById(fontId)) return;

    // Create link element for Google Fonts
    const link = document.createElement("link");
    link.id = fontId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${GOOGLE_FONTS[fontFamily]}&display=swap`;
    document.head.appendChild(link);

    // Cleanup
    return () => {
      const existingLink = document.getElementById(fontId);
      if (existingLink) {
        existingLink.remove();
      }
    };
  }, [fontFamily]);

  return null;
}





