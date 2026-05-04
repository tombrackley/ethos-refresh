import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, Table as TableIcon, LayoutGrid, AlertCircle, AlertTriangle, Filter, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { ViewToggle } from '@/components/shared/ViewToggle'
import { BoardPapersDirectorView } from '@/components/shared/BoardPapersDirectorView'
import { PackAssemblyView } from '@/components/shared/PackAssemblyView'
import { IntegrationStatusBanner } from '@/components/shared/IntegrationStatusBanner'
import { cn } from '@/lib/utils'
import tenant from '@/config/tenant'

const PAPERS = tenant.pages.govern.boardPapers ?? []
const MEETINGS = tenant.pages.govern.meetings ?? []
const BOARDS = tenant.pages.govern.boards ?? []
const BOARDS_COMMITTEES = tenant.pages.govern.boardsCommittees ?? []

const FILTER_BOARDS = [
  { id: null, name: 'All boards' },
  ...BOARDS.map(b => ({ id: b.id, name: b.name })),
  ...BOARDS_COMMITTEES.filter(b => !BOARDS.find(x => x.id === b.id)).map(b => ({ id: b.id, name: b.name })),
]

const STAGE_STYLE = {
  Draft:           'border-slate-200 bg-slate-50 text-slate-700',
  Submitted:       'border-blue-200 bg-blue-50 text-blue-700',
  'CoSec Review':  'border-amber-200 bg-amber-50 text-amber-700',
  Approved:        'border-emerald-200 bg-emerald-50 text-emerald-700',
  'In Pack':       'border-brand-200 bg-brand-50 text-brand-800',
}

const STAGE_ORDER = ['Draft', 'Submitted', 'CoSec Review', 'Approved', 'In Pack']

const GROUP_OPTIONS = [
  { value: 'all',     label: 'All' },
  { value: 'meeting', label: 'By Meeting' },
  { value: 'board',   label: 'By Board' },
  { value: 'stage',   label: 'By Stage' },
]

function meetingMeta(id) {
  return MEETINGS.find(m => m.id === id) ?? null
}

function boardName(id) {
  return BOARDS.find(b => b.id === id)?.name
    ?? BOARDS_COMMITTEES.find(b => b.id === id)?.name
    ?? id
}

function bucketLabelFor(groupBy, key) {
  if (groupBy === 'meeting') {
    const m = meetingMeta(key)
    if (!m) return key
    return `${m.name} · ${m.dateTime}`
  }
  if (groupBy === 'board') return boardName(key)
  return key
}

function bucketRows(papers, groupBy) {
  if (groupBy === 'all') return [{ key: '__all__', rows: papers }]

  const map = new Map()
  for (const p of papers) {
    const key = groupBy === 'meeting' ? p.meetingId
              : groupBy === 'board'   ? p.boardId
              : /* stage */             p.stage
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(p)
  }

  if (groupBy === 'stage') {
    return STAGE_ORDER
      .filter(s => map.has(s))
      .map(s => ({ key: s, rows: map.get(s) }))
  }

  // Sort by bucket label
  return [...map.entries()]
    .map(([key, rows]) => ({ key, rows }))
    .sort((a, b) => bucketLabelFor(groupBy, a.key).localeCompare(bucketLabelFor(groupBy, b.key)))
}

function HeaderRow() {
  return (
    <div className="grid grid-cols-12 gap-3 px-5 py-2 border-b border-border/60 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
      <div className="col-span-3">Paper</div>
      <div className="col-span-2">Meeting</div>
      <div className="col-span-2">Owner</div>
      <div className="col-span-1">Stage</div>
      <div className="col-span-1">Days</div>
      <div className="col-span-3">Blocking</div>
    </div>
  )
}

