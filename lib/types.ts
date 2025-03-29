// Deployment data type
export interface DeploymentData {
  id: string
  site_id: string
  site_name: string
  state: string
  name: string
  url: string
  branch: string
  commit_ref: string
  commit_message?: string
  created_at: string
  published_at?: string | null
  deploy_time?: number | null
}

// Site information type
export interface SiteInfo {
  id: string
  site_id: string
  name: string
  url: string
  ssl: boolean
  custom_domain?: string
  created_at: string
  updated_at: string
  build_settings?: {
    repo_url?: string
    repo_branch?: string
    cmd?: string
    dir?: string
    stop_builds?: boolean
  }
}

// Build statistics type
export interface BuildStats {
  builds: DeploymentData[]
  successfulBuilds: number
  failedBuilds: number
  averageBuildTime: number
}

