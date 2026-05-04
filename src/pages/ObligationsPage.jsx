import { useMemo, useState } from 'react'
import { Plus, Search, Filter, FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import tenant from '@/config/tenant'

const OBLIGATIONS = tenant.pages.obligations?.items ?? []

const STATUS_STYLE = {
  Compliant:        'border-emerald-200 bg-emerald-50 text-emerald-700',
  'At Risk':        'border-amber-200 bg-amber-50 text-amber-700',
  'Non-compliant':  'border-destructive/30 bg-destructive/10 text-destructive',
}

const FREQ_STYLE = 'border-slate-200 bg-slate-50 text-slate-600'

const TODAY = new Date('2026-04-28')

function parseDue(due) {
  if (!due || due === 'Ongoing' || due === 'Overdue') return null
  // "30 Jun 2026"
  const months = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 }
  const [d, m, y] = due.split(' ')
  return new Date(Number(y), months[m], Number(d))
}

function daysUntil(due) {
  const date = parseDue(due)
  if (!date) return null
  return Math.round((date - TODAY) / (1000 * 60 * 60 * 24))
}

function isOverdue(o) {
  if (o.status === 'Non-compliant') return true
  if (o.dueDate === 'Overdue') return true
  const dt = daysUntil(o.dueDate)
  return dt != null && dt < 0
}

function isDueSoon(o) {
  const dt = daysUntil(o.dueDate)
  return dt != null && dt >= 0 && dt <= 30
}

const FILTERS = [
  { id: 'all',      label: 'All',           test: () => true },
  { id: 'due-soon', label: 'Due Soon',       test: isDueSoon },
  { id: 'overdue',  label: 'Overdue',        test: isOverdue },
]

export default function ObligationsPage() {
  const [filterId, setFilterId] = useState('all')
  const [regulatorFilter, setRegulatorFilter] = useState(null)
  const [search, setSearch] = useState('')

  const regulators = useMemo(() => {
    return Array.from(new Set(OBLIGATIONS.map(o => o.regulator))).sort()
  }, [])

  const visible = useMemo(() => {
    const activeFilter = FILTERS.find(f => f.id === filterId) ?? FILTERS[0]
    const q = search.trim().toLowerCase()
    return OBLIGATIONS
      .filter(activeFilter.test)
      .filter(o => !regulatorFilter || o.regulator === regulatorFilter)
      .filter(o => !q || o.name.toLowerCase().includes(q) || o.regulator.toLowerCase().includes(q) || o.source.toLowerCase().includes(q))
  }, [filterId, regulatorFilter, search])

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Obligations register</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Regulatory and contractual obligations across the organisation.
              </p>
            </div>
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" /> Add Obligation
            </Button>
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      'h-7 px-3 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5',
                      regulatorFilter
                        ? 'bg-foreground text-background'
                        : 'bg-muted text-muted-foreground hover:bg-muted/60',
                    )}
                  >
                    <Filter className="size-3" />
                    {regulatorFilter ? `By Regulator: ${regulatorFilter}` : 'By Regulator'}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setRegulatorFilter(null)}>All regulators</DropdownMenuItem>
                  {regulators.map(r => (
                    <DropdownMenuItem key={r} onClick={() => setRegulatorFilter(r)}>{r}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="relative w-72">
              <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search obligations…"
                className="h-8 pl-8 text-sm"
              />
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
              <p className="text-sm text-muted-foreground">No obligations match the current filters.</p>
            </div>
          ) : (
            <div className="border border-border/60 rounded bg-white overflow-hidden">
              <div className="grid grid-cols-12 gap-3 px-5 py-2 border-b border-border/60 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
                <div className="col-span-3">Obligation</div>
                <div className="col-span-2">Source / Regulator</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-1">Frequency</div>
                <div className="col-span-1">Owner</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Due</div>
                <div className="col-span-1 text-center">Evidence</div>
              </div>
              {visible.map(o => (
                <div key={o.id} className="grid grid-cols-12 gap-3 items-center px-5 py-3 border-b border-border/40 last:border-0 text-sm">
                  <div className="col-span-3 text-foreground font-medium truncate">{o.name}</div>
                  <div className="col-span-2 text-muted-foreground truncate">
                    <span className="text-foreground">{o.regulator}</span>
                    <span className="text-muted-foreground"> — {o.source}</span>
                  </div>
                  <div className="col-span-2">
                    <Badge variant="outline" className={`text-xs h-5 px-1.5 ${FREQ_STYLE}`}>{o.category}</Badge>
                  </div>
                  <div className="col-span-1 text-muted-foreground">{o.frequency}</div>
                  <div className="col-span-1 flex items-center gap-1.5 min-w-0">
                    <Avatar className="size-5 shrink-0">
                      <AvatarFallback className="text-[9px]">{o.owner.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground truncate">{o.owner.name.split(' ')[0]}</span>
                  </div>
                  <div className="col-span-1">
                    <Badge variant="outline" className={`text-xs h-5 px-1.5 ${STATUS_STYLE[o.status] ?? ''}`}>{o.status}</Badge>
                  </div>
                  <div className="col-span-1 text-muted-foreground">{o.dueDate}</div>
                  <div className="col-span-1 flex justify-center">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <FileCheck className="size-3.5" />
                      {o.evidenceCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
