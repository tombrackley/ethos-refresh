import { useState, useMemo } from 'react'
import Feature from '@/components/Feature'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Clock, Plus, Search, X, Check,
  Award, Target, CheckCircle2, ChevronDown,
  Sparkles, Info, BookOpen, FileText, Briefcase,
  Settings, Download, Linkedin,
} from 'lucide-react'
import tenant from '@/config/tenant'

import ScoreBreakdownSheet from './skills/ScoreBreakdownSheet'
import SkillAssessmentOverlay from './skills/SkillAssessmentOverlay'
import AddFocusOverlay from './skills/AddFocusOverlay'

// ─── Data ────────────────────────────────────────────────────────────────────

const t = tenant.pages.learn
const SKILLS_PROFILE = t.skillsProfile
const SKILLS_GAPS = t.skillsGaps

const MAX_DOTS = 4

const STATUS_VARIANT = {
  Proficient: 'skill-proficient',
  Developing: 'skill-developing',
  Gap: 'skill-gap',
}

const IMPORTANCE_VARIANT = {
  Critical: 'importance-critical',
  High: 'importance-high',
  Medium: 'importance-medium',
}

const TYPE_VARIANT = {
  certification: 'type-certification',
  completion: 'type-completion',
  milestone: 'type-milestone',
}

const SIGNAL_ICON = {
  'Course Completion': BookOpen,
  'Scenario Assessment': FileText,
  'Work Signal': Briefcase,
  'Org Config': Settings,
  'Certification': Award,
  'Compliance Review': FileText,
}

