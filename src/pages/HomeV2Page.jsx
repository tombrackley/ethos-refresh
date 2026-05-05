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

const PROMPTS_SHOWN = 5

function pickN(allIds, n, exceptIds = []) {
  const pool = allIds.filter((id) => !exceptIds.includes(id))
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

function renderLabel(label) {
  return label.split('**').map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-semibold text-foreground">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  )
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

export default function HomeV2Page() {
  const firstName = tenant.user?.name?.split(' ')[0] ?? 'there'
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  const allIds = useMemo(() => chatPrompts.map((p) => p.id), [])
  const [shownIds, setShownIds] = useState(() => allIds.slice(0, PROMPTS_SHOWN))
  const shownPrompts = shownIds.map((id) => chatPrompts.find((p) => p.id === id)).filter(Boolean)

  function refreshPrompts() {
    setShownIds((prev) => pickN(allIds, PROMPTS_SHOWN, prev))
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
  }

  const upcoming = getUpcoming().slice(0, 3)
  const todo = getToDo().slice(0, 3)
  const recommended = getRecommended().slice(0, 3)

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="mx-auto max-w-6xl px-6 pt-32 pb-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-x-12 gap-y-10">
        <div className="min-w-0">
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

          <ul className="mt-8 divide-y divide-[#ECF2F5] border-t border-b border-[#ECF2F5]">
            {shownPrompts.map((p) => {
              const Icon = p.icon
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => applyPrompt(p.prompt)}
                    className="group flex w-full items-center gap-3 px-1 py-3.5 text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="size-4 shrink-0 text-foreground/70 group-hover:text-foreground transition-colors" />
                    <span className="truncate">{renderLabel(p.label)}</span>
                  </button>
                </li>
              )
            })}
            <li>
              <button
                type="button"
                onClick={refreshPrompts}
                className="group flex w-full items-center gap-3 px-1 py-3.5 text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw className="size-4 shrink-0 text-foreground/70 group-hover:text-foreground transition-colors" />
                <span className="flex-1">More suggestions</span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground/70 group-hover:text-foreground transition-colors" />
              </button>
            </li>
          </ul>
        </div>

        <aside className="space-y-8 lg:pt-2">
          <Section title="Upcoming meetings" items={upcoming} viewAllHref="/govern/meetings" />
          <Section title="To do" items={todo} viewAllHref="/work/time-efficiency" />
          <Section title="Recommended for you" items={recommended} viewAllHref="/insights" />
        </aside>
      </div>
    </div>
  )
}
