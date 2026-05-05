import { useState } from 'react'
import tenant from '@/config/tenant'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { AiSummaryBar } from '@/components/shared/AiSummaryBar'
import { MetricsStrip } from '@/components/shared/MetricsStrip'
import Feature from '@/components/Feature'
import {
  TrendingUp, Plus, Search, Filter, CalendarDays, AlertTriangle,
  Zap, Lightbulb, ListChecks, X,
} from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const t = tenant.pages.work

const MATTER_STATS   = t.matterStats
const PERFORMANCE    = t.performance
const WORK_MATTERS   = t.workMatters
const WORK_AI_POINTS = t.aiPoints
const WORK_AI_ACTIONS = t.aiActions
const TEAM_WORKLOAD  = t.teamWorkload ?? []
const WORK_DEADLINES = t.upcomingDeadlines ?? []

// Derived KPIs (spec)
const ACTIVE_MATTER_COUNT  = WORK_MATTERS.filter(m => m.status !== 'Complete' && m.status !== 'On Hold').length
const TEAM_UTILISATION_AVG = TEAM_WORKLOAD.length
  ? Math.round(TEAM_WORKLOAD.reduce((n, p) => n + p.utilisation, 0) / TEAM_WORKLOAD.length)
  : 0
const DUE_THIS_WEEK_COUNT  = WORK_DEADLINES.filter(d => {
  const m = { JAN:0, FEB:1, MAR:2, APR:3, MAY:4, JUN:5, JUL:6, AUG:7, SEP:8, OCT:9, NOV:10, DEC:11 }[d.month]
  if (m == null) return false
  const date = new Date(Number(d.year), m, Number(d.day))
  const today = new Date('2026-04-28')
  const diff = (date - today) / (1000 * 60 * 60 * 24)
  return diff >= 0 && diff <= 7
}).length
const OVERDUE_COUNT = WORK_MATTERS.filter(m => m.status === 'Behind').length

const KPI_TILES = [
  { label: 'Active Matters',        value: String(ACTIVE_MATTER_COUNT),     prev: '45 last month',  delta: '+2',   dir: 'up', primary: true },
  { label: 'Team Utilisation',      value: `${TEAM_UTILISATION_AVG}%`,      prev: '74.8% last month', delta: '+3.2%', dir: 'up' },
  { label: 'Matters Due This Week', value: String(DUE_THIS_WEEK_COUNT),     prev: '8 last month',   delta: '-2',   dir: 'down', invert: true },
  { label: 'Overdue',               value: String(OVERDUE_COUNT),           prev: '4 last month',   delta: '-1',   dir: 'down', invert: true },
]

const DEADLINE_DATE_STYLE = {
  high:   'bg-amber-50 border border-amber-200',
  medium: 'bg-muted',
  low:    'bg-muted',
}
const DEADLINE_TEXT_STYLE = {
  high:   { month: 'text-amber-600',        day: 'text-amber-700'   },
  medium: { month: 'text-muted-foreground', day: 'text-foreground'  },
  low:    { month: 'text-muted-foreground', day: 'text-foreground'  },
}

const STATUS_FILTERS = ['All', 'On Track', 'At Risk', 'Behind', 'On Hold', 'Complete']

// ─── Sub-components ───────────────────────────────────────────────────────────

