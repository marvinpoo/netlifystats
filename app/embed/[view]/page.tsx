import { notFound } from "next/navigation"
import DeploymentView from "@/components/deployment-view"
import SiteInfoView from "@/components/site-info-view"
import BuildStatsView from "@/components/build-stats-view"
import CredentialsCheck from "@/components/credentials-check"

export default function EmbedPage({
  params,
  searchParams,
}: {
  params: { view: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { view } = params

  // Parse query parameters
  const refreshInterval = searchParams.refresh ? Number.parseInt(searchParams.refresh as string, 10) : 0
  const limit = searchParams.limit ? Number.parseInt(searchParams.limit as string, 10) : undefined

  // Render the appropriate view based on the URL parameter
  switch (view) {
    case "deployments":
      return (
        <div className="p-2">
          <CredentialsCheck />
          <DeploymentView isEmbedded refreshInterval={refreshInterval} limit={limit} />
        </div>
      )
    case "site-info":
      return (
        <div className="p-2">
          <CredentialsCheck />
          <SiteInfoView isEmbedded refreshInterval={refreshInterval} />
        </div>
      )
    case "build-stats":
      return (
        <div className="p-2">
          <CredentialsCheck />
          <BuildStatsView isEmbedded refreshInterval={refreshInterval} />
        </div>
      )
    default:
      return notFound()
  }
}

