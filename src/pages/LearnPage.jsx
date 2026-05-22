import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Calendar,
  Clock,
  Check,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Sparkles,
  MapPin,
  BookOpen,
  FileText,
  Users,
  Shield,
  Lightbulb,
  Video,
  Award,
  Link2,
  Upload,
  X,
  ArrowLeft,
  Send,
  NotebookPen,
  Target,
  Plus,
  Search,
  Building2,
  Tag,
  ExternalLink,
  ArrowUpRight,
} from 'lucide-react'
import tenant from '@/config/tenant'
import DutiesHandbook from '@/components/DutiesHandbook'
import Feature from '@/components/Feature'

// ─── Data ────────────────────────────────────────────────────────────────────

const t = tenant.pages.learn

const CPD_SUMMARY = t.cpdSummary
const FOCUS_AREAS = t.focusAreas
const UPCOMING_WORKSHOPS = t.upcomingWorkshops
const SUGGESTED_WORKSHOPS = t.suggestedWorkshops
const COMPLETED_AREAS = t.completedAreas
const KNOWLEDGE_ITEMS = t.knowledgeItems
const PRACTICAL_RESOURCES = t.practicalResources
const AI_ACTIONS = t.aiActions
const ACTIVE_JOURNEY = t.activeJourney

// All active learning journeys for the dashboard
const ACTIVE_JOURNEYS = [
  ACTIVE_JOURNEY,
  {
    name: 'Data Privacy & Protection Fundamentals',
    description: 'Build your understanding of data privacy frameworks, breach notification requirements, and cross-border data transfer mechanisms.',
    timeline: '6 months',
    elements: [
      { id: 'dp1', title: 'Read: Privacy Act 1988 Overview' },
      { id: 'dp2', title: 'Data Breach Response Procedures' },
      { id: 'dp3', title: 'Cross-border Data Transfers Workshop' },
      { id: 'dp4', title: 'Privacy Impact Assessment Template' },
      { id: 'dp5', title: 'Meet with Privacy Officer' },
    ],
  },
]

// ─── Skills Data ─────────────────────────────────────────────────────────────

const MANDATORY_SKILLS = [
  { label: 'Ethics & Professional Responsibility', level: 'Advanced', dots: 4, source: 'Law Society NSW · AICD', status: 'Proficient' },
  { label: 'Risk & Compliance', level: 'Intermediate', dots: 3, source: 'Law Society NSW · Governance Institute', status: 'Developing' },
  { label: 'Governance & Board Effectiveness', level: 'Intermediate', dots: 3, source: 'AICD · Governance Institute', status: 'Developing' },
  { label: 'Professional Skills', level: 'Beginner', dots: 2, source: 'Law Society NSW', status: 'Gap' },
  { label: 'Legal & Regulatory', level: 'Beginner', dots: 1, source: 'Governance Institute', status: 'Gap' },
]

const DEFAULT_PERSONAL_FOCUS = [
  { label: 'Data Privacy & Protection', level: 'Intermediate', dots: 3, pointsLogged: 6 },
  { label: 'ESG Reporting Frameworks', level: 'Beginner', dots: 1, pointsLogged: 3 },
  { label: 'AI & Legal Technology', level: 'Beginner', dots: 1, pointsLogged: 1.5 },
]

const AVAILABLE_FOCUS_OPTIONS = [
  { label: 'Cyber Security Fundamentals', description: 'Understanding cyber threats, incident response, and organisational resilience.' },
  { label: 'Modern Slavery & Supply Chain', description: 'Due diligence frameworks and reporting obligations under the Modern Slavery Act.' },
  { label: 'Dispute Resolution & Mediation', description: 'Alternative dispute resolution strategies and mediation techniques.' },
  { label: 'Financial Crime & Fraud Prevention', description: 'Fraud detection, prevention strategies, and regulatory reporting.' },
  { label: 'Digital Transformation & Change', description: 'Leading and managing digital transformation initiatives.' },
  { label: 'Stakeholder Engagement', description: 'Building and managing relationships with key internal and external stakeholders.' },
]

