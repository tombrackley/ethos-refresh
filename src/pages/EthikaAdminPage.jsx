import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import tenant from '@/config/tenant'
import { CreateJourneyOverlay, JourneyDetailPage, EditJourneyOverlay } from '@/pages/AdminLearningJourneysPage'
import EthikaAdminResourceLibraryPage from '@/pages/EthikaAdminResourceLibraryPage'
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Building2,
  Users,
  FileText,
  GraduationCap,
  ChevronRight,
  ChevronsUpDown,
  User,
  LogOut,
  Search,
  PanelLeftClose,
  CalendarPlus,
  BookOpen,
  Video,
  Award,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronDown,
  MapPin,
  Calendar,
  Clock,
  X,
  Globe,
  Eye,
  EyeOff,
  Plus,
  Shield,
  CircleCheck,
  CircleDashed,
  ChevronLeft,
  LayoutList,
  CalendarDays,
  Briefcase,
  Star,
  GripVertical,
  ExternalLink,
  History,
  Link2,
  CheckCircle2,
  UserMinus,
  ArrowUpCircle,
  Settings,
  Upload,
  Target,
  Loader2,
  Sparkles,
  Download,
  AlertTriangle,
} from 'lucide-react'

const mockOrganisations = [
  { id: 1, name: 'Blackmores Group', plan: 'Enterprise', users: 48, status: 'Active', created: '2024-01-15' },
  { id: 2, name: 'Acme Legal', plan: 'Professional', users: 24, status: 'Active', created: '2024-03-08' },
  { id: 3, name: 'Playfair Migration', plan: 'Professional', users: 12, status: 'Active', created: '2024-06-22' },
  { id: 4, name: 'FSHD Global', plan: 'Starter', users: 8, status: 'Trial', created: '2025-11-01' },
  { id: 5, name: 'Greenfield & Associates', plan: 'Enterprise', users: 36, status: 'Suspended', created: '2024-02-10' },
]

const mockUsers = [
  { id: 1, name: 'James Ward', email: 'james.ward@blackmores.com', organisation: 'Blackmores Group', role: 'Org Admin', lastActive: '2026-03-12' },
  { id: 2, name: 'Sarah Chen', email: 'sarah.chen@blackmores.com', organisation: 'Blackmores Group', role: 'User', lastActive: '2026-03-11' },
  { id: 3, name: 'David Thompson', email: 'david.t@acmelegal.com', organisation: 'Acme Legal', role: 'Org Admin', lastActive: '2026-03-10' },
  { id: 4, name: 'Emily Walker', email: 'emily.w@playfair.com.au', organisation: 'Playfair Migration', role: 'Org Admin', lastActive: '2026-03-12' },
  { id: 5, name: 'Michael Torres', email: 'michael.t@acmelegal.com', organisation: 'Acme Legal', role: 'User', lastActive: '2026-03-09' },
  { id: 6, name: 'Lisa Nguyen', email: 'lisa.n@fshd.org', organisation: 'FSHD Global', role: 'Org Admin', lastActive: '2026-03-08' },
  { id: 7, name: 'Robert Kim', email: 'robert.k@greenfield.com', organisation: 'Greenfield & Associates', role: 'User', lastActive: '2025-12-15' },
  { id: 8, name: 'Anna Petrov', email: 'anna.p@blackmores.com', organisation: 'Blackmores Group', role: 'User', lastActive: '2026-03-12' },
]

const CPD_ACTIVITY_TYPES = {
  course:        { icon: BookOpen, label: 'Course', iconColor: 'bg-blue-50 text-blue-700', badge: 'bg-blue-50 text-blue-900 border-blue-200' },
  webinar:       { icon: Video, label: 'Webinar', iconColor: 'bg-purple-50 text-purple-700', badge: 'bg-purple-50 text-purple-900 border-purple-200' },
  workshop:      { icon: Users, label: 'Workshop', iconColor: 'bg-amber-50 text-amber-700', badge: 'bg-amber-50 text-amber-900 border-amber-200' },
  certification: { icon: Award, label: 'Certification', iconColor: 'bg-cyan-50 text-cyan-700', badge: 'bg-cyan-50 text-cyan-900 border-cyan-200' },
}

const ACTIVITY_TYPE_OPTIONS = ['course', 'webinar', 'workshop', 'certification']

const INITIAL_PLATFORM_EVENTS = [
  { id: 1, title: 'ESG Reporting & Disclosure Workshop', type: 'workshop', date: '2026-04-15', time: '09:00 – 12:00', location: 'Level 12, 100 Market St, Sydney', provider: 'Ethika', cpdHours: 3, capacity: 30, registered: 18, isEthika: true, status: 'Published', description: 'Hands-on workshop covering AASB S1/S2 disclosure requirements and practical ESG reporting frameworks.', audience: 'All Organisations' },
  { id: 2, title: 'Privacy Act Amendments 2026', type: 'webinar', date: '2026-04-22', time: '13:00 – 14:30', location: 'Online (Teams)', provider: 'Ethika', cpdHours: 1.5, capacity: 100, registered: 42, isEthika: true, status: 'Published', description: 'Overview of the latest Privacy Act amendments and their impact on data handling obligations.', audience: 'All Organisations' },
  { id: 3, title: 'Anti-Money Laundering Advanced Certification', type: 'certification', date: '2026-05-10', time: '09:00 – 17:00', location: 'Level 5, 200 George St, Sydney', provider: 'ACAMS', cpdHours: 8, capacity: 20, registered: 20, waitlistCount: 6, isEthika: true, status: 'Published', description: 'Full-day certification program for advanced AML compliance practitioners.', audience: ['Blackmores Group', 'Acme Legal'] },
  { id: 4, title: 'Board Governance Masterclass', type: 'course', date: '2026-06-02', time: '10:00 – 15:00', location: 'Online (Zoom)', provider: 'Ethika', cpdHours: 4, capacity: 50, registered: 0, isEthika: true, status: 'Draft', description: 'Advanced strategies for effective board governance and director responsibilities.', audience: 'All Organisations' },
  { id: 5, title: 'Contract Negotiation Skills', type: 'workshop', date: '2026-05-20', time: '09:30 – 16:30', location: 'Level 8, 55 Collins St, Melbourne', provider: 'Law Society NSW', cpdHours: 6, isEthika: false, registrationUrl: 'https://www.lawsociety.com.au/cpd/events/contract-negotiation', externalDisclaimer: 'This event is organised and managed by Law Society NSW. Ethika is not responsible for event content, scheduling, or attendance tracking.', status: 'Published', description: 'Practical workshop on negotiation techniques for complex commercial contracts.', audience: ['Blackmores Group', 'Playfair Migration', 'Greenfield & Associates'] },
  { id: 6, title: 'Regulatory Compliance Update Q1 2026', type: 'webinar', date: '2026-02-18', time: '12:00 – 13:00', location: 'Online (Teams)', provider: 'Ethika', cpdHours: 1, capacity: 200, registered: 156, isEthika: true, status: 'Published', description: 'Quarterly update on regulatory changes across financial services, legal, and governance sectors.', audience: 'All Organisations' },
  { id: 7, title: 'Risk Management Fundamentals', type: 'course', date: '2026-01-22', time: '09:00 – 13:00', location: 'Online (Zoom)', provider: 'Governance Institute', cpdHours: 4, capacity: 40, registered: 38, isEthika: true, status: 'Published', description: 'Foundation course covering enterprise risk management principles and frameworks.', audience: 'All Organisations' },
  { id: 8, title: 'Cybersecurity for Compliance Officers', type: 'certification', date: '2026-03-05', time: '09:00 – 17:00', location: 'Level 3, 10 Bridge St, Sydney', provider: 'Ethika', cpdHours: 8, capacity: 15, registered: 15, waitlistCount: 3, isEthika: true, status: 'Published', description: 'Certification program on cyber risk, data breach obligations, and security governance.', audience: ['FSHD Global', 'Acme Legal'] },
  { id: 9, title: 'Modern Slavery & Supply Chain Due Diligence', type: 'workshop', date: '2026-04-16', time: '13:00 – 15:00', location: 'Board Room 1', provider: 'Law Society NSW', cpdHours: 2, isEthika: false, registrationUrl: 'https://www.lawsociety.com.au/cpd/events/modern-slavery-due-diligence', externalDisclaimer: 'This event is organised and managed by Law Society NSW. Ethika is not responsible for event content, scheduling, or attendance tracking.', status: 'Published', description: 'Understand Modern Slavery Act reporting obligations, supply chain risk assessment methodologies, and practical due diligence frameworks.', audience: 'All Organisations' },
]

const INITIAL_PLATFORM_REGIMES = [
  { id: 1, name: 'Law Society NSW', description: 'Mandatory CPD for NSW solicitors holding a practising certificate', totalPoints: 10, period: '1 Apr – 31 Mar', requirements: [
    { name: 'Ethics & Professional Responsibility', points: 1 }, { name: 'Practice Management & Business Skills', points: 1 }, { name: 'Professional Skills', points: 1 }, { name: 'Substantive Law', points: 1 }, { name: 'Unrestricted', points: 6 },
  ] },
  { id: 2, name: 'AICD', description: 'Australian Institute of Company Directors — Fellow & Member CPD', totalPoints: 15, period: '1 Jan – 31 Dec', requirements: [
    { name: 'Governance & Risk', points: 3 }, { name: 'Strategy & Performance', points: 3 }, { name: 'Digital & Innovation', points: 2 }, { name: 'Leadership & Culture', points: 2 }, { name: 'General', points: 5 },
  ] },
  { id: 3, name: 'Governance Institute', description: 'Governance Institute of Australia — Chartered Secretary & Governance Professional', totalPoints: 20, period: '1 Jul – 30 Jun', requirements: [
    { name: 'Governance', points: 4 }, { name: 'Risk & Compliance', points: 4 }, { name: 'Board Support', points: 4 }, { name: 'Legal & Regulatory', points: 4 }, { name: 'General CPD', points: 4 },
  ] },
  { id: 4, name: 'CPA Australia', description: 'CPA Australia — Certified Practising Accountant CPD requirements', totalPoints: 120, period: '1 Jan – 31 Dec (triennium)', requirements: [
    { name: 'Verifiable CPD', points: 80 }, { name: 'Non-Verifiable CPD', points: 40 },
  ] },
  { id: 5, name: 'Law Council of Australia', description: 'National standard for continuing professional development of legal practitioners', totalPoints: 10, period: '1 Jan – 31 Dec', requirements: [
    { name: 'Ethics & Professional Responsibility', points: 1 }, { name: 'Legal Skills', points: 1 }, { name: 'Substantive Law', points: 1 }, { name: 'Unrestricted', points: 7 },
  ] },
  { id: 6, name: 'Tax Practitioners Board', description: 'Registered Tax Agent and BAS Agent CPD requirements', totalPoints: 45, period: '1 Jul – 30 Jun (triennium)', requirements: [
    { name: 'Tax (Technical)', points: 20 }, { name: 'Ethics & Governance', points: 5 }, { name: 'General CPD', points: 20 },
  ] },
]

const INITIAL_PLATFORM_JOURNEYS = [
  { id: 1, name: 'Corporate Governance Fundamentals', description: 'Foundation journey covering board governance, director duties, and corporate accountability frameworks.', elements: 8, duration: '12 weeks', audience: 'All Organisations', status: 'Published', adoptions: 5, created: '2025-09-15' },
  { id: 2, name: 'Data Privacy & Protection Fundamentals', description: 'Comprehensive journey on privacy principles, the Australian Privacy Act, and cross-border data handling.', elements: 6, duration: '8 weeks', audience: 'All Organisations', status: 'Published', adoptions: 4, created: '2025-10-02' },
  { id: 3, name: 'AML/CTF Compliance Essentials', description: 'End-to-end journey covering anti-money laundering obligations, customer due diligence, and suspicious matter reporting.', elements: 7, duration: '10 weeks', audience: ['Blackmores Group', 'Acme Legal'], status: 'Published', adoptions: 2, created: '2025-11-20' },
  { id: 4, name: 'ESG & Sustainability Reporting', description: 'Covers AASB S1/S2 disclosure requirements, materiality assessments, and sustainability governance.', elements: 5, duration: '6 weeks', audience: 'All Organisations', status: 'Draft', adoptions: 0, created: '2026-01-10' },
  { id: 5, name: 'Board Effectiveness & Leadership', description: 'Advanced journey on board evaluation, stakeholder engagement, and strategic leadership for directors.', elements: 6, duration: '8 weeks', audience: ['Blackmores Group', 'Greenfield & Associates'], status: 'Published', adoptions: 2, created: '2025-12-05' },
  { id: 6, name: 'Risk Management for Compliance Officers', description: 'Enterprise risk frameworks, risk appetite setting, and regulatory risk identification for compliance professionals.', elements: 5, duration: '6 weeks', audience: 'All Organisations', status: 'Draft', adoptions: 0, created: '2026-02-18' },
]

const navGroups = [
  {
    label: 'PLATFORM',
    items: [
      { title: 'Organisations', icon: Building2, page: 'Organisations', path: '/ethika-admin' },
      { title: 'Users', icon: Users, page: 'Users', path: '/ethika-admin/users' },
    ],
  },
  {
    label: 'MODULES',
    subgroups: [
      {
        label: 'Work',
        icon: Briefcase,
        items: [
          { title: 'Resource Library', page: 'Resource Library', path: '/ethika-admin/resources' },
        ],
      },
      {
        label: 'Learn',
        icon: GraduationCap,
        items: [
          { title: 'Knowledge Library', page: 'Knowledge Library', path: '/ethika-admin/library' },
          { title: 'Learning Journeys', page: 'Learning Journeys', path: '/ethika-admin/journeys' },
          { title: 'CPD Events', page: 'CPD Events', path: '/ethika-admin/cpd-events' },
          { title: 'CPD Regimes', page: 'CPD Regimes', path: '/ethika-admin/cpd-regimes' },
          { title: 'Skills Framework', page: 'Skills Framework', path: '/ethika-admin/skills-framework' },
        ],
      },
      {
        label: 'Talent',
        icon: Briefcase,
        items: [
          { title: 'Talent', page: 'Talent', path: '/ethika-admin/talent' },
        ],
      },
    ],
  },
]

