import { CalendarDays, ChevronRight, ChevronDown, Flag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function AnnualWorkProgramRail({ items = [], currentMonth, year }) {
  return (
    <aside className="w-72 shrink-0 border-r border-border/60 bg-muted/20 overflow-y-auto">
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <CalendarDays className="size-3.5 text-muted-foreground" />
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Annual Work Program {year}
        </p>
      </div>

      <ul className="px-2 pb-4">
        {MONTHS.map((label, idx) => {
          const month = idx + 1
          const isCurrent = month === currentMonth
          const monthItems = items.filter(i => i.months?.includes(month))

          return (
            <li key={month}>
              <div
                className={cn(
                  'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs',
                  isCurrent
                    ? 'bg-white border border-border/60 shadow-xs text-foreground font-medium'
                    : 'text-muted-foreground',
                )}
              >
                {isCurrent
                  ? <ChevronDown className="size-3 text-brand-700" />
                  : <ChevronRight className="size-3 text-muted-foreground/60" />}
                <span className={cn('flex-1', isCurrent ? 'text-foreground' : 'text-muted-foreground')}>
                  {label}
                </span>
                {isCurrent && (
                  <span className="text-[10px] uppercase tracking-wider text-brand-700">This month</span>
                )}
              </div>

              {isCurrent && monthItems.length > 0 && (
                <ul className="mt-1.5 mb-2 ml-4 pl-3 border-l border-border/60 space-y-1.5">
                  {monthItems.map(item => (
                    <li key={item.id} className="flex items-start gap-2 py-1 pr-1">
                      <Flag className="size-3 text-amber-600 mt-0.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-foreground leading-snug">{item.name}</p>
                        {item.regulator && (
                          <Badge
                            variant="outline"
                            className="mt-1 h-4 px-1.5 text-[10px] border-amber-200 bg-amber-50 text-amber-800"
                          >
                            {item.regulator}
                          </Badge>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
