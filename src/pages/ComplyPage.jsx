import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AiSummaryBar } from '@/components/shared/AiSummaryBar'
import Feature from '@/components/Feature'
import {
  CheckCircle2, AlertCircle, Clock, ChevronRight, Sparkles,
  AlertTriangle, ShieldCheck, Scale, GraduationCap, Flame,
  ClipboardCheck, Check, TrendingUp, TrendingDown, Minus, FileText,
  X, ListChecks, Flag,
} from 'lucide-react'
import tenant from '@/config/tenant'

// ─── Data ────────────────────────────────────────────────────────────────────

const t = tenant.pages.comply

const COMPLY_AI_POINTS = t.aiPoints

const COMPLY_AI_ACTIONS = t.aiActions

const COMPLY_PRIORITIES = t.priorities

const priorityStyle = {
  High:   'border-amber-300 bg-amber-50 text-amber-700',
  Medium: 'border-slate-200 bg-slate-50 text-slate-600',
  Low:    'border-slate-200 bg-slate-50 text-slate-400',
}

const KPIS = t.kpis

const COMPLIANCE_ITEMS = [
  { label: 'AML / KYC Reviews', status: 'good',    value: '24/24',    sub: 'All current'   },
  { label: 'Conflict Checks',   status: 'warning', value: '18/21',    sub: '3 overdue'     },
  { label: 'CPD Requirements',  status: 'good',    value: '96%',      sub: 'On track'      },
  { label: 'Data Protection',   status: 'warning', value: '3 pending',sub: 'Due this week' },
  { label: 'Risk Assessments',  status: 'neutral', value: '12/15',    sub: 'In progress'   },
]

const DEADLINES = [
  { label: 'AML annual report submission',              month: 'FEB', day: '14', year: '2026', status: 'overdue', category: 'Reporting' },
  { label: 'Privacy impact assessment — Project Orion', month: 'FEB', day: '20', year: '2026', status: 'high',    category: 'Privacy'   },
  { label: 'Board compliance report — Q4',              month: 'FEB', day: '25', year: '2026', status: 'medium',  category: 'Board'     },
  { label: 'Vendor risk assessment cycle',              month: 'FEB', day: '28', year: '2026', status: 'low',     category: 'Vendors'   },
  { label: 'CPD submission window closes',              month: 'FEB', day: '28', year: '2026', status: 'medium',  category: 'Training'  },
]

const LEGISLATION = [
  { title: 'Privacy Act Amendment 2026',  desc: 'Mandatory breach notification window reduced to 48hrs. Review client obligations.', severity: 'high',   tag: 'New',     firm: true,  clients: true  },
  { title: 'AML/CTF Rule Updates',        desc: 'Updated customer due diligence requirements effective March 2026.',                  severity: 'medium', tag: 'Updated', firm: true,  clients: true  },
  { title: 'Workplace Safety Regulation', desc: 'Psychosocial hazard reporting obligations expanded.',                               severity: 'low',    tag: 'Updated', firm: true,  clients: false },
]

const OBLIGATIONS = [
  { label: 'Key contractual obligations', value: 47, style: 'text-foreground'  },
  { label: 'Requiring action',            value: 6,  style: 'text-amber-600'   },
  { label: 'Reporting deadlines (30d)',   value: 9,  style: 'text-amber-600'   },
  { label: 'On track',                   value: 41, style: 'text-emerald-600'  },
]

const RISK_STATS = [
  { label: 'Top active risks',        value: 7, alert: false },
  { label: 'Mitigations in progress', value: 5, alert: false },
  { label: 'Conflicts flagged',       value: 3, alert: true  },
  { label: 'Mitigations complete',    value: 4, alert: false },
]

const ACTIVE_RISKS = [
  { label: 'Client conflict — Matters #4821 / #4830', severity: 'Critical' },
  { label: 'Third-party vendor SOC 2 gap',            severity: 'High'     },
  { label: 'Data residency non-compliance risk',       severity: 'High'     },
  { label: 'AML/CTF training deficiency',             severity: 'Medium'   },
]

const TRAINING = { completion: 78, outstanding: 12, attestationsDue: 8, attestationsComplete: 34 }