const ETHIKA_PATH_TO_PAGE = {}
navGroups.forEach(g => {
  if (g.items) g.items.forEach(i => { ETHIKA_PATH_TO_PAGE[i.path] = i.page })
  if (g.subgroups) g.subgroups.forEach(sg => sg.items.forEach(i => { ETHIKA_PATH_TO_PAGE[i.path] = i.page }))
})

function statusVariant(status) {
  switch (status) {
    case 'Active': return 'default'
    case 'Trial': return 'secondary'
    case 'Suspended': return 'destructive'
    default: return 'outline'
  }
}

function OrganisationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Organisations</h2>
        <p className="text-sm text-muted-foreground">Manage all registered organisations on the platform.</p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organisation</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="text-right">Users</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrganisations.map((org) => (
              <TableRow key={org.id}>
                <TableCell className="font-medium">{org.name}</TableCell>
                <TableCell>{org.plan}</TableCell>
                <TableCell className="text-right">{org.users}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(org.status)}>{org.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{org.created}</TableCell>
                <TableCell>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Users</h2>
        <p className="text-sm text-muted-foreground">All platform users across every organisation.</p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Organisation</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>{user.organisation}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'Org Admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// ─── Event Calendar View ────────────────────────────────────────────────────

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function EventCalendar({ events, onEditEvent }) {
  const [currentDate, setCurrentDate] = useState(() => new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Monday = 0 offset
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = lastDay.getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToday = () => setCurrentDate(new Date())

  const todayStr = new Date().toISOString().split('T')[0]

  // Group events by date
  const eventsByDate = {}
  events.forEach(ev => {
    if (!eventsByDate[ev.date]) eventsByDate[ev.date] = []
    eventsByDate[ev.date].push(ev)
  })

  // Build calendar grid cells
  const cells = []
  for (let i = 0; i < startOffset; i++) {
    const prevDate = new Date(year, month, -startOffset + i + 1)
    cells.push({ day: prevDate.getDate(), date: prevDate.toISOString().split('T')[0], outside: true })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, date: dateStr, outside: false })
  }
  const remaining = 7 - (cells.length % 7)
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i)
      cells.push({ day: nextDate.getDate(), date: nextDate.toISOString().split('T')[0], outside: true })
    }
  }

  const weeks = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  const monthLabel = currentDate.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })

  return (
    <div className="border border-border/60 rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{monthLabel}</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs" onClick={goToday}>
            Today
          </Button>
          <Button variant="ghost" size="icon" className="size-7" onClick={prevMonth}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-7" onClick={nextMonth}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border/60">
        {WEEKDAYS.map(day => (
          <div key={day} className="py-2 text-center text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {weeks.map((week, wi) => (
          week.map((cell, ci) => {
            const dayEvents = eventsByDate[cell.date] || []
            const isToday = cell.date === todayStr
            return (
              <div
                key={`${wi}-${ci}`}
                className={`min-h-[100px] border-b border-r border-border/40 p-1.5 ${ci === 6 ? 'border-r-0' : ''} ${wi === weeks.length - 1 ? 'border-b-0' : ''} ${cell.outside ? 'bg-muted/20' : ''}`}
              >
                <div className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-brand-800 text-white' : cell.outside ? 'text-muted-foreground/40' : 'text-foreground'}`}>
                  {cell.day}
                </div>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 3).map(ev => {
                    const typeInfo = CPD_ACTIVITY_TYPES[ev.type]
                    return (
                      <button
                        key={ev.id}
                        onClick={() => onEditEvent(ev)}
                        className={`w-full text-left text-[10px] font-medium leading-tight px-1.5 py-0.5 rounded truncate ${typeInfo.badge}`}
                      >
                        {ev.title}
                      </button>
                    )
                  })}
                  {dayEvents.length > 3 && (
                    <p className="text-[10px] text-muted-foreground px-1.5">+{dayEvents.length - 3} more</p>
                  )}
                </div>
              </div>
            )
          })
        ))}
      </div>
    </div>
  )
}

// ─── Platform CPD Management Page ───────────────────────────────────────────

const PILL_TAB = "h-8 rounded-full text-sm px-4 py-1.5 border border-transparent data-[state=active]:bg-[#153e40] data-[state=active]:text-white data-[state=active]:border-transparent data-[state=inactive]:text-[#153e40] data-[state=inactive]:bg-[#f5f5f5] data-[state=active]:shadow-none"

