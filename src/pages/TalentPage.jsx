import { useState } from 'react'
import {
  Sparkles, MapPin, Clock, Star, Bookmark, BookmarkCheck,
  ArrowUp, RotateCcw, X, Users, ChevronRight, ListChecks,
  TrendingUp, Flag, Search, ArrowLeft, Globe, Briefcase,
  CalendarDays, CheckCircle2, Send, ChevronDown, SlidersHorizontal,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import tenant from '@/config/tenant'

function FilterModal({ label, active, children, onApply }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1.5 h-9 px-4 text-sm font-medium rounded-lg border transition-colors ${
          active ? 'border-brand-700 text-brand-800 bg-brand-50/50' : 'border-border text-muted-foreground bg-white hover:bg-muted/40'
        }`}
      >
        {label}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[640px] max-h-[80vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0">
              <h2 className="text-lg font-semibold text-foreground">Filters</h2>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {children}
            </div>
            <div className="px-6 py-4 border-t border-border/60 shrink-0 flex items-center justify-between">
              <button onClick={() => { onApply?.() }} className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors">
                Clear all filters
              </button>
              <Button onClick={() => setOpen(false)}>Save filters</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const t = tenant.pages.talent

const PRACTICE_AREAS  = t.practiceAreas
const SENIORITY_LEVELS = ['Junior', 'Mid', 'Senior', 'Executive']
const AVAILABILITY_OPTIONS = ['Immediately', '1–2 weeks', '2–4 weeks', 'Any']

const PROFESSIONALS = t.professionals

const AI_SUMMARY = t.aiSummary

const AI_ACTIONS = t.aiActions

const AI_RECOMMENDATIONS = t.aiRecommendations

const priorityStyle = {
  High:   'border-amber-300 bg-amber-50 text-amber-700',
  Medium: 'border-slate-200 bg-slate-50 text-slate-600',
  Low:    'border-slate-200 bg-slate-50 text-slate-400',
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`size-3 ${
            i <= Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-muted text-muted-foreground/20'
          }`}
        />
      ))}
    </div>
  )
}

function TalentCard({ professional, bookmarked, onToggleBookmark, onClick }) {
  const visibleTags = professional.tags.slice(0, 3)
  const extraCount  = professional.tags.length - 3

  return (
    <div onClick={onClick} className="flex flex-col border border-border/60 rounded-xl bg-white hover:shadow-md transition-all cursor-pointer overflow-hidden p-6">

      {/* Bookmark top-right */}
      <div className="flex justify-between items-start">
        {professional.avatar ? (
          <img src={professional.avatar} alt={professional.name} className="size-14 rounded-full object-cover shrink-0" />
        ) : (
          <div className={`flex size-14 items-center justify-center rounded-full text-base font-semibold shrink-0 ${professional.color}`}>
            {professional.initials}
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleBookmark(professional.id) }}
          className="text-muted-foreground/40 hover:text-brand-600 transition-colors"
        >
          {bookmarked
            ? <BookmarkCheck className="size-4 text-brand-600 fill-brand-100" />
            : <Bookmark className="size-4" />
          }
        </button>
      </div>

      {/* Name */}
      <div className="mt-2.5">
        <div>
          <p className="text-sm font-medium text-foreground">{professional.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{professional.title} &middot; {professional.experience}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 mt-1">

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {visibleTags.map(tag => (
            <span key={tag} className="text-xs font-medium text-muted-foreground bg-muted px-2 h-6 inline-flex items-center rounded-[6px]">
              {tag}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 h-6 inline-flex items-center rounded-[6px]">
              +{extraCount}
            </span>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 pt-3 mt-1 border-t border-border/40">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0" />
            <span>{professional.location}</span>
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${
            professional.availType === 'Immediately' ? 'text-emerald-600' : 'text-muted-foreground'
          }`}>
            <Clock className="size-3 shrink-0" />
            <span>{professional.availability}</span>
          </div>
        </div>

      </div>

    </div>
  )
}

