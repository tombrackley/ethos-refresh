import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  Dialog, DialogContent, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import {
  Search, ChevronDown,
  Plus, MoreVertical, X,
} from 'lucide-react'
import tenant from '@/config/tenant'

const TEAM_CAP = tenant.pages.learn.teamCapability
const SKILLS_PROFILE = tenant.pages.learn.skillsProfile

// Vault-style pill tab — soft mint when active, neutral muted when inactive.
// `group-data-[variant=default]/tabs-list:` prefix matches the shadcn base
// shadow rule's specificity so we can flatten it without !important.
const CHIP_TAB =
  'inline-flex items-center gap-1.5 rounded-lg h-8 px-3 py-1.5 border border-transparent ' +
  'bg-muted/60 hover:bg-muted text-foreground text-sm font-medium tracking-[-0.28px] ' +
  'data-[state=active]:bg-[#dffff2] data-[state=active]:border-[rgba(14,95,91,0.5)] ' +
  'data-[state=active]:text-[#0e5f5b] ' +
  'group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none'

// Self-assessed proficiency scale — aligned with the user-facing Skills Profile.
// 1 = Emerging, 2 = Established, 3 = Expert. (No level 0 — undefined means
// "not yet assessed", rendered as a "+" tile.)
const MAX_DOTS = 3
const LEVEL_LABELS = { 1: 'Emerging', 2: 'Established', 3: 'Expert' }

const DOT_COLORS = {
  1: 'bg-orange-400',
  2: 'bg-amber-400',
  3: 'bg-lime-500',
}

function DotIndicator({ dots }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: MAX_DOTS }).map((_, i) => (
        <div
          key={i}
          className={`size-2 rounded-full ${i < dots ? DOT_COLORS[dots] : 'bg-[#e5e7eb]'}`}
        />
      ))}
    </div>
  )
}

// Colored numeric tile for the team-skills matrix — softer palette.
// 1 = Emerging (grey), 2 = Established (soft yellow), 3 = Expert (mint).
// Undefined / 0 → empty muted tile with +.
const TILE_BY_LEVEL = {
  1: 'bg-slate-200 text-slate-700',
  2: 'bg-yellow-100 text-yellow-900',
  3: 'bg-emerald-100 text-emerald-800',
}

// Background-only map for status dots (no text color), matched to the matrix
// tile palette so the All Team Skills view reads as the same scale.
const DOT_BG_BY_LEVEL = {
  1: 'bg-slate-200',
  2: 'bg-yellow-100',
  3: 'bg-emerald-100',
}

function LevelTile({ level, belowTarget }) {
  // Below-target tiles get a soft rose ring so role gaps jump out when the
  // matrix is filtered to a specific role profile.
  const gapClass = belowTarget ? 'ring-1 ring-rose-400/70' : ''
  if (!level) {
    return (
      <div className={`mx-auto flex size-[22px] items-center justify-center rounded-md bg-muted text-muted-foreground ${gapClass}`}>
        <Plus className="size-3" />
      </div>
    )
  }
  return (
    <div className={`mx-auto flex size-[22px] items-center justify-center rounded-md text-xs font-semibold ${TILE_BY_LEVEL[level]} ${gapClass}`}>
      {level}
    </div>
  )
}

// ─── Skills Matrix Tab ──────────────────────────────────────────────────────

function SkillsMatrixTab() {
  return <SkillsMatrix members={TEAM_CAP.members} />
}

// ─── Skills Matrix ──────────────────────────────────────────────────────────

