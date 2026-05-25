import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Clock, X, Check, Award, Target, CheckCircle2, Download, Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import tenant from '@/config/tenant'

import ScoreBreakdownSheet from './skills/ScoreBreakdownSheet'
import SkillAssessmentOverlay from './skills/SkillAssessmentOverlay'
import AddFocusOverlay from './skills/AddFocusOverlay'
import FocusSkillsOverlay from './skills/FocusSkillsOverlay'

// ─── Data ────────────────────────────────────────────────────────────────────

const t = tenant.pages.learn
const SKILLS_PROFILE = t.skillsProfile
const MAX_DOTS = 4

const STATUS_VARIANT = {
  Proficient: 'skill-proficient',
  Developing: 'skill-developing',
  Gap: 'skill-gap',
}

const BUCKETS = [
  {
    key: 'Gap',
    label: 'Gaps',
    bg: 'bg-[#f8f8f8]',
    dot: 'bg-[#828c9b]',
    labelColor: 'text-[#5f6776]',
    rowBg: 'bg-white',
    rowBorder: 'border-[#E2E8F0]',
    hoursColor: 'text-[#082760]',
    emptyText: 'No skill gaps',
  },
  {
    key: 'Developing',
    label: 'Developing',
    bg: 'bg-[#fdf9ff]',
    dot: 'bg-[#d379e7]',
    labelColor: 'text-[#a322aa]',
    rowBg: 'bg-white',
    rowBorder: 'border-[#E2E8F0]',
    hoursColor: 'text-[#082760]',
    emptyText: 'No skills developing',
  },
  {
    key: 'Proficient',
    label: 'Proficient',
    bg: 'bg-[#f7fefb]',
    dot: 'bg-[#00d492]',
    labelColor: 'text-[#006045]',
    rowBg: 'bg-[#f1ffe7]',
    rowBorder: 'border-[#E2E8F0]',
    hoursColor: 'text-[#365314]',
    emptyText: 'No proficient skills yet',
  },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SkillsProfilePage() {
  const [expandedSkillId, setExpandedSkillId] = useState(null)
  const [showAddFocus, setShowAddFocus] = useState(false)
  const [personalFocus, setPersonalFocus] = useState(
    () => SKILLS_PROFILE.skills.filter(s => s.category === 'personal').map(s => s.label)
  )
  const [assessmentRequested, setAssessmentRequested] = useState(false)
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false)
  const [assessmentSkill, setAssessmentSkill] = useState(null)
  const [claimedCerts, setClaimedCerts] = useState(() => new Set())
  const [categoryTab, setCategoryTab] = useState('all')
  const [showManageFocus, setShowManageFocus] = useState(false)

  const skills = SKILLS_PROFILE.skills
  const milestones = useMemo(() => SKILLS_PROFILE.milestones || [], [])
  const certificates = SKILLS_PROFILE.certificates || []
  const roleProgression = SKILLS_PROFILE.roleProgression

  // CPD hours per skill, summed from milestone points
  const hoursPerSkill = useMemo(() => {
    const map = {}
    milestones.forEach(m => {
      map[m.skillId] = (map[m.skillId] || 0) + (m.points || 0)
    })
    return map
  }, [milestones])

  // Counts per category for the tab labels. 'additional' is the user-facing
  // name for the 'personal' category in the data.
  const categoryCounts = useMemo(() => ({
    all: skills.length,
    mandatory: skills.filter(s => s.category === 'mandatory').length,
    additional: skills.filter(s => s.category === 'personal').length,
  }), [skills])

  // Group skills into status buckets for the Skill Requirements card,
  // scoped by the active category tab. The UI tab 'additional' maps to
  // the data category 'personal'.
  const skillsByStatus = useMemo(() => {
    const dataCategory = categoryTab === 'additional' ? 'personal' : categoryTab
    const filtered = categoryTab === 'all'
      ? skills
      : skills.filter(s => s.category === dataCategory)
    const groups = { Gap: [], Developing: [], Proficient: [] }
    filtered.forEach(s => {
      if (groups[s.status]) groups[s.status].push(s)
    })
    return groups
  }, [skills, categoryTab])

  const sortedMilestones = useMemo(() => {
    const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
    return [...milestones].sort((a, b) => {
      const [aMonth, aYear] = a.date.split(' ')
      const [bMonth, bYear] = b.date.split(' ')
      return (Number(bYear) * 12 + months[bMonth]) - (Number(aYear) * 12 + months[aMonth])
    })
  }, [milestones])

  const handleAddFocus = (opt) => {
    setPersonalFocus(prev => [...prev, opt.label])
    setShowAddFocus(false)
  }


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
    <div className="flex flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto bg-white px-8 pt-[52px] pb-6">
        <div className="max-w-[1200px] mx-auto space-y-8">

          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-[28px] leading-[30px] tracking-[-1.12px] font-normal text-[#0A0A0A]">Skills Profile</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Map your capabilities and identify development opportunities.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
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
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowManageFocus(true)}>
                <Settings className="size-4" /> Manage
              </Button>
            </div>
          </div>

          {/* ── Skill Requirements ─────────────────────────────────── */}
          <div className="rounded-[8px] border border-[#E2E8F0] bg-white p-4 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <p className="text-[17px] leading-5 tracking-[-0.1504px] font-medium text-[#0a0a0a]">Skill Requirements</p>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { key: 'all', label: 'All', count: categoryCounts.all },
                  { key: 'mandatory', label: 'Required', count: categoryCounts.mandatory },
                  { key: 'additional', label: 'Additional', count: categoryCounts.additional },
                ].map(tab => {
                  const active = categoryTab === tab.key
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setCategoryTab(tab.key)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 h-8 border transition-colors',
                        active
                          ? 'bg-[#dffff2] border-[rgba(14,95,91,0.5)]'
                          : 'bg-muted/60 hover:bg-muted border-transparent',
                      )}
                    >
                      <span className={cn(
                        'text-sm font-medium tracking-[-0.28px]',
                        active ? 'text-[#0e5f5b]' : 'text-foreground',
                      )}>
                        {tab.label}
                      </span>
                      <span className={cn(
                        'text-xs',
                        active ? 'text-[rgba(14,95,91,0.5)]' : 'text-muted-foreground',
                      )}>
                        {tab.count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-start gap-2">
              {BUCKETS.map(bucket => {
                const bucketSkills = skillsByStatus[bucket.key] || []
                return (
                  <div key={bucket.key} className={`flex-1 ${bucket.bg} p-3 rounded-[16px] flex flex-col gap-2`}>
                    <div className="flex items-center gap-2 px-1 h-5">
                      <span className={`size-2 rounded-full ${bucket.dot}`} />
                      <span className={`text-sm font-medium leading-5 ${bucket.labelColor}`}>{bucket.label}</span>
                      <span className="text-xs text-muted-foreground leading-4">{bucketSkills.length}</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {bucketSkills.map(skill => {
                        const hours = hoursPerSkill[skill.id] || 0
                        const expanded = expandedSkillId === skill.id
                        const regimes = (skill.source || '').split(' · ').map(r => r.trim()).filter(Boolean)
                        const isMandatory = skill.category === 'mandatory'
                        const isRoleRequired = roleProgression?.requiredSkills?.includes(skill.id)
                        const requiredBy = [
                          isMandatory && 'Mandatory',
                          isRoleRequired && `Role: ${roleProgression.targetRole}`,
                        ].filter(Boolean)
                        return (
                          <div
                            key={skill.id}
                            className={cn(
                              'w-full border rounded-[8px] overflow-hidden transition-all',
                              bucket.rowBg, bucket.rowBorder,
                            )}
                          >
                            <button
                              onClick={() => setExpandedSkillId(prev => prev === skill.id ? null : skill.id)}
                              className="w-full h-10 px-3 flex items-center justify-between hover:bg-black/[0.02] transition-colors"
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                <span className="text-sm font-medium text-foreground leading-5 tracking-[-0.1504px] truncate">{skill.label}</span>
                                {skill.category === 'personal' && (
                                  <span className="shrink-0 inline-flex items-center rounded-[4px] bg-muted text-muted-foreground text-[10px] font-medium leading-4 uppercase tracking-[0.04em] px-1.5">
                                    Additional
                                  </span>
                                )}
                              </span>
                              <span className={cn('text-xs font-medium leading-5 shrink-0 ml-2', bucket.hoursColor)}>{hours} hrs</span>
                            </button>

                            {expanded && (
                              <div className="border-t border-[#E2E8F0] px-3 py-3 flex flex-col gap-2">
                                {regimes.length > 0 && (
                                  <div className="flex items-start justify-between gap-3 text-xs">
                                    <span className="text-muted-foreground shrink-0">CPD regime</span>
                                    <span className="text-foreground text-right">{regimes.join(' · ')}</span>
                                  </div>
                                )}
                                <div className="flex items-start justify-between gap-3 text-xs">
                                  <span className="text-muted-foreground shrink-0">Required by</span>
                                  <span className="text-foreground text-right">
                                    {requiredBy.length > 0 ? requiredBy.join(' · ') : 'Personal focus'}
                                  </span>
                                </div>
                                <div className="flex items-start justify-between gap-3 text-xs">
                                  <span className="text-muted-foreground shrink-0">CPD time logged</span>
                                  <span className="text-foreground">{hours} hrs</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}

                      {bucketSkills.length === 0 && (
                        <p className="text-sm text-muted-foreground px-1 py-3 text-center">{bucket.emptyText}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Progress & Credentials ─────────────────────────────── */}
          <div className="flex flex-col gap-6">
            <p className="text-[20px] leading-7 tracking-[-0.6px] font-medium text-[#0a0a0a]">Progress &amp; Credentials</p>

            {/* Certificates */}
            {certificates.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {certificates.map(cert => {
                  const isClaimed = cert.status === 'claimed' || claimedCerts.has(cert.skillId)
                  return (
                    <div key={cert.skillId} className={`rounded-[10px] border bg-white px-4 py-4 ${isClaimed ? 'border-[rgba(229,229,229,0.6)]' : 'border-[#adeadd]'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-[10px] flex items-center justify-center shrink-0 relative ${isClaimed ? 'bg-[#f5f5f5]' : 'bg-[#ecf9f5]'}`}>
                          <Award className={`size-5 ${isClaimed ? 'text-muted-foreground' : 'text-[#003f42]'}`} />
                          {isClaimed && (
                            <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-[#009966] flex items-center justify-center">
                              <Check className="size-2.5 text-white" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#0a0a0a] leading-[17.5px]">{cert.journeyName}</p>
                          <p className="text-xs text-muted-foreground leading-4 mt-0.5">Issued {cert.issuedDate} · Score: {cert.capabilityScore}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {!isClaimed ? (
                            <Button
                              size="sm"
                              className="h-8 px-3 rounded-[10px] bg-[#003f42] text-[#fafafa] hover:bg-[#003f42]/90 shadow-none text-sm font-medium"
                              onClick={() => setClaimedCerts(prev => new Set([...prev, cert.skillId]))}
                            >
                              Claim Certificate
                            </Button>
                          ) : (
                            <>
                              <Button variant="outline" size="sm" className="h-8 px-3 rounded-[10px] text-sm font-medium shadow-none">
                                Share
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 px-3 rounded-[10px] gap-1.5 text-sm font-medium shadow-none">
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
            <div className="flex flex-col">
              <p className="text-sm font-medium leading-5 text-muted-foreground mb-2">Development History</p>
              {sortedMilestones.map((m, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-[rgba(229,229,229,0.4)] last:border-0">
                  <div className="flex items-center gap-4">
                    <span className="text-sm leading-5 text-muted-foreground w-20 shrink-0">{m.date}</span>
                    <p className="text-sm leading-5 text-[#0a0a0a]">{m.event}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm leading-5 text-muted-foreground capitalize">{m.type}</span>
                    {m.points > 0 && (
                      <span className="text-sm leading-5 text-muted-foreground">{m.points} pts</span>
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

      {/* ── Manage Focus & Skills Overlay ──────────────────────── */}
      {showManageFocus && (
        <FocusSkillsOverlay onClose={() => setShowManageFocus(false)} />
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
