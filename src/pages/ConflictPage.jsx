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
  Search, AlertTriangle, CheckCircle2, Clock, X, Sparkles,
  ListChecks, Users, TrendingUp, ShieldAlert, ChevronRight,
  Plus, Flag, AlertCircle,
} from 'lucide-react'
import tenant from '@/config/tenant'

// ─── Data ────────────────────────────────────────────────────────────────────

const t = tenant.pages.conflict

const CONFLICT_AI_POINTS = t.aiPoints

const CONFLICTS = [
  { name: 'Meridian Capital v. Hargrove Industries', ref: 'CON-001', client: 'Meridian Capital Partners', type: 'Actual',    risk: 'High',   status: 'Under Review', owner: 'Sarah Chen',     reviewed: '12 Feb 2026' },
  { name: 'Ashworth Foundation — Board Advisory',    ref: 'CON-002', client: 'Ashworth Foundation',       type: 'Perceived', risk: 'Medium', status: 'Managed',      owner: 'David Park',     reviewed: '08 Feb 2026' },
  { name: 'Nexus Pharma — Regulatory Filing',        ref: 'CON-003', client: 'Nexus Pharmaceuticals Inc', type: 'Potential', risk: 'Low',    status: 'Cleared',      owner: 'Maria Santos',   reviewed: '01 Feb 2026' },
  { name: 'Sterling Group — Joint Venture Dispute',  ref: 'CON-004', client: 'Sterling Group Holdings',   type: 'Actual',    risk: 'High',   status: 'Open',         owner: 'Richard Okafor', reviewed: '14 Feb 2026' },
  { name: 'Whitmore Estate — Succession Planning',   ref: 'CON-005', client: 'Whitmore Family Estate',    type: 'Perceived', risk: 'Low',    status: 'Managed',      owner: 'Helen Drayton',  reviewed: '05 Feb 2026' },
  { name: 'Caldwell & Reid — M&A Advisory',         ref: 'CON-006', client: 'Caldwell & Reid LLP',       type: 'Potential', risk: 'Medium', status: 'Under Review', owner: 'James Liu',      reviewed: '10 Feb 2026' },
]

const ACTIVE_MONITORING = [
  { name: 'Meridian Capital v. Hargrove Industries', ref: 'CON-001', owner: 'Sarah Chen',     nextReview: '28 Feb 2026', status: 'Under Review', urgency: 'high'   },
  { name: 'Ashworth Foundation — Board Advisory',    ref: 'CON-002', owner: 'David Park',     nextReview: '15 Mar 2026', status: 'Managed',      urgency: 'low'    },
  { name: 'Sterling Group — Joint Venture Dispute',  ref: 'CON-004', owner: 'Richard Okafor', nextReview: '21 Feb 2026', status: 'Open',         urgency: 'high'   },
  { name: 'Whitmore Estate — Succession Planning',   ref: 'CON-005', owner: 'Helen Drayton',  nextReview: '01 May 2026', status: 'Managed',      urgency: 'low'    },
]

const RELATED_PARTIES = [
  { desc: 'James Thornton appears in 3 matters across 2 clients' },
  { desc: 'Pacific Ventures LLC linked to Sterling Group via shared directorship' },
  { desc: 'Mark Halstead (CON-006) previously connected to Sovereign Capital advisory' },
]

const RISK_PATTERNS = [
  { desc: 'M&A advisory matters show 40% higher conflict incidence this quarter' },
  { desc: 'Cross-referral matters between Private Client and Corporate have elevated perceived conflict risk' },
  { desc: '3 conflicts pending review beyond the 14-day SLA threshold' },
]

const KPIS = [
  { label: 'Total Conflicts',    value: '6',  sub: '6 of 12 managed',   alert: false },
  { label: 'Under Review',       value: '2',  sub: 'Awaiting resolution', alert: true  },
  { label: 'High Risk',          value: '2',  sub: 'Require escalation',  alert: true  },
  { label: 'Cleared This Month', value: '3',  sub: 'Closed or waived',    alert: false },
]

const AI_ACTIONS = t.aiActions

const priorityStyle = {
  High:   'border-amber-300 bg-amber-50 text-amber-700',
  Medium: 'border-slate-200 bg-slate-50 text-slate-600',
  Low:    'border-slate-200 bg-slate-50 text-slate-400',
}

// ─── Style maps ──────────────────────────────────────────────────────────────

const TYPE_TOOLTIP = {
  Actual:    'A confirmed conflict of interest exists',
  Perceived: 'Appears to conflict to a reasonable observer',
  Potential: 'A conflict may arise in the future',
}

const RISK_PILL = {
  High:   'bg-amber-200 text-slate-800',
  Medium: 'bg-violet-100 text-slate-800',
  Low:    'bg-blue-100 text-slate-800',
}

