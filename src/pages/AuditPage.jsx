import { useState } from 'react'
import { AiSummaryBar } from '@/components/shared/AiSummaryBar'
import Feature from '@/components/Feature'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Calendar,
  FileText,
  GraduationCap,
  Award,
  ClipboardList,
  Shield,
  Search,
  AlertTriangle,
  ArrowRight,
  Download,
  BarChart2,
  BookOpen,
  Activity,
  ExternalLink,
  X,
  Zap,
  Lightbulb,
  TrendingUp,
  ListChecks,
} from 'lucide-react'
import tenant from '@/config/tenant'

// ── Data ─────────────────────────────────────────────────────────────────────

const t = tenant.pages.audit

const AUDIT_AI_POINTS = t.aiPoints

const AI_MISSING = [
  { title: 'Risk Assessment Q1 2026 not filed',  note: 'The quarterly firm-wide risk assessment for Q1 2026 has not been completed. This is required under SRA reporting obligations.' },
  { title: '3 staff missing AML refresher',      note: 'Three fee earners have not completed mandatory AML refresher training due by 28 Feb 2026.' },
]

const AI_EXPIRING = [
  { title: 'PI Insurance expires in 25 days',           note: 'Professional Indemnity Insurance renewal deadline is 15 Mar 2026. Broker confirmation pending.' },
  { title: '4 practising certificates due for renewal', note: 'SRA practising certificates for four partners are due for renewal by 31 Mar 2026.' },
]

const AI_INSIGHTS = [
  { title: 'Readiness improved 4% this month', note: 'Overall audit readiness score increased from 83% to 87% following completion of policy reviews.' },
  { title: 'Evidence gap trend declining',      note: 'High-risk evidence gaps reduced from 6 to 3 over the past 60 days. Remediation on track.' },
]

const AI_ACTIONS = t.aiActions

const EVIDENCE_ITEMS = [
  { icon: FileText,      label: 'Policies & Procedures',       desc: 'Firm-wide policy documentation and standard operating procedures',                              count: 24,  total: 24,  status: 'Complete' },
  { icon: GraduationCap, label: 'Training Completion Records',  desc: 'Staff CPD, AML, and mandatory training certifications',                                        count: 188, total: 192, status: 'Complete' },
  { icon: Award,         label: 'Certificates & Licences',      desc: 'Practising certificates, regulatory licences, and professional memberships',                   count: 18,  total: 22,  status: 'Outdated'  },
  { icon: ClipboardList, label: 'Registers',                    desc: 'Gifts, hospitality, complaints, and beneficial ownership registers',                           count: 8,   total: 8,   status: 'Complete' },
  { icon: Shield,        label: 'Risk Reviews',                 desc: 'Practice-wide and matter-level risk assessments',                                              count: 3,   total: 6,   status: 'Missing'   },
  { icon: Search,        label: 'Conflict Checks',              desc: 'Conflict of interest searches and clearance records',                                          count: 142, total: 142, status: 'Complete' },
  { icon: AlertTriangle, label: 'Incident Records',             desc: 'Breach reports, near-miss logs, and remediation actions',                                      count: 11,  total: 14,  status: 'Outdated'  },
]

const AUDIT_TIMELINE = [
  { id: 'tl-1', label: 'Scoping & engagement letter', date: '15 Mar 2026', status: 'Done'        },
  { id: 'tl-2', label: 'Walkthrough & control testing', date: '08 Apr 2026', status: 'Done'        },
  { id: 'tl-3', label: 'Evidence collection cut-off',   date: '22 May 2026', status: 'In Progress' },
  { id: 'tl-4', label: 'Management letter draft',       date: '12 Jun 2026', status: 'Upcoming'    },
  { id: 'tl-5', label: 'Audit Committee review',        date: '02 Jul 2026', status: 'Upcoming'    },
  { id: 'tl-6', label: 'External audit sign-off',       date: '20 Jul 2026', status: 'Upcoming'    },
]

const TIMELINE_STYLE = {
  Done:          { dot: 'bg-emerald-500',     line: 'bg-emerald-500',     text: 'text-emerald-700' },
  'In Progress': { dot: 'bg-amber-500',       line: 'bg-amber-300',       text: 'text-amber-700'   },
  Upcoming:      { dot: 'bg-muted-foreground/30', line: 'bg-muted',       text: 'text-muted-foreground' },
}