function TalentAiPanel({ onClose }) {
  return (
    <div className="flex flex-col w-[380px] shrink-0 border-l border-border overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-brand-600" />
          <span className="text-sm font-medium text-foreground">Talent Insights</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="size-7 text-muted-foreground">
          <X className="size-4" />
        </Button>
      </div>

      <div className="flex-1 px-5 py-4 space-y-6">
        {/* Insights */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Pool Overview</h3>
          </div>
          <div className="space-y-2">
            {AI_SUMMARY.map((point, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-1.5 size-1 rounded-full bg-brand-400 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

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

        {/* Recommendations */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Flag className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Next Steps</h3>
          </div>
          <div>
            {AI_RECOMMENDATIONS.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="size-1.5 rounded-full shrink-0 bg-muted-foreground/40" />
                  <p className="text-xs text-foreground truncate">{r.label}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{r.due}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Extended profile data ────────────────────────────────────────────────────

const PROFILE_EXTRAS = {
  1: {
    summary: 'Experienced corporate lawyer with deep expertise in M&A transactions, governance frameworks, and commercial contracts. Known for delivering pragmatic advice on complex cross-border transactions and regulatory matters across the Asia-Pacific region.',
    expertise: ['Contracts', 'M&A', 'Governance', 'Corporate Advisory', 'Compliance'],
    jurisdictions: ['Australia', 'New Zealand', 'Singapore'],
    availableFrom: 'Immediately',
    engagement: 'Fractional',
    workingArrangement: 'Remote',
    dayRate: '$900 - $1,200',
    projectRate: 'Upon Request',
    experience: [
      { period: '2019 - Present', role: 'Senior Corporate Counsel', company: 'ASX-Listed Health Co.' },
      { period: '2015 - 2019', role: 'Associate Director', company: 'Herbert Smith Freehills' },
      { period: '2012 - 2015', role: 'Senior Associate', company: 'Allens Linklaters' },
    ],
    previouslyHired: true,
  },
  2: {
    summary: 'Regulatory specialist with extensive experience in financial services compliance, APRA/ASIC regulatory frameworks, and enterprise risk management. Strong track record of helping organisations navigate complex regulatory change programs.',
    expertise: ['Regulatory', 'Compliance', 'ESG', 'Policy Development', 'Risk Management'],
    jurisdictions: ['Australia', 'United Kingdom'],
    availableFrom: 'Immediately',
    engagement: 'Contract',
    workingArrangement: 'Hybrid',
    dayRate: '$800 - $1,100',
    projectRate: '$15,000 - $25,000',
    experience: [
      { period: '2020 - Present', role: 'Regulatory Lead', company: 'Big 4 Consulting' },
      { period: '2016 - 2020', role: 'Compliance Manager', company: 'Major Bank' },
    ],
    previouslyHired: false,
  },
}

// Default extras for profiles without specific data
const DEFAULT_EXTRAS = {
  summary: 'Experienced professional with a strong background in corporate governance and regulatory compliance. Provides practical, commercial advice to boards and management teams across a range of industries.',
  expertise: ['Governance', 'Compliance', 'Risk', 'Policy', 'Advisory'],
  jurisdictions: ['Australia'],
  availableFrom: 'Immediately',
  engagement: 'Fractional',
  workingArrangement: 'Remote',
  dayRate: '$800 - $1,200',
  projectRate: 'Upon Request',
  experience: [
    { period: '2020 - 2025', role: 'Executive Partner', company: 'Business Name' },
    { period: '2015 - 2020', role: 'Senior Associate', company: 'Business Name' },
    { period: '2010 - 2015', role: 'Associate', company: 'Business Name' },
  ],
  previouslyHired: false,
}

function EnquiryModal({ professional, onClose }) {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  function handleSend() {
    if (!message.trim()) return
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-4" />
        </button>

        <div className="flex flex-col items-center px-6 pt-8 pb-6">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="size-9 text-emerald-600" />
                </div>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold text-foreground">Enquiry Sent</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your enquiry has been sent to {professional.name}. You&apos;ll receive a confirmation and their response via email. You can continue the conversation directly from your inbox.
                </p>
              </div>
              <Button onClick={onClose} className="w-full mt-2">
                Done
              </Button>
            </div>
          ) : (
            <>
              {/* Avatar */}
              <div className={`flex size-20 items-center justify-center rounded-full text-xl font-bold ${professional.color}`}>
                {professional.initials}
              </div>

              {/* Name & title */}
              <h2 className="text-lg font-semibold text-foreground mt-4">{professional.name}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{professional.title} &middot; {professional.experience}</p>

              {/* Message input */}
              <div className="w-full mt-6 space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Your message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder={`Send a message to ${professional.name}...`}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring resize-none"
                />
              </div>

              {/* Send button */}
              <Button
                className="w-full mt-4 gap-1.5"
                onClick={handleSend}
                disabled={!message.trim()}
              >
                <Send className="size-4" /> Send Enquiry
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function TalentProfile({ professional, onBack, bookmarked, onToggleBookmark }) {
  const extras = PROFILE_EXTRAS[professional.id] || DEFAULT_EXTRAS
  const [enquiryOpen, setEnquiryOpen] = useState(false)

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <div className="flex-1 overflow-auto relative">
        {/* Gradient banner */}
        <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-[rgba(196,181,253,0.15)] to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 pt-10 pb-8">
          {/* Back link */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="size-4" /> Back to talent
          </button>

          <div className="flex gap-8">
            {/* ── Main content ── */}
            <div className="flex-1 min-w-0 space-y-8 pb-8">
              {/* Profile header */}
              <div className="flex items-end gap-5">
                <div className={`flex size-24 items-center justify-center rounded-full text-2xl font-bold shrink-0 ring-4 ring-white ${professional.color}`}>
                  {professional.initials}
                </div>
                <div className="pb-1">
                  <h1 className="text-2xl font-semibold text-foreground">{professional.name}</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">{professional.title} | {professional.experience} experience</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-3.5" /> {professional.location}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={professional.rating} />
                      <span className="text-sm text-muted-foreground">{professional.hires} hires</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <section className="space-y-3">
                <h2 className="text-base font-semibold text-foreground">Summary</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{extras.summary}</p>
              </section>

              <Separator />

              {/* Expertise */}
              <section className="space-y-3">
                <h2 className="text-base font-semibold text-foreground">Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {extras.expertise.map(tag => (
                    <span key={tag} className="text-xs font-medium text-muted-foreground bg-muted border border-border rounded-full px-3 py-1.5">{tag}</span>
                  ))}
                </div>
              </section>

              <Separator />

              {/* Legal Jurisdictions */}
              <section className="space-y-3">
                <h2 className="text-base font-semibold text-foreground">Legal Jurisdictions</h2>
                <div className="flex flex-wrap gap-2">
                  {extras.jurisdictions.map(j => (
                    <span key={j} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted border border-border rounded-full px-3 py-1.5">
                      <Globe className="size-3" /> {j}
                    </span>
                  ))}
                </div>
              </section>

              <Separator />

              {/* Experience timeline */}
              <section className="space-y-4">
                <h2 className="text-base font-semibold text-foreground">Experience</h2>
                <div className="space-y-0">
                  {extras.experience.map((exp, i) => (
                    <div key={i} className="flex gap-4">
                      {/* Timeline */}
                      <div className="flex flex-col items-center shrink-0">
                        <div className="size-2.5 rounded-full bg-brand-400 mt-1.5" />
                        {i < extras.experience.length - 1 && <div className="w-px flex-1 bg-border" />}
                      </div>
                      {/* Content */}
                      <div className="pb-6">
                        <p className="text-xs text-muted-foreground">{exp.period}</p>
                        <p className="text-sm font-medium text-foreground mt-0.5">{exp.role}</p>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ── Right sidebar ── */}
            <div className="w-72 shrink-0 space-y-4">
              {/* Availability & Engagement */}
              <div className="border border-border/60 rounded-lg p-5 space-y-4 bg-muted/40">
                <h3 className="text-sm font-semibold text-brand-700">Availability & Engagement</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Available from</p>
                    <p className="text-sm font-medium text-foreground">{extras.availableFrom}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Preferred Engagement</p>
                    <p className="text-sm font-medium text-foreground">{extras.engagement}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Working Arrangement</p>
                    <p className="text-sm font-medium text-foreground">{extras.workingArrangement}</p>
                  </div>
                </div>
              </div>

              {/* Indicative Rates */}
              <div className="border border-border/60 rounded-lg p-5 space-y-4 bg-muted/40">
                <h3 className="text-sm font-semibold text-brand-700">Indicative Rates</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Day Rate</p>
                    <p className="text-sm font-medium text-foreground">{extras.dayRate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Project Rate</p>
                    <p className="text-sm font-medium text-foreground">{extras.projectRate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div className="shrink-0 bg-white border-t border-border px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Ready to connect with <span className="font-semibold text-foreground">{professional.name}</span>?
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-9"
              onClick={() => onToggleBookmark(professional.id)}
            >
              {bookmarked ? (
                <BookmarkCheck className="size-4 text-brand-600 fill-brand-100" />
              ) : (
                <Bookmark className="size-4" />
              )}
            </Button>
            <Button className="gap-1.5 px-6" onClick={() => setEnquiryOpen(true)}>
              Send Message
            </Button>
          </div>
        </div>
      </div>

      {/* Enquiry modal */}
      {enquiryOpen && (
        <EnquiryModal professional={professional} onClose={() => setEnquiryOpen(false)} />
      )}
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function TalentPage() {
  const [search,           setSearch]           = useState('')
  const [practiceAreas,    setPracticeAreas]    = useState(new Set(['Legal']))
  const [seniority,        setSeniority]        = useState(new Set())
  const [availability,     setAvailability]     = useState('Immediately')
  const [showFavourites,   setShowFavourites]   = useState(false)
  const [bookmarked,       setBookmarked]       = useState(new Set([1, 4]))
  const [budgetMin,        setBudgetMin]        = useState(110)
  const [budgetMax,        setBudgetMax]        = useState(250)
  const [drawerOpen,       setDrawerOpen]       = useState(false)
  const [selectedProfile,  setSelectedProfile]  = useState(null)

  function togglePractice(area) {
    setPracticeAreas(prev => {
      const next = new Set(prev)
      next.has(area) ? next.delete(area) : next.add(area)
      return next
    })
  }

  function toggleSeniority(level) {
    setSeniority(prev => {
      const next = new Set(prev)
      next.has(level) ? next.delete(level) : next.add(level)
      return next
    })
  }

  function toggleBookmark(id) {
    setBookmarked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function reset() {
    setSearch('')
    setPracticeAreas(new Set())
    setSeniority(new Set())
    setAvailability('Any')
    setBudgetMin(110)
    setBudgetMax(250)
    setShowFavourites(false)
  }

  const filtered = PROFESSIONALS.filter(p => {
    if (showFavourites && !bookmarked.has(p.id)) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.title.toLowerCase().includes(search.toLowerCase()) &&
        !p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) return false
    if (practiceAreas.size > 0 && !p.practiceAreas.some(a => practiceAreas.has(a))) return false
    if (seniority.size > 0 && !seniority.has(p.seniority)) return false
    if (availability !== 'Any' && p.availType !== availability) return false
    return true
  })

  const availableNow = PROFESSIONALS.filter(p => p.availType === 'Immediately').length

  if (selectedProfile) {
    return (
      <TalentProfile
        professional={selectedProfile}
        onBack={() => setSelectedProfile(null)}
        bookmarked={bookmarked.has(selectedProfile.id)}
        onToggleBookmark={toggleBookmark}
      />
    )
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto px-6 pt-[60px] pb-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ── Gradient Hero ─────────────────────────────────────── */}
          <div className="relative -mx-6 -mt-[60px] px-6 pt-[60px] pb-6">
            <div className="pointer-events-none absolute inset-0 left-[calc(-50vw+50%)] w-screen bg-gradient-to-b from-[rgba(196,181,253,0.1)] to-transparent" />
            <div className="relative space-y-5">
              <div className="space-y-[9px]">
                <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Talent Hub</h1>
                <p className="text-sm text-muted-foreground">Access vetted professionals ready to provide solutions</p>
              </div>
              {/* Search — full width */}
              <div className="relative">
                <Search className="size-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search professionals by name, skill, or practice area..."
                  className="pl-12 pr-10 h-12 text-base rounded-xl bg-white border-border shadow-sm"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="size-5" />
                  </button>
                )}
              </div>

              {/* Filters row — button + active chips */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <FilterModal
                  label={
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="size-3.5" />
                      Filters
                      {(practiceAreas.size + seniority.size + (availability !== 'Any' ? 1 : 0) + ((budgetMin > 110 || budgetMax < 250) ? 1 : 0)) > 0 && (
                        <span className="flex items-center justify-center size-5 rounded-full bg-brand-800 text-white text-[10px] font-semibold">
                          {practiceAreas.size + seniority.size + (availability !== 'Any' ? 1 : 0) + ((budgetMin > 110 || budgetMax < 250) ? 1 : 0)}
                        </span>
                      )}
                    </span>
                  }
                  active={practiceAreas.size > 0 || seniority.size > 0 || availability !== 'Any' || (budgetMin > 110 || budgetMax < 250)}
                  onApply={reset}
                >
                  <div className="space-y-6">
                    {/* Availability */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Availability</p>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <Switch checked={availability === 'Immediately'} onCheckedChange={(v) => setAvailability(v ? 'Immediately' : 'Any')} />
                        <span className="text-sm text-foreground">Available now</span>
                      </label>
                    </div>

                    {/* Seniority — pill selectors */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Seniority</p>
                      <div className="flex flex-wrap gap-2">
                        {SENIORITY_LEVELS.map(level => (
                          <button
                            key={level}
                            onClick={() => toggleSeniority(level)}
                            className={`flex items-center gap-1.5 h-10 px-4 text-sm rounded-lg border transition-colors ${
                              seniority.has(level) ? 'border-brand-700 text-brand-800 bg-brand-50/50' : 'border-border text-foreground bg-white hover:bg-muted/40'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Practice Area + Location — side by side search inputs */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-foreground">Practice Area</p>
                        <Input placeholder="Search practice areas" className="text-sm h-10" />
                        <div className="flex flex-wrap gap-1.5">
                          {[...practiceAreas].map(area => (
                            <span key={area} className="flex items-center gap-1.5 text-xs bg-white border border-border text-foreground px-2.5 h-7 rounded-full">
                              {area} <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => togglePractice(area)} />
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-foreground">Location</p>
                        <Input placeholder="Search locations" className="text-sm h-10" />
                        <div className="flex flex-wrap gap-1.5">
                          {['Sydney, NSW', 'Melbourne, VIC'].map(loc => (
                            <span key={loc} className="flex items-center gap-1.5 text-xs bg-white border border-border text-foreground px-2.5 h-7 rounded-full">
                              {loc} <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Jurisdictions — full width */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Jurisdictions</p>
                      <Input placeholder="Search jurisdictions (e.g. Australian Law, US Law)" className="text-sm h-10" />
                      <div className="flex flex-wrap gap-1.5">
                        <span className="flex items-center gap-1.5 text-xs bg-white border border-border text-foreground px-2.5 h-7 rounded-full">
                          Australian Law <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" />
                        </span>
                      </div>
                    </div>

                    {/* Budget — dual range slider */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Budget (hourly rate)</p>
                      <div className="relative w-1/2 h-6 flex items-center">
                        {/* Track background */}
                        <div className="absolute h-1.5 w-full rounded-full bg-gray-200" />
                        {/* Active range */}
                        <div
                          className="absolute h-1.5 rounded-full bg-[#34D399]"
                          style={{
                            left: `${((budgetMin - 110) / 140) * 100}%`,
                            right: `${100 - ((budgetMax - 110) / 140) * 100}%`,
                          }}
                        />
                        {/* Min thumb */}
                        <input
                          type="range" min={110} max={250} value={budgetMin}
                          onChange={(e) => setBudgetMin(Math.min(Number(e.target.value), budgetMax - 10))}
                          className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#34D399] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                        {/* Max thumb */}
                        <input
                          type="range" min={110} max={250} value={budgetMax}
                          onChange={(e) => setBudgetMax(Math.max(Number(e.target.value), budgetMin + 10))}
                          className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#34D399] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border border-border rounded-lg px-3 h-10">
                          <span className="text-sm text-muted-foreground">$</span>
                          <span className="text-sm font-medium text-foreground">{budgetMin}</span>
                        </div>
                        <span className="text-muted-foreground">–</span>
                        <div className="flex items-center gap-2 border border-border rounded-lg px-3 h-10">
                          <span className="text-sm text-muted-foreground">$</span>
                          <span className="text-sm font-medium text-foreground">{budgetMax}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </FilterModal>

                {/* Active filter chips */}
                {[...practiceAreas].map(area => (
                  <span key={area} className="flex items-center gap-1.5 text-xs font-medium text-foreground border border-border bg-white px-2.5 h-8 rounded-full">
                    {area}
                    <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => togglePractice(area)} />
                  </span>
                ))}
                {[...seniority].map(level => (
                  <span key={level} className="flex items-center gap-1.5 text-xs font-medium text-foreground border border-border bg-white px-2.5 h-8 rounded-full">
                    {level}
                    <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => toggleSeniority(level)} />
                  </span>
                ))}
                {availability !== 'Any' && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-foreground border border-border bg-white px-2.5 h-8 rounded-full">
                    {availability}
                    <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setAvailability('Any')} />
                  </span>
                )}
                {(budgetMin > 110 || budgetMax < 250) && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-foreground border border-border bg-white px-2.5 h-8 rounded-full">
                    ${budgetMin} – ${budgetMax}/hr
                    <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => { setBudgetMin(110); setBudgetMax(250) }} />
                  </span>
                )}
                {(practiceAreas.size > 0 || seniority.size > 0 || availability !== 'Any' || (budgetMin > 110 || budgetMax < 250)) && (
                  <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground transition-colors ml-1">
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filtered.length}</span> specialists
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFavourites(false)}
                    className={`flex items-center gap-1.5 px-3 h-8 text-sm font-medium rounded-full border transition-colors ${!showFavourites ? 'border-brand-700 text-brand-800 bg-brand-50/50' : 'border-border text-muted-foreground hover:bg-muted/40'}`}
                  >
                    <Globe className="size-[18px]" strokeWidth={1} /> All
                  </button>
                  <button
                    onClick={() => setShowFavourites(true)}
                    className={`flex items-center gap-1.5 px-3 h-8 text-sm font-medium rounded-full border transition-colors ${showFavourites ? 'border-brand-700 text-brand-800 bg-brand-50/50' : 'border-border text-muted-foreground hover:bg-muted/40'}`}
                  >
                    <Bookmark className="size-[18px]" strokeWidth={1} /> Favourites
                  </button>
                </div>
              </div>

              {filtered.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {filtered.map(p => (
                    <TalentCard
                      key={p.id}
                      professional={p}
                      bookmarked={bookmarked.has(p.id)}
                      onToggleBookmark={toggleBookmark}
                      onClick={() => setSelectedProfile(p)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-sm font-medium text-muted-foreground">No professionals match your filters</p>
                  <button onClick={reset} className="text-xs text-muted-foreground underline mt-2">Reset filters</button>
                </div>
              )}
          </div>

        </div>
      </div>

      {/* AI Panel — slides in, pushes content */}
      <div className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${drawerOpen ? 'w-[380px]' : 'w-0'}`}>
        <TalentAiPanel onClose={() => setDrawerOpen(false)} />
      </div>
    </div>
  )
}
