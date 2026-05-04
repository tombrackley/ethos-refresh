import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  BookOpen, Video, Users, Award, MoreHorizontal, Pencil, Trash2, ChevronDown,
  ExternalLink, Link2, CalendarPlus, MapPin, Calendar, Clock, X,
  Eye, EyeOff, CircleDashed, ChevronLeft, ChevronRight, LayoutList, CalendarDays,
  UserMinus, ArrowUpCircle, Shield,
} from 'lucide-react'

// ─── Constants ──────────────────────────────────────────────────────────────

const CPD_ACTIVITY_TYPES = {
  course:        { icon: BookOpen, label: 'Course', iconColor: 'bg-blue-50 text-blue-700', badge: 'bg-blue-50 text-blue-900 border-blue-200' },
  webinar:       { icon: Video, label: 'Webinar', iconColor: 'bg-purple-50 text-purple-700', badge: 'bg-purple-50 text-purple-900 border-purple-200' },
  workshop:      { icon: Users, label: 'Workshop', iconColor: 'bg-amber-50 text-amber-700', badge: 'bg-amber-50 text-amber-900 border-amber-200' },
  certification: { icon: Award, label: 'Certification', iconColor: 'bg-cyan-50 text-cyan-700', badge: 'bg-cyan-50 text-cyan-900 border-cyan-200' },
}

const ACTIVITY_TYPE_OPTIONS = ['course', 'webinar', 'workshop', 'certification']

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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

// ─── Mock Data ──────────────────────────────────────────────────────────────

const INITIAL_ORG_EVENTS = [
  { id: 1, title: 'ESG Reporting & Disclosure Workshop', type: 'workshop', date: '2026-04-15', time: '09:00 – 12:00', location: 'Level 12, 100 Market St, Sydney', provider: 'Governance Institute', cpdHours: 3, capacity: 30, registered: 12, isEthika: true, status: 'Published', description: 'Hands-on workshop covering AASB S1/S2 disclosure requirements and practical ESG reporting frameworks.', regimes: ['law-society-nsw', 'governance-institute'] },
  { id: 2, title: 'Privacy Act Amendments 2026', type: 'webinar', date: '2026-04-22', time: '13:00 – 14:30', location: 'Online (Teams)', provider: 'OAIC', cpdHours: 1.5, capacity: 100, registered: 34, isEthika: true, status: 'Published', description: 'Overview of the latest Privacy Act amendments and their impact on data handling obligations.', regimes: ['law-society-nsw'] },
  { id: 3, title: 'Anti-Money Laundering Advanced Certification', type: 'certification', date: '2026-05-10', time: '09:00 – 17:00', location: 'Level 5, 200 George St, Sydney', provider: 'ACAMS', cpdHours: 8, capacity: 20, registered: 20, waitlistCount: 4, isEthika: true, status: 'Published', description: 'Full-day certification program for advanced AML compliance practitioners.', regimes: ['law-society-nsw', 'cpa-australia'] },
  { id: 4, title: 'Contract Negotiation Masterclass', type: 'course', date: '2026-05-20', time: '10:00 – 15:00', location: 'Online (Zoom)', provider: 'Internal', cpdHours: 4, capacity: 50, registered: 0, isEthika: true, status: 'Draft', description: 'Advanced strategies for complex commercial contract negotiations.', regimes: ['law-society-nsw'] },
  { id: 5, title: 'Modern Slavery & Supply Chain Due Diligence', type: 'workshop', date: '2026-04-16', time: '13:00 – 15:00', location: 'Board Room 1', provider: 'Law Society NSW', cpdHours: 2, isEthika: false, registrationUrl: 'https://www.lawsociety.com.au/cpd/events/modern-slavery-due-diligence', externalDisclaimer: 'This event is organised and managed by Law Society NSW. Ethika is not responsible for event content, scheduling, or attendance tracking.', status: 'Published', description: 'Understand Modern Slavery Act reporting obligations, supply chain risk assessment methodologies, and practical due diligence frameworks.', regimes: ['law-society-nsw'] },
]

