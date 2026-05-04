import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Check, CheckCircle2, Clock, X, Plus, BookOpen, Video, Users, Award,
  MoreHorizontal, Pencil, Trash2, ChevronDown, ExternalLink, Link2, Upload,
  CalendarPlus, MapPin, Calendar, Shield, Search, UserMinus, ArrowUpCircle,
} from 'lucide-react'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CPD_TEAM = [
  { id: 1, name: 'Sarah Chen', email: 'sarah@blackmores.com', initials: 'SC', role: 'Senior Lawyer', required: 20, completed: 18, requirements: { total: 6, done: 5 } },
  { id: 2, name: 'James Harrington', email: 'james@blackmores.com', initials: 'JH', role: 'General Counsel', required: 24, completed: 24, requirements: { total: 8, done: 8 } },
  { id: 3, name: 'Priya Patel', email: 'priya@blackmores.com', initials: 'PP', role: 'Compliance Officer', required: 20, completed: 14, requirements: { total: 6, done: 4 } },
  { id: 4, name: 'Michael Torres', email: 'michael@blackmores.com', initials: 'MT', role: 'Junior Lawyer', required: 16, completed: 8, requirements: { total: 5, done: 2 } },
  { id: 5, name: 'Emily Watson', email: 'emily@blackmores.com', initials: 'EW', role: 'HR Manager', required: 12, completed: 12, requirements: { total: 4, done: 4 } },
  { id: 6, name: 'David Kim', email: 'david@blackmores.com', initials: 'DK', role: 'Finance Manager', required: 16, completed: 10, requirements: { total: 5, done: 3 } },
  { id: 7, name: 'Rachel Adams', email: 'rachel@blackmores.com', initials: 'RA', role: 'Company Secretary', required: 20, completed: 19, requirements: { total: 6, done: 6 } },
  { id: 8, name: 'Tom Bradley', email: 'tom@email.com', initials: 'TB', role: 'Board Member', required: 20, completed: 3, requirements: { total: 4, done: 1 } },
  { id: 9, name: 'Aisha Mohammed', email: 'aisha@blackmores.com', initials: 'AM', role: 'Senior Lawyer', required: 20, completed: 20, requirements: { total: 6, done: 6 } },
  { id: 10, name: 'Liam O\'Brien', email: 'liam@blackmores.com', initials: 'LO', role: 'Junior Lawyer', required: 16, completed: 12, requirements: { total: 5, done: 4 } },
]

const CPD_ACTIVITY_TYPES = {
  course:    { icon: BookOpen, label: 'Course', color: 'bg-blue-50 text-blue-700' },
  webinar:   { icon: Video, label: 'Webinar', color: 'bg-purple-50 text-purple-700' },
  workshop:  { icon: Users, label: 'Workshop', color: 'bg-amber-50 text-amber-700' },
  certification: { icon: Award, label: 'Certification', color: 'bg-emerald-50 text-emerald-700' },
}

