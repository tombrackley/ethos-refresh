import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Plus, Search, ChevronDown, X, MoreHorizontal, Pencil, Trash2, Check,
  Clock, CheckCircle2, UserPlus, Archive, ArrowLeft, BookOpen, Users,
  GripVertical, ChevronUp, Send, ThumbsUp, Flag, Calendar, FileText, Link2, Video,
} from 'lucide-react'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ALL_ROLES = [
  'Junior Lawyer',
  'Senior Lawyer',
  'General Counsel',
  'Finance Manager',
  'HR Manager',
  'Compliance Officer',
  'Board Member',
  'Company Secretary',
]

// ─── Mock Items per Journey ──────────────────────────────────────────────────

const JOURNEY_ELEMENTS = {
  1: [
    { id: 1, title: 'Read: Board Governance Best Practices Guide', description: 'Review the latest AICD governance handbook covering director duties and board effectiveness.', order: 1 },
    { id: 2, title: 'Complete Corporate Governance Essentials Course', description: 'Online course covering the foundations of corporate governance frameworks.', order: 2 },
    { id: 3, title: 'Shadow a board meeting', description: 'Attend and observe a full board meeting. Take notes on governance practices, decision-making processes, and how the agenda is structured.', order: 3 },
    { id: 4, title: 'Meet with mentor to discuss governance fundamentals', description: 'Arrange a conversation with your mentor to review governance concepts and discuss observations from board meeting attendance.', order: 4 },
    { id: 5, title: 'Risk Management Workshop', description: 'Interactive workshop on enterprise risk frameworks and risk appetite setting.', order: 5 },
    { id: 6, title: 'Chat with Head of Finance about financial oversight', description: 'Arrange an informal conversation about how financial reporting supports governance and board oversight.', order: 6 },
    { id: 7, title: 'Financial Compliance Update Webinar', description: 'Annual update on financial compliance requirements and regulatory changes.', order: 7 },
    { id: 8, title: 'Watch: Effective Board Committees (video)', description: '45-minute masterclass on structuring and running effective audit, risk, and nomination committees.', order: 8 },
  ],
  2: [
    { id: 1, title: 'Data Privacy Fundamentals Course', description: 'Comprehensive course on privacy principles, data handling, and consent frameworks.', order: 1 },
    { id: 2, title: 'Read: OAIC Privacy Act Guide', description: 'Official guidance on the Australian Privacy Act and Australian Privacy Principles.', order: 2 },
    { id: 3, title: 'Review current data handling procedures', description: 'Audit your team\'s current data handling and identify any gaps against the APPs.', order: 3 },
    { id: 4, title: 'Cross-border Data Transfers Workshop', description: 'Workshop on managing international data flows and adequacy assessments.', order: 4 },
  ],
  3: [],
  4: [
    { id: 1, title: 'AML Fundamentals Course', description: 'Core AML/CTF obligations, customer identification, and suspicious matter reporting.', order: 1 },
    { id: 2, title: 'Review AML policy documentation', description: 'Read through the organisation\'s current AML/CTF program and compliance plan.', order: 2 },
    { id: 3, title: 'Enhanced Due Diligence Workshop', description: 'Practical workshop on conducting enhanced due diligence for high-risk customers.', order: 3 },
    { id: 4, title: 'AUSTRAC Guidance Notes', description: 'Key regulatory guidance on reporting obligations and compliance program requirements.', order: 4 },
  ],
  5: [
    { id: 1, title: 'WHS Officer Duties Course', description: 'Due diligence obligations for officers under harmonised WHS legislation.', order: 1 },
    { id: 2, title: 'Conduct a workplace safety walk', description: 'Participate in a guided safety inspection of the workplace with the WHS officer.', order: 2 },
  ],
}

const LEARNING_JOURNEYS = [
  {
    id: 1,
    name: 'Corporate Governance Fundamentals',
    description: 'Essential governance principles for new board members and company officers.',
    status: 'Active',
    targetRoles: ['Junior Lawyer', 'Company Secretary'],
    assignedUsers: [1, 4, 5],
    participants: 12,
    duration: '12 weeks',
  },
  {
    id: 2,
    name: 'Data Privacy Masterclass',
    description: 'Advanced privacy law and data protection compliance across jurisdictions.',
    status: 'Active',
    targetRoles: ['Senior Lawyer', 'Compliance Officer'],
    assignedUsers: [3, 4],
    participants: 8,
    duration: '8 weeks',
  },
  {
    id: 3,
    name: 'ESG & Sustainability Reporting',
    description: 'Understanding ESG frameworks, reporting standards, and disclosure requirements.',
    status: 'Active',
    targetRoles: ['Finance Manager', 'Board Member', 'General Counsel'],
    assignedUsers: [],
    participants: 0,
    duration: '10 weeks',
  },
  {
    id: 4,
    name: 'AML Compliance Essentials',
    description: 'Anti-money laundering obligations, customer due diligence, and reporting duties.',
    status: 'Active',
    targetRoles: ['Compliance Officer', 'Finance Manager'],
    assignedUsers: [4, 6],
    participants: 15,
    duration: '6 weeks',
  },
  {
    id: 5,
    name: 'Workplace Safety Leadership',
    description: 'WHS due diligence for officers and directors under harmonised legislation.',
    status: 'Archived',
    targetRoles: ['HR Manager', 'Board Member'],
    assignedUsers: [7],
    participants: 10,
    duration: '8 weeks',
  },
]

