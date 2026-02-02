import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/ui/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Leaflet - AI Documentation Generator",
  description: "Generate beautiful documentation from your code in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="dark">
        <body className={cn(poppins.className, "min-h-screen bg-background antialiased")}>
          <ThemeProvider
            attribute="class"
            forcedTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Navbar />
            <main className="relative flex min-h-screen flex-col">
              {children}
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