// Mock CPD activity per member (keyed by member id)
const CPD_ACTIVITIES = {
  1: [
    { id: 1, title: 'Privacy Law Update 2026', type: 'course', hours: 4, date: '2026-02-20', status: 'Completed' },
    { id: 2, title: 'Corporate Governance Essentials', type: 'webinar', hours: 2, date: '2026-02-10', status: 'Completed' },
    { id: 3, title: 'Risk Management Workshop', type: 'workshop', hours: 6, date: '2026-01-25', status: 'Completed' },
    { id: 4, title: 'ESG Reporting Standards', type: 'course', hours: 4, date: '2026-01-15', status: 'Completed' },
    { id: 5, title: 'Anti-Money Laundering Advanced', type: 'course', hours: 2, date: '2026-03-01', status: 'In Progress' },
  ],
  2: [
    { id: 1, title: 'Board Governance Masterclass', type: 'certification', hours: 8, date: '2026-01-10', status: 'Completed' },
    { id: 2, title: 'Regulatory Change Management', type: 'course', hours: 6, date: '2026-02-05', status: 'Completed' },
    { id: 3, title: 'Financial Compliance Update', type: 'webinar', hours: 2, date: '2026-02-18', status: 'Completed' },
    { id: 4, title: 'ESG Leadership Forum', type: 'workshop', hours: 4, date: '2026-02-28', status: 'Completed' },
    { id: 5, title: 'Data Privacy Fundamentals', type: 'course', hours: 4, date: '2026-03-02', status: 'Completed' },
  ],
  3: [
    { id: 1, title: 'AML Compliance Refresher', type: 'course', hours: 4, date: '2026-02-12', status: 'Completed' },
    { id: 2, title: 'WHS Due Diligence', type: 'webinar', hours: 2, date: '2026-01-22', status: 'Completed' },
    { id: 3, title: 'Risk Assessment Workshop', type: 'workshop', hours: 4, date: '2026-02-01', status: 'Completed' },
    { id: 4, title: 'Corporate Ethics Seminar', type: 'course', hours: 4, date: '2026-03-05', status: 'In Progress' },
  ],
  4: [
    { id: 1, title: 'Legal Research Fundamentals', type: 'course', hours: 4, date: '2026-02-15', status: 'Completed' },
    { id: 2, title: 'Contract Law Update', type: 'webinar', hours: 2, date: '2026-01-30', status: 'Completed' },
    { id: 3, title: 'Compliance Foundations', type: 'course', hours: 2, date: '2026-02-25', status: 'In Progress' },
  ],
  5: [
    { id: 1, title: 'Employment Law Update', type: 'course', hours: 4, date: '2026-01-20', status: 'Completed' },
    { id: 2, title: 'WHS Officer Training', type: 'certification', hours: 6, date: '2026-02-08', status: 'Completed' },
    { id: 3, title: 'HR Compliance Workshop', type: 'workshop', hours: 2, date: '2026-02-22', status: 'Completed' },
  ],
  6: [
    { id: 1, title: 'Financial Reporting Standards', type: 'course', hours: 4, date: '2026-02-10', status: 'Completed' },
    { id: 2, title: 'AML Awareness', type: 'webinar', hours: 2, date: '2026-01-28', status: 'Completed' },
    { id: 3, title: 'ESG Reporting Frameworks', type: 'course', hours: 4, date: '2026-03-01', status: 'In Progress' },
  ],
  7: [
    { id: 1, title: 'Governance Best Practices', type: 'certification', hours: 8, date: '2026-01-15', status: 'Completed' },
    { id: 2, title: 'Board Secretary Essentials', type: 'course', hours: 4, date: '2026-02-05', status: 'Completed' },
    { id: 3, title: 'Regulatory Change Webinar', type: 'webinar', hours: 2, date: '2026-02-20', status: 'Completed' },
    { id: 4, title: 'Corporate Records Management', type: 'workshop', hours: 3, date: '2026-02-28', status: 'Completed' },
    { id: 5, title: 'Privacy Officer Training', type: 'course', hours: 2, date: '2026-03-04', status: 'In Progress' },
  ],
  8: [
    { id: 1, title: 'Director Duties Refresher', type: 'course', hours: 4, date: '2026-02-18', status: 'Completed' },
    { id: 2, title: 'ESG for Board Members', type: 'webinar', hours: 2, date: '2026-01-25', status: 'Completed' },
  ],
  9: [
    { id: 1, title: 'Privacy Law Masterclass', type: 'certification', hours: 8, date: '2026-01-12', status: 'Completed' },
    { id: 2, title: 'Contract Negotiation Workshop', type: 'workshop', hours: 4, date: '2026-02-02', status: 'Completed' },
    { id: 3, title: 'Corporate Governance Update', type: 'webinar', hours: 2, date: '2026-02-15', status: 'Completed' },
    { id: 4, title: 'Risk Management Advanced', type: 'course', hours: 4, date: '2026-02-26', status: 'Completed' },
    { id: 5, title: 'Financial Compliance Review', type: 'course', hours: 2, date: '2026-03-03', status: 'Completed' },
  ],
  10: [
    { id: 1, title: 'Legal Writing Skills', type: 'course', hours: 4, date: '2026-02-08', status: 'Completed' },
    { id: 2, title: 'Regulatory Landscape Overview', type: 'webinar', hours: 2, date: '2026-01-20', status: 'Completed' },
    { id: 3, title: 'Compliance Fundamentals', type: 'workshop', hours: 4, date: '2026-02-18', status: 'Completed' },
    { id: 4, title: 'AML Essentials', type: 'course', hours: 2, date: '2026-03-02', status: 'In Progress' },
  ],
}

