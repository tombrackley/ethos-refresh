import { useState } from 'react'
import { AiSummaryBar } from '@/components/shared/AiSummaryBar'
import Feature from '@/components/Feature'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AlertTriangle,
  Shield,
  MessageSquare,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Plus,
  X,
  Zap,
  Lightbulb,
  Clock,
  ListChecks,
  BarChart2,
  FileText,
} from 'lucide-react'
import tenant from '@/config/tenant'

const t = tenant.pages.incident

const INCIDENT_AI_POINTS = t.aiPoints

const INCIDENT_AI_ACTIONS = t.aiActions

const ESCALATION_ITEMS = [
  { id: 'INC-2026-007', title: 'Phishing attack', note: 'Consider escalating to ICO notification given potential access to client communications. 72-hour window approaching.' },
  { id: 'INC-2026-001', title: 'Data breach', note: 'Recommend board-level reporting given the severity classification and regulatory notification status.' },
]

const COMPLAINT_THEMES = [
  { label: 'Service delivery delays',  count: 3, trend: 'up' },
  { label: 'Billing & transparency',   count: 2, trend: 'flat' },
  { label: 'Communication gaps',       count: 2, trend: 'down' },
  { label: 'Confidentiality concerns', count: 1, trend: 'up' },
]

const RECURRING_ISSUES = [
  'Resource allocation during peak periods',
  'Email security and autofill protocols',
  'Regulatory reporting timeliness',
  'Billing narrative transparency',
]

const INCIDENTS = t.incidents ?? []

const TYPE_ICON = {
  Breach:      Shield,
  Complaint:   MessageSquare,
  Incident:    AlertTriangle,
  'Near miss': Eye,
  'CPS 230 Operational Incident': AlertTriangle,
  'FAR Accountability Breach':    Shield,
}

const TYPE_COLOR = {
  Breach:      'text-red-500',
  Complaint:   'text-blue-500',
  Incident:    'text-amber-500',
  'Near miss': 'text-slate-400',
  'CPS 230 Operational Incident': 'text-amber-500',
  'FAR Accountability Breach':    'text-red-500',
}

const SEVERITY_PILL = {
  Critical: 'bg-pink-300 text-slate-800',
  High:     'bg-amber-200 text-slate-800',
  Medium:   'bg-violet-100 text-slate-800',
  Low:      'bg-blue-100 text-slate-800',
}

const STATUS_CHIP = {
  Investigating:         { dot: 'bg-indigo-500',   text: 'text-indigo-600'       },
  Open:                  { dot: 'bg-red-400',       text: 'text-red-600'          },
  Resolved:              { dot: 'bg-emerald-400',   text: 'text-emerald-600'      },
  Closed:                { dot: 'bg-slate-300',     text: 'text-muted-foreground' },
  'Reported externally': { dot: 'bg-amber-400',     text: 'text-amber-700'        },
}

function SegBar({ count, max, color = 'bg-brand-300' }) {
  const filled = max > 0 ? Math.round((count / max) * 12) : 0
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className={`h-[6px] w-1.5 rounded-[2px] ${i < filled ? color : 'bg-border/60'}`} />
      ))}
    </div>
  )
}

function SectionHeader({ children }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
      {children}
    </div>
  )
}

