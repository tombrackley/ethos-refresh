import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AiSummaryBar } from '@/components/shared/AiSummaryBar'
import Feature from '@/components/Feature'
import {
  Search, Plus, X, Check, ChevronDown, Sparkles, Zap,
  AlertTriangle, RefreshCw, FileText, Shield, ClipboardList,
  BookOpen, Scale, Building2, ChevronRight, Bell, Settings,
  ExternalLink, Clock,
} from 'lucide-react'
import tenant from '@/config/tenant'

// ─── Data ────────────────────────────────────────────────────────────────────

const t = tenant.pages.legislation

const PROFILE = {
  country: 'Australia',
  state: 'New South Wales',
  practiceAreas: ['Corporate', 'Commercial', 'Migration', 'Employment'],
  industries: ['Financial services', 'Healthcare', 'Technology'],
}

const RECENT_UPDATES = [
  {
    type: 'Amendment',    urgency: 'high', impact: 'High',
    title: 'Privacy Act 1988 — Proposed Reform',
    desc: 'Exposure draft released. Introduces direct right of action for individuals and mandatory data retention limits. Action required before March 2026.',
    aiSummary: 'Direct right of action for individuals plus retention limits — review data handling SOPs and breach response playbook before Mar 2026.',
    actionRequired: true,
    date: '18 Feb 2026', area: 'Firm',
  },
  {
    type: 'New Regulation', urgency: 'high', impact: 'High',
    title: 'APRA CPS 230 — Operational Risk Management',
    desc: 'Effective July 2025. New obligations for outsourcing arrangements. Review vendor contracts for compliance.',
    aiSummary: 'Outsourcing register, scenario testing and incident reporting tightened — vendor contracts likely need amendment letters.',
    actionRequired: true,
    date: '14 Feb 2026', area: 'Clients',
  },
  {
    type: 'Update', urgency: 'medium', impact: 'Medium',
    title: 'Fair Work Act — Casual Employment Amendments',
    desc: 'Changes to casual conversion rights effective March 2026. Employment matters and client HR advisory affected.',
    aiSummary: 'Casual conversion thresholds change Mar 2026 — flag to HR advisory clients and update standard letters.',
    actionRequired: false,
    date: '10 Feb 2026', area: 'Clients',
  },
  {
    type: 'Guidance',  urgency: 'low', impact: 'Low',
    title: 'ASIC Regulatory Guide 271 — Internal Dispute Resolution',
    desc: 'Updated timeframes for complaint handling. Relevant to financial services clients.',
    aiSummary: 'Refined IDR timeframes; minor process tweak for FS clients — no immediate action.',
    actionRequired: false,
    date: '05 Feb 2026', area: 'Clients',
  },
]

const IMPACT_STYLE = {
  High:   'border-red-200 bg-red-50 text-red-700',
  Medium: 'border-amber-200 bg-amber-50 text-amber-700',
  Low:    'border-slate-200 bg-slate-50 text-slate-600',
}

const FIRM_LEGISLATION = [
  { name: 'Corporations Act 2001 (Cth)',              status: 'Current',  lastReview: '01 Jan 2026', updates: 0 },
  { name: 'Work Health and Safety Act 2011',           status: 'Current',  lastReview: '15 Jan 2026', updates: 0 },
  { name: 'Privacy Act 1988 (Cth)',                   status: 'Updated',  lastReview: '18 Feb 2026', updates: 2 },
  { name: 'Anti-Money Laundering & CTF Act 2008',     status: 'Current',  lastReview: '10 Feb 2026', updates: 0 },
  { name: 'Legal Profession Uniform Law (NSW)',        status: 'Current',  lastReview: '05 Feb 2026', updates: 0 },
]