const STATUS_STYLE = {
  'Under Review': { dot: 'bg-indigo-500',  text: 'text-indigo-600'       },
  'Managed':      { dot: 'bg-emerald-400', text: 'text-muted-foreground' },
  'Cleared':      { dot: 'bg-slate-300',   text: 'text-muted-foreground' },
  'Open':         { dot: 'bg-red-400',     text: 'text-red-600'          },
}

const MONITOR_STATUS_PILL = {
  'Under Review': 'bg-indigo-50 text-indigo-600',
  'Managed':      'bg-emerald-50 text-emerald-600',
  'Open':         'bg-red-100 text-red-600',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ children }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
      {children}
    </div>
  )
}

function ConflictAiPanel({ onClose }) {
  return (
    <div className="flex flex-col w-[380px] shrink-0 border-l border-border overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-brand-600" />
          <span className="text-sm font-semibold text-foreground">Conflict Analysis</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="size-7 text-muted-foreground">
          <X className="size-4" />
        </Button>
      </div>

      <div className="flex-1 px-5 py-4 space-y-6">

        {/* Related Parties */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Related Parties Detected</h3>
            <Badge variant="secondary" className="text-xs h-4 px-1.5 ml-auto">{RELATED_PARTIES.length}</Badge>
          </div>
          <div>
            {RELATED_PARTIES.map((p, i) => (
              <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-border last:border-0">
                <span className="size-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <p className="text-xs text-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Risk Patterns */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Risk Patterns</h3>
          </div>
          <div>
            {RISK_PATTERNS.map((p, i) => (
              <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-border last:border-0">
                <span className="size-1.5 rounded-full bg-brand-400 shrink-0 mt-1.5" />
                <p className="text-xs text-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Suggested Actions */}
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

export default function ConflictPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [checkInput, setCheckInput] = useState('')
  const [checkResult, setCheckResult] = useState(null)

  function handleConflictCheck() {
    if (!checkInput.trim()) return
    const query = checkInput.toLowerCase()
    const matches = CONFLICTS.filter(c =>
      c.name.toLowerCase().includes(query) || c.client.toLowerCase().includes(query)
    )
    setCheckResult(matches.length > 0 ? { status: 'found', matches } : { status: 'clear', query: checkInput })
  }

  const filteredConflicts = CONFLICTS.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.client.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Conflict Management</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Identify, assess and manage conflicts with clarity. Track potential, actual and perceived conflicts across clients, matters and relationships.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  <span className="size-1.5 rounded-full bg-amber-400" /> Active conflicts: 6
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                  Pending review: 3
                </span>
              </div>
            </div>
            <Button size="sm" className="gap-1.5 shrink-0">
              <Plus className="size-4" /> Declare Conflict
            </Button>
          </div>

          {/* AI Summary */}
          <Feature flag="FEATURE_AI_SUMMARY_BAR">
            <AiSummaryBar points={CONFLICT_AI_POINTS} onOpenDrawer={() => setDrawerOpen(true)} />
          </Feature>

          {/* Conflict Check */}
          <div className="border border-slate-200 bg-slate-50/60 overflow-hidden rounded">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <ShieldAlert className="size-4 text-slate-500" />
                <p className="text-sm font-medium text-foreground">Run a Conflict Check</p>
              </div>
            </div>
            <div className="px-5 py-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Enter a client name, entity, individual or matter reference to screen for potential conflicts of interest across all active and historical records.
              </p>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Client name, entity, individual or matter reference…"
                    value={checkInput}
                    onChange={e => { setCheckInput(e.target.value); setCheckResult(null) }}
                    onKeyDown={e => e.key === 'Enter' && handleConflictCheck()}
                    className="w-full h-9 pl-9 pr-4 text-sm rounded border border-border/60 bg-background focus:outline-none focus:ring-1 focus:ring-brand-300 placeholder:text-muted-foreground/50"
                  />
                </div>
                <Button onClick={handleConflictCheck} className="gap-1.5 shrink-0">
                  <ShieldAlert className="size-3.5" /> Run Conflict Check
                </Button>
              </div>

              {/* Results */}
              {checkResult && (
                <div className={`rounded border px-4 py-3 ${checkResult.status === 'clear' ? 'border-emerald-200 bg-emerald-50/50' : 'border-amber-200 bg-amber-50/40'}`}>
                  {checkResult.status === 'clear' ? (
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      <p className="text-sm text-emerald-700">No conflicts found for <span className="font-medium">"{checkResult.query}"</span> across all active and historical records.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <AlertTriangle className="size-4 text-amber-500 shrink-0" />
                        <p className="text-sm font-medium text-amber-700">{checkResult.matches.length} potential conflict{checkResult.matches.length > 1 ? 's' : ''} detected</p>
                      </div>
                      <div className="space-y-0">
                        {checkResult.matches.map(m => {
                          const st = STATUS_STYLE[m.status] ?? STATUS_STYLE['Managed']
                          return (
                            <div key={m.ref} className="flex items-center justify-between gap-4 py-2 border-b border-amber-200/60 last:border-0">
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                                <p className="text-xs text-muted-foreground">{m.ref} · {m.client}</p>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <div className="relative inline-flex group">
                                  <span className="inline-flex items-center px-2 h-5 rounded-full border border-border text-xs text-muted-foreground">{m.type}</span>
                                  <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded text-xs font-medium bg-foreground text-background whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">{TYPE_TOOLTIP[m.type]}</div>
                                </div>
                                <span className={`flex items-center gap-1.5 text-xs ${st.text}`}>
                                  <span className={`size-1.5 rounded-full ${st.dot}`} />{m.status}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

{/* Conflict Register */}
          <div className="border border-border/60 overflow-hidden rounded bg-white">
            <SectionHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Conflict Register</p>
                  <span className="text-xs text-muted-foreground">{CONFLICTS.length} records</span>
                </div>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search conflicts, clients, matters…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="h-7 pl-8 pr-3 text-xs rounded border border-border/60 bg-background focus:outline-none focus:ring-1 focus:ring-brand-300 w-64 placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>
              <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs">
                <Plus className="size-3.5" /> New Conflict
              </Button>
            </SectionHeader>
            <div className="px-5 py-1">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-muted-foreground pl-0 w-[32%]">Conflict</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-[20%]">Client / Matter</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Type</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Risk</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Owner</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground pr-0">Last Reviewed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConflicts.map(c => {
                    const st = STATUS_STYLE[c.status] ?? STATUS_STYLE['Managed']
                    return (
                      <TableRow key={c.ref} className="border-border/60 cursor-pointer">
                        <TableCell className="pl-0 py-3">
                          <p className="text-sm font-medium text-foreground">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.ref}</p>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{c.client}</TableCell>
                        <TableCell>
                          <div className="relative inline-flex group">
                          <span className="inline-flex items-center px-2 h-5 rounded-full border border-border text-xs text-muted-foreground">{c.type}</span>
                          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded text-xs font-medium bg-foreground text-background whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">{TYPE_TOOLTIP[c.type]}</div>
                        </div>
                        </TableCell>
                        <TableCell>
                        <span className={`inline-flex items-center px-2 h-5 rounded text-xs font-medium ${RISK_PILL[c.risk]}`}>{c.risk}</span>
                      </TableCell>
                        <TableCell>
                          <span className={`flex items-center gap-1.5 text-xs ${st.text}`}>
                            <span className={`size-1.5 rounded-full shrink-0 ${st.dot}`} />
                            {c.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="relative inline-flex group">
                            <div className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                              {c.owner.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded text-xs font-medium bg-foreground text-background whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                              {c.owner}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground pr-0">{c.reviewed}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Active Monitoring + Insights */}
          <div className="grid grid-cols-12 gap-6">

            {/* Active Monitoring */}
            <div className="col-span-7 border border-border/60 overflow-hidden rounded bg-white">
              <SectionHeader>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Active Monitoring</p>
                  <span className="text-xs text-muted-foreground">{ACTIVE_MONITORING.length} conflicts</span>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                  View all <ChevronRight className="size-3.5" />
                </Button>
              </SectionHeader>
              <div>
                {ACTIVE_MONITORING.map((m, i) => {
                  const pill = MONITOR_STATUS_PILL[m.status] ?? 'bg-slate-100 text-slate-500'
                  return (
                    <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{m.ref} · {m.owner}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className={`size-3.5 ${m.urgency === 'high' ? 'text-amber-400' : 'text-muted-foreground/50'}`} />
                          {m.nextReview}
                        </div>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${pill}`}>{m.status}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Conflict Insights */}
            <div className="col-span-5 border border-border/60 overflow-hidden rounded bg-white">
              <SectionHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Conflict Insights</p>
                </div>
              </SectionHeader>

              {/* Related Parties */}
              <div className="px-5 pt-4 pb-2">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="size-3.5 text-muted-foreground" />
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Related Parties Detected</p>
                </div>
                <div>
                  {RELATED_PARTIES.map((p, i) => (
                    <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-border/60 last:border-0">
                      <span className="size-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                      <p className="text-xs text-foreground leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="opacity-60" />

              {/* Risk Patterns */}
              <div className="px-5 pt-4 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="size-3.5 text-muted-foreground" />
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Risk Patterns</p>
                </div>
                <div>
                  {RISK_PATTERNS.map((p, i) => (
                    <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-border/60 last:border-0">
                      <span className="size-1.5 rounded-full bg-brand-400 shrink-0 mt-1.5" />
                      <p className="text-xs text-foreground leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Push panel */}
      <div className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${drawerOpen ? 'w-[380px]' : 'w-0'}`}>
        <ConflictAiPanel onClose={() => setDrawerOpen(false)} />
      </div>
    </div>
  )
}
