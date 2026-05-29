import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  Scale, ShieldCheck, Landmark, Building2, BarChart3, Leaf, Briefcase,
  Users, ChevronDown, Plus, X, Check, Sparkles, Loader2, FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import tenant from '@/config/tenant'

const TEAM_CAP = tenant.pages.learn.teamCapability
const SKILLS_PROFILE = tenant.pages.learn.skillsProfile

// ── Step keys ──────────────────────────────────────────────────────────────
const FLOW = ['welcome', 'frameworks', 'skills', 'roles', 'targets', 'team', 'capabilities', 'done']

// ── Source data ────────────────────────────────────────────────────────────

const FRAMEWORKS = [
  { value: 'law-society-nsw', label: 'Law Society NSW',           desc: 'Practising solicitors in NSW',                                icon: Scale },
  { value: 'aicd',            label: 'AICD',                       desc: 'Directors & governance professionals',                        icon: Landmark },
  { value: 'austrac',         label: 'AUSTRAC',                    desc: 'AML/CTF reporting & compliance',                              icon: ShieldCheck },
  { value: 'gov-inst',        label: 'Governance Institute',       desc: 'Company secretaries & governance professionals',              icon: Building2 },
  { value: 'asic',            label: 'ASIC',                       desc: 'Corporations Act & financial services regulation',            icon: Briefcase },
  { value: 'apra',            label: 'APRA',                       desc: 'Banking, insurance, super',                                   icon: BarChart3 },
  { value: 'issb',            label: 'ISSB',                       desc: 'Sustainability reporting standards',                          icon: Leaf },
]

// Which library skill IDs each framework pre-selects when chosen.
const FRAMEWORK_SKILL_MAP = {
  'law-society-nsw': ['sk1', 'sk2', 'sk4', 'sk5'],
  'aicd':            ['sk1', 'sk3', 'sk7'],
  'austrac':         ['sk2', 'sk6'],
  'gov-inst':        ['sk3', 'sk4'],
  'asic':            ['sk3'],
  'apra':            ['sk2', 'sk4', 'sk6'],
  'issb':            ['sk7'],
}

const SUGGESTED_ROLES = [
  { id: 'general-counsel',     label: 'General Counsel',     tier: 3, description: 'Sets legal strategy; advises the board and owns regulatory posture.' },
  { id: 'senior-lawyer',       label: 'Senior Lawyer',       tier: 2, description: 'Runs matters independently; supports the GC and reviews junior work.' },
  { id: 'compliance-officer',  label: 'Compliance Officer',  tier: 2, description: 'Owns the obligations register, runs AML and privacy controls.' },
  { id: 'company-secretary',   label: 'Company Secretary',   tier: 2, description: 'Governance custodian — board administration and statutory filings.' },
  { id: 'board-member',        label: 'Board Member',        tier: 3, description: 'Non-executive director; oversees strategy, governance and risk.' },
  { id: 'junior-lawyer',       label: 'Junior Lawyer',       tier: 1, description: 'Builds foundational capability under supervision.' },
  { id: 'risk-manager',        label: 'Risk Manager',        tier: 2, description: 'Enterprise risk management and risk-appetite frameworks.' },
  { id: 'hr-manager',          label: 'HR Manager',          tier: 2, description: 'People operations, workforce planning and HR compliance.' },
  { id: 'finance-manager',     label: 'Finance Manager',     tier: 2, description: 'Financial reporting and operational finance.' },
]

const LEVEL_LABELS = { 0: 'Not required', 1: 'Emerging', 2: 'Established', 3: 'Expert' }
const TILE_BY_LEVEL = {
  0: 'bg-muted text-muted-foreground',
  1: 'bg-slate-200 text-slate-700',
  2: 'bg-yellow-100 text-yellow-900',
  3: 'bg-emerald-100 text-emerald-800',
}

