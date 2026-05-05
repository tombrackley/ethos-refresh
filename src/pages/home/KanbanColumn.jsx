import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'

export function KanbanColumn({ title, count, viewAllHref, viewAllLabel = 'View all', children }) {
  return (
    <section className="flex flex-col min-w-0 gap-3">
      <header className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-normal text-muted-foreground/70">
            {title}
          </h2>
          {count != null && (
            <Badge variant="outline" className="h-5 px-1.5 text-[10px] tabular-nums">
              {count}
            </Badge>
          )}
        </div>
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {viewAllLabel} <ChevronRight className="size-3" />
          </Link>
        )}
      </header>

      <div className="flex flex-col gap-2">
        {Array.isArray(children) && children.length === 0 ? (
          <div className="rounded-[8px] border border-dashed border-border/80 bg-transparent p-4 text-center text-xs text-muted-foreground">
            All clear
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  )
}
