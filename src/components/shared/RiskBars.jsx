const RISK_CONFIG = {
  Critical: { filled: 4, color: 'bg-rose-400'    },
  High:     { filled: 3, color: 'bg-orange-400'  },
  Medium:   { filled: 2, color: 'bg-yellow-300'  },
  Low:      { filled: 1, color: 'bg-emerald-300' },
}

export function RiskBars({ level }) {
  const { filled, color } = RISK_CONFIG[level] ?? { filled: 0, color: 'bg-slate-200' }
  return (
    <div className="relative inline-flex group">
      <div className="flex items-center gap-px">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`w-1 h-3 ${i < filled ? color : 'bg-slate-200'}`} />
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded text-xs font-medium bg-foreground text-background whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
        {level}
      </div>
    </div>
  )
}
