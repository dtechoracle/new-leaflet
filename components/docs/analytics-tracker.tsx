"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface AnalyticsTrackerProps {
  projectId: string;
  sectionId?: string;
}

export function AnalyticsTracker({ projectId, sectionId }: AnalyticsTrackerProps) {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(Date.now());
  const trackedRef = useRef(false);

  useEffect(() => {
    // Track page view
    const trackView = async () => {
      if (trackedRef.current) return;
      trackedRef.current = true;

      const referrer = document.referrer || null;

      try {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            sectionId: sectionId || null,
            referrer,
          }),
        });
      } catch (error) {
        console.error("Failed to track analytics:", error);
      }
    };

    trackView();

    // Track time spent when user leaves
    const handleBeforeUnload = () => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      if (timeSpent > 5) {
        // Only track if user spent more than 5 seconds
        navigator.sendBeacon(
          "/api/analytics/track",
          JSON.stringify({
            projectId,
            sectionId: sectionId || null,
            timeSpent,
          })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      
      // Also track on component unmount
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (timeSpent > 5) {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            sectionId: sectionId || null,
            timeSpent,
          }),
        }).catch(() => {});
      }
    };
  }, [projectId, sectionId, pathname]);

  return null;
}

