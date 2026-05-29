import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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
  Clock,
  ChevronRight,
  ChevronDown,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ListChecks,
  Flag,
  ShieldCheck,
  Activity,
  ClipboardCheck,
  DollarSign,
  Minus,
  AlertTriangle,
  Hourglass,
  Check,
  Maximize2,
  Lock,
  Users,
  GraduationCap,
  ClipboardList,
  CircleDashed,
  MoreHorizontal,
  Search,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { IconLayersThree } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconLayersThree'
import { IconChevronTriangleUpSmall } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconChevronTriangleUpSmall'
import { IconChevronTriangleDownSmall } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconChevronTriangleDownSmall'
import { cn } from '@/lib/utils'
import tenant from '@/config/tenant'

const t = tenant.pages.control

// ─── Data ────────────────────────────────────────────────────────────────────

const MATTERS          = t.matters
const COMPLIANCE       = t.compliance
const FIRM_HEALTH      = t.firmHealthMetrics
const TEAM             = t.team
const AI_ACTIONS       = t.aiActions
const PRIORITIES       = t.priorities

// Resolve a matter's `lead` initials to the full team-member name so the
// Matters row meta can read "James Walker · Active" rather than "JW · Active".
const LEAD_NAMES = Object.fromEntries(TEAM.map((p) => [p.initials, p.name]))

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

// ─── Style maps ───────────────────────────────────────────────────────────────

const priorityStyle = {
  High:   'border-amber-300 bg-amber-50 text-amber-700',
  Medium: 'border-slate-200 bg-slate-50 text-slate-600',
  Low:    'border-slate-200 bg-slate-50 text-slate-400',
}

// Background palette for the Insights-style priority pill (mono / rounded-full)
// — defined for future use on the Priorities widget; not currently applied.
const PRIORITY_BADGE_BG = {
  High:   'bg-[#FFE5E8]',
  Medium: 'bg-[#FFF3B7]',
  Low:    'bg-[#E5E7EB]',
}

// Status-dot colours used on the Active Matters row badges (matches Figma
// 284:1738 — red for review, green for active, grey for on hold).
const MATTER_STATUS_DOT = {
  Active:    'bg-[#00bc7d]',
  Review:    'bg-[#c1412b]',
  'On Hold': 'bg-[#828c9b]',
}

// Severity-dot colours for the Risk Rating widget.
const RISK_SEVERITY_DOT = {
  Critical: 'bg-[#c1412b]',
  High:     'bg-[#d97706]',
  Medium:   'bg-[#6181c9]',
  Low:      'bg-[#828c9b]',
}

// Background palette for the severity pill — mirrors the Priorities widget
// (pink / amber / yellow / grey) so the visual language matches.
const RISK_SEVERITY_BADGE_BG = {
  Critical: 'bg-[#FFE5E8]',
  High:     'bg-[#FFE5BB]',
  Medium:   'bg-[#FFF3B7]',
  Low:      'bg-[#E5E7EB]',
}

// Row background tints for the Risk Rating widget — mirror the Compliance
// pill rows. Only Critical gets a pink tint; High and Medium share the same
// grey as Compliance's warning/neutral rows; Low gets the mint.
const RISK_SEVERITY_BG = {
  Critical: 'bg-[#fff7f7]',
  High:     'bg-[#fcfcfc]',
  Medium:   'bg-[#fcfcfc]',
  Low:      'bg-[#fafffb]',
}
const RISK_SEVERITY_BG_HOVER = {
  Critical: 'hover:bg-[#ffefef]',
  High:     'hover:bg-[#f3f3f3]',
  Medium:   'hover:bg-[#f3f3f3]',
  Low:      'hover:bg-[#eafff0]',
}

// Severity → number of bars filled (out of 4) and the colour applied to them.
// Unfilled bars are rendered greyed in the SignalBars component.
const RISK_SEVERITY_BARS = {
  Critical: 4,
  High:     3,
  Medium:   2,
  Low:      1,
}
const RISK_SEVERITY_ICON_COLOR = {
  Critical: 'text-[#c1412b]',
  High:     'text-[#d97706]',
  Medium:   'text-[#6181c9]',
  Low:      'text-[#2aa16a]',
}
// Small tinted backplate behind the signal-bars icon — matches the Figma
// 285:3707 row icon chip palette.
const RISK_SEVERITY_ICON_BG = {
  Critical: 'bg-[#ffdfdf]',
  High:     'bg-[#fff4e1]',
  Medium:   'bg-[#ebf6ff]',
  Low:      'bg-[#e8fff6]',
}

// Mocked risk categories — each row is a category that rolls up the
// individual risks underneath. `severity` is the highest severity across
// the category; `count` is the open-risk count; `sub` feeds the tooltip.
// Would come from the risk register service in production.
const RISKS = [
  { name: 'Regulatory & Compliance',      severity: 'Critical', count: 4, sub: '4 risks · 1 critical rising · 2 high' },
  { name: 'Cyber & Information Security', severity: 'High',     count: 3, sub: '3 risks · 1 high steady · 2 medium' },
  { name: 'Financial',                    severity: 'High',     count: 2, sub: '2 risks · 1 high rising · 1 medium' },
  { name: 'People & Culture',             severity: 'Medium',   count: 2, sub: '2 risks · 2 medium steady' },
  { name: 'Operational',                  severity: 'Low',      count: 4, sub: '4 risks · 3 low falling · 1 medium' },
  { name: 'ESG & Climate',                severity: 'Low',      count: 1, sub: '1 risk · steady' },
]

