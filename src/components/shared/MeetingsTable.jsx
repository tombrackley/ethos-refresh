import { ArrowUp, Video, MoreHorizontal, Eye, CalendarPlus, Pencil, X } from 'lucide-react'
import { IconCalendar1 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconCalendar1'
import { IconNumberedList } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconNumberedList'
import { IconFiles } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconFiles'
import { IconFileText } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconFileText'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import tenant from '@/config/tenant'
import { cn } from '@/lib/utils'

const MEETINGS = tenant.pages.govern.meetings ?? []
const BOARDS = tenant.pages.govern.boards ?? []
const BOARDS_COMMITTEES = tenant.pages.govern.boardsCommittees ?? []

const STATUS_DOT = {
  Scheduled:     'bg-slate-400',
  'In Progress': 'bg-emerald-500',
  Completed:     'bg-emerald-500',
}

const STATUS_RANK = { 'In Progress': 0, Scheduled: 1, Completed: 2 }

function boardName(boardId) {
  const fromBoards = BOARDS.find(b => b.id === boardId)
  if (fromBoards) return fromBoards.name
  const fromBC = BOARDS_COMMITTEES.find(b => b.id === boardId)
  if (fromBC) return fromBC.name
  return boardId
}

function DocTile({ icon: Icon, ready, onClick, label }) {
  const tile = ready ? (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-6 items-center justify-center rounded-[6px] bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors"
    >
      <Icon className="size-4" />
    </button>
  ) : (
    <span
      aria-label={`${label} not ready`}
      className="inline-flex size-6 items-center justify-center rounded-[6px] bg-gray-100 text-muted-foreground/60"
    >
      <span className="block w-2.5 h-px bg-current" />
    </span>
  )
  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>{tile}</TooltipTrigger>
      <TooltipContent side="top">
        <p className="text-xs">{ready ? label : `${label} — not ready`}</p>
      </TooltipContent>
    </Tooltip>
  )
}

function Pill({ children, dotClass, dotPulse = false, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 h-6 px-2 rounded-full border border-border bg-white text-xs font-medium text-foreground',
        className,
      )}
    >
      {dotClass && (
        <span className="relative flex items-center justify-center size-1.5">
          {dotPulse && <span className={cn('absolute inset-0 rounded-full opacity-60 animate-ping', dotClass)} />}
          <span className={cn('relative size-1.5 rounded-full', dotClass)} />
        </span>
      )}
      {children}
    </span>
  )
}

export function MeetingsTable({ boardId, filter, onRowClick }) {
  const rows = MEETINGS
    .filter(m => !boardId || m.boardId === boardId)
    .filter(m => !filter || filter(m))
    .slice()
    .sort((a, b) => (STATUS_RANK[a.status] ?? 9) - (STATUS_RANK[b.status] ?? 9))

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">No meetings.</p>
      </div>
    )
  }

  const showBoard = !boardId

  return (
    <div className="text-sm">
      <div className="grid items-center gap-4 px-4 py-3 text-[13px] font-medium text-muted-foreground border-b border-border/60 grid-cols-[2.5fr_1.3fr_1fr_minmax(0,180px)_32px]">
        <div className="inline-flex items-center gap-1">
          Meeting <ArrowUp className="size-3" />
        </div>
        <div>Date / time</div>
        <div>Status</div>
        <div>Resources</div>
        <div />
      </div>
      <div>
        {rows.map((m) => {
          const isLive = m.status === 'In Progress'
          return (
            <div
              key={m.id}
              onClick={onRowClick ? () => onRowClick(m) : undefined}
              className={cn(
                'group grid items-center gap-4 px-4 py-4 border-b border-border/60 last:border-0',
                'grid-cols-[2.5fr_1.3fr_1fr_minmax(0,180px)_32px]',
                isLive && 'bg-emerald-50/50',
                onRowClick && 'cursor-pointer hover:bg-muted/20 transition-colors',
                isLive && onRowClick && 'hover:bg-emerald-50',
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-6 rounded-[6px] flex items-center justify-center shrink-0 bg-gray-100">
                  <IconCalendar1 className="size-3.5 text-[#151D2B]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-foreground font-medium truncate">{m.name}</p>
                    {isLive && (
                      <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-700 shrink-0">
                        <span className="relative flex items-center justify-center size-1.5">
                          <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-60 animate-ping" />
                          <span className="relative size-1.5 rounded-full bg-emerald-500" />
                        </span>
                        Live
                      </span>
                    )}
                  </div>
                  {showBoard && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{boardName(m.boardId)}</p>
                  )}
                </div>
              </div>
              <div className="text-foreground/80">{m.dateTime}</div>
              <div>
                {isLive ? (
                  <Button
                    size="sm"
                    className="h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={(e) => { e.stopPropagation(); onRowClick?.(m) }}
                  >
                    <Video className="size-3.5" /> Join meeting
                  </Button>
                ) : (
                  <Pill dotClass={STATUS_DOT[m.status]}>{m.status}</Pill>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <DocTile
                  icon={IconNumberedList}
                  ready={!!m.agenda}
                  label="Agenda"
                  onClick={(e) => { e.stopPropagation(); onRowClick?.(m) }}
                />
                <DocTile
                  icon={IconFiles}
                  ready={!!m.boardPack}
                  label="Board Pack"
                  onClick={(e) => { e.stopPropagation(); onRowClick?.(m) }}
                />
                <DocTile
                  icon={IconFileText}
                  ready={m.minutes === 'Final'}
                  label="Minutes"
                  onClick={(e) => { e.stopPropagation(); onRowClick?.(m) }}
                />
              </div>

              <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label="Meeting actions"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center size-7 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem className="gap-2 text-sm" onSelect={() => onRowClick?.(m)}>
                      <Eye className="size-4" /> View meeting
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-sm">
                      <CalendarPlus className="size-4" /> Add to calendar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-sm">
                      <Pencil className="size-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-sm text-destructive focus:text-destructive">
                      <X className="size-4" /> Cancel event
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
