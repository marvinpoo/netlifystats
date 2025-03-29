"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Clock, RefreshCw } from "lucide-react"
import { fetchNetlifyBuildStats } from "@/lib/netlify-api"
import type { BuildStats } from "@/lib/types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { hasNetlifyCredentials } from "@/lib/env-utils"

interface BuildStatsViewProps {
  isEmbedded?: boolean
  refreshInterval?: number // in seconds, 0 means no auto-refresh
}

export default function BuildStatsView({ isEmbedded = false, refreshInterval = 0 }: BuildStatsViewProps) {
  const [buildStats, setBuildStats] = useState<BuildStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const loadBuildStats = async () => {
    if (!hasNetlifyCredentials()) {
      setError("Netlify API token or site ID not configured. Please check your settings.")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await fetchNetlifyBuildStats()
      setBuildStats(data)
      setLastRefreshed(new Date())
    } catch (err) {
      console.error("Build stats fetch error:", err)
      setError("Failed to load build statistics. Please check your API token and site ID.")
      setBuildStats(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial load
    loadBuildStats()

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Set up auto-refresh if interval > 0
    if (refreshInterval && refreshInterval > 0) {
      intervalRef.current = setInterval(loadBuildStats, refreshInterval * 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [refreshInterval])

  // Format data for the chart
  const chartData =
    buildStats?.builds?.map((build) => ({
      id: build.id.substring(0, 7),
      duration: Math.round(build.duration / 1000), // Convert ms to seconds
      status: build.status,
    })) || []

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <Button variant="outline" size="sm" className="mt-2" onClick={loadBuildStats}>
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
          <CardTitle>Build Statistics</CardTitle>
          <CardDescription>
            Build times and performance metrics
            {refreshInterval > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                (Auto-refreshes every {refreshInterval} seconds)
              </span>
            )}
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={loadBuildStats} disabled={loading} className="gap-1">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        ) : !buildStats ? (
          <div className="text-center py-6 text-muted-foreground">
            No build statistics found. Make sure your API token and site ID are correct.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="h-[300px] w-full">
              <ChartContainer
                config={{
                  duration: {
                    label: "Build Duration (seconds)",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="id" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="duration" fill="var(--color-duration)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Build Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">
                      {buildStats.averageBuildTime ? `${Math.round(buildStats.averageBuildTime / 1000)}s` : "N/A"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Successful Builds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{buildStats.successfulBuilds || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Failed Builds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{buildStats.failedBuilds || 0}</div>
                </CardContent>
              </Card>
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

