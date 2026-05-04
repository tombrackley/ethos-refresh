const RAG_FILL = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-400',
  red:   'bg-destructive',
}

export function StagePips({ stages, currentStage, rag = 'green', size = 'md' }) {
  const idx = stages.indexOf(currentStage)
  const dotSize = size === 'sm' ? 'size-1.5' : 'size-2'
  const fill = RAG_FILL[rag] ?? RAG_FILL.green
  return (
    <div className="flex items-center gap-1">
      {stages.map((stage, i) => (
        <span
          key={stage}
          title={stage}
          className={`${dotSize} rounded-full ${
            i < idx ? 'bg-foreground/40'
            : i === idx ? fill
            : 'bg-muted-foreground/20'
          }`}
        />
      ))}
    </div>
  )
}
