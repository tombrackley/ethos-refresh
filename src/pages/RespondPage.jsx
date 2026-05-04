import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  FileText, Mail, ClipboardList, BookOpen, FileEdit, Search,
  Zap, X, AlertTriangle, CheckCircle2, Clock, Send, Shield,
} from 'lucide-react'
import ContractCoachOverlay from '@/components/ContractCoachOverlay'
import PolicyUpliftOverlay from '@/components/PolicyUpliftOverlay'

// ─── Data ─────────────────────────────────────────────────────────────────────

const DRAFT_ACTIONS = [
  { id: 'advice',    icon: FileText,      iconBg: 'bg-brand-100',  iconColor: 'text-brand-800',  title: 'Draft advice',       desc: 'Generate structured legal advice with AI',              popular: true  },
  { id: 'email',     icon: Mail,          iconBg: 'bg-teal-50',    iconColor: 'text-teal-700',   title: 'Draft client email', desc: 'Professional client correspondence, quickly crafted',    popular: true  },
  { id: 'review',    icon: ClipboardList, iconBg: 'bg-teal-100',   iconColor: 'text-teal-800',   title: 'Review contract',    desc: 'Analyse and identify contractual risks and issues',      popular: true  },
  { id: 'summarise', icon: BookOpen,      iconBg: 'bg-violet-100', iconColor: 'text-violet-700', title: 'Summarise document', desc: 'Create clear, concise summaries of complex documents',   popular: false },
  { id: 'filenote',  icon: FileEdit,      iconBg: 'bg-slate-100',  iconColor: 'text-slate-600',  title: 'Prepare file note',  desc: 'Capture and structure meeting or call notes',            popular: false },
  { id: 'research',  icon: Search,        iconBg: 'bg-amber-100',  iconColor: 'text-amber-700',  title: 'Research query',     desc: 'Search across legal and regulatory materials',           popular: false },
]

const FEATURED_AGENTS = [
  { id: 'advice',     name: 'Advice Drafter',    provider: 'ProDoc',    desc: 'End-to-end legal advice generation',          color: 'bg-brand-100 text-brand-800',  initials: 'AD' },
  { id: 'contract',   name: 'ContractCoach',      provider: 'CoachAI',   desc: 'Smart contract guidance and clause coaching',  color: 'bg-teal-100 text-teal-800',    initials: 'CC' },
  { id: 'compliance', name: 'Compliance Checker', provider: 'SafeCheck', desc: 'Automated compliance and regulatory review',   color: 'bg-violet-100 text-violet-800',initials: 'CC' },
  { id: 'policy',     name: 'Policy Uplift',      provider: 'PolicyAI',  desc: 'Review and strengthen internal policy docs',   color: 'bg-orange-100 text-orange-800',initials: 'PU' },
]

const RECENTLY_USED = [
  { name: 'Advice Drafter', matter: 'Henderson + Corp Ltd', time: '2 hours ago', color: 'bg-brand-100 text-brand-800', initials: 'AD' },
  { name: 'ContractCoach',  matter: 'Project Atlas NDA',    time: 'Yesterday',   color: 'bg-teal-100 text-teal-800',   initials: 'CC' },
]

const SUGGESTED_AGENTS = [
  { name: 'Due Diligence Assistant', reason: 'Based on your recent matters',   color: 'bg-slate-100 text-slate-700', initials: 'DA' },
  { name: 'Litigation Summariser',   reason: 'Popular in your practice group', color: 'bg-amber-100 text-amber-800', initials: 'LS' },
]

const CUSTOM_AGENTS = [
  {
    name: 'Settlement Calculator',
    desc: 'Estimates quantum calculations for personal injury matters',
    complexity: 'Moderate', complexityColor: 'text-amber-700 bg-amber-50 border-amber-200',
    time: '5–13 hrs saved/wk', color: 'bg-blue-100 text-blue-800', initials: 'SC',
  },
  {
    name: 'Client Intake Processor',
    desc: 'Automates and accelerates new client onboarding workflows',
    complexity: 'Low', complexityColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    time: 'Custom estimate', color: 'bg-emerald-100 text-emerald-800', initials: 'CI',
  },
]

const TIME_SAVINGS = [
  { label: 'Contract review',  value: '6.3 hrs/wk', bar: 83 },
  { label: 'Advice drafting',  value: '4.1 hrs/wk', bar: 55 },
  { label: 'Document summary', value: '3.3 hrs/wk', bar: 44 },
]

