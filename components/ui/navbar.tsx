"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UserButton, SignedIn, SignedOut, useAuth } from "@clerk/nextjs"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
    const pathname = usePathname()
    const { isSignedIn } = useAuth()
    const [isMobile, setIsMobile] = useState(false)
    
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])
    
    // Hide navbar on docs pages when user is not signed in
    const isDocsPage = pathname?.startsWith('/docs/')
    if (isDocsPage && !isSignedIn) {
        return null
    }
    
    return (
        <header 
            className={cn(
                "sticky top-0 z-50 w-full border-b dark:border-white/10 border-gray-200",
                isMobile ? "mobile-navbar-opaque" : "md:backdrop-blur-xl"
            )}
            style={isMobile ? {
                backgroundColor: 'var(--background)',
                background: 'var(--background)',
                backgroundImage: 'none',
                opacity: 1,
                WebkitBackdropFilter: 'none',
                backdropFilter: 'none',
            } : {
                backgroundColor: 'hsl(var(--background) / 0.8)',
                WebkitBackdropFilter: 'blur(12px)',
                backdropFilter: 'blur(12px)',
            }}
        >
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Leaflet
                    </span>
                </Link>
                <nav className="flex items-center gap-4">
                    <SignedIn>
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-sm">Dashboard</Button>
                        </Link>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "h-9 w-9"
                                }
                            }}
                        />
                    </SignedIn>
                    <SignedOut>
                        <Link href="/sign-in">
                            <Button variant="ghost" className="text-sm">Sign In</Button>
                        </Link>
                        <Link href="/sign-up">
                            <Button variant="premium" size="sm">Get Started</Button>
                        </Link>
                    </SignedOut>
                </nav>
            </div>
        </header>
    )
}
