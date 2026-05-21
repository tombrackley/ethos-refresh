import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronUp, X } from 'lucide-react'
import { IconRocket } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconRocket'
import { IconCheckmark1 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconCheckmark1'
import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { getStartedCards } from '@/pages/home/getStartedContent'
import {
  readCompleted,
  writeCompleted,
  readDismissed,
  writeDismissed,
  useCompletedJson,
} from '@/lib/getStartedProgress'
import { FocusAreasModal } from './FocusAreasModal'

const ACCENT_BG = {
  blue: 'bg-blue-100',
  green: 'bg-brand-green-100',
  purple: 'bg-purple-100',
  amber: 'bg-amber-100',
  brand: 'bg-brand-100',
}

export function GetStartedWidget() {
  const { state, toggleSidebar } = useSidebar()
  const collapsed = state === 'collapsed'
  const [open, setOpen] = useState(false)
  const completedJson = useCompletedJson()
  const completed = (() => {
    try { return new Set(JSON.parse(completedJson)) } catch { return new Set() }
  })()
  const [dismissed, setDismissed] = useState(readDismissed)
  const [focusModalOpen, setFocusModalOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    function onEsc(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  if (dismissed) return null

  const total = getStartedCards.length
  const done = completed.size
  const percent = Math.round((done / total) * 100)
  const allDone = done === total

  function toggleComplete(id) {
    const next = new Set(readCompleted())
    if (next.has(id)) next.delete(id)
    else next.add(id)
    writeCompleted(next)
  }

  function dismiss() {
    writeDismissed(true)
    setDismissed(true)
  }

  function handleTriggerClick() {
    if (collapsed) {
      toggleSidebar()
      return
    }
    setOpen(o => !o)
  }

  function handleFocusSaved(values) {
    if (values.length > 0) {
      const next = new Set(readCompleted())
      next.add('personalise-focus')
      writeCompleted(next)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <FocusAreasModal
        open={focusModalOpen}
        onClose={() => setFocusModalOpen(false)}
        onSave={handleFocusSaved}
      />
      {open && !collapsed && (
        <div className="absolute bottom-full left-0 mb-2 w-[320px] rounded-xl border border-border bg-white shadow-xl overflow-hidden">
          <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Get started with Ethos</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {allDone ? 'You\'re all set — great work.' : `${done} of ${total} complete`}
              </p>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="-mt-1 -mr-1 size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="px-4 pb-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-brand-700 transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
          <ul className="px-2 pb-2 pt-1 max-h-[360px] overflow-y-auto">
            {getStartedCards.map(card => {
              const Icon = card.icon
              const isDone = completed.has(card.id)
              const body = (
                <>
                  <div className="flex items-center gap-2">
                    <span className={cn('size-5 inline-flex items-center justify-center rounded shrink-0', ACCENT_BG[card.accent])}>
                      <Icon className="size-3 text-[#151D2B]" />
                    </span>
                    <span className={cn(
                      'text-sm font-medium text-foreground',
                      isDone && 'line-through text-muted-foreground'
                    )}>
                      {card.title}
                    </span>
                  </div>
                  <p className="mt-0.5 ml-7 text-xs text-muted-foreground line-clamp-2">
                    {card.body}
                  </p>
                </>
              )
              return (
                <li key={card.id}>
                  <div className="group flex items-start gap-3 rounded-md px-2 py-2 hover:bg-muted/50 transition-colors">
                    <button
                      type="button"
                      onClick={() => toggleComplete(card.id)}
                      aria-label={isDone ? `Mark ${card.title} incomplete` : `Mark ${card.title} complete`}
                      className={cn(
                        'mt-0.5 size-5 shrink-0 inline-flex items-center justify-center rounded-full border transition-colors',
                        isDone
                          ? 'bg-brand-700 border-brand-700 text-white'
                          : 'border-muted-foreground/40 hover:border-foreground'
                      )}
                    >
                      {isDone && <IconCheckmark1 className="size-3 [&_path]:stroke-[3]" />}
                    </button>
                    {card.action === 'focusAreas' ? (
                      <button
                        type="button"
                        onClick={() => { setFocusModalOpen(true); setOpen(false) }}
                        className="flex-1 min-w-0 text-left"
                      >
                        {body}
                      </button>
                    ) : (
                      <Link
                        to={card.ctaHref}
                        onClick={() => toggleComplete(card.id)}
                        className="flex-1 min-w-0"
                      >
                        {body}
                      </Link>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={handleTriggerClick}
        aria-label={collapsed ? 'Get started' : (open ? 'Close get started panel' : 'Open get started panel')}
        className={cn(
          'w-full flex items-center gap-2.5 rounded-lg bg-foreground text-background shadow-sm hover:opacity-95 transition-opacity',
          collapsed ? 'justify-center p-2' : 'px-3 py-2'
        )}
      >
        <span className={cn(
          'inline-flex items-center justify-center rounded-md bg-white/10 shrink-0',
          collapsed ? 'size-6' : 'size-7'
        )}>
          <IconRocket className="size-4" />
        </span>
        {!collapsed && (
          <>
            <span className="flex-1 text-left min-w-0">
              <span className="block text-sm font-semibold leading-tight">Get started</span>
              <span className="block text-xs opacity-70 leading-tight">{percent}% complete</span>
            </span>
            <ChevronUp className={cn('size-4 transition-transform', open && 'rotate-180')} />
          </>
        )}
      </button>
    </div>
  )
}
