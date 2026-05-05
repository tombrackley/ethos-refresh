import { useState, Fragment } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { AiSummaryBar } from '@/components/shared/AiSummaryBar'
import Feature from '@/components/Feature'
import {
  FileText, Upload, Plus, ChevronRight, ChevronDown, Clock, CheckCircle2,
  AlertCircle, AlertTriangle, X, Sparkles, ListChecks, Flag,
} from 'lucide-react'
import tenant from '@/config/tenant'

// ─── Data ────────────────────────────────────────────────────────────────────

const t = tenant.pages.contracts

const CONTRACTS_AI_POINTS = t.aiPoints

const CONTRACTS = [
  { name: 'Legal Panel Agreement',        ref: 'CTR-001', counterparty: 'Department of Justice',      type: 'Government', start: '01 Jan 2025', end: '31 Dec 2027', obligations: 24, risk: 'High',     status: 'Active',
    obligationItems: [
      { label: 'Quarterly compliance report', due: '31 Mar 2026', status: 'Due Soon' },
      { label: 'Maintain 3 accredited partners', due: 'Ongoing', status: 'Met' },
      { label: 'Annual panel review submission', due: '15 Jul 2026', status: 'Met' },
    ],
  },
  { name: 'Managed Legal Services',       ref: 'CTR-002', counterparty: 'Westfield Holdings Ltd',      type: 'Client',     start: '15 Mar 2025', end: '14 Mar 2026', obligations: 18, risk: 'Medium',   status: 'Active',
    obligationItems: [
      { label: 'Monthly matter status report', due: '28 Feb 2026', status: 'Overdue' },
      { label: 'PI insurance renewal notification', due: '15 Apr 2026', status: 'Due Soon' },
      { label: 'Notify of material staffing changes', due: 'Ongoing', status: 'Met' },
    ],
  },
  { name: 'Insurance Defence Panel',      ref: 'CTR-003', counterparty: 'National Insurance Corp',     type: 'Panel',      start: '01 Jul 2024', end: '30 Jun 2026', obligations: 31, risk: 'Critical', status: 'Expiring',
    obligationItems: [
      { label: 'AML/CTF training completion', due: '30 Jun 2026', status: 'Due Soon' },
      { label: 'Conflict register quarterly update', due: '15 May 2026', status: 'Met' },
      { label: 'Annual fee schedule review', due: '01 Jul 2026', status: 'Met' },
    ],
  },
  { name: 'IT Infrastructure Support',    ref: 'CTR-004', counterparty: 'TechServe Solutions',         type: 'Supplier',   start: '01 Sep 2025', end: '31 Aug 2027', obligations: 12, risk: 'Low',      status: 'Active',
    obligationItems: [
      { label: 'SOC 2 Type II maintenance', due: 'Ongoing', status: 'Met' },
      { label: 'ISO 27001 recertification', due: '01 Sep 2026', status: 'Met' },
    ],
  },
  { name: 'Pro Bono Programme MOU',       ref: 'CTR-005', counterparty: 'Community Legal Centre',      type: 'Client',     start: '01 Jan 2026', end: '31 Dec 2026', obligations: 8,  risk: 'Low',      status: 'Under Review',
    obligationItems: [
      { label: 'Quarterly hours commitment report', due: '31 Mar 2026', status: 'Met' },
      { label: 'Annual programme review', due: '31 Dec 2026', status: 'Met' },
    ],
  },
  { name: 'Corporate Advisory Retainer',  ref: 'CTR-006', counterparty: 'Meridian Capital Partners',   type: 'Client',     start: '01 Apr 2024', end: '31 Mar 2025', obligations: 15, risk: 'Medium',   status: 'Expired',
    obligationItems: [
      { label: 'Final close-out report',         due: '30 Apr 2025', status: 'Met' },
    ],
  },
  { name: 'Regulatory Compliance Panel',  ref: 'CTR-007', counterparty: 'Financial Conduct Authority', type: 'Government', start: '15 Jun 2025', end: '14 Jun 2028', obligations: 42, risk: 'Critical', status: 'Active',
    obligationItems: [
      { label: 'Annual regulatory compliance certificate', due: '30 Apr 2026', status: 'Due Soon' },
      { label: 'CPS 230 attestation submission', due: '30 Sep 2026', status: 'Met' },
      { label: 'Quarterly enforcement-action report', due: '30 Jun 2026', status: 'Met' },
      { label: 'Vendor risk assessment update', due: 'Ongoing', status: 'Met' },
    ],
  },
]