const CLIENT_LEGISLATION = [
  { name: 'Migration Act 1958 (Cth)',                                   status: 'Current', lastReview: '01 Feb 2026', updates: 0 },
  { name: 'Children and Young Persons (Care and Protection) Act 1998',  status: 'Current', lastReview: '20 Jan 2026', updates: 0 },
  { name: 'Fair Work Act 2009 (Cth)',                                    status: 'Updated', lastReview: '10 Feb 2026', updates: 1 },
  { name: 'Aged Care Act 1997 (Cth)',                                    status: 'Current', lastReview: '12 Jan 2026', updates: 0 },
  { name: 'Corporations Act 2001 — Chapter 7 (Financial Services)',      status: 'Current', lastReview: '01 Feb 2026', updates: 0 },
]

const REGULATORS = [
  { name: 'Law Society of New South Wales',                                   role: 'Professional regulation',   url: true },
  { name: 'Australian Securities and Investments Commission (ASIC)',           role: 'Corporate & financial',     url: true, alert: true },
  { name: 'Office of the Migration Agents Registration Authority (OMARA)',     role: 'Migration practice',        url: true },
  { name: 'Australian Prudential Regulation Authority (APRA)',                 role: 'Financial services',        url: true, alert: true },
  { name: 'Federal Court of Australia (FCA)',                                  role: 'Litigation & proceedings',  url: true },
]

const STANDARDS = [
  { name: 'ASX Corporate Governance Principles and Recommendations', category: 'Governance',    current: true  },
  { name: 'ISO 27001 — Information Security Management',             category: 'Technology',    current: true  },
  { name: 'Commonwealth Modern Slavery Act 2018 — Guidance',         category: 'Compliance',    current: true  },
  { name: 'ESG Reporting Frameworks (TCFD / ISSB)',                   category: 'Reporting',     current: false },
]

const AI_SUGGESTIONS = t.aiSuggestions

const LEGISLATION_AI_POINTS = t.aiPoints

const ALL_PRACTICE_AREAS = ['Corporate', 'Commercial', 'Migration', 'Employment', 'Property', 'Family', 'Litigation', 'Other']
const ALL_INDUSTRIES     = ['Financial services', 'Construction', 'Healthcare', 'Education', 'Government', 'Not-for-profit', 'Technology', 'Other']

// ─── Style maps ───────────────────────────────────────────────────────────────

const UPDATE_URGENCY = {
  high:   { dot: 'bg-red-400',     text: 'text-red-600',     tag: 'bg-red-50 text-red-600'       },
  medium: { dot: 'bg-amber-400',   text: 'text-amber-600',   tag: 'bg-amber-50 text-amber-700'   },
  low:    { dot: 'bg-slate-300',   text: 'text-muted-foreground', tag: 'bg-muted text-muted-foreground' },
}

const LEG_STATUS = {
  Current: { dot: 'bg-emerald-400', text: 'text-muted-foreground' },
  Updated: { dot: 'bg-amber-400',   text: 'text-amber-700'        },
}

const CATEGORY_STYLE = {
  'SUGGESTED LEGISLATION': 'text-brand-700',
  'REGULATORY UPDATE':     'text-amber-600',
  'RISK ALERT':            'text-red-600',
}

const PRIORITY_STYLE = {
  Updated: 'bg-amber-100 text-amber-700',
  High:    'bg-red-100 text-red-600',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, sub, action }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">{title}</p>
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
      {action && (
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
          {action} <ChevronRight className="size-3.5" />
        </Button>
      )}
    </div>
  )
}