const REGULATOR_CALENDAR = [
  { id: 'rc-1', label: 'Q4 2025 BAS lodgement',                regulator: 'ATO',   date: '28 May 2026', type: 'Filing'      },
  { id: 'rc-2', label: 'AUSTRAC compliance report',            regulator: 'AUSTRAC', date: '30 Jun 2026', type: 'Submission'  },
  { id: 'rc-3', label: 'OAIC notifiable data breach annual',   regulator: 'OAIC',  date: '15 Jul 2026', type: 'Submission'  },
  { id: 'rc-4', label: 'ASIC director ID verification audit',  regulator: 'ASIC',  date: '31 Jul 2026', type: 'Inspection'  },
  { id: 'rc-5', label: 'FBT annual return',                    regulator: 'ATO',   date: '21 May 2026', type: 'Filing'      },
  { id: 'rc-6', label: 'APRA CPS 230 attestation',             regulator: 'APRA',  date: '30 Sep 2026', type: 'Submission'  },
]

const REG_TYPE_STYLE = {
  Filing:     'border-slate-200 bg-slate-50 text-slate-700',
  Submission: 'border-brand-200 bg-brand-50 text-brand-800',
  Inspection: 'border-amber-200 bg-amber-50 text-amber-800',
}

const DEADLINES = [
  { icon: BookOpen,      label: 'AML Policy Annual Review',             type: 'Policy Review',             date: '22 Feb 2026', days: 4,  urgency: 'critical' },
  { icon: GraduationCap, label: 'Data Protection Refresher Training',   type: 'Training Renewal',          date: '01 Mar 2026', days: 11, urgency: 'warning'  },
  { icon: FileText,      label: 'PI Insurance Renewal',                 type: 'Insurance & Accreditation', date: '15 Mar 2026', days: 25, urgency: 'warning'  },
  { icon: Award,         label: 'SRA Practising Certificate Renewal',   type: 'Regulatory Filing',         date: '31 Mar 2026', days: 41, urgency: 'ok'       },
  { icon: FileText,      label: 'Client Retainer Agreement Review',     type: 'Contract Renewal',          date: '10 Apr 2026', days: 51, urgency: 'ok'       },
  { icon: GraduationCap, label: 'Equality & Diversity Training',        type: 'Training Renewal',          date: '18 Apr 2026', days: 59, urgency: 'ok'       },
]

const ASSURANCE_SECTIONS = [
  {
    icon: BookOpen,
    title: 'Legislation to Evidence',
    desc: 'Regulatory requirements mapped to supporting documentation',
    rows: [
      { left: 'SRA Code of Conduct',               leftType: 'Legislation', right: 'Code of Conduct Policy',   rightType: 'Policy',  status: 'Mapped'   },
      { left: 'Money Laundering Regulations 2017', leftType: 'Legislation', right: 'AML Policy & Procedures',  rightType: 'Policy',  status: 'Mapped'   },
      { left: 'UK GDPR / Data Protection Act 2018', leftType: 'Legislation', right: 'Data Protection Policy',  rightType: 'Policy',  status: 'Partial'  },
    ],
  },
  {
    icon: FileText,
    title: 'Contracts to Obligations',
    desc: 'Client and third-party agreements linked to compliance obligations',
    rows: [
      { left: 'Panel Membership Agreement', leftType: 'Contract', right: 'Annual Audit Obligation', rightType: 'Obligation', status: 'Mapped'   },
      { left: 'Outsourcing SLA',            leftType: 'Contract', right: 'Vendor Due Diligence',    rightType: 'Obligation', status: 'Unmapped' },
    ],
  },
  {
    icon: Shield,
    title: 'Risks to Mitigation',
    desc: 'Identified risks linked to corresponding controls and mitigations',
    rows: [
      { left: 'Client Money Handling', leftType: 'Risk', right: 'Dual Authorisation Control', rightType: 'Control', status: 'Mapped'  },
      { left: 'Cyber Security Breach', leftType: 'Risk', right: 'Incident Response Plan',     rightType: 'Control', status: 'Partial' },
    ],
  },
  {
    icon: Activity,
    title: 'Incidents to Resolution',
    desc: 'Recorded incidents tracked through to closure and remediation',
    rows: [
      { left: 'Data Breach #IB-2026-003',      leftType: 'Incident', right: 'ICO Notification & Remediation', rightType: 'Resolution', status: 'Mapped'  },
      { left: 'Client Complaint #CC-2026-011', leftType: 'Incident', right: 'Pending Investigation',          rightType: 'Resolution', status: 'Partial' },
    ],
  },
]

