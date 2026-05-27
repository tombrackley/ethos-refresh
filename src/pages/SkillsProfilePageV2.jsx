import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Clock, CheckCircle2, Check, Award, Settings, ChevronDown, Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import tenant from '@/config/tenant'

import ScoreBreakdownSheet from './skills/ScoreBreakdownSheet'
import SkillAssessmentOverlay from './skills/SkillAssessmentOverlay'
import FocusSkillsOverlay from './skills/FocusSkillsOverlay'

// ─── Data ────────────────────────────────────────────────────────────────────

const t = tenant.pages.learn
const SKILLS_PROFILE = t.skillsProfile

const STATUS_VARIANT = {
  Proficient: 'skill-proficient',
  Developing: 'skill-developing',
  Gap: 'skill-gap',
}

// Sort proficient skills first — this is a "what I can do" surface, not a
// "what I owe" surface.
const STATUS_ORDER = { Proficient: 0, Developing: 1, Gap: 2 }

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SkillsProfilePageV2() {
  const [expandedSkillId, setExpandedSkillId] = useState(null)
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false)
  const [assessmentSkill, setAssessmentSkill] = useState(null)
  const [assessmentRequested, setAssessmentRequested] = useState(false)
  const [showManageFocus, setShowManageFocus] = useState(false)

  const skills = SKILLS_PROFILE.skills
  const certificates = useMemo(() => SKILLS_PROFILE.certificates || [], [])

  const proficientCount = skills.filter(s => s.status === 'Proficient').length
  const developingCount = skills.filter(s => s.status === 'Developing').length
  const gapCount = skills.filter(s => s.status === 'Gap').length

  const filteredSkills = useMemo(() => (
    [...skills].sort((a, b) =>
      (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9)
      || a.label.localeCompare(b.label),
    )
  ), [skills])

  const certificateBySkillId = useMemo(() => {
    const map = {}
    certificates.forEach(c => { map[c.skillId] = c })
    return map
  }, [certificates])

  return (
    <div className="flex flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto bg-white px-8 pt-[52px] pb-12">
        <div className="max-w-[1100px] mx-auto space-y-8">

          {/* ── Page header ──────────────────────────────────────── */}
          <div>
            <h1 className="text-[28px] leading-[30px] tracking-[-1.12px] font-normal text-[#0A0A0A]">Skills Profile</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Map your capabilities and identify development opportunities.
            </p>
          </div>

          <div className="flex gap-6 items-start">

          {/* ── Left rail: user profile card ─────────────────────── */}
          <aside className="w-[300px] shrink-0 sticky top-0">
            <div className="rounded-lg bg-muted/40 p-4 space-y-3">
              {/* Top profile — no white card */}
              <div className="flex flex-col items-center text-center gap-3 py-2">
                <Avatar className="size-20">
                  <AvatarFallback className="bg-brand-100 text-brand-800 text-xl font-semibold">TB</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-base font-medium text-foreground leading-tight">Tom Brackley</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Senior Associate</p>
                  <p className="text-xs text-muted-foreground">Ethika Group</p>
                </div>
              </div>

              {/* Status counts card */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold tracking-normal text-muted-foreground/60">SKILLS TRACKED</span>
                  <span className="text-sm font-medium text-foreground tabular-nums">{skills.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-2 rounded-full bg-emerald-500" /> Proficient
                  </span>
                  <span className="font-medium text-foreground tabular-nums">{proficientCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-2 rounded-full bg-blue-500" /> Developing
                  </span>
                  <span className="font-medium text-foreground tabular-nums">{developingCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-2 rounded-full bg-slate-400" /> Gap
                  </span>
                  <span className="font-medium text-foreground tabular-nums">{gapCount}</span>
                </div>
              </div>

              {/* Actions card */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 flex flex-col gap-2">
                <span className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" /> Last assessed {SKILLS_PROFILE.lastAssessedDate}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAssessmentRequested(true)}
                  disabled={assessmentRequested}
                  className="gap-1.5 w-full justify-center"
                >
                  {assessmentRequested ? (
                    <><CheckCircle2 className="size-4" /> Assessment in Progress</>
                  ) : (
                    <>Request Assessment</>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 w-full justify-center"
                  onClick={() => setShowManageFocus(true)}
                >
                  <Settings className="size-4" /> Manage Skills
                </Button>
              </div>
            </div>
          </aside>

          {/* ── Right column: skills listing ─────────────────────── */}
          <main className="flex-1 min-w-0 space-y-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-[20px] leading-7 tracking-[-0.6px] font-medium text-foreground">Skills</h2>
                <p className="mt-1 text-sm text-muted-foreground">A capability snapshot — what you can do, with the evidence behind it.</p>
              </div>
              <button
                onClick={() => setShowScoreBreakdown(true)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                How is this calculated?
              </button>
            </div>

            <div className="space-y-3">
              {filteredSkills.length === 0 && (
                <p className="text-sm text-muted-foreground italic py-8 text-center">No skills match this filter.</p>
              )}
                {filteredSkills.map(skill => {
                  const expanded = expandedSkillId === skill.id
                  const evidence = SKILLS_PROFILE.evidence?.[skill.id]
                  const evidenceCount = evidence?.sources?.length || 0
                  const cert = certificateBySkillId[skill.id]
                  const regimes = (skill.source || '').split(' · ').map(r => r.trim()).filter(Boolean)
                  return (
                    <div key={skill.id} className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
                      <button
                        onClick={() => setExpandedSkillId(prev => prev === skill.id ? null : skill.id)}
                        className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-muted/30 transition-colors text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-foreground leading-tight truncate block">{skill.label}</span>
                        </div>
                        <Badge variant={STATUS_VARIANT[skill.status]} className="uppercase font-mono tracking-[0.06em]">{skill.level}</Badge>
                        <ChevronDown className={cn(
                          'size-4 text-muted-foreground/60 transition-transform shrink-0',
                          expanded && 'rotate-180',
                        )} />
                      </button>

                      {expanded && (
                        <div className="px-4 py-4 bg-white space-y-2">
                          <p className="text-xs text-muted-foreground">
                            Last demonstrated <span className="text-foreground font-medium">{skill.lastActivity}</span>
                            {evidenceCount > 0 && <> · <span className="text-foreground font-medium">{evidenceCount}</span> evidence {evidenceCount === 1 ? 'source' : 'sources'}</>}
                            {skill.targetLevel && skill.targetLevel !== skill.level && (
                              <> · Target <span className="text-foreground font-medium">{skill.targetLevel}</span></>
                            )}
                          </p>
                          {skill.description && (
                            <p className="text-sm text-foreground leading-relaxed">{skill.description}</p>
                          )}

                          {regimes.length > 0 && (
                            <div className="rounded-md bg-muted/40 p-3 space-y-2">
                              <p className="text-xs font-mono font-semibold tracking-normal text-muted-foreground/60">REGIMES</p>
                              <div className="flex flex-wrap gap-1.5">
                                {regimes.map(regime => (
                                  <span key={regime} className="inline-flex items-center rounded-full border border-border bg-white px-2.5 py-0.5 text-xs text-foreground">
                                    {regime}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {evidence?.sources?.length > 0 && (
                            <div className="rounded-md bg-muted/40 p-3 space-y-2">
                              <p className="text-xs font-mono font-semibold tracking-normal text-muted-foreground/60">EVIDENCE</p>
                              <div className="space-y-1.5">
                                {evidence.sources.map((src, idx) => (
                                  <div key={idx} className="flex items-start gap-2">
                                    <span className="size-3 rounded-full bg-emerald-500 flex items-center justify-center mt-[3px] shrink-0">
                                      <Check className="size-2 text-white" strokeWidth={3.5} />
                                    </span>
                                    <div className="text-sm">
                                      <span className="text-muted-foreground">{src.signal}</span>
                                      <span className="text-foreground"> — {src.detail}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {cert && (
                            <div className="flex items-center gap-3 rounded-md bg-muted/40 p-2.5">
                              <div className="size-6 rounded-md bg-emerald-100 flex items-center justify-center shrink-0">
                                <Award className="size-4 text-emerald-700" strokeWidth={1.5} />
                              </div>
                              <p className="flex-1 min-w-0 text-sm font-medium text-foreground truncate">{cert.journeyName}</p>
                              <p className="text-xs text-muted-foreground shrink-0">Issued {cert.issuedDate}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 shrink-0"
                                aria-label="Download certificate"
                              >
                                <Download className="size-3.5" />
                              </Button>
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </main>

          </div>

        </div>
      </div>

      {/* ── Overlays ───────────────────────────────────────────── */}
      <ScoreBreakdownSheet open={showScoreBreakdown} onOpenChange={setShowScoreBreakdown} />

      {showManageFocus && (
        <FocusSkillsOverlay onClose={() => setShowManageFocus(false)} />
      )}

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
