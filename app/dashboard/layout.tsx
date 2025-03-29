import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Frame } from "lucide-react"

export const metadata: Metadata = {
  title: "NetlifyStats Dashboard",
  description: "Monitor your Netlify site deployments, builds, and statistics",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Frame className="h-6 w-6" />
            <span>Netlify Dashboard</span>
          </Link>
          <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              Overview
            </Link>
            <Link
              href="/dashboard/embed"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Embed
            </Link>
            <Link
              href="/dashboard/settings"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Settings
            </Link>
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="https://app.netlify.com/" target="_blank" rel="noopener noreferrer">
                Open Netlify
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}