const IDENTIFIED_PROCESSES = [
  'Repetitive NDA clause extraction across 12 matters',
  'Manual file note formatting after client calls',
  'Recurring compliance checklist completion',
]

const SANDPIT_TOOLS = [
  { name: 'Lexiki',    desc: 'Contract intelligence and clause analysis',    status: 'connected',    tag: 'CONTRACT',   color: 'bg-blue-100 text-blue-800',     initials: 'LX' },
  { name: 'ClosedQ',   desc: 'Draft clause library and precedent banking',   status: 'connected',    tag: 'DRAFTING',   color: 'bg-violet-100 text-violet-800', initials: 'CQ' },
  { name: 'CompliBit', desc: 'Automated compliance monitoring',              status: 'disconnected', tag: 'COMPLIANCE', color: 'bg-emerald-100 text-emerald-800',initials: 'CB' },
  { name: 'BrieflyQ',  desc: 'Briefing note and argument analysis',          status: 'disconnected', tag: 'LITIGATION', color: 'bg-pink-100 text-pink-800',     initials: 'BQ' },
  { name: 'DocuSense', desc: 'Intelligent document processing',              status: 'disconnected', tag: 'DOCUMENTS',  color: 'bg-amber-100 text-amber-800',   initials: 'DS' },
  { name: 'RegWatch',  desc: 'Regulatory change monitoring and alerting',    status: 'disconnected', tag: 'REGULATORY', color: 'bg-red-100 text-red-800',       initials: 'RW' },
]

const RECENT_RESPONSES = [
  { title: 'Advice – Henderson liability assessment',    matter: 'Henderson + Corp Ltd', time: '1 hr ago',    status: 'Draft' },
  { title: 'Client email – Settlement proposal outline', matter: 'Thompson Estate',       time: '3 hours ago', status: 'Sent'  },
  { title: 'File note – Conference with counsel',        matter: 'Baker v. Hall',         time: '5 hours ago', status: 'Sent'  },
]

const RESPONSE_STATUS = {
  Draft: 'text-amber-700 bg-amber-50 border-amber-200',
  Sent:  'text-emerald-700 bg-emerald-50 border-emerald-200',
  New:   'text-blue-700 bg-blue-50 border-blue-200',
}

const FLAGGED_REVIEWS = [
  { title: 'Advice – Henderson liability assessment',  issue: 'Conflict of interest risk identified in generated output', severity: 'High',   time: '20 min ago' },
  { title: 'Contract review – Vendor NDA',             issue: 'Non-standard indemnity clause flagged for review',          severity: 'Medium', time: 'Yesterday'  },
]

const RISK_CHECKS = [
  { check: 'Hallucination check',      status: 'pass',    desc: 'All citations verified against source documents'         },
  { check: 'Jurisdictional accuracy',  status: 'warning', desc: 'References to legislation may need localisation review' },
  { check: 'Confidentiality scan',     status: 'pass',    desc: 'No sensitive data identified in generated output'        },
  { check: 'Structure/clause review',  status: 'pass',    desc: 'Output structure aligns with firm template guidelines'  },
]

const VERIFIED_CHECKLIST = [
  "Ensure advice aligns with the firm's professional conduct obligations",
  'Review output against applicable practice area guidelines',
  'Verify AI-generated content has been reviewed by a qualified practitioner',
  'Review output against applicable privacy act implications',
]

// Right panel data
const SUGGESTED_PROMPTS = [
  'Draft advice on liability exposure for Henderson matter',
  'Summarise key obligations under the vendor NDA',
  "Prepare file note for today's client conference",
]

const MATTER_CONTEXT = [
  { name: 'Henderson & Corp Ltd', type: 'Corporate', docs: 4  },
  { name: 'Project Atlas',        type: 'M&A',       docs: 18 },
  { name: 'Thompson Estate',      type: 'Probate',   docs: 3  },
]

const PANEL_RISK_ALERTS = [
  'Conflict check pending for Henderson matter',
  'Document classification incomplete — 3 files',
]

const BEST_PRACTICES = [
  'Always verify AI-generated citations against original sources',
  'Include matter context when drafting to improve accuracy',
  'Review outputs for jurisdictional relevance before sending',
  'Use structured prompts for consistent, high-quality results',
]

// ─── AI Context Panel ─────────────────────────────────────────────────────────