const OBLIGATION_STATUS_STYLE = {
  Met:        'border-emerald-200 bg-emerald-50 text-emerald-700',
  'Due Soon': 'border-amber-200 bg-amber-50 text-amber-700',
  Overdue:    'border-destructive/30 bg-destructive/10 text-destructive',
}

const FIRM_OBLIGATIONS = [
  { label: 'Quarterly compliance report to regulator',                clause: 'Clause 7.2',          category: 'Reporting Duties',      contract: 'Legal Panel Agreement',     due: '31 Mar 2026', status: 'In Progress', risk: 'medium' },
  { label: 'Maintain minimum 3 accredited partners on panel matters', clause: 'Clause 4.1(a)',        category: 'Service Delivery',      contract: 'Legal Panel Agreement',     due: 'Ongoing',     status: 'Complete',    risk: 'low'    },
  { label: 'Annual AML/CTF training completion for all staff',        clause: 'Clause 12.3',          category: 'Training Requirements', contract: 'Insurance Defence Panel',   due: '30 Jun 2026', status: 'In Progress', risk: 'high'   },
  { label: 'Professional indemnity insurance renewal notification',   clause: 'Clause 9.5',           category: 'Notification Duties',   contract: 'Managed Legal Services',    due: '15 Apr 2026', status: 'Upcoming',    risk: 'medium' },
  { label: 'ISO 27001 certification maintenance',                     clause: 'Schedule 3, para 2.1', category: 'Compliance',            contract: 'IT Infrastructure Support', due: '01 Sep 2026', status: 'Complete',    risk: 'low'    },
  { label: 'Monthly matter status reports to client',                 clause: 'Clause 5.3(b)',         category: 'Reporting Duties',      contract: 'Managed Legal Services',    due: '28 Feb 2026', status: 'Overdue',     risk: 'high'   },
]

const COUNTERPARTY_OBLIGATIONS = [
  { label: 'Provide monthly billing statements by 5th of each month', clause: 'Clause 8.2',   category: 'Billing',      contract: 'Westfield Holdings Ltd',    due: '05 Mar 2026', status: 'Upcoming',    risk: 'low'    },
  { label: 'Maintain SOC 2 Type II certification throughout term',    clause: 'Clause 14.1',  category: 'Security',     contract: 'TechServe Solutions',       due: 'Ongoing',     status: 'In Progress', risk: 'high'   },
  { label: 'Notify of material staffing changes within 48 hours',     clause: 'Clause 6.3',   category: 'Notification', contract: 'Managed Legal Services',    due: 'Ongoing',     status: 'Complete',    risk: 'low'    },
  { label: 'Submit annual regulatory compliance certificate',          clause: 'Clause 11.4',  category: 'Compliance',   contract: 'Legal Panel Agreement',     due: '30 Apr 2026', status: 'Upcoming',    risk: 'medium' },
]

