"use client";

import { useState, useEffect } from "react";
import { History, RotateCcw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Version {
  id: string;
  versionNumber: number;
  changelog: string | null;
  createdAt: string;
}

interface VersionHistoryProps {
  projectId: string;
  onRollback?: () => void;
}

export function VersionHistory({ projectId, onRollback }: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [rollingBack, setRollingBack] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchVersions();
    }
  }, [isOpen, projectId]);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/versions`);
      const data = await response.json();
      setVersions(data.versions || []);
    } catch (error) {
      console.error("Error fetching versions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (versionNumber: number) => {
    if (!confirm(`Are you sure you want to rollback to version ${versionNumber}?`)) {
      return;
    }

    setRollingBack(versionNumber.toString());
    try {
      const response = await fetch(`/api/projects/${projectId}/rollback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionNumber }),
      });

      if (response.ok) {
        alert("Successfully rolled back!");
        onRollback?.();
        setIsOpen(false);
      } else {
        alert("Failed to rollback");
      }
    } catch (error) {
      console.error("Error rolling back:", error);
      alert("Failed to rollback");
    } finally {
      setRollingBack(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs sm:text-sm">
          <History className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
          <span className="hidden sm:inline">Version History</span>
          <span className="sm:hidden">History</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>
            View and restore previous versions of your documentation
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading versions...</div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No versions found</div>
          ) : (
            versions.map((version) => (
              <Card key={version.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Version {version.versionNumber}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {formatDate(version.createdAt)}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRollback(version.versionNumber)}
                      disabled={rollingBack === version.versionNumber.toString()}
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-2" />
                      {rollingBack === version.versionNumber.toString() ? "Rolling back..." : "Rollback"}
                    </Button>
                  </div>
                </CardHeader>
                {version.changelog && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{version.changelog}</p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