const REPORTS = [
  { label: 'Generate Audit Pack',       format: 'PDF',  desc: 'Compile a complete audit-ready evidence pack including all policies, registers, training records and certificates.', action: 'Generate' },
  { label: 'Generate Board Report',     format: 'PDF',  desc: 'Create a governance summary report suitable for board presentation, including readiness scores and key risks.',        action: 'Generate' },
  { label: 'Export Compliance Summary', format: 'XLSX', desc: 'Download a structured compliance overview with status indicators, gap analysis and remediation timeline.',            action: 'Export'   },
]

// ── Style maps ────────────────────────────────────────────────────────────────

const EVIDENCE_STATUS_STYLE = {
  Complete: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Outdated: 'bg-amber-50 text-amber-700 border-amber-200',
  Missing:  'bg-red-50 text-red-700 border-red-200',
}

const EVIDENCE_DOT = {
  Complete: 'bg-emerald-500',
  Outdated: 'bg-amber-400',
  Missing:  'bg-red-500',
}

const MAP_STATUS_STYLE = {
  Mapped:   { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: CheckCircle2 },
  Partial:  { cls: 'bg-amber-50 text-amber-700 border-amber-200',       Icon: AlertCircle  },
  Unmapped: { cls: 'bg-red-50 text-red-700 border-red-200',             Icon: XCircle      },
}

const URGENCY_CLS = {
  critical: 'text-red-600',
  warning:  'text-amber-500',
  ok:       'text-emerald-600',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ children }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
      {children}
    </div>
  )
}