const COLUMN_CONFIG = [
  { key: 'gap', label: 'Gap', emptyText: 'No skill gaps', dot: 'bg-red-400', bg: 'bg-red-50/40', headerText: 'text-red-800' },
  { key: 'developing', label: 'Developing', emptyText: 'No skills developing', dot: 'bg-blue-400', bg: 'bg-blue-50/40', headerText: 'text-blue-800' },
  { key: 'proficient', label: 'Proficient', emptyText: 'No proficient skills yet', dot: 'bg-emerald-400', bg: 'bg-emerald-50/40', headerText: 'text-emerald-800' },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SkillsProfilePage() {
  const [selectedSkillId, setSelectedSkillId] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [importanceFilter, setImportanceFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddFocus, setShowAddFocus] = useState(false)
  const [personalFocus, setPersonalFocus] = useState(
    () => SKILLS_PROFILE.skills.filter(s => s.category === 'personal').map(s => s.label)
  )
  const [assessmentRequested, setAssessmentRequested] = useState(false)
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false)
  const [assessmentSkill, setAssessmentSkill] = useState(null)
  const [claimedCerts, setClaimedCerts] = useState(() => new Set())

  const skills = SKILLS_PROFILE.skills
  const milestones = SKILLS_PROFILE.milestones
  const certificates = SKILLS_PROFILE.certificates || []
  const roleProgression = SKILLS_PROFILE.roleProgression
  const gapSkills = skills.filter(s => s.status === 'Gap')
  const metCount = skills.filter(s => s.status === 'Proficient').length

  const selectedSkill = skills.find(s => s.id === selectedSkillId)
  const selectedEvidence = SKILLS_PROFILE.evidence?.[selectedSkillId]
  const selectedCloseGapRec = SKILLS_PROFILE.closeGapRecommendations?.[selectedSkillId]
  const hasAssessment = !!SKILLS_PROFILE.assessmentQuestions?.[selectedSkillId]?.length

  const getImportance = (label) => {
    const gap = SKILLS_GAPS?.find(g => g.skill === label)
    return gap?.importance || 'Medium'
  }

  // Determine which column a skill belongs to
  const getSkillColumn = (skill) => {
    if (skill.status === 'Gap') return 'gap'
    if (skill.status === 'Developing') return 'developing'
    return 'proficient'
  }

  // Filter and group skills
  const filteredGrouped = useMemo(() => {
    let filtered = skills

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(s => s.category === categoryFilter)
    }

    if (importanceFilter !== 'all') {
      filtered = filtered.filter(s => {
        const imp = getImportance(s.label)
        return imp === importanceFilter
      })
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(s =>
        s.label.toLowerCase().includes(q) ||
        s.source.toLowerCase().includes(q) ||
        s.level.toLowerCase().includes(q)
      )
    }

    const groups = { gap: [], developing: [], proficient: [] }
    filtered.forEach(s => {
      const col = getSkillColumn(s)
      groups[col].push(s)
    })
    return groups
  }, [skills, categoryFilter, importanceFilter, searchQuery])

  const handleAddFocus = (opt) => {
    setPersonalFocus(prev => [...prev, opt.label])
    setShowAddFocus(false)
  }

  const sortedMilestones = [...milestones].sort((a, b) => {
    const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
    const [aMonth, aYear] = a.date.split(' ')
    const [bMonth, bYear] = b.date.split(' ')
    return (Number(bYear) * 12 + months[bMonth]) - (Number(aYear) * 12 + months[aMonth])
  })

  // ── Empty state ──
  if (!skills.length) {
    return (
      <div className="flex flex-1">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <div className="size-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto">
              <Target className="size-8 text-brand-600" />
            </div>
            <h2 className="text-2xl font-medium text-foreground tracking-[-0.6px]">Set Up Your Skills Profile</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your skills profile helps track competencies, identify gaps, and recommend targeted learning. Get started by requesting your first skills assessment.
            </p>
            <Button className="gap-1.5">
              <Target className="size-4" /> Set Up Skills Profile
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1">
      <div className="flex-1 px-6 pt-[60px] pb-6">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* ── Gradient Hero ─────────────────────────────────────── */}
          <div className="relative -mx-6 -mt-[60px] px-6 pt-[60px] pb-6">
            <div className="pointer-events-none absolute inset-0 left-[calc(-50vw+50%)] w-screen bg-gradient-to-b from-[rgba(209,250,229,0.1)] to-[#F9FAFB]" />
            <div className="relative space-y-6">

              {/* Header row */}
              <div className="flex items-end justify-end">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3.5" /> Last assessed: {SKILLS_PROFILE.lastAssessedDate}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAssessmentRequested(true)}
                    disabled={assessmentRequested}
                    className="gap-1.5"
                  >
                    {assessmentRequested ? (
                      <><CheckCircle2 className="size-4" /> Assessment in Progress</>
                    ) : (
                      <>Request Assessment</>
                    )}
                  </Button>
                </div>
              </div>

              {/* ── Your Skills Overview Card ──────────────────────────── */}
              <div className="rounded-[6px] border border-[#E2E8F0] bg-white p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">Your Skills Overview</p>
                  <button
                    onClick={() => setShowScoreBreakdown(true)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Info className="size-3.5" /> How is this calculated?
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-16">
                  {/* Overall Proficiency */}
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-sm text-foreground">Overall Proficiency</p>
                      <p className="text-2xl text-foreground tracking-[-0.6px]">{SKILLS_PROFILE.overallScore}/100</p>
                    </div>
                    <div className="flex gap-[11px]">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className={`w-[5px] h-[25px] ${i < Math.round(SKILLS_PROFILE.overallScore / 10) ? 'bg-[#6ee7b7]' : 'bg-[#d9d9d9]'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground leading-5 max-w-[220px]">
                      Based on {skills.length} tracked skills across mandatory and personal areas
                    </p>
                  </div>

                  {/* Skills Coverage */}
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-sm text-foreground">Skills Coverage</p>
                      <p className="text-2xl text-foreground tracking-[-0.6px]">{metCount} of {skills.length} met</p>
                    </div>
                    <div className="flex gap-[11px]">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className={`w-[5px] h-[25px] ${i < Math.round((metCount / skills.length) * 10) ? 'bg-[#fed7aa]' : 'bg-[#d9d9d9]'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground leading-5 max-w-[220px]">
                      {gapSkills.length} skill{gapSkills.length !== 1 ? 's' : ''} require further development
                    </p>
                  </div>

                  {/* Role Progression */}
                  <div className="space-y-1">
                    <p className="text-sm text-foreground">Role Progression</p>
                    {roleProgression ? (
                      <>
                        <p className="text-2xl text-foreground tracking-[-0.6px]">{roleProgression.progress}%</p>
                        <p className="text-sm text-foreground leading-6">
                          On track toward <span className="font-medium">{roleProgression.targetRole}</span>. {roleProgression.metSkills.length} of {roleProgression.requiredSkills.length} required skills met.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-2xl text-foreground tracking-[-0.6px]">{metCount}/{skills.length}</p>
                        <p className="text-sm text-foreground leading-6">
                          {metCount} skills at proficient level across your tracked areas.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#E2E8F0]" />

                {/* Filter Bar */}
                <div className="flex items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1.5 h-8 text-sm font-normal bg-white">
                        {categoryFilter === 'all' ? 'All skills' : categoryFilter === 'mandatory' ? 'Mandatory' : 'Personal'}
                        <ChevronDown className="size-3.5 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {[
                        { key: 'all', label: 'All skills' },
                        { key: 'mandatory', label: 'Mandatory' },
                        { key: 'personal', label: 'Personal' },
                      ].map(cat => (
                        <DropdownMenuItem key={cat.key} onClick={() => setCategoryFilter(cat.key)}>
                          {cat.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1.5 h-8 text-sm font-normal bg-white">
                        {importanceFilter === 'all' ? 'All priorities' : importanceFilter}
                        <ChevronDown className="size-3.5 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {[
                        { key: 'all', label: 'All priorities' },
                        { key: 'Critical', label: 'Critical' },
                        { key: 'High', label: 'High' },
                        { key: 'Medium', label: 'Medium' },
                      ].map(imp => (
                        <DropdownMenuItem key={imp.key} onClick={() => setImportanceFilter(imp.key)}>
                          {imp.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="relative ml-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search skills..."
                      className="h-8 w-56 pl-9 text-sm"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Board columns */}
                <div className="grid grid-cols-3 gap-3">
                  {COLUMN_CONFIG.map(col => {
                    const columnSkills = filteredGrouped[col.key]
                    return (
                      <div key={col.key} className={`rounded-lg ${col.bg} p-2.5 min-h-[200px]`}>
                        <div className="flex items-center gap-2 mb-3 px-1">
                          <span className={`size-2 rounded-full ${col.dot}`} />
                          <span className={`text-sm font-medium ${col.headerText}`}>{col.label}</span>
                          <span className="text-xs text-muted-foreground">{columnSkills.length}</span>
                        </div>

                        <div className="space-y-2">
                          {columnSkills.map(skill => {
                            const importance = getImportance(skill.label)
                            const showPriority = col.key === 'gap' && importance !== 'Medium'
                            const priorityDot = importance === 'Critical' ? 'bg-red-500' : 'bg-amber-400'
                            return (
                              <button
                                key={skill.id}
                                onClick={() => setSelectedSkillId(skill.id)}
                                className="w-full text-left rounded-lg border border-border/60 bg-white p-3 space-y-2 hover:shadow-sm transition-all"
                              >
                                <p className="text-sm font-medium text-foreground leading-tight">{skill.label}</p>
                                <p className="text-xs text-muted-foreground">{skill.source}</p>
                                {showPriority && (
                                  <div className="flex items-center gap-1.5">
                                    <span className={`size-2 rounded-full ${priorityDot}`} />
                                    <span className="text-xs text-muted-foreground">{importance}</span>
                                  </div>
                                )}
                              </button>
                            )
                          })}

                          {columnSkills.length === 0 && (
                            <p className="text-sm text-muted-foreground px-1 py-4 text-center">{col.emptyText}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* ── Progress & Credentials ─────────────────────────────── */}
          <div className="rounded-[6px] border border-[#E2E8F0] bg-white p-6 space-y-6">
            <p className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">Progress & Credentials</p>

            {/* Certificates */}
            {certificates.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {certificates.map(cert => {
                  const isClaimed = cert.status === 'claimed' || claimedCerts.has(cert.skillId)
                  return (
                    <div key={cert.skillId} className={`rounded-lg border p-3.5 ${isClaimed ? 'border-border/60 bg-white' : 'border-brand-200 bg-white'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 relative ${isClaimed ? 'bg-muted' : 'bg-brand-50'}`}>
                          <Award className={`size-5 ${isClaimed ? 'text-muted-foreground' : 'text-brand-600'}`} />
                          {isClaimed && (
                            <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-emerald-600 flex items-center justify-center">
                              <Check className="size-2.5 text-white" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground leading-tight">{cert.journeyName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Issued {cert.issuedDate} · Score: {cert.capabilityScore}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {!isClaimed ? (
                            <Button size="sm" className="shadow-none" onClick={() => setClaimedCerts(prev => new Set([...prev, cert.skillId]))}>
                              Claim Certificate
                            </Button>
                          ) : (
                            <>
                              <Button variant="outline" size="sm" className="shadow-none">
                                Share
                              </Button>
                              <Button variant="outline" size="sm" className="gap-1.5 shadow-none">
                                <Download className="size-3.5" /> Download
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Development History */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">Development History</p>
              {sortedMilestones.map((m, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-20 shrink-0">{m.date}</span>
                    <p className="text-sm text-foreground">{m.event}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm text-muted-foreground capitalize">{m.type}</span>
                    {m.points > 0 && (
                      <span className="text-sm text-muted-foreground">{m.points} pts</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Ethos AI Panel ──────────────────────────────────── */}

      {showAddFocus && (
        <AddFocusOverlay
          currentLabels={personalFocus}
          onClose={() => setShowAddFocus(false)}
          onAdd={handleAddFocus}
        />
      )}

      {/* ── Score Breakdown Sheet ──────────────────────────────── */}
      <ScoreBreakdownSheet open={showScoreBreakdown} onOpenChange={setShowScoreBreakdown} />

      {/* ── Skill Detail Drawer ──────────────────────────────── */}
      {selectedSkill && (
        <>
          <div className="fixed inset-0 z-40 bg-black/10" onClick={() => setSelectedSkillId(null)} />
          <div className="fixed top-[10px] right-[10px] bottom-[10px] z-50 w-[380px]">
            <div className="h-full bg-[#f1f5f9] rounded-[14px] border border-[rgba(229,229,229,0.6)] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">
              {/* Header card */}
              <div className="bg-white border-b border-[rgba(229,229,229,0.6)] shrink-0">
                <div className="px-5 py-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant={STATUS_VARIANT[selectedSkill.status]}>{selectedSkill.status}</Badge>
                      <span className="inline-flex items-center text-xs font-medium text-muted-foreground bg-[#f5f5f5] rounded-[6px] px-2 h-6">{selectedSkill.category === 'mandatory' ? 'Mandatory' : 'Personal'}</span>
                    </div>
                    <button onClick={() => setSelectedSkillId(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                      <X className="size-5" />
                    </button>
                  </div>
                  <h2 className="text-lg font-normal text-[#002022]">{selectedSkill.label}</h2>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Target className="size-3.5" />{selectedSkill.level} → {selectedSkill.targetLevel}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5" />Last: {selectedSkill.lastActivity}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: MAX_DOTS }).map((_, i) => (
                      <div key={i} className={`size-2.5 rounded-full ${i < selectedSkill.dots ? 'bg-brand-600' : 'bg-[#e5e7eb]'}`} />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1.5">{selectedSkill.source}</span>
                  </div>
                </div>
              </div>

              {/* Content card */}
              <div className="bg-white flex-1 overflow-auto">
                <div className="px-5 pt-3 pb-4 space-y-7">
                  {/* Details */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Details</p>
                    <p className="text-sm text-foreground leading-relaxed">{selectedSkill.description}</p>
                  </div>

                  {/* Evidence */}
                  {selectedEvidence && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Evidence</p>
                      <div className="space-y-1.5">
                        {selectedEvidence.sources.map((src, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                            <p className="text-sm text-foreground">{src.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recognised by */}
                  {/* Recommended action */}
                  {selectedEvidence?.recommendedAction && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Recommendation</p>
                      <p className="text-sm text-foreground leading-relaxed">{selectedEvidence.recommendedAction}</p>
                    </div>
                  )}

                  {/* Close Gap actions */}
                  {selectedCloseGapRec?.learning?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Recommended Learning</p>
                      {selectedCloseGapRec.learning.map((mod, i) => (
                        <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium text-foreground">{mod.title}</p>
                              <p className="text-xs text-muted-foreground">{mod.provider} · {mod.type} · {mod.cpdPoints} CPD pts</p>
                            </div>
                            <Badge variant="skill-proficient">{mod.matchScore}%</Badge>
                          </div>
                          <Button variant="outline" size="sm" className="w-full shadow-none">View</Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedCloseGapRec?.events?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Upcoming Events</p>
                      {selectedCloseGapRec.events.map((event, i) => (
                        <div key={i} className="rounded-lg border border-border p-3 space-y-1">
                          <p className="text-sm font-medium text-foreground">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.date} · {event.time}</p>
                          <p className="text-xs text-muted-foreground">{event.provider} · {event.cpdPoints} CPD pts</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action button */}
                  <div className="space-y-2">
                    {(selectedCloseGapRec?.assessments?.length > 0 || hasAssessment) ? (
                      <Button
                        className="w-full"
                        onClick={() => {
                          setSelectedSkillId(null)
                          setAssessmentSkill({ id: selectedSkill.id, label: selectedSkill.label })
                        }}
                      >
                        Start Assessment
                      </Button>
                    ) : selectedSkill.status === 'Gap' ? (
                      <Button className="w-full" variant="outline">Close Gap</Button>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Bottom spacer */}
              <div className="bg-white shrink-0 h-4" />
            </div>
          </div>
        </>
      )}

      {/* ── Assessment Overlay ──────────────────────────────────── */}
      {assessmentSkill && (
        <SkillAssessmentOverlay
          skillId={assessmentSkill.id}
          skillLabel={assessmentSkill.label}
          onClose={() => setAssessmentSkill(null)}
        />
      )}
    </div>
  )
}
