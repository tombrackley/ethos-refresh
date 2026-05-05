import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { AiSummaryBar } from '@/components/shared/AiSummaryBar'
import Feature from '@/components/Feature'
import {
  Plus, Download, AlertTriangle, CheckCircle2, Clock, X, Sparkles,
  ListChecks, Flag, Search, TrendingUp, ShieldAlert, MapPin,
  AlertCircle, Activity,
} from 'lucide-react'
import tenant from '@/config/tenant'

// ─── Data ────────────────────────────────────────────────────────────────────

const t = tenant.pages.risk

const RISK_AI_POINTS = t.aiPoints

const RISKS = [
  { name: 'Client data breach via third-party vendor',          ref: 'RSK-001', category: 'Data',          region: 'UK', location: 'Head Office', level: 'Critical', likelihood: 'High',   impact: 'Severe',   owner: 'Sarah Chen',     status: 'Open'        },
  { name: 'Regulatory non-compliance — AML procedures',         ref: 'RSK-002', category: 'Regulatory',    region: 'UK', location: 'Head Office', level: 'High',     likelihood: 'Medium', impact: 'Major',    owner: 'James Liu',      status: 'In Progress' },
  { name: 'Key personnel departure — Corporate M&A team',       ref: 'RSK-003', category: 'Operational',   region: 'UK', location: 'Head Office', level: 'High',     likelihood: 'High',   impact: 'Major',    owner: 'Richard Okafor', status: 'In Progress' },
  { name: 'Conflict of interest — Ashworth Industries matter',  ref: 'RSK-004', category: 'Client',        region: 'UK', location: 'Manchester',  level: 'Medium',   likelihood: 'Medium', impact: 'Moderate', owner: 'David Park',     status: 'Managed'     },
  { name: 'Professional indemnity insurance coverage gap',      ref: 'RSK-005', category: 'Financial',     region: 'AU', location: 'Sydney',      level: 'High',     likelihood: 'Low',    impact: 'Severe',   owner: 'Maria Santos',   status: 'Open'        },
  { name: 'Reputational exposure — ESG litigation involvement', ref: 'RSK-006', category: 'Reputational',  region: 'AU', location: 'Melbourne',   level: 'Medium',   likelihood: 'Medium', impact: 'Moderate', owner: 'Helen Drayton',  status: 'Managed'     },
  { name: 'Strategic market positioning — AI legal services',   ref: 'RSK-007', category: 'Strategic',     region: 'US', location: 'New York',    level: 'Low',      likelihood: 'Medium', impact: 'Minor',    owner: 'Thomas Reid',    status: 'Monitored'   },
  { name: 'Contract liability exposure — Fixed fee arrangements',ref: 'RSK-008', category: 'Financial',    region: 'EU', location: 'Frankfurt',   level: 'Medium',   likelihood: 'High',   impact: 'Moderate', owner: 'Priya Nair',     status: 'In Progress' },
]

// Heat map: rows = likelihood top→bottom (Very High→Very Low), cols = impact left→right (Negligible→Severe)
const LIKELIHOOD_LABELS = ['Very High', 'High', 'Medium', 'Low', 'Very Low']
const IMPACT_LABELS     = ['Negligible', 'Minor', 'Moderate', 'Major', 'Severe']

const CELL_LEVEL = [
  ['medium', 'high',   'high',   'critical', 'critical'], // Very High
  ['low',    'medium', 'high',   'high',     'critical'], // High
  ['low',    'medium', 'medium', 'high',     'high'    ], // Medium
  ['low',    'low',    'medium', 'medium',   'high'    ], // Low
  ['low',    'low',    'low',    'low',      'medium'  ], // Very Low
]

// counts per cell [row][col] matching RISKS data
const CELL_COUNTS = [
  [0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1], // High: Moderate=RSK-008, Major=RSK-003, Severe=RSK-001
  [0, 1, 2, 1, 0], // Medium: Minor=RSK-007, Moderate=RSK-004+RSK-006, Major=RSK-002
  [0, 0, 0, 0, 1], // Low: Severe=RSK-005
  [0, 0, 0, 0, 0],
]

const MITIGATION = { implemented: 22, missing: 14, overdue: 2, effectiveness: 55 }

const AI_ACTIONS = t.aiActions

const priorityStyle = {
  High:   'border-amber-300 bg-amber-50 text-amber-700',
  Medium: 'border-slate-200 bg-slate-50 text-slate-600',
  Low:    'border-slate-200 bg-slate-50 text-slate-400',
}

// ─── Style maps ──────────────────────────────────────────────────────────────

