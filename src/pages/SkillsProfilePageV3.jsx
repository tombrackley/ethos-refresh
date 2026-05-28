import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
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

// Groups are rendered in this order, top-to-bottom.
const STATUS_GROUPS = [
  { status: 'Gap',        label: 'Gap',        dot: 'bg-slate-400' },
  { status: 'Developing', label: 'Developing', dot: 'bg-blue-500' },
  { status: 'Proficient', label: 'Proficient', dot: 'bg-emerald-500' },
]

// Canonical-mapping mock: each canonical skill aliases to a regime-specific
// category/competency name. Demonstrates the brainstorm idea that the user's
// single skill (e.g. "Ethics & Professional Responsibility") is tracked under
// different labels by each regulator. The displayed regime list in v3 is
// derived from the keys here, not from skill.source — so we can show the
// canonical skill being credited across multiple regimes even where the
// underlying tenant data lists only one.
const REGIME_ALIASES = {
  'Ethics & Professional Responsibility': {
    'Law Society NSW': 'Ethics & Professional Responsibility',
    'AICD': 'Director Conduct & Ethics',
    'Governance Institute': 'Ethics in Governance',
  },
  'Anti-Money Laundering & CTF': {
    'Law Society NSW': 'Substantive Law — AML/CTF',
    'AUSTRAC': 'AML/CTF Program Compliance',
    'AICD': 'Financial Crime Risk for Directors',
  },
  'Corporate Governance': {
    'AICD': 'Governance & Board Effectiveness',
    'Governance Institute': 'Corporate Governance',
    'Law Society NSW': 'Practice Management & Business Skills',
  },
  'Regulatory Change Management': {
    'Law Society NSW': 'Practice Management & Business Skills',
    'Governance Institute': 'Risk & Compliance',
    'AICD': 'Strategy & Risk',
  },
  'Contract Drafting & Negotiation': {
    'Law Society NSW': 'Professional Skills',
    'Law Institute of Victoria': 'Professional Skills',
  },
  'Data Privacy & Protection': {
    'Law Society NSW': 'Substantive Law — Privacy',
    'OAIC': 'Privacy Practitioner CPD',
    'IAPP': 'Privacy Programme Management',
  },
  'ESG & Sustainability Reporting': {
    'AICD': 'Strategy & Risk — ESG',
    'Governance Institute': 'Sustainability & Reporting',
    'ASIC': 'Disclosure Obligations',
  },
  'AI & Legal Technology': {
    'Law Society NSW': 'Substantive Law — Emerging Tech',
    'AICD': 'Technology & Innovation',
    'Law Institute of Victoria': 'Practice Innovation',
  },
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SkillsProfilePageV3() {
  const [expandedSkillId, setExpandedSkillId] = useState(null)
  const [collapsedGroups, setCollapsedGroups] = useState(() => new Set())
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false)
  const [assessmentSkill, setAssessmentSkill] = useState(null)
  const [assessmentRequested, setAssessmentRequested] = useState(false)
  const [showManageFocus, setShowManageFocus] = useState(false)

  const skills = SKILLS_PROFILE.skills
  const certificates = useMemo(() => SKILLS_PROFILE.certificates || [], [])

  const certificateBySkillId = useMemo(() => {
    const map = {}
    certificates.forEach(c => { map[c.skillId] = c })
    return map
  }, [certificates])

  const skillsByStatus = useMemo(() => {
    const groups = { Gap: [], Developing: [], Proficient: [] }
    skills.forEach(s => {
      if (groups[s.status]) groups[s.status].push(s)
    })
    Object.values(groups).forEach(arr => arr.sort((a, b) => a.label.localeCompare(b.label)))
    return groups
  }, [skills])

  const toggleGroup = (status) => setCollapsedGroups(prev => {
    const next = new Set(prev)
    if (next.has(status)) next.delete(status)
    else next.add(status)
    return next
  })

  return (
    <div className="flex flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto bg-white px-8 pt-[52px] pb-12">
        <div className="max-w-[1100px] mx-auto space-y-8">

          {/* Page header */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-[28px] leading-[30px] tracking-[-1.12px] font-normal text-[#0A0A0A]">Skills Profile</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Map your capabilities and identify development opportunities.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5" /> Last assessed {SKILLS_PROFILE.lastAssessedDate}
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
              <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setShowManageFocus(true)}>
                <Settings className="size-4" /> Manage Skills
              </Button>
            </div>
          </div>

          {/* Grouped sections */}
          <div className="space-y-6">
            {STATUS_GROUPS.map(group => {
              const groupSkills = skillsByStatus[group.status] || []
              const collapsed = collapsedGroups.has(group.status)
              return (
                <section key={group.status} className="space-y-2">
                  {/* Section header */}
                  <button
                    onClick={() => toggleGroup(group.status)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-muted/40 hover:bg-muted/60 transition-colors text-left"
                  >
                    <ChevronDown className={cn(
                      'size-4 text-muted-foreground transition-transform shrink-0',
                      collapsed && '-rotate-90',
                    )} />
                    <span className={cn('size-2 rounded-full shrink-0', group.dot)} />
                    <span className="text-sm font-medium text-foreground">{group.label}</span>
                    <span className="text-xs text-muted-foreground">{groupSkills.length}</span>
                  </button>

                  {/* Rows */}
                  {!collapsed && (
                    <div className="space-y-2">
                      {groupSkills.length === 0 && (
                        <p className="text-sm text-muted-foreground italic px-4 py-3">No skills in this group.</p>
                      )}
                      {groupSkills.map(skill => {
                        const expanded = expandedSkillId === skill.id
                        const evidence = SKILLS_PROFILE.evidence?.[skill.id]
                        const evidenceCount = evidence?.sources?.length || 0
                        const cert = certificateBySkillId[skill.id]
                        const aliasMap = REGIME_ALIASES[skill.label]
                        const regimes = aliasMap
                          ? Object.keys(aliasMap)
                          : (skill.source || '').split(' · ').map(r => r.trim()).filter(Boolean)
                        return (
                          <div key={skill.id} className="rounded-lg border border-[#E2E8F0] overflow-hidden">
                            <button
                              onClick={() => setExpandedSkillId(prev => prev === skill.id ? null : skill.id)}
                              className={cn(
                                'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                                expanded ? 'bg-muted/40' : 'hover:bg-muted/40',
                              )}
                            >
                              <span className="text-sm font-medium text-foreground flex-1 truncate">{skill.label}</span>
                              <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                                {evidenceCount} {evidenceCount === 1 ? 'source' : 'sources'}
                              </span>
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
                                    <p className="text-xs font-mono font-semibold tracking-normal text-muted-foreground/60">REGIME SKILLS</p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {regimes.map(regime => {
                                        const alias = REGIME_ALIASES[skill.label]?.[regime] || skill.label
                                        return (
                                          <Tooltip key={regime} delayDuration={150}>
                                            <TooltipTrigger asChild>
                                              <span className="inline-flex items-center h-8 rounded-full border border-border bg-white px-3 text-xs text-foreground cursor-default">
                                                {alias}
                                              </span>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">
                                              {regime}
                                            </TooltipContent>
                                          </Tooltip>
                                        )
                                      })}
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
                                    <Button variant="ghost" size="icon" className="size-7 shrink-0" aria-label="Download certificate">
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
                  )}
                </section>
              )
            })}
          </div>

        </div>
      </div>

      {/* Overlays */}
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
