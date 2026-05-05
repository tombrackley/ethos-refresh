import { cn } from '@/lib/utils'

export function ViewToggle({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-md border border-border/60 overflow-hidden bg-white">
      {options.map(opt => {
        const Icon = opt.icon
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            title={opt.label}
            aria-label={opt.label}
            aria-pressed={active}
            className={cn(
              'flex items-center gap-1.5 px-3 h-8 text-sm font-medium transition-colors',
              active ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/40',
            )}
          >
            <Icon className="size-3.5" />
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