const ACTIVITY_TYPE_OPTIONS = ['course', 'webinar', 'workshop', 'certification']

const ALL_CPD_REGIMES = [
  { id: 'law-society-nsw', name: 'Law Society NSW', description: 'Mandatory CPD for NSW solicitors holding a practising certificate', totalPoints: 10, period: '1 Apr – 31 Mar', categories: 5, requirements: [
    { name: 'Ethics & Professional Responsibility', points: 1 }, { name: 'Practice Management & Business Skills', points: 1 }, { name: 'Professional Skills', points: 1 }, { name: 'Substantive Law', points: 1 }, { name: 'Unrestricted', points: 6 },
  ] },
  { id: 'aicd', name: 'AICD', description: 'Australian Institute of Company Directors — Fellow & Member CPD', totalPoints: 15, period: '1 Jan – 31 Dec', categories: 5, requirements: [
    { name: 'Governance & Risk', points: 3 }, { name: 'Strategy & Performance', points: 3 }, { name: 'Digital & Innovation', points: 2 }, { name: 'Leadership & Culture', points: 2 }, { name: 'General', points: 5 },
  ] },
  { id: 'governance-institute', name: 'Governance Institute', description: 'Governance Institute of Australia — Chartered Secretary & Governance Professional', totalPoints: 20, period: '1 Jul – 30 Jun', categories: 5, requirements: [
    { name: 'Governance', points: 4 }, { name: 'Risk & Compliance', points: 4 }, { name: 'Board Support', points: 4 }, { name: 'Legal & Regulatory', points: 4 }, { name: 'General CPD', points: 4 },
  ] },
  { id: 'cpa-australia', name: 'CPA Australia', description: 'CPA Australia — Certified Practising Accountant CPD requirements', totalPoints: 120, period: '1 Jan – 31 Dec (triennium)', categories: 2, requirements: [
    { name: 'Verifiable CPD', points: 80 }, { name: 'Non-Verifiable CPD', points: 40 },
  ] },
  { id: 'law-council', name: 'Law Council of Australia', description: 'National standard for continuing professional development of legal practitioners', totalPoints: 10, period: '1 Jan – 31 Dec', categories: 4, requirements: [
    { name: 'Ethics & Professional Responsibility', points: 1 }, { name: 'Legal Skills', points: 1 }, { name: 'Substantive Law', points: 1 }, { name: 'Unrestricted', points: 7 },
  ] },
  { id: 'tax-practitioners-board', name: 'Tax Practitioners Board', description: 'Registered Tax Agent and BAS Agent CPD requirements', totalPoints: 45, period: '1 Jul – 30 Jun (triennium)', categories: 3, requirements: [
    { name: 'Tax (Technical)', points: 20 }, { name: 'Ethics & Governance', points: 5 }, { name: 'General CPD', points: 20 },
  ] },
  { id: 'finsia', name: 'FINSIA', description: 'Financial Services Institute of Australasia — CPD for financial professionals', totalPoints: 40, period: '1 Jan – 31 Dec', categories: 4, requirements: [
    { name: 'Technical Competence', points: 15 }, { name: 'Regulatory & Compliance', points: 10 }, { name: 'Ethics & Professionalism', points: 5 }, { name: 'General', points: 10 },
  ] },
  { id: 'apesb', name: 'APESB (APES 130)', description: 'Accounting Professional & Ethical Standards Board — professional development standard', totalPoints: 120, period: '1 Jan – 31 Dec (triennium)', categories: 2, requirements: [
    { name: 'Verifiable Activities', points: 80 }, { name: 'Non-Verifiable Activities', points: 40 },
  ] },
]

