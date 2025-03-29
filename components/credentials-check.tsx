"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { hasNetlifyCredentials } from "@/lib/env-utils"
import { useRouter } from "next/navigation"

export default function CredentialsCheck() {
  const [hasCredentials, setHasCredentials] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check on mount and whenever localStorage changes
    const checkCredentials = () => {
      setHasCredentials(hasNetlifyCredentials())
    }

    checkCredentials()

    // Listen for storage events to detect credential changes
    window.addEventListener("storage", checkCredentials)

    return () => {
      window.removeEventListener("storage", checkCredentials)
    }
  }, [])

  if (hasCredentials) {
    return null
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Missing Credentials</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>Netlify API token or site ID is missing. Please configure your credentials.</p>
        <Button variant="outline" size="sm" className="w-fit" onClick={() => router.push("/dashboard/settings")}>
          Go to Settings
        </Button>
      </AlertDescription>
    </Alert>
  )
}

