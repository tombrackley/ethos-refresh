import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { IconCalendar1 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconCalendar1'
import { IconCircleDashed } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconCircleDashed'
import { IconFileSparkle } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconFileSparkle'
import { IconFileText } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconFileText'
import { IconLayersThree } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconLayersThree'
import { IconLightbulbGlow } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconLightbulbGlow'
import { IconRadar } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconRadar'
import { IconShieldCheck3 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconShieldCheck3'
import { IconTeam } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconTeam'
import tenant from '@/config/tenant'
import { cn } from '@/lib/utils'
import { AskEthosSparkle } from '@/components/AskEthosSparkle'
import { ComplianceStatusBadge } from '@/components/shared/ComplianceStatusBadge'

const EXPLORE_ITEMS = [
  {
    icon: IconTeam,
    title: 'Talent',
    description: 'Map team capability, surface skill gaps, and plan upskilling against the work in flight.',
  },
  {
    icon: IconLightbulbGlow,
    title: 'Insights',
    description: 'AI-summarised regulatory and industry briefings, tailored to your matters and jurisdictions.',
  },
  {
    icon: IconShieldCheck3,
    title: 'Policy uplift',
    description: 'Auto-suggest policy improvements against the latest regulations, frameworks, and peer benchmarks.',
  },
  {
    icon: IconFileSparkle,
    title: 'Contract coach',
    description: 'Clause-by-clause guidance, redline suggestions, and risk flags on every agreement you review.',
  },
  {
    icon: IconRadar,
    title: 'Risk radar',
    description: 'Surface emerging risks across matters, suppliers, and obligations before they escalate.',
  },
]

const RECENT_ITEMS = [
  { icon: IconLayersThree, name: 'ASIC Cyber Resilience Review', who: 'You', when: '2h ago' },
  { icon: IconFileText, name: 'Q1 Board Paper — Risk update', who: 'You', when: '3h ago' },
  { icon: IconCircleDashed, name: 'Approve quarterly compliance plan', who: 'You', when: '4h ago' },
  { icon: IconFileText, name: 'Information Security Policy v3', who: 'You', when: 'Yesterday' },
  { icon: IconCalendar1, name: 'Audit & Risk Committee — May', who: 'You', when: 'Yesterday' },
  { icon: IconFileText, name: 'Whistleblower Disclosure log', who: 'Sam Lee', when: '2 days ago' },
  { icon: IconLayersThree, name: 'Vendor due diligence — Apollo', who: 'You', when: '3 days ago' },
]

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
  if (h < 12) return 'Good Morning'
  if (h < 18) return 'Good Afternoon'
  return 'Good Evening'
}

const CATEGORY_COLOR = {
  committee: 'bg-amber-300',
  sync: 'bg-blue-300',
  board: 'bg-slate-400',
  compliance: 'bg-emerald-300',
  ir: 'bg-purple-300',
  regulator: 'bg-rose-300',
}

const COMING_UP = [
  {
    label: 'Tomorrow',
    events: [
      { time: '8:30 AM', title: 'Audit & Risk Committee pre-read', category: 'committee' },
      { time: '2:00 PM', title: 'Chair check-in', meta: 'Microsoft Teams Meeting', category: 'sync' },
    ],
  },
  {
    label: 'Thu, May 7',
    events: [
      { time: '9:30 AM', title: 'Board strategy offsite — Day 1', category: 'board' },
      { time: '11:00 AM', title: 'Q1 compliance briefing', category: 'compliance' },
    ],
  },
  {
    label: 'Mon, May 11',
    events: [
      { time: '10:00 AM', title: 'Investor relations update', category: 'ir' },
      { time: '3:00 PM', title: 'ASIC engagement prep', category: 'regulator' },
    ],
  },
]

function ComingUp() {
  return (
    <div className="rounded-xl border border-[#E5EAEE] bg-white px-5 py-5 min-h-[320px]">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-foreground">Coming up</h2>
        <Link
          to="/govern/meetings"
          className="inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          View full calendar <ChevronRight className="size-3" />
        </Link>
      </div>

      <div className="mt-5 space-y-4">
        {COMING_UP.map((group) => (
          <div key={group.label} className="space-y-1.5">
            <p className="px-2 text-xs text-muted-foreground">{group.label}</p>
            <ul>
              {group.events.map((e, i) => (
                <li key={i}>
                  <button
                    type="button"
                    className="group flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted/40"
                  >
                    <span className={cn('h-4 w-[3px] shrink-0 rounded-full', CATEGORY_COLOR[e.category] ?? 'bg-foreground/80')} />
                    <span className="flex-1 truncate text-foreground">
                      {e.time}
                      <span className="mx-1.5 text-muted-foreground">·</span>
                      {e.title}
                      {e.meta && (
                        <>
                          <span className="mx-1.5 text-muted-foreground">·</span>
                          {e.meta}
                        </>
                      )}
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

const CARD_WIDTH = 320
const CARD_GAP = 16
const MASK_RIGHT = '[mask-image:linear-gradient(to_right,black_92%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_92%,transparent_100%)]'
const MASK_LEFT = '[mask-image:linear-gradient(to_right,transparent_0%,black_8%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_8%)]'
const MASK_BOTH = '[mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]'

const INSIGHT_IMAGES = [
  '/images/banking-regulation-hero.png',
  '/images/risk-management-hero.png',
  '/images/ai-governance-hero.png',
]

function LatestInsights() {
  const items = (tenant.pages?.insights?.briefingItems ?? []).slice(0, 3)
  if (items.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium tracking-[-0.01em] text-foreground">Latest insights</h2>
          <button
            type="button"
            aria-label="Summarise insights"
            className="group inline-flex items-center"
          >
            <AskEthosSparkle className="size-4" />
            <span className="overflow-hidden whitespace-nowrap text-xs font-medium text-muted-foreground max-w-0 opacity-0 transition-all duration-200 group-hover:max-w-[160px] group-hover:opacity-100 group-hover:ml-1.5">
              Summarise insights
            </span>
          </button>
        </div>
        <button
          type="button"
          aria-label="Open in Ethos"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-foreground transition-colors"
        >
          <ArrowUpRight className="size-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <article
            key={item.id}
            className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#E5EAEE] bg-white transition-all hover:border-[#CBD5DC] hover:shadow-sm"
          >
            <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
              <img
                src={INSIGHT_IMAGES[i % INSIGHT_IMAGES.length]}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                <span>{item.source}</span>
                {item.contentType && (
                  <>
                    <span>·</span>
                    <span>{item.contentType}</span>
                  </>
                )}
              </div>
              <h3 className="text-sm font-medium text-foreground line-clamp-2">{item.title}</h3>
              <p className="flex-1 text-xs text-muted-foreground line-clamp-3">{item.excerpt}</p>
              <p className="text-xs text-muted-foreground">
                {item.time}
                {item.readTime && (
                  <>
                    <span className="mx-1">·</span>
                    {item.readTime} read
                  </>
                )}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function ExploreEthos() {
  const scrollerRef = useRef(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    function update() {
      setAtStart(el.scrollLeft <= 1)
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  function scrollBy(delta) {
    scrollerRef.current?.scrollBy({ left: delta, behavior: 'smooth' })
  }

  const stride = CARD_WIDTH + CARD_GAP
  const maskClass = !atStart && !atEnd ? MASK_BOTH : !atEnd ? MASK_RIGHT : !atStart ? MASK_LEFT : ''

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium tracking-[-0.01em] text-foreground">Explore Ethos</h2>
      <div className="relative -mx-8">
        <div
          ref={scrollerRef}
          className={cn(
            'flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pl-8 pr-8 scroll-pl-8 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            maskClass
          )}
        >
          {EXPLORE_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.title}
                type="button"
                className="group flex shrink-0 w-[320px] snap-start flex-col items-start gap-3 rounded-xl border border-[#E5EAEE] bg-white px-5 py-5 text-left hover:border-[#CBD5DC] hover:shadow-sm transition-all"
              >
                <div className="flex size-8 items-center justify-center rounded-md bg-brand-green-100">
                  <Icon className="size-5 text-[#151D2B]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-medium text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </button>
            )
          })}
        </div>
        {!atStart && (
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollBy(-stride)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-foreground/70 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}
        {!atEnd && (
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollBy(stride)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-foreground/70 hover:text-foreground transition-colors"
          >
            <ChevronRight className="size-5" />
          </button>
        )}
      </div>
    </section>
  )
}

function JumpBackInCard() {
  return (
    <div className="rounded-xl border border-[#E5EAEE] bg-white px-5 py-5 min-h-[320px]">
      <h2 className="text-base font-medium text-foreground">Jump back in</h2>

      <p className="mt-5 mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
        Recent
      </p>

      <ul className="space-y-0.5">
        {RECENT_ITEMS.map((item, i) => {
          const Icon = item.icon
          return (
            <li key={i}>
              <button
                type="button"
                className="group flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted/40"
              >
                <Icon className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="flex-1 truncate text-sm text-foreground">{item.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {item.who} · {item.when}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function HomeV3Page() {
  const firstName = tenant.user?.name?.split(' ')[0] ?? 'there'
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

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

  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="mx-auto max-w-[1200px] px-8 pt-20 pb-12 space-y-12">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-[32px] font-normal tracking-[-0.03em] text-foreground">
            {greetingPrefix()}, {firstName}
          </h1>
          <ComplianceStatusBadge />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-3 rounded-full border border-border bg-white px-6 py-4 shadow-sm focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-200/50 transition-all">
            <AskEthosSparkle className="size-5 shrink-0" />
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Ask Ethos"
                className="block w-full bg-transparent text-base text-foreground outline-none"
              />
              {input === '' && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute inset-y-0 left-0 flex items-center text-base text-muted-foreground transition-opacity duration-300',
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
              className="size-9 flex items-center justify-center rounded-full bg-foreground text-background hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          <JumpBackInCard />
          <ComingUp />
        </div>

        <ExploreEthos />

        <LatestInsights />
      </div>
    </div>
  )
}
