import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const TONE = {
  ok: { variant: 'status-complete', dot: 'bg-emerald-500', defaultLabel: 'On track' },
  warn: { variant: 'importance-high', dot: 'bg-amber-500', defaultLabel: 'Needs attention' },
  bad: { variant: 'importance-critical', dot: 'bg-red-500', defaultLabel: 'At risk' },
}

const DEFAULT_REASONS = [
  'CPD hours up to date',
  'Annual attestations completed',
  'Mandatory training current',
  'No overdue policy acknowledgements',
  'No open compliance breaches',
]

export function ComplianceStatusBadge({ tone = 'ok', label, reasons = DEFAULT_REASONS, className }) {
  const t = TONE[tone] ?? TONE.ok
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm text-muted-foreground', className)}>
      Compliance status:
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={t.variant}
            className="font-mono uppercase tracking-wide text-[#151D2B] bg-[#D5FFDA] border-transparent cursor-default"
          >
            <span className={cn('size-1.5 rounded-full', t.dot)} />
            {label ?? t.defaultLabel}
          </Badge>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="end"
          sideOffset={8}
          className="bg-white text-foreground border border-border shadow-md rounded-lg p-3 max-w-[260px]"
          arrowClassName="bg-white fill-white border-l border-t border-border"
        >
          <p className="text-xs font-medium text-foreground mb-2">Why you're on track</p>
          <ul className="space-y-1.5">
            {reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-2 text-xs text-muted-foreground">
                <Check className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    </span>
  )
}
