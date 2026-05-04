import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  ChevronRight,
  X,
  AlertCircle,
  CheckCircle2,
  FileText,
  Users,
  Sparkles,
  ListChecks,
  Flag,
  Circle,
  ShieldCheck,
} from 'lucide-react'
import { AiSummaryBar } from '@/components/shared/AiSummaryBar'
import Feature from '@/components/Feature'
import tenant from '@/config/tenant'

const t = tenant.pages.control

// ─── Data ────────────────────────────────────────────────────────────────────

const KPIS             = t.kpis
const MATTERS          = t.matters
const COMPLIANCE       = t.compliance
const FIRM_HEALTH      = t.firmHealthMetrics
const TEAM             = t.team
const AI_ACTIONS       = t.aiActions
const IMPORTANT_DATES  = t.importantDates
const UPCOMING_EVENTS  = t.upcomingEvents
const AI_SUMMARY       = t.aiSummary
const PRIORITIES       = t.priorities

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function Delta({ dir, delta }) {
  if (dir === 'up')   return <span className="flex items-center gap-0.5 text-xs text-emerald-700"><TrendingUp className="size-3" />{delta}</span>
  if (dir === 'down') return <span className="flex items-center gap-0.5 text-xs text-destructive"><TrendingDown className="size-3" />{delta}</span>
  return <span className="flex items-center gap-0.5 text-xs text-muted-foreground"><Minus className="size-3" />{delta}</span>
}

