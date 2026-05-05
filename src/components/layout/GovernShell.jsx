import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { ChevronDown, Plus, Settings } from 'lucide-react'
import { IconGlobe } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconGlobe'
import { IconUserGroup } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconUserGroup'
import { cn } from '@/lib/utils'
import tenant from '@/config/tenant'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

const TABS = [
  { label: 'Overview',    to: '/govern',                   end: true },
  { label: 'Meetings',    to: '/govern/meetings' },
  { label: 'Papers',      to: '/govern/board-papers' },
  { label: 'Policies',    to: '/govern/policies' },
  { label: 'Delegations', to: '/govern/delegations' },
  { label: 'Register',    to: '/govern/company-register' },
]

const ALL_BOARDS_OPTION = { id: '__all__', name: 'All boards' }

// flag-icons supports `uk` as an alias for `gb` so any 2-letter ISO code works.
function BoardIcon({ id }) {
  if (id === '__all__') return <IconGlobe className="size-4 text-muted-foreground shrink-0" />
  if (typeof id === 'string' && /^[a-z]{2}$/.test(id)) {
    return (
      <span
        className={`fi fi-${id} shrink-0 rounded-[2px] block`}
        style={{ width: '20px', height: '15px', backgroundSize: 'cover' }}
      />
    )
  }
  return <IconUserGroup className="size-4 text-muted-foreground shrink-0" />
}

function BoardSelector({ selected, onSelect, options, minimal = false }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center text-sm font-medium text-foreground transition-colors shrink-0',
            minimal
              ? 'gap-2 px-3 py-2.5 border-b-2 border-transparent -mb-px hover:text-foreground/80'
              : 'h-10 min-w-[220px] gap-2.5 rounded-lg border border-border bg-white pl-3.5 pr-2.5 hover:bg-accent'
          )}
        >
          <BoardIcon id={selected.id} />
          <span className={cn('text-left', !minimal && 'flex-1')}>{selected.name}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[260px]">
        {options.map((b) => (
          <DropdownMenuItem
            key={b.id}
            onClick={() => onSelect(b)}
            className={cn('gap-2.5 text-sm', selected.id === b.id && 'bg-accent font-medium')}
          >
            <BoardIcon id={b.id} />
            <span>{b.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ScheduleMeetingButton() {
  return (
    <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
      <Plus className="size-4" /> Schedule Meeting
    </Button>
  )
}

export function GovernShell() {
  const { pathname } = useLocation()
  const boards = tenant?.pages?.govern?.boards ?? []
  const options = [ALL_BOARDS_OPTION, ...boards]
  const [selectedBoard, setSelectedBoard] = useState(ALL_BOARDS_OPTION)

  const onMeetings = pathname === '/govern/meetings'

  // Detect when the sticky tab row is "stuck" so we can collapse the actions row inline.
  const scrollRef = useRef(null)
  const sentinelRef = useRef(null)
  const [isStuck, setIsStuck] = useState(false)

  useEffect(() => {
    const sentinel = sentinelRef.current
    const root = scrollRef.current
    if (!sentinel || !root) return
    const obs = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { root, threshold: 0 }
    )
    obs.observe(sentinel)
    return () => obs.disconnect()
  }, [])

  const showActions = boards.length > 0 || onMeetings

  return (
    <div ref={scrollRef} className="flex flex-1 flex-col overflow-auto bg-white">
      <div className="shrink-0 px-6 pt-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] leading-[30px] tracking-[-1.12px] font-normal text-[#0A0A0A]">Govern</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Boards, meetings, papers and policies — your governance backbone.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex h-8 items-center gap-2 rounded-[10px] bg-white border border-border px-3">
            <img src="/diligent-logo.jpeg" alt="Diligent" className="size-4 rounded-sm object-cover" />
            <span className="text-xs font-medium text-foreground">Connected</span>
          </div>
          <Button size="sm" variant="outline" className="h-8 gap-1.5">
            <Settings className="size-3.5" />
            Settings
          </Button>
        </div>
      </div>

      {/* Pre-stuck row: actions sit above the tabs */}
      {showActions && !isStuck && (
        <div className="shrink-0 px-6 pt-4 flex items-center justify-between gap-3">
          {boards.length > 0 ? (
            <BoardSelector selected={selectedBoard} onSelect={setSelectedBoard} options={options} />
          ) : <span />}
          {onMeetings && <ScheduleMeetingButton />}
        </div>
      )}

      {/* Sentinel: when this scrolls past the top of the scroll container, isStuck flips on */}
      <div ref={sentinelRef} className="h-px shrink-0" />

      <div className="sticky top-0 z-20 bg-white shrink-0 mt-5">
        <div className="px-6 h-11 flex items-end gap-3 border-b border-border">
          {isStuck && boards.length > 0 && (
            <>
              <BoardSelector
                selected={selectedBoard}
                onSelect={setSelectedBoard}
                options={options}
                minimal
              />
              <div className="self-stretch w-px bg-border my-3" />
            </>
          )}

          <nav className="flex items-center gap-1 overflow-x-auto -mb-px flex-1 min-w-0">
            {TABS.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap px-3 py-2.5 text-sm font-medium border-b-2 transition-colors',
                    isActive
                      ? 'border-foreground text-foreground'
                      : 'border-transparent text-foreground/80 hover:text-foreground hover:border-border'
                  )
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>

          {isStuck && onMeetings && <ScheduleMeetingButton />}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <Outlet />
      </div>
    </div>
  )
}
