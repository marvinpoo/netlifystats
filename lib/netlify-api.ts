import type { DeploymentData, SiteInfo, BuildStats } from "./types"
import { getNetlifyCredentials } from "./env-utils"

// Base URL for Netlify API
const NETLIFY_API_URL = "https://api.netlify.com/api/v1"

// Helper function to make API requests
async function fetchFromNetlify(endpoint: string) {
  const { apiToken, siteId } = getNetlifyCredentials()

  if (!apiToken || !siteId) {
    throw new Error("Netlify API token or site ID not configured")
  }

  // Use the site ID from credentials for the endpoint
  const fullEndpoint = endpoint.replace("{siteId}", siteId)

  const response = await fetch(`${NETLIFY_API_URL}${fullEndpoint}`, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Netlify API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Fetch deployments for a site
export async function fetchNetlifyDeployments(): Promise<DeploymentData[]> {
  try {
    const { siteId } = getNetlifyCredentials()
    const deployments = await fetchFromNetlify(`/sites/${siteId}/deploys`)
    return deployments
  } catch (error) {
    console.error("Error fetching Netlify deployments:", error)
    throw error
  }
}

// Fetch site information
export async function fetchNetlifySiteInfo(): Promise<SiteInfo> {
  try {
    const { siteId } = getNetlifyCredentials()
    const siteInfo = await fetchFromNetlify(`/sites/${siteId}`)
    return siteInfo
  } catch (error) {
    console.error("Error fetching Netlify site info:", error)
    throw error
  }
}

// Fetch build statistics
export async function fetchNetlifyBuildStats(): Promise<BuildStats> {
  try {
    const { siteId } = getNetlifyCredentials()
    const deployments = await fetchFromNetlify(`/sites/${siteId}/deploys`)

    // Calculate build statistics
    const builds = deployments.slice(0, 10) // Get last 10 builds

    const successfulBuilds = builds.filter((build) => build.state === "ready").length
    const failedBuilds = builds.filter((build) => build.state === "error").length

    // Calculate average build time
    const buildTimes = builds
      .filter((build) => build.state === "ready" && build.duration)
      .map((build) => build.duration)

    const averageBuildTime =
      buildTimes.length > 0 ? buildTimes.reduce((sum, time) => sum + time, 0) / buildTimes.length : 0

    return {
      builds,
      successfulBuilds,
      failedBuilds,
      averageBuildTime,
    }
  } catch (error) {
    console.error("Error fetching Netlify build stats:", error)
    throw error
  }
}