function SkillsMatrix({ members }) {
  const [search, setSearch] = useState('')
  const [roleId, setRoleId] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  // Skills the admin has added via the "Add skills" dialog this session.
  // Mock-only — real impl would persist to the org-tracked skills list.
  const [customSkills, setCustomSkills] = useState([])
  // Admin edits to individual ratings, keyed `${memberId}:${skillId}`.
  // Each value: { level: 0|1|2|3, evidence: [{ id, description, date }] }.
  const [overrides, setOverrides] = useState({})
  // Which cell the rating dialog is currently editing.
  const [editingCell, setEditingCell] = useState(null)

  // Merge canonical org skills + locally-added ones into a single lookup.
  const skillsById = {
    ...Object.fromEntries(SKILLS_PROFILE.skills.map(s => [s.id, s])),
    ...Object.fromEntries(customSkills.map(s => [s.id, s])),
  }
  // Resolve role filter — when a role is picked, the matrix axis narrows to
  // that role's required skills (custom skills hide since they aren't part of
  // any role profile yet). "All roles" falls back to the full org catalog +
  // any session-added custom skills.
  const selectedRole = roleId !== 'all' ? (TEAM_CAP.roles || []).find(r => r.id === roleId) : null
  const baseSkillIds = selectedRole
    ? Object.keys(selectedRole.requirements)
    : [
        ...(TEAM_CAP.skillGroups || []).flatMap(g => g.skillIds),
        ...customSkills.map(s => s.id),
      ]

  // Filter the flat skill list by search term against the skill label.
  const q = search.trim().toLowerCase()
  const visibleSkillIds = baseSkillIds.filter(id => {
    if (!q) return true
    return skillsById[id]?.label.toLowerCase().includes(q)
  })

  function handleAddSkills(labels) {
    setCustomSkills(prev => [
      ...prev,
      ...labels.map((label, i) => ({ id: `custom-${Date.now()}-${i}`, label })),
    ])
  }

  // Resolve a cell's current level — admin override wins over the mock value.
  function getLevel(memberId, skillId) {
    const key = `${memberId}:${skillId}`
    if (key in overrides) return overrides[key].level
    return members.find(m => m.id === memberId)?.skills[skillId] || 0
  }

  function getEvidence(memberId, skillId) {
    return overrides[`${memberId}:${skillId}`]?.evidence ?? []
  }

  function saveRating(memberId, skillId, level, evidence) {
    setOverrides(prev => ({
      ...prev,
      [`${memberId}:${skillId}`]: { level, evidence },
    }))
  }

  const editingMember = editingCell ? members.find(m => m.id === editingCell.memberId) : null
  const editingSkill = editingCell ? skillsById[editingCell.skillId] : null

  return (
    <div className="rounded-lg border border-border bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-border bg-muted/20 px-3 py-2.5">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search a skill or category"
            className="h-9 pl-9"
          />
        </div>
        <FilterDropdown
          label="Roles"
          value={roleId}
          options={[
            { value: 'all', label: 'All roles' },
            ...(TEAM_CAP.roles || []).map(r => ({ value: r.id, label: r.label })),
          ]}
          onChange={setRoleId}
        />
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" /> Add skills
          </Button>
        </div>
      </div>

      {/* Matrix */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-background">
              <th className="w-[260px] sticky left-0 z-10 bg-background px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Skill
              </th>
              {selectedRole && (
                <th className="min-w-[72px] border-l border-border/60 px-2 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Target
                </th>
              )}
              {members.map(m => (
                <th key={m.id} className="min-w-[72px] border-l border-border/60 px-2 py-3 text-center align-bottom">
                  <div className="flex flex-col items-center gap-1">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-xs bg-brand-50 text-brand-700">{m.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-foreground truncate max-w-[64px]">{m.name.split(' ')[0]}</span>
                  </div>
                </th>
              ))}
              <th className="w-8 border-l border-border/60" />
            </tr>
          </thead>
          <tbody>
            {visibleSkillIds.map(skillId => {
              const skill = skillsById[skillId]
              if (!skill) return null
              const target = selectedRole?.requirements[skillId] || 0
              return (
                <tr key={skillId} className="border-b border-border/60 last:border-0 hover:bg-muted/10">
                  <td className="sticky left-0 bg-background px-4 py-2 text-sm font-medium text-foreground">
                    {skill.label}
                  </td>
                  {selectedRole && (
                    <td className="border-l border-border/60 px-2 py-2">
                      <LevelTile level={target} />
                    </td>
                  )}
                  {members.map(m => {
                    const memberLevel = getLevel(m.id, skillId)
                    const belowTarget = !!selectedRole && memberLevel < target
                    return (
                      <td key={m.id} className="border-l border-border/60 px-2 py-2">
                        <button
                          type="button"
                          onClick={() => setEditingCell({ memberId: m.id, skillId })}
                          aria-label={`Edit ${skill.label} rating for ${m.name}`}
                          className="mx-auto block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                          <LevelTile level={memberLevel} belowTarget={belowTarget} />
                        </button>
                      </td>
                    )
                  })}
                  <td className="border-l border-border/60 px-2 py-2 text-right">
                    <button
                      type="button"
                      aria-label={`Actions for ${skill.label}`}
                      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
            {visibleSkillIds.length === 0 && (
              <tr>
                <td colSpan={members.length + (selectedRole ? 3 : 2)} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No skills match "{search}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddSkillsDialog open={addOpen} onOpenChange={setAddOpen} onAdd={handleAddSkills} />

      <EditRatingDialog
        open={!!editingCell}
        onOpenChange={(o) => { if (!o) setEditingCell(null) }}
        member={editingMember}
        skill={editingSkill}
        level={editingCell ? getLevel(editingCell.memberId, editingCell.skillId) : 0}
        evidence={editingCell ? getEvidence(editingCell.memberId, editingCell.skillId) : []}
        onSave={(level, evidence) => {
          saveRating(editingCell.memberId, editingCell.skillId, level, evidence)
          setEditingCell(null)
        }}
      />
    </div>
  )
}

function AddSkillsDialog({ open, onOpenChange, onAdd }) {
  const [fields, setFields] = useState([''])

  function handleOpenChange(next) {
    if (!next) setFields([''])
    onOpenChange(next)
  }

  function updateField(index, value) {
    setFields(prev => prev.map((v, i) => (i === index ? value : v)))
  }

  function removeField(index) {
    setFields(prev => prev.filter((_, i) => i !== index))
  }

  function addField() {
    setFields(prev => [...prev, ''])
  }

  function handleSubmit() {
    const cleaned = fields.map(f => f.trim()).filter(Boolean)
    if (cleaned.length > 0) onAdd(cleaned)
    setFields([''])
    onOpenChange(false)
  }

  const canSubmit = fields.some(f => f.trim().length > 0)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-white p-6 sm:max-w-md">
        <DialogTitle>Add skills</DialogTitle>
        <DialogDescription>
          Add new skills to the org-tracked list. Team members will be able to self-assess against them.
        </DialogDescription>

        <div className="mt-2 space-y-2">
          {fields.map((value, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                autoFocus={i === fields.length - 1}
                value={value}
                onChange={e => updateField(i, e.target.value)}
                placeholder="Skill name"
                className="h-9"
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField(i)}
                  aria-label="Remove skill"
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addField}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Plus className="size-3.5" /> Add another
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-4">
          <Button variant="outline" size="sm" onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={!canSubmit}>Add skills</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EditRatingDialog({ open, onOpenChange, member, skill, level, evidence, onSave }) {
  // Working copies — committed only on Save.
  const [draftLevel, setDraftLevel] = useState(level)
  const [draftEvidence, setDraftEvidence] = useState(evidence)
  const [adding, setAdding] = useState(false)
  const [newEvidence, setNewEvidence] = useState('')

  // Reset working state whenever the dialog opens against a new cell.
  function handleOpenChange(next) {
    if (next) {
      setDraftLevel(level)
      setDraftEvidence(evidence)
      setAdding(false)
      setNewEvidence('')
    }
    onOpenChange(next)
  }

  function addEvidence() {
    const text = newEvidence.trim()
    if (!text) return
    setDraftEvidence(prev => [
      ...prev,
      { id: `ev-${Date.now()}`, description: text, date: 'Just added' },
    ])
    setNewEvidence('')
    setAdding(false)
  }

  function removeEvidence(id) {
    setDraftEvidence(prev => prev.filter(e => e.id !== id))
  }

  if (!member || !skill) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-white p-6 sm:max-w-md">
        <div className="space-y-1">
          <DialogTitle>Edit rating</DialogTitle>
          <DialogDescription>{member.name} · {skill.label}</DialogDescription>
        </div>

        {/* Level selector */}
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Level</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(lvl => {
              const isSelected = draftLevel === lvl
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDraftLevel(lvl)}
                  className={`flex-1 rounded-md border px-3 h-9 text-sm font-medium transition-colors ${
                    isSelected
                      ? `${TILE_BY_LEVEL[lvl]} border-foreground/15`
                      : 'bg-white text-foreground border-border hover:bg-muted/50'
                  }`}
                >
                  {lvl}. {LEVEL_LABELS[lvl]}
                </button>
              )
            })}
          </div>
          {draftLevel > 0 && (
            <button
              type="button"
              onClick={() => setDraftLevel(0)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear rating
            </button>
          )}
        </div>

        {/* Evidence list */}
        <div className="mt-5 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Evidence</p>
          {draftEvidence.length === 0 && !adding && (
            <p className="text-sm text-muted-foreground">No evidence yet.</p>
          )}
          {draftEvidence.length > 0 && (
            <ul className="space-y-1.5">
              {draftEvidence.map(ev => (
                <li key={ev.id} className="flex items-start gap-2 rounded-md border border-border bg-muted/20 px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{ev.description}</p>
                    <p className="text-xs text-muted-foreground">{ev.date}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEvidence(ev.id)}
                    aria-label="Remove evidence"
                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {adding ? (
            <div className="space-y-2 rounded-md border border-border p-3">
              <Input
                autoFocus
                value={newEvidence}
                onChange={e => setNewEvidence(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEvidence() } }}
                placeholder="Describe the evidence (e.g. led a privacy review, completed cert, etc.)"
                className="h-9"
              />
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => { setAdding(false); setNewEvidence('') }}>Cancel</Button>
                <Button size="sm" onClick={addEvidence} disabled={!newEvidence.trim()}>Add</Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setAdding(true)}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Plus className="size-3.5" /> Add evidence
            </Button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-end gap-2 border-t border-border pt-4">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={() => onSave(draftLevel, draftEvidence)}>Save changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FilterDropdown({ label, value, options, onChange }) {
  // Accepts either string[] (label==value) or { value, label }[] for richer
  // option payloads where you need an ID separate from the display label.
  const items = options.map(o => (typeof o === 'string' ? { value: o, label: o } : o))
  const display = items.find(i => i.value === value)?.label ?? value
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 font-normal">
            {display}
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {items.map(item => (
            <DropdownMenuItem key={item.value} onClick={() => onChange(item.value)} className="text-sm">
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// ─── All Team Skills Tab ────────────────────────────────────────────────────

function AllTeamSkillsTab() {
  const [expandedId, setExpandedId] = useState(null)
  const members = TEAM_CAP.members

  // Aggregate two sources into one list:
  //   1. Org-tracked skills (canonical) — every skill from skillGroups
  //   2. Personal skills — added by individuals, grouped by normalised label
  // Skills whose personal label matches an org skill label collapse into the
  // org entry (no double-counting).
  const orgSkillIds = (TEAM_CAP.skillGroups || []).flatMap(g => g.skillIds)
  const skillsById = Object.fromEntries(SKILLS_PROFILE.skills.map(s => [s.id, s]))
  const orgLabels = new Set(orgSkillIds.map(id => skillsById[id]?.label.toLowerCase()).filter(Boolean))

  const orgAggregated = orgSkillIds.map(skillId => {
    const skill = skillsById[skillId]
    if (!skill) return null
    const rated = members
      .map(m => ({ id: m.id, name: m.name, initials: m.initials, level: m.skills?.[skillId] || 0 }))
      .filter(m => m.level > 0)
      .sort((a, b) => b.level - a.level)
    const avg = rated.length > 0 ? rated.reduce((sum, m) => sum + m.level, 0) / rated.length : 0
    return {
      id: `org-${skillId}`,
      label: skill.label,
      source: 'org',
      memberCount: rated.length,
      avg,
      members: rated,
    }
  }).filter(Boolean)

  const personalMap = new Map()
  members.forEach(m => {
    (m.personalSkills || []).forEach(ps => {
      const key = ps.label.toLowerCase().trim()
      if (orgLabels.has(key)) return
      if (!personalMap.has(key)) personalMap.set(key, { label: ps.label, members: [] })
      personalMap.get(key).members.push({ id: m.id, name: m.name, initials: m.initials, level: ps.level })
    })
  })
  const personalAggregated = Array.from(personalMap.values()).map(p => ({
    id: `personal-${p.label}`,
    label: p.label,
    source: 'personal',
    memberCount: p.members.length,
    avg: p.members.reduce((sum, m) => sum + m.level, 0) / p.members.length,
    members: p.members.sort((a, b) => b.level - a.level),
  }))

  // Org skills come first, personal skills second. Within each group, sort by
  // team average descending (highest-coverage strength → weakest).
  const all = [...orgAggregated, ...personalAggregated].sort((a, b) => {
    if (a.source !== b.source) return a.source === 'org' ? -1 : 1
    return b.avg - a.avg
  })

  return (
    <div>
      {all.map(item => {
        const isExpanded = expandedId === item.id
        return (
          <div key={item.id} className="border-b border-border/60 last:border-0">
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
              className="w-full px-2 py-3 text-left hover:bg-muted/10 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <span
                    aria-hidden
                    className={`size-2.5 shrink-0 rounded-full ${Math.round(item.avg) > 0 ? DOT_BG_BY_LEVEL[Math.round(item.avg)] : 'bg-muted'}`}
                  />
                  <p className="text-sm font-medium text-foreground truncate">{item.label}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-xs text-muted-foreground w-[100px] text-right">
                    {item.memberCount} {item.memberCount === 1 ? 'member' : 'members'}
                  </div>
                  <ChevronDown className={`size-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </button>

            {isExpanded && (
              <div className="px-2 pb-4 pt-1">
                {item.members.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No team members have rated this skill yet.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {item.members.map(m => (
                      <div key={m.id} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="size-6">
                            <AvatarFallback className="text-xs bg-brand-50 text-brand-700">{m.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-foreground truncate">{m.name}</span>
                        </div>
                        <DotIndicator dots={m.level} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function AdminTeamCapabilityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Team Capability</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Monitor team skills, identify gaps, and track capability development</p>
      </div>

      <Tabs defaultValue="skills-matrix">
        <TabsList className="h-auto bg-transparent p-0 gap-3">
          <TabsTrigger value="skills-matrix" className={CHIP_TAB}>Skills Matrix</TabsTrigger>
          <TabsTrigger value="all-team-skills" className={CHIP_TAB}>All Team Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="skills-matrix" className="mt-4">
          <SkillsMatrixTab />
        </TabsContent>

        <TabsContent value="all-team-skills" className="mt-4">
          <AllTeamSkillsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