function DonutChart() {
  const r = 66, cx = 84, cy = 84, strokeW = 15
  const circ = 2 * Math.PI * r
  const GAP = 1
  let acc = 0

  return (
    <svg width="168" height="168" viewBox="0 0 168 168" className="shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="white" strokeWidth={strokeW} />
      {MATTER_STATS.breakdown.map((seg, i) => {
        const segLen = Math.max(0, (seg.pct / 100) * circ - GAP)
        const offset = -(acc / 100) * circ + GAP / 2
        acc += seg.pct
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.hex}
            strokeWidth={strokeW}
            strokeDasharray={`${segLen} ${circ - segLen}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="butt"
          />
        )
      })}
      <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="middle" fontSize="26" fontWeight="600" style={{ fill: 'var(--foreground)' }}>
        {MATTER_STATS.total}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="middle" fontSize="8" letterSpacing="1.5" style={{ fill: 'var(--muted-foreground)' }}>
        {t.donutLabel}
      </text>
    </svg>
  )
}

const STATUS_STYLES = {
  'On Track': { dot: 'bg-emerald-500', text: 'text-muted-foreground', pill: 'bg-muted/60 border-border'      },
  'At Risk':  { dot: 'bg-amber-400',   text: 'text-amber-700',        pill: 'bg-amber-50 border-amber-200'   },
  'Behind':   { dot: 'bg-red-400',     text: 'text-red-600',          pill: 'bg-red-50 border-red-200'       },
  'On Hold':  { dot: 'bg-slate-300',   text: 'text-muted-foreground', pill: 'bg-muted/60 border-border'      },
  'Complete': { dot: 'bg-emerald-400', text: 'text-muted-foreground', pill: 'bg-muted/60 border-border'      },
}

const FILTER_DOT = {
  'On Track': 'bg-emerald-500',
  'At Risk':  'bg-amber-400',
  'Behind':   'bg-red-500',
  'On Hold':  'bg-slate-400',
  'Complete': 'bg-emerald-500',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function WorkAiPanel({ onClose }) {
  return (
    <div className="flex flex-col h-full border-l border-border/60 bg-background">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-800 text-white">
            <Zap className="size-3" />
          </div>
          <span className="text-sm font-semibold">Ethos AI</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Matter Insights */}
        <div className="px-4 py-4 border-b border-border/60">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp className="size-3.5 text-brand-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Matter Insights</span>
          </div>
          <ul className="space-y-2.5">
            {WORK_AI_POINTS.map((pt, i) => (
              <li key={i} className="flex gap-2 text-xs text-foreground/80 leading-relaxed">
                <span className="mt-0.5 shrink-0 text-muted-foreground">›</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* At Risk */}
        <div className="px-4 py-4 border-b border-border/60">
          <div className="flex items-center gap-1.5 mb-3">
            <AlertTriangle className="size-3.5 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Needs Attention</span>
          </div>
          <ul className="space-y-2">
            {[
              { ref: 'M-1060', name: 'Baker v. Hall Settlement',   note: 'Overdue — Feb 22 deadline passed'       },
              { ref: 'M-1045', name: 'Henderson Merger',           note: 'At risk — escalation review required'   },
              { ref: 'M-0998', name: 'Rialto IP Dispute',          note: 'At risk — lead KL to review'            },
            ].map(item => (
              <li key={item.ref} className="text-xs">
                <span className="font-medium text-foreground">{item.name}</span>
                <span className="text-muted-foreground"> · {item.ref}</span>
                <p className="text-muted-foreground mt-0.5">{item.note}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested Actions */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Lightbulb className="size-3.5 text-brand-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggested Actions</span>
          </div>
          <ul className="space-y-3">
            {WORK_AI_ACTIONS.map((action, i) => (
              <li key={i} className="border border-border/60 rounded p-3 space-y-2">
                <p className="text-xs leading-relaxed text-foreground/90">{action.text}</p>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border/60 rounded px-2 py-1 transition-colors">
                  <ListChecks className="size-3" /> Add to Work Tasks
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkPage({ onNavigateMatter }) {
  const [filter, setFilter] = useState('All')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filtered = filter === 'All'
    ? WORK_MATTERS
    : WORK_MATTERS.filter(m => m.status === filter)

  const counts = STATUS_FILTERS.reduce((acc, f) => {
    acc[f] = f === 'All' ? WORK_MATTERS.length : WORK_MATTERS.filter(m => m.status === f).length
    return acc
  }, {})

  return (
    <div className="flex flex-1">
      <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-end">
          <Button size="sm" className="gap-1.5">
            <Plus className="size-4" /> {t.newButton}
          </Button>
        </div>

        {/* KPI tiles */}
        <MetricsStrip items={KPI_TILES} />

        {/* Matters Overview + Performance */}
        <div className="grid grid-cols-2 divide-x divide-border/60 border border-border/60 overflow-hidden rounded bg-white">

          {/* Matters Overview */}
          <div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{t.overviewTitle}</p>
                <span className="text-xs text-muted-foreground">{t.overviewSub(MATTER_STATS.total)}</span>
              </div>
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <TrendingUp className="size-3" /> {MATTER_STATS.weekDelta} this week
              </span>
            </div>
            <div className="px-5 py-4 flex items-center gap-6">
              <DonutChart />
              <div className="flex-1 space-y-3">
                {MATTER_STATS.breakdown.map((seg) => (
                  <div key={seg.label} className="flex items-center gap-2">
                    <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: seg.hex }} />
                    <span className="text-sm text-foreground flex-1">{seg.label}</span>
                    <span className="text-sm font-semibold tabular-nums" style={{ color: seg.textHex }}>{seg.value}</span>
                    <span className="text-xs text-muted-foreground w-8 text-right tabular-nums">{seg.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance */}
          <div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">Performance</p>
                <span className="text-xs text-muted-foreground">Team delivery & capacity metrics</span>
              </div>
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <TrendingUp className="size-3" /> On target
              </span>
            </div>
            <div className="px-5 py-4 space-y-4">
              {PERFORMANCE.map((m) => (
                <div key={m.label} className="flex items-center gap-3">
                  <span className={`size-1.5 rounded-full shrink-0 ${m.onTarget ? 'bg-brand-400' : 'bg-amber-400'}`} />
                  <span className="text-sm text-foreground w-36 shrink-0">{m.label}</span>
                  <span className="text-sm font-medium w-12 text-right shrink-0 tabular-nums text-foreground">{m.value}</span>
                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-foreground/20" style={{ width: `${m.bar}%` }} />
                  </div>
                  <span className={`text-xs w-20 text-right shrink-0 ${m.onTarget ? 'text-muted-foreground' : 'text-amber-500'}`}>{m.note}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Matters table */}
        <div className="border border-border/60 overflow-hidden rounded bg-white">
          <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-border/60">
            {/* Filter pills */}
            <div className="flex items-center gap-0.5 flex-wrap">
              {STATUS_FILTERS.map((f) => {
                if (f !== 'All' && counts[f] === 0) return null
                const active = filter === f
                const dot = FILTER_DOT[f]
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex items-center gap-1.5 rounded-full px-3 h-7 text-xs font-medium transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {dot && <span className={`size-1.5 rounded-full shrink-0 ${dot}`} />}
                    {f} <span className={active ? 'opacity-60' : 'opacity-70'}>{counts[f]}</span>
                  </button>
                )
              })}
            </div>

            {/* Search + controls */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 h-8 w-44">
                <Search className="size-3.5 text-muted-foreground shrink-0" />
                <input
                  className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                  placeholder="Search matters..."
                />
              </div>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <Filter className="size-3.5" /> Filter
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <CalendarDays className="size-3.5" /> This Week
              </Button>
            </div>
          </div>

          <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="text-xs font-medium text-muted-foreground pl-4 w-[26%]">Matter</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Type</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Priority</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground w-[15%]">Progress</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Due</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">Value</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right pr-4">Assigned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => {
                  const ss = STATUS_STYLES[m.status] ?? STATUS_STYLES['On Hold']
                  return (
                    <TableRow key={m.ref} className="border-border cursor-pointer" onClick={() => onNavigateMatter?.(m)}>
                      <TableCell className="pl-4 py-3">
                        <p className="text-sm font-semibold text-foreground">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.client} · {m.ref}</p>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground border border-border rounded px-2 py-0.5 whitespace-nowrap">
                          {m.practice}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded border whitespace-nowrap ${ss.pill} ${ss.text}`}>
                          <span className={`size-1.5 rounded-full shrink-0 ${ss.dot}`} />
                          {m.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {m.priority === 'Critical'
                          ? <span className="text-xs border border-red-200 bg-red-50 text-red-600 rounded px-2 py-0.5 whitespace-nowrap">Critical</span>
                          : <span className="text-xs text-muted-foreground">{m.priority}</span>
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden shrink-0">
                            <div className="h-full bg-foreground/25 rounded-full" style={{ width: `${m.progress}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground tabular-nums">{m.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className={`text-sm whitespace-nowrap ${m.status === 'Behind' ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                        {m.due}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-foreground text-right">{m.value}</TableCell>
                      <TableCell className="pr-4 text-right">
                        <span className={`inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold ${m.leadColor}`}>
                          {m.lead}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
        </div>

        {/* Upcoming Deadlines + Team Workload */}
        <div className="grid grid-cols-12 gap-6">

          {/* Upcoming Deadlines */}
          <div className="col-span-7 border border-border/60 rounded bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Upcoming Deadlines</p>
              </div>
              <span className="text-xs text-muted-foreground">{WORK_DEADLINES.length} this period</span>
            </div>
            <div className="px-5 py-4 space-y-2">
              {WORK_DEADLINES.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No deadlines.</p>
              ) : WORK_DEADLINES.map(d => {
                const dateStyle = DEADLINE_DATE_STYLE[d.urgency] ?? DEADLINE_DATE_STYLE.medium
                const textStyle = DEADLINE_TEXT_STYLE[d.urgency] ?? DEADLINE_TEXT_STYLE.medium
                return (
                  <div key={d.id} className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 hover:bg-muted/40 transition-colors cursor-pointer">
                    <div className={`flex flex-col items-center justify-center rounded-md px-2.5 py-1.5 shrink-0 w-14 text-center ${dateStyle}`}>
                      <span className={`text-xs font-medium uppercase tracking-wide ${textStyle.month}`}>{d.month}</span>
                      <span className={`text-xl font-semibold leading-tight ${textStyle.day}`}>{d.day}</span>
                      <span className="text-xs text-muted-foreground">{d.year}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{d.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{d.matter}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Team Workload */}
          <div className="col-span-5 border border-border/60 rounded bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">Team Workload</p>
              </div>
            </div>
            <div className="px-5 py-4 space-y-3">
              {TEAM_WORKLOAD.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No team data.</p>
              ) : TEAM_WORKLOAD.map(p => {
                const tone = p.utilisation >= 90 ? 'bg-destructive' : p.utilisation >= 75 ? 'bg-amber-400' : 'bg-emerald-500'
                return (
                  <div key={p.initials} className="flex items-center gap-3">
                    <span className="size-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground shrink-0">{p.initials}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-foreground truncate">{p.name}</p>
                        <span className="text-xs text-muted-foreground tabular-nums shrink-0">{p.utilisation}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${tone}`} style={{ width: `${p.utilisation}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

      </div>
      </div>

      {/* AI Panel */}
      <div className={`shrink-0 overflow-hidden transition-all duration-300 ${drawerOpen ? 'w-[380px]' : 'w-0'}`}>
        {drawerOpen && <WorkAiPanel onClose={() => setDrawerOpen(false)} />}
      </div>
    </div>
  )
}
