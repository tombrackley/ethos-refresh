import { useState } from 'react'
import { Plus, List, Columns3, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { ViewToggle } from '@/components/shared/ViewToggle'
import { StagePips } from '@/components/shared/StagePips'
import PolicyUpliftOverlay from '@/components/PolicyUpliftOverlay'
import { cn } from '@/lib/utils'
import tenant from '@/config/tenant'

const POLICIES = tenant.pages.govern.policies ?? []
const BOARDS = tenant.pages.govern.boards ?? []
const BOARDS_COMMITTEES = tenant.pages.govern.boardsCommittees ?? []
const STAGES = ['Identify', 'Draft', 'Review', 'Approve', 'Publish']

const FILTER_BOARDS = [
  { id: null, name: 'All boards' },
  ...BOARDS.map(b => ({ id: b.id, name: b.name })),
  ...BOARDS_COMMITTEES.filter(b => !BOARDS.find(x => x.id === b.id)).map(b => ({ id: b.id, name: b.name })),
]

// A policy with no boardId is treated as group-wide and visible under every board filter.
function matchesBoard(policy, boardId) {
  if (!boardId) return true
  if (!policy.boardId || policy.boardId === 'all') return true
  return policy.boardId === boardId
}

const STATUS_STYLE = {
  'On Track': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'At Risk':  'border-amber-200 bg-amber-50 text-amber-700',
  Blocked:    'border-destructive/30 bg-destructive/10 text-destructive',
  Overdue:    'border-destructive/30 bg-destructive/10 text-destructive',
}

const RAG_DOT = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-400',
  red:   'bg-destructive',
}

const STATUS_RANK = { Overdue: 0, Blocked: 1, 'At Risk': 2, 'On Track': 3 }

const FILTERS = [
  { id: 'all',         label: 'All',         test: () => true },
  { id: 'in-progress', label: 'In Progress', test: p => p.stage !== 'Publish' },
  { id: 'overdue',     label: 'Overdue',     test: p => p.status === 'Overdue' || p.status === 'Blocked' },
  { id: 'completed',   label: 'Completed',   test: p => p.stage === 'Publish' },
]

function PriorityTable({ policies, showRegulator }) {
  if (policies.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">No policies match this filter.</p>
      </div>
    )
  }
  const policySpan = showRegulator ? 'col-span-3' : 'col-span-4'
  return (
    <div className="border border-border/60 rounded bg-white overflow-hidden">
      <div className="grid grid-cols-12 gap-3 px-5 py-2 border-b border-border/60 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
        <div className={policySpan}>Policy</div>
        <div className="col-span-2">Owner</div>
        {showRegulator && <div className="col-span-1">Regulator</div>}
        <div className="col-span-2">Stage</div>
        <div className="col-span-1">Days</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1 text-center">RAG</div>
      </div>
      <div>
        {policies.map(p => (
          <div key={p.id} className="grid grid-cols-12 gap-3 items-center px-5 py-3 border-b border-border/40 last:border-0 text-sm">
            <div className={cn(policySpan, 'min-w-0')}>
              <p className="text-foreground font-medium truncate">{p.name}</p>
              {p.blockingParty ? (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.blockingParty}</p>
              ) : p.dependsOn ? (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">Depends on: {p.dependsOn}</p>
              ) : null}
            </div>
            <div className="col-span-2 flex items-center gap-2 min-w-0">
              <Avatar className="size-6 shrink-0">
                <AvatarFallback className="text-[10px]">{p.owner.initials}</AvatarFallback>
              </Avatar>
              <span className="text-foreground truncate">{p.owner.name}</span>
            </div>
            {showRegulator && (
              <div className="col-span-1 min-w-0">
                {p.regulator ? (
                  <Badge variant="outline" className="text-xs h-5 px-1.5">{p.regulator}</Badge>
                ) : (
                  <span className="text-muted-foreground/40 text-xs">—</span>
                )}
              </div>
            )}
            <div className="col-span-2">
              <StagePips stages={STAGES} currentStage={p.stage} rag={p.rag} />
            </div>
            <div className="col-span-1 text-muted-foreground">{p.daysAtStage}d</div>
            <div className="col-span-2">
              <Badge variant="outline" className={cn('text-xs h-5 px-1.5', STATUS_STYLE[p.status])}>{p.status}</Badge>
            </div>
            <div className="col-span-1 flex justify-center">
              <span className={`size-2.5 rounded-full ${RAG_DOT[p.rag] ?? 'bg-muted'}`} title={p.rag} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StageBoard({ policies }) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {STAGES.map(stage => {
        const items = policies.filter(p => p.stage === stage)
        return (
          <div key={stage} className="rounded-lg border border-border/60 bg-muted/20 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 bg-white/60">
              <p className="text-xs font-medium text-foreground">{stage}</p>
              <span className="text-xs text-muted-foreground">{items.length}</span>
            </div>
            <div className="p-2 space-y-2 min-h-[120px]">
              {items.length === 0 ? (
                <p className="text-xs text-muted-foreground/60 text-center py-3">—</p>
              ) : items.map(p => (
                <div key={p.id} className="rounded-md border border-border/60 bg-white p-2.5 space-y-2">
                  <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">{p.name}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Avatar className="size-5 shrink-0">
                        <AvatarFallback className="text-[9px]">{p.owner.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground truncate">{p.daysAtStage}d</span>
                    </div>
                    <span className={`size-2 rounded-full shrink-0 ${RAG_DOT[p.rag] ?? 'bg-muted'}`} title={p.rag} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function PoliciesProceduresPage() {
  const [view, setView] = useState('priority')
  const [filterId, setFilterId] = useState('all')
  const [boardFilter, setBoardFilter] = useState(null)
  const [upliftOpen, setUpliftOpen] = useState(false)

  const activeFilter = FILTERS.find(f => f.id === filterId) ?? FILTERS[0]
  const activeBoardLabel = FILTER_BOARDS.find(b => b.id === boardFilter)?.name ?? 'All boards'
  const filtered = POLICIES.filter(p => activeFilter.test(p) && matchesBoard(p, boardFilter))
  const sorted = [...filtered].sort((a, b) => (STATUS_RANK[a.status] ?? 9) - (STATUS_RANK[b.status] ?? 9))
  const showRegulator = POLICIES.some(p => p.regulator)

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Policies &amp; procedures</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Policy register with lifecycle stage, RAG status, and current blockers.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ViewToggle
                value={view}
                onChange={setView}
                options={[
                  { value: 'priority', label: 'Priority', icon: List },
                  { value: 'board',    label: 'Stages',   icon: Columns3 },
                ]}
              />
              <Button size="sm" className="gap-1.5" onClick={() => setUpliftOpen(true)}>
                <Plus className="size-4" /> Initiate Uplift
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterId(f.id)}
                  className={cn(
                    'h-7 px-3 rounded-md text-xs font-medium transition-colors',
                    filterId === f.id
                      ? 'bg-foreground text-background'
                      : 'bg-muted text-muted-foreground hover:bg-muted/60',
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
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

          {view === 'priority' ? <PriorityTable policies={sorted} showRegulator={showRegulator} /> : <StageBoard policies={filtered} />}

        </div>
      </div>

      <PolicyUpliftOverlay open={upliftOpen} onClose={() => setUpliftOpen(false)} />
    </div>
  )
}
