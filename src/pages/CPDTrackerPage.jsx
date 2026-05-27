import { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import Feature from '@/components/Feature'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ArrowLeft, Clock, Check, CheckCircle2, ChevronDown, ChevronRight, MapPin, Plus,
  BookOpen, Video, Users, Award, Link2, Upload, X, Search, Pencil, Settings,
  Sparkles, Calendar, Building2, Tag, ExternalLink, Shield, AlertTriangle,
} from 'lucide-react'
import tenant, { getCategoryBadgeVariant } from '@/config/tenant'
import { cn } from '@/lib/utils'

// ─── Tenant Data ─────────────────────────────────────────────────────────────

const t = tenant.pages.learn
const UPCOMING_WORKSHOPS = t.upcomingWorkshops
const SUGGESTED_WORKSHOPS = t.suggestedWorkshops
const COMPLETED_AREAS = t.completedAreas

// ─── CPD Regimes ────────────────────────────────────────────────────────────

const ALL_CPD_REGIMES = [
  {
    id: 'law-society-nsw',
    name: 'Law Society NSW',
    description: 'Mandatory CPD for NSW solicitors holding a practising certificate',
    totalHours: 10,
    period: '1 Apr – 31 Mar',
    unit: 'points',
    categories: [
      { name: 'Ethics & Professional Responsibility', required: 1, completed: 1 },
      { name: 'Practice Management & Business Skills', required: 1, completed: 1 },
      { name: 'Professional Skills', required: 1, completed: 0.5 },
      { name: 'Substantive Law', required: 1, completed: 0 },
      { name: 'Elective', required: 6, completed: 4 },
    ],
  },
  {
    id: 'aicd',
    name: 'AICD',
    description: 'Australian Institute of Company Directors — Fellow & Member CPD',
    totalHours: 15,
    period: '1 Jan – 31 Dec',
    unit: 'points',
    categories: [
      { name: 'Governance & Board Effectiveness', required: 4, completed: 4 },
      { name: 'Strategy & Risk', required: 3, completed: 2 },
      { name: 'Finance & Audit', required: 2, completed: 2 },
      { name: 'Leadership & Culture', required: 2, completed: 1.5 },
      { name: 'Elective', required: 4, completed: 3 },
    ],
  },
  {
    id: 'governance-institute',
    name: 'Governance Institute',
    description: 'Governance Institute of Australia — Chartered Secretary & Governance Professional',
    totalHours: 20,
    period: '1 Jul – 30 Jun',
    unit: 'points',
    categories: [
      { name: 'Corporate Governance', required: 5, completed: 5 },
      { name: 'Risk & Compliance', required: 4, completed: 2 },
      { name: 'Board Support & Company Secretarial', required: 3, completed: 3 },
      { name: 'Legal & Regulatory', required: 4, completed: 1.5 },
      { name: 'Elective', required: 4, completed: 2 },
    ],
  },
  {
    id: 'cpa-australia',
    name: 'CPA Australia',
    description: 'CPA Australia — Certified Practising Accountant CPD requirements',
    totalHours: 120,
    period: '1 Jan – 31 Dec (triennium)',
    unit: 'points',
    categories: [
      { name: 'Verifiable Learning Activities', required: 80, completed: 52 },
      { name: 'Professional & Ethical Standards', required: 8, completed: 8 },
      { name: 'Business & Leadership', required: 12, completed: 6 },
      { name: 'Technical Competence', required: 20, completed: 14 },
    ],
  },
  {
    id: 'law-society-vic',
    name: 'Law Institute of Victoria',
    description: 'Mandatory CPD for Victorian legal practitioners',
    totalHours: 10,
    period: '1 Apr – 31 Mar',
    unit: 'points',
    categories: [
      { name: 'Ethics & Professional Responsibility', required: 1, completed: 1 },
      { name: 'Practice Management & Business Skills', required: 1, completed: 0 },
      { name: 'Professional Skills', required: 1, completed: 1 },
      { name: 'Substantive Law', required: 1, completed: 0.5 },
      { name: 'Elective', required: 6, completed: 3 },
    ],
  },
  {
    id: 'qls',
    name: 'Queensland Law Society',
    description: 'Mandatory CPD for Queensland solicitors',
    totalHours: 10,
    period: '1 Apr – 31 Mar',
    unit: 'points',
    categories: [
      { name: 'Ethics & Professional Responsibility', required: 1, completed: 1 },
      { name: 'Practice Management & Business Skills', required: 1, completed: 1 },
      { name: 'Professional Skills', required: 1, completed: 0 },
      { name: 'Substantive Law', required: 1, completed: 0 },
      { name: 'Elective', required: 6, completed: 2 },
    ],
  },
  {
    id: 'ca-anz',
    name: 'Chartered Accountants ANZ',
    description: 'CA ANZ — Chartered Accountant CPD requirements',
    totalHours: 120,
    period: '1 Jan – 31 Dec (triennium)',
    unit: 'points',
    categories: [
      { name: 'Verifiable Activities', required: 80, completed: 45 },
      { name: 'Ethics & Governance', required: 8, completed: 8 },
      { name: 'Technical & Specialist', required: 20, completed: 12 },
      { name: 'Business & Personal Skills', required: 12, completed: 8 },
    ],
  },
  {
    id: 'icaa',
    name: 'ICA Australia',
    description: 'Institute of Chartered Accountants compliance requirements',
    totalHours: 40,
    period: '1 Jul – 30 Jun',
    unit: 'points',
    categories: [
      { name: 'Accounting & Financial Reporting', required: 10, completed: 7 },
      { name: 'Audit & Assurance', required: 8, completed: 5 },
      { name: 'Tax & Regulatory', required: 8, completed: 4 },
      { name: 'Ethics & Professional Standards', required: 4, completed: 4 },
      { name: 'Elective', required: 10, completed: 3 },
    ],
  },
]

