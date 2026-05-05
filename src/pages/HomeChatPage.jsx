import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, ChevronRight, RefreshCw } from 'lucide-react'
import tenant from '@/config/tenant'
import { cn } from '@/lib/utils'
import { AskEthosSparkle } from '@/components/AskEthosSparkle'
import { ComplianceStatusBadge } from '@/components/shared/ComplianceStatusBadge'
import { chatPrompts } from './home/chatPrompts'
import { CardForKind } from './home/cards'
import { getUpcoming, getToDo, getRecommended } from './home/data'

const ACCENT_BG = {
  blue: 'bg-blue-100',
  amber: 'bg-amber-100',
  purple: 'bg-purple-100',
  red: 'bg-red-100',
  green: 'bg-brand-green-100',
  cyan: 'bg-cyan-100',
  slate: 'bg-slate-100',
}

const ICON_COLOR = 'text-[#151D2B]'

function pickThree(allIds, exceptIds = []) {
  const pool = allIds.filter((id) => !exceptIds.includes(id))
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}

const PLACEHOLDER_SUGGESTIONS = [
  'What are my upcoming board meetings?',
  'Summarise the most recent board pack',
  'What is the latest risk analysis?',
  'CPD progress this year',
]
const PLACEHOLDER_INTERVAL_MS = 3500
const PLACEHOLDER_FADE_MS = 400

function greetingPrefix() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function Section({ title, viewAllHref, items }) {
  if (!items || items.length === 0) return null
  return (
    <section className="space-y-3">
      <header className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View all <ChevronRight className="size-3" />
          </Link>
        )}
      </header>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <CardForKind key={`${title}-${i}`} kind={item.kind} record={item.record} />
        ))}
      </div>
    </section>
  )
}

export default function HomeChatPage() {
  const firstName = tenant.user?.name?.split(' ')[0] ?? 'there'
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  const allIds = useMemo(() => chatPrompts.map((p) => p.id), [])
  const [shownIds, setShownIds] = useState(() => allIds.slice(0, 3))
  const shownPrompts = shownIds.map((id) => chatPrompts.find((p) => p.id === id)).filter(Boolean)

  function refreshPrompts() {
    setShownIds((prev) => pickThree(allIds, prev))
  }

  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [placeholderVisible, setPlaceholderVisible] = useState(true)

  useEffect(() => {
    if (input !== '') return
    const interval = setInterval(() => {
      setPlaceholderVisible(false)
      window.setTimeout(() => {
        setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_SUGGESTIONS.length)
        setPlaceholderVisible(true)
      }, PLACEHOLDER_FADE_MS)
    }, PLACEHOLDER_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [input])

  function applyPrompt(prompt) {
    setInput(prompt)
    inputRef.current?.focus()
  }

  function handleSubmit(e) {
    e.preventDefault()
    // No-op for v1 — placeholder for chat backend wiring.
  }

  const upcoming = getUpcoming().slice(0, 3)
  const todo = getToDo().slice(0, 3)
  const recommended = getRecommended().slice(0, 3)

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="mx-auto max-w-3xl px-6 pt-32 pb-12">
        <div className="flex flex-col items-center gap-3">
          <ComplianceStatusBadge />
          <div className="text-center space-y-2">
            <h1 className="text-[32px] font-medium tracking-[-0.03em] text-foreground">
              {greetingPrefix()}, {firstName}
            </h1>
            <p className="text-base text-muted-foreground">
              What would you like to work on today?
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 shadow-sm focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-200/50 transition-all">
            <AskEthosSparkle className="size-5 shrink-0" />
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Ask Ethos"
                className="block w-full bg-transparent text-sm text-foreground outline-none"
              />
              {input === '' && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute inset-y-0 left-0 flex items-center text-sm text-muted-foreground transition-opacity duration-300',
                    placeholderVisible ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  {PLACEHOLDER_SUGGESTIONS[placeholderIndex]}
                </span>
              )}
            </div>
            <button
              type="submit"
              aria-label="Send"
              disabled={!input.trim()}
              className="size-8 flex items-center justify-center rounded-full bg-foreground text-background hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </form>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          {shownPrompts.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => applyPrompt(p.prompt)}
              className="group flex flex-col items-start gap-1 rounded-[10px] border border-[#ECF2F5] bg-white p-4 text-left hover:border-brand-200 hover:shadow-sm transition-all"
            >
              <p className="text-sm font-semibold text-foreground line-clamp-1">{p.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{p.subtitle}</p>
            </button>
          ))}
        </div>

        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={refreshPrompts}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/80 hover:text-foreground transition-colors"
          >
            <RefreshCw className="size-3" />
            More suggestions
          </button>
        </div>

        <hr className="mt-12 border-t border-[#ECF2F5]" />

        <div className="mt-10 divide-y divide-[#ECF2F5] [&>section]:py-8 [&>section:first-child]:pt-0 [&>section:last-child]:pb-0">
          <Section title="Upcoming meetings" items={upcoming} viewAllHref="/govern/meetings" />
          <Section title="To do" items={todo} viewAllHref="/work/time-efficiency" />
          <Section title="Recommended for you" items={recommended} viewAllHref="/insights" />
        </div>
      </div>
    </div>
  )
}
