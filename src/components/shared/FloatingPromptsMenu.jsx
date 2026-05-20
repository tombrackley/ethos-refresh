import { useMemo, useState } from 'react'
import { X, RefreshCw, ArrowUpRight } from 'lucide-react'
import { AskEthosSparkle } from '@/components/AskEthosSparkle'
import { cn } from '@/lib/utils'

const PROMPTS_SHOWN = 3

function pickN(allIds, n, currentIds) {
  const remaining = allIds.filter((id) => !currentIds.includes(id))
  if (remaining.length >= n) return shuffle(remaining).slice(0, n)
  const fromCurrent = shuffle(currentIds).slice(0, n - remaining.length)
  return [...shuffle(remaining), ...fromCurrent]
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function stripBold(label) {
  return label.replace(/\*\*(.+?)\*\*/g, '$1')
}

export function FloatingPromptsMenu({ prompts, onPromptClick }) {
  const allIds = useMemo(() => prompts.map((p) => p.id), [prompts])
  const [shownIds, setShownIds] = useState(() => allIds.slice(0, PROMPTS_SHOWN))
  const [open, setOpen] = useState(true)
  const shownPrompts = shownIds.map((id) => prompts.find((p) => p.id === id)).filter(Boolean)

  function refreshPrompts() {
    setShownIds((prev) => pickN(allIds, PROMPTS_SHOWN, prev))
  }

  function handlePromptClick(prompt) {
    onPromptClick?.(prompt)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open AI suggestions"
        className="fixed bottom-6 right-6 z-30 flex size-12 items-center justify-center rounded-full bg-white border border-border shadow-[0_8px_24px_-6px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.2)] transition-shadow"
      >
        <AskEthosSparkle className="size-5" />
      </button>
    )
  }

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-30 w-[300px] rounded-xl bg-white border border-border/60',
        'shadow-[0_8px_24px_-6px_rgba(0,0,0,0.18)]'
      )}
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <AskEthosSparkle className="size-5" />
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close suggestions"
          className="text-muted-foreground/60 hover:text-foreground transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>

      <ul className="divide-y divide-border/60 px-4">
        {shownPrompts.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => handlePromptClick(p)}
              className="group flex w-full items-start gap-3 py-3 text-left text-sm text-foreground hover:text-foreground/80 transition-colors"
            >
              <span className="flex-1">{stripBold(p.label)}</span>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/60 group-hover:text-foreground transition-colors mt-0.5" />
            </button>
          </li>
        ))}
      </ul>

      <div className="px-4 py-3 border-t border-border/60">
        <button
          type="button"
          onClick={refreshPrompts}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="size-3.5" />
          More
        </button>
      </div>
    </div>
  )
}
