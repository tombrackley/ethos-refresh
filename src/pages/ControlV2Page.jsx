import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import tenant from '@/config/tenant'

const t = tenant.pages.control

// ─── Data ────────────────────────────────────────────────────────────────────

const KPIS       = t.kpis
const MATTERS    = t.matters
const COMPLIANCE = t.compliance
const FIRM_HEALTH = t.firmHealthMetrics
const TEAM       = t.team
const PRIORITIES = t.priorities

const COMPLIANCE_SCORE = 87

const CATEGORY_COLOR = {
  committee: 'bg-amber-300',
  sync: 'bg-blue-300',
  board: 'bg-slate-400',
  compliance: 'bg-emerald-300',
  ir: 'bg-purple-300',
  regulator: 'bg-rose-300',
}

const COMING_UP = [
  {
    label: 'Tomorrow',
    events: [
      { time: '8:30 AM', title: 'Audit & Risk Committee pre-read', category: 'committee' },
      { time: '2:00 PM', title: 'Chair check-in', meta: 'Microsoft Teams Meeting', category: 'sync' },
    ],
  },
  {
    label: 'Thu, May 7',
    events: [
      { time: '9:30 AM', title: 'Board strategy offsite — Day 1', category: 'board' },
      { time: '11:00 AM', title: 'Q1 compliance briefing', category: 'compliance' },
    ],
  },
  {
    label: 'Mon, May 11',
    events: [
      { time: '10:00 AM', title: 'Investor relations update', category: 'ir' },
      { time: '3:00 PM', title: 'ASIC engagement prep', category: 'regulator' },
    ],
  },
]

const UPCOMING_EVENTS_COUNT = COMING_UP.reduce((sum, g) => sum + g.events.length, 0)

// ─── Style maps ───────────────────────────────────────────────────────────────

const priorityStyle = {
  High:   'border-amber-300 bg-amber-50 text-amber-700',
  Medium: 'border-slate-200 bg-slate-50 text-slate-600',
  Low:    'border-slate-200 bg-slate-50 text-slate-400',
}

const MATTER_STATUS_DOT = {
  Active:    'bg-emerald-500',
  Review:    'bg-amber-400',
  'On Hold': 'bg-slate-300',
}

// Synthesize a numeric score + delta per compliance row from the categorical
// `status` field. Deterministic by index so the visual is stable across renders.
const STATUS_SCORE_BAND = {
  good:    [96, 94, 92, 90, 88],
  neutral: [85, 82, 80, 78, 76],
  warning: [72, 68, 65, 62, 60],
}
const STATUS_RANK_WEIGHT = { good: 0, neutral: 1, warning: 2 }

function deriveComplianceRows() {
  const counts = { good: 0, neutral: 0, warning: 0 }
  return [...COMPLIANCE]
    .sort((a, b) => (STATUS_RANK_WEIGHT[a.status] ?? 9) - (STATUS_RANK_WEIGHT[b.status] ?? 9))
    .map((row) => {
      const band = STATUS_SCORE_BAND[row.status] ?? STATUS_SCORE_BAND.neutral
      const idx = counts[row.status] ?? 0
      counts[row.status] = idx + 1
      const score = band[idx % band.length]
      const delta = row.status === 'good' ? +2 : row.status === 'warning' ? -3 : 0
      return { ...row, score, delta }
    })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ComplianceDonut({ score, size = 132, stroke = 12 }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-brand-500 transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-medium tracking-[-0.02em] text-foreground leading-none">{score}%</span>
        <span className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">Compliant</span>
      </div>
    </div>
  )
}

function DeltaChip({ delta }) {
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600">
        <TrendingUp className="size-3" />+{delta}
      </span>
    )
  }
  if (delta < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-amber-600">
        <TrendingDown className="size-3" />{delta}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground">
      <Minus className="size-3" />0
    </span>
  )
}