const RISK_SEVERITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 }
const SORTED_RISKS = [...RISKS].sort(
  (a, b) => (RISK_SEVERITY_ORDER[a.severity] ?? 99) - (RISK_SEVERITY_ORDER[b.severity] ?? 99),
)

// Detailed risk register for the Risks drawer — categories with the
// individual risk statements underneath and the items causing each risk.
// Would come from the risk register service in production.
const RISK_REGISTER = [
  {
    category: 'Regulatory & Compliance', severity: 'Critical', count: 4,
    risks: [
      { name: 'Director personal liability under FAR', severity: 'Critical', owner: 'JW',
        causes: ['Updated ASIC guidance (Mar 2026)', '3 accountability statements overdue', 'Reasonable-steps documentation gap'] },
      { name: 'Privacy Act reform — data classification', severity: 'High', owner: 'KL',
        causes: ['New data classification requirements', 'Mitigation plan not yet board-approved'] },
      { name: 'AML/CTF program — new threshold rules', severity: 'Medium', owner: 'SM',
        causes: ['AUSTRAC guidance Mar 2026', 'Threshold testing remediation underway'] },
    ],
  },
  {
    category: 'Cyber & Information Security', severity: 'High', count: 3,
    risks: [
      { name: 'Backup verification gap', severity: 'High', owner: 'DP',
        causes: ['Quarterly restore tests overdue', 'DR plan last reviewed 2023'] },
      { name: 'Vendor cyber posture', severity: 'Medium', owner: 'DP',
        causes: ['2 vendors flagged in supply-chain review', 'SOC 2 reports outstanding'] },
    ],
  },
  {
    category: 'Financial', severity: 'High', count: 2,
    risks: [
      { name: 'Client concentration risk', severity: 'High', owner: 'SM',
        causes: ['Top 3 clients = 47% revenue', 'No active diversification strategy'] },
      { name: 'Working-capital exposure', severity: 'Medium', owner: 'SM',
        causes: ['DSO trending up 8 days vs target'] },
    ],
  },
  {
    category: 'People & Culture', severity: 'Medium', count: 2,
    risks: [
      { name: 'Key-person succession', severity: 'Medium', owner: 'JW',
        causes: ['2 partners with no documented successor', 'Succession plan due Q3'] },
      { name: 'Talent retention', severity: 'Medium', owner: 'JW',
        causes: ['Voluntary turnover up vs prior year'] },
    ],
  },
  {
    category: 'Operational', severity: 'Low', count: 4,
    risks: [
      { name: 'Office continuity', severity: 'Low', owner: 'SM',
        causes: ['BCP rehearsal scheduled May 2026'] },
      { name: 'Document management migration', severity: 'Low', owner: 'KL',
        causes: ['Phase 2 cutover Q2 — on track'] },
    ],
  },
  {
    category: 'ESG & Climate', severity: 'Low', count: 1,
    risks: [
      { name: 'Climate disclosure readiness', severity: 'Low', owner: 'RL',
        causes: ['AASB S2 training in progress', 'Scope 1 / 2 baseline complete'] },
    ],
  },
]

const COMPLIANCE_STATUS_TEXT = {
  good:    'text-[#2aa16a]',
  warning: 'text-[#c1412b]',
  neutral: 'text-[#c1412b]',
}

// Row background tints used on the Compliance card. Matches the Figma
// 284:1994 — light grey for warning/neutral, mint for good.
const COMPLIANCE_STATUS_BG = {
  good:    'bg-[#fafffb]',
  warning: 'bg-[#fcfcfc]',
  neutral: 'bg-[#fcfcfc]',
}

// Slight darker shade on hover so each row keeps its tint cue while still
// signalling interactivity.
const COMPLIANCE_STATUS_BG_HOVER = {
  good:    'hover:bg-[#eafff0]',
  warning: 'hover:bg-[#f3f3f3]',
  neutral: 'hover:bg-[#f3f3f3]',
}

// Extra metadata for each compliance item, surfaced in the checklist dialog
// (icon and a longer description). Keyed by the item's `label`.
const COMPLIANCE_TASK_META = {
  'AML / KYC Reviews':  { icon: Lock,           description: 'Anti-money-laundering and know-your-client reviews kept current for every active client.' },
  'Conflict Checks':    { icon: Users,          description: 'Run conflict-of-interest checks on all new and ongoing matters.' },
  'CPD Requirements':   { icon: GraduationCap,  description: 'Continuing professional development requirements tracked per individual.' },
  'Data Protection':    { icon: ShieldCheck,    description: 'Data protection assessments, processing register, and breach response readiness.' },
  'Risk Assessments':   { icon: ClipboardList,  description: 'Annual risk assessment reviewed and approved by the risk committee.' },
}

