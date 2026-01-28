"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Clock, Users, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  totalViews: number;
  totalTimeSpent: number;
  popularSections: Array<{ sectionId: string | null; views: number }>;
  topReferrers: Array<{ referrer: string | null; count: number }>;
}

export default function AnalyticsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [projectId]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/${projectId}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Insights</h1>
          <p className="text-muted-foreground mt-1">
            Track how your documentation is being used
          </p>
        </div>
        <Link href={`/editor/${projectId}`}>
          <Button variant="outline">Back to Editor</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{analytics?.totalViews || 0}</div>
            <p className="text-sm text-muted-foreground mt-2">All-time page views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Total Time Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {analytics ? formatTime(analytics.totalTimeSpent) : "0s"}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Cumulative reading time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Popular Sections</CardTitle>
            <CardDescription>Most viewed sections</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.popularSections && analytics.popularSections.length > 0 ? (
              <div className="space-y-3">
                {analytics.popularSections.map((section, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">
                      {section.sectionId || "Overall"}
                    </span>
                    <span className="text-sm font-medium">{section.views} views</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Top Referrers
            </CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.topReferrers && analytics.topReferrers.length > 0 ? (
              <div className="space-y-3">
                {analytics.topReferrers.map((referrer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm truncate flex-1">
                      {referrer.referrer || "Direct"}
                    </span>
                    <span className="text-sm font-medium ml-2">{referrer.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}





