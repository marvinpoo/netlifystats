// Utility to ensure environment variables are available
export function getNetlifyCredentials() {
  // First try environment variables
  let apiToken = process.env.NEXT_PUBLIC_NETLIFY_API_TOKEN
  let siteId = process.env.NEXT_PUBLIC_NETLIFY_SITE_ID

  // If we're in the browser, check localStorage as fallback
  if (typeof window !== "undefined") {
    if (!apiToken) {
      apiToken = localStorage.getItem("NETLIFY_API_TOKEN") || ""
    }
    if (!siteId) {
      siteId = localStorage.getItem("NETLIFY_SITE_ID") || ""
    }
  }

  return { apiToken, siteId }
}

// Check if credentials are available
export function hasNetlifyCredentials() {
  const { apiToken, siteId } = getNetlifyCredentials()
  return Boolean(apiToken && siteId)
}