// Default target per role-tier (junior=1, mid=2, senior=3). Used when first
// attaching a skill to a role so the admin starts from a sane baseline.
function defaultTargetForTier(tier) {
  if (tier >= 3) return 3
  if (tier === 2) return 2
  return 1
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function RolesTeamSetupPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    frameworks: [],
    enabledSkillIds: new Set(),
    customSkills: [],          // string[]
    selectedRoleIds: new Set(), // suggested role ids
    customRoles: [],           // string[]
    targets: {},               // { roleId: { skillId: level } }
    memberAssignments: {},     // { memberId: roleId }
    capabilities: {},          // { memberId: { skillId: level } }
  })
  // AI-extraction state — set when the user uploads a matrix file.
  const [uploadState, setUploadState] = useState('idle') // 'idle' | 'analyzing'
  const [uploadFilename, setUploadFilename] = useState('')
  // Tracks which roles we've already pre-attached default skills to — keeps
  // hydration idempotent so detachments survive a back/forward through steps.
  const [hydratedRoleIds, setHydratedRoleIds] = useState(new Set())
  // Members the admin has opted to defer to self-assessment. Their cells render
  // as a non-interactive "awaiting" placeholder instead of editable tiles.
  const [selfAssessingMemberIds, setSelfAssessingMemberIds] = useState(new Set())
  // Tracks which members we've already prefilled capability cells for — once
  // the admin starts editing, we don't overwrite their values on re-entry.
  const [prefilledMemberIds, setPrefilledMemberIds] = useState(new Set())

  const stepKey = FLOW[step]
  const questionStepCount = FLOW.length - 1 // exclude final 'done'

  // Stubbed "AI extraction" — pretend to read the matrix file, pre-fill the
  // wizard with sensible defaults, and jump the user to the skills review step
  // so they can confirm what was extracted.
  function handleMatrixUpload(file) {
    setUploadFilename(file.name)
    setUploadState('analyzing')
    setTimeout(() => {
      setData(d => ({
        ...d,
        frameworks: ['law-society-nsw', 'aicd', 'austrac'],
        enabledSkillIds: new Set(['sk1', 'sk2', 'sk3', 'sk4', 'sk5', 'sk6', 'sk7']),
        selectedRoleIds: new Set(['general-counsel', 'senior-lawyer', 'compliance-officer', 'junior-lawyer']),
      }))
      setUploadState('idle')
      setStep(FLOW.indexOf('skills'))
    }, 1800)
  }

  function next() {
    setStep(s => Math.min(s + 1, FLOW.length - 1))
  }
  function back() {
    setStep(s => Math.max(s - 1, 0))
  }
  // ── Step-specific helpers ────────────────────────────────────────────────

  function toggleFramework(v) {
    setData(d => {
      const set = new Set(d.frameworks)
      if (set.has(v)) set.delete(v); else set.add(v)
      // Recompute pre-selected skill set as union of selected frameworks'
      // suggested skills + any custom skills already enabled (preserved).
      const fresh = new Set()
      set.forEach(f => (FRAMEWORK_SKILL_MAP[f] || []).forEach(id => fresh.add(id)))
      return { ...d, frameworks: [...set], enabledSkillIds: fresh }
    })
  }

  function toggleSkill(id) {
    setData(d => {
      const set = new Set(d.enabledSkillIds)
      if (set.has(id)) set.delete(id); else set.add(id)
      return { ...d, enabledSkillIds: set }
    })
  }

  function addCustomSkill(label) {
    const v = label.trim()
    if (!v) return
    setData(d => ({ ...d, customSkills: [...d.customSkills, v] }))
  }

  function removeCustomSkill(label) {
    setData(d => ({ ...d, customSkills: d.customSkills.filter(s => s !== label) }))
  }

  function toggleRole(id) {
    setData(d => {
      const set = new Set(d.selectedRoleIds)
      if (set.has(id)) set.delete(id); else set.add(id)
      return { ...d, selectedRoleIds: set }
    })
  }

  function addCustomRole(label) {
    const v = label.trim()
    if (!v) return
    setData(d => ({ ...d, customRoles: [...d.customRoles, v] }))
  }

  function removeCustomRole(label) {
    setData(d => ({ ...d, customRoles: d.customRoles.filter(r => r !== label) }))
  }

  function setTargetLevel(roleId, skillId, level) {
    setData(d => {
      const next = { ...d.targets, [roleId]: { ...(d.targets[roleId] || {}), [skillId]: level } }
      return { ...d, targets: next }
    })
  }

  function attachSkillToRole(roleId, skillId) {
    setData(d => {
      const role = orderedActiveRoles.find(r => r.id === roleId)
      const lvl = defaultTargetForTier(role?.tier || 2)
      const next = { ...d.targets, [roleId]: { ...(d.targets[roleId] || {}), [skillId]: lvl } }
      return { ...d, targets: next }
    })
  }

  function detachSkillFromRole(roleId, skillId) {
    setData(d => {
      const roleTargets = { ...(d.targets[roleId] || {}) }
      delete roleTargets[skillId]
      return { ...d, targets: { ...d.targets, [roleId]: roleTargets } }
    })
  }

  function assignMember(memberId, roleLabel) {
    setData(d => ({ ...d, memberAssignments: { ...d.memberAssignments, [memberId]: roleLabel } }))
  }

  // Cycle a capability cell: 0 → 1 → 2 → 3 → 0. Lets the admin scan a row and
  // tap each cell once or twice to set without opening a picker.
  function cycleCapability(memberId, skillId) {
    setData(d => {
      const current = d.capabilities[memberId]?.[skillId] || 0
      const next = (current + 1) % 4
      return {
        ...d,
        capabilities: {
          ...d.capabilities,
          [memberId]: { ...(d.capabilities[memberId] || {}), [skillId]: next },
        },
      }
    })
  }

  // Toggle a member into / out of self-assessment mode. When enabling we clear
  // any cells the admin had set for them — the team member becomes the source
  // of truth once they fill it in themselves.
  function toggleSelfAssess(memberId) {
    setSelfAssessingMemberIds(prev => {
      const set = new Set(prev)
      if (set.has(memberId)) {
        set.delete(memberId)
      } else {
        set.add(memberId)
      }
      return set
    })
    if (!selfAssessingMemberIds.has(memberId)) {
      // Enabling self-assess for the first time → clear the admin's cells.
      setData(d => {
        const next = { ...d.capabilities }
        delete next[memberId]
        return { ...d, capabilities: next }
      })
    }
  }

  // Pre-fill each member's row with the level their assigned role requires.
  // Runs once per member; cells with existing admin edits aren't overwritten.
  // Skill cells outside the role's profile stay empty.
  function ensureCapabilitiesPrefilled() {
    setData(d => {
      const next = { ...d.capabilities }
      TEAM_CAP.members.forEach(member => {
        if (prefilledMemberIds.has(member.id)) return
        if (selfAssessingMemberIds.has(member.id)) return
        const roleLabel = d.memberAssignments[member.id]
        if (!roleLabel) return
        const role = orderedActiveRoles.find(r => r.label === roleLabel)
        if (!role) return
        const roleTargets = d.targets[role.id] || {}
        next[member.id] = { ...(next[member.id] || {}) }
        Object.entries(roleTargets).forEach(([skillId, level]) => {
          if (next[member.id][skillId] == null) next[member.id][skillId] = level
        })
      })
      return { ...d, capabilities: next }
    })
    setPrefilledMemberIds(prev => {
      const set = new Set(prev)
      TEAM_CAP.members.forEach(m => set.add(m.id))
      return set
    })
  }

  // ── Derived ──────────────────────────────────────────────────────────────

  const skillsById = Object.fromEntries(SKILLS_PROFILE.skills.map(s => [s.id, s]))
  // Combined list of enabled skills the admin is tracking — used by later steps.
  const orderedActiveSkills = [
    ...Array.from(data.enabledSkillIds).map(id => ({ id, label: skillsById[id]?.label || id, custom: false })),
    ...data.customSkills.map(label => ({ id: `custom-${label}`, label, custom: true })),
  ]
  const orderedActiveRoles = [
    ...Array.from(data.selectedRoleIds).map(id => {
      const r = SUGGESTED_ROLES.find(x => x.id === id)
      return { id, label: r?.label || id, tier: r?.tier || 2 }
    }),
    ...data.customRoles.map(label => ({ id: `custom-${label}`, label, tier: 2 })),
  ]

  // Initialise targets for newly visited 'targets' step so each role's skill
  // entries are pre-populated with the role tier's default level. Hydration
  // runs once per role — once the admin has touched a role's profile, we
  // don't overwrite their detach/attach changes on subsequent navigation.
  function ensureTargetsHydrated() {
    setData(d => {
      const next = { ...d.targets }
      orderedActiveRoles.forEach(role => {
        if (hydratedRoleIds.has(role.id)) return
        next[role.id] = { ...(next[role.id] || {}) }
        orderedActiveSkills.forEach(s => {
          next[role.id][s.id] = defaultTargetForTier(role.tier)
        })
      })
      return { ...d, targets: next }
    })
    setHydratedRoleIds(prev => {
      const set = new Set(prev)
      orderedActiveRoles.forEach(r => set.add(r.id))
      return set
    })
  }

  // ── Step render ──────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-2">
          <img src={tenant.logo} alt={tenant.appName} className="h-7 w-auto rounded-sm" />
          <span className="text-sm font-medium text-muted-foreground">Roles &amp; skills setup</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/role-profiles')}>
          Exit
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-12 flex items-start justify-center">
        <div className={cn(
          'w-full',
          // Capabilities matrix needs much more horizontal room than the
          // question-style steps — let it stretch up to ~1280px.
          stepKey === 'capabilities' ? 'max-w-7xl' : 'max-w-3xl'
        )}>
        {uploadState === 'analyzing' ? (
          <AnalyzingMatrix filename={uploadFilename} />
        ) : (<>
          {stepKey === 'welcome' && (
            <WelcomeStep onStart={next} onUploadFile={handleMatrixUpload} />
          )}

          {stepKey === 'frameworks' && (
            <Step
              heading="Which professional frameworks does your team operate under?"
              subheading="We'll pre-select the skills most relevant to what you pick. You can change this anytime."
            >
              <CardGrid>
                {FRAMEWORKS.map(fw => (
                  <OptionCard
                    key={fw.value}
                    icon={fw.icon}
                    label={fw.label}
                    description={fw.desc}
                    selected={data.frameworks.includes(fw.value)}
                    onClick={() => toggleFramework(fw.value)}
                  />
                ))}
              </CardGrid>
              <NavRow onBack={back} onNext={next} nextDisabled={data.frameworks.length === 0} />
            </Step>
          )}

          {stepKey === 'skills' && (
            <Step
              heading="Here's the skills we suggest tracking"
              subheading="Based on your frameworks. Toggle off any that don't apply, or add your own."
            >
              <SkillsConfirm
                skills={SKILLS_PROFILE.skills}
                enabled={data.enabledSkillIds}
                onToggle={toggleSkill}
                customSkills={data.customSkills}
                onAddCustom={addCustomSkill}
                onRemoveCustom={removeCustomSkill}
              />
              <NavRow
                onBack={back}
                onNext={next}
                nextDisabled={data.enabledSkillIds.size + data.customSkills.length === 0}
              />
            </Step>
          )}

          {stepKey === 'roles' && (
            <Step
              heading="What roles does your team include?"
              subheading="We'll set target levels for each. Multi-select; you can add custom roles too."
            >
              <div className="flex flex-col gap-2">
                {SUGGESTED_ROLES.map(role => (
                  <StackedSelectCard
                    key={role.id}
                    label={role.label}
                    selected={data.selectedRoleIds.has(role.id)}
                    onClick={() => toggleRole(role.id)}
                  />
                ))}
                {data.customRoles.map(label => (
                  <StackedSelectCard
                    key={`custom-${label}`}
                    label={label}
                    selected
                    onRemove={() => removeCustomRole(label)}
                  />
                ))}
              </div>
              <CustomAddInput placeholder="Add a custom role" onAdd={addCustomRole} />
              <NavRow
                onBack={back}
                onNext={() => { ensureTargetsHydrated(); next() }}
                nextDisabled={data.selectedRoleIds.size + data.customRoles.length === 0}
              />
            </Step>
          )}

          {stepKey === 'targets' && (
            <Step
              heading="Set target levels for each role"
              subheading="Pre-filled by seniority — adjust where it doesn't match your reality. Skills can be 'Not required' per role."
            >
              <TargetsEditor
                roles={orderedActiveRoles}
                skills={orderedActiveSkills}
                targets={data.targets}
                onChange={setTargetLevel}
                onAttach={attachSkillToRole}
                onDetach={detachSkillFromRole}
              />
              <NavRow onBack={back} onNext={next} />
            </Step>
          )}

          {stepKey === 'team' && (
            <Step
              heading="Assign your team to roles"
              subheading="Optional — you can do this from Users later. We've pulled in your existing team."
            >
              <TeamAssign
                members={TEAM_CAP.members}
                roles={orderedActiveRoles}
                assignments={data.memberAssignments}
                onAssign={assignMember}
              />
              <NavRow
                onBack={back}
                onSkip={() => { ensureCapabilitiesPrefilled(); next() }}
                onNext={() => { ensureCapabilitiesPrefilled(); next() }}
                nextLabel="Continue"
              />
            </Step>
          )}

          {stepKey === 'capabilities' && (
            <Step
              heading="Where does your team sit on each skill?"
              subheading="Cells are pre-filled from each member's role targets — adjust the cells where reality differs. For anyone you're not confident rating, choose Self-assess to send them a request."
            >
              <CapabilitiesMatrix
                members={TEAM_CAP.members}
                skills={orderedActiveSkills}
                capabilities={data.capabilities}
                selfAssessing={selfAssessingMemberIds}
                onCellClick={cycleCapability}
                onToggleSelfAssess={toggleSelfAssess}
              />
              <NavRow onBack={back} onSkip={next} onNext={next} nextLabel="Continue" />
            </Step>
          )}

          {stepKey === 'done' && (
            <DoneStep
              data={data}
              orderedActiveSkills={orderedActiveSkills}
              orderedActiveRoles={orderedActiveRoles}
              selfAssessingCount={selfAssessingMemberIds.size}
              onOpen={() => navigate('/admin/team-capability')}
            />
          )}
        </>)}
        </div>
      </div>

      {/* Progress dots */}
      {uploadState === 'idle' && stepKey !== 'done' && stepKey !== 'welcome' && (
        <div className="shrink-0 px-6 pb-8 flex justify-center">
          <ProgressDots count={questionStepCount} active={step} />
        </div>
      )}
    </div>
  )
}

