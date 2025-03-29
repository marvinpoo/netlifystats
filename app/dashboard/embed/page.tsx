import EmbedCode from "@/components/embed-code"

export default function EmbedPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Embed Dashboard</h1>
        <p className="text-muted-foreground">Get embed codes to include dashboard views in your website</p>
      </div>

      <EmbedCode />
    </div>
  )
}

