import { useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Settings-style left rail for sub-sections of a page. Replaces nested
 * horizontal tab strips when a page already lives inside a tab shell.
 *
 * @param {Object[]} items - [{ id, label, render: () => ReactNode }]
 * @param {string=}  defaultId - id to start active on (defaults to items[0].id)
 */
export function SubsectionRail({ items, defaultId, railWidth = 200 }) {
  const [activeId, setActiveId] = useState(defaultId ?? items[0]?.id)
  const active = items.find((i) => i.id === activeId) ?? items[0]

  return (
    <div className="flex flex-1 gap-6 min-h-0">
      <nav
        aria-label="Sub-sections"
        className="shrink-0 flex flex-col gap-0.5"
        style={{ width: railWidth }}
      >
        {items.map((item) => {
          const isActive = item.id === active?.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className={cn(
                'flex w-full items-center text-left rounded-md px-3 h-8 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#dffff2] text-[#0e5f5b]'
                  : 'text-foreground/80 hover:bg-muted hover:text-foreground'
              )}
            >
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="flex-1 min-w-0">
        {active?.render?.()}
      </div>
    </div>
  )
}