const ASSIGNABLE_USERS = [
  { id: 1, name: 'John Jones', email: 'john@email.com', role: 'Admin' },
  { id: 2, name: 'Sue Smith', email: 'sue@email.com', role: 'Admin' },
  { id: 3, name: 'James Wilson', email: 'james@email.com', role: 'Senior Lawyer' },
  { id: 4, name: 'Sarah Chen', email: 'sarah@email.com', role: 'Compliance Officer' },
  { id: 5, name: 'David Park', email: 'david@email.com', role: 'Junior Lawyer' },
  { id: 6, name: 'Laura Singh', email: 'laura@email.com', role: 'Finance Manager' },
  { id: 7, name: 'Margaret Chen', email: 'margaret@email.com', role: 'HR Manager' },
  { id: 8, name: 'Tom Bradley', email: 'tom@email.com', role: 'Company Secretary' },
]

// Mock participant progress per journey (keyed by journey id)
const PARTICIPANT_PROGRESS = {
  1: [
    { userId: 1, progress: 85, lastActive: '2 hours ago', status: 'On Track', dateStarted: '2026-01-15' },
    { userId: 4, progress: 72, lastActive: '1 day ago', status: 'On Track', dateStarted: '2026-01-20' },
    { userId: 5, progress: 45, lastActive: '3 days ago', status: 'Behind', dateStarted: '2026-02-01' },
    { userId: 3, progress: 100, lastActive: '5 hours ago', status: 'Completed', dateStarted: '2026-01-15' },
    { userId: 8, progress: 60, lastActive: '12 hours ago', status: 'On Track', dateStarted: '2026-01-22' },
  ],
  2: [
    { userId: 3, progress: 55, lastActive: '6 hours ago', status: 'On Track', dateStarted: '2026-02-01' },
    { userId: 4, progress: 30, lastActive: '4 days ago', status: 'Behind', dateStarted: '2026-02-10' },
    { userId: 6, progress: 42, lastActive: '1 day ago', status: 'On Track', dateStarted: '2026-02-05' },
  ],
  4: [
    { userId: 4, progress: 92, lastActive: '3 hours ago', status: 'On Track', dateStarted: '2025-12-01' },
    { userId: 6, progress: 78, lastActive: '1 day ago', status: 'On Track', dateStarted: '2025-12-08' },
    { userId: 2, progress: 100, lastActive: '2 days ago', status: 'Completed' },
    { userId: 7, progress: 88, lastActive: '8 hours ago', status: 'On Track' },
  ],
  5: [
    { userId: 7, progress: 100, lastActive: '2 weeks ago', status: 'Completed' },
  ],
}

// ─── Mock Learning Logs ─────────────────────────────────────────────────────

const LEARNING_LOGS = {
  1: [
    {
      id: 'log1',
      userId: 5,
      elementTitle: 'Meet with mentor to discuss governance fundamentals',
      note: 'Attended two board meetings and discussed governance frameworks with my mentor. Key learnings around how the audit committee interfaces with the board and the role of the company secretary in facilitating effective governance.',
      submittedDate: '2026-03-05',
    },
    {
      id: 'log2',
      userId: 1,
      elementTitle: 'Chat with Head of Finance about financial oversight',
      note: 'Had a 45-minute conversation with the CFO. Discussed how financial reporting supports governance, the role of the audit committee, and how management accounts differ from statutory reporting. Very insightful for understanding the intersection of finance and governance.',
      submittedDate: '2026-03-04',
    },
  ],
  2: [
    {
      id: 'log3',
      userId: 4,
      elementTitle: 'Review current data handling procedures',
      note: 'Completed an audit of our team\'s data handling procedures. Found three areas where our processes don\'t fully align with the APPs, particularly around cross-border disclosure and consent management for secondary purposes.',
      submittedDate: '2026-03-06',
    },
  ],
  4: [
    {
      id: 'log4',
      userId: 6,
      elementTitle: 'Review AML policy documentation',
      note: 'Reviewed the full AML/CTF program. The compliance plan is current but I noted the transaction monitoring thresholds haven\'t been updated since the latest AUSTRAC guidance. Flagged this with the compliance team.',
      submittedDate: '2026-03-03',
    },
  ],
}

