import { GripVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export function AgendaItemCard({ index, item, typeStyle, paperStyle, sourceStyle }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-white p-4 hover:border-border/80 transition-colors">
      <GripVertical className="size-4 text-muted-foreground/40 mt-0.5 shrink-0" />
      <span className="text-sm font-medium text-muted-foreground tabular-nums w-5 shrink-0 mt-0.5">
        {index + 1}.
      </span>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start gap-3">
          <p className="text-sm font-medium text-foreground flex-1 leading-snug">{item.title}</p>
          <Badge
            variant="outline"
            className={cn('text-[11px] h-5 px-2 shrink-0', typeStyle?.[item.type])}
          >
            {item.type}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
          <div className="flex items-center gap-1.5">
            <Avatar className="size-5">
              <AvatarFallback className="text-[9px] bg-muted text-muted-foreground">
                {item.officer?.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground">{item.officer?.name}</span>
          </div>

          <Badge
            variant="outline"
            className={cn('text-[11px] h-5 px-2', paperStyle?.[item.paperStatus])}
          >
            {item.paperStatus}
          </Badge>

          <Badge
            variant="outline"
            className={cn('text-[11px] h-5 px-2', sourceStyle?.[item.source])}
          >
            {item.source}
          </Badge>
        </div>
      </div>
    </div>
  )
}