const DEADLINES = [
  { label: 'Monthly Matter Status Report',             tag: 'Report Due',   contract: 'Managed Legal Services',      clause: 'Clause 5.3(b)',        lead: 'Senior Associate',    date: '28 Feb 2026', remaining: 'Overdue',        urgency: 'overdue' },
  { label: 'Quarterly Compliance Report',              tag: 'Report Due',   contract: 'Legal Panel Agreement',       clause: 'Clause 7.2',           lead: 'Head of Compliance',  date: '31 Mar 2026', remaining: '41d remaining',  urgency: 'medium'  },
  { label: 'Professional Indemnity Insurance Renewal', tag: 'Renewal',      contract: 'Managed Legal Services',      clause: 'Clause 9.5',           lead: 'Risk Partner',        date: '15 Apr 2026', remaining: '56d remaining',  urgency: 'medium'  },
  { label: 'Data Processing Agreement Update',         tag: 'Deadline',     contract: 'IT Infrastructure Support',   clause: 'Clause 11.2(c)',       lead: 'TechServe Solutions', date: '01 May 2026', remaining: '72d remaining',  urgency: 'low'     },
  { label: 'FCA Compliance Attestation',               tag: 'Certification',contract: 'Regulatory Compliance Panel', clause: 'Clause 6.1',           lead: 'Head of Compliance',  date: '15 Jun 2026', remaining: '107d remaining', urgency: 'low'     },
]

const EVIDENCE_STATS = [
  { label: 'Evidence Uploaded',       value: 47, alert: false },
  { label: 'Reports Submitted',       value: 12, alert: false },
  { label: 'Outstanding Evidence',    value: 8,  alert: true  },
  { label: 'Compliance Gaps Flagged', value: 3,  alert: true  },
]

const EVIDENCE_ITEMS = [
  { obligation: 'Quarterly compliance report',       contract: 'Legal Panel Agreement',    uploaded: '12 Feb 2026', evidenceType: 'Report submission confirmation',    status: 'Verified'       },
  { obligation: 'Panel staffing requirement',        contract: 'Legal Panel Agreement',    uploaded: '25 Jan 2026', evidenceType: 'Partner accreditation certificates', status: 'Verified'       },
  { obligation: 'AML/CTF training completion',       contract: 'Insurance Defence Panel',  uploaded: '—',           evidenceType: 'Training completion records',        status: 'Missing'        },
  { obligation: 'ISO 27001 certification',           contract: 'IT Infrastructure Support',uploaded: '20 Dec 2025', evidenceType: 'Certificate copy',                  status: 'Verified'       },
  { obligation: 'Professional indemnity notification',contract: 'Managed Legal Services',  uploaded: '10 Feb 2026', evidenceType: 'Insurer confirmation letter',        status: 'Pending Review' },
  { obligation: 'Monthly matter status report',      contract: 'Managed Legal Services',   uploaded: '—',           evidenceType: 'Report document',                   status: 'Missing'        },
  { obligation: 'Invoice payment compliance',        contract: 'Insurance Defence Panel',  uploaded: '01 Feb 2026', evidenceType: 'Payment records',                   status: 'Rejected'       },
]

const AI_ACTIONS = t.aiActions

// ─── Style maps ──────────────────────────────────────────────────────────────

const TYPE_PILL = 'bg-slate-100 text-slate-500'

const RISK_PILL = {
  Critical: 'bg-pink-300 text-slate-800',
  High:     'bg-amber-200 text-slate-800',
  Medium:   'bg-violet-100 text-slate-800',
  Low:      'bg-blue-100 text-slate-800',
}

const CONTRACT_STATUS = {
  'Active':       { dot: 'bg-emerald-400', text: 'text-muted-foreground' },
  'Expiring':     { dot: 'bg-amber-400',   text: 'text-amber-700'        },
  'Expired':      { dot: 'bg-slate-300',   text: 'text-muted-foreground' },
  'Under Review': { dot: 'bg-indigo-500',  text: 'text-indigo-600'       },
}

const OBL_STATUS_CHIP = {
  'Overdue':     { dot: 'bg-red-400',     text: 'text-red-600'          },
  'In Progress': { dot: 'bg-indigo-500',  text: 'text-indigo-600'       },
  'Complete':    { dot: 'bg-emerald-400', text: 'text-emerald-600'      },
  'Upcoming':    { dot: 'bg-slate-300',   text: 'text-muted-foreground' },
}

