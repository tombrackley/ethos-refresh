import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, ChevronRight, Plus, X } from 'lucide-react'
import tenant from '@/config/tenant'

const TEAM_CAP = tenant.pages.learn.teamCapability
const SKILLS_PROFILE = tenant.pages.learn.skillsProfile

const LEVEL_LABELS = { 1: 'Emerging', 2: 'Established', 3: 'Expert' }
const TILE_BY_LEVEL = {
  1: 'bg-slate-200 text-slate-700',
  2: 'bg-yellow-100 text-yellow-900',
  3: 'bg-emerald-100 text-emerald-800',
}

function LevelTile({ level }) {
  return (
    <span className={`inline-flex size-[22px] items-center justify-center rounded-md text-xs font-semibold ${TILE_BY_LEVEL[level]}`}>
      {level}
    </span>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AdminRolesPage() {
  // Session-local copy of the role profiles. Edits aren't persisted (prototype) —
  // when the real backend lands, this becomes a fetch + mutate hook.
  const [roles, setRoles] = useState(TEAM_CAP.roles || [])
  const [editingRoleId, setEditingRoleId] = useState(null)

  const members = TEAM_CAP.members
  // Build a label-based map so we can count members per role label.
  const membersByRoleLabel = useMemo(() => {
    const map = new Map()
    members.forEach(m => {
      if (!map.has(m.role)) map.set(m.role, [])
      map.get(m.role).push(m)
    })
    return map
  }, [members])

  const editingRole = roles.find(r => r.id === editingRoleId) ?? null

  function updateRole(roleId, patch) {
    setRoles(prev => prev.map(r => (r.id === roleId ? { ...r, ...patch } : r)))
  }

  function addRole() {
    const id = `role-${Date.now()}`
    const newRole = { id, label: 'New role', description: '', requirements: {} }
    setRoles(prev => [...prev, newRole])
    setEditingRoleId(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Role Profiles</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Define each role's required skills and target levels. Team Capability checks team members against the role they sit in.
          </p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={addRole}>
          <Plus className="size-4" /> Add role
        </Button>
      </div>

      <div>
        {roles.map(role => {
          const roleMembers = membersByRoleLabel.get(role.label) || []
          const skillCount = Object.keys(role.requirements).length
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => setEditingRoleId(role.id)}
              className="w-full border-b border-border/60 last:border-0 px-2 py-4 text-left hover:bg-muted/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-foreground">{role.label}</p>
                    <span className="text-xs text-muted-foreground">
                      {skillCount} {skillCount === 1 ? 'skill' : 'skills'}
                    </span>
                  </div>
                  {role.description && (
                    <p className="mt-1 text-sm text-muted-foreground truncate">{role.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground w-[80px] text-right">
                    {roleMembers.length} {roleMembers.length === 1 ? 'member' : 'members'}
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <RoleDetailSheet
        role={editingRole}
        onClose={() => setEditingRoleId(null)}
        onChange={patch => editingRole && updateRole(editingRole.id, patch)}
      />
    </div>
  )
}

// ─── Role Detail Sheet ──────────────────────────────────────────────────────
// Floating panel pattern — mirrors the Compliance Checklist drawer on the
// Control page. No backdrop, no slide animation, fixed inset-y/right with
// rounded corners + shadow. Renders nothing when no role is being edited.

function RoleDetailSheet({ role, onClose, onChange }) {
  // ESC-to-close to match the affordance users expect from this pattern.
  useEffect(() => {
    if (!role) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [role, onClose])

  if (!role) return null

  const orgSkillIds = (TEAM_CAP.skillGroups || []).flatMap(g => g.skillIds)
  const skillsById = Object.fromEntries(SKILLS_PROFILE.skills.map(s => [s.id, s]))
  const skillGroups = TEAM_CAP.skillGroups || []

  const attachedIds = Object.keys(role.requirements)
  const attachedSet = new Set(attachedIds)
  const availableByGroup = skillGroups.map(g => ({
    ...g,
    skillIds: g.skillIds.filter(id => !attachedSet.has(id) && skillsById[id]),
  })).filter(g => g.skillIds.length > 0)

  function setTarget(skillId, level) {
    onChange({ requirements: { ...role.requirements, [skillId]: level } })
  }

  function addSkill(skillId) {
    onChange({ requirements: { ...role.requirements, [skillId]: 2 } })
  }

  function removeSkill(skillId) {
    const next = { ...role.requirements }
    delete next[skillId]
    onChange({ requirements: next })
  }

  // Order rows by the org catalog order so they stay grouped logically.
  const orderedRows = orgSkillIds.filter(id => attachedSet.has(id))

  return (
    <div
      role="dialog"
      aria-labelledby="role-profile-title"
      className="fixed inset-y-3 right-3 z-50 flex w-[640px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-xl"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <X className="size-4" />
      </button>

      <div className="shrink-0 space-y-3 border-b border-border p-6 pb-4 pr-12">
        <p id="role-profile-title" className="text-sm font-medium text-muted-foreground">Edit role</p>
        <Input
          value={role.label}
          onChange={e => onChange({ label: e.target.value })}
          placeholder="Role name"
          className="h-10 text-lg font-medium text-foreground"
        />
        <Input
          value={role.description || ''}
          onChange={e => onChange({ description: e.target.value })}
          placeholder="Short description of what this role does"
          className="h-9 text-sm"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Required skills</p>
            <p className="text-xs text-muted-foreground">
              {orderedRows.length} {orderedRows.length === 1 ? 'skill' : 'skills'} attached
            </p>
          </div>
          <AddSkillButton
            availableByGroup={availableByGroup}
            skillsById={skillsById}
            onAdd={addSkill}
          />
        </div>

        {orderedRows.length === 0 ? (
          <div className="rounded-md border border-dashed border-border px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">No skills attached yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Click "+ Add skill from catalog" to pick from your org's skills.
            </p>
          </div>
        ) : (
          <div className="rounded-md border border-border overflow-hidden">
            {orderedRows.map(skillId => {
              const skill = skillsById[skillId]
              if (!skill) return null
              const target = role.requirements[skillId]
              return (
                <div
                  key={skillId}
                  className="flex items-center gap-3 border-b border-border/60 last:border-0 px-3 py-2 hover:bg-muted/20"
                >
                  <p className="flex-1 min-w-0 text-sm font-medium text-foreground truncate">{skill.label}</p>
                  <TargetDropdown level={target} onChange={lvl => setTarget(skillId, lvl)} />
                  <button
                    type="button"
                    onClick={() => removeSkill(skillId)}
                    aria-label={`Remove ${skill.label}`}
                    className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="shrink-0 flex justify-end gap-2 border-t border-border p-4">
        <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        <Button size="sm" onClick={onClose}>Done</Button>
      </div>
    </div>
  )
}

function TargetDropdown({ level, onChange }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-2 h-8 text-sm font-medium hover:bg-muted/40 transition-colors"
        >
          <LevelTile level={level} />
          <span className="text-foreground">{LEVEL_LABELS[level]}</span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {[1, 2, 3].map(lvl => (
          <DropdownMenuItem
            key={lvl}
            onClick={() => onChange(lvl)}
            className="gap-2 text-sm"
          >
            <LevelTile level={lvl} />
            <span>{LEVEL_LABELS[lvl]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AddSkillButton({ availableByGroup, skillsById, onAdd }) {
  const disabled = availableByGroup.length === 0
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5" disabled={disabled}>
          <Plus className="size-3.5" /> Add skill from catalog
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {availableByGroup.map((group, gi) => (
          <div key={group.id}>
            {gi > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
              {group.label}
            </DropdownMenuLabel>
            {group.skillIds.map(id => (
              <DropdownMenuItem key={id} onClick={() => onAdd(id)} className="text-sm">
                {skillsById[id]?.label}
              </DropdownMenuItem>
            ))}
          </div>
        ))}
        {availableByGroup.length === 0 && (
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            All catalog skills already attached.
          </DropdownMenuLabel>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