function CapacityBars({ util, level }) {
  const total = 8
  const filled = Math.round((util / 100) * total)
  const colour = level === 'good' ? 'bg-brand-300' : 'bg-amber-300'
  return (
    <div className="flex items-center gap-px">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`w-1.5 ${i < filled ? colour : 'bg-muted'}`} style={{ height: 12 }} />
      ))}
    </div>
  )
}

function SectionCard({ title, count, viewAllLabel = 'View all', children }) {
  return (
    <div className="flex flex-col border border-border/60 overflow-hidden rounded bg-white">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-sm font-medium text-foreground">
            {count !== undefined && <span className="text-foreground">{count} </span>}
            <span className={count !== undefined ? 'text-muted-foreground font-normal' : ''}>{title}</span>
          </p>
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
          {viewAllLabel} <ChevronRight className="size-3.5" />
        </Button>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

function KpiStrip({ items }) {
  return (
    <div className="flex flex-wrap divide-x divide-border/60 border border-border/60 rounded bg-white overflow-hidden">
      {items.map((kpi) => (
        <div key={kpi.label} className="flex-1 min-w-[180px] px-5 py-3">
          <p className="text-xs text-muted-foreground">{kpi.label}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-medium tracking-[-0.01em] text-foreground">{kpi.value}</span>
            {kpi.delta && (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 text-xs font-medium',
                  kpi.dir === 'up'   && 'text-emerald-600',
                  kpi.dir === 'down' && 'text-amber-600',
                  (!kpi.dir || kpi.dir === 'flat') && 'text-muted-foreground',
                )}
              >
                {kpi.dir === 'up'   && <TrendingUp className="size-3" />}
                {kpi.dir === 'down' && <TrendingDown className="size-3" />}
                {kpi.delta}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ControlV2Page() {
  const now = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date())
  const complianceRows = deriveComplianceRows()

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto bg-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Page heading */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-[28px] leading-[30px] tracking-[-1.12px] font-normal text-[#0A0A0A]">Control</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Oversight across your organisation’s compliance, governance and work.
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              Updated 4 min ago &middot; {now}
            </span>
          </div>

          {/* Compact KPI strip */}
          <KpiStrip items={KPIS} />

          {/* Row 1: Compliance hero | Matters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <SectionCard title="Compliance score" count={`${COMPLIANCE_SCORE}%`} viewAllLabel="View report">
              <div className="px-5 py-5 flex items-stretch gap-5">
                <div className="flex flex-col items-center justify-center shrink-0">
                  <ComplianceDonut score={COMPLIANCE_SCORE} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Top areas</p>
                  <ul className="divide-y divide-border/60">
                    {complianceRows.map((row, i) => (
                      <li key={row.label} className="flex items-center gap-3 py-2">
                        <span className="text-xs font-medium tabular-nums text-muted-foreground w-4 shrink-0">{i + 1}</span>
                        <p className="flex-1 text-sm text-foreground truncate">{row.label}</p>
                        <span className="text-xs font-medium text-foreground tabular-nums shrink-0">{row.score}%</span>
                        <span className="w-10 text-right shrink-0">
                          <DeltaChip delta={row.delta} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SectionCard>

            <SectionCard count={MATTERS.length} title="Matters">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-muted-foreground pl-5 w-[55%]">Matter</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground text-right pr-5">Lead</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MATTERS.map((m) => (
                    <TableRow key={m.name} className="border-border/60 cursor-pointer">
                      <TableCell className="pl-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            aria-hidden
                            className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-semibold uppercase text-muted-foreground"
                            title={m.client}
                          >
                            {(m.client ?? '').split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('') || '—'}
                          </span>
                          <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5 text-sm text-foreground">
                          <span className={`inline-block size-1.5 rounded-full shrink-0 ${MATTER_STATUS_DOT[m.status] ?? 'bg-slate-300'}`} />
                          {m.status}
                        </span>
                      </TableCell>
                      <TableCell className="pr-5 text-right">
                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {m.lead}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </SectionCard>

          </div>

          {/* Row 2: Firm Health | Team Workload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <SectionCard title="Firm Health" viewAllLabel="View details">
              <div className="px-5 py-4 space-y-4">
                {FIRM_HEALTH.map((m) => {
                  const isNps = m.label === 'Client NPS'
                  const numerator = Number(m.value) || 0
                  const denominator = Number(m.target) || 100
                  const pct = Math.min(100, (numerator / Math.max(denominator, 1)) * 100)
                  return (
                    <div key={m.label} className="space-y-1.5">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-sm text-foreground">{m.label}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-medium text-foreground tabular-nums">
                            {m.value}{isNps ? '' : '%'}
                          </span>
                          <span className={cn(
                            'inline-flex items-center gap-0.5 text-xs',
                            m.above ? 'text-brand-600' : 'text-amber-600',
                          )}>
                            {m.above
                              ? <TrendingUp className="size-3 shrink-0" />
                              : <TrendingDown className="size-3 shrink-0" />}
                            {m.delta}
                          </span>
                        </div>
                      </div>
                      <div className="relative h-1 w-full bg-muted overflow-hidden rounded-full">
                        <div
                          className={cn('h-full rounded-full', m.above ? 'bg-brand-400' : 'bg-amber-400')}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Target {m.target}{isNps ? '' : '%'}</p>
                    </div>
                  )
                })}
              </div>
            </SectionCard>

            <SectionCard count={TEAM.length} title="Team workload" viewAllLabel="Manage team">
              <div className="px-5 py-2">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/60 hover:bg-transparent">
                      <TableHead className="text-xs font-medium text-muted-foreground pl-0">Person</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground text-right">Matters</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground text-right pr-0">Capacity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TEAM.map((p) => (
                      <TableRow key={p.name} className="border-border/60">
                        <TableCell className="pl-0 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                              {p.initials}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm text-foreground leading-none">{p.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{p.role}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">{p.matters}</TableCell>
                        <TableCell className="pr-0 text-right">
                          <div className="inline-flex"><CapacityBars util={p.util} level={p.level} /></div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </SectionCard>

          </div>

          {/* Row 3: Priorities | Upcoming Events */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <SectionCard count={PRIORITIES.length} title="Priorities">
              <div className="px-5 py-2">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/60 hover:bg-transparent">
                      <TableHead className="text-xs font-medium text-muted-foreground pl-0">Priority</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Item</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground text-right pr-0">Due</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PRIORITIES.map((p) => (
                      <TableRow key={p.label} className="border-border/60 cursor-pointer">
                        <TableCell className="pl-0 py-3">
                          <Badge variant="outline" className={`text-xs h-5 px-1.5 ${priorityStyle[p.urgency]}`}>
                            {p.urgency.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-foreground truncate max-w-[220px]">{p.label}</TableCell>
                        <TableCell className="pr-0 text-right text-xs text-muted-foreground whitespace-nowrap">{p.due}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </SectionCard>

            <SectionCard count={UPCOMING_EVENTS_COUNT} title="Upcoming events">
              <div className="px-3 py-3 space-y-4">
                {COMING_UP.map((group) => (
                  <div key={group.label} className="space-y-1.5">
                    <p className="px-2 text-xs text-muted-foreground">{group.label}</p>
                    <ul>
                      {group.events.map((e, i) => (
                        <li key={i}>
                          <button
                            type="button"
                            className="group flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted/40"
                          >
                            <span className={cn('h-4 w-[3px] shrink-0 rounded-full', CATEGORY_COLOR[e.category] ?? 'bg-foreground/80')} />
                            <span className="flex-1 truncate text-foreground">
                              {e.time}
                              <span className="mx-1.5 text-muted-foreground">·</span>
                              {e.title}
                              {e.meta && (
                                <>
                                  <span className="mx-1.5 text-muted-foreground">·</span>
                                  {e.meta}
                                </>
                              )}
                            </span>
                            <ChevronRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </SectionCard>

          </div>

        </div>
      </div>
    </div>
  )
}
