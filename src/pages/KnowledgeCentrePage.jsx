import { useState, useMemo, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import DutiesHandbook from '@/components/DutiesHandbook'
import Feature from '@/components/Feature'
import {
  BookOpen,
  ArrowUpRight,
  Brain,
  Landmark,
  ShieldAlert,
  GraduationCap,
  Search,
  FileText,
  Shield,
  Users,
  Sparkles,
  X,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  PenLine,
  Globe,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  SlidersHorizontal,
  Pin,
  Scale,
  ExternalLink,
  Briefcase,
} from 'lucide-react'

function FilterModal({ label, active, children, onReset }) {
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
              <button onClick={() => onReset?.()} className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors">
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

// ─── Knowledge Centre Items (structured content) ────────────────────────────

const KNOWLEDGE_ITEMS = [
  {
    id: 'kc-duties',
    type: 'handbook',
    icon: BookOpen,
    heroImage: '/images/duties-handbook-hero.png',
    title: 'Duties Handbook',
    description: 'Comprehensive reference covering director and officer duties under the Corporations Act, including practical guidance and recent case law.',
    parts: 15,
    estimatedTime: '3 hrs',
    updated: 'Updated today',
    action: 'duties',
    cpdPoints: 6,
    completion: 'in-progress',
    progress: 40,
    skills: ['Governance & Board Effectiveness', 'Ethics & Professional Responsibility'],
    goals: ['Governance Mastery'],
    source: 'Ethika',
  },
  {
    id: 'kc-ai-gov',
    type: 'framework',
    icon: Brain,
    heroImage: '/images/ai-governance-hero.png',
    title: 'AI Governance Framework',
    description: 'Guidelines for responsible AI adoption, covering risk assessment, ethical use policies, and board oversight of AI-driven decision making.',
    parts: 8,
    estimatedTime: '2 hrs',
    updated: 'Updated 2 days ago',
    action: null,
    completion: 'not-started',
    cpdPoints: 4,
    skills: ['Risk & Compliance', 'Governance & Board Effectiveness'],
    goals: ['Digital Transformation'],
    source: 'Ethika',
  },
  {
    id: 'kc-banking',
    type: 'course',
    icon: Landmark,
    heroImage: '/images/banking-regulation-hero.png',
    title: 'Banking Regulation Course',
    description: 'End-to-end overview of APRA and ASIC regulatory frameworks, prudential standards, and compliance obligations for financial services.',
    parts: 12,
    estimatedTime: '4 hrs',
    updated: 'Updated 1 week ago',
    action: null,
    completion: 'in-progress',
    progress: 25,
    skills: ['Legal & Regulatory', 'Risk & Compliance'],
    goals: ['Regulatory Expertise'],
    source: 'Ethika',
  },
  {
    id: 'kc-risk',
    type: 'framework',
    icon: ShieldAlert,
    heroImage: '/images/risk-management-hero.png',
    title: 'Risk Management Framework',
    description: 'Enterprise risk identification, appetite setting, and control frameworks aligned with ISO 31000 and COSO standards.',
    parts: 10,
    estimatedTime: '2.5 hrs',
    updated: 'Updated 3 days ago',
    action: null,
    completion: 'complete',
    completedDate: '17 May, 2026',
    skills: ['Risk & Compliance'],
    goals: ['Risk Leadership'],
    source: 'Ethika',
  },
  {
    id: 'kc-esg',
    type: 'external',
    icon: GraduationCap,
    heroImage: '/images/esg-reporting-hero.png',
    title: 'ESG & Sustainability Reporting Module',
    description: 'Covers AASB sustainability disclosure standards, materiality assessments, and practical approaches to climate and social reporting.',
    estimatedTime: '3 hrs',
    updated: 'Updated 5 days ago',
    action: null,
    externalUrl: 'https://www.aasb.gov.au/pronouncements/sustainability-standards/',
    skills: ['ESG Reporting Frameworks'],
    goals: ['Sustainability Leadership'],
    source: 'External',
  },
  {
    id: 'kc-privacy',
    type: 'guide',
    icon: Shield,
    title: 'Data Privacy & Protection Guide',
    description: 'Practical guide to Privacy Act obligations, APPs, cross-border data transfers, and data breach notification requirements.',
    parts: 6,
    estimatedTime: '1.5 hrs',
    updated: 'Updated 1 week ago',
    action: null,
    skills: ['Data Privacy & Protection'],
    goals: ['Regulatory Expertise'],
    source: 'Firm',
  },
  {
    id: 'kc-aml',
    type: 'course',
    icon: ShieldAlert,
    title: 'AML/CTF Compliance Fundamentals',
    description: 'Core AML/CTF obligations including customer due diligence, suspicious matter reporting, and compliance program design.',
    parts: 10,
    estimatedTime: '3.5 hrs',
    updated: 'Updated 2 weeks ago',
    action: null,
    skills: ['AML/CTF', 'Risk & Compliance'],
    goals: ['Regulatory Expertise'],
    source: 'Ethika',
  },
  {
    id: 'kc-board-eval',
    type: 'external',
    icon: Users,
    title: 'Board Effectiveness Case Studies',
    description: 'Real-world case studies examining board composition, stakeholder engagement, and governance failures with actionable lessons.',
    estimatedTime: '2 hrs',
    updated: 'Updated 3 days ago',
    action: null,
    externalUrl: 'https://aicd.companydirectors.com.au/resources/governance-cases',
    skills: ['Governance & Board Effectiveness'],
    goals: ['Governance Mastery'],
    source: 'External',
  },
  {
    id: 'kc-modern-slavery',
    type: 'guide',
    icon: FileText,
    title: 'Modern Slavery Reporting Guide',
    description: 'Step-by-step guidance on Modern Slavery Act reporting, supply chain due diligence, and risk assessment methodologies.',
    parts: 7,
    estimatedTime: '2 hrs',
    updated: 'Updated 4 days ago',
    action: null,
    skills: ['Risk & Compliance', 'Legal & Regulatory'],
    goals: ['Regulatory Expertise'],
    source: 'Ethika',
  },
  {
    id: 'kc-cyber',
    type: 'framework',
    icon: ShieldAlert,
    title: 'Cyber Security Governance Framework',
    description: 'Board-level cyber security oversight framework covering incident response, risk appetite, and regulatory obligations.',
    parts: 9,
    estimatedTime: '2.5 hrs',
    updated: 'Updated 1 week ago',
    action: null,
    skills: ['Risk & Compliance'],
    goals: ['Risk Leadership', 'Digital Transformation'],
    source: 'Firm',
  },
]

const FILTER_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'handbook', label: 'Handbooks' },
  { value: 'framework', label: 'Frameworks' },
  { value: 'course', label: 'Courses' },
  { value: 'learning-module', label: 'Learning Modules' },
  { value: 'guide', label: 'Guides' },
  { value: 'case-study', label: 'Case Studies' },
  { value: 'external', label: 'External' },
]

