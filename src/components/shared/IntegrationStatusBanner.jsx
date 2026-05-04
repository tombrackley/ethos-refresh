import { Plug } from 'lucide-react'

export function IntegrationStatusBanner({ name, message }) {
  return (
    <div className="shrink-0 border-b border-blue-200/60 bg-blue-50/70 px-6 py-2.5 flex items-center gap-2 text-xs text-blue-900">
      <Plug className="size-3.5 text-blue-700 shrink-0" />
      <span>
        <strong className="font-medium">Connected to {name}</strong> — {message}
      </span>
    </div>
  )
}
