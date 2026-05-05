import { useState } from 'react'
import { Plus, List, Columns3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ViewToggle } from '@/components/shared/ViewToggle'
import { StagePips } from '@/components/shared/StagePips'
import PolicyUpliftOverlay from '@/components/PolicyUpliftOverlay'
import { cn } from '@/lib/utils'
import tenant from '@/config/tenant'

const POLICIES = tenant.pages.govern.policies ?? []
const STAGES = ['Identify', 'Draft', 'Review', 'Approve', 'Publish']

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
  const [upliftOpen, setUpliftOpen] = useState(false)

  const activeFilter = FILTERS.find(f => f.id === filterId) ?? FILTERS[0]
  const filtered = POLICIES.filter(p => activeFilter.test(p))
  const sorted = [...filtered].sort((a, b) => (STATUS_RANK[a.status] ?? 9) - (STATUS_RANK[b.status] ?? 9))
  const showRegulator = POLICIES.some(p => p.regulator)

  return (
    <div className="flex flex-1">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              {FILTERS.map(f => {
                const active = filterId === f.id
                const count = POLICIES.filter(f.test).length
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilterId(f.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 h-8 border transition-colors',
                      active
                        ? 'bg-[#dffff2] border-[rgba(14,95,91,0.5)]'
                        : 'bg-muted/60 hover:bg-muted border-transparent',
                    )}
                  >
                    <span className={cn(
                      'text-sm font-medium tracking-[-0.28px]',
                      active ? 'text-[#0e5f5b]' : 'text-foreground',
                    )}>
                      {f.label}
                    </span>
                    <span className={cn(
                      'text-xs',
                      active ? 'text-[rgba(14,95,91,0.5)]' : 'text-muted-foreground',
                    )}>
                      {count}
                    </span>
                  </button>
                )
              })}
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
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setUpliftOpen(true)}>
                <Plus className="size-4" /> Initiate Uplift
              </Button>
            </div>
          </div>

          {view === 'priority' ? <PriorityTable policies={sorted} showRegulator={showRegulator} /> : <StageBoard policies={filtered} />}

        </div>
      </div>

      <PolicyUpliftOverlay open={upliftOpen} onClose={() => setUpliftOpen(false)} />
    </div>
  )
}