const DEFAULT_SELECTED = ['law-society-nsw', 'aicd', 'governance-institute']

// ─── Mock Data ───────────────────────────────────────────────────────────────

const CPD_ACTIVITY_TYPES = {
  course:        { icon: BookOpen, label: 'Course', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  webinar:       { icon: Video, label: 'Webinar', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  workshop:      { icon: Users, label: 'Workshop', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  certification: { icon: Award, label: 'Certification', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
}
const ACTIVITY_TYPE_OPTIONS = Object.keys(CPD_ACTIVITY_TYPES)

// Pending / complete indicator for a CPD regime.
// Dashed grey ring while any category remains below requirement; green
// circle with a tick once every category is met.
function RegimeStatusIcon({ complete, size = 32 }) {
  if (complete) {
    return (
      <div
        className="rounded-full bg-emerald-500 flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <Check className="size-4 text-white" strokeWidth={3} />
      </div>
    )
  }
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={size / 2} cy={size / 2} r={(size - 2) / 2}
        fill="none"
        stroke="#9ca3af"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
    </svg>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CPDTrackerPage() {
  const navigate = useNavigate()
  const [showLogForm, setShowLogForm] = useState(false)
  const [showRegimeOverlay, setShowRegimeOverlay] = useState(false)
  const [selectedRegimeIds, setSelectedRegimeIds] = useState(DEFAULT_SELECTED)
  const [collapsedRegimes, setCollapsedRegimes] = useState(() => new Set())

  const toggleRegime = (id) => setCollapsedRegimes(prev => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })
  const [logForm, setLogForm] = useState({ type: '', points: '', description: '', link: '' })
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [enrolledIds, setEnrolledIds] = useState(() => UPCOMING_WORKSHOPS.filter(w => w.status === 'Booked').map(w => w.id))

  const selectedRegimes = useMemo(
    () => ALL_CPD_REGIMES.filter(r => selectedRegimeIds.includes(r.id)),
    [selectedRegimeIds],
  )

  // Aggregate all categories across selected regimes, grouped by regime
  const allCategories = useMemo(() => {
    return selectedRegimes.flatMap(r =>
      r.categories.map(c => ({ ...c, regime: r.name }))
    )
  }, [selectedRegimes])

  const totalRequired = useMemo(
    () => selectedRegimes.reduce((sum, r) => sum + r.totalHours, 0),
    [selectedRegimes],
  )

  const totalCompleted = useMemo(
    () => allCategories.reduce((sum, c) => sum + c.completed, 0),
    [allCategories],
  )

  const totalRemaining = Math.max(0, totalRequired - totalCompleted)
  const pct = totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0
  const categoriesComplete = allCategories.filter(c => c.completed >= c.required).length
  const categoriesTotal = allCategories.length

  const handleLogSubmit = () => {
    setShowLogForm(false)
    setLogForm({ type: '', points: '', description: '', link: '' })
  }
  const handleLogClear = () => {
    setLogForm({ type: '', points: '', description: '', link: '' })
  }

  return (
    <div className="flex flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto bg-white px-8 pt-[52px] pb-6">
        <div className="max-w-[1200px] mx-auto space-y-8">

          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-[28px] leading-[30px] tracking-[-1.12px] font-normal text-[#0A0A0A]">CPD Tracker</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Log activities and stay on top of your CPD requirements.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5" /> CPD period ends 30 Jun 2026
              </span>
              <Button size="sm" className="gap-1.5" onClick={() => setShowLogForm(true)}>
                <Plus className="size-4" /> Log CPD
              </Button>
            </div>
          </div>

          {/* ── Hero ─────────────────────────────────────── */}
          <div className="relative">
            <div className="relative space-y-6">

              {/* ── Your CPD Overview Card ──────────────────────────────── */}
              <div className="rounded-[6px] border border-[#E2E8F0] bg-white p-6 space-y-6">
                <p className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">Your CPD Overview</p>

                <div className="grid grid-cols-3 gap-16">
                  {/* CPD Status */}
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-sm text-foreground">CPD Status</p>
                      <p className="text-2xl text-foreground tracking-[-0.6px]">{totalCompleted}/{totalRequired} points</p>
                    </div>
                    <div className="flex gap-[11px]">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className={`w-[5px] h-[25px] ${i < Math.round((totalCompleted / totalRequired) * 10) ? 'bg-[#6ee7b7]' : 'bg-[#d9d9d9]'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground leading-5 max-w-[220px]">
                      Reach {totalRemaining} points by completing suggested modules below
                    </p>
                  </div>

                  {/* CPD Requirements */}
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-sm text-foreground">CPD Requirements</p>
                      <p className="text-2xl text-foreground tracking-[-0.6px]">{categoriesComplete}/{categoriesTotal} met</p>
                    </div>
                    <div className="flex gap-[11px]">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className={`w-[5px] h-[25px] ${i < Math.round((categoriesComplete / categoriesTotal) * 10) ? 'bg-[#fed7aa]' : 'bg-[#d9d9d9]'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground leading-5 max-w-[220px]">
                      {categoriesTotal - categoriesComplete} requirements remaining
                    </p>
                  </div>

                  {/* CPD Compliance Status */}
                  <div className="space-y-1">
                    <p className="text-sm text-foreground">CPD Compliance Status</p>
                    <p className={`text-2xl tracking-[-0.6px] ${pct >= 50 ? 'text-[#059669]' : 'text-[#dc2626]'}`}>
                      {pct >= 100 ? 'Compliant' : pct >= 50 ? 'On Track' : 'At Risk'}
                    </p>
                    <p className="text-sm text-foreground leading-6">
                      {selectedRegimes.length > 0 ? (
                        <>You are tracking {selectedRegimes.length} CPD regime{selectedRegimes.length > 1 ? 's' : ''} with {totalRemaining} points remaining across all requirements.</>
                      ) : (
                        <>Select CPD regimes above to track your compliance requirements.</>
                      )}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ── CPD Requirements by Regime ─────────────────────────── */}
          <div className="rounded-[8px] border border-[rgba(0,0,0,0.05)] bg-white p-6 space-y-2">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">CPD Requirements</h2>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowRegimeOverlay(true)}>
                <Settings className="size-4" /> Manage
              </Button>
            </div>
            {selectedRegimes.length === 0 ? (
              <div className="rounded-[8px] bg-muted/40 p-8 text-center">
                <p className="text-sm text-muted-foreground">No CPD regimes selected.</p>
                <p className="text-xs text-muted-foreground mt-1">Click Manage to add the regimes you need to track.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {selectedRegimes.map(regime => {
                  const regimeCompleted = regime.categories.reduce((s, c) => s + c.completed, 0)
                  const allComplete = regime.categories.every(c => c.completed >= c.required)
                  const expanded = !collapsedRegimes.has(regime.id)
                  return (
                    <div key={regime.id} className="py-5 first:pt-2 last:pb-0">
                      <button
                        onClick={() => toggleRegime(regime.id)}
                        className="w-full flex items-center gap-4 text-left"
                      >
                        <RegimeStatusIcon complete={allComplete} />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-[#0a0a0a]">{regime.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {regime.period} &middot; {regimeCompleted}/{regime.totalHours} {regime.unit}
                          </p>
                        </div>
                        <ChevronDown className={cn(
                          'size-4 text-muted-foreground transition-transform shrink-0',
                          expanded && 'rotate-180',
                        )} />
                      </button>

                      {expanded && (
                        <div className="mt-4 rounded-[8px] bg-muted/40 p-3">
                          <div className="grid grid-cols-2 gap-2">
                            {regime.categories.map((cat, i) => {
                              const isComplete = cat.completed >= cat.required
                              return (
                                <div key={`${regime.id}-${cat.name}-${i}`} className={`flex items-center justify-between h-10 px-3 rounded-[8px] border border-border ${isComplete ? 'bg-[#f7fee7]' : 'bg-white'}`}>
                                  <div className="flex items-center gap-[5px]">
                                    {isComplete && (
                                      <span className="flex items-center justify-center size-3 rounded-full bg-[#047857] shrink-0">
                                        <Check className="size-2 text-white" strokeWidth={3} />
                                      </span>
                                    )}
                                    <p className="text-sm font-medium text-foreground tracking-[-0.15px] leading-5">{cat.name}</p>
                                  </div>
                                  <span className={`inline-flex items-center h-6 px-1.5 rounded-[6px] border text-xs font-medium shrink-0 ${isComplete ? 'bg-[#f7fee7] border-[#d9f99d] text-[#365314]' : 'bg-[#f9fafb] border-[#e5e7eb] text-[#374151]'}`}>
                                    {cat.completed} / {cat.required} {regime.unit === 'points' ? 'pt' : 'hr'}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Log CPD Overlay ───────────────────────────────────────── */}
          {showLogForm && createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowLogForm(false)} />
              <div className="relative z-10 bg-white rounded-xl border border-border shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                  <h2 className="text-lg font-semibold text-foreground">Log CPD Activity</h2>
                  <button onClick={() => setShowLogForm(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="size-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-auto px-6 py-5 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Activity Type</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-between h-9 text-sm font-normal">
                          {logForm.type ? CPD_ACTIVITY_TYPES[logForm.type].label : <span className="text-muted-foreground">Select activity type</span>}
                          <ChevronDown className="size-3.5 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]">
                        {ACTIVITY_TYPE_OPTIONS.map(t => (
                          <DropdownMenuItem key={t} onClick={() => setLogForm({ ...logForm, type: t })}>
                            {CPD_ACTIVITY_TYPES[t].label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Points Earned</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input type="number" min="0.5" step="0.5" value={logForm.points} onChange={(e) => setLogForm({ ...logForm, points: e.target.value })} placeholder="e.g. 2.5" className="h-9 pl-9" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Description of Learning</label>
                    <textarea value={logForm.description} onChange={(e) => setLogForm({ ...logForm, description: e.target.value })} placeholder="Describe what you learned..." rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Link to Learning Journey <span className="text-muted-foreground font-normal">(optional)</span></label>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input value={logForm.link} onChange={(e) => setLogForm({ ...logForm, link: e.target.value })} placeholder="Paste link or search journeys..." className="h-9 pl-9" />
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
                  <Button size="sm" onClick={handleLogSubmit} disabled={!logForm.type || !logForm.points || !logForm.description}>Log Activity</Button>
                  <Button variant="outline" size="sm" onClick={handleLogClear}>Clear</Button>
                </div>
              </div>
            </div>,
            document.body
          )}

          {/* ── Regime Selection Overlay ────────────────────────────── */}
          {showRegimeOverlay && createPortal(
            <RegimeOverlay
              selected={selectedRegimeIds}
              onClose={() => setShowRegimeOverlay(false)}
              onSave={(ids) => { setSelectedRegimeIds(ids); setShowRegimeOverlay(false) }}
            />,
            document.body
          )}

          {/* ── Event Detail Overlay ──────────────────────────────────── */}
          {selectedEvent && createPortal(
            <EventDetailOverlay
              event={selectedEvent}
              enrolled={enrolledIds.includes(selectedEvent.id)}
              onClose={() => setSelectedEvent(null)}
              onEnrol={() => setEnrolledIds(prev => [...prev, selectedEvent.id])}
              onDeEnrol={() => setEnrolledIds(prev => prev.filter(id => id !== selectedEvent.id))}
            />,
            document.body
          )}

          {/* ── CPD Calendar ─────────────────────────────────────── */}
          <div className="space-y-4 rounded-[8px] border border-[#ECF2F5] bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">CPD Calendar</h2>
              <Button variant="ghost" size="sm" className="text-sm font-medium gap-1 text-muted-foreground" onClick={() => navigate('/learn/cpd/events')}>
                View All <ChevronRight className="size-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-[3fr_1fr] gap-5">
              {/* Left column — event list */}
              <div className="space-y-2.5">
                {(() => {
                  const today = new Date()
                  const endOfWeek = new Date(today)
                  endOfWeek.setDate(today.getDate() + (7 - today.getDay()))

                  const getEventDate = (w) => {
                    const monthMap = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 }
                    return new Date(parseInt(w.year), monthMap[w.month.toUpperCase()] ?? 0, parseInt(w.day))
                  }

                  const thisWeek = []
                  const upcoming = []

                  UPCOMING_WORKSHOPS.forEach(w => {
                    const d = getEventDate(w)
                    if (d <= endOfWeek) thisWeek.push(w)
                    else upcoming.push(w)
                  })

                  // Also include suggested
                  const suggested = SUGGESTED_WORKSHOPS.map(w => ({ ...w, _type: 'suggested' }))

                  const renderItem = (w) => (
                    <div key={w.id} className="flex items-center gap-3 rounded-[8px] border border-[#ecf2f5] bg-white px-3.5 py-2.5 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => setSelectedEvent({ ...w, _tab: w._type === 'suggested' ? 'recommended' : 'upcoming' })}>
                      <div className="flex items-center justify-center rounded-[8px] shrink-0 w-10 h-10 bg-[#f5f5f5]">
                        <Calendar className="size-4 text-[#737373]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0a0a0a] tracking-[-0.15px] leading-5 truncate">{w.title}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-[#737373]">{w.month?.charAt(0)}{w.month?.slice(1).toLowerCase()} {w.day} · {w.time || 'TBC'}</span>
                          <span className="text-xs text-[#737373]">{w.provider}</span>
                        </div>
                        {w._type === 'suggested' && w.relevance && (
                          <p className="inline-flex items-center gap-1 text-xs text-indigo-500 mt-0.5"><Sparkles className="size-3 shrink-0" />{w.relevance}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center h-5 px-1.5 rounded text-xs font-medium border border-[#e5e7eb] bg-[#f9fafb] text-[#374151]">{w._type !== 'suggested' ? '+' : ''}{w.cpdPoints || w.cpdHours}pts</span>
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
                          {thisWeek.map(w => renderItem({ ...w, _type: 'upcoming' }))}
                        </>
                      )}
                      {upcoming.length > 0 && (
                        <>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider pt-1">Upcoming</p>
                          {upcoming.map(w => renderItem({ ...w, _type: 'upcoming' }))}
                        </>
                      )}
                      {suggested.length > 0 && (
                        <>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider pt-1">Suggested</p>
                          {suggested.map(renderItem)}
                        </>
                      )}
                    </>
                  )
                })()}
              </div>

              {/* Right column — Mini calendar */}
              <div className="rounded-[8px] border border-[#ecf2f5] bg-white p-4 self-start">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-[#0a0a0a]">CPD Calendar</p>
                  <span title="Synced with Outlook" className="inline-flex items-center gap-1 h-5 px-1.5 rounded-full border border-[#e5e7eb] bg-white text-xs">
                    <img src="/images/outlook-icon.png" alt="Outlook" className="size-3" />
                    <span className="size-3 rounded-full bg-[#A7F3D0] flex items-center justify-center"><Check className="size-2 text-[#065F46]" strokeWidth={3} /></span>
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <span>March 2026</span>
                  </div>
                  <div className="grid grid-cols-7 gap-0.5 text-center text-xs text-muted-foreground font-medium">
                    {['M','T','W','T','F','S','S'].map((d,i) => <span key={i} className="py-1">{d}</span>)}
                  </div>
                  <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
                    {[null,null,null,null,null,null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31].map((d,i) => {
                      const isUpcoming = [12, 18].includes(d)
                      const isSuggested = [25].includes(d)
                      const isToday = d === 11
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

          {/* ── Completed CPD ─────────────────────────────────────────── */}
          <div className="space-y-5 mb-8">
            <h2 className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">Completed CPD</h2>

            <div className="space-y-2">
              {COMPLETED_AREAS.map((item) => (
                <div key={item.id} onClick={() => setSelectedEvent({ ...item, title: item.label, _tab: 'completed' })} className="flex items-center gap-3 rounded-[10px] border border-[rgba(229,229,229,0.6)] bg-white px-3.5 py-2.5 hover:bg-muted/20 transition-colors cursor-pointer">
                  <CheckCircle2 className="size-4 text-brand-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0a0a0a] tracking-[-0.15px] leading-5">{item.label}</p>
                    <span className="text-xs text-[#737373]">{item.completedDate} &middot; {item.hours} pts</span>
                  </div>
                  <span className="text-xs text-[#737373] shrink-0">{item.category}</span>
                  <span className="inline-flex items-center h-6 px-1.5 rounded-md border border-[#e5e7eb] bg-[#f9fafb] text-xs font-medium text-[#374151] shrink-0">+{item.cpdPoints}pts</span>
                  <span className={`inline-flex items-center h-6 px-1.5 rounded-md text-xs font-medium shrink-0 ${item.badge === 'Certified' ? 'border border-brand-200 bg-brand-50 text-brand-700' : 'border border-[#a7f3d0] bg-[#ecfdf5] text-[#153e40]'}`}>
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

// ─── Regime Selection Overlay ───────────────────────────────────────────────

function RegimeOverlay({ selected, onClose, onSave }) {
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState(selected)

  const filtered = ALL_CPD_REGIMES.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (id) => {
    setDraft(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const draftRegimes = ALL_CPD_REGIMES.filter(r => draft.includes(r.id))
  const draftTotalHours = draftRegimes.reduce((sum, r) => sum + r.totalHours, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl border border-border shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-foreground">CPD Regimes</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Select the professional bodies whose CPD requirements apply to you</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pt-4 pb-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search regimes..."
              className="h-9 pl-9"
            />
          </div>
        </div>

        {/* Regime List */}
        <div className="flex-1 overflow-auto px-6 py-3 space-y-2">
          {filtered.map(regime => {
            const isSelected = draft.includes(regime.id)
            return (
              <button
                key={regime.id}
                onClick={() => toggle(regime.id)}
                className={`w-full text-left rounded-lg border p-3.5 transition-colors ${
                  isSelected
                    ? 'border-brand-300 bg-brand-50/50'
                    : 'border-border hover:bg-muted/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{regime.name}</p>
                      {isSelected && (
                        <span className="flex items-center justify-center size-4 rounded-full bg-brand-600 shrink-0">
                          <Check className="size-2.5 text-white" strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{regime.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="inline-flex items-center h-5 px-1.5 rounded border border-[#e5e7eb] bg-[#f9fafb] text-xs font-medium text-[#374151]">
                        {regime.totalHours} {regime.unit}
                      </span>
                      <span className="text-xs text-muted-foreground">{regime.period}</span>
                      <span className="text-xs text-muted-foreground">{regime.categories.length} categories</span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}

          {filtered.length === 0 && (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">No regimes matching "{search}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0">
          <p className="text-xs text-muted-foreground">
            {draft.length} regime{draft.length !== 1 ? 's' : ''} selected &middot; {draftTotalHours} total {draftTotalHours === 1 ? 'point' : 'points'}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={() => onSave(draft)}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Event Detail Overlay ────────────────────────────────────────────────────

function EventDetailOverlay({ event, enrolled, onClose, onEnrol, onDeEnrol }) {
  const isCompleted = event._tab === 'completed'
  const isRecommended = event._tab === 'recommended'
  const isFull = event.isEthika && event.capacity && event.registered >= event.capacity
  const spotsLeft = event.isEthika && event.capacity ? Math.max(0, event.capacity - event.registered) : null

  const dateDisplay = event.month
    ? `${event.month.charAt(0) + event.month.slice(1).toLowerCase()} ${parseInt(event.day, 10)}, ${event.year}`
    : event.completedDate || null

  const eventCategories = event.categories || (event.category ? [event.category] : [])
  const eventRegimes = event.regimes || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl border border-border shadow-xl w-full max-w-[700px] max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold text-foreground pr-4 leading-snug">{event.title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5 space-y-5">
          {/* External event disclaimer */}
          {!isCompleted && !event.isEthika && event.registrationUrl && event.externalDisclaimer && (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/60 px-3.5 py-3">
              <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">{event.externalDisclaimer}</p>
            </div>
          )}

          {/* Status badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {isCompleted && (
              <span className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-sm font-medium ${event.badge === 'Certified' ? 'border border-brand-200 bg-brand-50 text-brand-700' : 'border border-[#a7f3d0] bg-[#ecfdf5] text-[#153e40]'}`}>
                <CheckCircle2 className="size-3.5" /> {event.badge}
              </span>
            )}
            {!isCompleted && enrolled && (
              <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-[#a7f3d0] bg-[#ecfdf5] text-sm font-medium text-[#153e40]">
                <CheckCircle2 className="size-3.5" /> Enrolled
              </span>
            )}
            {isRecommended && event.matchScore && (
              <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-purple-200 bg-purple-50 text-sm font-medium text-purple-700">
                <Sparkles className="size-3.5" /> {event.matchScore}% match
              </span>
            )}
            {event.type && (
              <span className="inline-flex items-center h-7 px-2.5 rounded-md border border-[#e5e7eb] bg-[#f9fafb] text-sm font-medium text-[#374151]">
                {event.type}
              </span>
            )}
          </div>

          {/* Details grid */}
          <div className="space-y-3">
            {dateDisplay && (
              <div className="flex items-center gap-3">
                <Calendar className="size-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground">{dateDisplay}</span>
              </div>
            )}
            {event.time && (
              <div className="flex items-center gap-3">
                <Clock className="size-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground">{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground">{event.location}</span>
              </div>
            )}
            {event.provider && (
              <div className="flex items-center gap-3">
                <Building2 className="size-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground">{event.provider}</span>
              </div>
            )}
            {eventCategories.length > 0 && (
              <div className="flex items-start gap-3">
                <Tag className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex items-center gap-1.5 flex-wrap">
                  {eventCategories.map(cat => (
                    <Badge key={cat} variant={getCategoryBadgeVariant(cat)}>{cat}</Badge>
                  ))}
                </div>
              </div>
            )}
            {eventRegimes.length > 0 && (
              <div className="flex items-center gap-3">
                <Shield className="size-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground">{eventRegimes.map(r => r.replace(/-/g, ' ')).join(', ')}</span>
              </div>
            )}
            {event.isEthika && event.capacity && (
              <div className="flex items-center gap-3">
                <Users className="size-4 text-muted-foreground shrink-0" />
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-foreground">{event.registered}/{event.capacity} registered</span>
                  {spotsLeft > 0 && spotsLeft <= 10 && (
                    <span className="text-xs text-amber-600 font-medium">{spotsLeft} spots left</span>
                  )}
                  {isFull && event.waitlistCount > 0 && (
                    <span className="text-xs text-red-600 font-medium">Full · {event.waitlistCount} on waitlist</span>
                  )}
                  {isFull && !event.waitlistCount && (
                    <span className="text-xs text-red-600 font-medium">Full</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
          )}

          <Separator />

          {/* What you'll achieve */}
          <div className="rounded-lg border border-purple-200 bg-purple-50/60 px-4 py-3.5 space-y-2.5">
            <p className="text-sm font-medium text-purple-900 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-purple-500" />
              {isCompleted ? 'What was achieved' : 'What you\'ll achieve'}
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                <span className="text-sm text-purple-900">{event.cpdPoints ?? event.cpdHours ?? event.hours} CPD points toward your requirements</span>
              </li>
              {eventCategories.length > 0 && (
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-purple-900">Counts toward <span className="font-medium">{eventCategories.join(', ')}</span></span>
                </li>
              )}
              {eventRegimes.length > 0 && (
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-purple-900">Recognised by {eventRegimes.map(r => r.replace(/-/g, ' ')).join(', ')}</span>
                </li>
              )}
              {isRecommended && event.relevance && (
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-purple-900">{event.relevance}</span>
                </li>
              )}
              {event.type && (
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-purple-900">{event.type} completion certificate</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-2 px-6 py-4 border-t border-border shrink-0">
          {isCompleted ? (
            <>
              <Button variant="outline" size="sm" className="gap-1.5">
                <ExternalLink className="size-3.5" /> View Certificate
              </Button>
              <div className="flex-1" />
              <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            </>
          ) : enrolled ? (
            <>
              <Button variant="secondary" size="sm" onClick={() => { onDeEnrol(); onClose() }}>
                De-enrol
              </Button>
              <div className="flex-1" />
              <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            </>
          ) : isFull ? (
            <>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { onEnrol(); onClose() }}>
                <Users className="size-3.5" /> Join Waitlist
              </Button>
              <div className="flex-1" />
              <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            </>
          ) : (
            <>
              <Button size="sm" onClick={() => { onEnrol(); onClose() }}>
                Enrol
              </Button>
              <div className="flex-1" />
              <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