const TEAM_MEMBERS = [
  { id: 1, name: 'Sarah Chen', email: 'sarah@blackmores.com', initials: 'SC', role: 'Senior Lawyer' },
  { id: 2, name: 'James Harrington', email: 'james@blackmores.com', initials: 'JH', role: 'General Counsel' },
  { id: 3, name: 'Priya Patel', email: 'priya@blackmores.com', initials: 'PP', role: 'Compliance Officer' },
  { id: 4, name: 'Michael Torres', email: 'michael@blackmores.com', initials: 'MT', role: 'Junior Lawyer' },
  { id: 5, name: 'Emily Watson', email: 'emily@blackmores.com', initials: 'EW', role: 'HR Manager' },
  { id: 6, name: 'David Kim', email: 'david@blackmores.com', initials: 'DK', role: 'Finance Manager' },
  { id: 7, name: 'Rachel Adams', email: 'rachel@blackmores.com', initials: 'RA', role: 'Company Secretary' },
  { id: 8, name: 'Tom Bradley', email: 'tom@email.com', initials: 'TB', role: 'Board Member' },
  { id: 9, name: 'Aisha Mohammed', email: 'aisha@blackmores.com', initials: 'AM', role: 'Senior Lawyer' },
  { id: 10, name: 'Liam O\'Brien', email: 'liam@blackmores.com', initials: 'LO', role: 'Junior Lawyer' },
]

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdminCPDEventsPage() {
  const [events, setEvents] = useState(INITIAL_ORG_EVENTS)
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
            <TableHead>Status</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {eventList.map(ev => {
            const typeInfo = CPD_ACTIVITY_TYPES[ev.type]
            const Icon = typeInfo.icon
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
              <TableCell colSpan={5} className="text-center py-8">
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
            <p className="text-sm text-muted-foreground mt-0.5">Create and manage professional development events for your organisation.</p>
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
        <OrgEventFormOverlay
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
        <OrgEventParticipantsOverlay
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

// ─── Event Calendar ─────────────────────────────────────────────────────────

function EventCalendar({ events, onEditEvent }) {
  const [currentDate, setCurrentDate] = useState(() => new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = lastDay.getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToday = () => setCurrentDate(new Date())

  const todayStr = new Date().toISOString().split('T')[0]

  const eventsByDate = {}
  events.forEach(ev => {
    if (!eventsByDate[ev.date]) eventsByDate[ev.date] = []
    eventsByDate[ev.date].push(ev)
  })

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

      <div className="grid grid-cols-7 border-b border-border/60">
        {WEEKDAYS.map(day => (
          <div key={day} className="py-2 text-center text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>

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

// ─── Event Form Overlay (Org-level) ─────────────────────────────────────────

function OrgEventFormOverlay({ event, onClose, onSave }) {
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
    isEthika: event?.isEthika ?? true,
    registrationUrl: event?.registrationUrl ?? '',
  })
  const [selectedRegimes, setSelectedRegimes] = useState(event?.regimes ?? [])

  const isValid = form.title && form.type && form.date && form.cpdHours && form.provider

  const handleSave = () => {
    onSave({
      ...form,
      cpdHours: Number(form.cpdHours),
      capacity: form.isEthika ? (Number(form.capacity) || 0) : undefined,
      registered: form.isEthika ? (event?.registered ?? 0) : undefined,
      regimes: selectedRegimes,
      isEthika: form.isEthika,
      registrationUrl: form.isEthika ? undefined : form.registrationUrl,
      externalDisclaimer: form.isEthika ? undefined : `This event is organised and managed by ${form.provider || 'the external provider'}. Ethika is not responsible for event content, scheduling, or attendance tracking.`,
    })
  }

  const toggleRegime = (regimeId) => {
    setSelectedRegimes(prev =>
      prev.includes(regimeId) ? prev.filter(r => r !== regimeId) : [...prev, regimeId]
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl border border-border shadow-xl w-full max-w-[700px] max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold text-foreground">{event ? 'Edit Event' : 'Create CPD Event'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-5" />
          </button>
        </div>

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
                  name="orgEventSource"
                  checked={form.isEthika}
                  onChange={() => setForm({ ...form, isEthika: true })}
                  className="accent-brand-800"
                />
                Internal
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="orgEventSource"
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
                <Input value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })} placeholder="e.g. Internal" className="h-9" />
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

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Status</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="orgEventStatus"
                  checked={form.status === 'Draft'}
                  onChange={() => setForm({ ...form, status: 'Draft' })}
                  className="accent-brand-800"
                />
                Draft
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="orgEventStatus"
                  checked={form.status === 'Published'}
                  onChange={() => setForm({ ...form, status: 'Published' })}
                  className="accent-brand-800"
                />
                Published
              </label>
            </div>
          </div>
        </div>

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

// ─── Participants ───────────────────────────────────────────────────────────

function generateOrgParticipants(event) {
  if (!event || event.isEthika === false) return { registered: [], waitlisted: [] }
  const registeredPool = TEAM_MEMBERS.map(m => ({
    id: m.id,
    name: m.name,
    email: m.email,
    role: m.role,
    initials: m.initials,
    date: '2026-03-' + String(m.id + 4).padStart(2, '0'),
  }))
  const waitlistPool = [
    { id: 101, name: 'Hannah Brooks', email: 'hannah.b@blackmores.com', role: 'Paralegal', initials: 'HB', date: '2026-03-15' },
    { id: 102, name: 'Chris Tanaka', email: 'chris.t@blackmores.com', role: 'Risk Analyst', initials: 'CT', date: '2026-03-16' },
    { id: 103, name: 'Megan Russo', email: 'megan.r@blackmores.com', role: 'Compliance Analyst', initials: 'MR', date: '2026-03-16' },
    { id: 104, name: 'Jack Henderson', email: 'jack.h@blackmores.com', role: 'Associate', initials: 'JH', date: '2026-03-17' },
  ]
  const regCount = Math.min(event.registered || 0, registeredPool.length)
  const waitCount = Math.min(event.waitlistCount || 0, waitlistPool.length)
  return {
    registered: registeredPool.slice(0, regCount),
    waitlisted: waitlistPool.slice(0, waitCount),
  }
}

const PARTICIPANT_TAB = "h-8 rounded-full text-sm px-3 py-1.5 gap-1.5 border border-transparent data-[state=active]:bg-[#153e40] data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:text-[#153e40] data-[state=inactive]:bg-[#f5f5f5]"

function OrgEventParticipantsOverlay({ event, onClose, onUpdateEvent }) {
  const [participants, setParticipants] = useState(() => generateOrgParticipants(event))
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
                        <TableHead className="text-xs font-medium text-muted-foreground">Team Member</TableHead>
                        <TableHead className="text-xs font-medium text-muted-foreground">Role</TableHead>
                        <TableHead className="text-xs font-medium text-muted-foreground">Registered</TableHead>
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participants.registered.map(p => (
                        <TableRow key={p.id} className="hover:bg-muted/20">
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <Avatar className="size-7">
                                <AvatarFallback className="bg-brand-100 text-brand-800 text-[10px] font-semibold">{p.initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-foreground">{p.name}</p>
                                <p className="text-xs text-muted-foreground">{p.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{p.role}</TableCell>
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
                        <TableHead className="text-xs font-medium text-muted-foreground">Team Member</TableHead>
                        <TableHead className="text-xs font-medium text-muted-foreground">Role</TableHead>
                        <TableHead className="text-xs font-medium text-muted-foreground">Position</TableHead>
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participants.waitlisted.map((p, idx) => (
                        <TableRow key={p.id} className="hover:bg-muted/20">
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <Avatar className="size-7">
                                <AvatarFallback className="bg-brand-100 text-brand-800 text-[10px] font-semibold">{p.initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-foreground">{p.name}</p>
                                <p className="text-xs text-muted-foreground">{p.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{p.role}</TableCell>
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

        <div className="flex items-center gap-2 px-6 py-4 border-t border-border shrink-0">
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}