const MAX_DOTS = 4
const STATUS_STYLE = {
  Proficient: 'border-[#d9f99d] bg-[#f7fee7] text-[#365314]',
  Developing: 'border-blue-200 bg-blue-50 text-blue-700',
  Gap: 'border-[#e5e7eb] bg-[#f9fafb] text-[#374151]',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const pct = Math.round((CPD_SUMMARY.hoursCompleted / CPD_SUMMARY.hoursRequired) * 100)
const reqPct = Math.round((CPD_SUMMARY.categoriesComplete / CPD_SUMMARY.categoriesTotal) * 100)

// Knowledge card placeholder image backgrounds
const knowledgeCardBg = [
  'bg-gradient-to-br from-amber-900 to-amber-700',
  'bg-gradient-to-br from-slate-700 to-slate-500',
  'bg-gradient-to-br from-emerald-900 to-emerald-700',
]

const knowledgeTypeIcon = {
  'regulatory': Shield,
  'insight': Lightbulb,
  'thought-leadership': BookOpen,
  'community': Users,
}

// Focus area dot colours
const focusDotColors = [
  'bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500',
]

// ─── Journey Items View ─────────────────────────────────────────────────────

function JourneyItems({ elements, onLogLearning, learningLogs = {} }) {
  const [expandedId, setExpandedId] = useState(null)
  const [loggingId, setLoggingId] = useState(null)
  const [logNote, setLogNote] = useState('')

  if (!elements || elements.length === 0) return null

  const handleSubmitLog = (el) => {
    onLogLearning?.(el.id, logNote)
    setLogNote('')
    setLoggingId(null)
  }

  return (
    <div className="space-y-2">
      {elements.map((el) => {
        const isExpanded = expandedId === el.id
        const isLogging = loggingId === el.id
        const log = learningLogs[el.id]
        const hasLog = !!log

        return (
          <div key={el.id} className={`rounded-[10px] border transition-colors ${hasLog ? 'bg-emerald-50/30 border-emerald-200/60' : 'bg-white border-border'}`}>
            <div
              className="px-4 py-3 cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : el.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{el.title}</p>
                    {hasLog && (
                      <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded-[4px] border border-emerald-200 bg-emerald-50 text-xs font-medium text-emerald-700">
                        <NotebookPen className="size-2.5" /> Logged
                      </span>
                    )}
                  </div>
                  {isExpanded && el.description && (
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{el.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                  {!hasLog && !isLogging && (
                    <Button
                      variant="outline"
                      size="xs"
                      className="gap-1 text-xs h-6"
                      onClick={(e) => { e.stopPropagation(); setLoggingId(el.id); setExpandedId(el.id) }}
                    >
                      <NotebookPen className="size-3" /> Log Learning
                    </Button>
                  )}
                  <ChevronDown className={`size-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </div>

            {/* Existing learning log */}
            {isExpanded && log && (
              <div className="px-4 pb-3">
                <div className="rounded-[8px] border border-border bg-white p-3 space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Reflection</p>
                  <p className="text-xs text-foreground leading-relaxed">{log.note}</p>
                  <p className="text-xs text-muted-foreground">{log.date}</p>
                  {log.managerFeedback && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Manager Feedback</p>
                      <p className="text-xs text-foreground leading-relaxed mt-1">{log.managerFeedback}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Inline log form */}
            {isLogging && (
              <div className="px-4 pb-3" onClick={(e) => e.stopPropagation()}>
                <div className="rounded-[8px] border border-brand-200 bg-white p-3 space-y-3">
                  <label className="text-xs font-medium text-foreground">What did you learn or take away?</label>
                  <textarea
                    value={logNote}
                    onChange={(e) => setLogNote(e.target.value)}
                    placeholder="e.g. Key takeaways, reflections, or notes..."
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring resize-none"
                    autoFocus
                  />
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="xs" onClick={() => { setLoggingId(null); setLogNote('') }}>
                      Cancel
                    </Button>
                    <Button size="xs" className="gap-1" onClick={() => handleSubmitLog(el)} disabled={!logNote.trim()}>
                      <Send className="size-3" /> Save
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Development Score helpers ──────────────────────────────────────────────

function computeDevelopmentScore(loggedIds) {
  // Pillar 1 — CPD compliance (40% weight)
  const cpdPct = Math.min(Math.round((CPD_SUMMARY.hoursCompleted / CPD_SUMMARY.hoursRequired) * 100), 100)

  // Pillar 2 — Learning journey engagement (30% weight)
  // Uses logged element count passed in, or falls back to static estimate
  const journey = ACTIVE_JOURNEY
  let journeyPct = 0
  if (journey && journey.elements && journey.elements.length > 0) {
    const loggedCount = loggedIds ? loggedIds.size : 1 // default: 1 pre-logged item
    journeyPct = Math.round((loggedCount / journey.elements.length) * 100)
  }

  // Pillar 3 — Skills coverage via completed areas & focus areas (30% weight)
  const completedCount = COMPLETED_AREAS.length
  const focusTotal = FOCUS_AREAS.length + completedCount
  const focusComplete = completedCount + FOCUS_AREAS.filter(f => f.progress >= 100).length
  const skillsPct = focusTotal > 0 ? Math.round((focusComplete / focusTotal) * 100) : 0

  const score = Math.round(cpdPct * 0.4 + journeyPct * 0.3 + skillsPct * 0.3)
  const label = score >= 80 ? 'Proficient' : score >= 50 ? 'Developing' : 'Emerging'

  return { score, label, pillars: [
    { name: 'CPD Progress', value: cpdPct },
    { name: 'Learning Journeys', value: journeyPct },
    { name: 'Skills Coverage', value: skillsPct },
  ]}
}

// ─── Proficiency Donut ──────────────────────────────────────────────────────

function ProficiencyDonut({ score, max = 100, label, size = 'large' }) {
  const isSmall = size === 'small'
  const dim = isSmall ? 180 : 272
  const radius = 52
  const stroke = 7
  const circumference = 2 * Math.PI * radius
  const progress = (score / max) * circumference
  const remaining = circumference - progress

  return (
    <div className="relative flex items-center justify-center" style={{ width: dim, height: dim }}>
      <svg width={dim} height={dim} viewBox="0 0 120 120" className="-rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
        <circle cx="60" cy="60" r={radius} fill="none" stroke="url(#donutGrad)" strokeWidth={stroke}
          strokeDasharray={`${progress} ${remaining}`} strokeLinecap="butt" />
        <defs>
          <linearGradient id="donutGrad" x1="100%" y1="0%" x2="0%" y2="100%" gradientTransform="rotate(-43)">
            <stop offset="24.53%" stopColor="#F4E0FF" />
            <stop offset="48.09%" stopColor="#D6AAF4" />
            <stop offset="71.65%" stopColor="#998CF3" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${isSmall ? 'text-[18px]' : 'text-[24px]'} leading-5 tracking-[-0.6px] font-medium text-black`}>{label}</span>
        <span className={`${isSmall ? 'text-xs' : 'text-xs'} font-medium text-muted-foreground mt-2`}>Development score</span>
        <span className={`${isSmall ? 'text-xs' : 'text-xs'} font-medium text-muted-foreground`}>{score} of {max}</span>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

const LOG_CPD_TYPES = {
  course:        { icon: BookOpen, label: 'Course' },
  webinar:       { icon: Video, label: 'Webinar' },
  workshop:      { icon: Users, label: 'Workshop' },
  certification: { icon: Award, label: 'Certification' },
}
const LOG_CPD_TYPE_OPTIONS = Object.keys(LOG_CPD_TYPES)

function LogCPDOverlay({ onClose }) {
  const [form, setForm] = useState({ type: '', points: '', description: '', link: '' })
  const handleSubmit = () => { onClose() }
  const handleClear = () => { setForm({ type: '', points: '', description: '', link: '' }) }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl border border-border shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold text-foreground">Log CPD Activity</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Activity Type</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-between h-9 text-sm font-normal">
                  {form.type ? LOG_CPD_TYPES[form.type].label : <span className="text-muted-foreground">Select activity type</span>}
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]">
                {LOG_CPD_TYPE_OPTIONS.map(t => (
                  <DropdownMenuItem key={t} onClick={() => setForm({ ...form, type: t })}>
                    {LOG_CPD_TYPES[t].label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Points Earned</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input type="number" min="0.5" step="0.5" value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} placeholder="e.g. 2.5" className="h-9 pl-9" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Description of Learning</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe what you learned..." rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Link to Learning Journey <span className="text-muted-foreground font-normal">(optional)</span></label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="Paste link or search journeys..." className="h-9 pl-9" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Upload Evidence <span className="text-muted-foreground font-normal">(optional)</span></label>
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 px-4 py-6 text-center cursor-pointer hover:border-muted-foreground/40 transition-colors">
              <Upload className="size-5 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground/70 mt-1">PDF, DOC, JPG, PNG up to 10MB</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 px-6 py-4 border-t border-border shrink-0">
          <Button size="sm" onClick={handleSubmit} disabled={!form.type || !form.points || !form.description}>Log Activity</Button>
          <Button variant="outline" size="sm" onClick={handleClear}>Clear</Button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ─── Add Focus Overlay ──────────────────────────────────────────────────────

function AddFocusOverlay({ currentLabels, onClose, onAdd }) {
  const [search, setSearch] = useState('')

  const available = AVAILABLE_FOCUS_OPTIONS.filter(
    opt => !currentLabels.includes(opt.label) &&
      (opt.label.toLowerCase().includes(search.toLowerCase()) ||
       opt.description.toLowerCase().includes(search.toLowerCase()))
  )

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl border border-border shadow-xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Add Focus Area</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Choose an area of interest to personalise your learning</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="px-6 pt-4 pb-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search focus areas..."
              className="h-9 pl-9"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 py-3 space-y-2">
          {available.map(opt => (
            <button
              key={opt.label}
              onClick={() => onAdd(opt)}
              className="w-full text-left rounded-lg border border-border p-3.5 hover:bg-muted/30 transition-colors"
            >
              <p className="text-sm font-medium text-foreground">{opt.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
            </button>
          ))}

          {available.length === 0 && (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">
                {search ? `No areas matching "${search}"` : 'All available focus areas have been added'}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t border-border shrink-0">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LearnPage() {
  const navigate = useNavigate()
  const [statusDropdown] = useState('Going')
  const [showLogCPD, setShowLogCPD] = useState(false)
  const [viewingJourney, setViewingJourney] = useState(null)
  const [showAddFocus, setShowAddFocus] = useState(false)
  const [personalFocus, setPersonalFocus] = useState(DEFAULT_PERSONAL_FOCUS)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [handbookOpen, setHandbookOpen] = useState(false)
  // Learning logs keyed by element id
  const [learningLogs, setLearningLogs] = useState({
    // Pre-populated example
    e3: { note: 'Reviewed the full AML/CTF program. Identified two gaps around enhanced CDD for high-risk customers and a missing procedure for tipping-off obligations.', date: 'Feb 2026' },
  })

  const handleLogLearning = (elementId, note) => {
    setLearningLogs(prev => ({
      ...prev,
      [elementId]: { note, date: 'Mar 2026' },
    }))
  }

  // ── Journey Detail View ──
  if (viewingJourney) {
    const journey = viewingJourney
    const elements = journey.elements || []
    const loggedCount = elements.filter(e => learningLogs[e.id]).length

    return (
      <div className="flex flex-1">
        <div className="flex-1 bg-white px-8 pt-[30px] pb-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Back */}
            <button onClick={() => setViewingJourney(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="size-4" /> Back to Learn
            </button>

            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">
                {journey.name}
              </h1>
              {journey.description && (
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{journey.description}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5"><BookOpen className="size-3.5" /> {elements.length} items</span>
                {loggedCount > 0 && <span className="flex items-center gap-1.5"><NotebookPen className="size-3.5" /> {loggedCount} reflections logged</span>}
              </div>
            </div>

            {/* Journey Items */}
            <JourneyItems elements={elements} onLogLearning={handleLogLearning} learningLogs={learningLogs} />
          </div>
        </div>
      </div>
    )
  }

  // ── Main Learn Page ──
  return (
    <div className="flex flex-1">
      <div className="flex-1 bg-white px-8 pt-[52px] pb-6">
        <div className="max-w-[1200px] mx-auto space-y-8">

          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-[28px] leading-[30px] tracking-[-1.12px] font-normal text-[#0A0A0A]">Overview</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Your CPD progress, learning journeys and capability — at a glance.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
              <Clock className="size-3.5" />
              CPD period ends {CPD_SUMMARY.periodEnd}
            </div>
          </div>

          {/* ── Hero: Learning Profile ─────────────────────── */}
          <div className="space-y-6 relative">
          {/* ── Learning Profile ─────────────────────────────────────── */}
          {(() => {
            const ds = computeDevelopmentScore(new Set(Object.keys(learningLogs)))
            const journeyElements = ACTIVE_JOURNEY?.elements || []
            const journeyLogged = journeyElements.filter(e => learningLogs[e.id]).length
            return (
              <div className="relative rounded-[6px] border border-[#E2E8F0] overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="px-6 pt-6 pb-0">
                  <p className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">Your Learning Profile</p>

                  <div className="flex items-start justify-between gap-8 mt-5">
                    {/* Bullet insights */}
                    <ul className="flex-1 space-y-2 text-sm leading-5 list-disc pl-4">
                      <li><span className="font-medium text-foreground">CPD progress:</span> <span className="text-muted-foreground">{CPD_SUMMARY.hoursCompleted} of {CPD_SUMMARY.hoursRequired} points completed ({pct}%). On track to meet this CPD period.</span></li>
                      <li><span className="font-medium text-foreground">Strength areas:</span> <span className="text-muted-foreground">Strong development in Governance and Leadership.</span></li>
                      <li><span className="font-medium text-foreground">Learning journey:</span> <span className="text-muted-foreground">1 active journey with {journeyLogged} of {journeyElements.length} modules completed. Continue progressing modules.</span></li>
                      <li><span className="font-medium text-foreground">Overall capability:</span> <span className="text-muted-foreground">{ds.label} level with a development score of {ds.score}.</span></li>
                      <li><span className="font-medium text-foreground">Recommended next step:</span> <span className="text-muted-foreground">Enrol in the AI Legal Practice Workshop to close a Substantive Law skills gap and earn 3 CPD hours.</span></li>
                    </ul>

                    {/* Proficiency donut */}
                    <div className="shrink-0 -mt-5">
                      <ProficiencyDonut score={ds.score} label={ds.label} size="small" />
                    </div>
                  </div>

                  {/* Mini stat cards */}
                  <div className="flex gap-[200px] mt-[40px]">
                    {/* CPD Status */}
                    <div className="space-y-2">
                      <div className="flex gap-[6.5px]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className={`w-[3px] h-[15px] ${i < Math.round((pct / 100) * 5) ? 'bg-[#6ee7b7]' : 'bg-[#d9d9d9]'}`} />
                        ))}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-foreground">CPD Status</p>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-[#0a0a0a] tracking-[-0.15px]">{pct}% complete</p>
                          <p className="text-xs text-muted-foreground">{CPD_SUMMARY.hoursCompleted} of {CPD_SUMMARY.hoursRequired} points earned</p>
                        </div>
                      </div>
                    </div>

                    {/* Learning Journeys */}
                    <div className="space-y-2">
                      <div className="flex gap-[6.5px]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className={`w-[3px] h-[15px] ${i < Math.round((journeyLogged / journeyElements.length) * 5) ? 'bg-[#fed7aa]' : 'bg-[#d9d9d9]'}`} />
                        ))}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-foreground">Learning Journeys</p>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-[#0a0a0a] tracking-[-0.15px]">1 active</p>
                          <p className="text-xs text-muted-foreground">{journeyLogged} of {journeyElements.length} modules logged</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Step CTA */}
                <div className="mx-6 mt-[40px] mb-6 flex items-center justify-between rounded-[8px] border border-purple-200 bg-purple-50 p-4">
                  <div className="flex items-center gap-4">
                    <Sparkles className="size-5 text-purple-500 shrink-0" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-[#0a0a0a] tracking-[-0.15px]">Next Step: Enrol in AI Legal Practice Workshop</p>
                      <p className="text-xs text-[#0a0a0a]">Addresses your highest-scoring skills gap recommendation (95% match). 3 CPD hours toward Substantive Law.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="sm" className="text-sm font-medium text-primary">More Info</Button>
                    <Button variant="outline" size="sm" className="text-sm font-medium text-primary">Enrol Now</Button>
                  </div>
                </div>
              </div>
            )
          })()}
          </div>

          {/* ── Quick Links ────────────────────────────────────────── */}
          <div className="space-y-4">
            <h2 className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">Quick Links</h2>
            <div
              className="group rounded-[8px] border border-[#ecf2f5] bg-white p-5 cursor-pointer hover:border-brand-200 hover:shadow-sm transition-all"
              onClick={() => setHandbookOpen(true)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center justify-center size-10 rounded-[8px] bg-[#f5f5f5] shrink-0">
                  <BookOpen className="size-5 text-[#737373]" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-sm shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
                  onClick={(e) => { e.stopPropagation(); setHandbookOpen(true) }}
                >
                  View <ArrowUpRight className="size-3.5" />
                </Button>
              </div>
              <div>
                <h3 className="text-base font-medium text-black leading-6">Duties Handbook</h3>
                <p className="text-xs text-muted-foreground mt-1">Review your regulatory duties and obligations</p>
              </div>
            </div>
          </div>

          {/* ── Active Learning Journeys ─────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">Active Learning Journeys</h2>
              <Button variant="ghost" size="sm" className="text-sm font-medium gap-1 text-muted-foreground" onClick={() => navigate('/learn/journeys')}>
                View All <ChevronRight className="size-3.5" />
              </Button>
            </div>

            <div className="space-y-2.5">
              {ACTIVE_JOURNEYS.map((journey) => {
                const elements = journey.elements || []
                const loggedCount = elements.filter(e => learningLogs[e.id]).length

                return (
                  <div
                    key={journey.name}
                    className="rounded-[8px] border border-[#ecf2f5] bg-white p-5 cursor-pointer hover:border-brand-200 hover:shadow-sm transition-all"
                    onClick={() => setViewingJourney(journey)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <h3 className="text-base font-medium text-black leading-6">{journey.name}</h3>
                        {journey.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{journey.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><BookOpen className="size-3" /> {elements.length} items</span>
                          {journey.timeline && <span className="flex items-center gap-1"><Clock className="size-3" /> {journey.timeline}</span>}
                          {loggedCount > 0 && <span className="flex items-center gap-1"><NotebookPen className="size-3" /> {loggedCount} logged</span>}
                        </div>
                      </div>
                      <ChevronRight className="size-5 text-[#CBD5E1] shrink-0" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>


          {/* ── What's Next ─────────────────────────────────────────── */}
          <div className="space-y-4 rounded-[8px] border border-[#ECF2F5] bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">What's Next</h2>
              <Button variant="ghost" size="sm" className="text-sm font-medium gap-1 text-muted-foreground" onClick={() => navigate('/learn/cpd')}>
                View CPD <ChevronRight className="size-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-[3fr_1fr] gap-5">
              {/* Left column — upcoming events */}
              <div className="space-y-2.5">
                {(() => {
                  const allThisWeek = UPCOMING_WORKSHOPS.map(w => ({ ...w, _type: 'upcoming' }))
                  const allUpcoming = SUGGESTED_WORKSHOPS.map(w => ({ ...w, _type: 'suggested' }))
                  const thisWeek = allThisWeek.slice(0, 5)
                  const upcoming = allUpcoming.slice(0, 5 - thisWeek.length)

                  const renderItem = (w) => (
                    <div key={w.id} className="flex items-center gap-3 rounded-[8px] border border-[#ecf2f5] bg-white px-3.5 py-2.5 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => setSelectedEvent({ ...w, _tab: w._type === 'upcoming' ? 'upcoming' : 'recommended' })}>
                      <div className="flex items-center justify-center rounded-[8px] shrink-0 w-10 h-10 bg-[#f5f5f5]">
                        <Calendar className="size-4 text-[#737373]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[#0a0a0a] tracking-[-0.15px] leading-5 truncate">{w.title}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-[#737373]">{w.month?.charAt(0)}{w.month?.slice(1).toLowerCase()} {w.day} · {w.time || 'TBC'}</span>
                          <span className="text-xs text-[#737373]">{w.provider}</span>
                        </div>
                        {w._type === 'suggested' && w.relevance && (
                          <p className="inline-flex items-center gap-1 text-xs text-indigo-500 mt-0.5"><Sparkles className="size-3 shrink-0" />{w.relevance}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center h-5 px-1.5 rounded text-xs font-medium border border-[#e5e7eb] bg-[#f9fafb] text-[#374151]">{w._type === 'upcoming' ? '+' : ''}{w.cpdHours}pts</span>
                        <span className={`inline-flex items-center gap-1 h-5 px-1.5 rounded text-xs font-medium border ${w.status === 'Booked' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-[#e5e7eb] bg-white text-[#374151]'}`}>
                          {w.status === 'Booked' && <Check className="size-3 shrink-0" />}
                          {w.status === 'Booked' ? 'Attending' : 'RSVP'}
                        </span>
                      </div>
                    </div>
                  )

                  return (
                    <>
                      {thisWeek.length > 0 && (
                        <>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">This week</p>
                          {thisWeek.map(renderItem)}
                        </>
                      )}
                      {upcoming.length > 0 && (
                        <>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider pt-1">Upcoming</p>
                          {upcoming.map(renderItem)}
                        </>
                      )}
                    </>
                  )
                })()}
              </div>

              {/* Right column — Learning Calendar */}
              <div className="rounded-[8px] border border-[#ecf2f5] bg-white p-4 self-start">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-[#0a0a0a]">Learning Calendar</p>
                  <span title="Synced with Outlook" className="inline-flex items-center gap-1 h-5 px-1.5 rounded-full border border-[#e5e7eb] bg-white text-xs">
                    <img src="/images/outlook-icon.png" alt="Outlook" className="size-3" />
                    <span className="size-3 rounded-full bg-[#A7F3D0] flex items-center justify-center"><Check className="size-2 text-[#065F46]" strokeWidth={3} /></span>
                  </span>
                </div>
                {/* Mini calendar grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <span>March 2026</span>
                  </div>
                  <div className="grid grid-cols-7 gap-0.5 text-center text-xs text-muted-foreground font-medium">
                    {['M','T','W','T','F','S','S'].map((d,i) => <span key={i} className="py-1">{d}</span>)}
                  </div>
                  <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
                    {/* Week padding + days */}
                    {[null,null,null,null,null,null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31].map((d,i) => {
                      const isUpcoming = [12, 18].includes(d)
                      const isSuggested = [25].includes(d)
                      const isToday = d === 10
                      return (
                        <span key={i} className={`py-1 rounded-[4px] aspect-square flex items-center justify-center ${d ? 'cursor-pointer hover:bg-muted/30' : ''} ${isToday ? 'bg-slate-800 text-white font-medium' : ''} ${isUpcoming && !isToday ? 'bg-emerald-50 text-emerald-700 font-medium' : ''} ${isSuggested && !isToday ? 'bg-indigo-50 text-indigo-700 font-medium' : ''}`}>
                          {d || ''}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* ── Development Focus ──────────────────────────────────── */}
          <div className="space-y-5">
            <div>
              <h2 className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">Development Focus</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Skills you're actively developing and areas you want to explore. This shapes recommendations across the platform.</p>
            </div>

            <div className="flex gap-4 items-start">
              {/* Active card */}
              <div className="flex-1 rounded-[8px] border border-[#ecf2f5] bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-[#ecf2f5] bg-white">
                  <p className="text-sm font-semibold text-[#0a0a0a]">Active</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Skills being developed through your CPD activities and learning journeys</p>
                </div>
                {[
                  { label: 'Ethics & Professional Responsibility', source: 'CPD', dots: 4 },
                  { label: 'Governance & Board Effectiveness', source: 'CPD', dots: 3 },
                  { label: 'Risk & Compliance', source: 'CPD + Journey', dots: 3 },
                  { label: 'Regulatory Change Management', source: 'Journey', dots: 2 },
                  { label: 'AML/CTF', source: 'Journey', dots: 1 },
                  { label: 'ESG Reporting', source: 'Journey', dots: 1 },
                ].map((skill, i, arr) => (
                  <div key={skill.label} className={`grid grid-cols-[1fr_80px] gap-0 items-center px-4 py-2.5 ${i < arr.length - 1 ? 'border-b border-[#f5f5f5]' : ''}`}>
                    <span className="text-sm font-medium text-[#0a0a0a] truncate pr-2">{skill.label}</span>
                    <div className="flex items-center justify-end gap-[3px]">
                      {Array.from({ length: MAX_DOTS }).map((_, d) => (
                        <span key={d} className={`size-2 rounded-full ${d < skill.dots ? 'bg-brand-600' : 'bg-[#e5e7eb]'}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Interests card */}
              <div className="flex-1 rounded-[8px] border border-[#ecf2f5] bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-[#ecf2f5] bg-white flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0a0a0a]">Interests</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Areas you want to develop. Adding here influences recommendations across the system.</p>
                  </div>
                  <button className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-3" onClick={() => setShowAddFocus(true)}>
                    <Plus className="size-3.5" /> Add
                  </button>
                </div>
                {personalFocus.map((skill, i) => (
                  <div key={skill.label} className={`group grid grid-cols-[1fr_60px_30px] gap-0 items-center px-4 py-2.5 ${i < personalFocus.length - 1 ? 'border-b border-[#f5f5f5]' : ''}`}>
                    <span className="text-sm font-medium text-[#0a0a0a] truncate pr-2">{skill.label}</span>
                    <div className="flex items-center justify-center gap-[3px]">
                      {Array.from({ length: MAX_DOTS }).map((_, d) => (
                        <span key={d} className={`size-2 rounded-full ${d < skill.dots ? 'bg-purple-500' : 'bg-[#e5e7eb]'}`} />
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setPersonalFocus(prev => prev.filter(s => s.label !== skill.label))}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {personalFocus.length === 0 && (
                  <div className="px-4 py-4 text-center">
                    <p className="text-sm text-muted-foreground">Add areas of interest to get personalised suggestions.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Add Focus Overlay */}
          {showAddFocus && (
            <AddFocusOverlay
              currentLabels={personalFocus.map(s => s.label)}
              onClose={() => setShowAddFocus(false)}
              onAdd={(skill) => {
                setPersonalFocus(prev => [...prev, { ...skill, pointsLogged: 0, level: 'Beginner', dots: 1 }])
                setShowAddFocus(false)
              }}
            />
          )}

          {/* ── Latest Knowledge ─────────────────────────────────────── */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">Latest Knowledge</h2>
                <p className="text-sm font-medium text-muted-foreground mt-1">Trending in Knowledge Centre</p>
              </div>
              <Button variant="outline-ghost" size="sm" className="text-sm font-medium gap-1" onClick={() => navigate('/learn/knowledge')}>
                View All <ChevronRight className="size-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-[22px]">
              {KNOWLEDGE_ITEMS.slice(0, 3).map((item, i) => {
                const articleImages = ['/images/article-1.png', '/images/article-2.png', '/images/article-2.png']
                return (
                  <div key={item.id} className="flex flex-col gap-[18px] overflow-hidden cursor-pointer group">
                    <div className="h-[170px] rounded-[8px] overflow-hidden bg-[#d9d9d9]">
                      <img
                        src={articleImages[i]}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-[8px]"
                      />
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-normal text-[#4b5563] leading-5 truncate">
                        {item.source} - {item.readTime}
                      </p>
                      <div className="space-y-[5px]">
                        <h3 className="text-lg font-normal text-black leading-7">
                          {item.title}
                        </h3>
                        <p className="text-sm font-normal text-muted-foreground leading-6">
                          {item.snippet}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>


        </div>
      </div>

      {showLogCPD && <LogCPDOverlay onClose={() => setShowLogCPD(false)} />}
      <Feature flag="FEATURE_DUTIES_HANDBOOK">
        {handbookOpen && <DutiesHandbook onClose={() => setHandbookOpen(false)} />}
      </Feature>


      {selectedEvent && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedEvent(null)} />
          <div className="relative z-10 bg-white rounded-xl border border-border shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <h2 className="text-lg font-semibold text-foreground pr-4 leading-snug">{selectedEvent.title}</h2>
              <button onClick={() => setSelectedEvent(null)} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto px-6 py-5 space-y-5">
              <div className="flex items-center gap-2 flex-wrap">
                {selectedEvent._tab === 'recommended' && selectedEvent.relevance && (
                  <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-indigo-200 bg-indigo-50 text-sm font-medium text-indigo-700">
                    <Sparkles className="size-3.5" /> Suggested
                  </span>
                )}
                {selectedEvent.status === 'Booked' && (
                  <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-[#a7f3d0] bg-[#ecfdf5] text-sm font-medium text-[#153e40]">
                    <CheckCircle2 className="size-3.5" /> Attending
                  </span>
                )}
                {selectedEvent.type && (
                  <span className="inline-flex items-center h-7 px-2.5 rounded-md border border-[#e5e7eb] bg-[#f9fafb] text-sm font-medium text-[#374151]">
                    {selectedEvent.type}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {selectedEvent.month && (
                  <div className="flex items-center gap-3">
                    <Calendar className="size-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground">{selectedEvent.month} {selectedEvent.day}, {selectedEvent.year}</span>
                  </div>
                )}
                {selectedEvent.time && (
                  <div className="flex items-center gap-3">
                    <Clock className="size-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground">{selectedEvent.time}</span>
                  </div>
                )}
                {selectedEvent.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="size-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground">{selectedEvent.location}</span>
                  </div>
                )}
                {selectedEvent.provider && (
                  <div className="flex items-center gap-3">
                    <Building2 className="size-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground">{selectedEvent.provider}</span>
                  </div>
                )}
              </div>
              {selectedEvent.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedEvent.description}</p>
              )}
              <Separator />
              <div className="rounded-lg border border-purple-200 bg-purple-50/60 px-4 py-3.5 space-y-2.5">
                <p className="text-sm font-medium text-purple-900 flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-purple-500" /> What you'll achieve
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-purple-900">{selectedEvent.cpdHours} CPD points toward your requirements</span>
                  </li>
                  {selectedEvent.category && (
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-purple-900">Counts toward <span className="font-medium">{selectedEvent.category}</span> category</span>
                    </li>
                  )}
                  {selectedEvent._tab === 'recommended' && selectedEvent.relevance && (
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-purple-900">{selectedEvent.relevance}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-2 px-6 py-4 border-t border-border shrink-0">
              {selectedEvent.status === 'Booked' ? (
                <Button size="sm" variant="outline" className="text-muted-foreground">De-enrol</Button>
              ) : (
                <Button size="sm">Enrol</Button>
              )}
              <div className="flex-1" />
              <Button variant="outline" size="sm" onClick={() => setSelectedEvent(null)}>Close</Button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  )
}