// Mock: which regimes are assigned to which team members
const INITIAL_REGIME_ASSIGNMENTS = {
  'law-society-nsw': [1, 3, 4, 7, 9, 10],
  'aicd': [2, 7, 8],
  'governance-institute': [2, 3, 7],
  'cpa-australia': [5, 6],
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminCPDPage() {
  const [selectedMember, setSelectedMember] = useState(null)
  const [activeTab, setActiveTab] = useState('compliance')
  const [regimeAssignments, setRegimeAssignments] = useState(INITIAL_REGIME_ASSIGNMENTS)
  const [managingRegime, setManagingRegime] = useState(null)
  const [viewingRegime, setViewingRegime] = useState(null)

  const compliant = CPD_TEAM.filter(m => m.completed >= m.required).length
  const compliancePct = Math.round((compliant / CPD_TEAM.length) * 100)
  const avgHours = (CPD_TEAM.reduce((a, m) => a + m.completed, 0) / CPD_TEAM.length).toFixed(1)

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">CPD Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Define CPD requirements, track compliance, and manage professional development standards across your organisation</p>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          {[
            { label: 'Team Members', value: CPD_TEAM.length },
            { label: 'Team Compliance', value: `${compliancePct}%` },
            { label: 'Avg Points Logged', value: `${avgHours}pt` },
          ].map(s => (
            <div key={s.label} className="flex-1 rounded-[8px] border border-[#f5f5f5] bg-white p-4 space-y-1">
              <p className="text-[17px] font-medium text-[#0a0a0a] tracking-[-0.15px] leading-5">{s.value}</p>
              <p className="text-xs font-normal text-[rgba(10,10,10,0.6)]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList className="h-auto bg-transparent p-0 gap-2">
              <TabsTrigger value="compliance" className="h-8 rounded-full text-sm px-4 py-1.5 border border-transparent data-[state=active]:bg-[#153e40] data-[state=active]:text-white data-[state=active]:border-transparent data-[state=inactive]:text-[#153e40] data-[state=inactive]:bg-[#f5f5f5] data-[state=active]:shadow-none">
                Team Compliance
              </TabsTrigger>
<TabsTrigger value="regimes" className="h-8 rounded-full text-sm px-4 py-1.5 border border-transparent data-[state=active]:bg-[#153e40] data-[state=active]:text-white data-[state=active]:border-transparent data-[state=inactive]:text-[#153e40] data-[state=inactive]:bg-[#f5f5f5] data-[state=active]:shadow-none">
                CPD Regimes ({ALL_CPD_REGIMES.length})
              </TabsTrigger>
            </TabsList>

          </div>

          {/* ── Team Compliance Tab ──────────────────────────────────── */}
          <TabsContent value="compliance" className="mt-4">
            <div className="border border-border/60 rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-xs font-medium text-muted-foreground">Team Member</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Role</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">CPD Points</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-[180px]">Progress</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Requirements</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CPD_TEAM.map(m => {
                    const pct = Math.round((m.completed / m.required) * 100)
                    const isComplete = pct >= 100
                    const isAtRisk = pct < 50
                    return (
                      <TableRow key={m.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setSelectedMember(m)}>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Avatar className="size-7">
                              <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">{m.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-foreground leading-tight">{m.name}</p>
                              <p className="text-xs text-muted-foreground">{m.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{m.role}</TableCell>
                        <TableCell className="text-sm font-medium text-foreground">{m.completed}<span className="text-muted-foreground font-normal">/{m.required}h</span></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Progress value={Math.min(pct, 100)} className={`h-1.5 max-w-[32px] bg-muted [&>[data-slot=progress-indicator]]:rounded-full ${pct <= 25 ? '[&>[data-slot=progress-indicator]]:bg-[#f87171]' : pct <= 60 ? '[&>[data-slot=progress-indicator]]:bg-[#facc15]' : '[&>[data-slot=progress-indicator]]:bg-[#34D399]'}`} />
                            <span className="text-xs font-medium text-muted-foreground w-8 text-right">{pct}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{m.requirements.done}/{m.requirements.total} complete</TableCell>
                        <TableCell>
                          {isComplete ? (
                            <span className="inline-flex items-center h-6 px-1.5 rounded-[6px] border text-xs font-medium leading-5 bg-[#ecfdf5] text-[#153e40] border-[#a7f3d0]">
                              Compliant
                            </span>
                          ) : isAtRisk ? (
                            <span className="inline-flex items-center h-6 px-1.5 rounded-[6px] border text-xs font-medium leading-5 bg-[#fef2f2] text-[#7f1d1d] border-[#fecaca]">
                              At Risk
                            </span>
                          ) : (
                            <span className="inline-flex items-center h-6 px-1.5 rounded-[6px] border text-xs font-medium leading-5 bg-[#eff6ff] text-[#1e3a8a] border-[#bfdbfe]">
                              In Progress
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* ── CPD Regimes Tab ──────────────────────────────────────── */}
          <TabsContent value="regimes" className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">Manage which CPD regimes are available and assign them to team members. Members will see their assigned regimes on their CPD Tracker.</p>

            <div className="border border-border/60 rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-xs font-medium text-muted-foreground pl-4">Regime</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Period</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Points Required</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Categories</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Assigned To</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-10 pr-4"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ALL_CPD_REGIMES.map(regime => {
                    const assignedIds = regimeAssignments[regime.id] || []
                    const assignedMembers = CPD_TEAM.filter(m => assignedIds.includes(m.id))
                    return (
                      <TableRow key={regime.id} className="hover:bg-muted/30">
                        <TableCell className="pl-4">
                          <div>
                            <p className="text-sm font-medium text-foreground leading-tight">{regime.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{regime.description}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{regime.period}</TableCell>
                        <TableCell className="text-sm font-medium">{regime.totalPoints}pts</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{regime.categories}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {assignedMembers.length}
                        </TableCell>
                        <TableCell className="pr-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-7">
                                <MoreHorizontal className="size-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setViewingRegime(regime)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setManagingRegime(regime)}>
                                Manage Assignments
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
          </TabsContent>
        </Tabs>
      </div>

      {/* CPD Detail Overlay */}
      {selectedMember && createPortal(
        <CPDMemberOverlay member={selectedMember} regimeAssignments={regimeAssignments} onClose={() => setSelectedMember(null)} />,
        document.body,
      )}

      {/* Regime Details Overlay */}
      {viewingRegime && createPortal(
        <RegimeDetailsOverlay regime={viewingRegime} assignedCount={(regimeAssignments[viewingRegime.id] || []).length} onClose={() => setViewingRegime(null)} />,
        document.body,
      )}

      {/* Regime Management Overlay */}
      {managingRegime && createPortal(
        <RegimeManageOverlay
          regime={managingRegime}
          assignedIds={regimeAssignments[managingRegime.id] || []}
          allMembers={CPD_TEAM}
          onClose={() => setManagingRegime(null)}
          onSave={(ids) => {
            setRegimeAssignments(prev => ({ ...prev, [managingRegime.id]: ids }))
            setManagingRegime(null)
          }}
        />,
        document.body,
      )}
    </>
  )
}

// ─── CPD Member Detail Overlay ──────────────────────────────────────────────

function CPDMemberOverlay({ member, regimeAssignments, onClose }) {
  const [showLogForm, setShowLogForm] = useState(false)
  const [logForm, setLogForm] = useState({ type: '', points: '', description: '', link: '' })
  const [overrides, setOverrides] = useState({})
  const [editingActivityId, setEditingActivityId] = useState(null)
  const [editValue, setEditValue] = useState('')

  const activities = CPD_ACTIVITIES[member.id] || []
  const pct = Math.round((member.completed / member.required) * 100)
  const isComplete = pct >= 100
  const isAtRisk = pct < 50

  const completedActivities = activities.filter(a => a.status === 'Completed')
  const inProgressActivities = activities.filter(a => a.status === 'In Progress')

  const handleLogSubmit = () => {
    setShowLogForm(false)
    setLogForm({ type: '', points: '', description: '', link: '' })
  }

  const handleLogClear = () => {
    setLogForm({ type: '', points: '', description: '', link: '' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl border border-border shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">{member.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-sm font-semibold text-foreground">{member.name}</h2>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
              isComplete ? 'text-emerald-700 bg-emerald-50' : isAtRisk ? 'text-red-700 bg-red-50' : 'text-amber-700 bg-amber-50'
            }`}>
              {isComplete ? <><CheckCircle2 className="size-3" /> Compliant</> : isAtRisk ? <><Clock className="size-3" /> At Risk</> : <><Clock className="size-3" /> In Progress</>}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="gap-1.5" onClick={() => setShowLogForm(true)}>
              <Plus className="size-4" /> Log CPD
            </Button>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto p-6 space-y-5">

          {/* Progress summary cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-[8px] border border-[#f5f5f5] bg-white p-4 space-y-1.5">
              <p className="text-xs text-muted-foreground">CPD Points</p>
              <p className="text-lg font-semibold text-foreground">{member.completed}<span className="text-sm text-muted-foreground font-normal">/{member.required}pt</span></p>
              <Progress value={Math.min(pct, 100)} className="h-1.5" />
            </div>
            <div className="rounded-[8px] border border-[#f5f5f5] bg-white p-4 space-y-1.5">
              <p className="text-xs text-muted-foreground">Requirements Met</p>
              <p className="text-lg font-semibold text-foreground">{member.requirements.done}<span className="text-sm text-muted-foreground font-normal">/{member.requirements.total}</span></p>
              <Progress value={Math.round((member.requirements.done / member.requirements.total) * 100)} className="h-1.5" />
            </div>
            <div className="rounded-[8px] border border-[#f5f5f5] bg-white p-4 space-y-1.5">
              <p className="text-xs text-muted-foreground">Activities Logged</p>
              <p className="text-lg font-semibold text-foreground">{activities.length}</p>
              <p className="text-xs text-muted-foreground">{inProgressActivities.length} in progress</p>
            </div>
          </div>

          {/* Assigned CPD Regimes */}
          {(() => {
            const memberRegimes = ALL_CPD_REGIMES.filter(r =>
              (regimeAssignments[r.id] || []).includes(member.id)
            )
            if (memberRegimes.length === 0) return null
            return (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">Assigned CPD Regimes</h3>
                <div className="flex flex-wrap gap-1.5">
                  {memberRegimes.map(r => (
                    <span key={r.id} className="inline-flex items-center h-6 px-2 rounded-md border border-[#e5e7eb] bg-[#f9fafb] text-xs font-medium text-[#374151]">
                      {r.name}
                    </span>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Log CPD Form */}
          {showLogForm && (
            <>
              <Separator />
              <div className="border border-border rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">Log CPD Activity</h3>
                  <button onClick={() => setShowLogForm(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="size-4" />
                  </button>
                </div>

                {/* Activity Type */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Activity Type</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-between h-9 text-sm font-normal">
                        {logForm.type ? CPD_ACTIVITY_TYPES[logForm.type].label : <span className="text-muted-foreground">Select activity type</span>}
                        <ChevronDown className="size-3.5 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]">
                      {ACTIVITY_TYPE_OPTIONS.map(t => (
                        <DropdownMenuItem key={t} onClick={() => setLogForm({ ...logForm, type: t })}>
                          {CPD_ACTIVITY_TYPES[t].label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Hours Completed */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Points Earned</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={logForm.points}
                      onChange={(e) => setLogForm({ ...logForm, points: e.target.value })}
                      placeholder="e.g. 2.5"
                      className="h-9 pl-9"
                    />
                  </div>
                </div>

                {/* Description of Learning */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Description of Learning</label>
                  <textarea
                    value={logForm.description}
                    onChange={(e) => setLogForm({ ...logForm, description: e.target.value })}
                    placeholder="Describe what you learned..."
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  />
                </div>

                {/* Link to Learning Journey (optional) */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Link to Learning Journey <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      value={logForm.link}
                      onChange={(e) => setLogForm({ ...logForm, link: e.target.value })}
                      placeholder="Paste link or search journeys..."
                      className="h-9 pl-9"
                    />
                  </div>
                </div>

                {/* Upload Evidence (optional) */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Upload Evidence <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 px-4 py-6 text-center cursor-pointer hover:border-muted-foreground/40 transition-colors">
                    <Upload className="size-5 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">PDF, DOC, JPG, PNG up to 10MB</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button size="sm" onClick={handleLogSubmit} disabled={!logForm.type || !logForm.points || !logForm.description}>Log Activity</Button>
                  <Button variant="outline" size="sm" onClick={handleLogClear}>Clear</Button>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Activity list */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">CPD Activity Log</h3>

            {inProgressActivities.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">In Progress</p>
                {inProgressActivities.map(a => {
                  const typeInfo = CPD_ACTIVITY_TYPES[a.type]
                  const pts = overrides[a.id] ?? a.hours
                  const isEdited = overrides[a.id] !== undefined
                  const isEditing = editingActivityId === a.id
                  return (
                    <div key={a.id} className="border border-border/60 rounded-lg hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-3 p-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {typeInfo.label} &middot; {pts}pt{isEdited && <span className="ml-1 text-amber-600 font-medium">Edited</span>} &middot; {a.date}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-amber-700 bg-amber-50 rounded-full px-2 py-0.5 shrink-0">In Progress</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-7 text-muted-foreground shrink-0"><MoreHorizontal className="size-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2 text-sm" onClick={() => { setEditingActivityId(a.id); setEditValue(String(pts)) }}>
                              <Pencil className="size-3.5" /> Edit Points
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {isEditing && (
                        <div className="flex items-center gap-2 px-3 pb-3">
                          <label className="text-xs font-medium text-muted-foreground shrink-0">Points</label>
                          <Input
                            type="number"
                            min="0.5"
                            step="0.5"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            className="h-8 w-20 text-sm"
                            autoFocus
                            onKeyDown={e => {
                              if (e.key === 'Enter' && editValue) { setOverrides(prev => ({ ...prev, [a.id]: Number(editValue) })); setEditingActivityId(null) }
                              if (e.key === 'Escape') setEditingActivityId(null)
                            }}
                          />
                          <Button size="sm" className="h-8" onClick={() => { if (editValue) { setOverrides(prev => ({ ...prev, [a.id]: Number(editValue) })); setEditingActivityId(null) } }}>Save</Button>
                          <Button variant="outline" size="sm" className="h-8" onClick={() => setEditingActivityId(null)}>Cancel</Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {completedActivities.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Completed</p>
                {completedActivities.map(a => {
                  const typeInfo = CPD_ACTIVITY_TYPES[a.type]
                  const pts = overrides[a.id] ?? a.hours
                  const isEdited = overrides[a.id] !== undefined
                  const isEditing = editingActivityId === a.id
                  return (
                    <div key={a.id} className="border border-border/60 rounded-lg hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-3 p-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {typeInfo.label} &middot; {pts}pt{isEdited && <span className="ml-1 text-amber-600 font-medium">Edited</span>} &middot; {a.date}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5 flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="size-3" /> Completed
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-7 text-muted-foreground shrink-0"><MoreHorizontal className="size-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2 text-sm" onClick={() => { setEditingActivityId(a.id); setEditValue(String(pts)) }}>
                              <Pencil className="size-3.5" /> Edit Points
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {isEditing && (
                        <div className="flex items-center gap-2 px-3 pb-3">
                          <label className="text-xs font-medium text-muted-foreground shrink-0">Points</label>
                          <Input
                            type="number"
                            min="0.5"
                            step="0.5"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            className="h-8 w-20 text-sm"
                            autoFocus
                            onKeyDown={e => {
                              if (e.key === 'Enter' && editValue) { setOverrides(prev => ({ ...prev, [a.id]: Number(editValue) })); setEditingActivityId(null) }
                              if (e.key === 'Escape') setEditingActivityId(null)
                            }}
                          />
                          <Button size="sm" className="h-8" onClick={() => { if (editValue) { setOverrides(prev => ({ ...prev, [a.id]: Number(editValue) })); setEditingActivityId(null) } }}>Save</Button>
                          <Button variant="outline" size="sm" className="h-8" onClick={() => setEditingActivityId(null)}>Cancel</Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {activities.length === 0 && (
              <div className="border border-border/60 rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground">No CPD activities logged yet.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Regime Details Overlay ─────────────────────────────────────────────────

function RegimeDetailsOverlay({ regime, assignedCount, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl border border-border shadow-xl w-full max-w-md max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground">{regime.name}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-4" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-5 overflow-y-auto">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
            <p className="text-sm text-foreground">{regime.description}</p>
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Total Points</p>
              <p className="text-sm font-semibold text-foreground">{regime.totalPoints}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Period</p>
              <p className="text-sm text-foreground">{regime.period}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Assigned</p>
              <p className="text-sm text-foreground">{assignedCount} {assignedCount === 1 ? 'member' : 'members'}</p>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-3">Requirements ({regime.requirements.length} categories)</p>
            <div className="space-y-2">
              {regime.requirements.map((req) => (
                <div key={req.name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-foreground">{req.name}</span>
                  <span className="text-sm font-medium text-foreground">{req.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Regime Management Overlay ──────────────────────────────────────────────

function RegimeManageOverlay({ regime, assignedIds, allMembers, onClose, onSave }) {
  const [selected, setSelected] = useState(new Set(assignedIds))
  const [search, setSearch] = useState('')

  const filtered = allMembers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-[520px] max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
          <div>
            <h3 className="text-base font-semibold text-foreground">{regime.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{regime.description}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        {/* Regime details */}
        <div className="px-6 py-3 border-b border-border/60 flex items-center gap-6">
          <div className="text-xs text-muted-foreground"><span className="font-medium text-foreground">{regime.totalPoints}</span> pts required</div>
          <div className="text-xs text-muted-foreground">Period: <span className="font-medium text-foreground">{regime.period}</span></div>
          <div className="text-xs text-muted-foreground"><span className="font-medium text-foreground">{regime.categories}</span> categories</div>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-border/60">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>

        {/* Member list */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          {filtered.map(m => {
            const isSelected = selected.has(m.id)
            return (
              <div key={m.id} className="flex items-center justify-between py-2.5 cursor-pointer hover:bg-muted/20 -mx-2 px-2 rounded-md" onClick={() => toggle(m.id)}>
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">{m.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                  </div>
                </div>
                <button
                  className={`size-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-brand-600 border border-brand-600 text-white'
                      : 'border border-border hover:border-brand-400'
                  }`}
                >
                  {isSelected && <Check className="size-2.5" strokeWidth={3} />}
                </button>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/60 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{selected.size} member{selected.size !== 1 ? 's' : ''} assigned</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={() => onSave([...selected])}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