const INCIDENTS = [
  { label: 'Open incidents',     value: 3, alert: true  },
  { label: 'Reportable matters', value: 1, alert: true  },
  { label: 'Recently reported',  value: 2, alert: false },
  { label: 'Closed this month',  value: 5, alert: false },
]

const RECENT_INCIDENTS = [
  { label: 'Phishing attempt — staff member credentials',  date: '18 Feb', status: 'Open'   },
  { label: 'Unauthorised data access — client file',       date: '14 Feb', status: 'Open'   },
  { label: 'Third-party data breach notification received', date: '10 Feb', status: 'Closed' },
]

const AUDIT = {
  metrics: [
    { label: 'Evidence completeness', pct: 87, color: 'bg-brand-300' },
    { label: 'Policy review status',  pct: 72, color: 'bg-amber-300' },
    { label: 'Audit readiness',       pct: 91, color: 'bg-brand-300' },
  ],
  checklist: [
    { label: 'All policies reviewed within 12 months', done: true  },
    { label: 'Incident response plan current',          done: true  },
    { label: 'AML training 100% complete',             done: false },
    { label: 'Board compliance report generated',       done: false },
    { label: 'External audit evidence pack ready',      done: true  },
  ],
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const TODAY = new Date('2026-04-28')
const MONTH_NUM = { JAN:0, FEB:1, MAR:2, APR:3, MAY:4, JUN:5, JUL:6, AUG:7, SEP:8, OCT:9, NOV:10, DEC:11 }

function daysUntilDeadline(d) {
  const m = MONTH_NUM[d.month]
  if (m == null) return null
  const date = new Date(Number(d.year), m, Number(d.day))
  return Math.round((date - TODAY) / (1000 * 60 * 60 * 24))
}

function CountdownChip({ deadline }) {
  if (deadline.status === 'overdue') {
    return <span className="text-xs bg-red-100 text-red-600 rounded-full px-2.5 py-0.5 font-medium shrink-0">Overdue</span>
  }
  const days = daysUntilDeadline(deadline)
  if (days == null) return null
  if (days < 0) return <span className="text-xs bg-red-100 text-red-600 rounded-full px-2.5 py-0.5 font-medium shrink-0">Overdue</span>
  if (days === 0) return <span className="text-xs bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5 font-medium shrink-0">Today</span>
  const tone = days <= 14 ? 'bg-amber-100 text-amber-700' : 'bg-muted text-muted-foreground'
  return <span className={`text-xs rounded-full px-2.5 py-0.5 font-medium shrink-0 ${tone}`}>{days} day{days === 1 ? '' : 's'}</span>
}

// 5×5 mini risk heatmap (likelihood rows × impact cols, low to high)
const HEATMAP_COUNTS = [
  [0, 0, 1, 1, 1], // Almost Certain
  [0, 1, 1, 1, 0], // Likely
  [1, 1, 1, 0, 0], // Possible
  [0, 1, 0, 0, 0], // Unlikely
  [1, 0, 0, 0, 0], // Rare
]

const HEATMAP_LEVEL = [
  ['low','medium','high','critical','critical'],
  ['low','medium','high','high','critical'],
  ['low','low','medium','high','high'],
  ['low','low','low','medium','high'],
  ['low','low','low','low','medium'],
]

const HEATMAP_FILL = {
  low:      'bg-emerald-100 text-emerald-800',
  medium:   'bg-amber-100 text-amber-800',
  high:     'bg-orange-200 text-orange-900',
  critical: 'bg-red-200 text-red-900',
}

function MiniRiskHeatmap() {
  return (
    <div className="grid grid-cols-5 gap-1">
      {HEATMAP_COUNTS.flatMap((row, ri) =>
        row.map((count, ci) => {
          const level = HEATMAP_LEVEL[ri][ci]
          const filled = count > 0
          return (
            <div
              key={`${ri}-${ci}`}
              title={`${level} · ${count}`}
              className={`aspect-square rounded flex items-center justify-center text-xs font-semibold ${filled ? HEATMAP_FILL[level] : 'bg-muted/40 text-muted-foreground/40'}`}
            >
              {filled ? count : ''}
            </div>
          )
        })
      )}
    </div>
  )
}

function Delta({ dir, delta, invert }) {
  const up   = invert ? 'text-destructive'  : 'text-emerald-700'
  const down = invert ? 'text-emerald-700'  : 'text-destructive'
  if (dir === 'up')   return <span className={`flex items-center gap-0.5 text-xs ${up}`}><TrendingUp className="size-3" />{delta}</span>
  if (dir === 'down') return <span className={`flex items-center gap-0.5 text-xs ${down}`}><TrendingDown className="size-3" />{delta}</span>
  return <span className="flex items-center gap-0.5 text-xs text-muted-foreground"><Minus className="size-3" />{delta}</span>
}

function ComplianceIcon({ status }) {
  if (status === 'good')    return <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500 mt-px" />
  if (status === 'warning') return <AlertCircle  className="size-3.5 shrink-0 text-amber-400 mt-px" />
  return                           <Clock        className="size-3.5 shrink-0 text-muted-foreground/40 mt-px" />
}

const SEVERITY_PILL = {
  Critical: 'bg-red-100 text-red-600',
  High:     'bg-amber-100 text-amber-700',
  Medium:   'bg-slate-100 text-slate-500',
}

const SEVERITY_DOT = {
  high:   'bg-red-400',
  medium: 'bg-amber-400',
  low:    'bg-slate-300',
}

const DEADLINE_DATE_STYLE = {
  overdue: 'bg-destructive/10',
  high:    'bg-amber-50 border border-amber-200',
  medium:  'bg-muted',
  low:     'bg-muted',
}

const DEADLINE_TEXT_STYLE = {
  overdue: { month: 'text-destructive', day: 'text-destructive' },
  high:    { month: 'text-amber-600',   day: 'text-amber-700'   },
  medium:  { month: 'text-muted-foreground', day: 'text-foreground' },
  low:     { month: 'text-muted-foreground', day: 'text-foreground' },
}

function ComplyAiPanel({ onClose }) {
  return (
    <div className="flex flex-col w-[380px] shrink-0 border-l border-border overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-brand-600" />
          <span className="text-sm font-medium text-foreground">Compliance Analysis</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="size-7 text-muted-foreground">
          <X className="size-4" />
        </Button>
      </div>

      <div className="flex-1 px-5 py-4 space-y-6">
        {/* Suggested Actions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ListChecks className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Suggested Actions</h3>
            <Badge variant="secondary" className="text-xs h-4 px-1.5 ml-auto">{COMPLY_AI_ACTIONS.length} items</Badge>
          </div>
          <div className="space-y-2">
            {COMPLY_AI_ACTIONS.map((a) => (
              <div key={a.title} className="rounded-lg border border-border p-3.5 space-y-1.5 hover:bg-muted/40 transition-colors cursor-pointer">
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

        <Separator />

        {/* Priorities Overview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Flag className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Priorities Overview</h3>
          </div>
          <div>
            {COMPLY_PRIORITIES.map((p) => (
              <div key={p.label} className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`size-1.5 rounded-full shrink-0 ${p.urgency === 'High' ? 'bg-amber-400' : p.urgency === 'Medium' ? 'bg-muted-foreground/40' : 'bg-muted-foreground/20'}`} />
                  <p className="text-xs text-foreground truncate">{p.label}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{p.due}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ComplyPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Comply</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Know what applies to you, what applies to your clients, what must be done, and prove compliance instantly.
            </p>
          </div>
          <Button size="sm" className="gap-1.5">
            <ClipboardCheck className="size-4" /> Prepare Report
          </Button>
        </div>

        {/* AI Summary */}
        <Feature flag="FEATURE_AI_SUMMARY_BAR">
          <AiSummaryBar points={COMPLY_AI_POINTS} onOpenDrawer={() => setDrawerOpen(true)} />
        </Feature>

        {/* KPI row */}
        <div className={`grid ${KPIS.length === 5 ? 'grid-cols-5' : 'grid-cols-4'} divide-x divide-border/60 border border-border/60 rounded overflow-hidden bg-white`}>
          {KPIS.map(k => (
            <div key={k.label} className="px-5 py-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">{k.label}</p>
              <p className={`font-medium tracking-tight mb-1.5 ${k.primary ? 'text-3xl text-brand-800' : 'text-2xl text-foreground'}`}>{k.value}</p>
              <Delta dir={k.dir} delta={k.delta} invert={k.invert} />
            </div>
          ))}
        </div>

        {/* Row 1: Compliance Breakdown + Nearest Deadlines */}
        <div className="border border-border/60 overflow-hidden rounded bg-white">
          <div className="grid grid-cols-12 divide-x divide-border/60">

            {/* Compliance Breakdown */}
            <div className="col-span-4">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Compliance Breakdown</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                  Details <ChevronRight className="size-3.5" />
                </Button>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-medium text-foreground">87%</span>
                    <span className="text-xs text-muted-foreground">Overall compliant</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                    <div className="h-full bg-brand-300 rounded-full" style={{ width: '87%' }} />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2.5">
                  {COMPLIANCE_ITEMS.map(item => (
                    <div key={item.label} className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <ComplianceIcon status={item.status} />
                        <div>
                          <p className="text-xs text-foreground leading-snug">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.sub}</p>
                        </div>
                      </div>
                      <span className={`text-xs shrink-0 ${item.status === 'warning' ? 'text-amber-500' : 'text-muted-foreground'}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Nearest Deadlines */}
            <div className="col-span-8">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Nearest Deadlines</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                  View all <ChevronRight className="size-3.5" />
                </Button>
              </div>
              <div className="px-5 py-4 space-y-2">
                {DEADLINES.map(d => {
                  const dateStyle = DEADLINE_DATE_STYLE[d.status]
                  const textStyle = DEADLINE_TEXT_STYLE[d.status]
                  return (
                    <div key={d.label} className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 hover:bg-muted/40 transition-colors cursor-pointer">
                      <div className={`flex flex-col items-center justify-center rounded-md px-2.5 py-1.5 shrink-0 w-14 text-center ${dateStyle}`}>
                        <span className={`text-xs font-medium uppercase tracking-wide ${textStyle.month}`}>{d.month}</span>
                        <span className={`text-xl font-semibold leading-tight ${textStyle.day}`}>{d.day}</span>
                        <span className="text-xs text-muted-foreground">{d.year}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{d.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{d.status === 'overdue' ? 'Overdue' : 'Upcoming'} · {d.category}</p>
                      </div>
                      <CountdownChip deadline={d} />
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Row 2: Legislation | Contracts | Risk */}
        <div className="border border-border/60 overflow-hidden rounded bg-white">
          <div className="grid grid-cols-3 divide-x divide-border/60">

            {/* Legislation */}
            <div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Scale className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Legislation & Regulation</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                  Explore <ChevronRight className="size-3.5" />
                </Button>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-px bg-border/40 overflow-hidden">
                  {[
                    { label: 'Impacting firm',           value: 14            },
                    { label: 'AI-flagged updates',       value: 6,  alert: true },
                    { label: 'Impacting clients',        value: 23            },
                    { label: 'Needs immediate review',   value: 2,  alert: true },
                  ].map(s => (
                    <div key={s.label} className="bg-background p-3">
                      <p className={`text-xl font-semibold ${s.alert ? 'text-amber-600' : 'text-foreground'}`}>{s.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-3">
                  {LEGISLATION.map(leg => (
                    <div key={leg.title} className="space-y-1 cursor-pointer group">
                      <div className="flex items-start gap-2">
                        <span className={`size-1.5 rounded-full shrink-0 mt-1.5 ${SEVERITY_DOT[leg.severity]}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-foreground group-hover:text-brand-700 transition-colors">{leg.title}</p>
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${leg.tag === 'New' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{leg.tag}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{leg.desc}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            {leg.firm    && <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">Firm</span>}
                            {leg.clients && <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">Clients</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contracts & Obligations */}
            <div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Contracts & Obligations</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                  View all <ChevronRight className="size-3.5" />
                </Button>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-px bg-border/40 overflow-hidden">
                  {OBLIGATIONS.map(o => (
                    <div key={o.label} className="bg-background p-3">
                      <p className={`text-2xl font-semibold ${o.style}`}>{o.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{o.label}</p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5">Obligations requiring action</p>
                  <div>
                    {[
                      { label: 'Renewal notice — Meridian LLC',         due: '20 Feb', urgency: 'high'   },
                      { label: 'Reporting clause — Vanguard Financial', due: '25 Feb', urgency: 'medium' },
                      { label: 'Indemnity review — Apex Industries',    due: '28 Feb', urgency: 'medium' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between gap-2 py-2 border-b border-border/60 last:border-0">
                        <p className="text-xs text-foreground truncate">{item.label}</p>
                        <span className={`text-xs shrink-0 ${item.urgency === 'high' ? 'text-amber-500' : 'text-muted-foreground'}`}>{item.due}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Risk & Conflict */}
            <div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Risk & Conflict</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                  Register <ChevronRight className="size-3.5" />
                </Button>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5">Risk heatmap</p>
                  <MiniRiskHeatmap />
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5">Active risks</p>
                  <div>
                    {ACTIVE_RISKS.map(r => (
                      <div key={r.label} className="flex items-center justify-between gap-3 py-2 border-b border-border/60 last:border-0">
                        <p className="text-xs text-foreground min-w-0 truncate">{r.label}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${SEVERITY_PILL[r.severity]}`}>
                          {r.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Row 3: Training | Incidents | Audit */}
        <div className="border border-border/60 overflow-hidden rounded bg-white">
          <div className="grid grid-cols-3 divide-x divide-border/60">

            {/* Training & Attestations */}
            <div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <GraduationCap className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Training & Attestations</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                  Manage <ChevronRight className="size-3.5" />
                </Button>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-medium text-foreground">{TRAINING.completion}%</span>
                    <span className="text-xs text-muted-foreground">Training completion</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-amber-300 rounded-full" style={{ width: `${TRAINING.completion}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">{TRAINING.outstanding} staff with mandatory training outstanding</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-px bg-border/40 overflow-hidden">
                  <div className="bg-background p-3">
                    <p className="text-2xl font-semibold text-amber-600">{TRAINING.attestationsDue}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Policy attestations due</p>
                  </div>
                  <div className="bg-background p-3">
                    <p className="text-2xl font-semibold text-foreground">{TRAINING.attestationsComplete}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Attestations completed this month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Incidents & Breaches */}
            <div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Flame className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Incidents & Breaches</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                  View log <ChevronRight className="size-3.5" />
                </Button>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-px bg-border/40 overflow-hidden">
                  {INCIDENTS.map(inc => (
                    <div key={inc.label} className="bg-background p-3">
                      <p className={`text-2xl font-semibold ${inc.alert ? 'text-red-500' : 'text-foreground'}`}>{inc.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{inc.label}</p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5">Recent incidents</p>
                  <div>
                    {RECENT_INCIDENTS.map(inc => (
                      <div key={inc.label} className="flex items-center justify-between gap-3 py-2 border-b border-border/60 last:border-0">
                        <div className="min-w-0">
                          <p className="text-xs text-foreground truncate">{inc.label}</p>
                          <p className="text-xs text-muted-foreground">{inc.date}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                          inc.status === 'Open' ? 'bg-red-100 text-red-600' : 'bg-muted text-muted-foreground'
                        }`}>{inc.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Audit & Board Readiness */}
            <div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Audit & Board Readiness</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                  Prepare <ChevronRight className="size-3.5" />
                </Button>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div className="space-y-3">
                  {AUDIT.metrics.map(m => {
                    const total = 12
                    const filled = Math.round((m.pct / 100) * total)
                    return (
                      <div key={m.label} className="flex items-center justify-between gap-3">
                        <span className="text-xs text-foreground">{m.label}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-px">
                            {Array.from({ length: total }).map((_, i) => (
                              <div key={i} className={`w-1.5 ${i < filled ? m.color : 'bg-muted'}`} style={{ height: 12 }} />
                            ))}
                          </div>
                          <span className="text-xs font-semibold text-foreground tabular-nums w-7 text-right">{m.pct}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <Separator />
                <div className="space-y-2">
                  {AUDIT.checklist.map(item => (
                    <div key={item.label} className="flex items-center gap-2.5">
                      {item.done
                        ? <Check className="size-3.5 shrink-0 text-emerald-500" />
                        : <div className="size-3.5 shrink-0 rounded-full border border-muted-foreground/30" />
                      }
                      <p className={`text-xs ${item.done ? 'text-muted-foreground' : 'text-foreground'}`}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
      </div>

      {/* Push panel — slides in, pushes content */}
      <div className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${drawerOpen ? 'w-[380px]' : 'w-0'}`}>
        <ComplyAiPanel onClose={() => setDrawerOpen(false)} />
      </div>
    </div>
  )
}