// Render order for the Compliance card: overdue/warning first, in progress
// next, up-to-date at the bottom.
const COMPLIANCE_STATUS_ORDER = { warning: 0, neutral: 1, good: 2 }
const SORTED_COMPLIANCE = [...COMPLIANCE].sort(
  (a, b) => (COMPLIANCE_STATUS_ORDER[a.status] ?? 99) - (COMPLIANCE_STATUS_ORDER[b.status] ?? 99),
)

// Render order for the Team Utilisation card: "Ready" (low workload) at the
// top, then everyone else in source order.
const SORTED_TEAM = [...TEAM].sort((a, b) => (a.level === 'good' ? 0 : 1) - (b.level === 'good' ? 0 : 1))

// Chart variant orders by capacity descending so the most-stretched team
// member is at the top of the bar chart.
const SORTED_TEAM_BY_UTIL = [...TEAM].sort((a, b) => b.util - a.util)

// Real headshots for a few of the team. Anyone missing falls back to the
// initials placeholder.
const TEAM_AVATARS = {
  'James Walker':   'https://i.pravatar.cc/96?img=12',
  'Karen Liu':      'https://i.pravatar.cc/96?img=47',
  'Sarah Mitchell': 'https://i.pravatar.cc/96?img=44',
}

// Render order for the Active Matters card: Review at the top, Active in the
// middle, On Hold at the bottom.
const MATTER_STATUS_ORDER = { Review: 0, Active: 1, 'On Hold': 2 }
const SORTED_MATTERS = [...MATTERS].sort(
  (a, b) => (MATTER_STATUS_ORDER[a.status] ?? 99) - (MATTER_STATUS_ORDER[b.status] ?? 99),
)

// Render order for the Firm Health card: negative-delta metrics first
// (concerning items surfaced to the top), then everything else in source order.
const SORTED_FIRM_HEALTH = [...FIRM_HEALTH].sort((a, b) => {
  const aN = parseFloat(a.delta) || 0
  const bN = parseFloat(b.delta) || 0
  return (aN < 0 ? 0 : 1) - (bN < 0 ? 0 : 1)
})

// Tooltip copy per Firm Health metric — a short definition plus the
// underlying signals that move the number.
const FIRM_HEALTH_META = {
  'Utilization Rate': {
    description: 'Share of billable hours against available capacity per fee-earner.',
    contributors: ['Billable hours logged', 'Available capacity', 'Time-off and admin'],
  },
  'Realization Rate': {
    description: 'Percentage of recorded billable work actually invoiced.',
    contributors: ['Fee write-offs', 'Negotiated discounts', 'Invoicing discipline'],
  },
  'Collection Rate': {
    description: 'Share of invoiced amounts collected within agreed terms.',
    contributors: ['Days sales outstanding', 'Aging receivables', 'Bad debt provisions'],
  },
  'Client NPS': {
    description: 'Net Promoter Score from quarterly client surveys (−100 to +100).',
    contributors: ['Survey response rate', 'Promoters (9–10)', 'Detractors (0–6)'],
  },
}

// Org Health Score contributors.
// `trend` is the +/- percentage change since last view.
const ORG_HEALTH_COMPONENTS = [
  { name: 'Compliance',      icon: ShieldCheck,    value: '87%',   trend:  3 },
  { name: 'Risk Rating',     icon: Activity,       value: '92%',   trend:  0 },
  { name: 'Audit readiness', icon: ClipboardCheck, value: '78%',   trend: -4 },
  { name: 'Revenue',         icon: DollarSign,     value: '$2.4M', trend:  1 },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

// Matter status badge — coloured dot + dark mono uppercase text.
function MatterStatusBadge({ status }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden
        className={cn('size-1.5 rounded-full shrink-0', MATTER_STATUS_DOT[status] ?? 'bg-muted-foreground')}
      />
      <span className="font-mono text-xs font-medium uppercase tracking-[0.3px] text-[#151d2b]">
        {status}
      </span>
    </span>
  )
}

// 4-bar signal indicator — `filled` bars use the parent's text colour
// (currentColor); the remaining bars are rendered greyed.
function SignalBars({ filled = 4 }) {
  const heights = [4, 7, 10, 13]
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className="size-4 shrink-0"
      aria-hidden
    >
      {heights.map((h, i) => (
        <rect
          key={i}
          x={1 + i * 4}
          y={14 - h}
          width={2.5}
          height={h}
          rx={0.5}
          className={i < filled ? 'fill-current' : 'fill-[#cbd5e1]'}
        />
      ))}
    </svg>
  )
}

// Risk severity badge — coloured pill matching the Priorities widget style
// (pink/amber/yellow/grey bg + dark mono uppercase text).
function RiskSeverityBadge({ severity }) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-mono uppercase tracking-wide text-[#151D2B] px-2 py-0.5 text-xs font-medium',
      RISK_SEVERITY_BADGE_BG[severity] ?? 'bg-muted/30',
    )}>
      {severity}
    </span>
  )
}

