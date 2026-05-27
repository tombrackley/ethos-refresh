import { useState, useMemo, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  X, Check, Award, Download, Upload, Plus, Sparkles, MoreHorizontal, Trash2, Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import tenant from '@/config/tenant'

import ScoreBreakdownSheet from './skills/ScoreBreakdownSheet'
import AddFocusOverlay from './skills/AddFocusOverlay'
import CvUploadOverlay from './skills/CvUploadOverlay'

// ─── Data ────────────────────────────────────────────────────────────────────

const t = tenant.pages.learn
const SKILLS_PROFILE = t.skillsProfile
const MAX_DOTS = 4

// Maps the seeded skill.status values onto the displayed level buckets.
const STATUS_MAP = { Gap: 'Emerging', Developing: 'Established', Proficient: 'Expert' }

const BUCKETS = [
  {
    key: 'Emerging',
    label: 'Emerging',
    bg: 'bg-[#f8f8f8]',
    dot: 'bg-[#828c9b]',
    labelColor: 'text-[#5f6776]',
    rowBg: 'bg-white',
    rowBorder: 'border-[#E2E8F0]',
    hoursColor: 'text-[#082760]',
    emptyText: 'No emerging skills',
  },
  {
    key: 'Established',
    label: 'Established',
    bg: 'bg-[#fdf9ff]',
    dot: 'bg-[#d379e7]',
    labelColor: 'text-[#a322aa]',
    rowBg: 'bg-white',
    rowBorder: 'border-[#E2E8F0]',
    hoursColor: 'text-[#082760]',
    emptyText: 'No established skills',
  },
  {
    key: 'Expert',
    label: 'Expert',
    bg: 'bg-[#f7fefb]',
    dot: 'bg-[#00d492]',
    labelColor: 'text-[#006045]',
    rowBg: 'bg-white',
    rowBorder: 'border-[#E2E8F0]',
    hoursColor: 'text-[#365314]',
    emptyText: 'No expert skills yet',
  },
]

// Demo nudges: recent activity suggests a level-up the user can accept (the
// system suggests, it never changes the level on its own).
const LEVEL_SUGGESTIONS = {
  sk6: { toLevel: 'Expert', reason: 'You completed the Privacy Act module and a CPD workshop' },
  sk8: { toLevel: 'Established', reason: 'You attended the AI in Legal Practice workshop' },
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SkillsProfilePage({ empty = false, unconfirmed = false }) {
  const [expandedSkillId, setExpandedSkillId] = useState(null)
  const [showAddFocus, setShowAddFocus] = useState(false)
  const [personalFocus, setPersonalFocus] = useState(
    () => empty ? [] : SKILLS_PROFILE.skills.filter(s => s.category === 'personal').map(s => s.label)
  )
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false)
  const [showCvUpload, setShowCvUpload] = useState(false)
  const [skillStatus, setSkillStatus] = useState(() => {
    const map = {}
    if (!empty) SKILLS_PROFILE.skills.forEach(s => { map[s.id] = STATUS_MAP[s.status] || s.status })
    return map
  })
  const [draggingId, setDraggingId] = useState(null)
  const [dragOverBucket, setDragOverBucket] = useState(null)
  const [addedEvidence, setAddedEvidence] = useState({})
  const [evidenceFormSkillId, setEvidenceFormSkillId] = useState(null)
  const [evidenceDraft, setEvidenceDraft] = useState('')
  const [dismissedNudges, setDismissedNudges] = useState([])
  const [customSkills, setCustomSkills] = useState([])
  const [addingBucket, setAddingBucket] = useState(null)
  const [newSkillDraft, setNewSkillDraft] = useState('')
  const customIdRef = useRef(0)
  const [removedIds, setRemovedIds] = useState([])
  const [removedEvidence, setRemovedEvidence] = useState({})
  const [confirmedIds, setConfirmedIds] = useState([])
  const [reviewBannerDismissed, setReviewBannerDismissed] = useState(false)

  const skills = useMemo(() => empty ? [] : SKILLS_PROFILE.skills, [empty])
  const milestones = useMemo(() => empty ? [] : (SKILLS_PROFILE.milestones || []), [empty])
  const certificates = useMemo(() => empty ? [] : (SKILLS_PROFILE.certificates || []), [empty])

  const certificateBySkillId = useMemo(() => {
    const map = {}
    certificates.forEach(c => { map[c.skillId] = c })
    return map
  }, [certificates])

  // Group skills into the Emerging / Established / Expert buckets. Reads from
  // local skillStatus state so drag-and-drop moves persist.
  const allSkills = useMemo(
    () => [...skills, ...customSkills].filter(s => !removedIds.includes(s.id)),
    [skills, customSkills, removedIds]
  )
  const skillsByStatus = useMemo(() => {
    const groups = { Emerging: [], Established: [], Expert: [] }
    allSkills.forEach(s => {
      const st = skillStatus[s.id]
      if (groups[st]) groups[st].push(s)
    })
    return groups
  }, [allSkills, skillStatus])

  // In unconfirmed mode, org-assigned skills stay "pending" until the user
  // reviews them (moves them or confirms).
  const isUnconfirmed = (id) => unconfirmed && !confirmedIds.includes(id)
  const unconfirmedCount = unconfirmed ? allSkills.filter(s => !confirmedIds.includes(s.id)).length : 0
  const confirmSkill = (id) => setConfirmedIds(prev => prev.includes(id) ? prev : [...prev, id])

  const handleDropOnBucket = (bucketKey) => {
    if (draggingId != null) {
      const id = draggingId
      setSkillStatus(prev => ({ ...prev, [id]: bucketKey }))
      confirmSkill(id)
    }
    setDraggingId(null)
    setDragOverBucket(null)
  }

  const saveEvidence = (skillId) => {
    const text = evidenceDraft.trim()
    if (!text) return
    const date = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    setAddedEvidence(prev => ({ ...prev, [skillId]: [...(prev[skillId] || []), { signal: 'Self-reported', detail: text, date }] }))
    setEvidenceDraft('')
    setEvidenceFormSkillId(null)
  }

  const acceptNudge = (skillId, toLevel) => setSkillStatus(prev => ({ ...prev, [skillId]: toLevel }))
  const dismissNudge = (skillId) => setDismissedNudges(prev => [...prev, skillId])

  const addSkill = (bucketKey) => {
    const label = newSkillDraft.trim()
    if (!label) return
    const id = `custom-${customIdRef.current++}`
    setCustomSkills(prev => [...prev, { id, label, category: 'personal' }])
    setSkillStatus(prev => ({ ...prev, [id]: bucketKey }))
    setNewSkillDraft('')
  }
  const cancelAddSkill = () => { setAddingBucket(null); setNewSkillDraft('') }

  const addCvSkills = (labels) => {
    if (!labels.length) return
    const newOnes = labels.map(label => ({ id: `custom-${customIdRef.current++}`, label, category: 'personal' }))
    setCustomSkills(prev => [...prev, ...newOnes])
    setSkillStatus(prev => {
      const next = { ...prev }
      newOnes.forEach(s => { next[s.id] = 'Emerging' })
      return next
    })
  }

  const moveSkill = (skillId, toLevel) => {
    setSkillStatus(prev => ({ ...prev, [skillId]: toLevel }))
    confirmSkill(skillId)
  }
  const removeSkill = (skillId) => setRemovedIds(prev => [...prev, skillId])
  const removeEvidence = (skillId, key) => setRemovedEvidence(prev => ({ ...prev, [skillId]: [...(prev[skillId] || []), key] }))

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
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowCvUpload(true)}>
                <Upload className="size-4" /> Upload CV
              </Button>
            </div>
          </div>

          {/* ── Your Skills Matrix ─────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <p className="text-[17px] leading-5 tracking-[-0.1504px] font-medium text-[#0a0a0a]">Your Skills Matrix</p>

            {allSkills.length === 0 && (
              <div className="flex flex-col items-center gap-3 rounded-[12px] border border-dashed border-border bg-muted/20 px-6 py-8 text-center">
                <span className="size-12 rounded-full bg-brand-50 flex items-center justify-center">
                  <Sparkles className="size-5 text-brand-700" />
                </span>
                <div className="space-y-1">
                  <p className="text-base font-medium text-foreground">Build your skills matrix</p>
                  <p className="text-sm text-muted-foreground max-w-md">Upload your CV and we'll pull out your skills automatically — then drag them into Emerging, Established or Expert. You can also add them manually below.</p>
                </div>
                <Button size="sm" className="gap-1.5" onClick={() => setShowCvUpload(true)}>
                  <Upload className="size-4" /> Upload CV
                </Button>
              </div>
            )}

            {unconfirmed && unconfirmedCount > 0 && !reviewBannerDismissed && (
              <div className="flex items-center gap-3 rounded-[12px] border border-blue-200 bg-blue-50/60 px-4 py-3">
                <Info className="size-4 text-blue-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900">Your organisation assigned these skills</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Review each one — drag it to the level that reflects where you're at, then confirm. {unconfirmedCount} left to review.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setReviewBannerDismissed(true)}>Dismiss</Button>
                  <Button variant="outline" size="sm" onClick={() => setConfirmedIds(allSkills.map(s => s.id))}>Accept all</Button>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              {BUCKETS.map(bucket => {
                const bucketSkills = skillsByStatus[bucket.key] || []
                return (
                  <div
                    key={bucket.key}
                    onDragOver={(e) => { e.preventDefault(); if (dragOverBucket !== bucket.key) setDragOverBucket(bucket.key) }}
                    onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOverBucket(null) }}
                    onDrop={() => handleDropOnBucket(bucket.key)}
                    className={cn(
                      `flex-1 min-w-0 ${bucket.bg} p-3 rounded-[16px] flex flex-col gap-2 transition-shadow`,
                      dragOverBucket === bucket.key && 'ring-2 ring-inset ring-brand-400',
                    )}
                  >
                    <div className="flex items-center gap-2 px-1 h-5">
                      <span className={`size-2 rounded-full ${bucket.dot}`} />
                      <span className={`text-sm font-medium leading-5 ${bucket.labelColor}`}>{bucket.label}</span>
                      <span className="text-xs text-muted-foreground leading-4">{bucketSkills.length}</span>
                    </div>

                    <div className="flex flex-col gap-2 min-h-[60px]">
                      {bucketSkills.map(skill => {
                        const expanded = expandedSkillId === skill.id
                        const evidence = SKILLS_PROFILE.evidence?.[skill.id]
                        const addedForSkill = addedEvidence[skill.id] || []
                        const evidenceItems = [
                          ...(evidence?.sources || []).map((src, i) => ({ ...src, _key: `b${i}` })),
                          ...addedForSkill.map((src, i) => ({ ...src, _key: `a${i}` })),
                        ].filter(it => !(removedEvidence[skill.id] || []).includes(it._key))
                        const suggestion = LEVEL_SUGGESTIONS[skill.id]
                        const cert = certificateBySkillId[skill.id]
                        const unconfirmedHere = isUnconfirmed(skill.id)
                        return (
                          <div
                            key={skill.id}
                            draggable={!expanded}
                            onDragStart={(e) => { setDraggingId(skill.id); e.dataTransfer.effectAllowed = 'move' }}
                            onDragEnd={() => { setDraggingId(null); setDragOverBucket(null) }}
                            className={cn(
                              'group/card w-full border rounded-[8px] overflow-hidden transition-all',
                              !expanded && 'cursor-grab active:cursor-grabbing',
                              bucket.rowBg,
                              unconfirmedHere ? 'border-dashed border-[#cbd5e1]' : bucket.rowBorder,
                              draggingId === skill.id && 'opacity-50',
                            )}
                          >
                            <div className="flex items-center h-10 px-3 hover:bg-black/[0.02] transition-colors">
                              <button
                                onClick={() => setExpandedSkillId(prev => prev === skill.id ? null : skill.id)}
                                className="flex-1 min-w-0 h-full flex items-center text-left"
                              >
                                <span className="text-sm font-medium text-foreground leading-5 tracking-[-0.1504px] truncate">{skill.label}</span>
                              </button>
                              {unconfirmedHere && (
                                <div className="flex items-center gap-0.5 shrink-0 mr-0.5">
                                  <button
                                    onClick={() => removeSkill(skill.id)}
                                    aria-label="Reject skill"
                                    className="size-6 flex items-center justify-center rounded-md text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <X className="size-4" />
                                  </button>
                                  <button
                                    onClick={() => confirmSkill(skill.id)}
                                    aria-label="Confirm skill"
                                    className="size-6 flex items-center justify-center rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                                  >
                                    <Check className="size-4" />
                                  </button>
                                </div>
                              )}
                              {!unconfirmedHere && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    aria-label="Skill options"
                                    className="shrink-0 ml-2 size-6 flex items-center justify-center rounded-md text-muted-foreground opacity-0 group-hover/card:opacity-100 data-[state=open]:opacity-100 hover:bg-black/[0.06] transition-all"
                                  >
                                    <MoreHorizontal className="size-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44">
                                  {BUCKETS.filter(b => b.key !== skillStatus[skill.id]).map(b => (
                                    <DropdownMenuItem key={b.key} onClick={() => moveSkill(skill.id, b.key)}>
                                      Move to {b.label}
                                    </DropdownMenuItem>
                                  ))}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => removeSkill(skill.id)} className="text-destructive focus:text-destructive">
                                    <Trash2 className="size-3.5" /> Remove skill
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              )}
                            </div>

                            {!unconfirmed && suggestion && skillStatus[skill.id] !== suggestion.toLevel && !dismissedNudges.includes(skill.id) && (
                              <div className="flex items-start gap-2 border-t border-[#E2E8F0] bg-amber-50/60 px-3 py-2">
                                <Sparkles className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-amber-900 leading-snug">{suggestion.reason} — move to <span className="font-medium">{suggestion.toLevel}</span>?</p>
                                  <div className="flex items-center gap-3 mt-1.5">
                                    <Button variant="outline" size="sm" onClick={() => acceptNudge(skill.id, suggestion.toLevel)}>Move to {suggestion.toLevel}</Button>
                                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors" onClick={() => dismissNudge(skill.id)}>Dismiss</button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {expanded && (
                              <div className="border-t border-[#E2E8F0] px-4 py-4 bg-white space-y-3">
                                <div className="space-y-1.5">
                                  <p className="text-xs font-mono font-semibold tracking-normal text-muted-foreground/60">EVIDENCE</p>
                                  {evidenceItems.length ? (
                                    <div className="space-y-0.5">
                                      {evidenceItems.map((item) => (
                                        <div key={item._key} className="group/ev flex items-center gap-2 rounded px-1 -mx-1 py-0.5 hover:bg-black/[0.03] transition-colors">
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <button className="flex flex-1 min-w-0 items-start gap-2 text-left">
                                                <span className="size-3 rounded-full bg-emerald-500 flex items-center justify-center mt-[3px] shrink-0">
                                                  <Check className="size-2 text-white" strokeWidth={3.5} />
                                                </span>
                                                <span className="text-sm text-foreground">{item.detail}</span>
                                              </button>
                                            </TooltipTrigger>
                                            <TooltipContent
                                              side="top"
                                              className="max-w-[260px] bg-white text-foreground border border-border shadow-md"
                                              arrowClassName="bg-white fill-white"
                                            >
                                              <p className="text-sm font-medium text-foreground">{item.detail}</p>
                                              <p className="text-sm text-muted-foreground mt-1">
                                                {item.signal}
                                                {item.date && <> · {item.date}</>}
                                                {item.score && <> · {item.score}</>}
                                              </p>
                                            </TooltipContent>
                                          </Tooltip>
                                          <button
                                            onClick={() => removeEvidence(skill.id, item._key)}
                                            aria-label="Remove evidence"
                                            className="shrink-0 size-5 flex items-center justify-center rounded text-muted-foreground/50 opacity-0 group-hover/ev:opacity-100 hover:text-foreground hover:bg-black/[0.06] transition-all"
                                          >
                                            <X className="size-3" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">No evidence yet — add work or activity, including things done outside Ethos.</p>
                                  )}
                                </div>

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

                                {/* Add evidence — centered ghost button at the bottom */}
                                {evidenceFormSkillId === skill.id ? (
                                  <div className="flex items-center gap-2">
                                    <Input
                                      value={evidenceDraft}
                                      onChange={(e) => setEvidenceDraft(e.target.value)}
                                      onKeyDown={(e) => { if (e.key === 'Enter') saveEvidence(skill.id) }}
                                      placeholder="e.g. Led contract negotiation for the Acme merger"
                                      className="h-8 text-sm bg-white"
                                      autoFocus
                                    />
                                    <Button size="sm" className="h-8 shrink-0" onClick={() => saveEvidence(skill.id)}>Add</Button>
                                  </div>
                                ) : (
                                  <div className="flex justify-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="gap-1.5 text-muted-foreground"
                                      onClick={() => { setEvidenceFormSkillId(skill.id); setEvidenceDraft('') }}
                                    >
                                      <Plus className="size-3.5" /> Add evidence
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}

                      {addingBucket === bucket.key ? (
                        <Input
                          autoFocus
                          value={newSkillDraft}
                          onChange={(e) => setNewSkillDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') addSkill(bucket.key)
                            if (e.key === 'Escape') cancelAddSkill()
                          }}
                          onBlur={() => { if (!newSkillDraft.trim()) cancelAddSkill() }}
                          placeholder="Skill name…"
                          className="h-10 rounded-[8px] bg-white text-sm font-medium px-3"
                        />
                      ) : (
                        <button
                          onClick={() => { setAddingBucket(bucket.key); setNewSkillDraft('') }}
                          className="flex items-center gap-1.5 w-full h-9 px-2 rounded-[8px] text-sm font-medium text-muted-foreground hover:bg-black/[0.04] transition-colors"
                        >
                          <Plus className="size-3.5" /> Add skill
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Progress & Credentials ─────────────────────────────── */}
          {milestones.length > 0 && (
          <div className="flex flex-col gap-6">
            <p className="text-[20px] leading-7 tracking-[-0.6px] font-medium text-[#0a0a0a]">Progress &amp; Credentials</p>

            {/* Development History */}
            <div className="flex flex-col">
              <p className="text-sm font-medium leading-5 text-muted-foreground mb-2">Development History</p>
              {sortedMilestones.map((m, i) => {
                const mappedSkill = skills.find(s => s.id === m.skillId)
                return (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-[rgba(229,229,229,0.4)] last:border-0">
                    <div className="flex items-start gap-4">
                      <span className="text-sm leading-5 text-muted-foreground w-20 shrink-0 mt-px">{m.date}</span>
                      <div>
                        <p className="text-sm leading-5 text-[#0a0a0a]">{m.event}</p>
                        {mappedSkill && (
                          <p className="text-xs leading-4 text-muted-foreground mt-0.5">
                            Skill: {mappedSkill.label}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm leading-5 text-muted-foreground capitalize">{m.type}</span>
                      {m.points > 0 && (
                        <span className="text-sm leading-5 text-muted-foreground">{m.points} pts</span>
                      )}
                      {m.type === 'certification' && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-7 rounded-md shadow-none"
                          aria-label="View certification"
                        >
                          <Award className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          )}

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
      {showCvUpload && (
        <CvUploadOverlay onClose={() => setShowCvUpload(false)} onAddSkills={addCvSkills} />
      )}
    </div>
  )
}