function ConfigureOverlay({ onClose }) {
  const [practiceAreas, setPracticeAreas] = useState(new Set(PROFILE.practiceAreas))
  const [industries, setIndustries]       = useState(new Set(PROFILE.industries))
  const [suggestLeg, setSuggestLeg]       = useState(true)

  const toggle = (set, setFn, val) => {
    const next = new Set(set)
    next.has(val) ? next.delete(val) : next.add(val)
    setFn(next)
  }

  const Checkbox = ({ checked, onToggle, label }) => (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={onToggle}
        className={`size-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
          checked ? 'bg-brand-800 border-brand-800' : 'border-border group-hover:border-brand-400'
        }`}
      >
        {checked && <Check className="size-2.5 text-white" />}
      </div>
      <span className="text-sm text-foreground">{label}</span>
    </label>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
          <h2 className="text-base font-semibold text-foreground">Configure</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="size-7 text-muted-foreground">
            <X className="size-4" />
          </Button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* Jurisdiction */}
          <div className="px-6 py-5 border-b border-border/60">
            <p className="text-sm font-semibold text-foreground mb-0.5">Jurisdiction</p>
            <p className="text-xs text-muted-foreground mb-4">The primary jurisdiction and sub-jurisdiction your firm operates within.</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Country',          value: PROFILE.country },
                { label: 'State / Province', value: PROFILE.state   },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{label}</p>
                  <div className="relative">
                    <select className="w-full appearance-none border border-border/60 rounded-md px-3 py-2 text-sm bg-background text-foreground pr-8 focus:outline-none focus:ring-1 focus:ring-brand-500">
                      <option>{value}</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Areas */}
          <div className="px-6 py-5 border-b border-border/60">
            <p className="text-sm font-semibold text-foreground mb-0.5">Practice Areas</p>
            <p className="text-xs text-muted-foreground mb-4">Select the areas of law your firm practises in.</p>
            <div className="grid grid-cols-3 gap-x-4 gap-y-3">
              {ALL_PRACTICE_AREAS.map(a => (
                <Checkbox key={a} checked={practiceAreas.has(a)} onToggle={() => toggle(practiceAreas, setPracticeAreas, a)} label={a} />
              ))}
            </div>
          </div>

          {/* Client Industries */}
          <div className="px-6 py-5">
            <p className="text-sm font-semibold text-foreground mb-0.5">Client Industries</p>
            <p className="text-xs text-muted-foreground mb-4">Select the industries your clients operate within.</p>
            <div className="grid grid-cols-3 gap-x-4 gap-y-3">
              {ALL_INDUSTRIES.map(i => (
                <Checkbox key={i} checked={industries.has(i)} onToggle={() => toggle(industries, setIndustries, i)} label={i} />
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border/60">
              <Checkbox checked={suggestLeg} onToggle={() => setSuggestLeg(v => !v)} label="Suggest relevant legislation and regulation" />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border/60">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" className="bg-brand-800 hover:bg-brand-900 text-white" onClick={onClose}>Save</Button>
        </div>

      </div>
    </div>
  )
}

function AiPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState('all')
  const [added, setAdded]         = useState(new Set([1]))

  const tabs = [
    { id: 'all',         label: 'All',         count: 15 },
    { id: 'legislation', label: 'Legislation',  count: 9  },
    { id: 'updates',     label: 'Updates',      count: 3  },
    { id: 'risks',       label: 'Risks',        count: 3  },
  ]

  const visible = activeTab === 'all'
    ? AI_SUGGESTIONS
    : AI_SUGGESTIONS.filter(s => s.filter === activeTab)

  return (
    <div className="flex flex-col w-[340px] shrink-0 border-l border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-brand-800 text-white">
              <Zap className="size-3" />
            </div>
            <p className="text-sm font-semibold text-foreground">Ethos AI</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="size-6 text-muted-foreground">
            <X className="size-3.5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Showing <span className="font-medium text-foreground">15 suggestions</span> based on your selected jurisdiction, <span className="font-medium text-foreground">4</span> practice areas, <span className="font-medium text-foreground">3</span> industries
        </p>
      </div>

      <div className="flex items-center gap-1 px-4 py-2 border-b border-border/60">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-colors font-medium ${
              activeTab === tab.id ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            <span className={`text-xs ${activeTab === tab.id ? 'opacity-60' : 'opacity-50'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border/60">
        {visible.map(s => (
          <div key={s.id} className="px-4 py-3.5 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <p className={`text-xs font-semibold uppercase tracking-wider ${CATEGORY_STYLE[s.category]}`}>{s.category}</p>
              {s.priority && (
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${PRIORITY_STYLE[s.priority]}`}>{s.priority}</span>
              )}
            </div>
            <p className="text-xs font-medium text-foreground leading-snug">{s.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{s.tag}</span>
              {added.has(s.id) ? (
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1"><Check className="size-3" /> Added</span>
              ) : (
                <button onClick={() => setAdded(prev => new Set([...prev, s.id]))} className="text-xs font-medium text-brand-700 hover:text-brand-900 flex items-center gap-0.5 transition-colors">
                  <Plus className="size-3" /> Add
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LegislationPage() {
  const [search, setSearch]         = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeTab, setActiveTab]   = useState('firm')
  const [configOpen, setConfigOpen] = useState(false)

  return (
    <>
    {configOpen && <ConfigureOverlay onClose={() => setConfigOpen(false)} />}
    <div className="flex flex-1 overflow-hidden">

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Legislation & Regulatory Landscape</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Relevant legislation, regulation and best practice standards for your firm and clients.
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <Sparkles className="size-3 text-brand-700" />
                AI monitoring active — last scan 12 minutes ago
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={() => setConfigOpen(true)}>
              <Settings className="size-3.5" /> Configure
            </Button>
          </div>

          {/* Profile strip */}
          <div className="border border-border/60 rounded overflow-hidden bg-white">
            <div className="grid grid-cols-3 divide-x divide-border/60">
              <div className="px-5 py-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Jurisdiction</p>
                <p className="text-sm font-medium text-foreground">{PROFILE.country} — {PROFILE.state}</p>
              </div>
              <div className="px-5 py-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Practice Areas</p>
                <div className="flex flex-wrap gap-1">
                  {PROFILE.practiceAreas.map(a => (
                    <span key={a} className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded">{a}</span>
                  ))}
                </div>
              </div>
              <div className="px-5 py-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Client Industries</p>
                <div className="flex flex-wrap gap-1">
                  {PROFILE.industries.map(i => (
                    <span key={i} className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded">{i}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <Feature flag="FEATURE_AI_SUMMARY_BAR">
            <AiSummaryBar points={LEGISLATION_AI_POINTS} onOpenDrawer={() => setDrawerOpen(true)} />
          </Feature>

          {/* Updates + Register row */}
          <div className="grid grid-cols-3 gap-6 items-start">

          {/* Tabbed register — 2/3 */}
          <div className="col-span-2 border border-border/60 overflow-hidden rounded bg-white">

            {/* Title row */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Register</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                Manage <ChevronRight className="size-3.5" />
              </Button>
            </div>

            {/* Tab bar */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/60">
              {[
                { id: 'firm',       label: 'Firm Legislation',         count: FIRM_LEGISLATION.length },
                { id: 'client',     label: 'Client Legislation',       count: CLIENT_LEGISLATION.length },
                { id: 'regulators', label: 'Regulators & Authorities', count: REGULATORS.length },
                { id: 'standards',  label: 'Industry Standards',       count: STANDARDS.length },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                    activeTab === tab.id
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {tab.label}
                  <span className={`text-xs ${activeTab === tab.id ? 'opacity-60' : 'opacity-50'}`}>{tab.count}</span>
                </button>
              ))}
            </div>

            {/* Firm Legislation */}
            {activeTab === 'firm' && (
              <>
                <div className="divide-y divide-border/60">
                  {FIRM_LEGISLATION.map((item, i) => {
                    const s = LEG_STATUS[item.status]
                    return (
                      <div key={i} className="flex items-start justify-between gap-3 px-5 py-3 hover:bg-muted/20 transition-colors cursor-pointer">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground leading-snug">{item.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Reviewed {item.lastReview}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                          {item.updates > 0 && (
                            <span className="text-xs font-medium bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">{item.updates} update{item.updates > 1 ? 's' : ''}</span>
                          )}
                          <span className={`flex items-center gap-1 text-xs ${s.text}`}>
                            <span className={`size-1.5 rounded-full ${s.dot}`} />{item.status}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="px-5 py-3 border-t border-border/60">
                  <button className="flex items-center gap-1.5 text-xs text-brand-700 hover:text-brand-900 transition-colors font-medium">
                    <Plus className="size-3.5" /> Add legislation
                  </button>
                </div>
              </>
            )}

            {/* Client Legislation */}
            {activeTab === 'client' && (
              <>
                <div className="divide-y divide-border/60">
                  {CLIENT_LEGISLATION.map((item, i) => {
                    const s = LEG_STATUS[item.status]
                    return (
                      <div key={i} className="flex items-start justify-between gap-3 px-5 py-3 hover:bg-muted/20 transition-colors cursor-pointer">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground leading-snug">{item.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Reviewed {item.lastReview}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                          {item.updates > 0 && (
                            <span className="text-xs font-medium bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">{item.updates} update{item.updates > 1 ? 's' : ''}</span>
                          )}
                          <span className={`flex items-center gap-1 text-xs ${s.text}`}>
                            <span className={`size-1.5 rounded-full ${s.dot}`} />{item.status}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="px-5 py-3 border-t border-border/60">
                  <button className="flex items-center gap-1.5 text-xs text-brand-700 hover:text-brand-900 transition-colors font-medium">
                    <Plus className="size-3.5" /> Add legislation
                  </button>
                </div>
              </>
            )}

            {/* Regulators & Authorities */}
            {activeTab === 'regulators' && (
              <>
                <div className="divide-y divide-border/60">
                  {REGULATORS.map((r, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-muted/20 transition-colors cursor-pointer">
                      <div className="min-w-0">
                        <p className="text-sm text-foreground leading-snug">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.role}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {r.alert && <span className="size-1.5 rounded-full bg-amber-400" />}
                        <ExternalLink className="size-3.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-border/60">
                  <button className="flex items-center gap-1.5 text-xs text-brand-700 hover:text-brand-900 transition-colors font-medium">
                    <Plus className="size-3.5" /> Add regulator
                  </button>
                </div>
              </>
            )}

            {/* Industry Standards */}
            {activeTab === 'standards' && (
              <>
                <div className="divide-y divide-border/60">
                  {STANDARDS.map((s, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-muted/20 transition-colors cursor-pointer">
                      <div className="min-w-0">
                        <p className="text-sm text-foreground leading-snug">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.category}</p>
                      </div>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded shrink-0 ${s.current ? 'bg-emerald-50 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                        {s.current ? 'Current' : 'Monitoring'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-border/60">
                  <button className="flex items-center gap-1.5 text-xs text-brand-700 hover:text-brand-900 transition-colors font-medium">
                    <Plus className="size-3.5" /> Add framework
                  </button>
                </div>
              </>
            )}

          </div>

          {/* Recent updates — 1/3 */}
          <div className="col-span-1 border border-border/60 overflow-hidden rounded bg-white">
            <SectionHeader icon={Bell} title="Recent Updates & Alerts" sub={`${RECENT_UPDATES.length} new`} action="View all" />
            <div className="divide-y divide-border/60">
              {RECENT_UPDATES.map((u, i) => {
                const s = UPDATE_URGENCY[u.urgency]
                return (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/20 transition-colors cursor-pointer">
                    <span className={`size-1.5 rounded-full shrink-0 mt-1.5 ${s.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${s.tag}`}>{u.type}</span>
                        <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{u.area}</span>
                        {u.impact && (
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded border ${IMPACT_STYLE[u.impact] ?? ''}`}>{u.impact} impact</span>
                        )}
                        {u.actionRequired && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                            <span className="size-1.5 rounded-full bg-red-500" /> Action required
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-foreground leading-snug">{u.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{u.desc}</p>
                      {u.aiSummary && (
                        <div className="mt-1.5 flex items-start gap-1.5 rounded bg-brand-50/50 border border-brand-100 px-2 py-1">
                          <Sparkles className="size-3 text-brand-700 shrink-0 mt-0.5" />
                          <p className="text-xs text-brand-900/70 italic leading-relaxed">{u.aiSummary}</p>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground/60 mt-1">{u.date}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          </div>{/* end Updates + Register row */}

        </div>
      </div>

      {/* AI Drawer */}
      <div className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${drawerOpen ? 'w-[340px]' : 'w-0'}`}>
        <AiPanel onClose={() => setDrawerOpen(false)} />
      </div>

    </div>
    </>
  )
}