const FILTER_SKILLS = [
  { value: 'Governance & Duties', label: 'Governance & Duties', icon: BookOpen, matches: ['Governance & Board Effectiveness'] },
  { value: 'Legislation & Regulation', label: 'Legislation & Regulation', icon: Landmark, matches: ['Legal & Regulatory'] },
  { value: 'Substantive Law', label: 'Substantive Law', icon: Scale, matches: [] },
  { value: 'Ethics & Professional Standards', label: 'Ethics & Professional Standards', icon: Shield, matches: ['Ethics & Professional Responsibility'] },
  { value: 'Practice Management', label: 'Practice Management', icon: Briefcase, matches: ['AML/CTF'] },
  { value: 'Technology & AI', label: 'Technology & AI', icon: Brain, matches: ['Risk & Compliance', 'Data Privacy & Protection', 'ESG Reporting Frameworks'] },
]

const FILTER_GOALS = [
  'Governance Mastery',
  'Regulatory Expertise',
  'Risk Leadership',
  'Digital Transformation',
  'Sustainability Leadership',
]

// ─── Knowledge Item Card (matches Figma layout) ─────────────────────────────

const CARD_GRADIENTS = [
  'from-cyan-100 via-teal-50 to-emerald-50',
  'from-violet-100 via-purple-50 to-fuchsia-50',
  'from-amber-100 via-yellow-50 to-orange-50',
  'from-rose-100 via-pink-50 to-red-50',
  'from-blue-100 via-sky-50 to-cyan-50',
  'from-emerald-100 via-green-50 to-teal-50',
  'from-indigo-100 via-blue-50 to-violet-50',
  'from-pink-100 via-rose-50 to-fuchsia-50',
  'from-teal-100 via-cyan-50 to-sky-50',
  'from-fuchsia-100 via-purple-50 to-violet-50',
]

