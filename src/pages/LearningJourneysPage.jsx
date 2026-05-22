import { useState } from 'react'
import { createPortal } from 'react-dom'
import Feature from '@/components/Feature'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Clock,
  Check,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Sparkles,
  BookOpen,
  FileText,
  Users,
  Shield,
  Lightbulb,
  ArrowLeft,
  Send,
  NotebookPen,
  Play,
  Target,
  Plus,
  X,
  Search,
  Video,
  Link2,
  ExternalLink,
} from 'lucide-react'
import tenant from '@/config/tenant'

// ─── Data ────────────────────────────────────────────────────────────────────

const t = tenant.pages.learn
const FOCUS_AREAS = t.focusAreas
const COMPLETED_AREAS = t.completedAreas
const KNOWLEDGE_ITEMS = t.knowledgeItems
const PRACTICAL_RESOURCES = t.practicalResources
const ACTIVE_JOURNEY = t.activeJourney

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

// Additional mock journeys for the library
const ALL_JOURNEYS = [
  {
    ...ACTIVE_JOURNEY,
    status: 'active',
    progress: 33,
  },
  {
    name: 'Data Privacy & Protection Fundamentals',
    timeline: '6 months',
    description: 'Build your understanding of data privacy frameworks, breach notification requirements, and cross-border data transfer mechanisms.',
    status: 'available',
    progress: 0,
    elements: [
      { id: 'dp1', title: 'Read: Privacy Act 1988 Overview', description: 'Review the foundational privacy legislation and Australian Privacy Principles.', type: 'read', duration: '20 min', resources: [{ label: 'Privacy Act 1988 (Cth)', type: 'link' }, { label: 'APPs Quick Reference Guide', type: 'document' }] },
      { id: 'dp2', title: 'Data Breach Response Procedures', description: 'Learn the mandatory notification requirements and internal escalation processes.', type: 'course', duration: '45 min', resources: [{ label: 'Notifiable Data Breaches Scheme', type: 'link' }, { label: 'Incident Response Template', type: 'document' }] },
      { id: 'dp3', title: 'Cross-border Data Transfers Workshop', description: 'Understand mechanisms for lawful international data flows.', type: 'workshop', duration: '1.5 hrs', resources: [{ label: 'Workshop Recording', type: 'video' }] },
      { id: 'dp4', title: 'Privacy Impact Assessment Template', description: 'Practice conducting PIAs on sample projects.', type: 'exercise', duration: '30 min', resources: [{ label: 'PIA Template', type: 'document' }, { label: 'Sample PIA Walkthrough', type: 'video' }] },
      { id: 'dp5', title: 'Meet with Privacy Officer', description: 'Discuss practical privacy challenges and current organisational priorities.', type: 'meeting', duration: '30 min' },
    ],
  },
  {
    name: 'Leadership & Stakeholder Engagement',
    timeline: '9 months',
    description: 'Develop your leadership capabilities, stakeholder management, and communication skills for senior advisory roles.',
    status: 'available',
    progress: 0,
    elements: [
      { id: 'ls1', title: 'Stakeholder Mapping Exercise', description: 'Identify and map key stakeholders for your current projects.', type: 'exercise', duration: '45 min', resources: [{ label: 'Stakeholder Map Template', type: 'document' }] },
      { id: 'ls2', title: 'Effective Presentation Skills Workshop', description: 'Build confidence in presenting to boards and senior leadership.', type: 'workshop', duration: '2 hrs', resources: [{ label: 'Workshop Recording', type: 'video' }, { label: 'Slide Deck Template', type: 'document' }] },
      { id: 'ls3', title: 'Mentoring & Coaching Fundamentals', description: 'Learn techniques for mentoring junior team members.', type: 'course', duration: '1 hr', resources: [{ label: 'Coaching Framework Guide', type: 'document' }] },
      { id: 'ls4', title: 'Conflict Resolution Strategies', description: 'Understand and apply conflict resolution frameworks in professional settings.', type: 'course', duration: '45 min', resources: [{ label: 'Thomas-Kilmann Model Overview', type: 'link' }] },
      { id: 'ls5', title: 'Shadow a Partner on client engagement', description: 'Observe senior stakeholder engagement in practice.', type: 'meeting', duration: '1 hr' },
      { id: 'ls6', title: 'Read: Radical Candor (book summary)', description: 'Key takeaways on building trust through direct, caring communication.', type: 'read', duration: '15 min', resources: [{ label: 'Book Summary PDF', type: 'document' }] },
    ],
  },
  {
    name: 'ESG & Sustainability Reporting',
    timeline: '8 months',
    description: 'Master the evolving ESG disclosure landscape, including ISSB standards and their practical application to Australian organisations.',
    status: 'completed',
    progress: 100,
    completedDate: 'Dec 2025',
    elements: [
      { id: 'esg1', title: 'ISSB Standards Overview (IFRS S1/S2)', description: 'Foundation review of the global baseline sustainability standards.', type: 'read', duration: '30 min', resources: [{ label: 'IFRS S1 Standard', type: 'link' }, { label: 'IFRS S2 Standard', type: 'link' }] },
      { id: 'esg2', title: 'AASB Sustainability Reporting Standards', description: 'Australian adoption of sustainability reporting and timeline.', type: 'course', duration: '1 hr', resources: [{ label: 'AASB Overview Video', type: 'video' }] },
      { id: 'esg3', title: 'ESG Due Diligence in Practice', description: 'Practical application of ESG risk assessment in transactions.', type: 'workshop', duration: '2 hrs', resources: [{ label: 'ESG Due Diligence Checklist', type: 'document' }] },
      { id: 'esg4', title: 'Greenwashing Risk & Compliance', description: 'Understanding ASIC enforcement priorities and avoiding misleading sustainability claims.', type: 'course', duration: '45 min', resources: [{ label: 'ASIC Greenwashing Guide', type: 'link' }] },
    ],
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const knowledgeTypeIcon = {
  'regulatory': Shield,
  'insight': Lightbulb,
  'thought-leadership': BookOpen,
  'community': Users,
}

// ─── Journey Items View ─────────────────────────────────────────────────────

function JourneyItems({ elements, onLogLearning, onMarkComplete, learningLogs = {}, completedIds = new Set() }) {
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
        const isComplete = completedIds.has(el.id)

        return (
          <div key={el.id} className={`group rounded-[10px] border transition-colors ${isComplete ? 'bg-emerald-50/30 border-emerald-200/60' : 'bg-white border-border'}`}>
            <div
              className="px-4 py-3 cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : el.id)}
            >
              {/* Title row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {isComplete && (
                    <span className="flex items-center justify-center size-4 rounded-full bg-[#047857] shrink-0">
                      <Check className="size-2.5 text-white" strokeWidth={3} />
                    </span>
                  )}
                  <p className={`text-sm font-medium ${isComplete ? 'text-muted-foreground' : 'text-foreground'}`}>{el.title}</p>
                  {hasLog && (
                    <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded-[4px] border border-emerald-200 bg-emerald-50 text-xs font-medium text-emerald-700">
                      Logged
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isComplete && !isLogging && (
                      <button
                        className="inline-flex items-center h-7 px-2.5 rounded-md border border-[#e5e7eb] bg-white text-xs font-medium text-[#374151] hover:bg-[#f9fafb] transition-colors"
                        onClick={(e) => { e.stopPropagation(); onMarkComplete?.(el.id) }}
                      >
                        Mark Complete
                      </button>
                    )}
                    {!isLogging && (
                      <button
                        className="inline-flex items-center h-7 px-2.5 rounded-md border border-[#e5e7eb] bg-white text-xs font-medium text-[#374151] hover:bg-[#f9fafb] transition-colors"
                        onClick={(e) => { e.stopPropagation(); setLoggingId(el.id); setExpandedId(el.id) }}
                      >
                        {hasLog ? 'Edit Log' : 'Log Learning'}
                      </button>
                    )}
                  </div>
                  <ChevronDown className={`size-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Expanded content — below title row */}
              {isExpanded && (
                <div className="mt-3 space-y-3">
                  {el.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{el.description}</p>
                  )}
                  {(el.type || el.duration) && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {el.type && (
                        <span className="inline-flex items-center gap-1 capitalize">
                          {el.type === 'read' && <BookOpen className="size-3" />}
                          {el.type === 'video' && <Video className="size-3" />}
                          {el.type === 'course' && <BookOpen className="size-3" />}
                          {el.type === 'workshop' && <Users className="size-3" />}
                          {el.type === 'meeting' && <Users className="size-3" />}
                          {el.type === 'exercise' && <FileText className="size-3" />}
                          {el.type}
                        </span>
                      )}
                      {el.duration && (
                        <span className="inline-flex items-center gap-1"><Clock className="size-3" />{el.duration}</span>
                      )}
                    </div>
                  )}
                  {el.resources && el.resources.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {el.resources.map((res, ri) => (
                        <button key={ri} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-[#e5e7eb] bg-[#f9fafb] text-xs font-medium text-[#374151] hover:bg-white hover:border-[#d4d4d4] transition-colors cursor-pointer">
                          {res.type === 'video' && <Video className="size-3 text-muted-foreground" />}
                          {res.type === 'link' && <ExternalLink className="size-3 text-muted-foreground" />}
                          {res.type === 'document' && <FileText className="size-3 text-muted-foreground" />}
                          {res.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

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
                    <button className="inline-flex items-center h-7 px-2.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-[#f9fafb] transition-colors" onClick={() => { setLoggingId(null); setLogNote('') }}>
                      Cancel
                    </button>
                    <button className="inline-flex items-center h-7 px-2.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50" onClick={() => handleSubmitLog(el)} disabled={!logNote.trim()}>
                      Save
                    </button>
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

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LearningJourneysPage() {
  const [viewingJourney, setViewingJourney] = useState(null)
  const [showAddFocus, setShowAddFocus] = useState(false)
  const [personalFocus, setPersonalFocus] = useState(DEFAULT_PERSONAL_FOCUS)
  const [completedIds, setCompletedIds] = useState(new Set(['e3']))
  const [learningLogs, setLearningLogs] = useState({
    e3: { note: 'Reviewed the full AML/CTF program. Identified two gaps around enhanced CDD for high-risk customers and a missing procedure for tipping-off obligations.', date: 'Feb 2026' },
  })
  const [aiSuggested, setAiSuggested] = useState([])

  const handleAiAdd = (item) => {
    setAiSuggested(prev => {
      if (prev.some(s => s.title === item.title)) return prev
      return [...prev, item]
    })
  }

  const handleLogLearning = (elementId, note) => {
    setLearningLogs(prev => ({
      ...prev,
      [elementId]: { note, date: 'Mar 2026' },
    }))
  }

  const handleMarkComplete = (elementId) => {
    setCompletedIds(prev => new Set([...prev, elementId]))
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
            <button onClick={() => setViewingJourney(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="size-4" /> Back to Learning Journeys
            </button>

            <div className="space-y-2">
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">
                {journey.name}
              </h1>
              {journey.description && (
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{journey.description}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5"><BookOpen className="size-3.5" /> {elements.length} items</span>
                <span className="flex items-center gap-1.5"><Clock className="size-3.5" /> {journey.timeline}</span>
                {loggedCount > 0 && <span className="flex items-center gap-1.5"><NotebookPen className="size-3.5" /> {loggedCount} reflections logged</span>}
              </div>
            </div>

            <JourneyItems elements={elements} onLogLearning={handleLogLearning} onMarkComplete={handleMarkComplete} learningLogs={learningLogs} completedIds={completedIds} />
          </div>
        </div>
      </div>
    )
  }

  // ── Main Page ──
  const activeJourneys = ALL_JOURNEYS.filter(j => j.status === 'active')
  const availableJourneys = ALL_JOURNEYS.filter(j => j.status === 'available')
  const completedJourneys = ALL_JOURNEYS.filter(j => j.status === 'completed')

  return (
    <div className="flex flex-1">
      <div className="flex-1 bg-white px-8 pt-[52px] pb-6">
        <div className="max-w-[1200px] mx-auto space-y-8">

          <div>
            <h1 className="text-[28px] leading-[30px] tracking-[-1.12px] font-normal text-[#0A0A0A]">Learning Journeys</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Structured paths to develop the capabilities your role demands.
            </p>
          </div>

          {/* ── Hero ─────────────────────────────────────── */}
          <div className="relative">
            <div className="relative space-y-6">

              {/* ── Your Journeys Card ──────────────────────────────────── */}
              <div className="rounded-[6px] border border-[#E2E8F0] bg-white p-6 space-y-5">
                <h2 className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">Your Journeys</h2>

                <Tabs defaultValue="in-progress">
                  <TabsList className="h-auto bg-transparent p-0 gap-2 mb-4">
                    <TabsTrigger value="in-progress" className="h-8 rounded-full text-sm px-4 py-1.5 border border-transparent data-[state=active]:bg-[#153e40] data-[state=active]:text-white data-[state=active]:border-transparent data-[state=inactive]:text-[#153e40] data-[state=inactive]:bg-[#f5f5f5] data-[state=active]:shadow-none">
                      In Progress ({activeJourneys.length})
                    </TabsTrigger>
                    <TabsTrigger value="available" className="h-8 rounded-full text-sm px-4 py-1.5 border border-transparent data-[state=active]:bg-[#153e40] data-[state=active]:text-white data-[state=active]:border-transparent data-[state=inactive]:text-[#153e40] data-[state=inactive]:bg-[#f5f5f5] data-[state=active]:shadow-none">
                      Available ({availableJourneys.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="h-8 rounded-full text-sm px-4 py-1.5 border border-transparent data-[state=active]:bg-[#153e40] data-[state=active]:text-white data-[state=active]:border-transparent data-[state=inactive]:text-[#153e40] data-[state=inactive]:bg-[#f5f5f5] data-[state=active]:shadow-none">
                      Completed ({completedJourneys.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="in-progress" className="mt-0 space-y-3">
                    {activeJourneys.map((journey) => {
                      const elements = journey.elements || []
                      const loggedCount = elements.filter(e => learningLogs[e.id]).length

                      return (
                        <div
                          key={journey.name}
                          className="rounded-[8px] border border-[#ecf2f5] bg-white p-5 cursor-pointer hover:border-brand-200 hover:shadow-sm transition-all"
                          onClick={() => setViewingJourney(journey)}
                        >
                          <div className="flex items-center gap-4">
                            {/* Mini donut */}
                            {(() => {
                              const pctVal = journey.progress || 0
                              const r = 26
                              const sw = 5
                              const c = 2 * Math.PI * r
                              const prog = (pctVal / 100) * c
                              return (
                                <div className="relative shrink-0 size-[68px]">
                                  <svg width={68} height={68} viewBox="0 0 68 68" className="-rotate-90">
                                    <circle cx="34" cy="34" r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} />
                                    <circle cx="34" cy="34" r={r} fill="none" stroke="#6EE7B7" strokeWidth={sw}
                                      strokeDasharray={`${prog} ${c - prog}`} strokeLinecap="butt" />
                                  </svg>
                                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-[#0a0a0a]">{pctVal}%</span>
                                </div>
                              )
                            })()}

                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="space-y-1">
                                <h3 className="text-base font-medium text-black leading-6">{journey.name}</h3>
                                {journey.description && (
                                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 max-w-[600px]">{journey.description}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><BookOpen className="size-3" /> {elements.length} items</span>
                                <span className="flex items-center gap-1"><Clock className="size-3" /> {journey.timeline}</span>
                                {loggedCount > 0 && <span className="flex items-center gap-1"><NotebookPen className="size-3" /> {loggedCount} logged</span>}
                              </div>
                            </div>
                            <span className="inline-flex items-center h-5 px-1.5 rounded-[4px] border border-[#bfdbfe] bg-[#eff6ff] text-xs font-medium text-[#1e3a8a] rounded-[6px] shrink-0">In Progress</span>
                            <ChevronRight className="size-5 text-[#CBD5E1] shrink-0" />
                          </div>
                        </div>
                      )
                    })}
                    {activeJourneys.length === 0 && (
                      <p className="text-sm text-muted-foreground py-4">No journeys in progress. Start one from the available journeys below.</p>
                    )}
                  </TabsContent>

                  <TabsContent value="available" className="mt-0 space-y-3">
                    {availableJourneys.map((journey) => {
                      const elements = journey.elements || []

                      return (
                        <div
                          key={journey.name}
                          className="rounded-[8px] border border-[#ecf2f5] bg-white p-5 cursor-pointer hover:border-brand-200 hover:shadow-sm transition-all"
                          onClick={() => setViewingJourney(journey)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-3">
                              <div className="space-y-1">
                                <h3 className="text-base font-medium text-black leading-6">{journey.name}</h3>
                                {journey.description && (
                                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{journey.description}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><BookOpen className="size-3" /> {elements.length} items</span>
                                <span className="flex items-center gap-1"><Clock className="size-3" /> {journey.timeline}</span>
                              </div>
                              <Button variant="outline" size="sm" className="gap-1.5 text-sm">
                                <Play className="size-3" /> Start Journey
                              </Button>
                            </div>
                            <ChevronRight className="size-5 text-muted-foreground shrink-0 mt-1" />
                          </div>
                        </div>
                      )
                    })}
                    {availableJourneys.length === 0 && (
                      <p className="text-sm text-muted-foreground py-4">No available journeys at the moment.</p>
                    )}
                  </TabsContent>

                  <TabsContent value="completed" className="mt-0 space-y-3">
                    {completedJourneys.map((journey) => {
                      const elements = journey.elements || []

                      return (
                        <div
                          key={journey.name}
                          className="rounded-[8px] border border-[#ecf2f5] bg-white p-5 cursor-pointer hover:border-brand-200 hover:shadow-sm transition-all"
                          onClick={() => setViewingJourney(journey)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-medium text-black leading-6">{journey.name}</h3>
                                <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded-[4px] border border-[#a7f3d0] bg-[#ecfdf5] text-xs font-medium text-[#153e40]">
                                  <CheckCircle2 className="size-2.5" /> Completed
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><BookOpen className="size-3" /> {elements.length} items</span>
                                <span className="flex items-center gap-1"><Clock className="size-3" /> {journey.timeline}</span>
                                {journey.completedDate && <span>Completed {journey.completedDate}</span>}
                              </div>
                            </div>
                            <ChevronRight className="size-5 text-muted-foreground shrink-0 mt-1" />
                          </div>
                        </div>
                      )
                    })}
                    {completedJourneys.length === 0 && (
                      <p className="text-sm text-muted-foreground py-4">No completed journeys yet.</p>
                    )}
                  </TabsContent>
                </Tabs>
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

              {/* ── AI Suggested For You ────────────────────────────── */}
              {aiSuggested.length > 0 && (
                <div className="rounded-[8px] border border-[rgba(0,0,0,0.05)] bg-white p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-lg bg-[#e8f5f0] flex items-center justify-center">
                      <Sparkles className="size-3.5 text-[#1a3a35]" />
                    </div>
                    <div>
                      <h2 className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">AI Suggested</h2>
                      <p className="text-xs text-muted-foreground">Items added from Ethos AI recommendations</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {aiSuggested.map((item, i) => (
                      <div
                        key={i}
                        className="rounded-[8px] border border-[#ecf2f5] bg-white p-4 flex items-start justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.typeLabel}</span>
                            {item.priority && (
                              <span className={`text-xs font-semibold uppercase px-1.5 py-0.5 rounded-full ${
                                item.priority === 'high' ? 'bg-red-50 text-red-500 border border-red-200' :
                                item.priority === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                                'bg-green-50 text-green-600 border border-green-200'
                              }`}>{item.priority}</span>
                            )}
                          </div>
                          <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                        </div>
                        <button
                          onClick={() => setAiSuggested(prev => prev.filter((_, idx) => idx !== i))}
                          className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-1"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

        </div>
      </div>

      {/* ── Add Focus Area Overlay ─────────────────────────────── */}
      {showAddFocus && createPortal(
        <AddFocusOverlay
          currentLabels={personalFocus.map(f => f.label)}
          onClose={() => setShowAddFocus(false)}
          onAdd={(skill) => {
            setPersonalFocus(prev => [...prev, { ...skill, pointsLogged: 0 }])
            setShowAddFocus(false)
          }}
        />,
        document.body
      )}

    </div>
  )
}

// ─── Add Focus Area Overlay ──────────────────────────────────────────────────

function AddFocusOverlay({ currentLabels, onClose, onAdd }) {
  const [search, setSearch] = useState('')

  const available = AVAILABLE_FOCUS_OPTIONS.filter(
    opt => !currentLabels.includes(opt.label) &&
      (opt.label.toLowerCase().includes(search.toLowerCase()) ||
       opt.description.toLowerCase().includes(search.toLowerCase()))
  )

  return (
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
    </div>
  )
}
