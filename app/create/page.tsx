"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Github, Loader2, CheckCircle2, ArrowRight, ArrowLeft, LayoutTemplate } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    owner: {
        login: string;
    };
}

const steps = [
    { id: 1, title: "Connect GitHub" },
    { id: 2, title: "Select Repository" },
    { id: 3, title: "AI Scanning" },
    { id: 4, title: "Customize" },
];

function CreateProjectContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [projectId, setProjectId] = useState<string | null>(null);
    const [githubConnected, setGithubConnected] = useState(false);
    const [githubUsername, setGithubUsername] = useState<string | null>(null);

    // Check URL params for step and errors
    useEffect(() => {
        const step = searchParams.get("step");
        const error = searchParams.get("error");
        
        if (step) {
            setCurrentStep(parseInt(step));
        }
        
        if (error) {
            console.error("Error:", error);
            // Could show error toast here
        }
    }, [searchParams]);

    // Check GitHub connection status on mount
    useEffect(() => {
        checkGitHubConnection();
    }, []);

    // Fetch repos when on step 2
    useEffect(() => {
        if (currentStep === 2 && githubConnected) {
            fetchRepositories();
        }
    }, [currentStep, githubConnected]);

    const checkGitHubConnection = async () => {
        try {
            const response = await fetch("/api/github/connect");
            if (!response.ok) throw new Error("Failed to check connection");
            
            const data = await response.json();
            if (data.connected) {
                setGithubConnected(true);
                setGithubUsername(data.username);
                setCurrentStep(2);
            }
        } catch (error) {
            console.error("Error checking GitHub connection:", error);
        }
    };

    const handleConnect = async () => {
        try {
            const response = await fetch("/api/github/connect");
            if (!response.ok) throw new Error("Failed to initiate connection");
            
            const data = await response.json();
            if (data.authUrl) {
                window.location.href = data.authUrl;
            }
        } catch (error) {
            console.error("Error connecting GitHub:", error);
        }
    };

    const fetchRepositories = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/github/repos");
            if (!response.ok) throw new Error("Failed to fetch repositories");
            
            const data = await response.json();
            setRepos(data.repos || []);
        } catch (error) {
            console.error("Error fetching repositories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartScanning = async () => {
        if (!selectedRepo) return;
        
        setIsScanning(true);
        setCurrentStep(3);
        setScanProgress(0);

        // Simulate progress updates
        const progressInterval = setInterval(() => {
            setScanProgress((prev) => {
                if (prev >= 90) {
                    return prev;
                }
                return prev + 5;
            });
        }, 500);

        try {
            const response = await fetch("/api/projects/scan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    repositoryOwner: selectedRepo.owner.login,
                    repositoryName: selectedRepo.name,
                }),
            });

            if (!response.ok) throw new Error("Failed to scan repository");

            const data = await response.json();
            setProjectId(data.projectId);
            setScanProgress(100);
            
            setTimeout(() => {
                clearInterval(progressInterval);
                setCurrentStep(4);
                setIsScanning(false);
            }, 1000);
        } catch (error) {
            console.error("Error scanning repository:", error);
            setIsScanning(false);
            clearInterval(progressInterval);
            alert("Failed to scan repository. Please try again.");
        }
    };

    return (
        <div className="container max-w-4xl px-4 py-10 mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-12 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 -z-10" />
                {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2">
                        <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${currentStep >= step.id
                                    ? "bg-primary text-white shadow-lg shadow-primary/50"
                                    : "bg-white/10 text-muted-foreground"
                                }`}
                        >
                            {currentStep > step.id ? <CheckCircle2 className="h-5 w-5" /> : step.id}
                        </div>
                        <span className={`text-xs font-medium ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>

            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center justify-center text-center space-y-6 py-12"
                        >
                            <div className="h-20 w-20 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                                <Github className="h-10 w-10" />
                            </div>
                            <h2 className="text-2xl font-bold">Connect your GitHub</h2>
                            <p className="text-muted-foreground max-w-md">
                                We need access to your repositories to scan your code and generate documentation.
                            </p>
                            <Button size="lg" onClick={handleConnect} className="mt-4" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
                                    </>
                                ) : (
                                    <>
                                        Connect GitHub Account <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Select a Repository</h2>
                                {githubUsername && (
                                    <span className="text-sm text-muted-foreground">
                                        Connected as <span className="font-medium">{githubUsername}</span>
                                    </span>
                                )}
                            </div>
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : repos.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground mb-4">No repositories found.</p>
                                    <Button variant="outline" onClick={fetchRepositories}>
                                        Refresh
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid gap-4 max-h-[500px] overflow-y-auto">
                                        {repos.map((repo) => (
                                            <div
                                                key={repo.id}
                                                onClick={() => setSelectedRepo(repo)}
                                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedRepo?.id === repo.id
                                                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                                                        : "border-white/10 bg-white/5 hover:bg-white/10"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Github className="h-5 w-5 text-muted-foreground" />
                                                        <div>
                                                            <span className="font-medium">{repo.full_name}</span>
                                                            {repo.description && (
                                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                                                    {repo.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        {repo.language && (
                                                            <span className="flex items-center gap-1">
                                                                <div className="h-2 w-2 rounded-full bg-blue-400" />
                                                                {repo.language}
                                                            </span>
                                                        )}
                                                        <span>⭐ {repo.stargazers_count}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-8">
                                        <Button
                                            variant="outline"
                                            onClick={() => setCurrentStep(1)}
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                        </Button>
                                        <Button
                                            disabled={!selectedRepo}
                                            onClick={handleStartScanning}
                                            variant="premium"
                                        >
                                            Start Scanning <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center justify-center py-12"
                        >
                            <div className="relative h-32 w-32 mb-8 flex items-center justify-center">
                                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        className="text-white/10 stroke-current"
                                        strokeWidth="8"
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="transparent"
                                    />
                                    <circle
                                        className="text-primary stroke-current transition-all duration-200 ease-linear"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="transparent"
                                        strokeDasharray="251.2"
                                        strokeDashoffset={251.2 - (251.2 * scanProgress) / 100}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold">{scanProgress}%</span>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold animate-pulse">AI is analyzing your code...</h2>
                            <p className="text-muted-foreground mt-2">Generating component maps, API references, and usage examples.</p>

                            <div className="mt-8 w-full max-w-md space-y-2">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    {scanProgress > 20 && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                    <span className={scanProgress > 20 ? "text-foreground" : ""}>Reading file structure...</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    {scanProgress > 50 && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                    <span className={scanProgress > 50 ? "text-foreground" : ""}>Analyzing component props...</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    {scanProgress > 80 && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                    <span className={scanProgress > 80 ? "text-foreground" : ""}>Writing documentation...</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center"
                        >
                            <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="h-10 w-10 text-green-500" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Documentation Ready!</h2>
                            <p className="text-muted-foreground max-w-md mx-auto mb-8">
                                Your documentation site has been generated successfully. You can now customize the look and feel or publish it immediately.
                            </p>

                            <div className="flex justify-center gap-4">
                                <Link href="/dashboard">
                                    <Button variant="outline">Back to Dashboard</Button>
                                </Link>
                                {projectId && (
                                    <Link href={`/editor/${projectId}`}>
                                        <Button variant="premium" className="px-8">
                                            Open Editor <LayoutTemplate className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function CreateProject() {
    return (
        <Suspense fallback={
            <div className="container max-w-4xl px-4 py-10 mx-auto">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        }>
            <CreateProjectContent />
        </Suspense>
    );
}
