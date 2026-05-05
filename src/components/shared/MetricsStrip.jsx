import { Minus } from 'lucide-react'
import { IconChevronTriangleUpSmall } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconChevronTriangleUpSmall'
import { IconChevronTriangleDownSmall } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconChevronTriangleDownSmall'
import { cn } from '@/lib/utils'

const COL_CLASS = {
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
}

/**
 * Comply-style metric strip — full-bleed white row with vertical dividers,
 * label + large value + "X last month" + delta chip per tile.
 *
 * Item shape: { label, value, prev?, delta?, dir: 'up'|'down'|'flat', invert?, primary? }
 *   - prev:    "82% last month" (the leading token is rendered darker)
 *   - delta:   "+3" / "-1" / "0.0%" — rendered in a coloured chip
 *   - dir:     direction; combined with `invert` to decide chip colour
 *   - invert:  flip semantics (e.g. for "Open Incidents" — going down is good)
 *   - primary: dark teal value tone for the lead tile
 */
export function MetricsStrip({ items }) {
  const cols = COL_CLASS[items.length] ?? 'grid-cols-4'
  return (
    <div
      className={cn(
        'grid bg-white border-y border-[rgba(229,229,229,0.6)] divide-x divide-[rgba(229,229,229,0.6)]',
        cols
      )}
    >
      {items.map((k) => {
        const positive = k.dir === 'up' ? !k.invert : k.dir === 'down' ? k.invert : null
        const isFlat = k.dir === 'flat' || /^[+-]?0(\.0+)?%?$/.test(k.delta || '')
        return (
          <div key={k.label} className="h-[118px] px-5 pt-4 flex flex-col gap-2">
            <p className="text-xs font-medium text-[#8E9BAD] leading-4">{k.label}</p>
            <p
              className={cn(
                'text-[28px] leading-9 font-normal tracking-[-0.02em]',
                k.primary ? 'text-[#002E2D]' : 'text-[#0A0A0A]'
              )}
            >
              {k.value}
            </p>
            <div className="flex items-center gap-2 text-xs leading-4">
              {k.prev && (
                <p className="font-medium text-[rgba(142,155,173,0.81)]">
                  <span className="text-[#0A0A0A]">{k.prev.split(' ')[0]}</span>{' '}
                  <span>{k.prev.split(' ').slice(1).join(' ')}</span>
                </p>
              )}
              {k.delta && (
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 h-[18px] px-1 rounded-[4px] font-semibold text-[11px]',
                    isFlat || positive
                      ? 'bg-[#F3FDFA] text-[#4F7D6F]'
                      : 'bg-[#FDF3F6] text-[#7D4F6B]'
                  )}
                >
                  {isFlat ? (
                    <Minus className="size-2" />
                  ) : positive ? (
                    <IconChevronTriangleUpSmall className="size-3" />
                  ) : (
                    <IconChevronTriangleDownSmall className="size-3" />
                  )}
                  {k.delta.replace(/^[+-]/, '')}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
