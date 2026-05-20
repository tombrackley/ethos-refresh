import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { isInsightSaved, toggleInsightSave, getSavedInsights } from '@/lib/insightsSaves'
import { markInsightRead } from '@/lib/insightsReads'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Switch } from '@/components/ui/switch'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog, DialogContent, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { InsightsFooter } from '@/components/insights/InsightsFooter'
import { NEWS_DEMO_IMAGES } from '@/lib/insightsImages'
import { cn } from '@/lib/utils'
import { AskEthosSparkle } from '@/components/AskEthosSparkle'
import {
  Search, Bell, ChevronRight, Play, ThumbsUp, ThumbsDown,
  Zap, TrendingUp, Minus, TrendingDown, Quote, MessageCircle,
  Heart, ExternalLink, Bookmark, BookmarkCheck, AlertTriangle, Clock,
  FileText, Scale, Shield, ShieldCheck, Gavel, Eye, ArrowRight, ArrowLeft,
  Share2, Send, Lock, Printer, CheckCircle2, Copy, GraduationCap,
  CheckSquare, ListTodo, Info, Briefcase, Calendar, MessageSquare,
  RotateCcw, Download, Globe, MoreHorizontal, Video, MapPin, Users, ChevronLeft, Lightbulb,
  X, ArrowUp, Sparkles, Plus,
} from 'lucide-react'
import tenant from '@/config/tenant'

// ─── Data ────────────────────────────────────────────────────────────────────

const t = tenant.pages?.insights ?? {}
const HERO = t.hero ?? {}
const ACTIONS = t.suggestedActions ?? []
const BRIEFING = t.briefingItems ?? []
const LISTEN = t.listenLearn ?? []
const FOCUS = t.focusAreas ?? []
const REGULATORY = t.regulatory ?? []
const COMMUNITY = t.communityVoices ?? []
const RISKS = t.emergingRisks ?? []

const TABS = ['For You', 'News', 'Regulatory', 'Articles', 'Podcasts', 'Webinars', 'Community']

const FEATURED_DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop',
]