// Leading status icon on the Compliance card rows — good → filled green
// check, anything pending → neutral dashed circle. The "still to do" cue moves
// to the right-side tooltip so the row left edge stays calm.
function ComplianceIcon({ status }) {
  if (status === 'good') {
    return (
      <span className="flex size-3 shrink-0 items-center justify-center rounded-full bg-emerald-700" aria-hidden>
        <Check className="size-2 text-white" strokeWidth={3} />
      </span>
    )
  }
  return <CircleDashed className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
}

// Status indicator on the Team Utilisation rows. "Ready" (low workload) is a
// mint pill with a green dot; everything else is plain grey "Full" text.
function WorkloadBadge({ level }) {
  if (level === 'good') {
    return (
      <span className="inline-flex h-[22px] items-center gap-1.5 rounded-full bg-[#d5ffda] px-2">
        <span className="size-1.5 rounded-full bg-[#00bc7d]" aria-hidden />
        <span className="font-mono text-xs font-medium uppercase tracking-[0.3px] text-[#151d2b]">Ready</span>
      </span>
    )
  }
  return (
    <span className="font-mono text-xs font-medium uppercase tracking-[0.3px] text-muted-foreground">Full</span>
  )
}

// Avatar — image if a headshot is mapped for the team member, otherwise the
// initials placeholder.
function TeamAvatar({ person, size = 'size-6' }) {
  const url = TEAM_AVATARS[person.name]
  if (url) {
    return <img src={url} alt="" className={cn(size, 'shrink-0 rounded-full object-cover')} />
  }
  return (
    <span className={cn(size, 'flex shrink-0 items-center justify-center rounded-full bg-[#f5f5f5] text-[10px] font-medium text-muted-foreground')}>
      {person.initials}
    </span>
  )
}

// Bar colour for the Team Capacity chart — soft pastels: pale mint when
// there's plenty of headroom, warm sandy yellow when stretched, cornflower
// lavender at max capacity.
function teamBarColor(level) {
  if (level === 'over') return 'bg-[#b6bced]'
  if (level === 'high') return 'bg-[#f3d490]'
  return 'bg-emerald-200'
}

// ─── Team Utilisation variants ───────────────────────────────────────────────
//
// Two implementations are kept here. `TeamCapacityChart` is the active design
// (avatar + name + horizontal capacity bar). `TeamUtilisationList` is the
// previous list-style implementation, retained as a backup — swap in
// <TeamUtilisationList /> below if you want to revert.