function CompletionBadge({ completion, progress }) {
  if (completion === 'complete') return (
    <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-lime-50 border border-gray-200 rounded-full px-1.5 h-6">
      <span className="size-3 rounded-full bg-emerald-700 flex items-center justify-center">
        <svg className="size-2 text-white" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 4L3.5 6L6.5 2" /></svg>
      </span>
      Completed
    </span>
  )
  if (completion === 'in-progress') return (
    <span className="absolute top-2 right-2 inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-2 h-6">
      <Progress value={progress} className="w-10 h-1.5 bg-gray-200 [&>[data-slot=progress-indicator]]:bg-lime-400" />
      {progress}%
    </span>
  )
  if (completion === 'visited') return (
    <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-2 h-6">
      <ExternalLink className="size-3" />
      Visited
    </span>
  )
  return null
}

function KnowledgeCard({ item, onClick, isVisited, isCompleted }) {
  const Icon = item.icon
  const typeLabel = FILTER_TYPES.find(t => t.value === item.type)?.label || item.type
  const isActive = !!item.completion || item.type === 'external'
  const category = item.skills?.[0] ? FILTER_SKILLS.find(s => s.matches?.includes(item.skills[0])) : null
  const CategoryIcon = category?.icon
  const isExternal = item.type === 'external'

  const effectiveCompletion = isCompleted ? 'complete' : isVisited ? 'visited' : item.completion

  return (
    <div
      className={`group rounded-lg border border-border bg-white overflow-hidden cursor-pointer hover:shadow-md transition-all ${isActive ? '' : 'opacity-60'}`}
      onClick={() => onClick?.(item)}
    >
      {/* Image area */}
      {item.heroImage ? (
        <div className="aspect-[2/1] overflow-hidden relative">
          <img src={item.heroImage} alt="" className="w-full h-full object-cover" />
          <CompletionBadge completion={effectiveCompletion} progress={item.progress} />
        </div>
      ) : (
        <div className="aspect-[2/1] bg-gray-100 flex items-center justify-center relative">
          <Icon className="size-10 text-gray-300" strokeWidth={1} />
          <CompletionBadge completion={effectiveCompletion} progress={item.progress} />
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {category && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-[#f5f5f5] rounded-[6px] px-2 h-6">
              <CategoryIcon className="size-3.5" strokeWidth={1.5} />
              {category.label}
            </span>
          )}
          <span className={`inline-flex items-center gap-1 text-xs font-medium text-muted-foreground rounded-[6px] px-2 h-6 ${isExternal ? 'bg-white border border-border' : 'bg-[#f5f5f5]'}`}>
            {typeLabel}
            {isExternal && <ExternalLink className="size-3" />}
          </span>
        </div>
        <h3 className="text-lg font-normal text-foreground leading-snug line-clamp-2">{item.title}</h3>
        <div className="mt-4 border-t border-border/40 pt-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {item.parts && (
              <span className="flex items-center gap-1.5">
                <FileText className="size-3.5" />{item.parts} parts
              </span>
            )}
            {item.estimatedTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />{item.estimatedTime}
              </span>
            )}
            {item.cpdPoints && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-900 rounded-full px-1.5 py-0.5 cursor-default">
                    <GraduationCap className="size-3.5" />+{item.cpdPoints}pt
                  </span>
                </TooltipTrigger>
                <TooltipContent>This will add {item.cpdPoints} points to your CPD</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

const HANDBOOK_CHANGES = [
  {
    date: '10 Mar 2026',
    type: 'updated',
    title: 'Core Statutory Duties — Duty of Care and Diligence',
    description: 'Updated to reflect the Federal Court\'s recent interpretation of s 180(1) in ASIC v Mitchell. New practical guidance on the business judgment rule defence added.',
    author: 'Ethika',
  },
  {
    date: '7 Mar 2026',
    type: 'new',
    title: 'Key Updates & Trends — Emerging Governance Trends',
    description: 'New topic covering AI governance obligations, ESG reporting mandates under the Treasury Laws Amendment, and the evolving role of board risk committees.',
    author: 'Ethika',
  },
  {
    date: '4 Mar 2026',
    type: 'updated',
    title: 'Other Legal Duties — Insolvent Trading',
    description: 'Safe harbour provisions guidance updated following the 2025 amendments. New flowchart added for assessing reasonable grounds for suspecting insolvency.',
    author: 'Ethika',
  },
  {
    date: '28 Feb 2026',
    type: 'quiz',
    title: 'Core Statutory Duties — Quiz Questions Updated',
    description: '3 new scenario-based questions added to the Duty of Care quiz. 2 outdated questions retired.',
    author: 'Ethika',
  },
  {
    date: '25 Feb 2026',
    type: 'updated',
    title: 'Watch Out For — Common Pitfalls',
    description: 'Added new case study on director liability for misleading climate-related disclosures. Cross-references updated to align with ASIC INFO 271.',
    author: 'Ethika',
  },
]

const COMPLETION_STYLES = {
  'not-started': { label: 'Not started', dotColor: 'bg-gray-300' },
  'in-progress': { label: 'In progress', dotColor: 'bg-amber-400' },
  'complete': { label: 'Complete', dotColor: 'bg-emerald-500' },
}

const CHANGE_STYLE = {
  updated: { label: 'Updated', icon: PenLine, color: 'text-brand-900 bg-brand-50 border-brand-200' },
  new:     { label: 'New',     icon: Sparkles, color: 'text-purple-900 bg-purple-50 border-purple-200' },
  quiz:    { label: 'Quiz',    icon: CheckCircle2, color: 'text-cyan-900 bg-cyan-50 border-cyan-200' },
}

export default function KnowledgeCentrePage() {
  const [readerItem, setReaderItem] = useState(null)
  const [whatsNewOpen, setWhatsNewOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeType, setActiveType] = useState('all')
  const [activeSkills, setActiveSkills] = useState([])
  const [activeGoals, setActiveGoals] = useState([])
  const [readingList, setReadingList] = useState([])
  const [showFavourites, setShowFavourites] = useState(false)
  const [bookmarked] = useState(new Set(['kc-duties', 'kc-risk']))
  const [selectedItem, setSelectedItem] = useState(null)
  const [visitedItems, setVisitedItems] = useState(new Set())
  const [completedExternal, setCompletedExternal] = useState(new Set())
  const [dismissedVisited, setDismissedVisited] = useState(new Set())
  const [requestModalOpen, setRequestModalOpen] = useState(false)
  const gridRef = useRef(null)

  const handleCardClick = (item) => {
    setSelectedItem(item)
  }

  const handleVisitExternal = (item) => {
    if (item.externalUrl) {
      window.open(`/view/${item.id}`, '_blank', 'noopener')
      setVisitedItems(prev => new Set(prev).add(item.id))
    }
  }

  const handleMarkExternalComplete = (itemId) => {
    setCompletedExternal(prev => new Set(prev).add(itemId))
  }

  const handleDismissVisited = (itemId) => {
    setDismissedVisited(prev => new Set(prev).add(itemId))
  }

  const handleAiAdd = (item) => {
    setReadingList(prev => {
      if (prev.some(s => s.title === item.title)) return prev
      return [...prev, item]
    })
  }

  const toggleSkill = (s) => setActiveSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  const clearFilters = () => { setActiveType('all'); setActiveSkills([]); setActiveGoals([]); setSearch('') }

  const hasFilters = activeType !== 'all' || activeSkills.length > 0 || activeGoals.length > 0 || search.trim()

  const filteredItems = useMemo(() => {
    let items = KNOWLEDGE_ITEMS.filter(i => i.id !== 'kc-duties')
    if (showFavourites) items = items.filter(i => bookmarked.has(i.id))
    if (activeType !== 'all') items = items.filter(i => i.type === activeType)
    if (activeSkills.length > 0) {
      const matchedSkills = activeSkills.flatMap(cat => FILTER_SKILLS.find(f => f.value === cat)?.matches || [])
      items = items.filter(i => i.skills?.some(s => matchedSkills.includes(s)))
    }
    if (activeGoals.length > 0) items = items.filter(i => i.goals?.some(g => activeGoals.includes(g)))
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(i => i.title.toLowerCase().includes(q) || (i.description || '').toLowerCase().includes(q))
    }
    return items
  }, [activeType, activeSkills, activeGoals, search, showFavourites, bookmarked])

  // ── Main Knowledge Centre ──
  return (
    <div className="flex flex-1 overflow-hidden bg-white">
      <div className="flex-1 overflow-auto relative">
        {/* Full-width gradient background */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-[#C8EEFF]/20 to-transparent" />

        {/* Hero section — full width bg */}
        <div className="relative px-6 pt-[60px] pb-10 text-center space-y-5">
            <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Knowledge Centre</h1>
            <p className="text-sm text-muted-foreground">Structured professional knowledge and learning materials</p>

            {/* Centered search bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="size-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search knowledge centre..."
                className="pl-12 pr-10 h-12 text-base rounded-xl bg-white border-border shadow-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="size-5" />
                </button>
              )}
            </div>

            {/* Topics — square tiles */}
            <div>
              <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                {FILTER_SKILLS.map(skill => {
                  const SkillIcon = skill.icon
                  const isActive = activeSkills.includes(skill.value)
                  return (
                    <button
                      key={skill.value}
                      onClick={() => toggleSkill(skill.value)}
                      className={`flex items-center gap-2 h-10 px-3 rounded-lg border transition-colors ${
                        isActive
                          ? 'border-brand-700 bg-brand-50/50 text-brand-800'
                          : 'border-border bg-white text-muted-foreground hover:bg-muted/40'
                      }`}
                    >
                      <SkillIcon className="size-4" strokeWidth={1.5} />
                      <span className="text-xs font-medium whitespace-nowrap">{skill.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
        </div>

        {/* Rest of content */}
        <div className="max-w-7xl mx-auto px-6 pb-6 space-y-8 relative">

          {/* ── My Reading List (from AI suggestions) ───────────────── */}
          {readingList.length > 0 && (
            <div className="rounded-[8px] border border-[rgba(0,0,0,0.05)] bg-white p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-[#e8f5f0] flex items-center justify-center">
                  <Sparkles className="size-3.5 text-[#1a3a35]" />
                </div>
                <div>
                  <h2 className="text-base font-medium text-[#0a0a0a]">My Reading List</h2>
                  <p className="text-xs text-muted-foreground">Saved from Ethos AI suggestions</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {readingList.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-[8px] border border-[#ecf2f5] bg-white p-4 relative group"
                  >
                    <button
                      onClick={() => setReadingList(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="size-3.5" />
                    </button>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.typeLabel}</span>
                    <h3 className="text-sm font-medium text-foreground mt-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Filters ──────────────────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={`flex items-center gap-2 h-9 px-3 text-sm font-medium rounded-lg border transition-colors ${
                    activeType !== 'all' ? 'border-brand-700 text-brand-800 bg-brand-50/50' : 'border-border text-foreground bg-white hover:bg-muted/40'
                  }`}>
                    {FILTER_TYPES.find(t => t.value === activeType)?.label || 'All Types'}
                    <ChevronDown className="size-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {FILTER_TYPES.map(t => (
                    <DropdownMenuCheckboxItem
                      key={t.value}
                      checked={activeType === t.value}
                      onCheckedChange={() => setActiveType(t.value)}
                    >
                      {t.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Active filter chips */}
              {activeSkills.map(s => (
                <span key={s} className="flex items-center gap-1.5 text-xs font-medium text-foreground border border-border bg-white px-2.5 h-8 rounded-lg">
                  {s}
                  <X className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => toggleSkill(s)} />
                </span>
              ))}
              {hasFilters && (
                <button onClick={clearFilters} className="text-sm text-muted-foreground hover:text-foreground transition-colors ml-1">
                  Clear all
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
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
                  <CheckCircle2 className="size-[18px]" strokeWidth={1} /> Completed
                </button>
              </div>
            </div>
          </div>

          {/* ── Results ──────────────────────────────────────────── */}
          <div className="space-y-4" ref={gridRef}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredItems.length}</span> item{filteredItems.length !== 1 ? 's' : ''}
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <span className="text-foreground font-medium">Most relevant</span>
                    <ChevronDown className="size-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem checked>Most relevant</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Recently updated</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Title A–Z</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 pb-8">
                {/* Pinned — Duties Handbook (hidden in Completed view) */}
                {!showFavourites && <div
                  className="group rounded-lg border border-brand-200 bg-white cursor-pointer hover:shadow-md transition-all overflow-hidden"
                  onClick={() => setSelectedItem(KNOWLEDGE_ITEMS.find(i => i.id === 'kc-duties'))}
                >
                  <div className="aspect-[2/1] overflow-hidden relative">
                    <img src="/images/duties-handbook-hero.png" alt="" className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-medium text-brand-700 bg-white/80 backdrop-blur-sm px-2 h-5 rounded-md">
                      <Pin className="size-3" /> Pinned
                    </span>
                    <span className="absolute top-2 right-2 inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-2 h-6">
                      <Progress value={40} className="w-10 h-1.5 bg-gray-200 [&>[data-slot=progress-indicator]]:bg-lime-400" />
                      40%
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-[#f5f5f5] rounded-[6px] px-2 h-6">
                        <BookOpen className="size-3.5" strokeWidth={1.5} />
                        Governance & Duties
                      </span>
                      <span className="inline-flex items-center text-xs font-medium text-muted-foreground bg-[#f5f5f5] rounded-[6px] px-2 h-6">Handbook</span>
                    </div>
                    <h3 className="text-lg font-normal text-foreground leading-snug">Duties Handbook</h3>
                    <div className="mt-4 border-t border-border/40 pt-4">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <FileText className="size-3.5" />15 parts
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="size-3.5" />3 hrs
                        </span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-900 rounded-full px-1.5 py-0.5 cursor-default">
                              <GraduationCap className="size-3.5" />+6pt
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>This will add 6 points to your CPD</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>}

                {filteredItems.map((item) => (
                  <KnowledgeCard
                    key={item.id}
                    item={item}
                    onClick={handleCardClick}
                    isVisited={visitedItems.has(item.id)}
                    isCompleted={completedExternal.has(item.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-sm text-muted-foreground">No items match your filters.</p>
                <button onClick={clearFilters} className="text-xs text-muted-foreground underline mt-2">
                  Reset filters
                </button>
              </div>
            )}
          </div>

          {/* Request Content CTA */}
          <div className="text-center py-8 border-t border-border/40">
            <p className="text-sm text-muted-foreground mb-3">Can't find what you need?</p>
            <Button variant="outline" onClick={() => setRequestModalOpen(true)}>
              Request Content
            </Button>
          </div>

        </div>
        </div>

      {/* Request Content Modal */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setRequestModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[480px] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
              <h2 className="text-lg font-semibold text-foreground">Request Content</h2>
              <button onClick={() => setRequestModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Topic or subject</label>
                <Input placeholder="e.g. Modern slavery reporting, APRA CPS 230..." />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Content type</label>
                <Input placeholder="e.g. Guide, Course, Framework..." />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Additional details</label>
                <textarea
                  placeholder="Describe what you're looking for and why it would be useful..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px] resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border/60 flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setRequestModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setRequestModalOpen(false)}>Submit request</Button>
            </div>
          </div>
        </div>
      )}

      <Feature flag="FEATURE_DUTIES_HANDBOOK">
        {readerItem && <DutiesHandbook item={readerItem} onClose={() => setReaderItem(null)} />}
      </Feature>

      {/* What's New overlay — renders on top of handbook (z-[60] > z-50) */}
      {whatsNewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setWhatsNewOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[640px] max-h-[700px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-border/60 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">What's New</h2>
                  <p className="text-sm text-muted-foreground">Recent updates to the Duties Handbook</p>
                </div>
                <button
                  onClick={() => setWhatsNewOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Changes list */}
            <div className="flex-1 overflow-y-auto">
              {HANDBOOK_CHANGES.map((change, i) => {
                const style = CHANGE_STYLE[change.type]
                const Icon = style.icon
                return (
                  <div key={i} className="px-6 py-4 border-b border-border/40 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium leading-none h-6 px-1.5 rounded-md border ${style.color}`}>
                        <Icon className="size-3" /> {style.label}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" /> {change.date}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-foreground mb-1">{change.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{change.description}</p>
                    <p className="text-xs text-muted-foreground/60 mt-2">By {change.author}</p>
                  </div>
                )
              })}
            </div>

            {/* Footer — fixed to bottom */}
            <div className="px-6 py-4 shrink-0 flex items-center justify-end shadow-[0_-8px_16px_-4px_rgba(0,0,0,0.08)]">
              <button
                onClick={() => setWhatsNewOpen(false)}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-[#153e40] text-white text-sm font-medium hover:bg-[#153e40]/90 transition-colors"
              >
                Got it <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ── Content Detail Drawer ──────────────────────────────── */}
      {selectedItem && (
        <>
          <div className="fixed inset-0 z-40 bg-black/10" onClick={() => setSelectedItem(null)} />
          <div className="fixed top-[10px] right-[10px] bottom-[10px] z-50 w-[380px] transition-transform duration-300 ease-in-out">
            <div className="h-full bg-[#f1f5f9] rounded-[14px] border border-[rgba(229,229,229,0.6)] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">
              {/* Card 1: Hero + Type + Title + Metadata */}
              <div className="bg-white border-b border-[rgba(229,229,229,0.6)] shrink-0">
                {/* Hero image */}
                <div className="aspect-[2/1] overflow-hidden relative">
                  {selectedItem.heroImage ? (
                    <img src={selectedItem.heroImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-[170px] bg-gray-100 flex items-center justify-center">
                      <selectedItem.icon className="size-10 text-foreground/20" strokeWidth={1} />
                    </div>
                  )}
                  <button onClick={() => setSelectedItem(null)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors">
                    <X className="size-5" />
                  </button>
                </div>

                <div className="px-5 py-4 space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(() => {
                      const drawerCategory = selectedItem.skills?.[0] ? FILTER_SKILLS.find(s => s.matches?.includes(selectedItem.skills[0])) : null
                      const DrawerCatIcon = drawerCategory?.icon
                      return drawerCategory ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-[#f5f5f5] rounded-[6px] px-2 h-6">
                          <DrawerCatIcon className="size-3.5" strokeWidth={1.5} />
                          {drawerCategory.label}
                        </span>
                      ) : null
                    })()}
                    <span className="inline-flex items-center text-xs font-medium text-muted-foreground bg-[#f5f5f5] rounded-[6px] px-2 h-6">{FILTER_TYPES.find(t => t.value === selectedItem.type)?.label}</span>
                  </div>
                  <h2 className="text-lg font-normal text-[#002022]">{selectedItem.title}</h2>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {selectedItem.parts && (
                      <span className="flex items-center gap-1.5">
                        <FileText className="size-3.5" />{selectedItem.parts} parts
                      </span>
                    )}
                    {selectedItem.estimatedTime && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />{selectedItem.estimatedTime}
                      </span>
                    )}
                    {selectedItem.cpdPoints && (
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="size-3.5" />CPD +{selectedItem.cpdPoints}pt
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: Details + Skills + Progress + Action */}
              <div className="bg-white flex-1 overflow-auto">
                <div className="px-5 pt-3 pb-4 space-y-7">
                  {/* Details */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Details</p>
                    <p className="text-sm text-foreground leading-relaxed">{selectedItem.description}</p>
                  </div>

                  {/* Source */}
                  {selectedItem.source && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Source</p>
                      {selectedItem.source === 'External' ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
                            <Globe className="size-4 text-muted-foreground" />
                            External
                          </span>
                          {selectedItem.externalUrl && (
                            <a
                              href={selectedItem.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-brand-700 hover:text-brand-800 transition-colors"
                              onClick={e => e.stopPropagation()}
                            >
                              <ExternalLink className="size-3" />
                              Open link
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-sm text-foreground">
                          <img src="/images/ethika-avatar.png" alt="Ethika" className="size-6 rounded-full" />
                          {selectedItem.source}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Skills */}
                  {selectedItem.skills?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedItem.skills.map(s => (
                          <span key={s} className="text-xs font-medium text-muted-foreground bg-white border border-border rounded-full px-2.5 h-6 inline-flex items-center">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Progress */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Progress</p>
                    {selectedItem.completion === 'complete' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-lime-50 border border-gray-200 rounded-full px-1.5 h-6">
                        <span className="size-3 rounded-full bg-emerald-700 flex items-center justify-center">
                          <svg className="size-2 text-white" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 4L3.5 6L6.5 2" /></svg>
                        </span>
                        Completed {selectedItem.completedDate || '17 May, 2026'}
                      </span>
                    ) : selectedItem.completion === 'in-progress' ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{Math.round((selectedItem.progress / 100) * selectedItem.parts)} of {selectedItem.parts} parts</span>
                        <div className="flex items-center gap-2">
                          <Progress value={selectedItem.progress} className="w-16 h-1.5 bg-gray-200 [&>[data-slot=progress-indicator]]:bg-lime-400" />
                          <span className="text-xs text-muted-foreground">{selectedItem.progress}%</span>
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full px-2 h-6">
                        <span className="size-3 rounded-full border border-dashed border-gray-400" />
                        Not Started
                      </span>
                    )}
                  </div>

                  {/* Visited notice for external items */}
                  {selectedItem.type === 'external' && visitedItems.has(selectedItem.id) && !completedExternal.has(selectedItem.id) && !dismissedVisited.has(selectedItem.id) && (
                    <div className="px-3 py-2.5 bg-sky-50 border border-sky-200 rounded-lg space-y-2">
                      <p className="text-xs text-sky-800">You visited this. Would you like to mark as complete?</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleMarkExternalComplete(selectedItem.id)}
                          className="text-xs font-medium text-sky-800 hover:text-sky-900 transition-colors"
                        >
                          Mark complete
                        </button>
                        <button
                          onClick={() => handleDismissVisited(selectedItem.id)}
                          className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action + Updated */}
                  <div className="space-y-2">
                    {selectedItem.type === 'external' ? (
                      <Button className="w-full" onClick={() => handleVisitExternal(selectedItem)}>
                        <ExternalLink className="size-4 mr-2" />
                        Visit
                      </Button>
                    ) : selectedItem.completion === 'in-progress' ? (
                      <Button className="w-full" onClick={() => {
                        const item = selectedItem
                        setSelectedItem(null)
                        setReaderItem(item)
                        if (item.id === 'kc-duties') setWhatsNewOpen(true)
                      }}>Continue</Button>
                    ) : selectedItem.completion === 'complete' ? (
                      <Button className="w-full" variant="outline" onClick={() => {
                        const item = selectedItem
                        setSelectedItem(null)
                        setReaderItem(item)
                      }}>Review</Button>
                    ) : (
                      <Button className="w-full" onClick={() => {
                        const item = selectedItem
                        setSelectedItem(null)
                        setReaderItem(item)
                        if (item.id === 'kc-duties') setWhatsNewOpen(true)
                      }}>Start</Button>
                    )}
                    {selectedItem.updated && (
                      <p className="text-xs text-muted-foreground text-center">{selectedItem.updated}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 3: Empty bottom area */}
              <div className="bg-white shrink-0 h-16" />
            </div>
          </div>
        </>
      )}

    </div>
  )
}
