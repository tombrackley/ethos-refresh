import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, ChevronDown } from 'lucide-react'

export function AiSummaryBar({ points, onOpenDrawer }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="rounded border border-brand-200 bg-brand-50/40 px-4 py-3 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-3.5 text-brand-700 shrink-0" />
          <span className="text-sm font-medium text-brand-800">Ethos Summary</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenDrawer}
            className="h-6 px-2 text-xs text-brand-700 hover:text-brand-800 hover:bg-brand-100 border border-brand-200"
          >
            View full analysis
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(c => !c)}
            className="size-6 text-muted-foreground hover:bg-brand-100"
          >
            <ChevronDown className={`size-3.5 transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`} />
          </Button>
        </div>
      </div>
      {!collapsed && (
        <ul className="space-y-1.5 pl-1">
          {points.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-brand-900/70 leading-relaxed">
              <span className="mt-1.5 size-1 rounded-full bg-brand-400 shrink-0" />
              {point}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