function TeamCapacityChart({ sort = 'desc' }) {
  const rows = sort === 'asc'
    ? [...TEAM].sort((a, b) => a.util - b.util)
    : [...TEAM].sort((a, b) => b.util - a.util)
  return (
    <ul className="px-3 pb-3 pt-1 space-y-1">
      {rows.map((p) => (
        <li key={p.name}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/30 transition-colors cursor-default">
                <TeamAvatar person={p} />
                <span className="w-[120px] shrink-0 text-sm font-medium text-foreground truncate tracking-[-0.15px]">
                  {p.name}
                </span>
                <div className="flex-1 h-2 bg-muted/60 overflow-hidden">
                  <div
                    className={cn('h-full', teamBarColor(p.level))}
                    style={{ width: `${p.util}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">{p.util}%</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {p.matters} active {p.matters === 1 ? 'matter' : 'matters'}
            </TooltipContent>
          </Tooltip>
        </li>
      ))}

      {/* Footer — overflow stack + view all */}
      <li className="flex items-center gap-3 px-3 pt-3">
        <div className="flex -space-x-1.5">
          <img src="https://i.pravatar.cc/96?img=15" alt="" className="size-6 rounded-full object-cover ring-2 ring-white" />
          <img src="https://i.pravatar.cc/96?img=22" alt="" className="size-6 rounded-full object-cover ring-2 ring-white" />
          <img src="https://i.pravatar.cc/96?img=33" alt="" className="size-6 rounded-full object-cover ring-2 ring-white" />
          <span className="flex size-6 items-center justify-center rounded-full bg-[#f5f5f5] text-[10px] font-medium text-muted-foreground ring-2 ring-white">
            +6
          </span>
        </div>
        <Button variant="ghost" size="sm" className="text-sm text-muted-foreground gap-1 h-7 px-2 -ml-1">
          View all
        </Button>
      </li>
    </ul>
  )
}

function TeamUtilisationList() {
  // Previous list-style team layout — kept as a backup.
  return (
    <ul className="px-3 pb-2 space-y-2">
      {SORTED_TEAM.map((p) => (
        <li key={p.name}>
          <div className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <TeamAvatar person={p} />
              <span className="text-sm font-medium text-foreground truncate tracking-[-0.15px]">{p.name}</span>
            </div>
            <div className="flex items-center gap-6 shrink-0">
              <span className="w-[120px] text-right text-xs text-muted-foreground truncate">{p.role}</span>
              <span className="w-[72px] text-right text-xs text-muted-foreground tabular-nums">{p.matters} matters</span>
              <div className="w-[72px] flex justify-end">
                <WorkloadBadge level={p.level} />
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

function SectionCard({ icon: Icon, title, titleBadge, viewAllLabel = 'View all', actionIcon: ActionIcon = ChevronRight, onAction, headerAction, showHeaderSeparator = false, children }) {
  // Chrome mirrors the Home "Jump back in" card: rounded-xl, soft border, white bg.
  // Title on the left (with optional inline badge), action on the right.
  // `headerAction` (ReactNode) overrides the default chevron button entirely.
  return (
    <div className="flex flex-col rounded-xl border border-[#E5EAEE] bg-white overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-2 min-w-0">
          {Icon && <Icon className="size-4 text-muted-foreground shrink-0" />}
          <h2 className="text-base font-medium text-foreground truncate">{title}</h2>
          {titleBadge}
        </div>
        {headerAction !== undefined ? headerAction : (
          viewAllLabel && (
            <Button
              variant="ghost"
              size="icon"
              aria-label={viewAllLabel}
              onClick={onAction}
              className="size-7 text-muted-foreground -mr-1"
            >
              {ActionIcon && <ActionIcon className="size-4" />}
            </Button>
          )
        )}
      </div>
      {showHeaderSeparator && <Separator />}
      <div className="flex-1">{children}</div>
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

// ─── Org Health feature section ──────────────────────────────────────────────

// Overall Health Rating panel — left side of the OrgHealthFeature card.
// Mint card with a labelled big-percent + 10-segment bar gauge + status
// badge, matching the Figma node 284:1343.
function OverallHealthCard({ rating = 86, status = 'GOOD' }) {
  const filledBars = Math.round(rating / 10)
  return (
    <div className="relative h-full min-h-[184px] rounded-2xl bg-[#e9ffec] px-7 py-7">
      {/* Status badge */}
      <span className="absolute right-6 top-7 inline-flex items-center gap-1.5 rounded-full bg-[#d5ffda] px-2 py-0.5">
        <span className="size-1.5 rounded-full bg-[#00bc7d]" aria-hidden />
        <span className="font-mono text-xs font-medium uppercase tracking-wide text-[#151d2b]">{status}</span>
      </span>

      {/* Label + big % */}
      <p className="text-sm text-foreground">Overall Health Rating</p>
      <p className="mt-1 text-[29px] leading-8 font-normal tracking-[-0.6px] text-foreground tabular-nums">{rating}%</p>

      {/* 10-segment bar gauge */}
      <div className="mt-6 flex items-start gap-[11px]">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            aria-hidden
            className={cn('h-[25px] w-[5px]', i < filledBars ? 'bg-[#00bc7d]' : 'bg-[#d9d9d9]')}
          />
        ))}
      </div>
    </div>
  )
}

// Trend chip — mirrors the delta chip used inside MetricsStrip
// (rounded-[4px], teal/pink palette, central triangle icons).
function TrendChip({ trend }) {
  const isFlat = trend === 0
  const positive = trend > 0
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 h-[18px] px-1 rounded-[4px] font-semibold text-xs',
        isFlat || positive
          ? 'bg-[#F3FDFA] text-[#4F7D6F]'
          : 'bg-[#FDF3F6] text-[#7D4F6B]',
      )}
    >
      {isFlat ? (
        <Minus className="size-2" />
      ) : positive ? (
        <IconChevronTriangleUpSmall className="size-3" />
      ) : (
        <IconChevronTriangleDownSmall className="size-3" />
      )}
      {Math.abs(trend)}%
    </span>
  )
}

function ContributorCard({ icon: Icon, name, value, trend }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#fafafa]">
        {Icon && <Icon className="size-5 text-foreground/70" strokeWidth={1.5} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[#8E9BAD] leading-4">{name}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-medium text-foreground tabular-nums">{value}</span>
          <TrendChip trend={trend} />
        </div>
      </div>
    </div>
  )
}

function OrgHealthFeature() {
  return (
    <div className="rounded-xl border border-[#E5EAEE] bg-white px-6 py-6">
      <h2 className="mb-5 text-base font-medium text-foreground">Health Snapshot</h2>
      <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-8 items-stretch">

        {/* Left — overall health rating panel */}
        <OverallHealthCard rating={86} status="GOOD" />

        {/* Right — contributors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 self-center">
          {ORG_HEALTH_COMPONENTS.map((c) => (
            <ContributorCard key={c.name} {...c} />
          ))}
        </div>

      </div>
    </div>
  )
}

// ─── Compliance Checklist dialog ─────────────────────────────────────────────

function ProgressRing({ percent, size = 48 }) {
  const r = 20
  const c = 2 * Math.PI * r
  const offset = c * (1 - percent / 100)
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
        <circle cx="24" cy="24" r={r} fill="none" stroke="#E5EAEE" strokeWidth="3" />
        <circle
          cx="24" cy="24" r={r}
          fill="none" stroke="#047857" strokeWidth="3"
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 24 24)"
        />
      </svg>
      <Check className="absolute size-4 text-[#047857]" strokeWidth={3} />
    </div>
  )
}

function ComplianceChecklistDialog({ open, onOpenChange }) {
  const total = SORTED_COMPLIANCE.length
  const done = SORTED_COMPLIANCE.filter((c) => c.status === 'good').length
  const percent = total > 0 ? Math.round((done / total) * 100) : 0

  if (!open) return null

  return (
    // Floating panel — no backdrop, no slide-in animation. Sits in the top-
    // right of the viewport with a small inset, rounded corners and shadow.
    <div
      role="dialog"
      aria-labelledby="compliance-checklist-title"
      className="fixed inset-y-3 right-3 z-50 w-[520px] max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl border border-border shadow-xl flex flex-col overflow-hidden"
    >
      {/* X close */}
      <button
        type="button"
        onClick={() => onOpenChange(false)}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <X className="size-4" />
      </button>

      {/* Header */}
      <div className="flex flex-col items-center text-center pt-10 px-6 pb-5 shrink-0">
        <ProgressRing percent={percent} />
        <h2
          id="compliance-checklist-title"
          className="mt-4 text-xl font-semibold tracking-tight text-foreground"
        >
          Compliance Checklist
        </h2>
        <p className="mt-1 max-w-[420px] text-sm text-muted-foreground">
          Review the compliance tasks required to keep your firm in good standing — outstanding items first.
        </p>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-3">
        {SORTED_COMPLIANCE.map((c) => {
          const meta = COMPLIANCE_TASK_META[c.label]
          const Icon = meta?.icon ?? ClipboardList
          const isDone = c.status === 'good'
          return (
            <div
              key={c.label}
              className={cn(
                'rounded-xl px-5 py-5',
                isDone ? 'bg-[#fafffb]' : 'bg-[#fcfcfc]',
              )}
            >
              <span className={cn(
                'flex size-9 items-center justify-center rounded-lg',
                isDone ? 'bg-[#d5ffda]' : 'bg-white border border-border',
              )}>
                {Icon && <Icon className={cn('size-4', isDone ? 'text-[#047857]' : 'text-foreground')} strokeWidth={1.5} />}
              </span>
              <div className="mt-4">
                <p className={cn(
                  'text-sm font-semibold',
                  isDone ? 'text-[#047857] line-through' : 'text-foreground',
                )}>
                  {c.label}
                </p>
                <p className={cn(
                  'mt-1 text-sm leading-relaxed',
                  isDone ? 'text-[#047857]/70 line-through' : 'text-muted-foreground',
                )}>
                  {meta?.description ?? c.sub}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-3">
                {isDone ? (
                  <Button size="sm" className="bg-[#047857] hover:bg-[#065f46] text-white gap-1.5 h-8">
                    <Check className="size-3.5" strokeWidth={3} /> Done
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="h-8">Review</Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-end border-t border-border px-6 py-4 shrink-0">
        <Button
          onClick={() => onOpenChange(false)}
          className="bg-foreground hover:bg-foreground/90 text-background h-9"
        >
          Done
        </Button>
      </div>
    </div>
  )
}

// ─── Risk Register drawer ────────────────────────────────────────────────────

function RiskRegisterDrawer({ open, onOpenChange }) {
  if (!open) return null
  const totalRisks = RISK_REGISTER.reduce((sum, c) => sum + c.count, 0)
  return (
    <div
      role="dialog"
      aria-labelledby="risk-register-title"
      className="fixed inset-y-3 right-3 z-50 w-[560px] max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl border border-border shadow-xl flex flex-col overflow-hidden"
    >
      {/* X close */}
      <button
        type="button"
        onClick={() => onOpenChange(false)}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <X className="size-4" />
      </button>

      {/* Header */}
      <div className="flex flex-col px-6 pt-8 pb-5 shrink-0">
        <h2 id="risk-register-title" className="text-xl font-semibold tracking-tight text-foreground">
          Risks
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalRisks} risks across {RISK_REGISTER.length} categories — each risk lists the items currently causing it.
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {RISK_REGISTER.map((cat, idx) => (
          <section
            key={cat.category}
            className={cn(idx > 0 && 'mt-6 border-t border-[#E5EAEE] pt-6')}
          >
            {/* Category header */}
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className={cn(
                  'flex items-center justify-center shrink-0 rounded p-1',
                  RISK_SEVERITY_ICON_BG[cat.severity] ?? 'bg-muted/30',
                  RISK_SEVERITY_ICON_COLOR[cat.severity] ?? 'text-foreground',
                )}>
                  <SignalBars filled={RISK_SEVERITY_BARS[cat.severity] ?? 1} />
                </span>
                <h3 className="text-base font-medium leading-5 text-[#0A0A0A] truncate">{cat.category}</h3>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                {cat.count} {cat.count === 1 ? 'risk' : 'risks'}
              </span>
            </div>

            {/* Risks under this category — collapsible <details> elements */}
            <div className="space-y-2">
              {cat.risks.map((risk) => (
                <details
                  key={risk.name}
                  className={cn(
                    'group rounded-lg overflow-hidden',
                    RISK_SEVERITY_BG[risk.severity] ?? 'bg-muted/30',
                  )}
                >
                  <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <p className="text-sm font-medium leading-5 text-[#081120]">
                      {risk.name}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <RiskSeverityBadge severity={risk.severity} />
                      <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
                    </div>
                  </summary>
                  <div className="px-4 pb-3">
                    <ul className="space-y-1">
                      {risk.causes.map((c, i) => (
                        <li key={i} className="flex gap-2 text-sm text-foreground/70">
                          <span className="text-foreground/40" aria-hidden>·</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                    {risk.owner && (
                      <p className="mt-2 text-sm text-foreground/70">
                        Owner: <span className="text-foreground">{LEAD_NAMES[risk.owner] ?? risk.owner}</span>
                      </p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-end border-t border-border px-6 py-4 shrink-0">
        <Button
          onClick={() => onOpenChange(false)}
          className="bg-foreground hover:bg-foreground/90 text-background h-9"
        >
          Done
        </Button>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ControlPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [complianceOpen, setComplianceOpen] = useState(false)
  const [risksOpen, setRisksOpen] = useState(false)
  const [teamSort, setTeamSort] = useState('desc')
  const now = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date())

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto bg-background">
        <div className="mx-auto max-w-[1200px] px-8 pt-[52px] pb-6 space-y-6">

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

          {/* Org Health feature */}
          <OrgHealthFeature />

          {/* Row 1: Compliance | Risk Rating */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <SectionCard
              title="Compliance"
              actionIcon={Maximize2}
              onAction={() => setComplianceOpen(true)}
              titleBadge={
                <span className="inline-flex items-center rounded border border-[#e9eaec] bg-white px-2 py-0.5 text-sm font-medium text-foreground/50">
                  87%
                </span>
              }
            >
              {/* Row pills mirror the Figma 284:1994 — status icon · item label
                  on the left, mono uppercase status text on the right. */}
              <ul className="px-3 pt-1 pb-3 space-y-2">
                {SORTED_COMPLIANCE.map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      className={cn(
                        'flex w-full items-center justify-between gap-3 rounded-lg h-10 px-3 transition-colors',
                        COMPLIANCE_STATUS_BG[item.status] ?? 'bg-muted/30',
                        COMPLIANCE_STATUS_BG_HOVER[item.status] ?? 'hover:bg-muted/40',
                      )}>
                      <span className="flex items-center gap-1.5 min-w-0">
                        <ComplianceIcon status={item.status} />
                        <span className="text-sm font-medium text-[#2A2A2A] truncate tracking-[-0.15px]">
                          {item.label}
                        </span>
                      </span>
                      {item.status !== 'good' && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              tabIndex={0}
                              className={cn(
                                'inline-flex shrink-0 items-center justify-center cursor-default',
                                COMPLIANCE_STATUS_TEXT[item.status] ?? 'text-muted-foreground',
                              )}
                            >
                              <AlertTriangle className="size-4" strokeWidth={2} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>{item.sub}</TooltipContent>
                        </Tooltip>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard
              title="Risk Rating"
              actionIcon={Maximize2}
              onAction={() => setRisksOpen(true)}
              titleBadge={
                <span className="inline-flex items-center rounded border border-[#e9eaec] bg-white px-2 py-0.5 text-sm font-medium text-foreground/50">
                  92%
                </span>
              }
            >
              {/* Pill row style mirrors the Compliance card: tinted bg per
                  severity, no left icon, severity badge on the right. */}
              <ul className="px-3 pt-1 pb-3 space-y-2">
                {SORTED_RISKS.map((r) => {
                  const filled = RISK_SEVERITY_BARS[r.severity] ?? 1
                  const iconColor = RISK_SEVERITY_ICON_COLOR[r.severity] ?? 'text-foreground'
                  const iconBg = RISK_SEVERITY_ICON_BG[r.severity] ?? 'bg-muted/30'
                  return (
                    <li key={r.name}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className={cn(
                              'flex w-full items-center justify-between gap-3 rounded-lg h-10 px-3 transition-colors',
                              RISK_SEVERITY_BG[r.severity] ?? 'bg-muted/30',
                              RISK_SEVERITY_BG_HOVER[r.severity] ?? 'hover:bg-muted/40',
                            )}
                          >
                            <span className="flex items-center gap-2 min-w-0">
                              <span className={cn('flex items-center justify-center shrink-0 rounded p-1', iconBg, iconColor)}>
                                <SignalBars filled={filled} />
                              </span>
                              <span className="text-sm font-medium text-[#2A2A2A] truncate tracking-[-0.15px]">
                                {r.name}
                              </span>
                            </span>
                            <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                              {r.count} {r.count === 1 ? 'risk' : 'risks'}
                            </span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>{r.sub}</TooltipContent>
                      </Tooltip>
                    </li>
                  )
                })}
              </ul>
            </SectionCard>

          </div>

          {/* Row 2: Firm Health | Team Workload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <SectionCard title="Firm Health" viewAllLabel={null}>
              {/* 2×2 grid of metric tiles — centred label / value / trend chip
                  / target. Matches Figma 285:3375. */}
              <div className="grid grid-cols-2 gap-2 p-3 pt-1">
                {SORTED_FIRM_HEALTH.map((m) => {
                  const isNPS = m.label === 'Client NPS'
                  const trendNum = parseFloat(m.delta) || 0
                  const meta = FIRM_HEALTH_META[m.label]
                  return (
                    <Tooltip key={m.label}>
                      <TooltipTrigger asChild>
                        <div
                          tabIndex={0}
                          className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#fcfcfc] px-4 py-6 cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
                        >
                          <p className="text-sm font-medium text-foreground tracking-[-0.15px] text-center">
                            {m.label}
                          </p>
                          <p className="text-xl font-medium text-foreground tabular-nums leading-7">
                            {m.value}{isNPS ? '' : '%'}
                          </p>
                          <TrendChip trend={trendNum} />
                          <p className="text-xs text-muted-foreground text-center">
                            Target {m.target}{isNPS ? '' : '%'}
                          </p>
                        </div>
                      </TooltipTrigger>
                      {meta && (
                        <TooltipContent side="bottom" className="max-w-[260px]">
                          <p>{meta.description}</p>
                          <p className="mt-1.5 opacity-70">
                            Contributing: {meta.contributors.join(' · ')}
                          </p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  )
                })}
              </div>
            </SectionCard>

            <SectionCard
              title="Team Utilisation"
              headerAction={
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm text-muted-foreground gap-1 h-7 px-2 -mr-1"
                    >
                      {teamSort === 'desc' ? 'Most utilised' : 'Least utilised'}
                      <ChevronDown className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTeamSort('desc')}>
                      Most utilised first
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTeamSort('asc')}>
                      Least utilised first
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
            >
              {/* Capacity chart — avatar + name + horizontal bar showing util%.
                  Swap to <TeamUtilisationList /> to revert to the previous
                  row-style layout. */}
              <TeamCapacityChart sort={teamSort} />
            </SectionCard>

          </div>

          {/* Row 3: Priorities | Upcoming Events */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <SectionCard title="Priorities">
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
                          <Badge variant="outline" className={cn(
                            'rounded-full font-mono uppercase tracking-wide text-[#151D2B] border-transparent px-2 py-0.5 text-xs',
                            PRIORITY_BADGE_BG[p.urgency],
                          )}>
                            {p.urgency}
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

            <SectionCard title="Upcoming events">
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

          {/* Active Matters — full-width table view, modelled on the Vercel
              "Active Branches" pattern. Title sits above the container.
              Right-side columns are fixed-width and right-aligned. */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <h2 className="text-base font-medium text-foreground">Active Matters</h2>
              <span className="inline-flex items-center rounded border border-[#e9eaec] bg-white px-2 py-0.5 text-sm font-medium text-foreground/50">
                {SORTED_MATTERS.length}
              </span>
            </div>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                placeholder="Search matters..."
                aria-label="Search matters"
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E5EAEE] bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300"
              />
            </div>

            <div className="rounded-lg border border-[#E5EAEE] bg-white overflow-hidden">
              <div className="divide-y divide-[#E5EAEE]">
                {SORTED_MATTERS.map((m) => (
                  <div
                    key={m.name}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    {/* Name (flex-1, left-aligned) */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <IconLayersThree className="size-4 shrink-0 text-foreground [&_path]:stroke-2" />
                      <span className="text-sm font-medium text-[#2A2A2A] truncate">{m.name}</span>
                    </div>

                    {/* Type (fixed width, left-aligned) */}
                    <div className="hidden md:flex w-[120px] shrink-0">
                      <span className="inline-flex h-6 items-center rounded-full border border-[#E5EAEE] bg-white px-2 text-xs text-foreground/70">
                        {m.type}
                      </span>
                    </div>

                    {/* Status (fixed width, left-aligned) */}
                    <div className="w-[120px] shrink-0 flex">
                      <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-[#E5EAEE] bg-white px-2">
                        <span
                          aria-hidden
                          className={cn('size-1.5 rounded-full', MATTER_STATUS_DOT[m.status] ?? 'bg-muted-foreground')}
                        />
                        <span className="font-mono text-xs font-medium uppercase tracking-[0.3px] text-[#151d2b]">
                          {m.status}
                        </span>
                      </span>
                    </div>

                    {/* Lead (fixed width, left-aligned) */}
                    <div className="hidden md:flex w-[160px] shrink-0 items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-full bg-[#f5f5f5] text-[10px] font-medium text-muted-foreground">
                        {m.lead}
                      </span>
                      <span className="text-sm text-foreground whitespace-nowrap">{LEAD_NAMES[m.lead] ?? m.lead}</span>
                    </div>

                    {/* Days (fixed width, left-aligned) */}
                    <span className="w-[60px] shrink-0 text-left text-xs text-muted-foreground tabular-nums">
                      {m.days}d
                    </span>

                    {/* View matter */}
                    <button
                      type="button"
                      aria-label="View matter"
                      className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Push panel — slides in, pushes content */}
      <div className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${drawerOpen ? 'w-[380px]' : 'w-0'}`}>
        <AiPanel onClose={() => setDrawerOpen(false)} />
      </div>

      <ComplianceChecklistDialog open={complianceOpen} onOpenChange={setComplianceOpen} />
      <RiskRegisterDrawer open={risksOpen} onOpenChange={setRisksOpen} />
    </div>
  )
}
