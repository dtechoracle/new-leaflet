import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Github,
  Sparkles,
  Zap,
  Code2,
  FileText,
  LayoutTemplate,
  ShieldCheck,
  BarChart3,
  Users,
  Clock3,
  Globe2,
  MessageCircle,
  Check,
  Link2,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Subtle purple glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-purple-700/35 blur-[140px]" />
        <div className="absolute bottom-[-260px] right-[-120px] h-[420px] w-[420px] rounded-full bg-purple-500/30 blur-[140px]" />
      </div>

      {/* Hero */}
      <section className="container relative mx-auto flex max-w-7xl flex-col gap-16 px-6 pb-32 pt-32 md:flex-row md:items-center md:gap-20 lg:pt-40 lg:pb-40">
        {/* Left column — copy & CTAs */}
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            AI documentation OS for your repos
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Documentation that{" "}
            <span className="text-gradient-primary">doesn't suck.</span>
            <br />
            (We know, it's a low bar.)
          </h1>

          <p className="text-pretty text-base text-muted-foreground sm:text-lg md:text-xl">
            Finally, docs that stay updated without you having to remember they exist.
            Connect GitHub, let AI do the heavy lifting, and watch your team actually
            use documentation for once. Revolutionary, we know.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="premium"
                className="h-14 px-8 text-base"
              >
                Start free with GitHub
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="https://github.com" target="_blank">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-6 text-base bg-white/5 border-white/10 hover:bg-white/10"
              >
                <Github className="mr-2 h-5 w-5" />
                Star project
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground sm:text-base">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Free until you're hooked (classic move)
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              Works with monorepos (yes, really)
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              For teams tired of outdated READMEs
            </div>
          </div>
        </div>

        {/* Right column — product mock */}
        <div className="relative mx-auto w-full max-w-xl md:mx-0">
          <div className="glass-panel relative rounded-3xl border border-white/10 p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
                  <FileText className="h-3.5 w-3.5" />
                </span>
                New documentation project
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300">
                AI scan running · 87%
              </span>
            </div>

            <div className="grid grid-cols-[1.1fr,0.9fr] gap-4">
              {/* Left side of mock */}
              <div className="space-y-3 rounded-2xl bg-black/40 p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Repository</span>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px]">
                    GitHub · private
                  </span>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      Connected repo
                    </span>
                    <span className="text-[11px] text-emerald-400">
                      Synced · 2 min ago
                    </span>
                  </div>
                  <div className="mt-1 text-sm font-medium">
                    acme-corp/undocumented-api
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>AI tasks</span>
                    <span>3 of 3 complete</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Component map</span>
                      <span className="text-emerald-400">Done</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>API reference</span>
                      <span className="text-emerald-400">Done</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Usage guides</span>
                      <span className="text-emerald-400">Done</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side of mock */}
              <div className="space-y-3 rounded-2xl bg-black/30 p-4">
                <div className="text-xs font-medium text-foreground">
                  Live preview
                </div>
                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-purple-600/25 via-purple-500/15 to-purple-400/10 p-3 text-[11px]">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">
                      Getting started
                    </span>
                    <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-muted-foreground">
                      /docs/overview
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    Leaflet automatically documents your setup, environment
                    variables, deployment pipeline and more — so onboarding new
                    engineers takes hours, not days.
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-dashed border-white/15 bg-black/40 px-3 py-2 text-[11px]">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <LayoutTemplate className="h-3.5 w-3.5 text-purple-300" />
                    Mint new documentation theme
                  </span>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]">
                    Customize
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Floating mini cards */}
          <Card className="absolute -left-6 -bottom-10 hidden w-52 bg-white/5 p-4 shadow-xl backdrop-blur md:block">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Drift protection
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Auto-updates so your docs don't become historical fiction.
            </p>
          </Card>

          <Card className="absolute -right-4 top-3 hidden w-48 bg-white/5 p-4 shadow-xl backdrop-blur md:block">
            <div className="mb-1 flex items-center gap-2 text-xs">
              <Zap className="h-4 w-4 text-yellow-300" />
              <span className="font-medium">~42s to first docs</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Faster than you can write "we'll update the docs next sprint."
            </p>
          </Card>
        </div>
      </section>

      {/* Secondary band – how it works */}
      <section className="border-t border-white/5 bg-black/40">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl text-left">
              Documentation that{" "}
              <span className="text-gradient-primary">updates itself.</span>
            </h2>
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg text-left">
              Because manually updating docs after every code change is so 2023.
              Connect once, let AI handle the rest, and actually focus on building
              things instead of maintaining documentation about building things.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <Card className="bg-white/5 p-6 text-left border border-white/10">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20">
                  <Github className="h-4 w-4 text-indigo-300" />
                </div>
                <h3 className="mb-1 text-base font-semibold md:text-lg">Connect GitHub</h3>
                <p className="text-sm text-muted-foreground md:text-base">
                  One click. Read-only access. No, we won't touch your code.
                  We're not monsters—just documentation enthusiasts with boundaries.
                </p>
              </Card>

              <Card className="bg-white/5 p-6 text-left border border-white/10">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/20">
                  <Code2 className="h-4 w-4 text-purple-300" />
                </div>
                <h3 className="mb-1 text-base font-semibold md:text-lg">AI scans your code</h3>
                <p className="text-sm text-muted-foreground md:text-base">
                  Our AI actually reads your code (unlike some humans we know).
                  Maps components, APIs, and data flows so your docs match reality.
                  Novel concept, we know.
                </p>
              </Card>

              <Card className="bg-white/5 p-6 text-left border border-white/10">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20">
                  <FileText className="h-4 w-4 text-emerald-300" />
                </div>
                <h3 className="mb-1 text-base font-semibold md:text-lg">Customize & publish</h3>
                <p className="text-sm text-muted-foreground md:text-base">
                  Tweak the AI's work (because you know better), pick a theme,
                  and publish. Then we'll keep it updated so you don't have to.
                  You're welcome.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Domain & Public Access */}
      <section className="border-t border-white/5 bg-black/40">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-300">
                Professional hosting
              </p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl lg:text-5xl">
                Custom domains &{" "}
                <span className="text-gradient-primary">no login walls.</span>
              </h2>
            </div>
            <p className="max-w-md text-base text-muted-foreground sm:text-lg">
              Because forcing people to create accounts just to read docs is peak
              gatekeeping. Host on your domain, keep it public, and let people
              actually find your documentation.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white/5 p-6 border border-white/10">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600/20 text-purple-200">
                <Link2 className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-lg font-semibold md:text-xl">Custom domains</h3>
              <p className="mb-5 text-base text-muted-foreground md:text-lg">
                Use your own domain so people don't think you're using a free
                documentation tool (even though you are). Perfect for APIs, product
                docs, and maintaining that professional facade.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground md:text-base">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-purple-300 flex-shrink-0" />
                  <span>Easy DNS configuration with step-by-step guides</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-purple-300 flex-shrink-0" />
                  <span>Automatic SSL certificates included</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-purple-300 flex-shrink-0" />
                  <span>Subdomain support (docs.yourcompany.com)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-purple-300 flex-shrink-0" />
                  <span>Works with any DNS provider</span>
                </li>
              </ul>
            </Card>

            <Card className="bg-white/5 p-6 border border-white/10">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-200">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-lg font-semibold md:text-xl">Publicly accessible</h3>
              <p className="mb-5 text-base text-muted-foreground md:text-lg">
                No login required. No "request access" forms. No waiting for approval
                emails. Just docs that people can actually read. Revolutionary, we know.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground md:text-base">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-purple-300 flex-shrink-0" />
                  <span>Zero authentication friction for readers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-purple-300 flex-shrink-0" />
                  <span>SEO-friendly public URLs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-purple-300 flex-shrink-0" />
                  <span>Shareable links that work instantly</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-purple-300 flex-shrink-0" />
                  <span>Perfect for customer-facing documentation</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Metrics band */}
      <section className="border-t border-white/5 bg-black/60">
        <div className="container mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-4 md:py-20">
          <div className="space-y-3 md:col-span-1">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-300">
              Teams that switch to Leaflet
            </p>
            <p className="max-w-xs text-base text-muted-foreground md:text-lg">
              Real teams using Leaflet to stop the "where's the docs?" Slack
              messages. Because one source of truth beats 47 outdated Confluence pages.
            </p>
          </div>

          <div className="grid gap-4 text-sm md:col-span-3 md:grid-cols-3">
            <div className="rounded-2xl border border-purple-500/20 bg-purple-950/40 p-5">
              <div className="mb-3 flex items-center gap-2 text-purple-200">
                <BarChart3 className="h-4 w-4" />
                <span className="text-xs font-medium">Support</span>
              </div>
              <p className="text-3xl font-semibold">-26%</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Fewer "how does this work?" tickets. Because now there's actually
                documentation to point people to instead of shrugging.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-500/20 bg-purple-950/40 p-5">
              <div className="mb-3 flex items-center gap-2 text-purple-200">
                <Clock3 className="h-4 w-4" />
                <span className="text-xs font-medium">Onboarding</span>
              </div>
              <p className="text-3xl font-semibold">3× faster</p>
              <p className="mt-1 text-xs text-muted-foreground">
                New engineers actually understand the codebase instead of playing
                detective with outdated READMEs and Slack history.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-500/20 bg-purple-950/40 p-5">
              <div className="mb-3 flex items-center gap-2 text-purple-200">
                <Users className="h-4 w-4" />
                <span className="text-xs font-medium">Adoption</span>
              </div>
              <p className="text-3xl font-semibold">94%</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Of teams actually use Leaflet docs instead of asking "where's the
                documentation?" in Slack every Tuesday.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases / sections */}
      <section className="border-t border-white/5 bg-black">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-300">
                Built for modern teams
              </p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl lg:text-5xl">
                One tool,{" "}
                <span className="text-gradient-primary">zero excuses.</span>
              </h2>
            </div>
            <p className="max-w-md text-base text-muted-foreground sm:text-lg">
              Design systems, microservices, APIs—whatever you're building, your
              documentation can finally keep up. No more "we'll update the docs
              next sprint" promises that never happen.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-white/5 p-6 border border-white/10">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600/20">
                <Globe2 className="h-4 w-4 text-purple-200" />
              </div>
              <h3 className="mb-2 text-base font-semibold md:text-lg text-foreground">
                Public product docs
              </h3>
              <p className="mb-4 text-sm text-muted-foreground md:text-base">
                Docs that don't make your customers question your engineering
                capabilities. Auto-generated from your actual code, so they're
                accurate (what a concept).
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground md:text-base">
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-purple-300" />
                  Versioned API reference
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-purple-300" />
                  Changelogs from your PRs
                </li>
              </ul>
            </Card>

            <Card className="bg-white/5 p-6 border border-white/10">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600/20">
                <Users className="h-4 w-4 text-purple-200" />
              </div>
              <h3 className="mb-2 text-base font-semibold md:text-lg text-foreground">
                Internal engineering hub
              </h3>
              <p className="mb-4 text-sm text-muted-foreground md:text-base">
                Stop the "where's the runbook?" panic during incidents. Centralize
                everything with links to actual code, not outdated Confluence pages
                from 2019.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground md:text-base">
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-purple-300" />
                  Service ownership maps
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-purple-300" />
                  Incident postmortem templates
                </li>
              </ul>
            </Card>

            <Card className="bg-white/5 p-6 border border-white/10">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600/20">
                <MessageCircle className="h-4 w-4 text-purple-200" />
              </div>
              <h3 className="mb-2 text-base font-semibold md:text-lg text-foreground">
                Customer‑facing success docs
              </h3>
              <p className="mb-4 text-sm text-muted-foreground md:text-base">
                Help sales, success, and support teams understand your product
                without them having to read your codebase. Docs that match reality,
                not marketing fluff.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground md:text-base">
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-purple-300" />
                  Guided walkthroughs
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-purple-300" />
                  Context pulled from feature flags
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="border-t border-white/5 bg-black/40">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-300">
                Simple, usage‑based pricing
              </p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl lg:text-5xl">
                Free until you're hooked.
              </h2>
              <p className="mt-3 max-w-md text-base text-muted-foreground sm:text-lg">
                Start free, realize your docs are finally useful, then pay us
                when you can't go back to manually updating READMEs. Classic SaaS
                play, we know.
              </p>
            </div>
            <div className="text-sm text-muted-foreground md:text-base">
              No contracts. Cancel when you realize you can't live without us.
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="flex flex-col justify-between bg-black/60 p-6 border border-white/10">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-300">
                  Starter
                </p>
                <p className="text-3xl font-semibold">$0</p>
                <p className="text-xs text-muted-foreground">
                  For solo builders and small projects.
                </p>
              </div>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-purple-300" />
                  1 connected GitHub repo
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-purple-300" />
                  AI‑generated docs & search
                </li>
              </ul>
            </Card>

            <Card className="relative flex flex-col justify-between border-purple-500/60 bg-purple-950/50 p-6 shadow-lg shadow-purple-900/50">
              <span className="absolute right-4 top-4 rounded-full bg-purple-500/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
                Most popular
              </span>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-200">
                  Team
                </p>
                <p className="text-3xl font-semibold">$29</p>
                <p className="text-xs text-purple-100/80">
                  For product teams shipping production software.
                </p>
              </div>
              <ul className="mt-4 space-y-1.5 text-xs text-purple-100/90">
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3" />
                  Up to 10 repos, unlimited docs
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3" />
                  Role‑based access controls
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3" />
                  Custom domains & public access
                </li>
              </ul>
            </Card>

            <Card className="flex flex-col justify-between bg-black/60 p-6 border border-white/10">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-300">
                  Enterprise
                </p>
                <p className="text-3xl font-semibold md:text-4xl">Let&apos;s talk</p>
                <p className="text-sm text-muted-foreground md:text-base">
                  For orgs with strict compliance and scale requirements.
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground md:text-base">
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-purple-300" />
                  Unlimited workspaces and viewers
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-purple-300" />
                  SSO, audit logs, data residency
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-white/5 bg-black">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-300">
                Ready to see it on your code?
              </p>
              <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
                Stop making excuses. Start making docs.
              </h2>
              <p className="max-w-md text-base text-muted-foreground sm:text-lg">
                Connect a repo, let AI do the work you've been putting off for
                months, and finally have documentation that doesn't embarrass you
                in front of new hires.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="premium"
                  className="h-14 w-full px-8 text-base"
                >
                  Get started free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 w-full border-purple-500/40 bg-black/40 text-base hover:bg-purple-950/40"
                >
                  View example docs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/95">
        <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Leaflet</span>
            <span>· Documentation that doesn't make you look bad.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link href="https://github.com" target="_blank" className="hover:text-foreground">
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