function IncidentAiPanel({ onClose }) {
  return (
    <div className="flex flex-col h-full border-l border-border/60 bg-background">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-800 text-white">
            <Zap className="size-3" />
          </div>
          <span className="text-sm font-semibold">Ethos AI</span>
          <Badge className="text-xs px-1.5 py-0 bg-emerald-100 text-emerald-700 border-emerald-200">Active</Badge>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Pattern Detection */}
        <div className="px-4 py-4 border-b border-border/60">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp className="size-3.5 text-brand-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pattern Detection</span>
          </div>
          <ul className="space-y-2.5">
            {INCIDENT_AI_POINTS.slice(0, 3).map((pt, i) => (
              <li key={i} className="flex gap-2 text-xs text-foreground/80 leading-relaxed">
                <span className="mt-0.5 shrink-0 text-muted-foreground">›</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Escalation Suggestions */}
        <div className="px-4 py-4 border-b border-border/60">
          <div className="flex items-center gap-1.5 mb-3">
            <AlertTriangle className="size-3.5 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Escalation Suggestions</span>
          </div>
          <ul className="space-y-3">
            {ESCALATION_ITEMS.map((item) => (
              <li key={item.id} className="text-xs leading-relaxed">
                <span className="font-medium text-foreground">{item.id} ({item.title}):</span>{' '}
                <span className="text-foreground/80">{item.note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Similar Past Incidents */}
        <div className="px-4 py-4 border-b border-border/60">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="size-3.5 text-slate-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Similar Past Incidents</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Select an incident from the Live Register to view similar past incidents and contextual recommendations.
          </p>
        </div>

        {/* Suggested Actions */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Lightbulb className="size-3.5 text-brand-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggested Actions</span>
          </div>
          <ul className="space-y-3">
            {INCIDENT_AI_ACTIONS.map((action, i) => (
              <li key={i} className="border border-border/60 rounded p-3 space-y-2">
                <p className="text-xs leading-relaxed text-foreground/90">{action.text}</p>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border/60 rounded px-2 py-1 transition-colors">
                  <ListChecks className="size-3" />
                  Add to Work Tasks
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground/60 leading-relaxed">
            AI insights are generated from incident data patterns and should be reviewed by qualified personnel before action.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function IncidentPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [search, setSearch]               = useState('')
  const [typeFilter, setTypeFilter]       = useState('all')
  const [statusFilter, setStatusFilter]   = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [ownerFilter, setOwnerFilter]     = useState('all')

  const typeCounts = {
    Incidents:     INCIDENTS.filter(i => i.type === 'Incident').length,
    Complaints:    INCIDENTS.filter(i => i.type === 'Complaint').length,
    Breaches:      INCIDENTS.filter(i => i.type === 'Breach').length,
    'Near misses': INCIDENTS.filter(i => i.type === 'Near miss').length,
  }
  const typeMax = Math.max(...Object.values(typeCounts))

  const owners = [...new Set(INCIDENTS.map(i => i.owner))]
  const [rightTab, setRightTab] = useState('themes')

  const filtered = INCIDENTS.filter(inc => {
    const q = search.toLowerCase()
    if (q && !inc.title.toLowerCase().includes(q) && !inc.client.toLowerCase().includes(q) && !inc.owner.toLowerCase().includes(q)) return false
    if (typeFilter !== 'all' && inc.type !== typeFilter) return false
    if (statusFilter !== 'all' && inc.status !== statusFilter) return false
    if (severityFilter !== 'all' && inc.severity !== severityFilter) return false
    if (ownerFilter !== 'all' && inc.owner !== ownerFilter) return false
    return true
  })

  return (
    <div className="flex flex-1">
      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Incidents, Complaints & Breaches</h1>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs font-medium">3 active</Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl">
              Capture, manage and resolve issues with confidence. Track incidents, complaints and regulatory breaches from identification through to resolution and evidence.
            </p>
          </div>
          <Button size="sm" className="bg-brand-800 hover:bg-brand-700 text-white gap-1.5 shrink-0">
            <Plus className="size-3.5" />
            Report incident or complaint
          </Button>
        </div>

        {/* AI Summary Bar */}
        <Feature flag="FEATURE_AI_SUMMARY_BAR">
          <AiSummaryBar points={INCIDENT_AI_POINTS} onOpenDrawer={() => setDrawerOpen(true)} />
        </Feature>

        {/* KPI Row */}
        <div className="grid grid-cols-4 divide-x divide-border/60 border border-border/60 rounded overflow-hidden bg-white">
          {[
            { label: 'Total Records', value: 7, sub: 'All types combined',       icon: ListChecks,    iconColor: 'text-brand-600'  },
            { label: 'Open / Active', value: 3, sub: '3 resolved or closed',     icon: AlertTriangle, iconColor: 'text-amber-500'  },
            { label: 'High-Risk',     value: 3, sub: 'Critical or high severity', icon: Shield,        iconColor: 'text-red-500'    },
            { label: 'Recurring',     value: 4, sub: 'Identified patterns',       icon: RefreshCw,     iconColor: 'text-purple-500' },
          ].map(({ label, value, sub, icon: Icon, iconColor }) => (
            <div key={label} className="px-5 py-4">
              <div className="flex items-start justify-between mb-1">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
                <Icon className={`size-4 ${iconColor}`} />
              </div>
              <div className="text-2xl font-medium text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Middle row: single panel, columns divided */}
        <div className="border border-border/60 overflow-hidden rounded bg-white">
          <SectionHeader>
            <div className="flex items-center gap-2">
              <BarChart2 className="size-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Activity Overview</p>
            </div>
          </SectionHeader>
          <div className="grid grid-cols-12 divide-x divide-border/60">

            {/* Left: By Type */}
            <div className="col-span-7 px-5 py-4">
              <p className="text-xs font-medium text-muted-foreground mb-3">By Type</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {Object.entries(typeCounts).map(([label, count]) => (
                  <div key={label} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">{label}</span>
                      <span className="text-xs text-muted-foreground">{count}</span>
                    </div>
                    <SegBar count={count} max={typeMax} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Complaint Themes / Recurring Issues (tabbed) */}
            <div className="col-span-5">
              {/* Tab bar */}
              <div className="flex border-b border-border/60">
                {[
                  { key: 'themes',    label: 'Complaint Themes' },
                  { key: 'recurring', label: 'Recurring Issues'  },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setRightTab(tab.key)}
                    className={`px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
                      rightTab === tab.key
                        ? 'border-brand-800 text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {/* Tab content */}
              {rightTab === 'themes' ? (
                <div className="divide-y divide-border/60">
                  {COMPLAINT_THEMES.map(({ label, count, trend }) => (
                    <div key={label} className="flex items-center justify-between px-5 py-2.5">
                      <span className="text-sm text-foreground">{label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{count}</span>
                        {trend === 'up'   && <TrendingUp   className="size-3.5 text-red-500" />}
                        {trend === 'down' && <TrendingDown className="size-3.5 text-emerald-500" />}
                        {trend === 'flat' && <Minus        className="size-3.5 text-muted-foreground" />}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-4 space-y-3">
                  {RECURRING_ISSUES.map((issue, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <RefreshCw className="size-3.5 text-purple-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground">{issue}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Live Register */}
        <div className="border border-border/60 overflow-hidden rounded bg-white">
          <SectionHeader>
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Live Register</p>
              <span className="text-xs text-muted-foreground">{filtered.length} of {INCIDENTS.length} records</span>
            </div>
          </SectionHeader>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-border/60">
            <div className="relative flex-1 min-w-[180px]">
              <Input
                placeholder="Search by title, client, owner..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-8 text-xs pl-7"
              />
              <svg className="absolute left-2 top-2 size-4 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            {[
              { value: typeFilter,     setter: setTypeFilter,     options: ['all', 'Breach', 'Complaint', 'Incident', 'Near miss'],                                                          placeholder: 'All types'      },
              { value: statusFilter,   setter: setStatusFilter,   options: ['all', 'Investigating', 'Open', 'Resolved', 'Closed', 'Reported externally'],                                   placeholder: 'All statuses'   },
              { value: severityFilter, setter: setSeverityFilter, options: ['all', 'Critical', 'High', 'Medium', 'Low'],                                                                     placeholder: 'All severities' },
              { value: ownerFilter,    setter: setOwnerFilter,    options: ['all', ...owners],                                                                                               placeholder: 'All owners'     },
            ].map(({ value, setter, options, placeholder }) => (
              <select
                key={placeholder}
                value={value}
                onChange={e => setter(e.target.value)}
                className="h-8 text-xs px-2.5 rounded border border-border/60 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-brand-300 cursor-pointer"
              >
                {options.map(o => (
                  <option key={o} value={o}>{o === 'all' ? placeholder : o}</option>
                ))}
              </select>
            ))}
          </div>

          {/* Table */}
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="text-left px-5 py-2.5 font-medium text-muted-foreground w-[100px]">TYPE</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">TITLE</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">CLIENT / MATTER</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-[100px]">SEVERITY</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-[170px]">STATUS</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-[60px]">OWNER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((inc) => {
                const Icon = TYPE_ICON[inc.type] || AlertTriangle
                return (
                  <tr key={inc.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <Icon className={`size-3.5 shrink-0 ${TYPE_COLOR[inc.type]}`} />
                        <span className="text-muted-foreground">{inc.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground max-w-[220px] truncate">{inc.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="truncate block max-w-[160px]">{inc.client} / {inc.matter}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 h-5 rounded text-xs font-medium ${SEVERITY_PILL[inc.severity]}`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${STATUS_CHIP[inc.status].text}`}>
                        <span className={`size-1.5 rounded-full shrink-0 ${STATUS_CHIP[inc.status].dot}`} />
                        <span className="truncate">{inc.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative inline-flex group">
                        <div className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {inc.owner.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded text-xs font-medium bg-foreground text-background whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                          {inc.owner}
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">No records match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>{/* end max-w-7xl */}
      </div>

      {/* AI Panel */}
      <div className={`shrink-0 overflow-hidden transition-all duration-300 ${drawerOpen ? 'w-[380px]' : 'w-0'}`}>
        {drawerOpen && <IncidentAiPanel onClose={() => setDrawerOpen(false)} />}
      </div>
    </div>
  )
}