function EthikaAdminCPDPage() {
  const [events, setEvents] = useState(INITIAL_PLATFORM_EVENTS)
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [viewingParticipants, setViewingParticipants] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState('list')

  const publishedEvents = events.filter(e => e.status === 'Published')
  const draftEvents = events.filter(e => e.status === 'Draft')
  const filteredEvents = statusFilter === 'all' ? events : events.filter(e => e.status === statusFilter)

  const handlePublish = (id) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'Published' } : e))
  }

  const handleUnpublish = (id) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'Draft' } : e))
  }

  const handleDeleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  const renderEventTable = (eventList, emptyMessage) => (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-5">Event</TableHead>
            <TableHead>CPD Hours</TableHead>
            <TableHead>Registrations</TableHead>
            <TableHead>Audience</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {eventList.map(ev => {
            const typeInfo = CPD_ACTIVITY_TYPES[ev.type]
            const Icon = typeInfo.icon
            const isAllOrgs = ev.audience === 'All Organisations'
            return (
              <TableRow key={ev.id} className="hover:bg-muted/30 [&>td]:py-3">
                <TableCell className="pl-5">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center size-14 rounded-lg bg-muted/60 shrink-0">
                      <span className="text-[10px] font-semibold uppercase leading-none text-muted-foreground">{new Date(ev.date).toLocaleDateString('en-AU', { month: 'short' })}</span>
                      <span className="text-[16px] font-semibold leading-snug text-foreground">{new Date(ev.date).getDate()}</span>
                      <span className="text-[10px] leading-none text-muted-foreground">{new Date(ev.date).getFullYear()}</span>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-foreground leading-tight">{ev.title}</p>
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Clock className="size-3" />{ev.time}</span>
                        {ev.location && <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{ev.location}</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {ev.provider} &middot; {typeInfo.label}
                        {ev.isEthika === false && (
                          <span className="inline-flex items-center gap-0.5 ml-1.5 text-amber-600"><ExternalLink className="size-3" />External</span>
                        )}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-medium text-foreground">{ev.cpdHours}h</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {ev.isEthika === false ? (
                    <span className="text-xs text-muted-foreground">External</span>
                  ) : (
                    <span>
                      {ev.registered}/{ev.capacity}
                      {ev.waitlistCount > 0 && (
                        <span className="text-xs text-amber-600 ml-1">+{ev.waitlistCount} waitlisted</span>
                      )}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {isAllOrgs ? (
                    <span className="text-sm text-muted-foreground">All</span>
                  ) : (
                    <div className="flex items-center -space-x-2" title={ev.audience.join(', ')}>
                      {ev.audience.slice(0, 4).map((orgName) => (
                        <Avatar key={orgName} className="size-7 border-2 border-white">
                          <AvatarFallback className="bg-brand-100 text-brand-800 text-[10px] font-semibold">
                            {orgName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {ev.audience.length > 4 && (
                        <Avatar className="size-7 border-2 border-white">
                          <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-medium">
                            +{ev.audience.length - 4}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {ev.status === 'Published' ? (
                    <Badge variant="status-published">
                      <img src="/solid-check.svg" alt="" className="size-3" /> Published
                    </Badge>
                  ) : (
                    <Badge variant="status-draft">
                      <CircleDashed className="size-3.5 text-gray-400" /> Draft
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 text-muted-foreground"><MoreHorizontal className="size-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2 text-sm" onClick={() => { setEditingEvent(ev); setShowEventForm(true) }}>
                        <Pencil className="size-3.5" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-sm" onClick={() => setViewingParticipants(ev)}>
                        <Users className="size-3.5" /> View participants
                      </DropdownMenuItem>
                      {ev.status === 'Draft' ? (
                        <DropdownMenuItem className="gap-2 text-sm" onClick={() => handlePublish(ev.id)}>
                          <Eye className="size-3.5" /> Publish
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="gap-2 text-sm" onClick={() => handleUnpublish(ev.id)}>
                          <EyeOff className="size-3.5" /> Unpublish
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="gap-2 text-sm text-destructive" onClick={() => handleDeleteEvent(ev.id)}>
                        <Trash2 className="size-3.5" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
          {eventList.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <p className="text-sm text-muted-foreground">{emptyMessage}</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">CPD Events</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage platform-wide CPD events available to organisations.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border bg-muted/30 p-0.5">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center justify-center size-8 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <LayoutList className="size-4" />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center justify-center size-8 rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <CalendarDays className="size-4" />
              </button>
            </div>
            <Button className="gap-1.5" onClick={() => { setEditingEvent(null); setShowEventForm(true) }}>
              <CalendarPlus className="size-4" /> Create Event
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Total events</span>
            <span className="font-semibold text-foreground">{events.length}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Published</span>
            <span className="font-semibold text-foreground">{publishedEvents.length}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="size-2 rounded-full bg-gray-400" />
            <span className="text-muted-foreground">Draft</span>
            <span className="font-semibold text-foreground">{draftEvents.length}</span>
          </div>
        </div>

        {viewMode === 'list' ? (
          <>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 w-auto rounded-md border border-border bg-white px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring self-start">
              <option value="all">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
            {renderEventTable(filteredEvents, 'No events match the selected filter.')}
          </>
        ) : (
          <EventCalendar events={events} onEditEvent={(ev) => { setEditingEvent(ev); setShowEventForm(true) }} />
        )}
      </div>

      {showEventForm && createPortal(
        <PlatformEventFormOverlay
          event={editingEvent}
          onClose={() => { setShowEventForm(false); setEditingEvent(null) }}
          onSave={(eventData) => {
            if (editingEvent) {
              setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...e, ...eventData } : e))
            } else {
              setEvents(prev => [...prev, { ...eventData, id: Date.now(), registered: 0 }])
            }
            setShowEventForm(false)
            setEditingEvent(null)
          }}
        />,
        document.body,
      )}

      {viewingParticipants && createPortal(
        <EventParticipantsOverlay
          event={viewingParticipants}
          onClose={() => setViewingParticipants(null)}
          onUpdateEvent={(updates) => {
            setEvents(prev => prev.map(e => e.id === viewingParticipants.id ? { ...e, ...updates } : e))
            setViewingParticipants(prev => prev ? { ...prev, ...updates } : null)
          }}
        />,
        document.body,
      )}
    </>
  )
}

// ─── Platform CPD Regimes Page ──────────────────────────────────────────────

function EthikaAdminRegimesPage() {
  const [regimes, setRegimes] = useState(INITIAL_PLATFORM_REGIMES)
  const [showRegimeForm, setShowRegimeForm] = useState(false)
  const [editingRegime, setEditingRegime] = useState(null)

  const handleDeleteRegime = (id) => {
    setRegimes(prev => prev.filter(r => r.id !== id))
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">CPD Regimes</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Define CPD regimes that organisations can assign to their members.</p>
          </div>
          <Button className="gap-1.5" onClick={() => { setEditingRegime(null); setShowRegimeForm(true) }}>
            <Plus className="size-4" /> Add Regime
          </Button>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Total regimes</span>
            <span className="font-semibold text-foreground">{regimes.length}</span>
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Regime</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {regimes.map(regime => (
                <TableRow key={regime.id} className="hover:bg-muted/30">
                  <TableCell className="pl-5">
                    <div>
                      <p className="text-sm font-medium text-foreground leading-tight">{regime.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 max-w-[240px]">{regime.description}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{regime.period}</TableCell>
                  <TableCell className="text-sm font-medium text-foreground">{regime.totalPoints}h</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{regime.requirements.length}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground"><MoreHorizontal className="size-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 text-sm" onClick={() => { setEditingRegime(regime); setShowRegimeForm(true) }}>
                          <Pencil className="size-3.5" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-sm text-destructive" onClick={() => handleDeleteRegime(regime.id)}>
                          <Trash2 className="size-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {regimes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No regimes defined yet. Add your first CPD regime to get started.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {showRegimeForm && createPortal(
        <RegimeFormOverlay
          regime={editingRegime}
          onClose={() => { setShowRegimeForm(false); setEditingRegime(null) }}
          onSave={(regimeData) => {
            if (editingRegime) {
              setRegimes(prev => prev.map(r => r.id === editingRegime.id ? { ...r, ...regimeData } : r))
            } else {
              setRegimes(prev => [...prev, { ...regimeData, id: Date.now() }])
            }
            setShowRegimeForm(false)
            setEditingRegime(null)
          }}
        />,
        document.body,
      )}
    </>
  )
}

// ─── Skills Framework Page ──────────────────────────────────────────────────

function EthikaAdminSkillsFrameworkPage() {
  const [activeTab, setActiveTab] = useState('skills')
  const [editingSkill, setEditingSkill] = useState(null)
  const [viewingAssessment, setViewingAssessment] = useState(null)

  // Use the skills data from tenant config as the framework source
  const skills = tenant.pages.learn.skillsProfile.skills
  const assessmentQuestions = tenant.pages.learn.skillsProfile.assessmentQuestions || {}

  // Build assessments list from the assessmentQuestions data
  const assessments = Object.entries(assessmentQuestions).map(([skillId, questions]) => {
    const skill = skills.find(s => s.id === skillId)
    return {
      id: skillId,
      name: `${skill?.label || skillId} Assessment`,
      linkedSkill: skill?.label || skillId,
      questions: questions.length,
      status: 'Active',
    }
  })

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Skills Framework</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage the Ethika Core Skills Framework and scenario-based assessments.</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Total skills</span>
            <span className="font-semibold text-foreground">{skills.length}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Assessments</span>
            <span className="font-semibold text-foreground">{assessments.length}</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="skills">Skills ({skills.length})</TabsTrigger>
            <TabsTrigger value="assessments">Assessments ({assessments.length})</TabsTrigger>
          </TabsList>

          {/* Skills Tab */}
          <TabsContent value="skills" className="mt-4">
            <div className="rounded-lg border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-5">Skill</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Level Descriptors</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skills.map(skill => (
                    <TableRow key={skill.id} className="hover:bg-muted/30">
                      <TableCell className="pl-5">
                        <div>
                          <p className="text-sm font-medium text-foreground leading-tight">{skill.label}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">{skill.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground capitalize">{skill.category}</span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">4 levels</TableCell>
                      <TableCell>
                        <Badge variant="status-published">
                          <img src="/solid-check.svg" alt="" className="size-3" /> Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground"><MoreHorizontal className="size-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2 text-sm" onClick={() => setEditingSkill(skill)}>
                              <Pencil className="size-3.5" /> Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Assessments Tab */}
          <TabsContent value="assessments" className="mt-4">
            <div className="rounded-lg border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-5">Assessment</TableHead>
                    <TableHead>Linked Skill</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map(assessment => (
                    <TableRow key={assessment.id} className="hover:bg-muted/30">
                      <TableCell className="pl-5">
                        <p className="text-sm font-medium text-foreground leading-tight">{assessment.name}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{assessment.linkedSkill}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{assessment.questions} questions</TableCell>
                      <TableCell>
                        <Badge variant="status-published">
                          <img src="/solid-check.svg" alt="" className="size-3" /> Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground"><MoreHorizontal className="size-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2 text-sm" onClick={() => setViewingAssessment(assessment)}>
                              <Eye className="size-3.5" /> View Questions
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {assessments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <p className="text-sm text-muted-foreground">No assessments created yet.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Skill Edit Overlay */}
      {editingSkill && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditingSkill(null)} />
          <div className="relative z-10 bg-white rounded-xl border border-border shadow-xl w-full max-w-[600px] max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <h2 className="text-lg font-semibold text-foreground">{editingSkill.label}</h2>
              <button onClick={() => setEditingSkill(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto px-6 py-5 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Skill Name</label>
                <Input value={editingSkill.label} readOnly className="h-9 bg-muted/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Category</label>
                <Input value={editingSkill.category} readOnly className="h-9 bg-muted/50 capitalize" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Description</label>
                <p className="text-sm text-muted-foreground leading-relaxed">{editingSkill.description}</p>
              </div>
              <Separator />
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Level Descriptors</p>
                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level, i) => (
                  <div key={level} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-1 mt-0.5 shrink-0">
                      {Array.from({ length: 4 }).map((_, d) => (
                        <div key={d} className={`size-2 rounded-full ${d <= i ? 'bg-brand-600' : 'bg-[#e5e7eb]'}`} />
                      ))}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{level}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {level === 'Beginner' && 'Foundational understanding of core concepts. Requires supervision and guidance.'}
                        {level === 'Intermediate' && 'Working knowledge with ability to apply in standard situations. Limited supervision needed.'}
                        {level === 'Advanced' && 'Deep expertise with ability to handle complex scenarios independently. Can mentor others.'}
                        {level === 'Expert' && 'Recognised authority. Can lead strategy, define standards, and advise at the highest level.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-foreground">Source</p>
                <p className="text-sm text-muted-foreground">{editingSkill.source}</p>
              </div>
            </div>
            <div className="flex gap-2 px-6 py-4 border-t border-border shrink-0">
              <Button size="sm" onClick={() => setEditingSkill(null)}>Done</Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Assessment View Overlay */}
      {viewingAssessment && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewingAssessment(null)} />
          <div className="relative z-10 bg-white rounded-xl border border-border shadow-xl w-full max-w-[600px] max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{viewingAssessment.name}</h2>
                <p className="text-sm text-muted-foreground">Linked to: {viewingAssessment.linkedSkill}</p>
              </div>
              <button onClick={() => setViewingAssessment(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto px-6 py-5 space-y-4">
              {(assessmentQuestions[viewingAssessment.id] || []).map((q, i) => (
                <div key={i} className="p-4 rounded-lg border border-border space-y-2">
                  <p className="text-sm font-medium text-foreground">Q{i + 1}. {q.question}</p>
                  <div className="space-y-1.5 pl-4">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2 text-sm">
                        {oi === q.correct ? (
                          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                        ) : (
                          <div className="size-4 rounded-full border border-border shrink-0" />
                        )}
                        <span className={oi === q.correct ? 'text-foreground font-medium' : 'text-muted-foreground'}>{opt}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground pl-4 italic">{q.explanation}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 px-6 py-4 border-t border-border shrink-0">
              <Button size="sm" onClick={() => setViewingAssessment(null)}>Done</Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

// ─── Generate mock participants for an event ────────────────────────────────

function generateMockParticipants(event) {
  if (!event || event.isEthika === false) return { registered: [], waitlisted: [] }
  const registeredPool = [
    { id: 1, name: 'James Ward', email: 'james.ward@blackmores.com', org: 'Blackmores Group', date: '2026-02-15' },
    { id: 2, name: 'Sarah Chen', email: 'sarah.chen@blackmores.com', org: 'Blackmores Group', date: '2026-02-18' },
    { id: 3, name: 'David Thompson', email: 'david.t@acmelegal.com', org: 'Acme Legal', date: '2026-02-20' },
    { id: 4, name: 'Emily Walker', email: 'emily.w@playfair.com.au', org: 'Playfair Migration', date: '2026-02-22' },
    { id: 5, name: 'Michael Torres', email: 'michael.t@acmelegal.com', org: 'Acme Legal', date: '2026-02-25' },
    { id: 6, name: 'Lisa Nguyen', email: 'lisa.n@fshd.org', org: 'FSHD Global', date: '2026-03-01' },
    { id: 7, name: 'Robert Kim', email: 'robert.k@greenfield.com', org: 'Greenfield & Associates', date: '2026-03-03' },
    { id: 8, name: 'Anna Petrov', email: 'anna.p@blackmores.com', org: 'Blackmores Group', date: '2026-03-05' },
    { id: 9, name: 'Priya Patel', email: 'priya.p@blackmores.com', org: 'Blackmores Group', date: '2026-03-06' },
    { id: 10, name: 'Liam O\'Brien', email: 'liam.o@greenfield.com', org: 'Greenfield & Associates', date: '2026-03-07' },
    { id: 11, name: 'Rachel Adams', email: 'rachel.a@blackmores.com', org: 'Blackmores Group', date: '2026-03-08' },
    { id: 12, name: 'Tom Bradley', email: 'tom@email.com', org: 'Blackmores Group', date: '2026-03-09' },
  ]
  const waitlistPool = [
    { id: 101, name: 'Karen Liu', email: 'karen.l@acmelegal.com', org: 'Acme Legal', date: '2026-03-10' },
    { id: 102, name: 'Daniel Park', email: 'daniel.p@blackmores.com', org: 'Blackmores Group', date: '2026-03-11' },
    { id: 103, name: 'Sophie Martin', email: 'sophie.m@greenfield.com', org: 'Greenfield & Associates', date: '2026-03-11' },
    { id: 104, name: 'Raj Sharma', email: 'raj.s@fshd.org', org: 'FSHD Global', date: '2026-03-12' },
    { id: 105, name: 'Claire Dubois', email: 'claire.d@playfair.com.au', org: 'Playfair Migration', date: '2026-03-12' },
    { id: 106, name: 'Ben Nguyen', email: 'ben.n@acmelegal.com', org: 'Acme Legal', date: '2026-03-13' },
  ]
  const regCount = Math.min(event.registered || 0, registeredPool.length)
  const waitCount = Math.min(event.waitlistCount || 0, waitlistPool.length)
  return {
    registered: registeredPool.slice(0, regCount),
    waitlisted: waitlistPool.slice(0, waitCount),
  }
}

// ─── Event Participants Overlay ─────────────────────────────────────────────

const PARTICIPANT_TAB = "h-8 rounded-full text-sm px-3 py-1.5 gap-1.5 border border-transparent data-[state=active]:bg-[#153e40] data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:text-[#153e40] data-[state=inactive]:bg-[#f5f5f5]"

function EventParticipantsOverlay({ event, onClose, onUpdateEvent }) {
  const [participants, setParticipants] = useState(() => generateMockParticipants(event))
  const [activeTab, setActiveTab] = useState('registered')
  const isExternal = event.isEthika === false

  const handleRemoveRegistered = (id) => {
    setParticipants(prev => ({
      ...prev,
      registered: prev.registered.filter(p => p.id !== id),
    }))
    onUpdateEvent({ registered: (event.registered || 1) - 1 })
  }

  const handleRemoveWaitlisted = (id) => {
    setParticipants(prev => ({
      ...prev,
      waitlisted: prev.waitlisted.filter(p => p.id !== id),
    }))
    onUpdateEvent({ waitlistCount: Math.max(0, (event.waitlistCount || 1) - 1) })
  }

  const handlePromote = (person) => {
    setParticipants(prev => ({
      registered: [...prev.registered, { ...person, date: new Date().toISOString().slice(0, 10) }],
      waitlisted: prev.waitlisted.filter(p => p.id !== person.id),
    }))
    onUpdateEvent({
      registered: (event.registered || 0) + 1,
      waitlistCount: Math.max(0, (event.waitlistCount || 1) - 1),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl border border-border shadow-xl w-full max-w-[700px] max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-lg font-semibold text-foreground">Event Participants</h2>
              <p className="text-sm text-muted-foreground truncate pr-4">{event.title}</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <X className="size-5" />
            </button>
          </div>
          {!isExternal && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-auto bg-transparent p-0 gap-2">
                <TabsTrigger value="registered" className={PARTICIPANT_TAB}>
                  Registered
                  <span className={`inline-flex items-center justify-center size-5 rounded-full text-[11px] font-semibold leading-none ${activeTab === 'registered' ? 'bg-white/20' : 'bg-[#e5e7eb] text-[#374151]'}`}>{participants.registered.length}</span>
                </TabsTrigger>
                <TabsTrigger value="waitlisted" className={PARTICIPANT_TAB}>
                  Waitlisted
                  <span className={`inline-flex items-center justify-center size-5 rounded-full text-[11px] font-semibold leading-none ${activeTab === 'waitlisted' ? 'bg-white/20' : 'bg-[#e5e7eb] text-[#374151]'}`}>{participants.waitlisted.length}</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>

        <div className="flex-1 overflow-auto">
          {isExternal ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <ExternalLink className="size-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">External event</p>
              <p className="text-xs text-muted-foreground text-center max-w-sm">Registration for this event is managed by {event.provider}. Participant data is not tracked in Ethika.</p>
            </div>
          ) : activeTab === 'registered' ? (
            <div className="px-6 py-5">
              {participants.registered.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="size-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No registrations yet.</p>
                </div>
              ) : (
                <div className="border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="text-xs font-medium text-muted-foreground">Participant</TableHead>
                        <TableHead className="text-xs font-medium text-muted-foreground">Organisation</TableHead>
                        <TableHead className="text-xs font-medium text-muted-foreground">Registered</TableHead>
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participants.registered.map(p => (
                        <TableRow key={p.id} className="hover:bg-muted/20">
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium text-foreground">{p.name}</p>
                              <p className="text-xs text-muted-foreground">{p.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{p.org}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-7 text-muted-foreground"><MoreHorizontal className="size-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="gap-2 text-sm text-destructive" onClick={() => handleRemoveRegistered(p.id)}>
                                  <UserMinus className="size-3.5" /> Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          ) : (
            <div className="px-6 py-5">
              {participants.waitlisted.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="size-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No one on the waitlist.</p>
                </div>
              ) : (
                <div className="border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="text-xs font-medium text-muted-foreground">Participant</TableHead>
                        <TableHead className="text-xs font-medium text-muted-foreground">Organisation</TableHead>
                        <TableHead className="text-xs font-medium text-muted-foreground">Position</TableHead>
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participants.waitlisted.map((p, idx) => (
                        <TableRow key={p.id} className="hover:bg-muted/20">
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium text-foreground">{p.name}</p>
                              <p className="text-xs text-muted-foreground">{p.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{p.org}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">#{idx + 1}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-7 text-muted-foreground"><MoreHorizontal className="size-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="gap-2 text-sm" onClick={() => handlePromote(p)}>
                                  <ArrowUpCircle className="size-3.5" /> Promote to registered
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 text-sm text-destructive" onClick={() => handleRemoveWaitlisted(p.id)}>
                                  <UserMinus className="size-3.5" /> Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-6 py-4 border-t border-border shrink-0">
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}

function PlatformEventFormOverlay({ event, onClose, onSave }) {
  const [form, setForm] = useState({
    title: event?.title ?? '',
    type: event?.type ?? '',
    date: event?.date ?? '',
    time: event?.time ?? '',
    location: event?.location ?? '',
    provider: event?.provider ?? '',
    cpdHours: event?.cpdHours ?? '',
    capacity: event?.capacity ?? '',
    description: event?.description ?? '',
    status: event?.status ?? 'Draft',
    audience: event?.audience ?? 'All Organisations',
    isEthika: event?.isEthika ?? true,
    registrationUrl: event?.registrationUrl ?? '',
  })
  const [selectedRegimes, setSelectedRegimes] = useState(event?.regimes ?? [])
  const [audienceMode, setAudienceMode] = useState(
    event?.audience && event.audience !== 'All Organisations' ? 'specific' : 'all'
  )
  const [selectedOrgs, setSelectedOrgs] = useState(
    event?.audience && event.audience !== 'All Organisations' ? event.audience : []
  )

  const isValid = form.title && form.type && form.date && form.cpdHours && form.provider

  const handleSave = () => {
    onSave({
      ...form,
      cpdHours: Number(form.cpdHours),
      capacity: form.isEthika ? (Number(form.capacity) || 0) : undefined,
      registered: form.isEthika ? (event?.registered ?? 0) : undefined,
      audience: audienceMode === 'all' ? 'All Organisations' : selectedOrgs,
      regimes: selectedRegimes,
      isEthika: form.isEthika,
      registrationUrl: form.isEthika ? undefined : form.registrationUrl,
      externalDisclaimer: form.isEthika ? undefined : `This event is organised and managed by ${form.provider || 'the external provider'}. Ethika is not responsible for event content, scheduling, or attendance tracking.`,
    })
  }

  const REGIME_OPTIONS = [
    { id: 'law-society-nsw', name: 'Law Society NSW' },
    { id: 'aicd', name: 'AICD' },
    { id: 'governance-institute', name: 'Governance Institute' },
    { id: 'cpa-australia', name: 'CPA Australia' },
    { id: 'law-society-vic', name: 'Law Institute of Victoria' },
    { id: 'qls', name: 'Queensland Law Society' },
    { id: 'ca-anz', name: 'Chartered Accountants ANZ' },
    { id: 'icaa', name: 'ICA Australia' },
    { id: 'mara', name: 'MARA' },
    { id: 'acnc', name: 'ACNC' },
  ]

  const toggleRegime = (regimeId) => {
    setSelectedRegimes(prev =>
      prev.includes(regimeId) ? prev.filter(r => r !== regimeId) : [...prev, regimeId]
    )
  }

  const toggleOrg = (orgName) => {
    setSelectedOrgs(prev =>
      prev.includes(orgName) ? prev.filter(n => n !== orgName) : [...prev, orgName]
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl border border-border shadow-xl w-full max-w-[700px] max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold text-foreground">{event ? 'Edit Event' : 'Create CPD Event'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-auto px-6 py-5 space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Event Title</label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. ESG Reporting Workshop" className="h-9" />
          </div>

          {/* Event Source */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Event Source</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="eventSource"
                  checked={form.isEthika}
                  onChange={() => setForm({ ...form, isEthika: true })}
                  className="accent-brand-800"
                />
                Ethika-hosted
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="eventSource"
                  checked={!form.isEthika}
                  onChange={() => setForm({ ...form, isEthika: false })}
                  className="accent-brand-800"
                />
                External
              </label>
            </div>
            {!form.isEthika && (
              <p className="text-xs text-muted-foreground">External events are managed by a third-party provider. Registration is handled on their platform.</p>
            )}
          </div>

          {/* Registration URL (external only) */}
          {!form.isEthika && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Registration URL</label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input value={form.registrationUrl} onChange={e => setForm({ ...form, registrationUrl: e.target.value })} placeholder="e.g. https://provider.com/event/register" className="h-9 pl-9" />
              </div>
              <p className="text-xs text-muted-foreground">Users will be directed to this link to register. Opens in a new tab.</p>
            </div>
          )}

          {/* Type + CPD Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Event Type</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between h-9 text-sm font-normal">
                    {form.type ? CPD_ACTIVITY_TYPES[form.type].label : <span className="text-muted-foreground">Select type</span>}
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]">
                  {ACTIVITY_TYPE_OPTIONS.map(t => (
                    <DropdownMenuItem key={t} onClick={() => setForm({ ...form, type: t })}>
                      {CPD_ACTIVITY_TYPES[t].label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">CPD Hours</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input type="number" min="0.5" step="0.5" value={form.cpdHours} onChange={e => setForm({ ...form, cpdHours: e.target.value })} placeholder="e.g. 3" className="h-9 pl-9" />
              </div>
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="h-9 pl-9" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Time</label>
              <Input value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="e.g. 09:00 – 12:00" className="h-9" />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Online (Teams) or venue address" className="h-9 pl-9" />
            </div>
          </div>

          {/* Provider + Capacity */}
          {form.isEthika ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Provider</label>
                <Input value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })} placeholder="e.g. Ethika" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Capacity</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input type="number" min="1" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} placeholder="e.g. 30" className="h-9 pl-9" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Provider</label>
              <Input value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })} placeholder="e.g. Law Society NSW" className="h-9" />
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the event, learning outcomes, and who should attend..."
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>

          {/* CPD Regimes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">CPD Regimes</label>
            <p className="text-xs text-muted-foreground">Select which regulatory regimes this event counts toward</p>
            <div className="border border-border rounded-md p-3 space-y-2 max-h-[140px] overflow-auto">
              {REGIME_OPTIONS.map(regime => (
                <label key={regime.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRegimes.includes(regime.id)}
                    onChange={() => toggleRegime(regime.id)}
                    className="accent-brand-800"
                  />
                  {regime.name}
                </label>
              ))}
            </div>
            {selectedRegimes.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedRegimes.map(r => {
                  const regime = REGIME_OPTIONS.find(o => o.id === r)
                  return (
                    <Badge key={r} variant="category">{regime?.name || r}</Badge>
                  )
                })}
              </div>
            )}
          </div>

          {/* Audience */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Audience</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="audience"
                  checked={audienceMode === 'all'}
                  onChange={() => setAudienceMode('all')}
                  className="accent-brand-800"
                />
                All Organisations
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="audience"
                  checked={audienceMode === 'specific'}
                  onChange={() => setAudienceMode('specific')}
                  className="accent-brand-800"
                />
                Specific Organisations
              </label>
            </div>
            {audienceMode === 'specific' && (
              <div className="border border-border rounded-md p-3 space-y-2 max-h-[140px] overflow-auto">
                {mockOrganisations.map(org => (
                  <label key={org.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedOrgs.includes(org.name)}
                      onChange={() => toggleOrg(org.name)}
                      className="accent-brand-800"
                    />
                    {org.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Status</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={form.status === 'Draft'}
                  onChange={() => setForm({ ...form, status: 'Draft' })}
                  className="accent-brand-800"
                />
                Draft
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={form.status === 'Published'}
                  onChange={() => setForm({ ...form, status: 'Published' })}
                  className="accent-brand-800"
                />
                Published
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-border shrink-0">
          <Button size="sm" onClick={handleSave} disabled={!isValid}>
            {event ? 'Save Changes' : 'Create Event'}
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}

function RegimeFormOverlay({ regime, onClose, onSave }) {
  const [form, setForm] = useState({
    name: regime?.name ?? '',
    description: regime?.description ?? '',
    period: regime?.period ?? '',
    requirements: regime?.requirements?.map(r => ({ ...r })) ?? [{ name: '', points: '' }],
  })

  const totalPoints = form.requirements.reduce((sum, r) => sum + (Number(r.points) || 0), 0)
  const isValid = form.name && form.period && form.requirements.length > 0 && form.requirements.every(r => r.name && r.points)

  const addRequirement = () => {
    setForm({ ...form, requirements: [...form.requirements, { name: '', points: '' }] })
  }

  const removeRequirement = (index) => {
    setForm({ ...form, requirements: form.requirements.filter((_, i) => i !== index) })
  }

  const updateRequirement = (index, field, value) => {
    const updated = form.requirements.map((r, i) => i === index ? { ...r, [field]: value } : r)
    setForm({ ...form, requirements: updated })
  }

  const handleSave = () => {
    onSave({
      name: form.name,
      description: form.description,
      period: form.period,
      totalPoints,
      requirements: form.requirements.map(r => ({ name: r.name, points: Number(r.points) })),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl border border-border shadow-xl w-full max-w-[700px] max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold text-foreground">{regime ? 'Edit Regime' : 'Add CPD Regime'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-auto px-6 py-5 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Regime Name</label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Law Society NSW" className="h-9" />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of this CPD regime and who it applies to..."
              rows={2}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>

          {/* Period */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">CPD Period</label>
            <Input value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} placeholder="e.g. 1 Jan – 31 Dec" className="h-9" />
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">CPD Requirements</label>
              <span className="text-xs text-muted-foreground">
                Total: <span className="font-medium text-foreground">{totalPoints}h</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Define how CPD hours must be split across categories. Add a single &quot;General&quot; category if no split is required.</p>

            <div className="space-y-2">
              {form.requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={req.name}
                    onChange={e => updateRequirement(index, 'name', e.target.value)}
                    placeholder="Category name"
                    className="h-8 text-sm flex-1"
                  />
                  <div className="relative w-20">
                    <Input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={req.points}
                      onChange={e => updateRequirement(index, 'points', e.target.value)}
                      placeholder="Hours"
                      className="h-8 text-sm pr-6"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">h</span>
                  </div>
                  {form.requirements.length > 1 && (
                    <button
                      onClick={() => removeRequirement(index)}
                      className="size-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" className="gap-1.5 w-full" onClick={addRequirement}>
              <Plus className="size-3.5" /> Add Category
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-border shrink-0">
          <Button size="sm" onClick={handleSave} disabled={!isValid}>
            {regime ? 'Save Changes' : 'Add Regime'}
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}

// ─── Platform Learning Journeys Page ────────────────────────────────────────

function EthikaAdminJourneysPage() {
  const [journeys, setJourneys] = useState(INITIAL_PLATFORM_JOURNEYS)
  const [statusFilter, setStatusFilter] = useState('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [newJourney, setNewJourney] = useState(null)
  const [activeJourney, setActiveJourney] = useState(null)
  const [editOverlayJourney, setEditOverlayJourney] = useState(null)

  const publishedJourneys = journeys.filter(j => j.status === 'Published')
  const draftJourneys = journeys.filter(j => j.status === 'Draft')
  const filteredJourneys = statusFilter === 'all' ? journeys : journeys.filter(j => j.status === statusFilter)

  const handlePublish = (id) => {
    setJourneys(prev => prev.map(j => j.id === id ? { ...j, status: 'Published' } : j))
  }

  const handleUnpublish = (id) => {
    setJourneys(prev => prev.map(j => j.id === id ? { ...j, status: 'Draft' } : j))
  }

  const handleDelete = (id) => {
    setJourneys(prev => prev.filter(j => j.id !== id))
  }

  const renderJourneyTable = (journeyList, emptyMessage) => (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-5">Journey</TableHead>
            <TableHead>Elements</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Audience</TableHead>
            <TableHead>Adoptions</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {journeyList.map(journey => {
            const isAllOrgs = journey.audience === 'All Organisations'
            return (
              <TableRow key={journey.id} className="hover:bg-muted/30 [&>td]:py-3 cursor-pointer" onClick={() => handleViewJourney(journey)}>
                <TableCell className="pl-5">
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">{journey.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 max-w-[320px]">{journey.description}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{journey.elements} items</TableCell>
                <TableCell className="text-sm text-muted-foreground">{journey.duration}</TableCell>
                <TableCell>
                  {isAllOrgs ? (
                    <span className="text-sm text-muted-foreground">All</span>
                  ) : (
                    <div className="flex items-center -space-x-2" title={journey.audience.join(', ')}>
                      {journey.audience.slice(0, 4).map((orgName) => (
                        <Avatar key={orgName} className="size-7 border-2 border-white">
                          <AvatarFallback className="bg-brand-100 text-brand-800 text-[10px] font-semibold">
                            {orgName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {journey.audience.length > 4 && (
                        <Avatar className="size-7 border-2 border-white">
                          <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-medium">
                            +{journey.audience.length - 4}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm font-medium text-foreground">{journey.adoptions}</TableCell>
                <TableCell>
                  {journey.status === 'Published' ? (
                    <Badge variant="status-published">
                      <img src="/solid-check.svg" alt="" className="size-3" /> Published
                    </Badge>
                  ) : (
                    <Badge variant="status-draft">
                      <CircleDashed className="size-3.5 text-gray-400" /> Draft
                    </Badge>
                  )}
                </TableCell>
                <TableCell onClick={e => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 text-muted-foreground"><MoreHorizontal className="size-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2 text-sm" onClick={() => handleViewJourney(journey)}>
                        <Pencil className="size-3.5" /> Edit
                      </DropdownMenuItem>
                      {journey.status === 'Draft' ? (
                        <DropdownMenuItem className="gap-2 text-sm" onClick={() => handlePublish(journey.id)}>
                          <Eye className="size-3.5" /> Publish
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="gap-2 text-sm" onClick={() => handleUnpublish(journey.id)}>
                          <EyeOff className="size-3.5" /> Unpublish
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="gap-2 text-sm text-destructive" onClick={() => handleDelete(journey.id)}>
                        <Trash2 className="size-3.5" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
          {journeyList.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <p className="text-sm text-muted-foreground">{emptyMessage}</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

  const handleViewJourney = (journey) => {
    setActiveJourney({ ...journey, targetRoles: journey.targetRoles || [], assignedUsers: journey.assignedUsers || [], elements: [] })
  }

  const handleEditJourney = (journey) => {
    setEditOverlayJourney({ ...journey, targetRoles: journey.targetRoles || [], assignedUsers: journey.assignedUsers || [], elements: [], skills: journey.skills || [] })
  }

  if (activeJourney) {
    return (
      <>
        <JourneyDetailPage
          journey={activeJourney}
          onChange={setActiveJourney}
          onEdit={() => handleEditJourney(activeJourney)}
          onBack={() => setActiveJourney(null)}
        />
        {editOverlayJourney && createPortal(
          <EditJourneyOverlay
            journey={editOverlayJourney}
            onChange={setEditOverlayJourney}
            onClose={() => setEditOverlayJourney(null)}
            onSave={() => setEditOverlayJourney(null)}
          />,
          document.body,
        )}
      </>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Learning Journeys</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Create and publish learning journeys for organisations to assign to their members.</p>
        </div>
        <Button className="gap-1.5" onClick={() => {
          setNewJourney({ id: null, name: '', description: '', status: 'Draft', targetRoles: [], assignedUsers: [], duration: '', elements: [] })
          setCreateOpen(true)
        }}>
          <Plus className="size-4" /> Create Journey
        </Button>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Total journeys</span>
          <span className="font-semibold text-foreground">{journeys.length}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">Published</span>
          <span className="font-semibold text-foreground">{publishedJourneys.length}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="size-2 rounded-full bg-gray-400" />
          <span className="text-muted-foreground">Drafts</span>
          <span className="font-semibold text-foreground">{draftJourneys.length}</span>
        </div>
      </div>

      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 w-auto rounded-md border border-border bg-white px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring self-start">
        <option value="all">All Statuses</option>
        <option value="Published">Published</option>
        <option value="Draft">Draft</option>
      </select>

      {renderJourneyTable(filteredJourneys, 'No journeys match the selected filter.')}

      {createOpen && newJourney && createPortal(
        <CreateJourneyOverlay
          journey={newJourney}
          onChange={setNewJourney}
          onClose={() => { setCreateOpen(false); setNewJourney(null) }}
          variant="ethika"
        />,
        document.body,
      )}
    </div>
  )
}

// ─── Talent Management ──────────────────────────────────────────────────────

const TALENT_PRACTICE_AREAS = tenant.pages.talent.practiceAreas
const TALENT_SENIORITY = ['Junior', 'Mid', 'Senior', 'Executive']
const TALENT_AVAIL_OPTIONS = ['Immediately', '1–2 weeks', '2–4 weeks']
const COLOR_OPTIONS = [
  'bg-violet-100 text-violet-700', 'bg-teal-100 text-teal-700', 'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700', 'bg-slate-100 text-slate-700', 'bg-pink-100 text-pink-700',
  'bg-cyan-100 text-cyan-700', 'bg-indigo-100 text-indigo-700', 'bg-emerald-100 text-emerald-700',
  'bg-brand-100 text-brand-700',
]

const talentStatusStyle = {
  Active:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  Inactive: 'bg-slate-50 text-slate-500 border-slate-200',
}

function TalentFormModal({ talent, onSave, onClose }) {
  const isEdit = !!talent
  const [form, setForm] = useState({
    name: talent?.name || '',
    title: talent?.title || '',
    experience: talent?.experience || '',
    location: talent?.location || '',
    seniority: talent?.seniority || 'Mid',
    availType: talent?.availType || 'Immediately',
    practiceAreas: talent?.practiceAreas || [],
    tags: talent?.tags?.join(', ') || '',
    dayRate: talent?.dayRate || '',
    showDayRate: talent?.showDayRate ?? true,
    status: talent?.status || 'Active',
  })

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function togglePracticeArea(area) {
    setForm(prev => ({
      ...prev,
      practiceAreas: prev.practiceAreas.includes(area)
        ? prev.practiceAreas.filter(a => a !== area)
        : [...prev.practiceAreas, area],
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const names = form.name.trim().split(' ')
    const initials = names.length >= 2
      ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
      : form.name.slice(0, 2).toUpperCase()

    onSave({
      ...talent,
      id: talent?.id || Date.now(),
      name: form.name.trim(),
      initials,
      color: talent?.color || COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)],
      title: form.title.trim(),
      experience: form.experience.trim(),
      location: form.location.trim(),
      seniority: form.seniority,
      availType: form.availType,
      availability: form.availType === 'Immediately' ? 'Available now' : form.availType,
      practiceAreas: form.practiceAreas,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      rating: talent?.rating || 0,
      hires: talent?.hires || 0,
      dayRate: form.dayRate.trim(),
      showDayRate: form.showDayRate,
      status: form.status,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground">
            {isEdit ? 'Edit Talent' : 'Add Talent'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto px-6 py-5 space-y-4">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2 pb-2">
            <div className="relative flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Plus className="size-5" />
            </div>
            <p className="text-xs text-muted-foreground">Upload photo</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Full Name *</label>
              <Input value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Sarah Chen" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Title *</label>
              <Input value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Corporate Lawyer" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Experience</label>
              <Input value={form.experience} onChange={e => update('experience', e.target.value)} placeholder="e.g. 12+ years" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Location</label>
              <Input value={form.location} onChange={e => update('location', e.target.value)} placeholder="e.g. Sydney, NSW" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Seniority</label>
              <select
                value={form.seniority}
                onChange={e => update('seniority', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
              >
                {TALENT_SENIORITY.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Availability</label>
              <select
                value={form.availType}
                onChange={e => update('availType', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
              >
                {TALENT_AVAIL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Day Rate</label>
              <Input value={form.dayRate} onChange={e => update('dayRate', e.target.value)} placeholder="e.g. $900 - $1,200" />
              <label className="flex items-center gap-2 cursor-pointer mt-1">
                <Switch
                  checked={form.showDayRate}
                  onCheckedChange={val => update('showDayRate', val)}
                />
                <span className="text-xs text-muted-foreground">Display on talent profile</span>
              </label>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <select
                value={form.status}
                onChange={e => update('status', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Practice Areas</label>
            <div className="flex flex-wrap gap-2">
              {TALENT_PRACTICE_AREAS.map(area => (
                <button
                  key={area}
                  type="button"
                  onClick={() => togglePracticeArea(area)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                    form.practiceAreas.includes(area)
                      ? 'bg-brand-800 text-white border-brand-800'
                      : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Skills / Tags (comma separated)</label>
            <Input value={form.tags} onChange={e => update('tags', e.target.value)} placeholder="e.g. Contracts, M&A, Governance" />
          </div>
        </form>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={!form.name.trim() || !form.title.trim()}>
            {isEdit ? 'Save Changes' : 'Add Talent'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function EthikaAdminTalentPage() {
  const [professionals, setProfessionals] = useState(
    () => tenant.pages.talent.professionals.map(p => ({ ...p, status: 'Active' }))
  )
  const [search, setSearch] = useState('')
  const [seniorityFilter, setSeniorityFilter] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTalent, setEditingTalent] = useState(null)

  const filtered = professionals.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.title.toLowerCase().includes(search.toLowerCase())) return false
    if (seniorityFilter && p.seniority !== seniorityFilter) return false
    return true
  })

  const hasFilters = search || seniorityFilter

  function handleSave(talent) {
    setProfessionals(prev => {
      const exists = prev.find(p => p.id === talent.id)
      if (exists) return prev.map(p => p.id === talent.id ? talent : p)
      return [...prev, talent]
    })
  }

  function handleDelete(id) {
    setProfessionals(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Talent Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your talent pool of vetted professionals</p>
        </div>
        <Button className="gap-1.5" onClick={() => { setEditingTalent(null); setModalOpen(true) }}>
          <Plus className="size-4" /> Add Talent
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or title..." className="pl-9 text-sm" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              {seniorityFilter || 'All Seniority'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setSeniorityFilter(null)}>All Seniority</DropdownMenuItem>
            {TALENT_SENIORITY.map(l => (
              <DropdownMenuItem key={l} onClick={() => setSeniorityFilter(l)}>{l}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setSeniorityFilter(null) }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Clear filters
          </button>
        )}
        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} of {professionals.length} professionals
        </span>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="text-xs font-medium">Name</TableHead>
              <TableHead className="text-xs font-medium">Title</TableHead>
              <TableHead className="text-xs font-medium">Practice Areas</TableHead>
              <TableHead className="text-xs font-medium">Location</TableHead>
              <TableHead className="text-xs font-medium">Seniority</TableHead>
              <TableHead className="text-xs font-medium">Availability</TableHead>
              <TableHead className="text-xs font-medium">Rating</TableHead>
              <TableHead className="text-xs font-medium">Status</TableHead>
              <TableHead className="text-xs font-medium w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(p => (
              <TableRow key={p.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className={`text-xs font-semibold ${p.color}`}>{p.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">{p.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.title}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {p.practiceAreas.slice(0, 2).map(area => (
                      <span key={area} className="text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{area}</span>
                    ))}
                    {p.practiceAreas.length > 2 && (
                      <span className="text-xs text-muted-foreground">+{p.practiceAreas.length - 2}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-3 shrink-0" /> {p.location}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.seniority}</TableCell>
                <TableCell>
                  <span className={`flex items-center gap-1 text-xs font-medium ${
                    p.availType === 'Immediately' ? 'text-emerald-600' : 'text-muted-foreground'
                  }`}>
                    <Clock className="size-3 shrink-0" />
                    {p.availType === 'Immediately' ? 'Available now' : p.availType}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    <span className="text-sm text-muted-foreground">{p.rating}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs ${talentStatusStyle[p.status || 'Active']}`}>
                    {p.status || 'Active'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setEditingTalent(p); setModalOpen(true) }} className="gap-2 text-xs">
                        <Pencil className="size-3.5" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(p.id)}
                        className="gap-2 text-xs text-destructive focus:text-destructive"
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-sm text-muted-foreground">
                  No professionals found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {modalOpen && (
        <TalentFormModal
          talent={editingTalent}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingTalent(null) }}
        />
      )}
    </div>
  )
}

function PlaceholderPage({ title }) {
  return (
    <div className="flex-1 overflow-auto p-6">
      <p className="text-muted-foreground text-sm">{title} content goes here.</p>
    </div>
  )
}

function EthikaAdminSidebar({ onLogout }) {
  const { toggleSidebar } = useSidebar()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activePage = ETHIKA_PATH_TO_PAGE[pathname] || 'Organisations'

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <img src="/ethos-logo.svg" alt="Ethika Ethos" className="h-7 w-auto group-data-[collapsible=icon]:hidden" />
                <img src="/ethos-icon.svg" alt="Ethika Ethos" className="hidden size-7 group-data-[collapsible=icon]:block" />
              </div>
              <div className="flex items-center gap-0.5 group-data-[collapsible=icon]:hidden">
                <button className="size-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors">
                  <Search className="size-4" />
                </button>
                <button onClick={toggleSidebar} className="size-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors">
                  <PanelLeftClose className="size-4" />
                </button>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-xs tracking-widest text-muted-foreground/70 font-semibold">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items && group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={activePage === item.page}
                      onClick={() => navigate(item.path)}
                      className="gap-2.5"
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {group.subgroups && group.subgroups.map((sg) => (
                  <SidebarMenuItem key={sg.label}>
                    <SidebarMenuButton
                      tooltip={sg.label}
                      isActive={sg.items.some(i => activePage === i.page)}
                      onClick={() => navigate(sg.items[0].path)}
                      className="gap-2.5"
                    >
                      <sg.icon className="size-4 shrink-0" />
                      <span>{sg.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip="Ethika Admin"
                  className="gap-2.5"
                >
                  <Avatar className="size-7 shrink-0">
                    <AvatarFallback className="bg-brand-800 text-white text-xs font-semibold">
                      EA
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium">Ethika Admin</span>
                    <span className="text-xs text-muted-foreground">admin@ethika.com</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <div className="px-2 py-2">
                  <p className="text-sm font-medium text-foreground">Ethika Admin</p>
                  <p className="text-xs text-muted-foreground">admin@ethika.com</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-sm">
                  <User className="size-4" /> Edit profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-sm text-destructive" onClick={onLogout}>
                  <LogOut className="size-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

// ─── Handbook Manager (Content Management) ──────────────────────────────────

const HANDBOOK_COUNTRIES = ['Australia', 'New Zealand', 'United Kingdom', 'Singapore']

const HANDBOOK_PARTS = [
  {
    id: 1, title: 'Introduction',
    topics: [{ id: 't1-1', title: 'Welcome to Duties Handbook', version: 1, status: 'live', quizCount: 5 }],
  },
  {
    id: 2, title: 'Key Updates & Trends',
    topics: [
      { id: 't2-1', title: 'Recent Legislative Changes', version: 3, status: 'live', quizCount: 8 },
      { id: 't2-2', title: 'Emerging Governance Trends', version: 4, status: 'draft', quizCount: 3 },
    ],
  },
  {
    id: 3, title: 'Core Statutory Duties',
    topics: [
      { id: 't3-1', title: 'Duty of Care and Diligence', version: 2, status: 'live', quizCount: 6 },
      { id: 't3-2', title: 'Duty to Act in Good Faith', version: 1, status: 'live', quizCount: 4 },
      { id: 't3-3', title: 'Duty to Not Misuse Position', version: 2, status: 'draft', quizCount: 5 },
    ],
  },
  {
    id: 4, title: 'Other Legal Duties',
    topics: [
      { id: 't4-1', title: 'Continuous Disclosure', version: 1, status: 'live', quizCount: 3 },
      { id: 't4-2', title: 'Related Party Transactions', version: 2, status: 'live', quizCount: 4 },
      { id: 't4-3', title: 'Financial Reporting Duties', version: 1, status: 'live', quizCount: 2 },
      { id: 't4-4', title: 'Insolvent Trading', version: 3, status: 'live', quizCount: 5 },
    ],
  },
  {
    id: 5, title: 'Watch Out For',
    topics: [
      { id: 't5-1', title: 'Common Pitfalls', version: 1, status: 'live', quizCount: 4 },
      { id: 't5-2', title: 'Case Studies', version: 2, status: 'live', quizCount: 6 },
    ],
  },
  {
    id: 6, title: 'Summary',
    topics: [{ id: 't6-1', title: 'Key Takeaways', version: 1, status: 'live', quizCount: 3 }],
  },
]

const GENERIC_PARTS = {
  'kc-ai-gov': [
    { id: 1, title: 'Introduction', topics: [{ id: 'g1-1', title: 'What is AI Governance?', version: 1, status: 'live', quizCount: 3 }] },
    { id: 2, title: 'AI Risk Assessment', topics: [{ id: 'g2-1', title: 'Identifying AI Risks', version: 1, status: 'live', quizCount: 4 }, { id: 'g2-2', title: 'Bias and Fairness', version: 2, status: 'draft', quizCount: 2 }] },
    { id: 3, title: 'Ethical Use Policies', topics: [{ id: 'g3-1', title: 'Transparency Requirements', version: 1, status: 'live', quizCount: 3 }, { id: 'g3-2', title: 'Human Oversight', version: 1, status: 'live', quizCount: 2 }] },
    { id: 4, title: 'Board Oversight of AI', topics: [{ id: 'g4-1', title: 'Governance Structures', version: 1, status: 'live', quizCount: 3 }] },
  ],
  'kc-banking': [
    { id: 1, title: 'Introduction', topics: [{ id: 'b1-1', title: 'Australian Banking Landscape', version: 1, status: 'live', quizCount: 3 }] },
    { id: 2, title: 'APRA Regulatory Framework', topics: [{ id: 'b2-1', title: 'Prudential Standards Overview', version: 2, status: 'live', quizCount: 5 }, { id: 'b2-2', title: 'CPS 220 Risk Management', version: 1, status: 'live', quizCount: 4 }] },
    { id: 3, title: 'ASIC Obligations', topics: [{ id: 'b3-1', title: 'AFS Licensing', version: 1, status: 'live', quizCount: 3 }, { id: 'b3-2', title: 'Responsible Lending', version: 1, status: 'draft', quizCount: 2 }] },
    { id: 4, title: 'Prudential Standards', topics: [{ id: 'b4-1', title: 'CPS 234 Information Security', version: 1, status: 'live', quizCount: 4 }] },
  ],
  'kc-risk': [
    { id: 1, title: 'Introduction', topics: [{ id: 'r1-1', title: 'Enterprise Risk Overview', version: 1, status: 'live', quizCount: 3 }] },
    { id: 2, title: 'Risk Identification', topics: [{ id: 'r2-1', title: 'Risk Workshops', version: 1, status: 'live', quizCount: 3 }, { id: 'r2-2', title: 'Scenario Analysis', version: 2, status: 'live', quizCount: 4 }] },
    { id: 3, title: 'Risk Appetite Setting', topics: [{ id: 'r3-1', title: 'Appetite Statements', version: 1, status: 'live', quizCount: 2 }] },
    { id: 4, title: 'Control Frameworks', topics: [{ id: 'r4-1', title: 'Three Lines Model', version: 1, status: 'live', quizCount: 3 }, { id: 'r4-2', title: 'Key Risk Indicators', version: 1, status: 'draft', quizCount: 2 }] },
  ],
  'kc-privacy': [
    { id: 1, title: 'Introduction', topics: [{ id: 'p1-1', title: 'Privacy Act Overview', version: 1, status: 'live', quizCount: 2 }] },
    { id: 2, title: 'Australian Privacy Principles', topics: [{ id: 'p2-1', title: 'Collection & Disclosure', version: 1, status: 'live', quizCount: 4 }, { id: 'p2-2', title: 'Storage & Access', version: 1, status: 'live', quizCount: 3 }] },
    { id: 3, title: 'Data Breach Notification', topics: [{ id: 'p3-1', title: 'NDB Scheme Requirements', version: 2, status: 'live', quizCount: 3 }] },
  ],
  'kc-aml': [
    { id: 1, title: 'Introduction', topics: [{ id: 'a1-1', title: 'AML/CTF Act Overview', version: 1, status: 'live', quizCount: 3 }] },
    { id: 2, title: 'Customer Due Diligence', topics: [{ id: 'a2-1', title: 'KYC Procedures', version: 2, status: 'live', quizCount: 5 }, { id: 'a2-2', title: 'Enhanced Due Diligence', version: 1, status: 'live', quizCount: 3 }] },
    { id: 3, title: 'Suspicious Matter Reporting', topics: [{ id: 'a3-1', title: 'SMR Indicators', version: 1, status: 'live', quizCount: 4 }] },
    { id: 4, title: 'Compliance Program', topics: [{ id: 'a4-1', title: 'Part A & Part B', version: 1, status: 'draft', quizCount: 2 }] },
  ],
  'kc-modern-slavery': [
    { id: 1, title: 'Introduction', topics: [{ id: 'm1-1', title: 'Modern Slavery Act Overview', version: 1, status: 'draft', quizCount: 2 }] },
    { id: 2, title: 'Reporting Obligations', topics: [{ id: 'm2-1', title: 'Statement Requirements', version: 1, status: 'draft', quizCount: 3 }] },
    { id: 3, title: 'Supply Chain Due Diligence', topics: [{ id: 'm3-1', title: 'Supplier Mapping', version: 1, status: 'draft', quizCount: 2 }] },
  ],
  'kc-cyber': [
    { id: 1, title: 'Introduction', topics: [{ id: 'c1-1', title: 'Cyber Governance Overview', version: 1, status: 'draft', quizCount: 2 }] },
    { id: 2, title: 'Incident Response', topics: [{ id: 'c2-1', title: 'Response Planning', version: 1, status: 'draft', quizCount: 3 }, { id: 'c2-2', title: 'Communication Protocols', version: 1, status: 'draft', quizCount: 2 }] },
    { id: 3, title: 'Regulatory Obligations', topics: [{ id: 'c3-1', title: 'CPS 234 Compliance', version: 1, status: 'draft', quizCount: 3 }] },
  ],
}

const METADATA_CATEGORIES = ['Governance & Duties', 'Legislation & Regulation', 'Substantive Law', 'Ethics & Professional Standards', 'Practice Management', 'Technology & AI']
const METADATA_TYPES = ['Handbook', 'Guide', 'Framework', 'Course', 'External']
const METADATA_SOURCES = ['Ethika', 'Firm', 'External']
const METADATA_SKILLS = ['Governance & Board Effectiveness', 'Ethics & Professional Responsibility', 'Risk & Compliance', 'Legal & Regulatory', 'Data Privacy & Protection', 'ESG Reporting Frameworks', 'AML/CTF']

function HandbookManagerPage({ title, parts, onBack, item }) {
  const [country, setCountry] = useState('Australia')
  const [expandedParts, setExpandedParts] = useState([1, 2])
  const [addPartOpen, setAddPartOpen] = useState(false)
  const [newPartTitle, setNewPartTitle] = useState('')
  const [newPartSubText, setNewPartSubText] = useState('')
  const [editingTopic, setEditingTopic] = useState(null)
  const [editorTab, setEditorTab] = useState('content')
  const [metadataOpen, setMetadataOpen] = useState(false)
  const [metaVisibility, setMetaVisibility] = useState(item?.visibility || 'global')
  const [metaCpdRelevant, setMetaCpdRelevant] = useState(item?.cpdRelevant || false)
  const [metaType, setMetaType] = useState(item?.type || 'handbook')
  const [metaScope, setMetaScope] = useState(item?.scope || 'global')
  const [metaCountries, setMetaCountries] = useState(item?.countries || [])
  const [countrySearch, setCountrySearch] = useState('')
  const [orgSearch, setOrgSearch] = useState('')
  const [assignedOrgs, setAssignedOrgs] = useState([])
  const [metaSkills, setMetaSkills] = useState(item?.skills || [])
  const [skillSearch, setSkillSearch] = useState('')

  const activeParts = parts || HANDBOOK_PARTS
  const activeTitle = title || 'Duties Handbook'
  const totalParts = activeParts.length
  const totalTopics = activeParts.reduce((sum, p) => sum + p.topics.length, 0)

  const togglePart = (id) => {
    setExpandedParts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  // ── Topic Editor (full-screen overlay) ──
  if (editingTopic) {
    return createPortal(
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        <div className="flex items-center justify-between px-5 h-14 border-b border-border/60 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => { setEditingTopic(null); setEditorTab('content') }} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="size-5" />
            </button>
            <div>
              <p className="text-sm font-medium text-foreground leading-tight">{editingTopic.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Pencil className="size-3" /> Editing v{editingTopic.status === 'draft' ? editingTopic.version : editingTopic.version + 1} draft
                </span>
                <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  v{editingTopic.status === 'live' ? editingTopic.version : editingTopic.version - 1} live
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center bg-muted/50 rounded-lg p-0.5">
            <button onClick={() => setEditorTab('content')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${editorTab === 'content' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              Edit Content
            </button>
            <button onClick={() => setEditorTab('quiz')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${editorTab === 'quiz' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              Quiz Questions ({editingTopic.quizCount})
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground"><Eye className="size-4" /> Preview Changes</Button>
            <Button variant="outline" size="sm">Save Draft</Button>
            <Button size="sm" className="gap-1.5"><CheckCircle2 className="size-4" /> Publish</Button>
          </div>
        </div>

        {editorTab === 'content' ? (
          <div className="flex-1 overflow-auto flex flex-col">
            <div className="flex items-center gap-1 px-5 py-2.5 border-b border-border/60 shrink-0">
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg></button>
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 009-9 9 9 0 016 2.3L21 13"/></svg></button>
              <div className="w-px h-5 bg-border/60 mx-1" />
              <select className="h-8 rounded border border-border bg-background px-2 text-xs text-foreground cursor-pointer focus:outline-none"><option>Paragraph</option><option>Heading 1</option><option>Heading 2</option><option>Heading 3</option></select>
              <select className="h-8 w-14 rounded border border-border bg-background px-2 text-xs text-foreground cursor-pointer focus:outline-none ml-1"><option>16</option><option>14</option><option>18</option><option>20</option><option>24</option></select>
              <div className="w-px h-5 bg-border/60 mx-1" />
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-foreground font-bold text-sm">B</button>
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-foreground italic text-sm">I</button>
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-foreground underline text-sm">U</button>
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-foreground line-through text-sm">S</button>
              <div className="w-px h-5 bg-border/60 mx-1" />
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground"><Link2 className="size-4" /></button>
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></button>
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></button>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="max-w-3xl mx-auto py-10 px-6">
                <div className="prose prose-sm max-w-none focus:outline-none min-h-[500px]" contentEditable suppressContentEditableWarning>
                  <h1>Core Statutory Duties</h1>
                  <p>Lorem ipsum dolor sit amet consectetur. Rhoncus eget tortor fusce amet sit sollicitudin tristique. Non dictum nulla tristique aenean placerat ac dictum non. Quis a sed congue consectetur volutpat. Est magna sapien non nunc.</p>
                  <p>Sollicitudin nec feugiat nisi sed. Pretium est lacinia ullamcorper nibh et tempus mus arcu adipiscing. Sed purus risus sed sapien gravida.</p>
                  <h3>Lorem ipsum dolor sit a</h3>
                  <p>met consectetur. Rhoncus eget tortor fusce amet sit sollicitudin tristique. Non dictum nulla tristique aenean placerat ac dictum non.</p>
                  <h3>Lorem ipsum</h3>
                  <p>met consectetur. Rhoncus eget tortor fusce amet sit sollicitudin tristique. Non dictum nulla tristique aenean placerat ac dictum non.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-foreground">Quiz Questions</h2>
                <Button size="sm" className="gap-1.5"><Plus className="size-4" /> Add Question</Button>
              </div>
              <p className="text-sm text-muted-foreground">{editingTopic.quizCount} questions configured for this topic.</p>
              {Array.from({ length: editingTopic.quizCount }, (_, i) => (
                <div key={i} className="border border-border/60 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">Question {i + 1}</p>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="size-7 text-muted-foreground"><Pencil className="size-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="size-7 text-muted-foreground"><Trash2 className="size-3.5" /></Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Sample question placeholder for quiz item {i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>,
      document.body
    )
  }

  return (
    <div className="space-y-6">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="size-4" />
          Back
        </button>
      )}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">{activeTitle}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage content and quizzes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setMetadataOpen(true)}><Settings className="size-4" /> Settings</Button>
          <Button variant="outline" size="sm" className="gap-1.5"><Eye className="size-4" /> Preview</Button>
        </div>
      </div>

      {/* Settings Modal */}
      {metadataOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMetadataOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[640px] max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0">
              <h2 className="text-lg font-semibold text-foreground">Content Settings</h2>
              <button onClick={() => setMetadataOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Section: General */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">General</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">Title</label>
                    <Input defaultValue={activeTitle} className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Category</label>
                    <select defaultValue={item?.category || ''} className="w-full h-9 rounded-md border border-border bg-white px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring">
                      <option value="">Select category</option>
                      {METADATA_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Content Type</label>
                    <select value={metaType} onChange={e => setMetaType(e.target.value)} className="w-full h-9 rounded-md border border-border bg-white px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring">
                      {METADATA_TYPES.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
                    </select>
                  </div>
                  {metaType === 'external' ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">External URL</label>
                      <Input defaultValue={item?.externalUrl || ''} placeholder="https://..." className="h-9 text-sm" />
                    </div>
                  ) : (
                    <div />
                  )}
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">Skills</label>
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input value={skillSearch} onChange={e => setSkillSearch(e.target.value)} placeholder="Search skills..." className="pl-9 h-9 text-sm" />
                      </div>
                      {skillSearch.trim() && (
                        <div className="border border-border rounded-md bg-white max-h-[140px] overflow-y-auto">
                          {METADATA_SKILLS.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()) && !metaSkills.includes(s)).map(s => (
                            <button key={s} onClick={() => { setMetaSkills(prev => [...prev, s]); setSkillSearch('') }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/30 transition-colors text-left">
                              {s}
                            </button>
                          ))}
                          {METADATA_SKILLS.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()) && !metaSkills.includes(s)).length === 0 && (
                            <p className="px-3 py-2 text-xs text-muted-foreground">No matching skills</p>
                          )}
                        </div>
                      )}
                      {metaSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {metaSkills.map(s => (
                            <span key={s} className="inline-flex items-center gap-1 text-xs font-medium text-foreground bg-muted rounded-full px-2 h-6">
                              {s}
                              <X className="size-3 text-muted-foreground cursor-pointer" onClick={() => setMetaSkills(prev => prev.filter(x => x !== s))} />
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/40" />

              {/* Section: Time & CPD */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">Time & CPD</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Estimated Time</label>
                    <Input defaultValue={item?.estimatedTime || ''} placeholder="e.g. 2.5 hrs" className="h-9 text-sm" />
                  </div>
                  <div />
                  <div className="flex items-center justify-between col-span-2">
                    <div>
                      <label className="text-sm font-medium text-foreground">CPD Relevant</label>
                      <p className="text-xs text-muted-foreground">Enable to assign CPD points to this content</p>
                    </div>
                    <Switch checked={metaCpdRelevant} onCheckedChange={setMetaCpdRelevant} />
                  </div>
                  {metaCpdRelevant && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">CPD Points</label>
                      <Input type="number" defaultValue={item?.cpdPoints || ''} className="h-9 text-sm" />
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-border/40" />

              {/* Section: Geographic Scope */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">Geographic Scope</p>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Scope</label>
                    <select value={metaScope} onChange={e => { setMetaScope(e.target.value); if (e.target.value === 'global') setMetaCountries([]) }} className="w-full h-9 rounded-md border border-border bg-white px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring">
                      <option value="global">Global — Applies to all countries</option>
                      <option value="country">Country Specific — Select applicable countries</option>
                    </select>
                  </div>
                  {metaScope === 'country' && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Countries</label>
                        <div className="relative">
                          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                          <Input value={countrySearch} onChange={e => setCountrySearch(e.target.value)} placeholder="Search countries..." className="pl-9 h-9 text-sm" />
                        </div>
                      </div>
                      {countrySearch.trim() && (
                        <div className="border border-border rounded-md bg-white max-h-[140px] overflow-y-auto">
                          {HANDBOOK_COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()) && !metaCountries.includes(c)).map(c => (
                            <button key={c} onClick={() => { setMetaCountries(prev => [...prev, c]); setCountrySearch('') }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/30 transition-colors text-left">
                              {c}
                            </button>
                          ))}
                          {HANDBOOK_COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()) && !metaCountries.includes(c)).length === 0 && (
                            <p className="px-3 py-2 text-xs text-muted-foreground">No matching countries</p>
                          )}
                        </div>
                      )}
                      {metaCountries.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {metaCountries.map(c => (
                            <span key={c} className="inline-flex items-center gap-1 text-xs font-medium text-foreground bg-muted rounded-full px-2 h-6">
                              {c}
                              <X className="size-3 text-muted-foreground cursor-pointer" onClick={() => setMetaCountries(prev => prev.filter(n => n !== c))} />
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-border/40" />

              {/* Section: Visibility & Access */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">Visibility & Access</p>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Visibility</label>
                    <select value={metaVisibility} onChange={e => setMetaVisibility(e.target.value)} className="w-full h-9 rounded-md border border-border bg-white px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring">
                      <option value="global">Global — All organisations</option>
                      <option value="assigned">Assigned — Specific organisations</option>
                    </select>
                  </div>
                  {metaVisibility === 'assigned' && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Assigned Organisations</label>
                        <div className="relative">
                          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                          <Input value={orgSearch} onChange={e => setOrgSearch(e.target.value)} placeholder="Search organisations..." className="pl-9 h-9 text-sm" />
                        </div>
                      </div>
                      {orgSearch.trim() && (
                        <div className="border border-border rounded-md bg-white max-h-[140px] overflow-y-auto">
                          {mockOrganisations.filter(o => o.name.toLowerCase().includes(orgSearch.toLowerCase()) && !assignedOrgs.includes(o.name)).map(org => (
                            <button key={org.id} onClick={() => { setAssignedOrgs(prev => [...prev, org.name]); setOrgSearch('') }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/30 transition-colors text-left">
                              <Building2 className="size-3.5 text-muted-foreground" />
                              {org.name}
                            </button>
                          ))}
                          {mockOrganisations.filter(o => o.name.toLowerCase().includes(orgSearch.toLowerCase()) && !assignedOrgs.includes(o.name)).length === 0 && (
                            <p className="px-3 py-2 text-xs text-muted-foreground">No matching organisations</p>
                          )}
                        </div>
                      )}
                      {assignedOrgs.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {assignedOrgs.map(name => (
                            <span key={name} className="inline-flex items-center gap-1 text-xs font-medium text-foreground bg-muted rounded-full px-2 h-6">
                              {name}
                              <X className="size-3 text-muted-foreground cursor-pointer" onClick={() => setAssignedOrgs(prev => prev.filter(n => n !== name))} />
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-border/40" />

              {/* Section: Media & Links */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">Media & Links</p>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Hero Image</label>
                    {item?.heroImage ? (
                      <div className="space-y-2">
                        <div className="relative rounded-lg overflow-hidden border border-border h-[140px] w-full">
                          <img src={item.heroImage} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                            <Button variant="secondary" size="sm" className="gap-1.5">
                              <Upload className="size-3.5" /> Replace
                            </Button>
                          </div>
                        </div>
                        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Remove image</button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-muted-foreground/40 transition-colors cursor-pointer">
                        <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                          <Upload className="size-5 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground">Click to upload</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border/60 shrink-0 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setMetadataOpen(false)}>Cancel</Button>
              <Button onClick={() => setMetadataOpen(false)}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {metaType !== 'external' && (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {metaScope === 'country' && metaCountries.length > 0 && (
            <select value={country} onChange={e => setCountry(e.target.value)} className="h-9 rounded-md border border-border bg-white px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring">
              {metaCountries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
          {metaScope === 'global' && (
            <span className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border bg-muted/30 text-sm text-muted-foreground">
              <Globe className="size-3.5" /> Global
            </span>
          )}
          <span className="text-sm text-muted-foreground">{totalParts} parts &middot; {totalTopics} topics</span>
        </div>
        <p className="text-sm text-muted-foreground">Last updated: 12 Jun 2025 at 4:30pm</p>
      </div>
      )}

      {metaType === 'external' && (
        <div className="border border-dashed border-border rounded-lg bg-muted/30 p-10 flex flex-col items-center justify-center gap-3 text-center">
          <Globe className="size-8 text-muted-foreground/40" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">This is an external module</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Configure the external URL in <button onClick={() => setMetadataOpen(true)} className="text-brand-700 hover:underline">Settings</button></p>
          </div>
        </div>
      )}

      {metaType !== 'external' && activeParts.length === 0 && (
        <div className="border border-dashed border-border rounded-lg bg-white p-12 flex flex-col items-center justify-center gap-4 text-center">
          <div className="size-14 rounded-full bg-brand-50 flex items-center justify-center">
            <LayoutList className="size-7 text-brand-600" />
          </div>
          <div className="max-w-sm space-y-2">
            <h3 className="text-lg font-medium text-foreground">Start building your content</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Organise your content into parts, then add topics within each part. Parts are the top-level sections, and topics are the individual pages your users will read.
            </p>
          </div>
          <Button className="gap-1.5 mt-2" onClick={() => setAddPartOpen(true)}>
            <Plus className="size-4" />
            Add First Part
          </Button>
        </div>
      )}

      {metaType !== 'external' && activeParts.length > 0 && (<>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{totalParts} parts – drag to reorder</p>
        <Button size="sm" className="gap-1.5" onClick={() => setAddPartOpen(true)}><Plus className="size-4" /> Add Part</Button>
      </div>

      <div className="space-y-3">
        {activeParts.map((part) => {
          const isExpanded = expandedParts.includes(part.id)
          return (
            <div key={part.id} className="border border-border/60 rounded-lg overflow-hidden bg-white">
              <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => togglePart(part.id)}>
                <GripVertical className="size-4 text-muted-foreground/40 shrink-0 cursor-grab" />
                {isExpanded ? <ChevronDown className="size-4 text-muted-foreground shrink-0" /> : <ChevronRight className="size-4 text-muted-foreground shrink-0" />}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">Part {part.id}</span>
                  <span className="text-sm text-foreground">{part.title}</span>
                  <span className="text-xs text-muted-foreground ml-1">({part.topics.length} topic{part.topics.length !== 1 ? 's' : ''})</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8 text-muted-foreground shrink-0" onClick={e => e.stopPropagation()}>
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2 text-sm"><Pencil className="size-3.5" /> Rename part</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-sm"><Plus className="size-3.5" /> Add topic</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-sm text-destructive"><Trash2 className="size-3.5" /> Delete part</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {isExpanded && (
                <div className="border-t border-border/60">
                  {part.topics.map((topic) => (
                    <div key={topic.id} className="flex items-center gap-3 px-4 py-2.5 pl-12 hover:bg-muted/20 transition-colors border-b border-border/30 last:border-b-0">
                      <GripVertical className="size-3.5 text-muted-foreground/30 shrink-0 cursor-grab" />
                      <span className="text-sm text-brand-700 hover:underline cursor-pointer flex-1 min-w-0 truncate" onClick={() => setEditingTopic(topic)}>{topic.title}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${topic.status === 'live' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                          v{topic.version} {topic.status === 'live' ? 'Live' : 'Draft'}
                        </span>
                        <span className="text-xs text-muted-foreground">Quiz ({topic.quizCount})</span>
                        <button className="text-muted-foreground hover:text-foreground transition-colors"><History className="size-3.5" /></button>
                      </div>
                    </div>
                  ))}
                  <div className="px-4 py-2.5 pl-12 border-t border-border/30">
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"><Plus className="size-3.5" /> Add topic</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      </>)}

      {addPartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAddPartOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[480px] p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-foreground">Add Part</h2>
              <button onClick={() => setAddPartOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="size-5" /></button>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Part Title</label>
              <input value={newPartTitle} onChange={e => setNewPartTitle(e.target.value)} placeholder="Eg. Introduction" className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Sub Text</label>
              <textarea value={newPartSubText} onChange={e => setNewPartSubText(e.target.value)} placeholder="Enter part sub text" rows={3} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring resize-y" />
              <p className="text-xs text-muted-foreground">This is the text that will appear below the part title in the duties handbook</p>
            </div>
            <Button className="w-full" onClick={() => { setAddPartOpen(false); setNewPartTitle(''); setNewPartSubText('') }}>Add Part</Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Knowledge Library Data ──────────────────────────────────────────────────

const LIBRARY_ITEMS = [
  { id: 'kc-duties', title: 'Duties Handbook', type: 'handbook', category: 'Governance & Duties', skills: ['Governance & Board Effectiveness', 'Ethics & Professional Responsibility'], source: 'Ethika', updated: 'Updated today', status: 'published', estimatedTime: '3 hrs', cpdRelevant: true, cpdPoints: 6, visibility: 'global', scope: 'country', countries: ['Australia', 'New Zealand'], heroImage: '/images/duties-handbook-hero.png', quizCount: 24 },
  { id: 'kc-ai-gov', title: 'AI Governance Framework', type: 'framework', category: 'Technology & AI', skills: ['Risk & Compliance', 'Governance & Board Effectiveness'], source: 'Ethika', updated: 'Updated 2 days ago', status: 'published', estimatedTime: '2 hrs', cpdRelevant: true, cpdPoints: 4, visibility: 'global', scope: 'global', countries: [], heroImage: '/images/ai-governance-hero.png', quizCount: 12 },
  { id: 'kc-banking', title: 'Banking Regulation Course', type: 'course', category: 'Legislation & Regulation', skills: ['Legal & Regulatory', 'Risk & Compliance'], source: 'Ethika', updated: 'Updated 1 week ago', status: 'published', estimatedTime: '4 hrs', cpdRelevant: false, visibility: 'global', scope: 'country', countries: ['Australia'], heroImage: '/images/banking-regulation-hero.png', quizCount: 8 },
  { id: 'kc-risk', title: 'Risk Management Framework', type: 'framework', category: 'Governance & Duties', skills: ['Risk & Compliance'], source: 'Ethika', updated: 'Updated 3 days ago', status: 'published', estimatedTime: '2.5 hrs', cpdRelevant: false, visibility: 'global', scope: 'global', countries: [], heroImage: '/images/risk-management-hero.png', quizCount: 6 },
  { id: 'kc-esg', title: 'ESG & Sustainability Reporting Module', type: 'external', category: 'Ethics & Professional Standards', skills: ['ESG Reporting Frameworks'], source: 'External', updated: 'Updated 5 days ago', status: 'published', estimatedTime: '3 hrs', cpdRelevant: false, visibility: 'global', scope: 'global', countries: [], externalUrl: 'https://www.aasb.gov.au/pronouncements/sustainability-standards/', heroImage: '/images/esg-reporting-hero.png', quizCount: 0 },
  { id: 'kc-privacy', title: 'Data Privacy & Protection Guide', type: 'guide', category: 'Legislation & Regulation', skills: ['Data Privacy & Protection'], source: 'Firm', updated: 'Updated 1 week ago', status: 'published', estimatedTime: '1.5 hrs', cpdRelevant: false, visibility: 'assigned', scope: 'country', countries: ['Australia', 'New Zealand', 'Singapore'], quizCount: 4 },
  { id: 'kc-aml', title: 'AML/CTF Compliance Fundamentals', type: 'course', category: 'Practice Management', skills: ['AML/CTF', 'Risk & Compliance'], source: 'Ethika', updated: 'Updated 2 weeks ago', status: 'published', estimatedTime: '3.5 hrs', cpdRelevant: false, visibility: 'global', scope: 'global', countries: [], quizCount: 15 },
  { id: 'kc-board-eval', title: 'Board Effectiveness Case Studies', type: 'external', category: 'Governance & Duties', skills: ['Governance & Board Effectiveness'], source: 'External', updated: 'Updated 3 days ago', status: 'published', estimatedTime: '2 hrs', cpdRelevant: false, visibility: 'global', scope: 'global', countries: [], externalUrl: 'https://aicd.companydirectors.com.au/resources/governance-cases', quizCount: 0 },
  { id: 'kc-modern-slavery', title: 'Modern Slavery Reporting Guide', type: 'guide', category: 'Ethics & Professional Standards', skills: ['Risk & Compliance', 'Legal & Regulatory'], source: 'Ethika', updated: 'Updated 4 days ago', status: 'draft', estimatedTime: '2 hrs', cpdRelevant: false, visibility: 'global', scope: 'country', countries: ['United Kingdom'], quizCount: 0 },
  { id: 'kc-cyber', title: 'Cyber Security Governance Framework', type: 'framework', category: 'Technology & AI', skills: ['Risk & Compliance'], source: 'Firm', updated: 'Updated 1 week ago', status: 'draft', estimatedTime: '2.5 hrs', cpdRelevant: false, visibility: 'assigned', scope: 'global', countries: [], quizCount: 3 },
]

const LIBRARY_TYPE_LABELS = {
  handbook: 'Handbook',
  guide: 'Guide',
  framework: 'Framework',
  course: 'Course',
  external: 'External',
}

const LIBRARY_SKILL_TO_CATEGORY = {
  'Governance & Board Effectiveness': 'Governance & Duties',
  'Ethics & Professional Responsibility': 'Ethics & Professional Standards',
  'Legal & Regulatory': 'Legislation & Regulation',
  'Risk & Compliance': 'Technology & AI',
  'Data Privacy & Protection': 'Technology & AI',
  'ESG Reporting Frameworks': 'Technology & AI',
  'AML/CTF': 'Practice Management',
}

function KnowledgeLibraryPage() {
  const [search, setSearch] = useState('')
  const [countryFilter, setCountryFilter] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null)
  const [libraryItems, setLibraryItems] = useState(LIBRARY_ITEMS)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  // Create modal form state
  const [createTitle, setCreateTitle] = useState('')
  const [createCategory, setCreateCategory] = useState('')
  const [createType, setCreateType] = useState('handbook')
  const [createExternalUrl, setCreateExternalUrl] = useState('')
  const [createSkills, setCreateSkills] = useState([])
  const [createSkillSearch, setCreateSkillSearch] = useState('')
  const [createEstimatedTime, setCreateEstimatedTime] = useState('')
  const [createCpdRelevant, setCreateCpdRelevant] = useState(false)
  const [createCpdPoints, setCreateCpdPoints] = useState('')
  const [createScope, setCreateScope] = useState('global')
  const [createCountries, setCreateCountries] = useState([])
  const [createCountrySearch, setCreateCountrySearch] = useState('')
  const [createVisibility, setCreateVisibility] = useState('global')
  const [createAssignedOrgs, setCreateAssignedOrgs] = useState([])
  const [createOrgSearch, setCreateOrgSearch] = useState('')

  const resetCreateForm = () => {
    setCreateTitle('')
    setCreateCategory('')
    setCreateType('handbook')
    setCreateExternalUrl('')
    setCreateSkills([])
    setCreateSkillSearch('')
    setCreateEstimatedTime('')
    setCreateCpdRelevant(false)
    setCreateCpdPoints('')
    setCreateScope('global')
    setCreateCountries([])
    setCreateCountrySearch('')
    setCreateVisibility('global')
    setCreateAssignedOrgs([])
    setCreateOrgSearch('')
  }

  const handleCreateContent = () => {
    if (!createTitle.trim()) return
    const newItem = {
      id: `kc-${Date.now()}`,
      title: createTitle.trim(),
      type: createType,
      category: createCategory || 'Governance & Duties',
      skills: createSkills,
      source: 'Firm',
      updated: 'Just now',
      status: 'draft',
      estimatedTime: createEstimatedTime || '',
      cpdRelevant: createCpdRelevant,
      cpdPoints: createCpdRelevant ? (parseInt(createCpdPoints) || 0) : undefined,
      visibility: createVisibility,
      scope: createScope,
      countries: createCountries,
      externalUrl: createType === 'external' ? createExternalUrl : undefined,
      _isNew: true,
    }
    setLibraryItems(prev => [newItem, ...prev])
    setCreateModalOpen(false)
    resetCreateForm()
    setSelectedItem(newItem)
  }

  if (selectedItem) {
    const itemParts = selectedItem._isNew ? [] : (
      selectedItem.id === 'kc-duties' ? HANDBOOK_PARTS : (GENERIC_PARTS[selectedItem.id] || [
        { id: 1, title: 'Introduction', topics: [{ id: 'x1-1', title: 'Overview', version: 1, status: 'draft', quizCount: 0 }] },
      ])
    )
    return (
      <HandbookManagerPage
        title={selectedItem.title}
        parts={itemParts}
        onBack={() => setSelectedItem(null)}
        item={selectedItem}
      />
    )
  }

  const filtered = libraryItems.filter(item => {
    if (search.trim() && !item.title.toLowerCase().includes(search.toLowerCase())) return false
    if (countryFilter !== 'all') {
      if (item.scope === 'country' && !(item.countries || []).includes(countryFilter)) return false
    }
    return true
  })

  const publishedCount = libraryItems.filter(i => i.status === 'published').length
  const draftCount = libraryItems.filter(i => i.status === 'draft').length

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Knowledge Library</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage knowledge centre content</p>
        </div>
        <Button className="gap-1.5" onClick={() => setCreateModalOpen(true)}>
          <Plus className="size-4" />
          Add Content
        </Button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Total items</span>
          <span className="font-semibold text-foreground">{LIBRARY_ITEMS.length}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">Published</span>
          <span className="font-semibold text-foreground">{publishedCount}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="size-2 rounded-full bg-gray-400" />
          <span className="text-muted-foreground">Draft</span>
          <span className="font-semibold text-foreground">{draftCount}</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="pl-9"
          />
        </div>
        <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)} className="h-9 rounded-md border border-border bg-white px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring">
          <option value="all">All Countries</option>
          {HANDBOOK_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quiz:</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(item => {
              const category = item.skills?.[0] ? (LIBRARY_SKILL_TO_CATEGORY[item.skills[0]] || item.skills[0]) : '—'
              return (
                <TableRow key={item.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setSelectedItem(item)}>
                  <TableCell className="pl-5 font-medium text-brand-700 hover:underline">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant={`content-${item.type}`}>
                      {LIBRARY_TYPE_LABELS[item.type] || item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{category}</TableCell>
                  <TableCell>
                    {item.scope === 'global' ? (
                      <span className="text-sm text-muted-foreground">Global</span>
                    ) : (
                      <span className="text-sm text-muted-foreground" title={(item.countries || []).join(', ')}>
                        {(item.countries || []).length} {(item.countries || []).length === 1 ? 'country' : 'countries'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.source}</TableCell>
                  <TableCell>
                    {item.status === 'published' ? (
                      <Badge variant="status-published">
                        <img src="/solid-check.svg" alt="" className="size-3" /> Published
                      </Badge>
                    ) : (
                      <Badge variant="status-draft">
                        <CircleDashed className="size-3.5 text-gray-400" /> Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {(item.quizCount || 0) > 0 ? (
                      <span className="inline-flex items-center justify-center size-5 rounded-full bg-muted text-[11px] font-medium text-foreground">
                        {item.quizCount}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.updated}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="size-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="size-4 mr-2" /> View
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No items match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Content Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setCreateModalOpen(false); resetCreateForm() }} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[640px] max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0">
              <h2 className="text-lg font-semibold text-foreground">Add Content</h2>
              <button onClick={() => { setCreateModalOpen(false); resetCreateForm() }} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Section: General */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">General</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">Title</label>
                    <Input value={createTitle} onChange={e => setCreateTitle(e.target.value)} placeholder="Enter content title" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Category</label>
                    <select value={createCategory} onChange={e => setCreateCategory(e.target.value)} className="w-full h-9 rounded-md border border-border bg-white px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring">
                      <option value="">Select category</option>
                      {METADATA_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Content Type</label>
                    <select value={createType} onChange={e => setCreateType(e.target.value)} className="w-full h-9 rounded-md border border-border bg-white px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring">
                      {METADATA_TYPES.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
                    </select>
                  </div>
                  {createType === 'external' && (
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs font-medium text-muted-foreground">External URL</label>
                      <Input value={createExternalUrl} onChange={e => setCreateExternalUrl(e.target.value)} placeholder="https://..." className="h-9 text-sm" />
                    </div>
                  )}
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">Skills</label>
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input value={createSkillSearch} onChange={e => setCreateSkillSearch(e.target.value)} placeholder="Search skills..." className="pl-9 h-9 text-sm" />
                      </div>
                      {createSkillSearch.trim() && (
                        <div className="border border-border rounded-md bg-white max-h-[140px] overflow-y-auto">
                          {METADATA_SKILLS.filter(s => s.toLowerCase().includes(createSkillSearch.toLowerCase()) && !createSkills.includes(s)).map(s => (
                            <button key={s} onClick={() => { setCreateSkills(prev => [...prev, s]); setCreateSkillSearch('') }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/30 transition-colors text-left">
                              {s}
                            </button>
                          ))}
                          {METADATA_SKILLS.filter(s => s.toLowerCase().includes(createSkillSearch.toLowerCase()) && !createSkills.includes(s)).length === 0 && (
                            <p className="px-3 py-2 text-xs text-muted-foreground">No matching skills</p>
                          )}
                        </div>
                      )}
                      {createSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {createSkills.map(s => (
                            <span key={s} className="inline-flex items-center gap-1 text-xs font-medium text-foreground bg-muted rounded-full px-2 h-6">
                              {s}
                              <X className="size-3 text-muted-foreground cursor-pointer" onClick={() => setCreateSkills(prev => prev.filter(x => x !== s))} />
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/40" />

              {/* Section: Time & CPD */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">Time & CPD</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Estimated Time</label>
                    <Input value={createEstimatedTime} onChange={e => setCreateEstimatedTime(e.target.value)} placeholder="e.g. 2.5 hrs" className="h-9 text-sm" />
                  </div>
                  <div />
                  <div className="flex items-center justify-between col-span-2">
                    <div>
                      <label className="text-sm font-medium text-foreground">CPD Relevant</label>
                      <p className="text-xs text-muted-foreground">Enable to assign CPD points to this content</p>
                    </div>
                    <Switch checked={createCpdRelevant} onCheckedChange={setCreateCpdRelevant} />
                  </div>
                  {createCpdRelevant && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">CPD Points</label>
                      <Input type="number" value={createCpdPoints} onChange={e => setCreateCpdPoints(e.target.value)} className="h-9 text-sm" />
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-border/40" />

              {/* Section: Geographic Scope */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">Geographic Scope</p>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Scope</label>
                    <select value={createScope} onChange={e => { setCreateScope(e.target.value); if (e.target.value === 'global') setCreateCountries([]) }} className="w-full h-9 rounded-md border border-border bg-white px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring">
                      <option value="global">Global — Applies to all countries</option>
                      <option value="country">Country Specific — Select applicable countries</option>
                    </select>
                  </div>
                  {createScope === 'country' && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Countries</label>
                        <div className="relative">
                          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                          <Input value={createCountrySearch} onChange={e => setCreateCountrySearch(e.target.value)} placeholder="Search countries..." className="pl-9 h-9 text-sm" />
                        </div>
                      </div>
                      {createCountrySearch.trim() && (
                        <div className="border border-border rounded-md bg-white max-h-[140px] overflow-y-auto">
                          {HANDBOOK_COUNTRIES.filter(c => c.toLowerCase().includes(createCountrySearch.toLowerCase()) && !createCountries.includes(c)).map(c => (
                            <button key={c} onClick={() => { setCreateCountries(prev => [...prev, c]); setCreateCountrySearch('') }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/30 transition-colors text-left">
                              {c}
                            </button>
                          ))}
                          {HANDBOOK_COUNTRIES.filter(c => c.toLowerCase().includes(createCountrySearch.toLowerCase()) && !createCountries.includes(c)).length === 0 && (
                            <p className="px-3 py-2 text-xs text-muted-foreground">No matching countries</p>
                          )}
                        </div>
                      )}
                      {createCountries.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {createCountries.map(c => (
                            <span key={c} className="inline-flex items-center gap-1 text-xs font-medium text-foreground bg-muted rounded-full px-2 h-6">
                              {c}
                              <X className="size-3 text-muted-foreground cursor-pointer" onClick={() => setCreateCountries(prev => prev.filter(n => n !== c))} />
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-border/40" />

              {/* Section: Visibility & Access */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">Visibility & Access</p>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Visibility</label>
                    <select value={createVisibility} onChange={e => setCreateVisibility(e.target.value)} className="w-full h-9 rounded-md border border-border bg-white px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring">
                      <option value="global">Global — All organisations</option>
                      <option value="assigned">Assigned — Specific organisations</option>
                    </select>
                  </div>
                  {createVisibility === 'assigned' && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Assigned Organisations</label>
                        <div className="relative">
                          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                          <Input value={createOrgSearch} onChange={e => setCreateOrgSearch(e.target.value)} placeholder="Search organisations..." className="pl-9 h-9 text-sm" />
                        </div>
                      </div>
                      {createOrgSearch.trim() && (
                        <div className="border border-border rounded-md bg-white max-h-[140px] overflow-y-auto">
                          {mockOrganisations.filter(o => o.name.toLowerCase().includes(createOrgSearch.toLowerCase()) && !createAssignedOrgs.includes(o.name)).map(org => (
                            <button key={org.id} onClick={() => { setCreateAssignedOrgs(prev => [...prev, org.name]); setCreateOrgSearch('') }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/30 transition-colors text-left">
                              <Building2 className="size-3.5 text-muted-foreground" />
                              {org.name}
                            </button>
                          ))}
                          {mockOrganisations.filter(o => o.name.toLowerCase().includes(createOrgSearch.toLowerCase()) && !createAssignedOrgs.includes(o.name)).length === 0 && (
                            <p className="px-3 py-2 text-xs text-muted-foreground">No matching organisations</p>
                          )}
                        </div>
                      )}
                      {createAssignedOrgs.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {createAssignedOrgs.map(name => (
                            <span key={name} className="inline-flex items-center gap-1 text-xs font-medium text-foreground bg-muted rounded-full px-2 h-6">
                              {name}
                              <X className="size-3 text-muted-foreground cursor-pointer" onClick={() => setCreateAssignedOrgs(prev => prev.filter(n => n !== name))} />
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border/60 shrink-0 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => { setCreateModalOpen(false); resetCreateForm() }}>Cancel</Button>
              <Button onClick={handleCreateContent} disabled={!createTitle.trim()}>Create Content</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const CONTENT_PAGES = ['Knowledge Library', 'Resource Library', 'Learning Journeys', 'CPD Events', 'CPD Regimes', 'Skills Framework', 'Talent']

// Flatten all subgroups for child sidebar lookup
const allSubgroups = navGroups.flatMap(g => g.subgroups || [])

function EthikaChildSidebar({ activePage }) {
  const navigate = useNavigate()

  const activeSubgroup = allSubgroups.find(sg =>
    sg.items.some(i => activePage === i.page)
  )

  if (!activeSubgroup || activeSubgroup.items.length < 1) return null

  return (
    <div className="w-[220px] shrink-0 border-r border-border/60 bg-white overflow-y-auto py-4 px-3">
      <p className="text-[13px] font-medium text-foreground px-2 mb-3">{activeSubgroup.label}</p>
      <nav className="space-y-0.5">
        {activeSubgroup.items.map((item) => {
          const isActive = activePage === item.page
          return (
            <button
              key={item.title}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                isActive
                  ? 'bg-sidebar-accent font-medium text-foreground'
                  : 'text-foreground/60 hover:text-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              {item.title}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default function EthikaAdminPage({ onLogout }) {
  const { pathname } = useLocation()
  const activePage = ETHIKA_PATH_TO_PAGE[pathname] || 'Organisations'
  const isContentPage = CONTENT_PAGES.includes(activePage)

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-sidebar">
          <EthikaAdminSidebar onLogout={onLogout} />

          <div className="flex flex-1 flex-col overflow-hidden p-2">
            <div className="flex flex-1 overflow-hidden rounded-lg border border-[#E2E8F0]">
              <EthikaChildSidebar activePage={activePage} />
              <main className={`flex-1 overflow-auto p-6 ${isContentPage ? 'bg-white' : 'bg-background'}`}>
              {activePage === 'Organisations' && <OrganisationsPage />}
              {activePage === 'Users' && <UsersPage />}
              {activePage === 'Knowledge Library' && <KnowledgeLibraryPage />}
              {activePage === 'Resource Library' && <EthikaAdminResourceLibraryPage />}
              {activePage === 'Learning Journeys' && <EthikaAdminJourneysPage />}
              {activePage === 'CPD Events' && <EthikaAdminCPDPage />}
              {activePage === 'CPD Regimes' && <EthikaAdminRegimesPage />}
              {activePage === 'Skills Framework' && <EthikaAdminSkillsFrameworkPage />}
              {activePage === 'Talent' && <EthikaAdminTalentPage />}
            </main>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
