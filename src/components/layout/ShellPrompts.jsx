import { useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { AskEthosSparkle } from '@/components/AskEthosSparkle'

const PROMPTS_SHOWN = 3

function pickN(allIds, n, currentIds) {
  const remaining = allIds.filter((id) => !currentIds.includes(id))
  if (remaining.length >= n) {
    return shuffle(remaining).slice(0, n)
  }
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

function renderLabel(label) {
  const parts = label.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1
      ? <span key={i} className="font-medium text-foreground">{part}</span>
      : <span key={i}>{part}</span>
  )
}

export function ShellPrompts({ prompts, onPromptClick }) {
  const allIds = useMemo(() => prompts.map((p) => p.id), [prompts])
  const [shownIds, setShownIds] = useState(() => allIds.slice(0, PROMPTS_SHOWN))
  const shownPrompts = shownIds.map((id) => prompts.find((p) => p.id === id)).filter(Boolean)

  function refreshPrompts() {
    setShownIds((prev) => pickN(allIds, PROMPTS_SHOWN, prev))
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {shownPrompts.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onPromptClick?.(p)}
          className="group inline-flex items-center gap-2 rounded-full bg-[#F7F7F7] hover:bg-[#EFEFEF] px-3 py-1.5 text-sm text-foreground/80 hover:text-foreground transition-colors"
        >
          <AskEthosSparkle className="size-4 shrink-0" />
          <span className="truncate">{renderLabel(p.label)}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={refreshPrompts}
        aria-label="Refresh suggestions"
        className="inline-flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors"
      >
        <RefreshCw className="size-3.5 shrink-0" />
      </button>
    </div>
  )
}