// ─── Step content components ────────────────────────────────────────────────

function WelcomeStep({ onStart, onUploadFile }) {
  const fileInputRef = useRef(null)
  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (file) onUploadFile(file)
    // Reset so the same file can be re-selected if the user comes back.
    e.target.value = ''
  }
  return (
    <div className="flex flex-col items-center text-center gap-6 py-12">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-[#dffff2] border border-[#77AFA6]">
        <Users className="size-7 text-[#0e5f5b]" />
      </span>
      <div className="space-y-2 max-w-xl">
        <h1 className="text-3xl font-medium tracking-[-0.03em] text-foreground">Set up your team's skills and roles</h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Pick how you'd like to start. You can adjust everything later either way.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        <ChoiceCard
          icon={Sparkles}
          title="Upload an existing matrix"
          description="If your team already has a skills matrix in Excel, CSV or a doc, we'll extract the skills, roles and targets for you to review."
          onClick={() => fileInputRef.current?.click()}
        />
        <ChoiceCard
          icon={Plus}
          title="Start from scratch"
          description="We'll walk you through picking frameworks, skills, roles and target levels step by step."
          onClick={onStart}
        />
      </div>

      <p className="text-xs text-muted-foreground">Accepts .xlsx, .csv, .pdf or .docx · ~3 minutes either way</p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv,.pdf,.docx"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

function ChoiceCard({ icon: Icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-start gap-3 rounded-xl border border-border bg-white p-5 text-left transition-colors hover:border-foreground/30 hover:bg-muted/40"
    >
      <span className="flex size-9 items-center justify-center rounded-md shrink-0 bg-muted text-foreground/80">
        {Icon && <Icon className="size-5" strokeWidth={2} />}
      </span>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <span className="text-sm text-muted-foreground leading-snug">{description}</span>
      </div>
    </button>
  )
}

function AnalyzingMatrix({ filename }) {
  return (
    <div className="flex flex-col items-center text-center gap-5 py-20">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-[#dffff2] border border-[#77AFA6]">
        <Loader2 className="size-7 text-[#0e5f5b] animate-spin" strokeWidth={2} />
      </span>
      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl font-medium tracking-[-0.02em] text-foreground">Analyzing your matrix</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Extracting skills, roles and target levels. You'll review what we found in the next step.
        </p>
      </div>
      <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground">
        <FileText className="size-4 text-muted-foreground" />
        {filename}
      </div>
    </div>
  )
}

function SkillsConfirm({ skills, enabled, onToggle, customSkills, onAddCustom, onRemoveCustom }) {
  const [draft, setDraft] = useState('')
  function submit() {
    if (!draft.trim()) return
    onAddCustom(draft)
    setDraft('')
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        {skills.map(s => (
          <StackedSelectCard
            key={s.id}
            label={s.label}
            description={s.description}
            selected={enabled.has(s.id)}
            onClick={() => onToggle(s.id)}
          />
        ))}
      </div>

      {customSkills.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Your custom skills</p>
          <div className="flex flex-wrap gap-2">
            {customSkills.map(label => (
              <span key={label} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-sm text-foreground">
                {label}
                <button
                  type="button"
                  onClick={() => onRemoveCustom(label)}
                  aria-label={`Remove ${label}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); submit() } }}
          placeholder="Add a custom skill"
          className="h-10"
        />
        <Button onClick={submit} variant="outline" disabled={!draft.trim()}>
          <Plus className="size-4 mr-1" /> Add
        </Button>
      </div>
    </div>
  )
}

// Stacked-list card used for both skills and roles — full-width row with a
// leading checkbox pill, label and optional description below. Mint-filled
// checkbox + tinted background when selected.
// When `onRemove` is passed, the card becomes non-toggleable and an X delete
// button is rendered as a sibling on the right (outside the card chrome).
function StackedSelectCard({ label, description, selected, onClick, onRemove }) {
  const Body = onClick ? 'button' : 'div'
  const card = (
    <Body
      {...(onClick ? { type: 'button', onClick } : {})}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl border bg-white px-4 py-3 text-left min-w-0 transition-colors',
        selected ? 'border-[#77AFA6] bg-[#DFFFF2]' : 'border-border',
        onClick && !selected && 'hover:border-foreground/30 hover:bg-muted/40'
      )}
    >
      <span className={cn(
        'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors',
        selected ? 'bg-[#0e5f5b] border-[#0e5f5b] text-white' : 'bg-white border-border text-transparent'
      )}>
        <Check className="size-3.5" strokeWidth={3} />
      </span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && (
          <span className="text-sm font-normal text-muted-foreground leading-snug">
            {description}
          </span>
        )}
      </div>
    </Body>
  )

  if (!onRemove) return card

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-0">{card}</div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

function CustomAddInput({ placeholder, onAdd }) {
  const [draft, setDraft] = useState('')
  function submit() {
    if (!draft.trim()) return
    onAdd(draft)
    setDraft('')
  }
  return (
    <div className="flex items-center gap-2 mt-2">
      <Input
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); submit() } }}
        placeholder={placeholder}
        className="h-10"
      />
      <Button onClick={submit} variant="outline" disabled={!draft.trim()}>
        <Plus className="size-4 mr-1" /> Add
      </Button>
    </div>
  )
}

function TargetsEditor({ roles, skills, targets, onChange, onAttach, onDetach }) {
  return (
    <div className="space-y-3">
      {roles.map(role => {
        const roleTargets = targets[role.id] || {}
        const attachedSet = new Set(Object.keys(roleTargets))
        // Render attached skills in catalog order so the list stays stable.
        const attached = skills.filter(s => attachedSet.has(s.id))
        const available = skills.filter(s => !attachedSet.has(s.id))
        return (
          <div key={role.id} className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-foreground">{role.label}</p>
              <p className="text-xs text-muted-foreground">
                {attached.length} {attached.length === 1 ? 'skill' : 'skills'}
              </p>
            </div>

            {attached.length === 0 ? (
              <p className="text-sm text-muted-foreground py-1">
                No skills attached to this role yet. Use "Add skill" to pick from your catalog.
              </p>
            ) : (
              <div className="space-y-1">
                {attached.map(skill => {
                  const level = roleTargets[skill.id]
                  return (
                    <div key={skill.id} className="flex items-center justify-between gap-2 py-1.5">
                      <p className="text-sm text-foreground flex-1 min-w-0 truncate">{skill.label}</p>
                      <TargetDropdown level={level} onChange={lvl => onChange(role.id, skill.id, lvl)} />
                      <button
                        type="button"
                        onClick={() => onDetach(role.id, skill.id)}
                        aria-label={`Detach ${skill.label} from ${role.label}`}
                        className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {available.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 mt-3">
                    <Plus className="size-3.5" /> Add skill
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  {available.map(skill => (
                    <DropdownMenuItem
                      key={skill.id}
                      onClick={() => onAttach(role.id, skill.id)}
                      className="text-sm"
                    >
                      {skill.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )
      })}
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
          <span className={cn('inline-flex size-5 items-center justify-center rounded-md text-xs font-semibold', TILE_BY_LEVEL[level])}>
            {level || '—'}
          </span>
          <span className="text-foreground">{LEVEL_LABELS[level]}</span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {[0, 1, 2, 3].map(lvl => (
          <DropdownMenuItem key={lvl} onClick={() => onChange(lvl)} className="gap-2 text-sm">
            <span className={cn('inline-flex size-5 items-center justify-center rounded-md text-xs font-semibold', TILE_BY_LEVEL[lvl])}>
              {lvl || '—'}
            </span>
            <span>{LEVEL_LABELS[lvl]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function CapabilitiesMatrix({ members, skills, capabilities, selfAssessing, onCellClick, onToggleSelfAssess }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60">
            <th className="sticky left-0 z-10 bg-white px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Skill
            </th>
            {members.map(m => {
              const isSelf = selfAssessing?.has(m.id)
              return (
                <th key={m.id} className="min-w-[96px] border-l border-border/60 px-2 py-3 text-center align-bottom">
                  <div className="flex flex-col items-center gap-1">
                    <span className="flex size-7 items-center justify-center rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
                      {m.initials}
                    </span>
                    <span className="text-xs font-medium text-foreground truncate max-w-[80px]">
                      {m.name.split(' ')[0]}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleSelfAssess(m.id)}
                      className={cn(
                        'text-xs underline-offset-2 hover:underline transition-colors',
                        isSelf ? 'text-[#0e5f5b] font-medium' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {isSelf ? 'Rate manually' : 'Self-assess'}
                    </button>
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {skills.map(skill => (
            <tr key={skill.id} className="border-b border-border/60 last:border-0 hover:bg-muted/10">
              <td className="sticky left-0 bg-white px-4 py-2 text-sm font-medium text-foreground">
                {skill.label}
              </td>
              {members.map(m => {
                const isSelf = selfAssessing?.has(m.id)
                const level = capabilities[m.id]?.[skill.id] || 0
                if (isSelf) {
                  return (
                    <td key={m.id} className="border-l border-border/60 px-2 py-2">
                      <div
                        title="Awaiting self-assessment"
                        className="mx-auto flex size-[22px] items-center justify-center rounded-md border border-dashed border-border bg-muted/40 text-muted-foreground/60"
                      >
                        <span className="text-xs">·</span>
                      </div>
                    </td>
                  )
                }
                return (
                  <td key={m.id} className="border-l border-border/60 px-2 py-2">
                    <button
                      type="button"
                      onClick={() => onCellClick(m.id, skill.id)}
                      aria-label={`Rate ${m.name} on ${skill.label}`}
                      className="mx-auto block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                      <MatrixCellTile level={level} />
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MatrixCellTile({ level }) {
  if (!level) {
    return (
      <div className="mx-auto flex size-[22px] items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Plus className="size-3" />
      </div>
    )
  }
  return (
    <div className={cn(
      'mx-auto flex size-[22px] items-center justify-center rounded-md text-xs font-semibold',
      TILE_BY_LEVEL[level]
    )}>
      {level}
    </div>
  )
}

function TeamAssign({ members, roles, assignments, onAssign }) {
  return (
    <div className="space-y-2">
      {members.map(m => (
        <div key={m.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-white px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex size-8 items-center justify-center rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">{m.initials}</span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
              <p className="text-xs text-muted-foreground truncate">Current: {m.role}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 font-normal">
                {assignments[m.id] || 'Assign role'}
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {roles.map(r => (
                <DropdownMenuItem key={r.id} onClick={() => onAssign(m.id, r.label)} className="text-sm">
                  {r.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  )
}

function DoneStep({ data, orderedActiveSkills, orderedActiveRoles, selfAssessingCount, onOpen }) {
  const skillCount = orderedActiveSkills.length
  const roleCount = orderedActiveRoles.length
  const assignedCount = Object.keys(data.memberAssignments).length
  const capabilityCellCount = Object.values(data.capabilities)
    .reduce((sum, perMember) => sum + Object.values(perMember).filter(l => l > 0).length, 0)
  return (
    <div className="flex flex-col items-center text-center gap-6 py-12">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-[#dffff2] border border-[#77AFA6]">
        <Check className="size-7 text-[#0e5f5b]" strokeWidth={2.5} />
      </span>
      <div className="space-y-2 max-w-xl">
        <h1 className="text-3xl font-medium tracking-[-0.03em] text-foreground">You're all set</h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          {skillCount} skills tracked across {roleCount} roles{assignedCount > 0 ? ` · ${assignedCount} assigned` : ''}{capabilityCellCount > 0 ? ` · ${capabilityCellCount} ratings` : ''}{selfAssessingCount > 0 ? ` · ${selfAssessingCount} self-assessing` : ''}.
        </p>
      </div>
      <div className="grid grid-cols-5 gap-3 w-full max-w-3xl">
        <DoneStat value={skillCount} label="Skills tracked" />
        <DoneStat value={roleCount} label="Roles defined" />
        <DoneStat value={assignedCount} label="Members assigned" />
        <DoneStat value={capabilityCellCount} label="Capability ratings" />
        <DoneStat value={selfAssessingCount} label="Self-assess sent" />
      </div>
      <Button onClick={onOpen} className="h-11 px-6 text-base">Open Team Capability</Button>
    </div>
  )
}

function DoneStat({ value, label }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 text-center">
      <p className="text-2xl font-medium text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  )
}

// ─── Shared layout primitives (mirrors OnboardingPage) ──────────────────────

function Step({ heading, subheading, children }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-medium tracking-[-0.03em] text-foreground">{heading}</h1>
        {subheading && <p className="mt-1 text-sm text-muted-foreground">{subheading}</p>}
      </div>
      {children}
    </div>
  )
}

function CardGrid({ children }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {children}
    </div>
  )
}

function OptionCard({ icon: Icon, label, description, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 rounded-xl border bg-white px-4 py-3 text-left text-sm font-medium text-foreground transition-colors',
        selected
          ? 'border-[#77AFA6] bg-[#DFFFF2]'
          : 'border-border hover:border-foreground/30 hover:bg-muted/40'
      )}
    >
      {Icon && (
        <span className="flex h-5 items-center shrink-0">
          <Icon className="size-4 text-foreground/80" />
        </span>
      )}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span>{label}</span>
        {description && (
          <span className="text-[12px] font-normal text-muted-foreground leading-snug">{description}</span>
        )}
      </div>
    </button>
  )
}

function NavRow({ onBack, onSkip, onNext, nextLabel = 'Next', nextDisabled }) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      {onBack && <Button variant="outline" onClick={onBack} className="h-10 px-5">Back</Button>}
      {onSkip && <Button variant="outline" onClick={onSkip} className="h-10 px-5">Skip</Button>}
      {onNext && (
        <Button onClick={onNext} disabled={nextDisabled} className="h-10 px-5">
          {nextLabel}
        </Button>
      )}
    </div>
  )
}

function ProgressDots({ count, active }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'rounded-full transition-all duration-200',
            i === active ? 'h-1.5 w-5 bg-foreground' : 'h-1.5 w-1.5 bg-foreground/20'
          )}
        />
      ))}
    </div>
  )
}