const JOURNEY_STATUS_STYLE = {
  Active:   'bg-[#ecfdf5] text-[#153e40] border-[#a7f3d0]',
  Archived: 'bg-[#f9fafb] text-[#374151] border-[#e5e7eb]',
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LearningJourneysPage() {
  // Active journey for detail page (null = show list)
  const [activeJourney, setActiveJourney] = useState(null)

  // Create overlay
  const [createOpen, setCreateOpen] = useState(false)
  const [newJourney, setNewJourney] = useState(null)

  // Edit overlay
  const [editOverlayJourney, setEditOverlayJourney] = useState(null)

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(null)

  const filtered = LEARNING_JOURNEYS.filter((j) => {
    if (search && !j.name.toLowerCase().includes(search.toLowerCase()) && !j.description.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter && j.status !== statusFilter) return false
    return true
  })

  const hasFilters = search || statusFilter
  const activeCount = LEARNING_JOURNEYS.filter(j => j.status === 'Active').length
  const totalParticipants = LEARNING_JOURNEYS.reduce((a, j) => a + j.participants, 0)
  const totalLogs = Object.values(LEARNING_LOGS).reduce((a, logs) => a + logs.length, 0)

  const handleView = (journey) => {
    setActiveJourney({ ...journey, elements: JOURNEY_ELEMENTS[journey.id] || [] })
  }

  const handleEdit = (journey) => {
    const full = { ...journey, elements: JOURNEY_ELEMENTS[journey.id] || [] }
    setEditOverlayJourney(full)
  }

  const handleEditSave = () => {
    if (editOverlayJourney && activeJourney && editOverlayJourney.id === activeJourney.id) {
      setActiveJourney({ ...editOverlayJourney })
    }
    setEditOverlayJourney(null)
  }

  const handleBack = () => {
    setActiveJourney(null)
  }

  const handleCreate = () => {
    setNewJourney({
      id: null,
      name: '',
      description: '',
      status: 'Active',
      targetRoles: [],
      assignedUsers: [],
      duration: '',
      elements: [],
    })
    setCreateOpen(true)
  }

  const handleCreateClose = () => {
    setCreateOpen(false)
    setNewJourney(null)
  }

  // ── Detail page ──
  if (activeJourney) {
    return (
      <>
        <JourneyDetailPage
          journey={activeJourney}
          onChange={setActiveJourney}
          onEdit={() => handleEdit(activeJourney)}
          onBack={handleBack}
        />
        {editOverlayJourney && createPortal(
          <EditJourneyOverlay
            journey={editOverlayJourney}
            onChange={setEditOverlayJourney}
            onClose={() => setEditOverlayJourney(null)}
            onSave={handleEditSave}
          />,
          document.body,
        )}
      </>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Learning Journeys</h1>
            <p className="text-sm text-muted-foreground mt-1">Create, configure, and assign learning journeys to roles and users</p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={handleCreate}>
            <Plus className="size-4" /> New Journey
          </Button>
        </div>

            {/* Stats row */}
            <div className="flex gap-4">
          {[
            { label: 'Total Journeys', value: LEARNING_JOURNEYS.length },
            { label: 'Active', value: activeCount },
            { label: 'Participants Enrolled', value: totalParticipants },
            { label: 'Learning Logs', value: totalLogs },
          ].map(s => (
            <div key={s.label} className="flex-1 rounded-[8px] border border-[#f5f5f5] bg-white p-4 space-y-1">
              <p className="text-[17px] font-medium text-[#0a0a0a] tracking-[-0.15px] leading-5">{s.value}</p>
              <p className="text-xs font-normal text-[rgba(10,10,10,0.6)]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search journeys..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 text-sm h-9">
                Status <ChevronDown className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {['Active', 'Archived'].map(s => (
                <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)}>{s}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {hasFilters && (
            <button onClick={() => { setSearch(''); setStatusFilter(null) }} className="flex items-center gap-1 text-sm text-foreground hover:text-muted-foreground transition-colors">
              Reset <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Table */}
        <div className="border border-border rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-xs font-medium text-muted-foreground w-[280px] pl-4">Journey</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground w-[80px]">Status</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground w-[80px] text-center">Users</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground w-[80px] text-center">Elements</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground w-[80px] text-center">Logs</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground w-[80px]">Duration</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((journey) => (
                <TableRow key={journey.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => handleView(journey)}>
                  <TableCell className="pl-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{journey.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{journey.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center h-6 px-1.5 rounded-[6px] border text-xs font-medium leading-5 ${JOURNEY_STATUS_STYLE[journey.status]}`}>{journey.status}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm text-muted-foreground">{journey.participants}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm text-muted-foreground">{(JOURNEY_ELEMENTS[journey.id] || []).length}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {(LEARNING_LOGS[journey.id] || []).length > 0 ? (
                      <span className="inline-flex items-center h-5 px-1.5 rounded-full border border-amber-200 bg-amber-50 text-xs font-medium text-amber-700">
                        {(LEARNING_LOGS[journey.id] || []).length}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{journey.duration}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground"><MoreHorizontal className="size-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 text-sm" onClick={() => handleEdit(journey)}><Pencil className="size-3.5" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-sm"><Archive className="size-3.5" /> Archive</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-sm text-destructive"><Trash2 className="size-3.5" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </div>
      </div>

      {/* Full-screen create overlay */}
      {createOpen && newJourney && createPortal(
        <CreateJourneyOverlay
          journey={newJourney}
          onChange={setNewJourney}
          onClose={handleCreateClose}
        />,
        document.body,
      )}

      {/* Full-screen edit overlay */}
      {editOverlayJourney && createPortal(
        <EditJourneyOverlay
          journey={editOverlayJourney}
          onChange={setEditOverlayJourney}
          onClose={() => setEditOverlayJourney(null)}
          onSave={handleEditSave}
        />,
        document.body,
      )}

    </>
  )
}

// ─── Skills Combobox ─────────────────────────────────────────────────────────

const AVAILABLE_SKILLS = [
  'Ethics & Professional Responsibility',
  'Anti-Money Laundering & CTF',
  'Corporate Governance',
  'Regulatory Change Management',
  'Contract Drafting & Negotiation',
  'Data Privacy & Protection',
  'ESG & Sustainability Reporting',
  'AI & Legal Technology',
  'Risk Management',
  'Board Effectiveness & Leadership',
  'Financial Compliance',
  'Cyber Security & Data Governance',
  'Workplace Health & Safety',
  'Dispute Resolution',
  'Stakeholder Engagement',
]

function SkillsCombobox({ selected = [], onChange }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = AVAILABLE_SKILLS.filter(
    s => !selected.includes(s) && s.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">Skills</label>
      <div ref={ref} className="relative">
        <div
          className="flex flex-wrap gap-1.5 min-h-[36px] w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm cursor-text"
          onClick={() => setOpen(true)}
        >
          {selected.map(skill => (
            <span key={skill} className="inline-flex items-center gap-1 h-6 pl-2 pr-1 rounded-md bg-brand-50 border border-brand-200 text-xs font-medium text-brand-800">
              {skill}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(selected.filter(s => s !== skill)) }}
                className="flex items-center justify-center size-4 rounded hover:bg-brand-100 transition-colors"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            placeholder={selected.length === 0 ? 'Search skills...' : ''}
            className="flex-1 min-w-[80px] h-6 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
        </div>
        {open && filtered.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 z-50 max-h-48 overflow-auto rounded-md border border-border bg-white shadow-md">
            {filtered.map(skill => (
              <button
                key={skill}
                type="button"
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
                onClick={() => { onChange([...selected, skill]); setQuery(''); setOpen(false) }}
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Full-screen Create Overlay ─────────────────────────────────────────────

export function CreateJourneyOverlay({ journey, onChange, onClose, variant }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#F3F4F6] flex flex-col">
      <header className="flex items-center justify-between px-6 h-14 border-b border-border bg-white shrink-0">
        <button onClick={onClose} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <X className="size-4" /><span>Cancel</span>
        </button>
        <p className="text-sm font-medium text-foreground">New Learning Journey</p>
        <div className="flex items-center gap-2">
          {variant === 'ethika' && (
            <Button variant="outline" size="sm" onClick={onClose} className="gap-1.5">
              Save Draft
            </Button>
          )}
          <Button size="sm" onClick={onClose} className="gap-1.5">
            {variant === 'ethika' ? 'Publish' : 'Create Journey'} <CheckCircle2 className="size-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — details */}
        <div className="w-1/3 shrink-0 bg-white border-r border-border overflow-auto p-6 space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Journey Name</label>
            <Input value={journey.name} onChange={(e) => onChange({ ...journey, name: e.target.value })} placeholder="e.g. Corporate Governance Fundamentals" className="h-10" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea value={journey.description} onChange={(e) => onChange({ ...journey, description: e.target.value })} placeholder="Describe what this learning journey covers..." rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" /> Expected Duration
            </label>
            <Input value={journey.duration} onChange={(e) => onChange({ ...journey, duration: e.target.value })} placeholder="e.g. 12 weeks" className="h-9" />
          </div>

          <SkillsCombobox
            selected={journey.skills || []}
            onChange={(skills) => onChange({ ...journey, skills })}
          />
        </div>

        {/* Right panel — recommended items */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-lg mx-auto">
            <ElementsBuilder
              elements={journey.elements || []}
              onChange={(elements) => onChange({ ...journey, elements })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Full-screen Edit Overlay ────────────────────────────────────────────────

export function EditJourneyOverlay({ journey, onChange, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#F3F4F6] flex flex-col">
      <header className="flex items-center justify-between px-6 h-14 border-b border-border bg-white shrink-0">
        <button onClick={onClose} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <X className="size-4" /><span>Cancel</span>
        </button>
        <p className="text-sm font-medium text-foreground">Edit Learning Journey</p>
        <Button size="sm" onClick={onSave} className="gap-1.5">
          Save Changes <CheckCircle2 className="size-4" />
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — details */}
        <div className="w-1/3 shrink-0 bg-white border-r border-border overflow-auto p-6 space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Journey Name</label>
            <Input value={journey.name} onChange={(e) => onChange({ ...journey, name: e.target.value })} placeholder="e.g. Corporate Governance Fundamentals" className="h-10" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea value={journey.description} onChange={(e) => onChange({ ...journey, description: e.target.value })} placeholder="Describe what this learning journey covers..." rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" /> Expected Duration
            </label>
            <Input value={journey.duration} onChange={(e) => onChange({ ...journey, duration: e.target.value })} placeholder="e.g. 12 weeks" className="h-9" />
          </div>

          <SkillsCombobox
            selected={journey.skills || []}
            onChange={(skills) => onChange({ ...journey, skills })}
          />
        </div>

        {/* Right panel — recommended items */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-lg mx-auto">
            <ElementsBuilder
              elements={journey.elements || []}
              onChange={(elements) => onChange({ ...journey, elements })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Journey Detail Page ─────────────────────────────────────────────────────

export function JourneyDetailPage({ journey, onChange, onEdit, onBack }) {
  const [showAssign, setShowAssign] = useState(false)

  const toggleRole = (role) => {
    const current = journey.targetRoles
    onChange({ ...journey, targetRoles: current.includes(role) ? current.filter(r => r !== role) : [...current, role] })
  }
  const toggleUser = (id) => {
    const current = journey.assignedUsers
    onChange({ ...journey, assignedUsers: current.includes(id) ? current.filter(i => i !== id) : [...current, id] })
  }

  const participants = PARTICIPANT_PROGRESS[journey.id] || []

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="space-y-3">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-4" /> Back to Learning Journeys
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">
              {journey.name}
            </h1>
            <span className={`inline-flex items-center h-6 px-1.5 rounded-[6px] border text-xs font-medium leading-5 ${JOURNEY_STATUS_STYLE[journey.status]}`}>{journey.status}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowAssign(true)}>
              <UserPlus className="size-4" /> Assign Members
            </Button>
            <Button size="sm" className="gap-1.5" onClick={onEdit}>
              <Pencil className="size-4" /> Edit
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{journey.description}</p>
        {(() => {
          const totalElements = (journey.elements || []).length
          return (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {journey.duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" /> {journey.duration}
              </span>
            )}
            {totalElements > 0 && (
              <span className="flex items-center gap-1.5">
                <BookOpen className="size-3.5" /> {totalElements} items
              </span>
            )}
            {participants.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Users className="size-3.5" /> {participants.length} enrolled
              </span>
            )}
          </div>
          )
        })()}
      </div>

      <Tabs defaultValue="items">
        <TabsList className="h-auto bg-transparent p-0 gap-2">
          <TabsTrigger value="items" className="h-8 rounded-full text-sm px-4 py-1.5 border border-transparent data-[state=active]:bg-[#153e40] data-[state=active]:text-white data-[state=active]:border-transparent data-[state=inactive]:text-[#153e40] data-[state=inactive]:bg-[#f5f5f5] data-[state=active]:shadow-none">Journey Items ({(journey.elements || []).length})</TabsTrigger>
          <TabsTrigger value="participants" className="h-8 rounded-full text-sm px-4 py-1.5 border border-transparent data-[state=active]:bg-[#153e40] data-[state=active]:text-white data-[state=active]:border-transparent data-[state=inactive]:text-[#153e40] data-[state=inactive]:bg-[#f5f5f5] data-[state=active]:shadow-none">Participants ({participants.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="mt-6">
          <ElementsView elements={journey.elements} />
        </TabsContent>

        <TabsContent value="participants" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">Enrolled Members</label>
              <p className="text-xs text-muted-foreground mt-0.5">{participants.length > 0 ? `${participants.length} enrolled` : 'No participants assigned yet'}</p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowAssign(true)}>
              <UserPlus className="size-4" /> Assign Members
            </Button>
          </div>

          {/* Members progress table */}
          {participants.length > 0 && (
            <div className="border border-border/60 rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-xs font-medium text-muted-foreground pl-4">Member</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Role</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Date Started</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Last Active</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map(p => {
                    const user = ASSIGNABLE_USERS.find(u => u.id === p.userId)
                    if (!user) return null
                    return (
                      <TableRow key={p.userId}>
                        <TableCell className="pl-4">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="size-7">
                              <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-foreground leading-tight">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{user.role}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {p.dateStarted ? new Date(p.dateStarted).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.lastActive}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-7">
                                <MoreHorizontal className="size-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toggleUser(p.userId)} className="text-destructive focus:text-destructive">
                                Un-assign
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Assign Members Overlay */}
      {showAssign && createPortal(
        <AssignMembersOverlay
          journey={journey}
          toggleRole={toggleRole}
          toggleUser={toggleUser}
          onClose={() => setShowAssign(false)}
        />,
        document.body,
      )}
    </div>
  )
}

// ─── Assign Members Overlay ──────────────────────────────────────────────────

function AssignMembersOverlay({ journey, toggleRole, toggleUser, onClose }) {
  const [userSearch, setUserSearch] = useState('')

  const filteredUsers = ASSIGNABLE_USERS.filter(u => {
    if (!userSearch) return true
    return u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl border border-border shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Assign Members</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Select roles for automatic enrolment or add individual users</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-6 py-4 space-y-5">
          {/* By Role */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">By Role</label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_ROLES.map(role => {
                const isSelected = journey.targetRoles.includes(role)
                return (
                  <button key={role} onClick={() => toggleRole(role)} className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors ${isSelected ? 'bg-brand-100 text-brand-800 border-brand-200' : 'border-border text-muted-foreground hover:border-brand-400 hover:text-brand-700'}`}>
                    {isSelected && <span className="mr-1">&#10003;</span>}{role}
                  </button>
                )
              })}
            </div>
            {journey.targetRoles.length > 0 && (
              <p className="text-xs text-muted-foreground">All users with {journey.targetRoles.length === 1 ? 'this role' : 'these roles'} will be enrolled automatically.</p>
            )}
          </div>

          <Separator />

          {/* Individual Users */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Individual Users</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search users..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="pl-9 h-9 text-sm" />
            </div>
            <div className="border border-border/60 rounded-lg divide-y divide-border/60 overflow-hidden max-h-[280px] overflow-y-auto">
              {filteredUsers.map(user => {
                const isAdded = journey.assignedUsers.includes(user.id)
                return (
                  <div key={user.id} className="flex items-center justify-between py-2.5 px-3 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-7">
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground leading-tight">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleUser(user.id)}
                      className={`size-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                        isAdded
                          ? 'bg-brand-600 border border-brand-600 text-white'
                          : 'border border-border hover:border-brand-400'
                      }`}
                    >
                      {isAdded && <Check className="size-2.5" strokeWidth={3} />}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t border-border shrink-0">
          <Button size="sm" onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  )
}

// ─── Learning Logs Review (admin view mode) ─────────────────────────────────

function LearningLogsReview({ journeyId }) {
  const [logs, setLogs] = useState(LEARNING_LOGS[journeyId] || [])
  const [respondingId, setRespondingId] = useState(null)
  const [feedback, setFeedback] = useState('')

  if (logs.length === 0) return null

  const handleAcknowledge = (logId) => {
    setLogs(prev => prev.filter(l => l.id !== logId))
    setRespondingId(null)
    setFeedback('')
  }

  const handleSendFeedback = (logId) => {
    setLogs(prev => prev.filter(l => l.id !== logId))
    setRespondingId(null)
    setFeedback('')
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">Learning Logs</label>
          <span className="inline-flex items-center h-5 px-1.5 rounded-full border border-brand-200 bg-brand-50 text-xs font-medium text-brand-700">
            {logs.length}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">Reflections logged by participants</p>
      </div>

      <div className="space-y-3">
        {logs.map(log => {
          const user = ASSIGNABLE_USERS.find(u => u.id === log.userId)
          if (!user) return null
          const isResponding = respondingId === log.id

          return (
            <div key={log.id} className="rounded-[10px] border border-border bg-white overflow-hidden">
              <div className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Avatar className="size-7 shrink-0 mt-0.5">
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <span className="text-xs text-muted-foreground">{user.role}</span>
                      </div>
                      <p className="text-xs text-foreground font-medium mt-1">{log.elementTitle}</p>
                      <div className="mt-2 rounded-[6px] border border-border bg-muted/20 p-2.5">
                        <p className="text-xs text-foreground leading-relaxed">{log.note}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Logged {new Date(log.submittedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {!isResponding && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button variant="outline" size="xs" className="gap-1 text-xs h-7" onClick={() => handleAcknowledge(log.id)}>
                        <ThumbsUp className="size-3" /> Acknowledge
                      </Button>
                      <Button variant="outline" size="xs" className="gap-1 text-xs h-7" onClick={() => setRespondingId(log.id)}>
                        <Send className="size-3" /> Respond
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {isResponding && (
                <div className="px-4 pb-3">
                  <div className="rounded-[8px] border border-border bg-muted/20 p-3 space-y-3">
                    <label className="text-xs font-medium text-foreground">Feedback</label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="e.g. Great reflection. Consider also looking into..."
                      rows={2}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring resize-none"
                      autoFocus
                    />
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="xs" onClick={() => { setRespondingId(null); setFeedback('') }}>Cancel</Button>
                      <Button size="xs" className="gap-1" onClick={() => handleSendFeedback(log.id)} disabled={!feedback.trim()}>
                        <Send className="size-3" /> Send Feedback
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Items View (read-only, used in view mode) ──────────────────────────────

function ElementsView({ elements }) {
  if (!elements || elements.length === 0) {
    return (
      <div className="border border-border/60 rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground">No items have been added to this journey yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground">Recommended Items</label>
        <p className="text-xs text-muted-foreground mt-0.5">{elements.length} item{elements.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="space-y-2">
        {elements.sort((a, b) => a.order - b.order).map((el, i) => (
          <div key={el.id} className="flex items-start gap-3 rounded-[10px] border border-[rgba(229,229,229,0.6)] bg-white px-4 py-3">
            <span className="text-xs font-medium text-muted-foreground w-5 text-right shrink-0 pt-0.5">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{el.title}</p>
              {el.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{el.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Items Builder (editable, used in edit/create mode) ─────────────────────

const ITEM_TYPES = [
  { value: 'task', label: 'Task', icon: CheckCircle2 },
  { value: 'milestone', label: 'Milestone', icon: Flag },
  { value: 'event', label: 'Event', icon: Calendar },
  { value: 'reading', label: 'Reading', icon: FileText },
  { value: 'video', label: 'Video', icon: Video },
]

function ElementsBuilder({ elements, onChange }) {
  const [editingId, setEditingId] = useState(null)

  const addItem = () => {
    const newId = elements.length > 0 ? Math.max(...elements.map(e => e.id)) + 1 : 1
    const newEl = { id: newId, title: '', type: 'task', description: '', links: [], order: elements.length + 1 }
    onChange([...elements, newEl])
    setEditingId(newId)
  }

  const updateElement = (id, updates) => {
    onChange(elements.map(e => e.id === id ? { ...e, ...updates } : e))
  }

  const removeElement = (id) => {
    const filtered = elements.filter(e => e.id !== id)
    onChange(filtered.map((e, i) => ({ ...e, order: i + 1 })))
    if (editingId === id) setEditingId(null)
  }

  const moveElement = (id, direction) => {
    const sorted = [...elements].sort((a, b) => a.order - b.order)
    const idx = sorted.findIndex(e => e.id === id)
    if (direction === 'up' && idx > 0) {
      [sorted[idx].order, sorted[idx - 1].order] = [sorted[idx - 1].order, sorted[idx].order]
    } else if (direction === 'down' && idx < sorted.length - 1) {
      [sorted[idx].order, sorted[idx + 1].order] = [sorted[idx + 1].order, sorted[idx].order]
    }
    onChange([...sorted])
  }

  const addLink = (id) => {
    const el = elements.find(e => e.id === id)
    updateElement(id, { links: [...(el.links || []), ''] })
  }

  const updateLink = (id, linkIdx, value) => {
    const el = elements.find(e => e.id === id)
    const updated = [...(el.links || [])]
    updated[linkIdx] = value
    updateElement(id, { links: updated })
  }

  const removeLink = (id, linkIdx) => {
    const el = elements.find(e => e.id === id)
    updateElement(id, { links: (el.links || []).filter((_, i) => i !== linkIdx) })
  }


  const sorted = [...elements].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground">Recommended Items</label>
        <p className="text-xs text-muted-foreground mt-0.5">Add the items you'd recommend for this learning guide.</p>
      </div>

      {sorted.length > 0 && (
        <div className="space-y-2">
          {sorted.map((el, i) => {
            const typeInfo = ITEM_TYPES.find(t => t.value === el.type) || ITEM_TYPES[0]
            const TypeIcon = typeInfo.icon

            if (editingId === el.id) {
              return (
                <div key={el.id} className="rounded-[10px] border border-border bg-white ring-1 ring-brand-200 px-4 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{i + 1}</span>
                    <button onClick={() => removeElement(el.id)} className="size-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>

                  {/* Type selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Type</label>
                    <div className="flex gap-1.5">
                      {ITEM_TYPES.map(t => {
                        const TIcon = t.icon
                        return (
                          <button
                            key={t.value}
                            onClick={() => updateElement(el.id, { type: t.value })}
                            className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium border transition-colors ${
                              el.type === t.value
                                ? 'bg-[#153e40] text-white border-[#153e40]'
                                : 'bg-white text-muted-foreground border-border hover:bg-muted/30'
                            }`}
                          >
                            <TIcon className="size-3" />
                            {t.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Title</label>
                    <Input
                      value={el.title}
                      onChange={(e) => updateElement(el.id, { title: e.target.value })}
                      placeholder="e.g. Read: Board Governance Guide"
                      className="h-9 text-sm bg-white"
                      autoFocus
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Description</label>
                    <textarea
                      value={el.description}
                      onChange={(e) => updateElement(el.id, { description: e.target.value })}
                      placeholder="Describe what this item involves and any context"
                      rows={2}
                      className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring resize-none"
                    />
                  </div>

                  {/* Links & Resources */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-muted-foreground">Links & Resources</label>
                      <button onClick={() => addLink(el.id)} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                        <Plus className="size-3" /> Add link
                      </button>
                    </div>
                    {(el.links || []).map((link, li) => (
                      <div key={li} className="flex items-center gap-1.5">
                        <div className="relative flex-1">
                          <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                          <Input
                            value={link}
                            onChange={(e) => updateLink(el.id, li, e.target.value)}
                            placeholder="Paste a URL, document link, or resource"
                            className="h-8 text-sm pl-8 bg-white"
                          />
                        </div>
                        <button onClick={() => removeLink(el.id, li)} className="size-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors shrink-0">
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button size="sm" onClick={() => setEditingId(null)} className="gap-1.5">
                      Done <CheckCircle2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              )
            }

            return (
              <div key={el.id} className="flex items-start gap-2 rounded-[10px] border border-[rgba(229,229,229,0.6)] bg-white px-3 py-2.5 group hover:border-border transition-colors">
                <div className="flex flex-col items-center gap-0.5 shrink-0 pt-1">
                  <button onClick={() => moveElement(el.id, 'up')} disabled={i === 0} className="text-muted-foreground/40 hover:text-muted-foreground disabled:opacity-0 transition-colors">
                    <ChevronUp className="size-3" />
                  </button>
                  <GripVertical className="size-3.5 text-muted-foreground/30" />
                  <button onClick={() => moveElement(el.id, 'down')} disabled={i === sorted.length - 1} className="text-muted-foreground/40 hover:text-muted-foreground disabled:opacity-0 transition-colors">
                    <ChevronDown className="size-3" />
                  </button>
                </div>
                <span className="text-xs font-medium text-muted-foreground w-5 text-right shrink-0 pt-1.5">{i + 1}</span>
                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <div className="size-6 rounded-md flex items-center justify-center bg-muted/50">
                    <TypeIcon className="size-3 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-foreground">{el.title || <span className="text-muted-foreground italic">Untitled item</span>}</p>
                    <span className="inline-flex items-center h-4.5 px-1.5 rounded text-[10px] font-medium bg-[#f5f5f5] text-muted-foreground">{typeInfo.label}</span>
                  </div>
                  {el.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{el.description}</p>}
                  {(el.links || []).length > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Link2 className="size-2.5" /> {el.links.length} link{el.links.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                  <button onClick={() => setEditingId(el.id)} className="size-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
                    <Pencil className="size-3.5" />
                  </button>
                  <button onClick={() => removeElement(el.id)} className="size-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Button variant="outline" size="sm" className="gap-1.5 text-sm" onClick={addItem}>
        <Plus className="size-4" /> Add Item
      </Button>
    </div>
  )
}

// ─── Assignment UI (shared between view + edit) ─────────────────────────────

function AssignmentUI({ journey, toggleRole, toggleUser, userSearch, setUserSearch, filteredUsers }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium text-foreground">Assign Participants</label>
        <p className="text-xs text-muted-foreground mt-0.5">Select roles for automatic enrolment and/or add individual users</p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">By Role</label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_ROLES.map(role => {
            const isSelected = journey.targetRoles.includes(role)
            return (
              <button key={role} onClick={() => toggleRole(role)} className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors ${isSelected ? 'bg-brand-100 text-brand-800 border-brand-200' : 'border-border text-muted-foreground hover:border-brand-400 hover:text-brand-700'}`}>
                {isSelected && <span className="mr-1">&#10003;</span>}{role}
              </button>
            )
          })}
        </div>
        {journey.targetRoles.length > 0 && (
          <p className="text-xs text-muted-foreground">All users with {journey.targetRoles.length === 1 ? 'this role' : 'these roles'} will be enrolled automatically.</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Individual Users</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search users..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <div className="border border-border/60 rounded-lg divide-y divide-border/60 overflow-hidden max-h-[280px] overflow-y-auto">
          {filteredUsers.map(user => {
            const isAdded = journey.assignedUsers.includes(user.id)
            return (
              <div key={user.id} className="flex items-center justify-between py-2.5 px-3 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleUser(user.id)}
                  className={`size-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                    isAdded
                      ? 'bg-brand-600 border border-brand-600 text-white'
                      : 'border border-border hover:border-brand-400'
                  }`}
                >
                  {isAdded && <Check className="size-2.5" strokeWidth={3} />}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
