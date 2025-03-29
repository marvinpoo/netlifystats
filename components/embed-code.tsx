"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function EmbedCode() {
  const [copied, setCopied] = useState<string | null>(null)
  const [refreshInterval, setRefreshInterval] = useState(0)
  const [deploymentLimit, setDeploymentLimit] = useState(5)
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

  const getEmbedUrl = (view: string) => {
    let url = `${baseUrl}/embed/${view}`
    const params = new URLSearchParams()

    if (refreshInterval > 0) {
      params.append("refresh", refreshInterval.toString())
    }

    if (view === "deployments" && deploymentLimit > 0) {
      params.append("limit", deploymentLimit.toString())
    }

    const queryString = params.toString()
    if (queryString) {
      url += `?${queryString}`
    }

    return url
  }

  const embedUrls = {
    deployments: getEmbedUrl("deployments"),
    siteInfo: getEmbedUrl("site-info"),
    buildStats: getEmbedUrl("build-stats"),
  }

  const embedCodes = {
    deployments: `<iframe src="${embedUrls.deployments}" width="100%" height="500" frameborder="0"></iframe>`,
    siteInfo: `<iframe src="${embedUrls.siteInfo}" width="100%" height="500" frameborder="0"></iframe>`,
    buildStats: `<iframe src="${embedUrls.buildStats}" width="100%" height="500" frameborder="0"></iframe>`,
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Embed Codes</CardTitle>
        <CardDescription>Use these codes to embed the dashboard views in your site</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="refresh-interval">Auto-refresh Interval (seconds)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  id="refresh-interval"
                  min={0}
                  max={300}
                  step={30}
                  value={[refreshInterval]}
                  onValueChange={(value) => setRefreshInterval(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center">{refreshInterval === 0 ? "Off" : `${refreshInterval}s`}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Set to 0 to disable auto-refresh</p>
            </div>

            <div>
              <Label htmlFor="deployment-limit">Deployment Limit</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  id="deployment-limit"
                  min={1}
                  max={20}
                  step={1}
                  value={[deploymentLimit]}
                  onValueChange={(value) => setDeploymentLimit(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center">{deploymentLimit}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Number of deployments to show in the deployments view
              </p>
            </div>
          </div>

          <Tabs defaultValue="deployments" className="space-y-4">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="deployments">Deployments</TabsTrigger>
              <TabsTrigger value="siteInfo">Site Info</TabsTrigger>
              <TabsTrigger value="buildStats">Build Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="deployments" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input value={embedUrls.deployments} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(embedUrls.deployments, "deploymentsUrl")}
                >
                  {copied === "deploymentsUrl" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">{embedCodes.deployments}</pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(embedCodes.deployments, "deploymentsCode")}
                >
                  {copied === "deploymentsCode" ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {copied === "deploymentsCode" ? "Copied" : "Copy"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="siteInfo" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input value={embedUrls.siteInfo} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(embedUrls.siteInfo, "siteInfoUrl")}
                >
                  {copied === "siteInfoUrl" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">{embedCodes.siteInfo}</pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(embedCodes.siteInfo, "siteInfoCode")}
                >
                  {copied === "siteInfoCode" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied === "siteInfoCode" ? "Copied" : "Copy"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="buildStats" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input value={embedUrls.buildStats} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(embedUrls.buildStats, "buildStatsUrl")}
                >
                  {copied === "buildStatsUrl" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">{embedCodes.buildStats}</pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(embedCodes.buildStats, "buildStatsCode")}
                >
                  {copied === "buildStatsCode" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied === "buildStatsCode" ? "Copied" : "Copy"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card> 
  )
}