function AiContextPanel({ onClose }) {
  const [ask, setAsk] = useState('')

  return (
    <div className="flex flex-col h-full border-l border-border/60 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-800 text-white">
            <Zap className="size-3" />
          </div>
          <span className="text-sm font-semibold">Ethos AI</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* Suggested Prompts */}
        <div className="px-4 py-4 border-b border-border/60">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">Suggested Prompts</p>
          <ul className="space-y-1.5">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <li key={i}>
                <button className="w-full text-left text-xs text-foreground/80 hover:text-foreground bg-muted/40 hover:bg-muted rounded px-2.5 py-2 leading-snug transition-colors">
                  {prompt}
                </button>
              </li>
            ))}
          </ul>
          <button className="mt-2.5 text-xs text-brand-600 hover:text-brand-700 transition-colors">
            Browse Prompt Library →
          </button>
        </div>

        {/* Matter Context */}
        <div className="px-4 py-4 border-b border-border/60">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">Matter Context Available</p>
          <ul className="space-y-2.5">
            {MATTER_CONTEXT.map((m, i) => (
              <li key={i} className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.type} · {m.docs} docs</p>
                </div>
                <button className="text-xs text-brand-600 hover:text-brand-700 whitespace-nowrap transition-colors shrink-0 mt-0.5">
                  Use →
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Risk Alerts */}
        <div className="px-4 py-4 border-b border-border/60">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">Risk Alerts</p>
          <ul className="space-y-2">
            {PANEL_RISK_ALERTS.map((alert, i) => (
              <li key={i} className="flex gap-2 items-start">
                <AlertTriangle className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-xs text-foreground/80 leading-snug">{alert}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Best Practices */}
        <div className="px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">Best Practices</p>
          <ul className="space-y-2.5">
            {BEST_PRACTICES.map((bp, i) => (
              <li key={i} className="flex gap-2 items-start">
                <CheckCircle2 className="size-3.5 text-brand-600 shrink-0 mt-0.5" />
                <span className="text-xs text-foreground/80 leading-snug">{bp}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Ask input */}
      <div className="px-4 py-3 border-t border-border/60 shrink-0">
        <div className="flex items-center gap-2">
          <input
            value={ask}
            onChange={e => setAsk(e.target.value)}
            placeholder="Ask Ethos AI..."
            className="flex-1 text-xs bg-muted/50 border border-border rounded px-3 h-8 outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
          />
          <button className="flex h-8 w-8 items-center justify-center rounded bg-brand-800 text-white hover:opacity-90 transition-opacity shrink-0">
            <Send className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RespondPage() {
  const [aiPanelOpen, setAiPanelOpen] = useState(true)
  const [contractCoachOpen, setContractCoachOpen] = useState(false)
  const [policyUpliftOpen, setPolicyUpliftOpen] = useState(false)

  return (
    <div className="flex flex-1 overflow-hidden">

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-5">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Respond</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Draft, review and respond with intelligence and confidence. Use pre-built AI agents to make work forward safely.</p>
            </div>
            {!aiPanelOpen && (
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 shrink-0" onClick={() => setAiPanelOpen(true)}>
                <Zap className="size-3.5 text-brand-600" /> AI Context
              </Button>
            )}
          </div>

          {/* ── 1. Drafting & Analysis ── */}
          <div className="border border-border/60 rounded overflow-hidden bg-white">
            <div className="px-5 py-3 border-b border-border/60">
              <p className="text-sm font-medium text-foreground">Drafting & Analysis</p>
              <p className="text-xs text-muted-foreground mt-0.5">Select an action to begin drafting or analysing with AI</p>
            </div>
            <div className="p-4 grid grid-cols-3 gap-3">
              {DRAFT_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  className="flex items-start gap-3 rounded border border-border/60 p-3.5 text-left hover:bg-muted/40 transition-colors"
                >
                  <div className={`flex size-8 items-center justify-center rounded shrink-0 ${action.iconBg}`}>
                    <action.icon className={`size-4 ${action.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-sm font-medium text-foreground">{action.title}</p>
                      {action.popular && (
                        <span className="text-xs bg-brand-800 text-brand-50 rounded px-1.5 py-0.5 font-medium leading-none">Popular</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── 2. AI Agents ── */}
          <div className="border border-border/60 rounded overflow-hidden bg-white">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
              <div>
                <p className="text-sm font-medium text-foreground">AI Agents</p>
                <p className="text-xs text-muted-foreground mt-0.5">Access built-in or recently used agents</p>
              </div>
              <button className="text-xs text-brand-600 hover:text-brand-700 transition-colors whitespace-nowrap shrink-0">
                View all agents →
              </button>
            </div>

            {/* Featured */}
            <div className="px-5 pt-4 pb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Featured</p>
              <div className="grid grid-cols-4 gap-3">
                {FEATURED_AGENTS.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={
                      agent.id === 'contract' ? () => setContractCoachOpen(true) :
                      agent.id === 'policy'   ? () => setPolicyUpliftOpen(true)   :
                      undefined
                    }
                    className="flex flex-col gap-2.5 border border-border/60 rounded p-3 text-left hover:bg-muted/40 transition-colors"
                  >
                    <span className={`inline-flex size-8 items-center justify-center rounded text-xs font-bold shrink-0 ${agent.color}`}>
                      {agent.initials}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-foreground">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.provider}</p>
                      <p className="text-xs text-foreground/70 mt-1 leading-snug">{agent.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recently Used + Suggested */}
            <div className="grid grid-cols-2 divide-x divide-border/60 border-t border-border/60">
              <div className="px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Recently Used</p>
                <ul className="space-y-3">
                  {RECENTLY_USED.map((agent, i) => (
                    <li key={i} className="flex items-center gap-2.5 cursor-pointer group">
                      <span className={`inline-flex size-6 items-center justify-center rounded text-xs font-bold shrink-0 ${agent.color}`}>
                        {agent.initials}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground group-hover:text-brand-700 transition-colors">{agent.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{agent.matter}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{agent.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Suggested</p>
                <ul className="space-y-3">
                  {SUGGESTED_AGENTS.map((agent, i) => (
                    <li key={i} className="flex items-center gap-2.5 cursor-pointer group">
                      <span className={`inline-flex size-6 items-center justify-center rounded text-xs font-bold shrink-0 ${agent.color}`}>
                        {agent.initials}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground group-hover:text-brand-700 transition-colors">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">{agent.reason}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── 3. Custom Agents & Opportunities ── */}
          <div className="border border-border/60 rounded overflow-hidden bg-white">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
              <div>
                <p className="text-sm font-medium text-foreground">Custom Agents & Opportunities</p>
                <p className="text-xs text-muted-foreground mt-0.5">Build tailored agents and discover efficiency opportunities</p>
              </div>
              <button className="text-xs text-brand-600 hover:text-brand-700 transition-colors whitespace-nowrap shrink-0">
                Explore custom agents →
              </button>
            </div>

            {/* Custom agent cards */}
            <div className="p-4 grid grid-cols-2 gap-3">
              {CUSTOM_AGENTS.map((agent, i) => (
                <div key={i} className="flex items-start gap-3 border border-border/60 rounded p-4">
                  <span className={`inline-flex size-8 items-center justify-center rounded text-xs font-bold shrink-0 ${agent.color}`}>
                    {agent.initials}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-sm font-medium text-foreground">{agent.name}</p>
                      <span className={`text-xs border rounded px-1.5 py-0.5 font-medium ${agent.complexityColor}`}>
                        {agent.complexity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">{agent.desc}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="size-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{agent.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Time Savings + Identified Processes */}
            <div className="grid grid-cols-2 divide-x divide-border/60 border-t border-border/60">
              <div className="px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Estimated Time Savings</p>
                <div className="space-y-3">
                  {TIME_SAVINGS.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-xs text-foreground/80 w-32 shrink-0">{item.label}</span>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-brand-400 rounded-full" style={{ width: `${item.bar}%` }} />
                      </div>
                      <span className="text-xs font-medium text-foreground w-20 text-right tabular-nums shrink-0">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Identified Processes</p>
                <ul className="space-y-2.5">
                  {IDENTIFIED_PROCESSES.map((proc, i) => (
                    <li key={i} className="flex gap-2.5 items-start">
                      <span className="mt-1.5 size-1 rounded-full bg-muted-foreground/40 shrink-0" />
                      <span className="text-xs text-foreground/80 leading-snug">{proc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── 4. Sandpit ── */}
          <div className="border border-border/60 rounded overflow-hidden bg-white">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">Sandpit</p>
                  <span className="text-xs bg-brand-100 text-brand-700 rounded px-1.5 py-0.5 font-medium">Beta</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Explore vetted partner AI tools in a safe, sandboxed environment</p>
              </div>
              <button className="text-xs text-brand-600 hover:text-brand-700 transition-colors whitespace-nowrap shrink-0">
                Open Sandpit →
              </button>
            </div>

            <div className="p-4 grid grid-cols-3 gap-3">
              {SANDPIT_TOOLS.map((tool) => (
                <div key={tool.name} className="border border-border/60 rounded p-3.5 space-y-2.5 hover:bg-muted/30 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex size-8 items-center justify-center rounded text-xs font-bold ${tool.color}`}>
                      {tool.initials}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                      tool.status === 'connected' ? 'text-emerald-600' : 'text-muted-foreground'
                    }`}>
                      <span className={`size-1.5 rounded-full ${tool.status === 'connected' ? 'bg-emerald-400' : 'bg-muted-foreground/40'}`} />
                      {tool.status === 'connected' ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tool.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{tool.desc}</p>
                  </div>
                  <span className="inline-flex items-center text-xs font-medium text-muted-foreground bg-muted/60 rounded px-1.5 py-0.5">
                    {tool.tag}
                  </span>
                </div>
              ))}
            </div>

            <div className="mx-4 mb-4 flex gap-2.5 items-start bg-amber-50 border border-amber-200 rounded px-3 py-2.5">
              <AlertTriangle className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-snug">
                All partner tools run in an isolated sandbox. Your data and client information are screened before any partner integration runs on action.
              </p>
            </div>
          </div>

          {/* ── 5. Recent Responses ── */}
          <div className="border border-border/60 rounded overflow-hidden bg-white">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
              <p className="text-sm font-medium text-foreground">Recent Responses</p>
              <button className="text-xs text-brand-600 hover:text-brand-700 transition-colors">View all →</button>
            </div>
            <div className="divide-y divide-border/40">
              {RECENT_RESPONSES.map((r, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 cursor-pointer transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.matter} · {r.time}</p>
                  </div>
                  <span className={`inline-flex items-center border rounded px-2 h-5 text-xs font-medium whitespace-nowrap shrink-0 ${RESPONSE_STATUS[r.status]}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 6. Risk & Review ── */}
          <div className="border border-border/60 rounded overflow-hidden bg-white">
            <div className="px-5 py-3 border-b border-border/60">
              <p className="text-sm font-medium text-foreground">Risk & Review</p>
              <p className="text-xs text-muted-foreground mt-0.5">Monitor flagged outputs, risk checks and compliance</p>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border/60">

              {/* Flagged for Review */}
              <div className="px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Flagged for Review</p>
                <ul className="space-y-4">
                  {FLAGGED_REVIEWS.map((item, i) => (
                    <li key={i} className="space-y-1.5">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs font-medium text-foreground leading-snug">{item.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground pl-5 leading-snug">{item.issue}</p>
                      <div className="flex items-center gap-2 pl-5">
                        <span className={`text-xs border rounded px-1.5 py-0.5 font-medium ${
                          item.severity === 'High'
                            ? 'text-red-600 bg-red-50 border-red-200'
                            : 'text-amber-700 bg-amber-50 border-amber-200'
                        }`}>{item.severity}</span>
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risk Check Results */}
              <div className="px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Risk Check Results</p>
                <ul className="space-y-3">
                  {RISK_CHECKS.map((item, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      {item.status === 'pass'
                        ? <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        : <AlertTriangle className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                      }
                      <div>
                        <p className="text-xs font-medium text-foreground">{item.check}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verified Agent Review */}
              <div className="px-5 py-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <Shield className="size-3.5 text-brand-600" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Verified Agent Review</p>
                </div>
                <ul className="space-y-2.5">
                  {VERIFIED_CHECKLIST.map((item, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <CheckCircle2 className="size-3.5 text-brand-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-foreground/80 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* AI Context Panel */}
      <div className={`shrink-0 overflow-hidden transition-all duration-300 ${aiPanelOpen ? 'w-[300px]' : 'w-0'}`}>
        {aiPanelOpen && <AiContextPanel onClose={() => setAiPanelOpen(false)} />}
      </div>

      <ContractCoachOverlay open={contractCoachOpen} onClose={() => setContractCoachOpen(false)} />
      <PolicyUpliftOverlay open={policyUpliftOpen} onClose={() => setPolicyUpliftOpen(false)} />

    </div>
  )
}
