"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Clock, ExternalLink, RefreshCw, XCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fetchNetlifyDeployments } from "@/lib/netlify-api"
import type { DeploymentData } from "@/lib/types"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { hasNetlifyCredentials } from "@/lib/env-utils"

interface DeploymentViewProps {
  isEmbedded?: boolean
  refreshInterval?: number // in seconds, 0 means no auto-refresh
  limit?: number // maximum number of deployments to show
}

export default function DeploymentView({ isEmbedded = false, refreshInterval = 0, limit }: DeploymentViewProps) {
  const [deployments, setDeployments] = useState<DeploymentData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const loadDeployments = async () => {
    if (!hasNetlifyCredentials()) {
      setError("Netlify API token or site ID not configured. Please check your settings.")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await fetchNetlifyDeployments()

      // Apply limit if specified
      const limitedData = limit && limit > 0 ? data.slice(0, limit) : data

      setDeployments(limitedData)
      setLastRefreshed(new Date())
    } catch (err) {
      console.error("Deployment fetch error:", err)
      setError("Failed to load deployment data. Please check your API token and site ID.")
      setDeployments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial load
    loadDeployments()

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Set up auto-refresh if interval > 0
    if (refreshInterval && refreshInterval > 0) {
      intervalRef.current = setInterval(loadDeployments, refreshInterval * 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [refreshInterval, limit])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-500">Ready</Badge>
      case "building":
        return <Badge className="bg-blue-500">Building</Badge>
      case "enqueued":
        return <Badge className="bg-yellow-500">Enqueued</Badge>
      case "error":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "building":
      case "enqueued":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <Button variant="outline" size="sm" className="mt-2" onClick={loadDeployments}>
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
          <CardTitle>Deployments</CardTitle>
          <CardDescription>
            Recent deployments and their status
            {refreshInterval > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                (Auto-refreshes every {refreshInterval} seconds)
              </span>
            )}
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={loadDeployments} disabled={loading} className="gap-1">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
                <Skeleton className="h-4 w-full" />
                {i < 2 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
        ) : deployments.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No deployments found. Make sure your API token and site ID are correct.
          </div>
        ) : (
          <div className="space-y-4">
            {deployments.map((deployment, index) => (
              <div key={deployment.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(deployment.state)}
                    <span className="font-medium">{deployment.branch}</span>
                    {getStatusBadge(deployment.state)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {deployment.created_at
                      ? formatDistanceToNow(new Date(deployment.created_at), { addSuffix: true })
                      : "Unknown time"}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    {deployment.commit_ref && (
                      <span className="text-muted-foreground">{deployment.commit_ref.substring(0, 7)}</span>
                    )}
                    {deployment.commit_message && <span className="ml-2">{deployment.commit_message}</span>}
                  </div>

                  <Button variant="ghost" size="sm" className="gap-1" asChild>
                    <a
                      href={`https://app.netlify.com/sites/${deployment.site_name}/deploys/${deployment.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View
                    </a>
                  </Button>
                </div>

                {deployment.state === "building" && <Progress value={45} className="h-2" />}

                {index < deployments.length - 1 && <Separator className="my-2" />}
              </div>
            ))}

            {/* Last refreshed indicator */}
            <div className="text-xs text-muted-foreground text-right pt-2">
              Last refreshed: {lastRefreshed.toLocaleTimeString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