function PaperRow({ p, onFlagClick }) {
  const m = meetingMeta(p.meetingId)
  return (
    <div
      className={cn(
        'grid grid-cols-12 gap-3 items-center px-5 py-3 border-b border-border/40 last:border-0 text-sm',
        p.flag && 'bg-amber-50/50 hover:bg-amber-50/70 transition-colors',
      )}
    >
      <div className="col-span-3 min-w-0">
        <p className="text-foreground font-medium truncate">{p.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{boardName(p.boardId)}</p>
      </div>
      <div className="col-span-2 min-w-0">
        <p className="text-foreground truncate">{m?.name ?? p.meetingId}</p>
        {m?.dateTime && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{m.dateTime}</p>
        )}
      </div>
      <div className="col-span-2 flex items-center gap-2 min-w-0">
        <Avatar className="size-6 shrink-0">
          <AvatarFallback className="text-[10px]">{p.responsibleOfficer.initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-foreground truncate">{p.responsibleOfficer.name}</p>
          {p.responsibleOfficer.role && (
            <p className="text-[11px] text-muted-foreground truncate">{p.responsibleOfficer.role}</p>
          )}
        </div>
      </div>
      <div className="col-span-1">
        <Badge variant="outline" className={cn('text-xs h-5 px-1.5', STAGE_STYLE[p.stage])}>{p.stage}</Badge>
      </div>
      <div className="col-span-1 text-muted-foreground">{p.daysAtStage}d</div>
      <div className="col-span-3 min-w-0">
        {p.flag?.kind === 'warning' ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onFlagClick?.(p) }}
            className="inline-flex items-center gap-1 rounded border border-amber-300 bg-amber-50 px-2 h-5 text-[11px] text-amber-800 hover:bg-amber-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            <AlertTriangle className="size-3" />
            {p.flag.message}
          </button>
        ) : p.blocked ? (
          <span className="inline-flex items-center gap-1 text-xs text-destructive" title="Blocked">
            <AlertCircle className="size-3.5" />
          </span>
        ) : null}
      </div>
    </div>
  )
}

function AdminTable({ groupBy, boardFilter, onFlagClick }) {
  const filteredPapers = useMemo(
    () => (boardFilter ? PAPERS.filter(p => p.boardId === boardFilter) : PAPERS),
    [boardFilter],
  )
  const buckets = useMemo(() => bucketRows(filteredPapers, groupBy), [filteredPapers, groupBy])

  if (filteredPapers.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">No papers.</p>
      </div>
    )
  }

  return (
    <div className="border border-border/60 rounded bg-white overflow-hidden">
      <HeaderRow />
      <div>
        {buckets.map(bucket => (
          <div key={bucket.key}>
            {groupBy !== 'all' && (
              <div className="flex items-center gap-2 px-5 py-1.5 bg-muted/40 border-b border-border/40">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {bucketLabelFor(groupBy, bucket.key)}
                </span>
                <Badge variant="outline" className="h-4 px-1.5 text-[10px] text-muted-foreground">
                  {bucket.rows.length}
                </Badge>
              </div>
            )}
            {bucket.rows.map(p => <PaperRow key={p.id} p={p} onFlagClick={onFlagClick} />)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BoardPapersPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const meetingParam = searchParams.get('meeting')
  const [view, setView] = useState('assembly')
  const [groupBy, setGroupBy] = useState('all')
  const [boardFilter, setBoardFilter] = useState(null)

  const activeBoardLabel = FILTER_BOARDS.find(b => b.id === boardFilter)?.name ?? 'All boards'
  const handleFlagClick = (p) => navigate(`/govern/board-papers/${p.id}`)

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto">
        <IntegrationStatusBanner
          name="Diligent"
          message="packs sync to your director portal automatically when you push from each meeting."
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Board papers</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Compile board packs from each meeting's agenda, track papers, and push to Diligent.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ViewToggle
                value={view}
                onChange={setView}
                options={[
                  { value: 'assembly', label: 'Board Pack Compiler', icon: Layers },
                  { value: 'director', label: 'Director',            icon: LayoutGrid },
                  { value: 'admin',    label: 'Admin',               icon: TableIcon },
                ]}
              />
              <Button size="sm" className="gap-1.5">
                <Plus className="size-4" /> Assemble Pack
              </Button>
            </div>
          </div>

          {view !== 'director' && (
            <div className="flex items-center justify-between gap-3">
              {view === 'admin' ? (
                <div className="flex items-center gap-1 border border-border/60 bg-white rounded-md w-fit p-0.5">
                  {GROUP_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setGroupBy(opt.value)}
                      className={cn(
                        'px-3 h-7 text-xs font-medium rounded transition-colors',
                        groupBy === opt.value
                          ? 'bg-muted text-foreground'
                          : 'text-muted-foreground hover:bg-muted/40',
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : <div />}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Filter className="size-3.5" />
                    {activeBoardLabel}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {FILTER_BOARDS.map(b => (
                    <DropdownMenuItem key={b.id ?? 'all'} onClick={() => setBoardFilter(b.id)}>
                      {b.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {view === 'assembly' && <PackAssemblyView boardId={boardFilter} meetingId={meetingParam} />}
          {view === 'director' && <BoardPapersDirectorView boardId={boardFilter} />}
          {view === 'admin' && <AdminTable groupBy={groupBy} boardFilter={boardFilter} onFlagClick={handleFlagClick} />}

          </div>
        </div>
      </div>
    </div>
  )
}
