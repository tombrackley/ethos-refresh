import { cn } from '@/lib/utils'

const TONE = {
  ok: { dot: 'bg-emerald-500', halo: 'bg-emerald-500/25' },
  warn: { dot: 'bg-amber-500', halo: 'bg-amber-500/25' },
  bad: { dot: 'bg-red-500', halo: 'bg-red-500/25' },
}

export function ComplianceStatusBadge({ tone = 'ok', label = 'Compliance up to date', className }) {
  const t = TONE[tone] ?? TONE.ok
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-[#ECF2F5] bg-white px-3 py-1 text-xs font-normal text-foreground/70 shadow-[0_2px_6px_rgb(0_0_0/0.06)]',
        className
      )}
    >
      <span className="relative flex items-center justify-center size-3">
        <span className={cn('absolute inset-0 rounded-full', t.halo)} />
        <span className={cn('relative size-1 rounded-full', t.dot)} />
      </span>
      {label}
    </span>
  )
}