const OBL_RISK_PILL = {
  high:   'bg-amber-200 text-slate-800',
  medium: 'bg-violet-100 text-slate-800',
  low:    'bg-blue-100 text-slate-800',
}

const EVIDENCE_STATUS_STYLE = {
  'Verified':       { cls: 'text-emerald-600', Icon: CheckCircle2 },
  'Missing':        { cls: 'text-red-500',     Icon: AlertCircle  },
  'Pending Review': { cls: 'text-amber-600',   Icon: Clock        },
  'Rejected':       { cls: 'text-red-500',     Icon: AlertTriangle },
}

const DEADLINE_TAG_STYLE = 'bg-muted text-muted-foreground'

const priorityStyle = {
  High:   'border-amber-300 bg-amber-50 text-amber-700',
  Medium: 'border-slate-200 bg-slate-50 text-slate-600',
  Low:    'border-slate-200 bg-slate-50 text-slate-400',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ children }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
      {children}
    </div>
  )
}

function ContractsAiPanel({ onClose }) {
  return (
    <div className="flex flex-col w-[380px] shrink-0 border-l border-border overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-brand-600" />
          <span className="text-sm font-semibold text-foreground">Contracts Analysis</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="size-7 text-muted-foreground">
          <X className="size-4" />
        </Button>
      </div>
      <div className="flex-1 px-5 py-4 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ListChecks className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Suggested Actions</h3>
            <Badge variant="secondary" className="text-xs h-4 px-1.5 ml-auto">{AI_ACTIONS.length} items</Badge>
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
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Flag className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Contract Health</h3>
          </div>
          <div>
            {[
              { label: 'Active contracts',          value: '5 of 7',  note: '' },
              { label: 'Critical risk contracts',   value: '2',       note: 'text-red-500' },
              { label: 'Expiring within 90 days',   value: '1',       note: 'text-amber-600' },
              { label: 'Total obligations tracked', value: '150',     note: '' },
              { label: 'Overdue obligations',       value: '1',       note: 'text-red-500' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
                <p className="text-xs text-foreground">{s.label}</p>
                <span className={`text-xs font-medium shrink-0 ${s.note || 'text-muted-foreground'}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContractsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [obligationsTab, setObligationsTab] = useState('firm')
  const [expandedContracts, setExpandedContracts] = useState(() => new Set())
  const toggleContract = (ref) => setExpandedContracts(prev => {
    const next = new Set(prev)
    if (next.has(ref)) next.delete(ref); else next.add(ref)
    return next
  })

  const obligations = obligationsTab === 'firm' ? FIRM_OBLIGATIONS : COUNTERPARTY_OBLIGATIONS

  return (
    <div className="flex flex-1">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Contracts & Obligations</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Track contractual and regulatory obligations across your firm and counterparties.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Upload className="size-3.5" /> Upload Contract
              </Button>
              <Button size="sm" className="gap-1.5">
                <Plus className="size-3.5" /> Add Contract
              </Button>
            </div>
          </div>

          {/* AI Summary */}
          <Feature flag="FEATURE_AI_SUMMARY_BAR">
            <AiSummaryBar points={CONTRACTS_AI_POINTS} onOpenDrawer={() => setDrawerOpen(true)} />
          </Feature>

          {/* Contract Register */}
          <div className="border border-border/60 overflow-hidden rounded bg-white">
            <SectionHeader>
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Contract Register</p>
                <span className="text-xs text-muted-foreground">7 contracts tracked</span>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                View all <ChevronRight className="size-3.5" />
              </Button>
            </SectionHeader>
            <div className="px-5 py-1">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-muted-foreground pl-0 w-[26%]">Contract</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-[20%]">Counterparty</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Type</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Period</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground text-center">Obligations</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Risk</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground pr-0">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CONTRACTS.map(c => {
                    const st = CONTRACT_STATUS[c.status] ?? CONTRACT_STATUS['Active']
                    const isOpen = expandedContracts.has(c.ref)
                    return (
                      <Fragment key={c.ref}>
                        <TableRow
                          onClick={() => toggleContract(c.ref)}
                          className="border-border/60 cursor-pointer"
                        >
                          <TableCell className="pl-0 py-3">
                            <div className="flex items-start gap-2">
                              {isOpen
                                ? <ChevronDown className="size-3.5 text-muted-foreground shrink-0 mt-1" />
                                : <ChevronRight className="size-3.5 text-muted-foreground shrink-0 mt-1" />}
                              <div>
                                <p className="text-sm font-medium text-foreground">{c.name}</p>
                                <p className="text-xs text-muted-foreground">{c.ref}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{c.counterparty}</TableCell>
                          <TableCell>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_PILL}`}>{c.type}</span>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {c.start} – {c.end}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-sm font-medium text-foreground">{c.obligations}</span>
                          </TableCell>
                          <TableCell>
                          <span className={`inline-flex items-center px-2 h-5 rounded text-xs font-medium ${RISK_PILL[c.risk]}`}>{c.risk}</span>
                        </TableCell>
                          <TableCell className="pr-0">
                            <span className={`flex items-center gap-1.5 text-xs ${st.text}`}>
                              <span className={`size-1.5 rounded-full shrink-0 ${st.dot}`} />
                              {c.status}
                            </span>
                          </TableCell>
                        </TableRow>
                        {isOpen && (
                          <TableRow className="border-border/60 hover:bg-transparent">
                            <TableCell colSpan={7} className="px-0 pt-0 pb-3">
                              <div className="ml-6 mr-0 rounded-lg border border-border/50 bg-muted/20 p-3 space-y-2">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Key obligations</p>
                                {c.obligationItems.length === 0 ? (
                                  <p className="text-xs text-muted-foreground">No obligations recorded.</p>
                                ) : c.obligationItems.map((o, i) => (
                                  <div key={i} className="flex items-center gap-3 text-sm">
                                    <p className="flex-1 min-w-0 truncate text-foreground">{o.label}</p>
                                    <span className="text-xs text-muted-foreground shrink-0">{o.due}</span>
                                    <Badge variant="outline" className={`text-xs h-5 px-1.5 shrink-0 ${OBLIGATION_STATUS_STYLE[o.status] ?? ''}`}>{o.status}</Badge>
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Obligations + Deadlines row */}
          <div className="grid grid-cols-12 border border-border/60 overflow-hidden rounded bg-white">

            {/* Obligations Overview */}
            <div className="col-span-7 border-r border-border/60 overflow-hidden">
              <SectionHeader>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-foreground">Obligations Overview</p>
                  <div className="flex items-center gap-px border border-border/60 rounded overflow-hidden">
                    <button
                      onClick={() => setObligationsTab('firm')}
                      className={`text-xs px-3 py-1 transition-colors ${obligationsTab === 'firm' ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted/50'}`}
                    >
                      Firm
                    </button>
                    <button
                      onClick={() => setObligationsTab('counterparty')}
                      className={`text-xs px-3 py-1 transition-colors ${obligationsTab === 'counterparty' ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted/50'}`}
                    >
                      Counterparty
                    </button>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                  View all <ChevronRight className="size-3.5" />
                </Button>
              </SectionHeader>
              <div>
                {/* Column headers */}
                <div className="grid grid-cols-12 gap-3 px-5 pr-6 py-2 border-b border-border/60 bg-muted/20">
                  <p className="col-span-6 text-xs font-medium text-muted-foreground uppercase tracking-wide">Obligation</p>
                  <p className="col-span-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Due Date</p>
                  <p className="col-span-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</p>
                  <p className="col-span-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Risk</p>
                </div>
                {obligations.map((o, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 px-5 pr-6 py-3 border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors cursor-pointer items-start">
                    <div className="col-span-6 min-w-0">
                      <p className="text-sm text-foreground leading-snug">{o.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{o.clause} · {o.contract}</p>
                    </div>
                    <p className="col-span-3 text-xs text-muted-foreground self-center">{o.due}</p>
                    <div className="col-span-2 self-center">
                      <span className={`flex items-center gap-1.5 text-xs ${OBL_STATUS_CHIP[o.status]?.text}`}>
                        <span className={`size-1.5 rounded-full shrink-0 ${OBL_STATUS_CHIP[o.status]?.dot}`} />
                        {o.status}
                      </span>
                    </div>
                    <div className="col-span-1 self-center">
                      <span className={`inline-flex items-center px-2 h-5 rounded text-xs font-medium ${OBL_RISK_PILL[o.risk]}`}>{o.risk.charAt(0).toUpperCase() + o.risk.slice(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reporting & Deadlines */}
            <div className="col-span-5 overflow-hidden">
              <SectionHeader>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Reporting & Deadlines</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                  View all <ChevronRight className="size-3.5" />
                </Button>
              </SectionHeader>
              <div>
                {DEADLINES.map((d, i) => (
                  <div key={i} className="px-5 py-3.5 border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors cursor-pointer space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <p className="text-sm font-medium text-foreground leading-snug">{d.label}</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${DEADLINE_TAG_STYLE}`}>{d.tag}</span>
                      </div>
                      <p className={`text-xs shrink-0 font-medium tabular-nums ${d.urgency === 'overdue' ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {d.date}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">{d.contract} · {d.clause}</p>
                    <p className={`text-xs font-medium ${d.urgency === 'overdue' ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {d.remaining}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Evidence & Assurance */}
          <div className="border border-border/60 overflow-hidden rounded bg-white">
            <SectionHeader>
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Evidence & Assurance</p>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs">
                <Upload className="size-3.5" /> Upload Evidence
              </Button>
            </SectionHeader>

            {/* Stats row */}
            <div className="grid grid-cols-4 divide-x divide-border/60 border-b border-border/60">
              {EVIDENCE_STATS.map(s => (
                <div key={s.label} className="px-5 py-4">
                  <p className={`text-2xl font-medium ${s.alert ? 'text-amber-600' : 'text-foreground'}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Coverage bar */}
            <div className="px-5 py-3 border-b border-border/60 flex items-center gap-4">
              <p className="text-xs text-muted-foreground shrink-0">Evidence Coverage</p>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-brand-300 rounded-full" style={{ width: '70%' }} />
              </div>
              <p className="text-xs font-medium text-foreground shrink-0">47 of 67 obligations evidenced (70%)</p>
            </div>

            {/* Evidence table */}
            <div className="px-5 py-1">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-muted-foreground pl-0 w-[35%]">Obligation</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-[30%]">Evidence Type</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Uploaded</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground pr-0">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {EVIDENCE_ITEMS.map((e, i) => {
                    const st = EVIDENCE_STATUS_STYLE[e.status] ?? EVIDENCE_STATUS_STYLE['Missing']
                    return (
                      <TableRow key={i} className="border-border/60 cursor-pointer">
                        <TableCell className="pl-0 py-3">
                          <p className="text-sm text-foreground">{e.obligation}</p>
                          <p className="text-xs text-muted-foreground">{e.contract}</p>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{e.evidenceType}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{e.uploaded}</TableCell>
                        <TableCell className="pr-0">
                          <span className={`flex items-center gap-1.5 text-xs font-medium ${st.cls}`}>
                            <st.Icon className="size-3.5 shrink-0" />
                            {e.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

        </div>
      </div>

      {/* Push panel */}
      <div className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${drawerOpen ? 'w-[380px]' : 'w-0'}`}>
        <ContractsAiPanel onClose={() => setDrawerOpen(false)} />
      </div>
    </div>
  )
}
