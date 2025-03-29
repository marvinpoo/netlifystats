"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ExternalLink, Globe, RefreshCw } from "lucide-react"
import { fetchNetlifySiteInfo } from "@/lib/netlify-api"
import type { SiteInfo } from "@/lib/types"
import { hasNetlifyCredentials } from "@/lib/env-utils"

interface SiteInfoViewProps {
  isEmbedded?: boolean
  refreshInterval?: number // in seconds, 0 means no auto-refresh
}

export default function SiteInfoView({ isEmbedded = false, refreshInterval = 0 }: SiteInfoViewProps) {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const loadSiteInfo = async () => {
    if (!hasNetlifyCredentials()) {
      setError("Netlify API token or site ID not configured. Please check your settings.")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await fetchNetlifySiteInfo()
      setSiteInfo(data)
      setLastRefreshed(new Date())
    } catch (err) {
      console.error("Site info fetch error:", err)
      setError("Failed to load site information. Please check your API token and site ID.")
      setSiteInfo(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial load
    loadSiteInfo()

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Set up auto-refresh if interval > 0
    if (refreshInterval && refreshInterval > 0) {
      intervalRef.current = setInterval(loadSiteInfo, refreshInterval * 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [refreshInterval])

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <Button variant="outline" size="sm" className="mt-2" onClick={loadSiteInfo}>
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className={isEmbedded ? "border-0 shadow-none" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Site Information</CardTitle>
          <CardDescription>
            Details about your Netlify site
            {refreshInterval > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                (Auto-refreshes every {refreshInterval} seconds)
              </span>
            )}
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={loadSiteInfo} disabled={loading} className="gap-1">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-[250px]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        ) : !siteInfo ? (
          <div className="text-center py-6 text-muted-foreground">
            No site information found. Make sure your API token and site ID are correct.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">{siteInfo.name}</h3>
              <Badge variant="outline">{siteInfo.ssl ? "HTTPS" : "HTTP"}</Badge>
              <Button variant="outline" size="sm" className="ml-auto gap-1" asChild>
                <a href={siteInfo.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Visit Site
                </a>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">Custom Domain</div>
                <div className="font-medium">{siteInfo.custom_domain || siteInfo.url}</div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">Repository</div>
                <div className="font-medium">{siteInfo.build_settings?.repo_url || "Not connected"}</div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">Default Branch</div>
                <div className="font-medium">{siteInfo.build_settings?.repo_branch || "main"}</div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">Created</div>
                <div className="font-medium">
                  {siteInfo.created_at ? new Date(siteInfo.created_at).toLocaleDateString() : "Unknown"}
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">Build Command</div>
              <code className="bg-background p-2 rounded block text-sm overflow-x-auto">
                {siteInfo.build_settings?.cmd || "Not specified"}
              </code>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Status Badge</span>
              </div>
              <div>
                <code className="bg-background p-2 rounded text-xs block overflow-x-auto">
                  {`[![Netlify Status](https://api.netlify.com/api/v1/badges/${siteInfo.site_id}/deploy-status)](https://app.netlify.com/sites/${siteInfo.name}/deploys)`}
                </code>
              </div>
            </div>

            {/* Last refreshed indicator */}
            <div className="text-xs text-muted-foreground text-right">
              Last refreshed: {lastRefreshed.toLocaleTimeString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