const LEVEL_PILL = {
  Critical: 'bg-pink-300 text-slate-800',
  High:     'bg-amber-200 text-slate-800',
  Medium:   'bg-violet-100 text-slate-800',
  Low:      'bg-blue-100 text-slate-800',
}

const STATUS_DOT = {
  'Open':        'bg-red-400',
  'In Progress': 'bg-indigo-500',
  'Managed':     'bg-emerald-400',
  'Monitored':   'bg-blue-400',
}

const CELL_STYLE = {
  low:      { empty: 'bg-emerald-50/50 border-emerald-100',   filled: 'bg-emerald-100 border-emerald-300',   text: 'text-emerald-700' },
  medium:   { empty: 'bg-amber-50/50 border-amber-100',       filled: 'bg-amber-100 border-amber-300',       text: 'text-amber-700'   },
  high:     { empty: 'bg-orange-50/50 border-orange-100',     filled: 'bg-orange-100 border-orange-300',     text: 'text-orange-700'  },
  critical: { empty: 'bg-red-50/50 border-red-100',           filled: 'bg-red-100 border-red-300',           text: 'text-red-700'     },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ children }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
      {children}
    </div>
  )
}

function HeatMap() {
  return (
    <div className="flex gap-3">
      {/* Rotated Y-axis label */}
      <div className="flex items-center justify-center w-4 shrink-0">
        <span
          className="text-xs font-medium text-muted-foreground uppercase tracking-widest whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Likelihood
        </span>
      </div>

      {/* Grid + labels */}
      <div className="flex-1 min-w-0">
        {LIKELIHOOD_LABELS.map((label, rowIdx) => (
          <div key={label} className="flex items-center gap-1.5 mb-1.5">
            <span className="text-xs text-muted-foreground w-16 shrink-0 text-right">{label}</span>
            {IMPACT_LABELS.map((_, colIdx) => {
              const level = CELL_LEVEL[rowIdx][colIdx]
              const count = CELL_COUNTS[rowIdx][colIdx]
              const style = CELL_STYLE[level]
              return (
                <div
                  key={colIdx}
                  className={`flex-1 h-11 rounded border flex items-center justify-center transition-colors ${count ? style.filled : style.empty}`}
                >
                  {count > 0 && (
                    <span className={`text-sm font-semibold ${style.text}`}>{count}</span>
                  )}
                </div>
              )
            })}
          </div>
        ))}

        {/* X-axis labels */}
        <div className="flex items-center gap-1.5 mt-0.5 pl-[4.75rem]">
          {IMPACT_LABELS.map(label => (
            <span key={label} className="flex-1 text-center text-xs text-muted-foreground">{label}</span>
          ))}
        </div>
        <p className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1.5 pl-[4.75rem]">
          Impact
        </p>
      </div>
    </div>
  )
}