function AuditAiPanel({ onClose }) {
  return (
    <div className="flex flex-col h-full border-l border-border/60 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-800 text-white">
            <Zap className="size-3" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">Ethos AI</p>
            <p className="text-xs text-muted-foreground leading-tight">Compliance Intelligence</p>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="size-4" />
        </button>
      </div>

      {/* Summary chips */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/60">
        <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded px-2 py-0.5">
          <span className="size-1.5 rounded-full bg-red-500 inline-block" /> 2 Missing
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">
          <span className="size-1.5 rounded-full bg-amber-400 inline-block" /> 2 Expiring
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-brand-700 bg-brand-50 border border-brand-200 rounded px-2 py-0.5">
          <span className="size-1.5 rounded-full bg-brand-600 inline-block" /> 2 Actions
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Missing Evidence */}
        <div className="px-4 py-4 border-b border-border/60">
          <div className="flex items-center gap-1.5 mb-3">
            <XCircle className="size-3.5 text-red-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Missing Evidence</span>
          </div>
          <ul className="space-y-4">
            {AI_MISSING.map((item, i) => (
              <li key={i} className="space-y-1">
                <p className="text-xs font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.note}</p>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border/60 rounded px-2 py-1 transition-colors mt-1.5">
                  <ListChecks className="size-3" /> Add to Work Tasks
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Expiring Documents */}
        <div className="px-4 py-4 border-b border-border/60">
          <div className="flex items-center gap-1.5 mb-3">
            <Clock className="size-3.5 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expiring Documents</span>
          </div>
          <ul className="space-y-4">
            {AI_EXPIRING.map((item, i) => (
              <li key={i} className="space-y-1">
                <p className="text-xs font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.note}</p>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border/60 rounded px-2 py-1 transition-colors mt-1.5">
                  <ListChecks className="size-3" /> Add to Work Tasks
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Readiness Insights */}
        <div className="px-4 py-4 border-b border-border/60">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp className="size-3.5 text-brand-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Readiness Insights</span>
          </div>
          <ul className="space-y-3">
            {AI_INSIGHTS.map((item, i) => (
              <li key={i}>
                <p className="text-xs font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.note}</p>
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
            {AI_ACTIONS.map((action, i) => (
              <li key={i} className="border border-border/60 rounded p-3 space-y-1.5">
                <p className="text-xs font-medium text-foreground">{action.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{action.note}</p>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border/60 rounded px-2 py-1 transition-colors">
                  <ListChecks className="size-3" /> Add to Work Tasks
                </button>
              </li>
            ))}
          </ul>
          <button className="mt-4 text-xs text-brand-600 hover:text-brand-800 transition-colors flex items-center gap-1">
            View all recommendations <ArrowRight className="size-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AuditPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [assuranceTab, setAssuranceTab] = useState(0)

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Audit & Board Readiness</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Be ready at any moment. Maintain a real-time view of compliance, evidence and governance readiness across your firm.
            </p>
          </div>

          {/* AI Summary Bar */}
          <Feature flag="FEATURE_AI_SUMMARY_BAR">
            <AiSummaryBar points={AUDIT_AI_POINTS} onOpenDrawer={() => setDrawerOpen(true)} />
          </Feature>

          {/* Readiness Status */}
          <div className="border border-border/60 overflow-hidden rounded bg-white">
            <SectionHeader>
              <div className="flex items-center gap-2">
                <BarChart2 className="size-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Readiness Status</p>
                <span className="text-xs text-muted-foreground">Real-time overview of your firm's audit preparedness</span>
              </div>
            </SectionHeader>
            <div className="grid grid-cols-5 divide-x divide-border/60">
              {[
                { label: 'Overall Readiness',     sub: 'Firm-wide compliance posture',  value: '87%', pct: 87, status: 'On Track',        statusCls: 'text-emerald-600' },
                { label: 'Evidence Completeness', sub: 'Documentation coverage',        value: '92%', pct: 92, status: 'On Track',        statusCls: 'text-emerald-600' },
                { label: 'High-Risk Gaps',        sub: 'Outstanding items',             value: '3',   pct: null, status: 'Needs Attention', statusCls: 'text-amber-600'  },
                { label: 'Expiring Soon',         sub: 'Items due within 30 days',      value: '7',   pct: null, status: 'Needs Attention', statusCls: 'text-amber-600'  },
                { label: 'Regulatory Exposure',   sub: 'Potential exposure items',      value: '12',  pct: null, status: 'At Risk',         statusCls: 'text-red-600'    },
              ].map(({ label, sub, value, pct, status, statusCls }) => (
                <div key={label} className="px-5 py-4 space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-medium text-foreground">{value}</span>
                    <span className={`text-xs font-medium ${statusCls}`}>{status}</span>
                  </div>
                  {pct !== null && (
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-brand-300" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline to Next Audit */}
          <div className="border border-border/60 overflow-hidden rounded bg-white">
            <SectionHeader>
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Timeline to Next Audit</p>
                <span className="text-xs text-muted-foreground">Milestones from scoping through sign-off</span>
              </div>
            </SectionHeader>
            <div className="px-5 py-5">
              <div className="flex items-stretch gap-2 overflow-x-auto">
                {AUDIT_TIMELINE.map((m, i) => {
                  const style = TIMELINE_STYLE[m.status] ?? TIMELINE_STYLE.Upcoming
                  const isLast = i === AUDIT_TIMELINE.length - 1
                  return (
                    <div key={m.id} className="flex-1 min-w-[140px] flex items-start gap-3">
                      <div className="flex flex-col items-center pt-1.5">
                        <span className={`size-2.5 rounded-full ${style.dot}`} />
                        {!isLast && <span className={`w-px flex-1 mt-1 ${style.line}`} />}
                      </div>
                      <div className="pb-2">
                        <p className="text-sm text-foreground leading-snug">{m.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{m.date}</p>
                        <p className={`text-xs mt-1 ${style.text}`}>{m.status}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Regulator Reporting Calendar */}
          <div className="border border-border/60 overflow-hidden rounded bg-white">
            <SectionHeader>
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Regulator Reporting Calendar</p>
                <span className="text-xs text-muted-foreground">Upcoming filings, submissions, and inspections</span>
              </div>
            </SectionHeader>
            <div className="divide-y divide-border/60">
              {REGULATOR_CALENDAR.map(e => (
                <div key={e.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex flex-col items-center justify-center rounded-md border border-border/60 bg-muted/30 px-2.5 py-1.5 shrink-0 w-16 text-center">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{e.date.slice(3, 6)}</span>
                    <span className="text-base font-semibold leading-tight text-foreground">{e.date.slice(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{e.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{e.regulator}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium border shrink-0 ${REG_TYPE_STYLE[e.type] ?? ''}`}>{e.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Library */}
          <div className="border border-border/60 overflow-hidden rounded bg-white">
            <SectionHeader>
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Evidence Library</p>
                <span className="text-xs text-muted-foreground">Central repository of compliance evidence and supporting documentation</span>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0">
                <ExternalLink className="size-3.5" /> View Evidence
              </button>
            </SectionHeader>
            <div className="divide-y divide-border/60">
              {EVIDENCE_ITEMS.map(({ icon: Icon, label, desc, count, total, status }) => (
                <div key={label} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border/60 bg-muted/30">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground truncate">{desc}</p>
                  </div>
                  <span className="text-sm text-muted-foreground tabular-nums shrink-0">{count} / {total}</span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium border rounded px-2 py-0.5 shrink-0 ${EVIDENCE_STATUS_STYLE[status]}`}>
                    <span className={`size-1.5 rounded-full shrink-0 ${EVIDENCE_DOT[status]}`} />
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="border border-border/60 overflow-hidden rounded bg-white">
            <SectionHeader>
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Upcoming Deadlines</p>
                <span className="text-xs text-muted-foreground">Key compliance dates and renewal milestones across the firm</span>
              </div>
            </SectionHeader>
            <div className="divide-y divide-border/60">
              {DEADLINES.map(({ icon: Icon, label, type, date, days, urgency }) => (
                <div key={label} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border/60 bg-muted/30">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{type}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="size-3.5 shrink-0" />
                      {date}
                    </div>
                    <span className={`text-xs font-medium w-24 text-right tabular-nums ${URGENCY_CLS[urgency]}`}>
                      {days}d remaining
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assurance Mapping */}
          <div className="border border-border/60 overflow-hidden rounded bg-white">
            <SectionHeader>
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Assurance Mapping</p>
                <span className="text-xs text-muted-foreground">Traceability from regulatory requirements through to evidence and resolution</span>
              </div>
            </SectionHeader>

            {/* Tab bar */}
            <div className="flex border-b border-border/60">
              {ASSURANCE_SECTIONS.map(({ icon: Icon, title }, idx) => (
                <button
                  key={title}
                  onClick={() => setAssuranceTab(idx)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
                    assuranceTab === idx
                      ? 'border-brand-800 text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="size-3.5 shrink-0" />
                  {title}
                </button>
              ))}
            </div>

            {/* Active tab content */}
            {(() => {
              const { desc, rows } = ASSURANCE_SECTIONS[assuranceTab]
              return (
                <div>
                  <p className="px-5 py-3 text-xs text-muted-foreground border-b border-border/60">{desc}</p>
                  <div className="divide-y divide-border/60">
                    {rows.map((row, i) => {
                      const { cls, Icon: StatusIcon } = MAP_STATUS_STYLE[row.status]
                      return (
                        <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{row.left}</p>
                            <p className="text-xs text-muted-foreground">{row.leftType}</p>
                          </div>
                          <ArrowRight className="size-4 text-border shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{row.right}</p>
                            <p className="text-xs text-muted-foreground">{row.rightType}</p>
                          </div>
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium border rounded px-2 py-0.5 shrink-0 ${cls}`}>
                            <StatusIcon className="size-3 shrink-0" />
                            {row.status}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Reporting & Export */}
          <div className="border border-border/60 overflow-hidden rounded bg-white">
            <SectionHeader>
              <div className="flex items-center gap-2">
                <Download className="size-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Reporting & Export</p>
                <span className="text-xs text-muted-foreground">Generate governance reports and export audit-ready documentation</span>
              </div>
            </SectionHeader>
            <div className="divide-y divide-border/60">
              {REPORTS.map(({ label, format, desc, action }) => (
                <div key={label} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border/60 bg-muted/30">
                    <FileText className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <span className="text-xs font-medium text-muted-foreground border border-border/60 rounded px-1.5 py-0.5 leading-none">{format}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                  <Button size="sm" className="bg-brand-800 hover:bg-brand-700 text-white gap-1.5 shrink-0">
                    {action} <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* AI Panel */}
      <div className={`shrink-0 overflow-hidden transition-all duration-300 ${drawerOpen ? 'w-[380px]' : 'w-0'}`}>
        {drawerOpen && <AuditAiPanel onClose={() => setDrawerOpen(false)} />}
      </div>
    </div>
  )
}