function ComplianceIcon({ status }) {
  if (status === 'good')    return <CheckCircle2 className="size-3.5 shrink-0 text-brand-400 mt-px" />
  if (status === 'warning') return <AlertCircle  className="size-3.5 shrink-0 text-amber-400 mt-px" />
  return                           <Clock        className="size-3.5 shrink-0 text-muted-foreground/50 mt-px" />
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

function AiPanel({ onClose }) {
  return (
    <div className="flex flex-col w-[380px] shrink-0 border-l border-border overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-brand-600" />
          <span className="text-sm font-medium text-foreground">AI Analysis</span>
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
            <Badge variant="secondary" className="text-xs h-4 px-1.5 ml-auto">{AI_ACTIONS.length} new</Badge>
          </div>
          <div className="space-y-2">
            {AI_ACTIONS.map((a) => (
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
            {PRIORITIES.map((p) => (
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

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ControlPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const now = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date())

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Greeting */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">{tenant.greeting ?? 'Good morning'}</h1>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              Updated 4 min ago &middot; {now}
            </span>
          </div>

          {/* AI Summary */}
          <Feature flag="FEATURE_AI_SUMMARY_BAR">
            <AiSummaryBar points={AI_SUMMARY} onOpenDrawer={() => setDrawerOpen(true)} />
          </Feature>

          {/* KPI row */}
          <div className="grid grid-cols-4 divide-x divide-border/60 border border-border/60 rounded overflow-hidden bg-white">
            {KPIS.map(k => (
              <div key={k.label} className="px-5 py-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">{k.label}</p>
                <p className={`font-medium tracking-tight mb-1.5 ${k.primary ? 'text-3xl text-brand-800' : 'text-2xl text-foreground'}`}>{k.value}</p>
                <Delta dir={k.dir} delta={k.delta} />
              </div>
            ))}
          </div>

          {/* Matters Overview */}
          <div className="border border-border/60 overflow-hidden rounded bg-white">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">{t.mattersOverview}</p>
                <span className="text-xs text-muted-foreground">{t.mattersOverviewSub}</span>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                View all <ChevronRight className="size-3.5" />
              </Button>
            </div>
            <div className="px-5 py-2">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-muted-foreground pl-0 w-[40%]">Matter</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Type</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground text-right">Days</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground text-right">Value</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground text-right pr-0">Lead</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MATTERS.map((m) => (
                    <TableRow key={m.name} className="border-border/60 cursor-pointer">
                      <TableCell className="pl-0 py-3">
                        <p className="text-sm font-medium text-foreground">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.client}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{m.type}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5 text-sm text-foreground">
                          <span className={`inline-block size-1.5 rounded-full shrink-0 ${MATTER_STATUS_DOT[m.status] ?? 'bg-slate-300'}`} />
                          {m.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground text-right">{m.days}d</TableCell>
                      <TableCell className="text-sm text-foreground text-right font-medium">{m.value}</TableCell>
                      <TableCell className="pr-0 text-right">
                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {m.lead}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Compliance | Firm Health | Team Workload */}
          <div className="border border-border/60 overflow-hidden rounded bg-white">
            <div className="grid grid-cols-3 divide-x divide-border/60">

              {/* Compliance */}
              <div>
                <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Compliance</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                    View report <ChevronRight className="size-3.5" />
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
                    {COMPLIANCE.map((item) => (
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

              {/* Firm Health */}
              <div>
                <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Firm Health</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                    View details <ChevronRight className="size-3.5" />
                  </Button>
                </div>
                <div className="px-5 py-4">
                  <div className="grid grid-cols-2 gap-px bg-border/40 overflow-hidden">
                    {FIRM_HEALTH.map((m) => (
                      <div key={m.label} className="bg-background p-3">
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                        <p className="text-2xl font-semibold text-foreground tracking-tight">
                          {m.value}{m.label === 'Client NPS' ? '' : '%'}
                        </p>
                        <div className={`flex items-center gap-1 text-xs ${m.above ? 'text-brand-600' : 'text-amber-500'}`}>
                          {m.above
                            ? <TrendingUp className="size-3 shrink-0" />
                            : <TrendingDown className="size-3 shrink-0" />}
                          <span>{m.delta} vs target {m.target}{m.label === 'Client NPS' ? '' : '%'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team Workload */}
              <div>
                <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Team Workload</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                    Manage team <ChevronRight className="size-3.5" />
                  </Button>
                </div>
                <div className="px-5 py-4">
                  <div className="space-y-0">
                    {TEAM.map((p) => (
                      <div key={p.name} className="flex items-center gap-3 py-2">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {p.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground leading-none">{p.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{p.role}</p>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">{p.matters} matters</span>
                        <CapacityBars util={p.util} level={p.level} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Activity Hub */}
          <div className="border border-border/60 overflow-hidden rounded bg-white">
            <Tabs defaultValue="priorities">
              <div className="flex items-center px-5 py-3 border-b border-border/60">
                <TabsList className="h-8 bg-muted/50 p-0.5 rounded-full gap-0.5">
                  <TabsTrigger value="priorities" className="h-7 rounded-full text-xs px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground">Priorities</TabsTrigger>
                  <TabsTrigger value="dates"      className="h-7 rounded-full text-xs px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground">Important Dates</TabsTrigger>
                  <TabsTrigger value="events"     className="h-7 rounded-full text-xs px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground">Upcoming Events</TabsTrigger>
                </TabsList>
              </div>

              {/* Priorities */}
              <TabsContent value="priorities" className="mt-0">
                <div className="px-5 py-3 space-y-2">
                  {PRIORITIES.map((p) => (
                    <div key={p.label} className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 hover:bg-muted/40 transition-colors cursor-pointer">
                      <Badge variant="outline" className={`text-xs h-5 px-1.5 shrink-0 ${priorityStyle[p.urgency]}`}>
                        {p.urgency.toUpperCase()}
                      </Badge>
                      <p className="flex-1 text-sm font-medium text-foreground min-w-0 truncate">{p.label}</p>
                      <span className="text-xs text-muted-foreground shrink-0">{p.due}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Important Dates */}
              <TabsContent value="dates" className="mt-0">
                <div className="px-5 py-3 space-y-2">
                  {IMPORTANT_DATES.map((d) => (
                    <div key={d.label} className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 hover:bg-muted/40 transition-colors cursor-pointer">
                      <div className={`flex flex-col items-center justify-center rounded-md px-2.5 py-1.5 shrink-0 w-14 text-center ${
                        d.urgency === 'overdue' ? 'bg-destructive/10' :
                        d.urgency === 'high'    ? 'bg-amber-50 border border-amber-200' :
                                                  'bg-muted'
                      }`}>
                        <span className={`text-xs font-medium uppercase tracking-wide ${d.urgency === 'overdue' ? 'text-destructive' : d.urgency === 'high' ? 'text-amber-600' : 'text-muted-foreground'}`}>{d.month}</span>
                        <span className={`text-xl font-semibold leading-tight ${d.urgency === 'overdue' ? 'text-destructive' : d.urgency === 'high' ? 'text-amber-700' : 'text-foreground'}`}>{d.day}</span>
                        <span className="text-xs text-muted-foreground">{d.year}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{d.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{d.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Upcoming Events */}
              <TabsContent value="events" className="mt-0">
                <div className="px-5 py-3 space-y-2">
                  {UPCOMING_EVENTS.map((e) => (
                    <div key={e.title} className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 hover:bg-muted/40 transition-colors cursor-pointer">
                      <div className="flex flex-col items-center justify-center rounded-md bg-muted px-2.5 py-1.5 shrink-0 w-14 text-center">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{e.month}</span>
                        <span className="text-xl font-semibold leading-tight text-foreground">{e.day}</span>
                        <span className="text-xs text-muted-foreground">{e.year}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{e.title}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="size-3" />{e.time}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Circle className="size-3" />{e.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

            </Tabs>
          </div>

        </div>
      </div>

      {/* Push panel — slides in, pushes content */}
      <div className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${drawerOpen ? 'w-[380px]' : 'w-0'}`}>
        <AiPanel onClose={() => setDrawerOpen(false)} />
      </div>
    </div>
  )
}