function RiskAiPanel({ onClose }) {
  return (
    <div className="flex flex-col w-[380px] shrink-0 border-l border-border overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-brand-600" />
          <span className="text-sm font-semibold text-foreground">Risk Analysis</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="size-7 text-muted-foreground">
          <X className="size-4" />
        </Button>
      </div>
      <div className="flex-1 px-5 py-4 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Register Overview</h3>
          </div>
          <div>
            {[
              { label: 'Total risks tracked',          value: '8'   },
              { label: 'Avg inherent risk score',      value: '11.8', alert: true },
              { label: 'Risk appetite target',         value: '4.0' },
              { label: 'Controls implemented',         value: '22'  },
              { label: 'Controls missing',             value: '14',  alert: true },
              { label: 'Control effectiveness',        value: '55%', alert: true },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
                <p className="text-xs text-foreground">{s.label}</p>
                <span className={`text-xs font-medium shrink-0 ${s.alert ? 'text-amber-600' : 'text-muted-foreground'}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ListChecks className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Suggested Actions</h3>
            <Badge variant="secondary" className="text-xs h-4 px-1.5 ml-auto">{AI_ACTIONS.length}</Badge>
          </div>
          <div className="space-y-2">
            {AI_ACTIONS.map(a => (
              <div key={a.title} className="rounded border border-border p-3.5 space-y-1.5 hover:bg-muted/40 transition-colors cursor-pointer">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <Badge variant="outline" className={`text-xs h-4 px-1.5 shrink-0 ${priorityStyle[a.priority]}`}>
                    {a.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RiskRegisterPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [search, setSearch]         = useState('')
  const [filterLevel, setFilterLevel]       = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus]     = useState('all')

  const categories = [...new Set(RISKS.map(r => r.category))]

  const filtered = RISKS.filter(r => {
    if (search       && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.ref.toLowerCase().includes(search.toLowerCase())) return false
    if (filterLevel !== 'all'    && r.level    !== filterLevel)    return false
    if (filterCategory !== 'all' && r.category !== filterCategory) return false
    if (filterStatus !== 'all'   && r.status   !== filterStatus)   return false
    return true
  })

  const selectCls = 'h-7 text-xs px-2.5 rounded border border-border/60 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-brand-300 cursor-pointer'

  return (
    <div className="flex flex-1">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Risk Register</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Understand and manage firm risk with clarity. Track operational, regulatory and client risks and monitor mitigation in real time.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="size-3.5" /> Export
              </Button>
              <Button size="sm" className="gap-1.5">
                <Plus className="size-3.5" /> Add Risk
              </Button>
            </div>
          </div>

          {/* AI Summary */}
          <Feature flag="FEATURE_AI_SUMMARY_BAR">
            <AiSummaryBar points={RISK_AI_POINTS} onOpenDrawer={() => setDrawerOpen(true)} />
          </Feature>

          {/* KPI row */}
          <div className="grid grid-cols-5 divide-x divide-border/60 border border-border/60 rounded overflow-hidden bg-white">
            {[
              { label: 'Total Risks',         value: '8',  sub: 'across all categories',   icon: ShieldAlert,     color: 'text-foreground'  },
              { label: 'High / Critical',     value: '4',  sub: 'require escalation',       icon: AlertTriangle,   color: 'text-red-500'     },
              { label: 'Require Action',      value: '3',  sub: 'open or overdue',          icon: AlertCircle,     color: 'text-amber-600'   },
              { label: 'Recently Updated',    value: '5',  sub: 'in the last 7 days',       icon: Clock,           color: 'text-muted-foreground' },
              { label: 'Mitigation Overdue',  value: '2',  sub: 'past due date',            icon: Activity,        color: 'text-red-500'     },
            ].map(k => (
              <div key={k.label} className="px-5 py-4 flex items-start gap-3">
                <k.icon className={`size-4 shrink-0 mt-0.5 ${k.color}`} />
                <div>
                  <p className={`text-2xl font-medium tracking-tight ${k.color}`}>{k.value}</p>
                  <p className="text-xs font-medium text-foreground mt-0.5">{k.label}</p>
                  <p className="text-xs text-muted-foreground">{k.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Heat Map + Risk Appetite */}
          <div className="border border-border/60 overflow-hidden rounded bg-white">
            <SectionHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Risk Heat Map</p>
                  <span className="text-xs text-muted-foreground">8 risks plotted</span>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm bg-emerald-200 inline-block" /> Low</span>
                  <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm bg-amber-200 inline-block" /> Medium</span>
                  <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm bg-orange-200 inline-block" /> High</span>
                  <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm bg-red-200 inline-block" /> Critical</span>
                </div>
              </div>
            </SectionHeader>

            <div className="grid grid-cols-12 divide-x divide-border/60">
              {/* Heat Map */}
              <div className="col-span-8 px-5 py-5">
                <HeatMap />
              </div>

              {/* Risk Appetite */}
              <div className="col-span-4 px-5 py-5 space-y-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Risk Appetite</p>
                <div>
                  <p className="text-4xl font-medium text-foreground tracking-tight">11.8</p>
                  <p className="text-xs text-muted-foreground mt-0.5">avg. inherent risk score</p>
                </div>

                {/* Gauge bar */}
                <div className="space-y-1.5">
                  <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                    {/* Appetite zone */}
                    <div className="absolute left-0 h-full bg-emerald-400 rounded-l-full" style={{ width: `${(4 / 25) * 100}%` }} />
                    {/* Exceeds zone */}
                    <div className="absolute h-full bg-red-400" style={{ left: `${(4 / 25) * 100}%`, width: `${((11.8 - 4) / 25) * 100}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Target: 4</span>
                    <span>25</span>
                  </div>
                </div>

                {/* Warning */}
                <div className="rounded border border-red-200 bg-red-50/60 px-3 py-2.5 space-y-1">
                  <p className="text-xs font-medium text-red-600">Exceeds Appetite</p>
                  <p className="text-xs text-red-500 leading-relaxed">
                    Risk exposure exceeds the firm's stated risk appetite. Immediate action required.
                  </p>
                </div>

                <Separator />

                {/* Level breakdown */}
                <div className="space-y-2">
                  {[
                    { level: 'Critical', count: 1, cls: 'bg-red-400'    },
                    { level: 'High',     count: 3, cls: 'bg-orange-400' },
                    { level: 'Medium',   count: 3, cls: 'bg-amber-300'  },
                    { level: 'Low',      count: 1, cls: 'bg-emerald-400'},
                  ].map(b => (
                    <div key={b.level} className="flex items-center gap-2.5">
                      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${b.cls}`} style={{ width: `${(b.count / 8) * 100}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-12">{b.level}</span>
                      <span className="text-xs font-medium text-foreground w-2 text-right">{b.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mitigation & Control Tracking */}
          <div className="border border-border/60 overflow-hidden rounded bg-white">
            <SectionHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Mitigation & Control Tracking</p>
              </div>
            </SectionHeader>
            <div className="grid grid-cols-4 divide-x divide-border/60">

              <div className="px-5 py-4 flex items-start gap-3">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Implemented</p>
                  <p className="text-2xl font-medium text-emerald-600">{MITIGATION.implemented}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">controls active</p>
                </div>
              </div>

              <div className="px-5 py-4 flex items-start gap-3">
                <AlertCircle className="size-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Missing</p>
                  <p className="text-2xl font-medium text-red-500">{MITIGATION.missing}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">controls required</p>
                </div>
              </div>

              <div className="px-5 py-4 flex items-start gap-3">
                <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Overdue</p>
                  <p className="text-2xl font-medium text-amber-600">{MITIGATION.overdue}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">risks overdue</p>
                </div>
              </div>

              <div className="px-5 py-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Avg. Effectiveness</p>
                <p className="text-2xl font-medium text-foreground mb-2">{MITIGATION.effectiveness}%</p>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-brand-300 rounded-full" style={{ width: `${MITIGATION.effectiveness}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">across 8 risks</p>
              </div>

            </div>
          </div>

          {/* Risk Register Table */}
          <div className="border border-border/60 overflow-hidden rounded bg-white">
            <SectionHeader>
              <div className="flex items-center gap-2">
                <ShieldAlert className="size-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Risk Register</p>
                <span className="text-xs text-muted-foreground">Click headers to sort · Select a row to view details</span>
              </div>
            </SectionHeader>

            {/* Filters */}
            <div className="px-5 py-3 border-b border-border/60 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search risks…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="h-7 pl-8 pr-3 text-xs rounded border border-border/60 bg-background focus:outline-none focus:ring-1 focus:ring-brand-300 w-48 placeholder:text-muted-foreground/60"
                  />
                </div>
                {[
                  { label: 'All Levels', value: filterLevel, setter: setFilterLevel, options: ['all', 'Critical', 'High', 'Medium', 'Low'] },
                  { label: 'All Categories', value: filterCategory, setter: setFilterCategory, options: ['all', ...categories] },
                  { label: 'All Statuses', value: filterStatus, setter: setFilterStatus, options: ['all', 'Open', 'In Progress', 'Managed', 'Monitored'] },
                ].map(f => (
                  <select key={f.label} value={f.value} onChange={e => f.setter(e.target.value)} className={selectCls}>
                    {f.options.map(o => (
                      <option key={o} value={o}>{o === 'all' ? f.label : o}</option>
                    ))}
                  </select>
                ))}
                {(filterLevel !== 'all' || filterCategory !== 'all' || filterStatus !== 'all' || search) && (
                  <button
                    onClick={() => { setFilterLevel('all'); setFilterCategory('all'); setFilterStatus('all'); setSearch('') }}
                    className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground border border-border/60 rounded transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="px-5 py-1">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-muted-foreground pl-0 w-[32%]">Risk</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Category</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Region</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Level</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Likelihood</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Impact</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Owner</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground pr-0">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(r => (
                    <TableRow key={r.ref} className="border-border/60 cursor-pointer">
                      <TableCell className="pl-0 py-3">
                        <p className="text-sm font-medium text-foreground leading-snug">{r.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{r.ref}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.category}</TableCell>
                      <TableCell>
                        <div className="flex items-start gap-1">
                          <MapPin className="size-3 text-muted-foreground/50 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-foreground">{r.region}</p>
                            <p className="text-xs text-muted-foreground">{r.location}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 h-5 rounded text-xs font-medium ${LEVEL_PILL[r.level]}`}>{r.level}</span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.likelihood}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.impact}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.owner}</TableCell>
                      <TableCell className="pr-0">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className={`size-1.5 rounded-full shrink-0 ${STATUS_DOT[r.status] ?? 'bg-slate-300'}`} />
                          {r.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-sm text-muted-foreground">
                        No risks match the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <p className="text-xs text-muted-foreground py-3">Showing {filtered.length} of {RISKS.length} risks</p>
            </div>
          </div>

        </div>
      </div>

      {/* Push panel */}
      <div className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${drawerOpen ? 'w-[380px]' : 'w-0'}`}>
        <RiskAiPanel onClose={() => setDrawerOpen(false)} />
      </div>
    </div>
  )
}
