import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DeploymentView from "@/components/deployment-view"
import SiteInfoView from "@/components/site-info-view"
import BuildStatsView from "@/components/build-stats-view"
import CredentialsCheck from "@/components/credentials-check"

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Netlify Dashboard</h1>
        <p className="text-muted-foreground">Monitor your Netlify site deployments, builds, and statistics</p>
      </div>

      <CredentialsCheck />

      <Tabs defaultValue="deployments" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="site-info">Site Info</TabsTrigger>
          <TabsTrigger value="build-stats">Build Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="deployments" className="space-y-4">
          <DeploymentView />
        </TabsContent>
        <TabsContent value="site-info" className="space-y-4">
          <SiteInfoView />
        </TabsContent>
        <TabsContent value="build-stats" className="space-y-4">
          <BuildStatsView />
        </TabsContent>
      </Tabs>
    </div>
  )
}

