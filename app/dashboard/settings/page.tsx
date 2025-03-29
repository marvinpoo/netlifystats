"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Save } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const [apiToken, setApiToken] = useState("")
  const [siteId, setSiteId] = useState("")
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Load saved values from localStorage
    const savedToken = localStorage.getItem("NETLIFY_API_TOKEN") || ""
    const savedSiteId = localStorage.getItem("NETLIFY_SITE_ID") || ""

    setApiToken(savedToken)
    setSiteId(savedSiteId)
  }, [])

  const handleSave = () => {
    try {
      // Save to localStorage
      localStorage.setItem("NETLIFY_API_TOKEN", apiToken)
      localStorage.setItem("NETLIFY_SITE_ID", siteId)

      setSaved(true)
      setError(null)

      // Refresh the page to ensure the new credentials are used
      setTimeout(() => {
        router.refresh()
        // Reset saved state after refresh
        setTimeout(() => setSaved(false), 1000)
      }, 500)
    } catch (err) {
      setError("Failed to save settings. Please try again.")
      console.error(err)
    }
  }

  const testConnection = async () => {
    try {
      // Save current values first
      localStorage.setItem("NETLIFY_API_TOKEN", apiToken)
      localStorage.setItem("NETLIFY_SITE_ID", siteId)

      // Test the connection
      const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      // If we get here, the connection was successful
      setError(null)
      alert("Connection successful! Your credentials are working.")
    } catch (err) {
      setError(`Connection test failed: ${err.message}`)
      console.error(err)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your Netlify API credentials</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Enter your Netlify API token and site ID to connect to your Netlify account</CardDescription>
          <p className="text-sm text-muted-foreground mt-2">
            Note: These settings are stored in your browser. For production use, set the environment variables in your
            Vercel project.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="api-token">Netlify API Token</Label>
            <Input
              id="api-token"
              type="password"
              placeholder="Enter your Netlify API token"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              You can create a personal access token in your{" "}
              <a
                href="https://app.netlify.com/user/applications#personal-access-tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Netlify account settings
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-id">Netlify Site ID</Label>
            <Input
              id="site-id"
              placeholder="Enter your Netlify site ID"
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              You can find your site ID in the site settings or in the API ID field in the site overview
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={handleSave} disabled={saved} className="gap-2">
            {saved ? <Save className="h-4 w-4 text-green-500" /> : <Save className="h-4 w-4" />}
            {saved ? "Saved" : "Save Settings"}
          </Button>
          <Button variant="outline" onClick={testConnection}>
            Test Connection
          </Button>
        </CardFooter>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Status Badge</CardTitle>
          <CardDescription>Add a Netlify status badge to your repository README</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Markdown</Label>
            <div className="bg-muted p-3 rounded-md">
              <code className="text-sm break-all">
                {`[![Netlify Status](https://api.netlify.com/api/v1/badges/${siteId || "your-site-id"}/deploy-status)](https://app.netlify.com/sites/your-site-name/deploys)`}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

