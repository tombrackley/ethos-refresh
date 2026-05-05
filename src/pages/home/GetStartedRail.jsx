import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getStartedCards } from './getStartedContent'

const STORAGE_KEY = 'ethos_home_getstarted_v1'
const SCROLL_STEP = 320 // 300px card + 12px gap + 8px breathing room

const ACCENT_BG = {
  blue: 'bg-blue-100',
  green: 'bg-brand-green-100',
  purple: 'bg-purple-100',
  amber: 'bg-amber-100',
  brand: 'bg-brand-100',
}

const ICON_COLOR = 'text-[#151D2B]'

function readDismissed() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

function writeDismissed(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
  } catch { /* ignore */ }
}

export function GetStartedRail() {
  const scrollerRef = useRef(null)
  const [dismissed, setDismissed] = useState(readDismissed)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const visibleCards = getStartedCards.filter((c) => !dismissed.has(c.id))

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const update = () => {
      setAtStart(el.scrollLeft <= 4)
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [visibleCards.length])

  function dismiss(id) {
    setDismissed((prev) => {
      const next = new Set(prev)
      next.add(id)
      writeDismissed(next)
      return next
    })
  }

  function scrollByDir(dir) {
    scrollerRef.current?.scrollBy({ left: dir * SCROLL_STEP, behavior: 'smooth' })
  }

  if (visibleCards.length === 0) return null

  return (
    <section className="space-y-3">
      <header className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-foreground">Get started with Ethos</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => scrollByDir(-1)}
            disabled={atStart}
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => scrollByDir(1)}
            disabled={atEnd}
            aria-label="Scroll right"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </header>

      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {visibleCards.map((card) => {
          const Icon = card.icon
          return (
            <article
              key={card.id}
              className="min-w-[300px] max-w-[300px] snap-start flex flex-col gap-3 rounded-[10px] border border-[#ECF2F5] bg-white p-4 hover:border-brand-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div className={cn('size-12 rounded-[10px] flex items-center justify-center', ACCENT_BG[card.accent])}>
                  <Icon className={cn('size-6', ICON_COLOR)} />
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(card.id)}
                  aria-label={`Dismiss ${card.title}`}
                  className="size-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
              <h3 className="text-sm font-semibold text-foreground line-clamp-1">{card.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-3 flex-1">{card.body}</p>
              <Link
                to={card.ctaHref}
                className="inline-flex items-center gap-0.5 text-xs font-medium text-brand-700 hover:underline"
              >
                {card.ctaLabel} <ChevronRight className="size-3" />
              </Link>
            </article>
          )
        })}
      </div>
    </section>
  )
}