// Demo-only podcast data — surfaced on the Podcasts tab. Apple Podcasts-style categorised sections.
const PODCAST_SECTIONS = [
  {
    title: 'Top Episodes',
    episodes: [
      { id: 'POD-T-1', image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop', date: '1 day ago', video: false, explicit: true, title: 'The Governance Edge: Director Duties in the FAR Era', summary: 'Prof. Sarah Chen and James Whitfield unpack ASIC\'s updated FAR guidance, with practical advice on accountability statements and reasonable-steps frameworks.', duration: '1hr 3min' },
      { id: 'POD-T-2', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop', date: '2 days ago', video: true, explicit: false, title: 'Privacy Act Reform — What Boards Actually Need to Do', summary: 'A clear-headed walk-through of the Senate-passed Privacy Act amendments and the operational changes boards should make this quarter.', duration: '54 min' },
      { id: 'POD-T-3', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop', date: '2 days ago', video: false, explicit: false, title: 'Inside CPS 230: A Practical Compliance Sprint', summary: 'Three risk leaders share how they\'re closing the last gaps before the 1 July deadline — including the testing approach APRA wants to see.', duration: '1hr 4min' },
      { id: 'POD-T-4', image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=400&fit=crop', date: '3 days ago', video: false, explicit: false, title: 'AI Governance for Boards — Frameworks, Not Hype', summary: 'How leading boards are moving past principles to operational AI governance: model inventories, escalation paths, and accountability.', duration: '48 min' },
    ],
  },
  {
    title: 'New This Week',
    episodes: [
      { id: 'POD-N-1', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=400&fit=crop', date: '4h ago', video: false, explicit: false, title: 'ESG Disclosures: From Framework to Filing', summary: 'A practitioner\'s view on AASB S1 and S2 — what early adopters got right, and the pitfalls Group 2 entities should avoid.', duration: '38 min' },
      { id: 'POD-N-2', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop', date: '8h ago', video: true, explicit: false, title: 'Operational Resilience Under Pressure', summary: 'A live war-room conversation: what happens when a Tier-1 service provider fails, and how CPS 230 plays out in the first 90 minutes.', duration: '1hr 12min' },
      { id: 'POD-N-3', image: 'https://images.unsplash.com/photo-1488376739361-d04d63d7b48b?w=400&h=400&fit=crop', date: '12h ago', video: false, explicit: false, title: 'Anti-Goals: What Boards Should Stop Doing in 2026', summary: 'Three Australian chairs share the meetings, papers, and rituals they\'re cutting — and what they\'re using the time for instead.', duration: '42 min' },
    ],
  },
  {
    title: 'Curated for Boards',
    episodes: [
      { id: 'POD-C-1', image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&h=400&fit=crop', date: '1 week ago', video: false, explicit: false, title: 'The Modern Company Secretary', summary: 'How the company secretary role is changing — from minute-taker to strategic advisor — and the skills boards now expect.', duration: '36 min' },
      { id: 'POD-C-2', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop', date: '1 week ago', video: false, explicit: false, title: 'Cyber Resilience: A Director\'s Reading List', summary: 'A 20-minute briefing on the cyber resilience expectations now flowing from APRA, ASIC, and the OAIC.', duration: '22 min' },
      { id: 'POD-C-3', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=400&fit=crop', date: '2 weeks ago', video: true, explicit: false, title: 'Conflicts of Interest: The Hard Conversations', summary: 'Three case studies on how boards handle director conflicts — including the ones that ended in resignations.', duration: '1hr 1min' },
    ],
  },
]

// Demo-only webinar data — surfaced on the Webinars tab. Categorised event sections.
const WEBINAR_SECTIONS = [
  {
    title: 'Upcoming This Week',
    events: [
      { id: 'WEB-U-1', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop', month: 'APR', day: '15', weekday: 'Tue', time: '10:00 AM AEST', title: 'Navigating CPS 230 — Practical Implementation Guide', host: 'APRA Panel Discussion', duration: '60 min', location: 'Online', cpd: 1, registrations: 234, status: 'Registered' },
      { id: 'WEB-U-2', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop', month: 'APR', day: '17', weekday: 'Thu', time: '2:00 PM AEST', title: 'ESG Disclosure Masterclass — From Framework to Filing', host: 'Governance Institute Panel', duration: '90 min', location: 'Online', cpd: 1.5, registrations: 187, status: 'Open' },
    ],
  },
  {
    title: 'Hosted by Ethika',
    events: [
      { id: 'WEB-E-1', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop', month: 'APR', day: '22', weekday: 'Tue', time: '11:00 AM AEST', title: 'The 2026 Director\'s Compliance Calendar', host: 'James Whitfield, Ethika Intelligence', duration: '45 min', location: 'Online', cpd: 1, registrations: 312, status: 'Open' },
      { id: 'WEB-E-2', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop', month: 'MAY', day: '06', weekday: 'Tue', time: '10:00 AM AEST', title: 'AI Governance in Practice — A Working Session', host: 'Dr. Michael Torres', duration: '75 min', location: 'Online', cpd: 1.5, registrations: 156, status: 'Open' },
      { id: 'WEB-E-3', image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=600&h=400&fit=crop', month: 'MAY', day: '14', weekday: 'Wed', time: '12:30 PM AEST', title: 'Board Effectiveness Workshop', host: 'Ethika Faculty', duration: '2 hrs', location: 'Sydney CBD', cpd: 2, registrations: 42, status: 'Waitlist' },
    ],
  },
  {
    title: 'Open Registration',
    events: [
      { id: 'WEB-O-1', image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&h=400&fit=crop', month: 'MAY', day: '20', weekday: 'Tue', time: '3:00 PM AEST', title: 'Modern Slavery Reporting — Year 3 Lessons', host: 'Law Council of Australia', duration: '60 min', location: 'Online', cpd: 1, registrations: 98, status: 'Open' },
      { id: 'WEB-O-2', image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=400&fit=crop', month: 'MAY', day: '28', weekday: 'Wed', time: '1:00 PM AEST', title: 'Cross-Border Data Transfers After the Privacy Act Reform', host: 'International Bar Assoc.', duration: '90 min', location: 'Online', cpd: 1.5, registrations: 67, status: 'Open' },
      { id: 'WEB-O-3', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=400&fit=crop', month: 'JUN', day: '04', weekday: 'Wed', time: '10:00 AM AEST', title: 'Cyber Incident Response — A Tabletop Exercise', host: 'AICD', duration: '2 hrs', location: 'Online', cpd: 2, registrations: 124, status: 'Open' },
    ],
  },
  {
    title: 'Recently Recorded',
    events: [
      { id: 'WEB-R-1', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop', month: 'MAR', day: '28', weekday: 'Fri', time: 'Recorded', title: 'Privacy Act Reform — Board Briefing', host: 'Dr. Michael Torres', duration: '50 min', location: 'On-demand', cpd: 1, registrations: 412, status: 'On-demand' },
      { id: 'WEB-R-2', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop', month: 'MAR', day: '20', weekday: 'Thu', time: 'Recorded', title: 'FAR Accountability Statements — Workshop Replay', host: 'Prof. Sarah Chen', duration: '85 min', location: 'On-demand', cpd: 1.5, registrations: 287, status: 'On-demand' },
    ],
  },
]

const WEBINAR_STATUS_STYLE = {
  Registered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Open: 'bg-brand-50 text-brand-800 border-brand-200',
  Waitlist: 'bg-amber-50 text-amber-700 border-amber-200',
  'On-demand': 'bg-slate-100 text-slate-600 border-slate-200',
}

// Demo-only news tiles (no detail page wiring) — surfaced on the News tab only.
const NEWS_DEMO_TILES = [
  { id: 'NEWS-DEMO-01', contentType: 'News', source: 'Reuters', title: 'ASX hits record high as rate-cut bets lift bank stocks', excerpt: 'The benchmark index closed at an all-time peak after softer inflation data fuelled bets the RBA will cut rates by mid-year.', time: '1h ago', readTime: '3 min' },
  { id: 'NEWS-DEMO-02', contentType: 'News', source: 'Bloomberg', title: 'BHP, Rio Tinto in talks over shared iron-ore rail access in WA', excerpt: 'Two of the world\'s largest miners are exploring a co-operation deal that could reshape Pilbara logistics costs.', time: '2h ago', readTime: '4 min' },
  { id: 'NEWS-DEMO-03', contentType: 'News', source: 'The Australian', title: 'Treasury weighs CGT discount review as housing affordability pressure builds', excerpt: 'Officials have been asked to model the impact of trimming the capital gains tax discount on investor demand.', time: '3h ago', readTime: '5 min' },
  { id: 'NEWS-DEMO-04', contentType: 'News', source: 'AFR', title: 'Macquarie expands private credit arm with $2.4B fund close', excerpt: 'The bank\'s asset management division has wrapped its largest direct lending vehicle to date amid surging APAC demand.', time: '4h ago', readTime: '3 min' },
  { id: 'NEWS-DEMO-05', contentType: 'News', source: 'ABC News', title: 'NSW Government greenlights three new offshore wind zones', excerpt: 'The decision unlocks an estimated 8 GW of capacity but draws pushback from coastal community groups.', time: '5h ago', readTime: '4 min' },
  { id: 'NEWS-DEMO-06', contentType: 'News', source: 'Sydney Morning Herald', title: 'Qantas chair signals overhaul of executive remuneration framework', excerpt: 'Following last year\'s strike, the board is moving to tie a larger share of long-term pay to customer outcomes.', time: '6h ago', readTime: '4 min' },
  { id: 'NEWS-DEMO-07', contentType: 'News', source: 'Financial Times', title: 'EU regulators draft tougher rules for AI in financial services', excerpt: 'The proposed framework would require banks and insurers to document model risk and disclose AI-driven decisions to customers.', time: '7h ago', readTime: '6 min' },
  { id: 'NEWS-DEMO-08', contentType: 'News', source: 'Reuters', title: 'Tech sell-off deepens as US Treasury yields jump', excerpt: 'The Nasdaq fell 2.1% overnight as bond yields hit a three-month high on stronger-than-expected payroll data.', time: '8h ago', readTime: '3 min' },
  { id: 'NEWS-DEMO-09', contentType: 'News', source: 'The Guardian', title: 'Privacy Commissioner opens probe into retail loyalty program data sharing', excerpt: 'OAIC will examine whether two major chains breached APP 6 by sharing member transaction histories with marketing partners.', time: '9h ago', readTime: '5 min' },
  { id: 'NEWS-DEMO-10', contentType: 'News', source: 'Bloomberg', title: 'APRA flags scrutiny of crypto-asset exposures at major super funds', excerpt: 'The regulator is requesting detailed risk reporting after a 40% jump in indirect digital-asset holdings across the sector.', time: '11h ago', readTime: '4 min' },
  { id: 'NEWS-DEMO-11', contentType: 'News', source: 'Capital Brief', title: 'Atlassian co-founder commits $300M to climate philanthropy vehicle', excerpt: 'The new endowment will focus on clean-energy startups and grid-scale storage research across the Asia-Pacific.', time: '13h ago', readTime: '3 min' },
  { id: 'NEWS-DEMO-12', contentType: 'News', source: 'AFR', title: 'Westpac names new CRO as risk overhaul enters next phase', excerpt: 'The appointment follows APRA\'s closeout of the bank\'s capital overlay and an internal review of operational risk controls.', time: '15h ago', readTime: '4 min' },
]

const PRIORITY_VARIANT = {
  Critical: 'priority-critical',
  'High Priority': 'priority-high',
}

const URGENCY_DOT = {
  High: 'bg-red-500',
  Elevated: 'bg-orange-500',
  Medium: 'bg-amber-500',
  Low: 'bg-slate-400',
}

const URGENCY_VARIANT = {
  High: 'urgency-high',
  Elevated: 'urgency-elevated',
  Medium: 'urgency-medium',
  Low: 'urgency-low',
}

const URGENCY_TEXT = {
  High: 'text-red-700',
  Elevated: 'text-orange-700',
  Medium: 'text-amber-700',
  Low: 'text-slate-500',
}

// Soft pastel dot indicator (matches the regulatory table style). Mapped to focus
// area urgency: High → red, Elevated → yellow, Medium → emerald, Low → slate.
const URGENCY_PILL = {
  High:     'bg-red-200 border border-red-400',
  Elevated: 'bg-yellow-200 border border-yellow-400',
  Medium:   'bg-emerald-200 border border-emerald-400',
  Low:      'bg-slate-200 border border-slate-400',
}

// Maps a regulatory/source name to a domain so we can show its favicon.
const SOURCE_DOMAINS = {
  ASIC: 'asic.gov.au',
  APRA: 'apra.gov.au',
  AUSTRAC: 'austrac.gov.au',
  Treasury: 'treasury.gov.au',
  'Federal Parliament': 'aph.gov.au',
  'Law Council': 'lawcouncil.au',
  'Law Council of Australia': 'lawcouncil.au',
  'Governance Institute': 'governanceinstitute.com.au',
  AASB: 'aasb.gov.au',
  AICD: 'aicd.com.au',
  'Australian Financial Review': 'afr.com',
  Reuters: 'reuters.com',
  Bloomberg: 'bloomberg.com',
  'ABC News': 'abc.net.au',
  'The Australian': 'theaustralian.com.au',
  'Sydney Morning Herald': 'smh.com.au',
  'Financial Times': 'ft.com',
  'The Guardian': 'theguardian.com',
  'Capital Brief': 'capitalbrief.com',
  AFR: 'afr.com',
  ASX: 'asx.com.au',
  OAIC: 'oaic.gov.au',
}

function sourceFavicon(source) {
  const domain = SOURCE_DOMAINS[source]
  return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null
}

// Compress a citation into a short slug — extract an acronym/initialism and any year/number.
// e.g. "ASIC Information Sheet 284, Section 3" → "asic 284"
//      "Financial Accountability Regime Act 2023, s 37A" → "fara 2023"
function shortenCitation(citation) {
  if (!citation) return ''
  const first = citation.split(/[,—]/)[0].trim()
  const acronym = first.match(/\b[A-Z]{2,}\b/)?.[0]
  let short = acronym
  if (!short) {
    const stopwords = new Set(['The', 'Of', 'And', 'For', 'In', 'To', 'A', 'On'])
    const initials = first
      .split(/\s+/)
      .filter(w => /^[A-Z]/.test(w) && !stopwords.has(w))
      .map(w => w[0])
      .join('')
    short = initials || first.split(/\s+/)[0]
  }
  const number = first.match(/\b\d{2,4}\b/)?.[0]
  return (number ? `${short} ${number}` : short).toLowerCase()
}

// Phone-signal-style impact indicator — bars grow with severity, colored by level.
const IMPACT_BARS = {
  critical: { count: 3, color: 'bg-red-600',     bg: 'bg-red-100'     },
  high:     { count: 3, color: 'bg-orange-600',  bg: 'bg-orange-100'  },
  medium:   { count: 2, color: 'bg-yellow-600',  bg: 'bg-yellow-100'  },
  low:      { count: 1, color: 'bg-emerald-600', bg: 'bg-emerald-100' },
}

function ImpactSignal({ level }) {
  const config = IMPACT_BARS[level] ?? { count: 0, color: 'bg-slate-400', bg: 'bg-muted' }
  const label = `${level.charAt(0).toUpperCase()}${level.slice(1)} Impact`
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`inline-flex h-[21px] items-center gap-[2px] rounded-md px-[5px] ${config.bg}`}
          aria-label={label}
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className={`w-[3px] h-[10px] rounded-[1px] ${i < config.count ? config.color : 'bg-muted-foreground/20'}`}
            />
          ))}
        </span>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

const REG_DOT = {
  critical: 'bg-red-200 border border-red-400',
  high:     'bg-yellow-200 border border-yellow-400',
  medium:   'bg-emerald-200 border border-emerald-400',
  low:      'bg-slate-200 border border-slate-400',
}

const REG_TYPE_ICON = {
  Legislation:   FileText,
  Enforcement:   Gavel,
  Deadline:      Clock,
  Consultation:  Eye,
  Guidance:      Scale,
}

const TREND_ICON = {
  rising:  TrendingUp,
  stable:  Minus,
  falling: TrendingDown,
}

const TREND_COLOR = {
  rising:  'text-red-600',
  stable:  'text-slate-500',
  falling: 'text-green-600',
}

const CONTENT_TYPE_ICON = {
  Regulatory:  { icon: Scale, bg: 'bg-blue-100', text: 'text-blue-900' },
  Enforcement: { icon: Gavel, bg: 'bg-red-100', text: 'text-red-900' },
  News:        { icon: FileText, bg: 'bg-slate-100', text: 'text-slate-700' },
  Articles:    { icon: FileText, bg: 'bg-violet-100', text: 'text-violet-900' },
  Podcasts:    { icon: Play, bg: 'bg-orange-100', text: 'text-orange-900' },
  Webinars:    { icon: Eye, bg: 'bg-emerald-100', text: 'text-emerald-900' },
}

const TYPE_VARIANT = {
  Regulatory:  'content-regulatory',
  Enforcement: 'content-enforcement',
  News:        'content-news',
  Articles:    'content-articles',
  Podcasts:    'content-podcasts',
  Webinars:    'content-webinars',
}

// ─── Impact badge variants ────────────────────────────────────────────────────

const IMPACT_STYLE = {
  critical: 'bg-red-600 text-white',
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-slate-100 text-slate-600',
}

const CHANGE_STATUS_STYLE = {
  New: 'resource-under-review',
  'In Force': 'resource-approved',
  Amended: 'content-regulatory',
  Consultation: 'content-news',
}

const ACTION_URGENCY_STYLE = {
  Urgent: 'text-red-600',
  Recommended: 'text-blue-600',
  Optional: 'text-muted-foreground',
}

// Chip treatment for urgency — matches the "What Has Changed" status chip
// pattern (rounded pill, light tint, coloured dot prefix).
const ACTION_URGENCY_CHIP = {
  Urgent:      { bg: 'bg-[#FFE5E8]', dot: 'bg-red-500'   },
  Recommended: { bg: 'bg-[#DBEAFE]', dot: 'bg-blue-500'  },
  Optional:    { bg: 'bg-[#E2E8F0]', dot: 'bg-slate-500' },
}

const ACTION_BTN_CLASS = 'flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-foreground hover:bg-white transition-colors text-left'

// ─── Push to spaces dropdown ──────────────────────────────────────────────────

const PUSH_TARGETS_SOON = [
  { label: 'Work',   icon: Briefcase  },
  { label: 'Comply', icon: ShieldCheck },
  { label: 'Govern', icon: Scale      },
]

function PushToSpacesMenu({ trigger, align = 'end', side = 'bottom' }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side} className="w-56">
        <p className="px-2 pt-1.5 pb-1 text-[11px] uppercase tracking-wider text-muted-foreground">Push to</p>
        {PUSH_TARGETS_SOON.map(t => (
          <DropdownMenuItem key={t.label} disabled>
            <t.icon className="size-4 text-muted-foreground/60" />
            <span className="text-muted-foreground/70">{t.label}</span>
            <span className="ml-auto text-xs uppercase tracking-wide text-muted-foreground/60">Coming soon</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Insight Detail ───────────────────────────────────────────────────────────

function EthosSwirl({ className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-300 via-brand-300 to-cyan-300 opacity-60 blur-sm" />
      <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-pink-400 via-emerald-300 to-cyan-300 opacity-80" />
      <div className="absolute inset-3 rounded-full bg-gradient-to-bl from-pink-200 via-white to-cyan-200 opacity-90" />
    </div>
  )
}

const ASK_MOCK_ANSWERS = {
  'What risks should we consider?': {
    intro: 'The most material risks tied to this update:',
    bullets: [
      'Director liability exposure if accountability statements are not refreshed within the transition window.',
      'Audit findings — APRA has signalled supervisory reviews from Q3 2026.',
      'Reputational risk from enforcement actions where statements are deemed "generic or vague".',
    ],
  },
  'What actions should I take?': {
    intro: 'Suggested next steps, in order of priority:',
    bullets: [
      'Schedule an accountability statement review with each accountable person before 15 Sep 2026.',
      'Brief the board at its next meeting using the generated discussion prompts.',
      'Update internal policy templates to reflect the new "reasonable steps" expectations.',
    ],
  },
  'Generate board discussion questions': {
    intro: 'Here are three prompts for the next board meeting:',
    bullets: [
      'Are our accountability statements specific and measurable enough to meet ASIC\'s new benchmark?',
      'What evidence are we collecting to demonstrate active director oversight under the "reasonable steps" framework?',
      'How will we manage the 30-day notification requirement for any change in accountability arrangements?',
    ],
  },
  'Draft an alert for clients': {
    intro: 'Draft client alert (review before sending):',
    bullets: [
      'Subject: ASIC tightens FAR director accountability — action required before 15 Sep 2026',
      'Summary: ASIC has issued Information Sheet 284 with new accountability statement templates and a more prescriptive "reasonable steps" framework.',
      'Recommended next step: schedule a 30-minute review with our governance team to assess your current statements against the new benchmark.',
    ],
  },
  'Draft an internal brief': {
    intro: 'Draft internal brief for the team:',
    bullets: [
      'Trigger: ASIC Information Sheet 284, effective 15 March 2026.',
      'Scope: applies to all regulated entities under FAR — review accountability statements, reasonable-steps evidence, and notification workflows.',
      'Owner: General Counsel + Company Secretary. Deadline for internal action plan: end of next month.',
    ],
  },
}

function InsightAskPanel({ suggestions, onClose, greeting = 'How can I help with this insight?', placeholder = 'Ask something...' }) {
  const [messages, setMessages] = useState([])
  const hasConversation = messages.length > 0

  function askSuggestion(s) {
    const answer = ASK_MOCK_ANSWERS[s] ?? {
      intro: 'Here\'s what I found:',
      bullets: ['Drafting a response now — review the citations attached to this insight for the underlying detail.'],
    }
    setMessages(prev => [...prev, { role: 'user', text: s }, { role: 'assistant', loading: true }])
    setTimeout(() => {
      setMessages(prev => {
        const next = [...prev]
        const lastIdx = next.findLastIndex(m => m.role === 'assistant' && m.loading)
        if (lastIdx !== -1) next[lastIdx] = { role: 'assistant', loading: false, ...answer }
        return next
      })
    }, 1400)
  }

  return (
    <aside className="w-[400px] shrink-0 border-l border-border bg-white flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <AskEthosSparkle className="size-5" />
          <p className="text-sm font-semibold text-foreground">Ask Ethos</p>
        </div>
        <div className="flex items-center gap-1">
          {hasConversation && (
            <button
              onClick={() => setMessages([])}
              className="size-7 flex items-center justify-center rounded-md hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Start again"
              title="Start again"
            >
              <RotateCcw className="size-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="size-7 flex items-center justify-center rounded-md hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {hasConversation ? (
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {messages.map((m, i) => {
            if (m.role === 'user') {
              return (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#f1f5f9] text-foreground px-3 py-2 text-sm leading-relaxed">
                    {m.text}
                  </div>
                </div>
              )
            }
            if (m.loading) {
              return (
                <div key={i} className="space-y-1.5 py-0.5">
                  <Skeleton className="h-3 w-[200px]" />
                  <Skeleton className="h-3 w-[160px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              )
            }
            return (
              <div key={i} className="text-sm text-foreground leading-relaxed">
                {m.intro && <p className="mb-2">{m.intro}</p>}
                {m.bullets?.length > 0 && (
                  <ul className="space-y-1.5">
                    {m.bullets.map((b, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-brand-500" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <AskEthosSparkle className="size-14 mb-5" />
          <p className="text-base font-medium text-foreground mb-6">{greeting}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => askSuggestion(s)}
                className="flex items-center gap-1.5 text-sm text-foreground hover:text-brand-800 transition-colors px-3 py-1.5 rounded-full bg-[#F7F7F7] hover:bg-brand-50 text-left"
              >
                <AskEthosSparkle className="size-3.5 shrink-0" />
                <span>{s}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 pb-4 space-y-3 border-t border-border pt-4">
        <div className="relative">
          <Input
            placeholder={placeholder}
            className="pr-10 text-sm rounded-full bg-white border-border h-12"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 size-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowUp className="size-4" />
          </button>
        </div>
        <p className="text-xs text-brand-700/60 text-center leading-tight">
          AI can make mistakes. We recommend independent<br />review before acting on outputs.
        </p>
      </div>
    </aside>
  )
}

export function InsightDetail({ insight, onBack, variant = 'main' }) {
  const isV2 = variant === 'v2'
  const [draftTab, setDraftTab] = useState('client')
  const [completedActions, setCompletedActions] = useState(new Set())
  const [bioExpanded, setBioExpanded] = useState(false)
  const [askOpen, setAskOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [relevance, setRelevance] = useState(null)
  const [saved, setSaved] = useState(() => isInsightSaved(insight.id))
  const scrollRef = useRef(null)
  const [activeSection, setActiveSection] = useState(null)

  const sections = useMemo(() => [
    { id: 'media', label: 'Resources', show: insight.media?.videos?.length > 0 || insight.media?.pdfs?.length > 0 || insight.media?.articles?.length > 0 },
    { id: 'summary', label: 'Summary', show: !!insight.executive_summary },
    { id: 'changed', label: "What's changed", show: insight.what_has_changed?.length > 0 },
    { id: 'why', label: 'Why it matters', show: !!insight.why_it_matters },
    { id: 'risks', label: 'Risks', show: insight.risk_considerations?.length > 0 || !!insight.why_it_matters?.risk_level },
    { id: 'actions', label: 'Actions', show: insight.recommended_actions?.length > 0 },
    { id: 'linked', label: 'Linked content', show: insight.linked_content?.learning?.length > 0 || insight.linked_content?.policies?.length > 0 },
    { id: 'board', label: 'For your board', show: insight.board_discussion?.questions?.length > 0 && ['high', 'critical'].includes(insight.impact_level?.toLowerCase()) },
  ].filter(s => s.show), [insight])

  useEffect(() => {
    if (!sections.length || !scrollRef.current) return
    const root = scrollRef.current
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      { root, rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    )
    sections.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sections])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    markInsightRead(insight.id)
  }, [insight.id])

  const toggleAction = (idx) => {
    setCompletedActions(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const aiSuggestions = [
    ...(insight.risk_considerations?.length ? ['What risks should we consider?'] : []),
    ...(insight.recommended_actions?.length ? ['What actions should I take?'] : []),
    ...(insight.board_discussion ? ['Generate board discussion questions'] : []),
    'Draft an alert for clients',
    'Draft an internal brief',
  ]

  // Stable INS-YYYY-NNNN reference ID derived from the insight record id.
  const referenceId = `INS-2026-${(() => {
    const src = String(insight.id ?? '')
    let h = 0
    for (let i = 0; i < src.length; i++) h = (h * 31 + src.charCodeAt(i)) >>> 0
    return String((h % 9000) + 1000)
  })()}`

  return (
    <div className="flex flex-1 overflow-hidden bg-white">
      <div ref={scrollRef} className="flex-1 overflow-auto relative">

        <div className="max-w-[1000px] mx-auto px-6 pt-[60px]">

        {/* Back + reference ID + actions */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              aria-label="Back to insights"
              title="Back to insights"
              className="size-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors shrink-0"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground truncate">
              {referenceId}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setRelevance(r => r === 'not_relevant' ? null : 'not_relevant')}
                  aria-label="Not relevant"
                  className={cn(
                    'size-8 flex items-center justify-center rounded-full transition-colors',
                    relevance === 'not_relevant'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                  )}
                >
                  <ThumbsDown className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Not relevant</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShareOpen(true)}
                  aria-label="Share"
                  className="size-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <Send className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Share</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    toggleInsightSave(insight.id, {
                      title: insight.title,
                      source: insight.source,
                      contentType: insight.contentType,
                      readTime: insight.readTime,
                      time: insight.time,
                      excerpt: insight.excerpt,
                    })
                    setSaved(s => !s)
                  }}
                  aria-label={saved ? 'Saved' : 'Save'}
                  className={cn(
                    'size-8 flex items-center justify-center rounded-full transition-colors',
                    saved
                      ? 'bg-brand-50 text-brand-800'
                      : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                  )}
                >
                  {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>{saved ? 'Saved' : 'Save'}</TooltipContent>
            </Tooltip>
            <PushToSpacesMenu
              trigger={
                <button
                  type="button"
                  aria-label="Push to spaces"
                  title="Push to…"
                  className="size-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <Plus className="size-4" />
                </button>
              }
            />
          </div>
        </div>

        {/* Header */}
        <div className="space-y-5 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="rounded-md border-border text-muted-foreground font-medium">{insight.contentType}</Badge>
              {insight.impact_level && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="rounded-full font-mono uppercase tracking-wide text-[#151D2B] bg-[#FFE5E8] border-transparent px-2 py-0.5">
                      <span className="size-1.5 rounded-full bg-red-500" />
                      {insight.impact_level}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>{insight.impact_level.charAt(0).toUpperCase()}{insight.impact_level.slice(1)} Impact</TooltipContent>
                </Tooltip>
              )}
            </div>
            <h1 className="text-3xl font-medium leading-tight tracking-[-0.045em] text-foreground mb-3">{insight.title}</h1>
            <p className="text-base text-foreground/80 leading-relaxed">{insight.excerpt}</p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar className="size-6 shrink-0">
                {sourceFavicon(insight.source) && <AvatarImage src={sourceFavicon(insight.source)} alt={insight.source} />}
                <AvatarFallback className="text-[10px] bg-gray-200 text-gray-500">
                  {insight.source.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium text-foreground truncate">{insight.source}</p>
              <p className="text-xs text-muted-foreground truncate">
                · {insight.readTime} read{insight.jurisdiction && ` · ${insight.jurisdiction}`}
              </p>
            </div>
            <p className="text-xs text-muted-foreground shrink-0">{insight.time}</p>
          </div>

          {insight.contributor && (
            <div className="flex items-start gap-3 rounded-lg border border-brand-200 bg-brand-50/40 px-4 py-3">
              <Avatar className="size-10 shrink-0">
                <AvatarFallback className="text-sm bg-brand-100 text-brand-800 font-medium">
                  {insight.contributor.name.split(' ').filter(Boolean).map(n => n[0]).slice(-2).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wider text-brand-700 font-semibold">Curated by</p>
                <p className="text-sm font-semibold text-foreground">{insight.contributor.name}</p>
                <p className="text-xs text-muted-foreground">
                  {insight.contributor.role}
                  {insight.contributor.organisation && `, ${insight.contributor.organisation}`}
                </p>
                {insight.contributor.bio && (
                  <>
                    {bioExpanded && (
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{insight.contributor.bio}</p>
                    )}
                    <button
                      onClick={() => setBioExpanded(v => !v)}
                      className="mt-1 text-xs font-medium text-brand-800 hover:underline"
                    >
                      {bioExpanded ? 'Hide bio' : 'Read bio'}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        </div>

        <div className="max-w-[1000px] mx-auto px-6 pt-8 pb-8 flex gap-8">

          {sections.length > 0 && (
            <nav className="hidden xl:block w-[180px] shrink-0 sticky top-6 self-start">
              <ul className="space-y-0.5">
                {sections.map(s => {
                  const active = activeSection === s.id
                  return (
                    <li key={s.id}>
                      <button
                        onClick={() => scrollToSection(s.id)}
                        className={cn(
                          'w-full text-left text-sm py-1.5 px-3 rounded-md transition-colors',
                          active
                            ? 'bg-muted text-foreground font-medium'
                            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                        )}
                      >
                        {s.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
          )}

          <div className="flex-1 min-w-0">

        {/* Main content */}
        <div className="space-y-8">

            {/* Feature image */}
            {(insight.image || HERO.image) && (
              <div className="rounded-lg overflow-hidden">
                <img src={insight.image || HERO.image} alt="" className="w-full h-[320px] object-cover" />
              </div>
            )}

            {/* Media & Resources */}
            {(insight.media?.videos?.length > 0 || insight.media?.pdfs?.length > 0 || insight.media?.articles?.length > 0) && (
              <>
                <div id="media" className="flex flex-col gap-2 scroll-mt-6">
                  {insight.media.videos?.map((v, i) => (
                    <div key={`v-${i}`} className="flex items-center gap-3 rounded-md bg-muted/40 p-2.5 cursor-pointer group/video">
                      <div className="relative size-6 shrink-0 overflow-hidden rounded-md">
                        <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play className="size-2.5 text-white ml-0.5" />
                        </div>
                      </div>
                      <p className="flex-1 min-w-0 text-sm font-medium text-foreground truncate">{v.title}</p>
                      <p className="text-xs text-muted-foreground shrink-0">Video · {v.duration}</p>
                    </div>
                  ))}
                  {insight.media.pdfs?.map((p, i) => (
                    <a key={`p-${i}`} href={p.url} className="flex items-center gap-3 rounded-md bg-muted/40 p-2.5 cursor-pointer group/pdf">
                      <div className="size-6 rounded-md bg-red-100 flex items-center justify-center shrink-0">
                        <FileText className="size-4 text-red-700" strokeWidth={1.5} />
                      </div>
                      <p className="flex-1 min-w-0 text-sm font-medium text-foreground truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground shrink-0">PDF · {p.pages} pages</p>
                    </a>
                  ))}
                  {insight.media.articles?.map((a, i) => (
                    <a key={`a-${i}`} href={a.url} className="flex items-center gap-3 rounded-md bg-muted/40 p-2.5 cursor-pointer group/article">
                      <div className="size-6 rounded-md bg-violet-100 flex items-center justify-center shrink-0">
                        <Globe className="size-4 text-violet-700" strokeWidth={1.5} />
                      </div>
                      <p className="flex-1 min-w-0 text-sm font-medium text-foreground truncate">{a.title}</p>
                      <p className="text-xs text-muted-foreground shrink-0">{a.source}</p>
                    </a>
                  ))}
                </div>

                <Separator />
              </>
            )}

            {/* Executive Summary */}
            {insight.executive_summary && (
              <div id="summary" className="space-y-6 scroll-mt-6">
                <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground">Executive Summary</h2>
                <div>
                  {insight.executive_summary.split('\n\n').map((para, i) => (
                    <p key={i} className={cn('text-base text-gray-700 leading-relaxed', i > 0 && 'mt-3')}>{para}</p>
                  ))}
                </div>
                {insight.key_points?.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-base font-semibold text-foreground mb-2">Key Points</h3>
                    <ul className="space-y-1.5">
                      {insight.key_points.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-base text-gray-700">
                          <span className="text-brand-600 mt-0.5">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <Separator />

            {/* What Has Changed */}
            {insight.what_has_changed?.length > 0 && (
              <div id="changed" className="space-y-4 scroll-mt-6">
                <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground">What Has Changed</h2>
                <div>
                  {insight.what_has_changed.map((change, i) => (
                    <div key={i} className={`flex gap-5 py-5 ${i > 0 ? 'border-t border-border/60' : 'pt-0'}`}>
                      <span className="text-2xl font-medium text-muted-foreground/60 shrink-0 leading-none mt-0.5">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {change.status === 'In Force' ? (
                            <Badge className="rounded-full font-mono uppercase tracking-wide text-[#151D2B] bg-[#D5FFDA] border-transparent px-2 py-0.5">
                              <span className="size-1.5 rounded-full bg-emerald-500" />
                              {change.status}
                            </Badge>
                          ) : change.status === 'New' ? (
                            <Badge className="rounded-full font-mono uppercase tracking-wide text-[#151D2B] bg-[#E9D5FF] border-transparent px-2 py-0.5">
                              <span className="size-1.5 rounded-full bg-purple-500" />
                              {change.status}
                            </Badge>
                          ) : (
                            <Badge variant={CHANGE_STATUS_STYLE[change.status] || 'category'}>{change.status}</Badge>
                          )}
                          <Badge variant="outline" className="rounded-md border-border text-muted-foreground font-medium">{change.change_type}</Badge>
                        </div>
                        <p className="text-base font-medium text-foreground mb-1">{change.title}</p>
                        <p className="text-base text-gray-700 leading-relaxed">
                          {change.description}
                          {change.citation && (
                            <>
                              {' '}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-default align-middle">
                                    {shortenCitation(change.citation)}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent
                                  className="bg-white text-foreground border border-border shadow-md rounded-lg p-4 max-w-[360px]"
                                  arrowClassName="bg-white fill-white border-l border-t border-border"
                                >
                                  <p className="text-sm font-medium text-foreground">{change.citation}</p>
                                  <p className="mt-1 text-xs font-mono text-muted-foreground underline">{shortenCitation(change.citation)}</p>
                                </TooltipContent>
                              </Tooltip>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {insight.what_has_changed?.length > 0 && <Separator />}

            {/* Why It Matters */}
            {insight.why_it_matters && (
              <div id="why" className="space-y-8 scroll-mt-6">
                <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground">Why It Matters</h2>

                {insight.why_it_matters.org_impact?.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-2">Impact on Your Organisation</h3>
                    <ul className="space-y-1.5">
                      {insight.why_it_matters.org_impact.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-base text-gray-700">
                          <span className="text-brand-600 mt-0.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(() => {
                  const matters = insight.linked_content?.matters?.length
                    ? insight.linked_content.matters
                    : [
                        { title: 'Henderson Merger', type: 'M&A', status: 'Active' },
                        { title: 'Vanguard Regulatory', type: 'Regulatory', status: 'Active' },
                        { title: 'Apex Due Diligence', type: 'Compliance', status: 'In review' },
                      ]
                  return (
                    <div className="rounded-lg bg-muted/40 p-4 space-y-3">
                      <div className="space-y-0.5">
                        <h3 className="text-base font-semibold text-foreground">Matters to Review</h3>
                        <p className="text-sm text-muted-foreground">Open work in your organisation that may be affected by this update.</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {matters.map((m, i) => (
                          <div key={`m-${i}`} className="flex items-center gap-3 rounded-md bg-white border border-border p-2.5 cursor-pointer group/link">
                            <div className="size-6 rounded-md bg-indigo-100 flex items-center justify-center shrink-0">
                              <Briefcase className="size-4 text-indigo-900" strokeWidth={1.5} />
                            </div>
                            <p className="flex-1 min-w-0 text-sm font-medium text-foreground truncate">{m.title}</p>
                            <p className="text-xs text-muted-foreground shrink-0">{m.type}{m.status ? ` · ${m.status}` : ''}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}

              </div>
            )}

            {(insight.risk_considerations?.length > 0 || insight.why_it_matters?.risk_level) && (
              <>
                <Separator />
                <div id="risks" className="space-y-4 scroll-mt-6">
                  <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground">Risk Considerations</h2>
                  {insight.why_it_matters?.risk_level && (
                    <div className="rounded-lg border border-border bg-white p-4 space-y-2">
                      <Badge className="rounded-full font-mono uppercase tracking-wide text-[#151D2B] bg-[#FFF3B7] border-transparent px-2 py-0.5">
                        <span className="size-1.5 rounded-full bg-yellow-500" />
                        Risk: {insight.why_it_matters.risk_level}
                      </Badge>
                      <p className="text-sm text-foreground">{insight.why_it_matters.risk_explanation}</p>
                    </div>
                  )}
                  {insight.risk_considerations?.length > 0 && (
                    <ul className="space-y-2">
                      {insight.risk_considerations.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-base text-gray-700">
                          <span className="text-brand-600 mt-0.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}

            {/* Recommended Actions */}
            {insight.recommended_actions?.length > 0 && (
              <>
                <Separator />
                <div id="actions" className="space-y-4 scroll-mt-6">
                  <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground">Recommended Actions</h2>
                  <div>
                    {insight.recommended_actions.map((action, i) => {
                      const chip = ACTION_URGENCY_CHIP[action.urgency] ?? ACTION_URGENCY_CHIP.Optional
                      const done = completedActions.has(i)
                      return (
                        <div key={i} className={`flex gap-5 py-5 ${i > 0 ? 'border-t border-border/60' : 'pt-0'}`}>
                          <button
                            onClick={() => toggleAction(i)}
                            aria-label={done ? 'Mark not done' : 'Mark done'}
                            className="shrink-0 mt-1"
                          >
                            {done ? (
                              <CheckCircle2 className="size-5 text-green-600" />
                            ) : (
                              <div className="size-5 rounded-full border-2 border-border" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            {action.urgency === 'Urgent' && (
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={cn('rounded-full font-mono uppercase tracking-wide text-[#151D2B] border-transparent px-2 py-0.5', chip.bg)}>
                                  <span className={cn('size-1.5 rounded-full', chip.dot)} />
                                  {action.urgency}
                                </Badge>
                              </div>
                            )}
                            <p className={cn('text-base font-medium mb-1', done ? 'text-muted-foreground line-through' : 'text-foreground')}>{action.title}</p>
                            <p className="text-base text-gray-700 leading-relaxed">{action.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {/* AI-Generated Drafts */}
            {isV2 && (insight.ai_draft_client_alert || insight.ai_draft_internal_brief) && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground">AI-Generated Drafts</h2>
                  <p className="text-xs text-muted-foreground italic">AI-generated draft — review before sending</p>
                  <Tabs value={draftTab} onValueChange={setDraftTab}>
                    <TabsList className="h-9 bg-muted/50 p-0.5 rounded-lg gap-0.5">
                      {insight.ai_draft_client_alert && <TabsTrigger value="client" className="h-8 rounded-md text-sm px-4">Client Alert</TabsTrigger>}
                      {insight.ai_draft_internal_brief && <TabsTrigger value="internal" className="h-8 rounded-md text-sm px-4">Internal Brief</TabsTrigger>}
                    </TabsList>

                    {insight.ai_draft_client_alert && (
                      <TabsContent value="client" className="mt-4">
                        <div className="border border-border/60 rounded-lg p-5 bg-slate-50">
                          <pre className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">{insight.ai_draft_client_alert}</pre>
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/40">
                            <Button size="sm"><Send className="size-3.5 mr-1.5" /> Send Alert</Button>
                            <Button variant="outline" size="sm"><Copy className="size-3.5 mr-1.5" /> Copy</Button>
                          </div>
                        </div>
                      </TabsContent>
                    )}

                    {insight.ai_draft_internal_brief && (
                      <TabsContent value="internal" className="mt-4">
                        <div className="border border-border/60 rounded-lg p-5 bg-slate-50">
                          <pre className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">{insight.ai_draft_internal_brief}</pre>
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/40">
                            <Button size="sm"><Send className="size-3.5 mr-1.5" /> Send Brief</Button>
                            <Button variant="outline" size="sm"><Copy className="size-3.5 mr-1.5" /> Copy</Button>
                          </div>
                        </div>
                      </TabsContent>
                    )}
                  </Tabs>
                </div>
              </>
            )}

            {/* Upcoming Events */}
            {isV2 && insight.upcoming_events?.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground">Upcoming Events</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {insight.upcoming_events.map((event, i) => {
                      const d = new Date(event.date)
                      const month = d.toLocaleDateString('en-AU', { month: 'short' }).toUpperCase()
                      const day = d.getDate()
                      return (
                        <div key={i} className="border border-border/60 rounded-lg p-4 bg-white flex items-start gap-3">
                          <div className="bg-brand-50 text-brand-800 rounded-md px-3 py-2 text-center shrink-0 border border-brand-200">
                            <div className="text-xs font-semibold uppercase tracking-wider">{month}</div>
                            <div className="text-xl font-semibold leading-none mt-0.5">{day}</div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground leading-snug">{event.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {event.provider} · {event.duration} · {event.cpd_points} CPD
                            </p>
                            <Button size="sm" variant="outline" className="mt-3 h-7 text-xs">Register</Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          {/* Linked Content */}
          {(insight.linked_content?.learning?.length > 0 || insight.linked_content?.policies?.length > 0) && (
            <>
              <Separator />
              <div id="linked" className="space-y-3 scroll-mt-6">
                <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground">Linked Content</h2>
                <div className="flex flex-col gap-2">
                  {insight.linked_content.learning?.map((item, i) => (
                    <div key={`l-${i}`} className="flex items-center gap-3 rounded-md bg-muted/40 p-2.5 cursor-pointer group/link">
                      <div className="size-6 rounded-md bg-amber-100 flex items-center justify-center shrink-0">
                        <GraduationCap className="size-4 text-amber-900" strokeWidth={1.5} />
                      </div>
                      <p className="flex-1 min-w-0 text-sm font-medium text-foreground truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground shrink-0">{item.type}{item.time ? ` · ${item.time}` : ''}</p>
                    </div>
                  ))}
                  {insight.linked_content.policies?.map((item, i) => (
                    <div key={`p-${i}`} className="flex items-center gap-3 rounded-md bg-muted/40 p-2.5 cursor-pointer group/link">
                      <div className="size-6 rounded-md bg-cyan-100 flex items-center justify-center shrink-0">
                        <FileText className="size-4 text-cyan-900" strokeWidth={1.5} />
                      </div>
                      <p className="flex-1 min-w-0 text-sm font-medium text-foreground truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground shrink-0">{item.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {insight.board_discussion?.questions?.length > 0 && ['high', 'critical'].includes(insight.impact_level?.toLowerCase()) && (
            <>
              <Separator />
              <div id="board" className="rounded-lg bg-muted/40 p-5 space-y-4 scroll-mt-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-medium tracking-[-0.02em] text-foreground">Discussion Prompt</h2>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="shrink-0"
                    onClick={() => {
                      const text = insight.board_discussion.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')
                      navigator.clipboard?.writeText(text)
                    }}
                  >
                    <Copy className="size-3.5 mr-1.5" /> Copy
                  </Button>
                </div>
                <ol className="space-y-2 list-decimal list-inside marker:text-muted-foreground marker:font-semibold">
                  {insight.board_discussion.questions.map((q, i) => (
                    <li key={i} className="text-sm text-foreground/85 leading-relaxed pl-1">{q}</li>
                  ))}
                </ol>
              </div>
            </>
          )}
          </div>
          <InsightsFooter bare />
        </div>

        </div>
      </div>

      {askOpen && (
        <InsightAskPanel suggestions={aiSuggestions} onClose={() => setAskOpen(false)} />
      )}
      <ShareInsightDialog open={shareOpen} onOpenChange={setShareOpen} insight={insight} />
    </div>
  )
}

// ─── Share insight dialog ────────────────────────────────────────────────────

const SHARE_TARGETS = [
  { id: 'teams',   label: 'Teams',   domain: 'teams.microsoft.com' },
  { id: 'slack',   label: 'Slack',   domain: 'slack.com'           },
  { id: 'outlook', label: 'Outlook', domain: 'outlook.office.com'  },
]

function ShareInsightDialog({ open, onOpenChange, insight }) {
  const [copied, setCopied] = useState(false)
  // In a real build this would be a canonical insight URL; the prototype
  // shares the current location so the demo feels real.
  const url = typeof window !== 'undefined' ? window.location.href : ''

  function handleCopy() {
    navigator.clipboard?.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function handleShareTo(target) {
    // Stub — would open a deeplink to the chosen workspace.
    console.log('[insights] share to', target, insight?.id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 bg-white">
        <DialogTitle className="text-xl font-semibold">Share</DialogTitle>
        <DialogDescription className="sr-only">Copy the insight link or share to a connected workspace.</DialogDescription>

        <div className="rounded-lg bg-muted/40 p-4 space-y-2">
          <label className="text-sm font-medium text-foreground">Copy link</label>
          <div className="flex items-center gap-2">
            <Input value={url} readOnly className="bg-white text-sm" />
            <Button size="sm" variant="ghost" onClick={handleCopy} className="gap-1 shrink-0 text-foreground/70 hover:text-foreground">
              <Copy className="size-3.5" />
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Share to</p>
          <div className="grid grid-cols-3 gap-3">
            {SHARE_TARGETS.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleShareTo(t.id)}
                className="flex flex-col items-center gap-2 rounded-lg p-3 hover:bg-muted/40 transition-colors"
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-white border border-border shadow-xs">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${t.domain}&sz=128`}
                    alt=""
                    className="size-7"
                  />
                </span>
                <span className="text-xs text-foreground">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Featured card with hover actions ────────────────────────────────────────

function FeaturedCard({ item, image, onClick, onRelevant, onNotRelevant, relevance }) {
  const [saved, handleToggleSave] = useSaveToggle(item)
  return (
    <div onClick={onClick} className="rounded-lg border border-border overflow-hidden bg-white group/news cursor-pointer hover:shadow-md transition-shadow flex flex-col">
      <div className="relative h-32 overflow-hidden shrink-0">
        <img src={image} alt="" className="w-full h-full object-cover group-hover/news:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <Badge variant="outline" className="rounded-md border-border text-muted-foreground font-normal mb-2 w-fit">{item.tags?.[0] ?? item.contentType}</Badge>
        <p className="text-base font-medium tracking-[-0.03em] text-foreground leading-snug group-hover/news:text-brand-800 transition-colors flex-1">{item.title}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 text-xs text-muted-foreground">
            {sourceFavicon(item.source) && (
              <img src={sourceFavicon(item.source)} alt="" className="size-3.5 rounded-sm shrink-0" />
            )}
            <span className="truncate">{item.source} · {item.time}</span>
          </div>
          <NewsCardActions
            item={item}
            saved={saved}
            onToggleSave={handleToggleSave}
            onRelevant={onRelevant}
            onNotRelevant={onNotRelevant}
            relevance={relevance}
          />
        </div>
      </div>
    </div>
  )
}

// ─── News cards (Perplexity-style layout) ────────────────────────────────────

function useSaveToggle(item) {
  const [saved, setSaved] = useState(() => isInsightSaved(item.id))
  function toggle(e) {
    e.stopPropagation()
    const next = toggleInsightSave(item.id, {
      title: item.title,
      contentType: item.contentType,
      source: item.source,
      excerpt: item.excerpt,
      time: item.time,
      readTime: item.readTime,
    })
    setSaved(next)
  }
  return [saved, toggle]
}

function HeroCard({ item, image, onClick, onRelevant, onNotRelevant, relevance }) {
  const [saved, handleToggleSave] = useSaveToggle(item)
  return (
    <div onClick={onClick} className="rounded-lg border border-border overflow-hidden bg-white group/hero cursor-pointer hover:shadow-md transition-shadow relative">
      <div className="relative h-[340px] overflow-hidden">
        <img src={image} alt="" className="w-full h-full object-cover group-hover/hero:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover/hero:opacity-100 transition-opacity text-white">
          <button
            onClick={handleToggleSave}
            className="p-1.5 rounded-md transition-colors hover:bg-white/15"
            title={saved ? 'Saved' : 'Save'}
          >
            {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={e => e.stopPropagation()}
                className="p-1.5 rounded-md transition-colors hover:bg-white/15"
                title="More"
              >
                <MoreHorizontal className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => onRelevant(item.id)}>
                <ThumbsUp className="size-3.5" />
                {relevance === 'relevant' ? 'Liked' : 'Like'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNotRelevant(item.id)}>
                <ThumbsDown className="size-3.5" />
                {relevance === 'not_relevant' ? 'Disliked' : 'Dislike'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Send className="size-3.5" />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="rounded-md border-white text-white bg-transparent">{item.tags?.[0] ?? item.contentType}</Badge>
            <span className="text-xs text-white/80">{item.readTime}</span>
          </div>
          <h2 className="text-2xl font-medium tracking-[-0.03em] leading-tight text-white mb-2">{item.title}</h2>
          <p className="text-sm text-white/70">{item.source} · {item.time}</p>
        </div>
      </div>
    </div>
  )
}

function BriefingRow({ item, onSelect, onRelevant, onNotRelevant, relevance, showSeparator, rank }) {
  const [saved, handleToggleSave] = useSaveToggle(item)
  return (
    <div onClick={() => onSelect(item)} className={`flex items-start gap-5 py-4 cursor-pointer group/news ${showSeparator ? 'border-t border-border/40' : ''}`}>
      {rank != null && (
        <span className="text-2xl font-medium text-muted-foreground/60 shrink-0 leading-none mt-1">{rank}</span>
      )}
      <div className="flex-1 min-w-0">
        <Badge variant="outline" className="rounded-md border-border text-muted-foreground font-normal mb-2">{item.tags?.[0] ?? item.contentType}</Badge>
        <p className="text-base font-medium tracking-[-0.03em] text-foreground leading-snug group-hover/news:text-brand-800 transition-colors">{item.title}</p>
        <p className="text-sm text-foreground/80 mt-1 leading-relaxed line-clamp-2">{item.excerpt}</p>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
          {sourceFavicon(item.source) && (
            <img src={sourceFavicon(item.source)} alt="" className="size-3.5 rounded-sm" />
          )}
          <span>{item.source} · {item.time}</span>
        </div>
      </div>
      <NewsCardActions
        item={item}
        saved={saved}
        onToggleSave={handleToggleSave}
        onRelevant={onRelevant}
        onNotRelevant={onNotRelevant}
        relevance={relevance}
      />
    </div>
  )
}

function NewsCardActions({ item, saved, onToggleSave, onRelevant, onNotRelevant, relevance }) {
  return (
    <div className="flex items-center gap-1 opacity-0 group-hover/news:opacity-100 transition-opacity">
      <button
        onClick={onToggleSave}
        className={`p-1.5 rounded-md transition-colors ${saved ? 'text-brand-800' : 'text-muted-foreground hover:text-foreground'}`}
        title={saved ? 'Saved' : 'Save'}
      >
        {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={e => e.stopPropagation()}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            title="More"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
          <DropdownMenuItem onClick={() => onRelevant(item.id)}>
            <ThumbsUp className="size-3.5" />
            {relevance === 'relevant' ? 'Liked' : 'Like'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNotRelevant(item.id)}>
            <ThumbsDown className="size-3.5" />
            {relevance === 'not_relevant' ? 'Disliked' : 'Dislike'}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Send className="size-3.5" />
            Share
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function NewsLargeCard({ item, image, imagePosition = 'left', onClick, onRelevant, onNotRelevant, relevance }) {
  const [saved, handleToggleSave] = useSaveToggle(item)
  const imageBlock = (
    <div className="relative w-[40%] shrink-0 overflow-hidden rounded-lg">
      <img src={image} alt="" className="w-full h-full object-cover aspect-[4/3] group-hover/news:scale-105 transition-transform duration-500" />
    </div>
  )
  const textBlock = (
    <div className="flex-1 flex flex-col min-w-0">
      <Badge variant="outline" className="rounded-md border-border text-muted-foreground font-normal mb-2 w-fit">{item.tags?.[0] ?? item.contentType}</Badge>
      <h3 className="text-2xl font-medium tracking-[-0.03em] text-foreground leading-tight group-hover/news:text-brand-800 transition-colors">{item.title}</h3>
      <p className="mt-3 text-xs text-muted-foreground">
        {item.time}
      </p>
      <p className="mt-3 text-sm text-foreground/80 leading-relaxed line-clamp-3">{item.excerpt}</p>
      <div className="mt-auto pt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0 text-xs text-muted-foreground">
          {sourceFavicon(item.source) && (
            <img src={sourceFavicon(item.source)} alt="" className="size-3.5 rounded-sm shrink-0" />
          )}
          <span className="truncate">{item.source} · {item.readTime}</span>
        </div>
        <NewsCardActions
          item={item}
          saved={saved}
          onToggleSave={handleToggleSave}
          onRelevant={onRelevant}
          onNotRelevant={onNotRelevant}
          relevance={relevance}
        />
      </div>
    </div>
  )
  return (
    <div onClick={onClick} className="flex gap-6 cursor-pointer group/news">
      {imagePosition === 'left' ? <>{imageBlock}{textBlock}</> : <>{textBlock}{imageBlock}</>}
    </div>
  )
}

function NewsSmallCard({ item, image, onClick, onRelevant, onNotRelevant, relevance }) {
  const [saved, handleToggleSave] = useSaveToggle(item)
  return (
    <div onClick={onClick} className="rounded-lg border border-border overflow-hidden bg-white cursor-pointer group/news hover:shadow-md transition-shadow flex flex-col">
      <div className="relative h-36 overflow-hidden shrink-0">
        <img src={image} alt="" className="w-full h-full object-cover group-hover/news:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <Badge variant="outline" className="rounded-md border-border text-muted-foreground font-normal mb-2 w-fit">{item.tags?.[0] ?? item.contentType}</Badge>
        <p className="text-base font-medium tracking-[-0.03em] text-foreground leading-snug group-hover/news:text-brand-800 transition-colors flex-1">{item.title}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 text-xs text-muted-foreground">
            {sourceFavicon(item.source) && (
              <img src={sourceFavicon(item.source)} alt="" className="size-3.5 rounded-sm shrink-0" />
            )}
            <span className="truncate">{item.source} · {item.time}</span>
          </div>
          <NewsCardActions
            item={item}
            saved={saved}
            onToggleSave={handleToggleSave}
            onRelevant={onRelevant}
            onNotRelevant={onNotRelevant}
            relevance={relevance}
          />
        </div>
      </div>
    </div>
  )
}

function NewsPerplexityLayout({ items, onSelect, onRelevant, onNotRelevant, relevance }) {
  if (!items.length) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        No news matches your current filters.
      </div>
    )
  }
  // Only items with full article data are clickable into the detail view.
  const handleSelect = (item) => { if (item.executive_summary) onSelect(item) }
  // Group items into chunks of 5 → [large-left, large-right, small, small, small]
  const groups = []
  for (let i = 0; i < items.length; i += 5) groups.push(items.slice(i, i + 5))

  return (
    <div className="space-y-10">
      {groups.map((group, gIdx) => (
        <div key={gIdx} className="space-y-8">
          {group[0] && (
            <NewsLargeCard
              item={group[0]}
              image={NEWS_DEMO_IMAGES[(gIdx * 5) % NEWS_DEMO_IMAGES.length]}
              imagePosition="left"
              onClick={() => handleSelect(group[0])}
              onRelevant={onRelevant}
              onNotRelevant={onNotRelevant}
              relevance={relevance[group[0].id]}
            />
          )}
          {group[1] && (
            <>
              <Separator />
              <NewsLargeCard
                item={group[1]}
                image={NEWS_DEMO_IMAGES[(gIdx * 5 + 1) % NEWS_DEMO_IMAGES.length]}
                imagePosition="right"
                onClick={() => handleSelect(group[1])}
                onRelevant={onRelevant}
                onNotRelevant={onNotRelevant}
                relevance={relevance[group[1].id]}
              />
            </>
          )}
          {group.length > 2 && (
            <div className="grid grid-cols-3 gap-4">
              {group.slice(2, 5).map((item, idx) => (
                <NewsSmallCard
                  key={item.id}
                  item={item}
                  image={NEWS_DEMO_IMAGES[(gIdx * 5 + 2 + idx) % NEWS_DEMO_IMAGES.length]}
                  onClick={() => handleSelect(item)}
                  onRelevant={onRelevant}
                  onNotRelevant={onNotRelevant}
                  relevance={relevance[item.id]}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Podcasts (Apple Podcasts-style categorised sections) ────────────────────

function PodcastEpisodeRow({ episode, showSeparator }) {
  return (
    <div className={`flex gap-5 py-5 group/ep cursor-pointer ${showSeparator ? 'border-t border-border/60' : ''}`}>
      <div className="relative size-[120px] shrink-0 overflow-hidden rounded-md">
        <img src={episode.image} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/ep:opacity-100 transition-opacity flex items-center justify-center">
          <div className="size-9 rounded-full bg-white/95 flex items-center justify-center">
            <Play className="size-3.5 text-brand-800 ml-0.5" />
          </div>
        </div>
      </div>
      <div className="flex gap-5 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium tracking-[-0.02em] text-foreground leading-snug group-hover/ep:text-brand-800 transition-colors">{episode.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">{episode.summary}</p>
          <p className="mt-3 text-xs text-muted-foreground">{episode.date} · {episode.duration}</p>
        </div>
      </div>
    </div>
  )
}

function PodcastsLayout({ sections }) {
  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <div key={section.title} className="space-y-1">
          <h2 className="text-base font-semibold text-foreground mb-2">{section.title}</h2>
          <div>
            {section.episodes.map((episode, idx) => (
              <PodcastEpisodeRow
                key={episode.id}
                episode={episode}
                showSeparator={idx > 0}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Webinars (event-style categorised sections) ─────────────────────────────

function WebinarEventRow({ event, showSeparator }) {
  const isPast = event.status === 'On-demand'
  return (
    <div className={`flex gap-5 py-5 group/event cursor-pointer ${showSeparator ? 'border-t border-border/60' : ''}`}>
      <div className="relative w-[180px] aspect-[16/10] shrink-0 overflow-hidden rounded-md">
        <img src={event.image} alt="" className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 flex flex-col items-center justify-center bg-white/95 rounded px-2 py-1 min-w-[42px] shadow-sm">
          <span className="text-[9px] uppercase tracking-wider font-semibold text-red-600 leading-none">{event.month}</span>
          <span className="text-base font-semibold text-foreground leading-tight">{event.day}</span>
        </div>
        {isPast && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="size-10 rounded-full bg-white/95 flex items-center justify-center">
              <Play className="size-4 text-brand-800 ml-0.5" />
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground font-medium">
          <span>{event.weekday}, {event.day} {event.month}</span>
          <span>·</span>
          <span>{event.time}</span>
        </div>
        <h3 className="mt-1.5 text-base font-medium tracking-[-0.02em] text-foreground leading-snug group-hover/event:text-brand-800 transition-colors">{event.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{event.host}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {event.duration}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="size-3.5" />
            {event.location}
          </span>
          {event.cpd != null && (
            <span className="flex items-center gap-1">
              <GraduationCap className="size-3.5" />
              {event.cpd} CPD pt{event.cpd === 1 ? '' : 's'}
            </span>
          )}
        </div>
        <div className="mt-3">
          {event.status === 'Registered' ? (
            <Button
              size="sm"
              onClick={e => e.stopPropagation()}
              className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
            >
              <CheckCircle2 className="size-3.5" />
              Registered
            </Button>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              onClick={e => e.stopPropagation()}
            >
              {event.status === 'Waitlist' ? 'Join waitlist' : event.status === 'On-demand' ? 'Watch' : 'Register'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function WebinarsLayout({ sections }) {
  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <div key={section.title} className="space-y-1">
          <button className="flex items-center gap-1 group/title mb-2">
            <h2 className="text-base font-semibold text-foreground">{section.title}</h2>
            <ChevronRight className="size-4 text-foreground transition-transform group-hover/title:translate-x-0.5" />
          </button>
          <div>
            {section.events.map((event, idx) => (
              <WebinarEventRow
                key={event.id}
                event={event}
                showSeparator={idx > 0}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Community Voices carousel ───────────────────────────────────────────────

function CommunityCarousel({ items }) {
  const [index, setIndex] = useState(0)
  if (!items.length) return null
  const item = items[index]
  const total = items.length
  const goPrev = (e) => { e.stopPropagation(); setIndex((index - 1 + total) % total) }
  const goNext = (e) => { e.stopPropagation(); setIndex((index + 1) % total) }
  return (
    <div className="rounded-lg border border-border/40 bg-muted/20 p-4">
      <Quote className="size-4 text-brand-300" />
      <p className="mt-2 text-base text-foreground leading-relaxed line-clamp-4 min-h-[80px]">&ldquo;{item.quote}&rdquo;</p>
      <div className="mt-1">
        <p className="text-sm font-medium text-foreground">{item.author}</p>
        <p className="text-xs text-muted-foreground">{item.role}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIndex(i) }}
              className={`size-1.5 rounded-full transition-colors ${i === index ? 'bg-foreground' : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'}`}
              aria-label={`Voice ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={goPrev}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={goNext}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InsightsV3Page() {
  const navigate = useNavigate()
  const savedCount = getSavedInsights().length
  const [activeTab, setActiveTab] = useState('For You')
  const [searchQuery, setSearchQuery] = useState('')
  const [relevance, setRelevance] = useState({})
  const setSelectedInsight = (item) => {
    if (item?.id) navigate(`/insights/${item.id}`)
  }
  const [digestEnabled, setDigestEnabled] = useState(true)
  const [pageAskOpen, setPageAskOpen] = useState(false)

  // Cross-feed prompts for the side panel on the overview.
  const pageAiSuggestions = [
    'Summarise across focus areas',
    'What are my emerging risks?',
    'Upcoming deadlines',
    'Major changes this week',
    'What needs board attention?',
    'Suggest reading for the week',
  ]

  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const filteredBriefing = BRIEFING.filter(item => {
    if (activeTab !== 'For You' && activeTab !== 'Community' && item.contentType !== activeTab) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return item.title.toLowerCase().includes(q) || item.excerpt.toLowerCase().includes(q)
    }
    return true
  })

  function handleNotRelevant(id) {
    setRelevance(prev => ({ ...prev, [id]: 'not_relevant' }))
  }

  function handleRelevant(id) {
    setRelevance(prev => ({ ...prev, [id]: 'relevant' }))
  }

  function handleUndoRelevance(id) {
    setRelevance(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  // Split briefing: hero + 3 featured, rest for feed
  const featuredItems = filteredBriefing.slice(0, 4)
  const feedItems = filteredBriefing.slice(4)


  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto bg-white">
        <div className="max-w-[1200px] mx-auto px-8 pt-[52px] pb-12">

          {/* ── Header ── */}
          <div className="space-y-4 mb-6">
            <div>
              <h1 className="text-[32px] font-normal tracking-[-0.03em] text-foreground">Insights</h1>
              <p className="text-sm text-muted-foreground mt-[9px]">{tenant.greeting}. {t.greetingSuffix ?? "Here's what matters today across your practice."}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search insights..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigate(`/insights/search?q=${encodeURIComponent(searchQuery.trim())}`)
                    }
                  }}
                  className="pl-9"
                />
              </div>
              <div className="ml-auto flex items-center gap-3 shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Bell className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">Weekly insight digest</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Receive a curated email summary every Monday.</p>
                      </div>
                      <Switch
                        checked={digestEnabled}
                        onCheckedChange={setDigestEnabled}
                        onClick={e => e.stopPropagation()}
                      />
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/insights/saved')}
                  className="shrink-0 gap-1.5"
                >
                  <Bookmark className="size-4" />
                  Saved{savedCount > 0 && ` (${savedCount})`}
                </Button>
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex items-center gap-1 border-b border-border mb-8">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => tab !== 'Community' && setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                  tab === activeTab
                    ? 'text-brand-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-800'
                    : tab === 'Community'
                    ? 'text-muted-foreground/50 cursor-default'
                    : 'text-muted-foreground hover:text-foreground cursor-pointer'
                }`}
              >
                {tab}
                {tab === 'Community' && (
                  <span className="ml-1.5 text-xs text-muted-foreground/40">Soon</span>
                )}
              </button>
            ))}
          </div>

          {/* ── Two-Column Layout ── */}
          <div className="flex gap-8">

            {/* ── Main Content ── */}
            <div className="flex-1 min-w-0 space-y-10">

              {/* Featured — hero full width, 2 smaller below */}
              {activeTab !== 'News' && activeTab !== 'Regulatory' && activeTab !== 'Articles' && activeTab !== 'Podcasts' && activeTab !== 'Webinars' && featuredItems.length > 0 && (
                <div className="space-y-3">
                  {/* Large hero card — full width */}
                  {featuredItems[0] && (
                    <HeroCard
                      item={featuredItems[0]}
                      image={HERO.image}
                      onClick={() => setSelectedInsight(featuredItems[0])}
                      onRelevant={handleRelevant}
                      onNotRelevant={handleNotRelevant}
                      relevance={relevance[featuredItems[0].id]}
                    />
                  )}
                  {/* Three smaller cards side-by-side */}
                  {featuredItems.length > 1 && (
                    <div className="grid grid-cols-3 gap-3">
                      {featuredItems.slice(1, 4).map((item, idx) => (
                        <FeaturedCard
                          key={item.id}
                          item={item}
                          image={FEATURED_DEMO_IMAGES[idx % FEATURED_DEMO_IMAGES.length]}
                          onClick={() => setSelectedInsight(item)}
                          onRelevant={handleRelevant}
                          onNotRelevant={handleNotRelevant}
                          relevance={relevance[item.id]}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* News / Regulatory / Articles tabs — Perplexity-style alternating layout */}
              {(activeTab === 'News' || activeTab === 'Regulatory' || activeTab === 'Articles') && (
                <NewsPerplexityLayout
                  items={activeTab === 'News' ? [...filteredBriefing, ...NEWS_DEMO_TILES] : filteredBriefing}
                  onSelect={setSelectedInsight}
                  onRelevant={handleRelevant}
                  onNotRelevant={handleNotRelevant}
                  relevance={relevance}
                />
              )}

              {/* Podcasts tab — Apple Podcasts-style categorised sections */}
              {activeTab === 'Podcasts' && (
                <PodcastsLayout sections={PODCAST_SECTIONS} />
              )}

              {/* Webinars tab — event-style categorised sections */}
              {activeTab === 'Webinars' && (
                <WebinarsLayout sections={WEBINAR_SECTIONS} />
              )}

              {activeTab !== 'News' && activeTab !== 'Regulatory' && activeTab !== 'Podcasts' && activeTab !== 'Webinars' && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-foreground">Community Voices</h2>
                  <CommunityCarousel items={COMMUNITY.slice(0, 5)} />
                </div>
              )}

              {activeTab !== 'News' && activeTab !== 'Regulatory' && activeTab !== 'Podcasts' && activeTab !== 'Webinars' && <Separator />}

              {/* Briefing Feed */}
              {activeTab !== 'News' && activeTab !== 'Regulatory' && activeTab !== 'Podcasts' && activeTab !== 'Webinars' && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground">Latest Insights</h2>

                <div>
                  {feedItems.map((item, idx) => {
                    if (relevance[item.id] === 'not_relevant') {
                      return (
                        <div key={item.id} className={`flex items-center justify-between gap-3 py-4 ${idx > 0 ? 'border-t border-border/40' : ''}`}>
                          <p className="text-sm text-muted-foreground italic">Got it — we&apos;ll show you less of this.</p>
                          <button
                            onClick={() => handleUndoRelevance(item.id)}
                            className="flex items-center gap-1.5 text-xs font-medium text-brand-800 hover:underline"
                          >
                            <RotateCcw className="size-3.5" /> Undo
                          </button>
                        </div>
                      )
                    }
                    return (
                      <BriefingRow
                        key={item.id}
                        item={item}
                        onSelect={setSelectedInsight}
                        onRelevant={handleRelevant}
                        onNotRelevant={handleNotRelevant}
                        relevance={relevance[item.id]}
                        showSeparator={idx > 0}
                        rank={idx + 1}
                      />
                    )
                  })}
                  {filteredBriefing.length === 0 && (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No insights match your current filters.
                    </div>
                  )}
                </div>
              </div>
              )}

              {activeTab !== 'News' && activeTab !== 'Regulatory' && activeTab !== 'Podcasts' && activeTab !== 'Webinars' && (
              <>
              <Separator />

              {/* Listen & Learn — 2-column grid, podcast/webinar row cards */}
              <div className="space-y-4">
                <button className="flex items-center gap-1 group/title">
                  <h2 className="text-base font-semibold text-foreground">Listen & Learn</h2>
                  <ChevronRight className="size-4 text-foreground transition-transform group-hover/title:translate-x-0.5" />
                </button>
                <div className="grid grid-cols-2 gap-x-8">
                  {[LISTEN.slice(0, Math.ceil(LISTEN.length / 2)), LISTEN.slice(Math.ceil(LISTEN.length / 2))].map((column, colIdx) => (
                    <div key={colIdx}>
                      {column.map((item, idx) => (
                        <div key={`${colIdx}-${idx}`} className={`flex gap-4 py-4 cursor-pointer group/ll items-center ${idx > 0 ? 'border-t border-border/60' : ''}`}>
                          <div className="relative size-16 shrink-0 overflow-hidden rounded-md">
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/ll:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="size-7 rounded-full bg-white/95 flex items-center justify-center">
                                <Play className="size-3 text-brand-800 ml-0.5" />
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground font-medium">
                              <span>{item.date}</span>
                              {item.type === 'Webinar' && item.upcoming && <><span>·</span><span className="text-brand-800">Upcoming</span></>}
                            </div>
                            <p className="mt-1 text-sm font-medium tracking-[-0.01em] text-foreground leading-snug truncate group-hover/ll:text-brand-800 transition-colors">{item.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground truncate">{item.speaker} · {item.duration}{item.registrations ? ` · ${item.registrations} registered` : ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              </>
              )}

              {/* Footer */}
              <div className="border-t border-border pt-4 pb-8">
                <p className="text-xs text-muted-foreground text-center">
                  ETHOS Insights · Curated for your practice · {today} · AI-assisted curation. Verify before acting on regulatory content. ·{' '}
                  <button className="text-brand-800 hover:underline">Sources</button>
                </p>
              </div>
            </div>
          </div>

          <div className="sticky bottom-6 z-40 w-fit mx-auto">
            <div className="flex items-center gap-1 rounded-full bg-white border border-border shadow-lg p-1.5">
              <button
                onClick={() => setPageAskOpen(o => !o)}
                aria-label="Ask Ethos"
                className="flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
              >
                <AskEthosSparkle className="size-4" />
                Ask Ethos
              </button>
            </div>
          </div>
        </div>

      </div>

      {pageAskOpen && (
        <InsightAskPanel
          suggestions={pageAiSuggestions}
          onClose={() => setPageAskOpen(false)}
          greeting="Explore insights in depth"
        />
      )}
    </div>
  )
}
