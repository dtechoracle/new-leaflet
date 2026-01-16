"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ExternalLink, Clock, MoreVertical, Edit, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";

interface Project {
    id: string;
    name: string;
    description: string | null;
    status: string;
    publishedUrl: string | null;
    updatedAt: string;
}

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
}

function getStatusColor(status: string): string {
    switch (status) {
        case "PUBLISHED":
            return "bg-green-500/10 text-green-400 border border-green-500/20";
        case "READY":
            return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
        case "SCANNING":
            return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
        default:
            return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
}

function getStatusLabel(status: string): string {
    switch (status) {
        case "PUBLISHED":
            return "Published";
        case "READY":
            return "Ready";
        case "SCANNING":
            return "Scanning";
        default:
            return "Draft";
    }
}

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch("/api/projects");
            if (!response.ok) throw new Error("Failed to fetch projects");
            const data = await response.json();
            setProjects(data.projects || []);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (projectId: string) => {
        if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete project");
            
            // Remove from local state
            setProjects(projects.filter(p => p.id !== projectId));
        } catch (error) {
            console.error("Error deleting project:", error);
            alert("Failed to delete project");
        }
    };

    if (loading) {
        return (
            <div className="container px-4 md:px-6 py-10">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="container px-4 md:px-6 py-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage your documentation projects.</p>
                </div>
                <Link href="/create">
                    <Button variant="premium">
                        <Plus className="mr-2 h-4 w-4" /> New Project
                    </Button>
                </Link>
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                    <p className="text-muted-foreground mb-6">Create your first documentation project to get started.</p>
                    <Link href="/create">
                        <Button variant="premium">
                            <Plus className="mr-2 h-4 w-4" /> Create New Project
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Card key={project.id} className="group hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-xl">{project.name}</CardTitle>
                                    <div className="flex gap-1">
                                        {project.status === "READY" || project.status === "PUBLISHED" ? (
                                            <Link href={`/editor/${project.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        ) : null}
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDelete(project.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardDescription className="line-clamp-2 mt-2">
                                    {project.description || "No description"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="mr-2 h-3 w-3" />
                                    Updated {formatTimeAgo(project.updatedAt)}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t border-white/5 pt-4">
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                                    {getStatusLabel(project.status)}
                                </span>
                                <div className="flex gap-2">
                                    {project.status === "PUBLISHED" && project.publishedUrl && (
                                        <Link href={project.publishedUrl} target="_blank" className="text-sm text-primary hover:underline flex items-center">
                                            View Site <ExternalLink className="ml-1 h-3 w-3" />
                                        </Link>
                                    )}
                                    {(project.status === "READY" || project.status === "PUBLISHED") && (
                                        <Link href={`/editor/${project.id}`} className="text-sm text-primary hover:underline flex items-center">
                                            Edit
                                        </Link>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}

                    <Link href="/create" className="block h-full">
                        <Card className="h-full border-dashed border-white/20 bg-transparent hover:bg-white/5 transition-colors flex flex-col items-center justify-center p-6 cursor-pointer min-h-[250px]">
                            <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <h3 className="text-lg font-medium">Create New Project</h3>
                            <p className="text-sm text-muted-foreground mt-1">Scan a repository to start</p>
                        </Card>
                    </Link>
                </div>
            )}
        </div>
    );
}
