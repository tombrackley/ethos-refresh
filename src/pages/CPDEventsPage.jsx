import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ArrowLeft, Calendar, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  Clock, Download, MapPin, Building2, Tag, ExternalLink, Search, Sparkles, X, List, CalendarDays,
  AlertTriangle, Users, Shield, Award,
} from 'lucide-react'
import tenant, { getCategoryBadgeVariant } from '@/config/tenant'

// ─── Tenant Data ─────────────────────────────────────────────────────────────

const t = tenant.pages.learn
const UPCOMING_WORKSHOPS = t.upcomingWorkshops
const SUGGESTED_WORKSHOPS = t.suggestedWorkshops
const COMPLETED_AREAS = t.completedAreas

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTH_MAP = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 }
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function getEventDate(w) {
  if (w.month && w.day && w.year) {
    return new Date(parseInt(w.year), MONTH_MAP[w.month.toUpperCase()] ?? 0, parseInt(w.day))
  }
  if (w.completedDate) {
    return new Date(w.completedDate)
  }
  return new Date()
}

function formatMonthDay(w) {
  if (w.month && w.day) {
    return `${w.month.charAt(0)}${w.month.slice(1).toLowerCase()} ${w.day}`
  }
  return w.completedDate || ''
}

// ─── Certificate Generator ──────────────────────────────────────────────────

function downloadCertificate(event) {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 850
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 1200, 850)

  // Border
  ctx.strokeStyle = '#153E40'
  ctx.lineWidth = 3
  ctx.strokeRect(40, 40, 1120, 770)

  // Inner border
  ctx.strokeStyle = '#d4d4d4'
  ctx.lineWidth = 1
  ctx.strokeRect(52, 52, 1096, 746)

  // Decorative corner accents
  const accentSize = 30
  ctx.strokeStyle = '#153E40'
  ctx.lineWidth = 2
  const corners = [[52, 52], [1148, 52], [52, 798], [1148, 798]]
  corners.forEach(([cx, cy]) => {
    ctx.beginPath()
    ctx.moveTo(cx === 52 ? cx : cx - accentSize, cy)
    ctx.lineTo(cx, cy)
    ctx.lineTo(cx, cy === 52 ? cy + accentSize : cy - accentSize)
    ctx.stroke()
  })

  // "CERTIFICATE OF COMPLETION" header
  ctx.fillStyle = '#9ca3af'
  ctx.font = '600 13px Inter, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.letterSpacing = '6px'
  ctx.fillText('CERTIFICATE OF COMPLETION', 600, 140)

  // Divider line
  ctx.strokeStyle = '#153E40'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(480, 160)
  ctx.lineTo(720, 160)
  ctx.stroke()

  // "This certifies that"
  ctx.fillStyle = '#6b7280'
  ctx.font = '400 16px Inter, system-ui, sans-serif'
  ctx.letterSpacing = '0px'
  ctx.fillText('This certifies that', 600, 200)

  // Name
  ctx.fillStyle = '#153E40'
  ctx.font = '600 36px Inter, system-ui, sans-serif'
  ctx.fillText('Tom Bradley', 600, 260)

  // "has successfully completed"
  ctx.fillStyle = '#6b7280'
  ctx.font = '400 16px Inter, system-ui, sans-serif'
  ctx.fillText('has successfully completed', 600, 310)

  // Course title
  ctx.fillStyle = '#0a0a0a'
  ctx.font = '600 26px Inter, system-ui, sans-serif'
  const title = event.title || event.label
  // Word wrap if needed
  if (ctx.measureText(title).width > 900) {
    const words = title.split(' ')
    let line1 = ''
    let line2 = ''
    let onLine1 = true
    words.forEach(w => {
      const test = onLine1 ? line1 + (line1 ? ' ' : '') + w : line2 + (line2 ? ' ' : '') + w
      if (onLine1 && ctx.measureText(test).width > 900) {
        onLine1 = false
        line2 = w
      } else if (onLine1) {
        line1 = test
      } else {
        line2 = test
      }
    })
    ctx.fillText(line1, 600, 370)
    ctx.fillText(line2, 600, 410)
  } else {
    ctx.fillText(title, 600, 380)
  }

  // Details line
  ctx.fillStyle = '#6b7280'
  ctx.font = '400 15px Inter, system-ui, sans-serif'
  const categories = event.categories || (event.category ? [event.category] : [])
  const details = [
    event.cpdPoints || event.hours ? `${event.cpdPoints || event.hours} CPD Points` : null,
    categories.length > 0 ? categories.join(', ') : null,
    event.completedDate ? `Completed ${event.completedDate}` : null,
  ].filter(Boolean).join('  ·  ')
  ctx.fillText(details, 600, 440)

  // Divider
  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(300, 480)
  ctx.lineTo(900, 480)
  ctx.stroke()

  // Regimes
  const regimes = (event.regimes || []).map(r => r.replace(/-/g, ' ').toUpperCase())
  if (regimes.length > 0) {
    ctx.fillStyle = '#9ca3af'
    ctx.font = '400 13px Inter, system-ui, sans-serif'
    ctx.fillText(`Recognised by: ${regimes.join(', ')}`, 600, 520)
  }

  // Footer area
  // Left: Ethika Ethos
  ctx.fillStyle = '#153E40'
  ctx.font = '600 18px Inter, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Ethika Ethos', 100, 720)

  ctx.fillStyle = '#9ca3af'
  ctx.font = '400 12px Inter, system-ui, sans-serif'
  ctx.fillText('Professional Development Platform', 100, 740)

  // Right: Certificate ID
  ctx.textAlign = 'right'
  ctx.fillStyle = '#9ca3af'
  ctx.font = '400 12px Inter, system-ui, sans-serif'
  const certId = `CERT-${String(event.id).padStart(4, '0')}-${(event.completedDate || '').replace(/\s/g, '').slice(0, 7).toUpperCase()}`
  ctx.fillText(certId, 1100, 720)
  ctx.fillText(`Issued: ${event.completedDate || 'N/A'}`, 1100, 740)

  // Download
  const link = document.createElement('a')
  link.download = `${(title || 'Certificate').replace(/[^a-zA-Z0-9]/g, '_')}_Certificate.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

// ─── Build event lists ───────────────────────────────────────────────────────

function buildUpcomingEvents() {
  return UPCOMING_WORKSHOPS.map(w => ({ ...w, _type: w.status === 'Booked' ? 'booked' : 'upcoming' }))
}

function buildSuggestedEvents() {
  return SUGGESTED_WORKSHOPS.map(w => ({ ...w, _type: 'suggested' }))
}

function buildCompletedEvents() {
  return COMPLETED_AREAS.map(w => ({
    ...w,
    title: w.label,
    _type: 'completed',
    cpdPoints: w.cpdPoints || w.hours,
  }))
}

// ─── Event Detail Overlay ────────────────────────────────────────────────────

function EventDetailOverlay({ event, enrolled, waitlisted, returnPromptEvent, onClose, onEnrol, onDeEnrol, onJoinWaitlist, onLeaveWaitlist, onRegisterExternal, onConfirmExternal, onDismissReturnPrompt }) {
  const isCompleted = event._type === 'completed'
  const isRecommended = event._type === 'suggested'
  const isExternal = !event.isEthika && event.registrationUrl
  const isFull = event.isEthika && event.capacity && event.registered >= event.capacity
  const spotsLeft = event.isEthika && event.capacity ? Math.max(0, event.capacity - event.registered) : null

  const dateDisplay = event.month
    ? `${event.month.charAt(0) + event.month.slice(1).toLowerCase()} ${parseInt(event.day, 10)}, ${event.year}`
    : event.completedDate || null

  const eventCategories = event.categories || (event.category ? [event.category] : [])
  const eventRegimes = event.regimes || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl border border-border shadow-xl w-full max-w-[700px] max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold text-foreground pr-4 leading-snug">{event.title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-6 py-5 space-y-5">
          {/* Return prompt — shown when user comes back from external registration */}
          {returnPromptEvent && returnPromptEvent.id === event.id && (
            <div className="flex items-start gap-3 rounded-lg border border-brand-200 bg-brand-50/60 px-4 py-3.5">
              <CheckCircle2 className="size-5 text-brand-600 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-brand-900">Did you register for this event?</p>
                <p className="text-xs text-brand-700">Add it to your upcoming CPD events so you can track your attendance and points.</p>
                <div className="flex items-center gap-2 pt-0.5">
                  <Button size="sm" className="h-7 text-xs" onClick={() => onConfirmExternal(event)}>
                    Yes, add to upcoming
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={onDismissReturnPrompt}>
                    Not yet
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* External event disclaimer */}
          {!isCompleted && !event.isEthika && event.registrationUrl && event.externalDisclaimer && (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/60 px-3.5 py-3">
              <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">{event.externalDisclaimer}</p>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {isCompleted && (
              <span className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-sm font-medium ${event.badge === 'Certified' ? 'border border-brand-200 bg-brand-50 text-brand-700' : 'border border-[#a7f3d0] bg-[#ecfdf5] text-[#153e40]'}`}>
                <CheckCircle2 className="size-3.5" /> {event.badge}
              </span>
            )}
            {!isCompleted && waitlisted && (
              <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-amber-200 bg-amber-50 text-sm font-medium text-amber-700">
                <Clock className="size-3.5" /> On Waitlist
              </span>
            )}
            {!isCompleted && enrolled && !waitlisted && (
              <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-[#a7f3d0] bg-[#ecfdf5] text-sm font-medium text-[#153e40]">
                <CheckCircle2 className="size-3.5" /> Enrolled
              </span>
            )}
            {isRecommended && event.matchScore && (
              <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-purple-200 bg-purple-50 text-sm font-medium text-purple-700">
                <Sparkles className="size-3.5" /> {event.matchScore}% match
              </span>
            )}
            {event.type && (
              <span className="inline-flex items-center h-7 px-2.5 rounded-md border border-[#e5e7eb] bg-[#f9fafb] text-sm font-medium text-[#374151]">
                {event.type}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {dateDisplay && (
              <div className="flex items-center gap-3">
                <Calendar className="size-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground">{dateDisplay}</span>
              </div>
            )}
            {event.time && (
              <div className="flex items-center gap-3">
                <Clock className="size-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground">{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground">{event.location}</span>
              </div>
            )}
            {event.provider && (
              <div className="flex items-center gap-3">
                <Building2 className="size-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground">{event.provider}</span>
              </div>
            )}
            {eventCategories.length > 0 && (
              <div className="flex items-start gap-3">
                <Tag className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex items-center gap-1.5 flex-wrap">
                  {eventCategories.map(cat => (
                    <Badge key={cat} variant={getCategoryBadgeVariant(cat)}>{cat}</Badge>
                  ))}
                </div>
              </div>
            )}
            {eventRegimes.length > 0 && (
              <div className="flex items-center gap-3">
                <Shield className="size-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground">{eventRegimes.map(r => r.replace(/-/g, ' ')).join(', ')}</span>
              </div>
            )}
            {event.isEthika && event.capacity && (
              <div className="flex items-center gap-3">
                <Users className="size-4 text-muted-foreground shrink-0" />
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-foreground">{event.registered}/{event.capacity} registered</span>
                  {spotsLeft > 0 && spotsLeft <= 10 && (
                    <span className="text-xs text-amber-600 font-medium">{spotsLeft} spots left</span>
                  )}
                  {isFull && event.waitlistCount > 0 && (
                    <span className="text-xs text-red-600 font-medium">Full · {event.waitlistCount} on waitlist</span>
                  )}
                  {isFull && !event.waitlistCount && (
                    <span className="text-xs text-red-600 font-medium">Full</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {event.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
          )}

          <Separator />

          <div className="rounded-lg border border-purple-200 bg-purple-50/60 px-4 py-3.5 space-y-2.5">
            <p className="text-sm font-medium text-purple-900 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-purple-500" />
              {isCompleted ? 'What was achieved' : 'What you\'ll achieve'}
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                <span className="text-sm text-purple-900">{event.cpdPoints ?? event.cpdHours ?? event.hours} CPD points toward your requirements</span>
              </li>
              {eventCategories.length > 0 && (
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-purple-900">Counts toward <span className="font-medium">{eventCategories.join(', ')}</span></span>
                </li>
              )}
              {eventRegimes.length > 0 && (
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-purple-900">Recognised by {eventRegimes.map(r => r.replace(/-/g, ' ').toUpperCase()).join(', ')}</span>
                </li>
              )}
              {isRecommended && event.relevance && (
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-purple-900">{event.relevance}</span>
                </li>
              )}
              {event.type && (
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-purple-900">{event.type} completion certificate</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-2 px-6 py-4 border-t border-border shrink-0">
          {isCompleted ? (
            <>
              <Button size="sm" className="gap-1.5" onClick={() => downloadCertificate(event)}>
                <Download className="size-3.5" /> Download Certificate
              </Button>
              <div className="flex-1" />
              <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            </>
          ) : waitlisted ? (
            <>
              <Button variant="secondary" size="sm" onClick={() => { onLeaveWaitlist(); onClose() }}>
                Leave Waitlist
              </Button>
              <div className="flex-1" />
              <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            </>
          ) : enrolled ? (
            <>
              <Button variant="secondary" size="sm" onClick={() => { onDeEnrol(); onClose() }}>
                De-enrol
              </Button>
              <div className="flex-1" />
              <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            </>
          ) : isFull ? (
            <>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { onJoinWaitlist(); onClose() }}>
                <Users className="size-3.5" /> Join Waitlist
              </Button>
              <div className="flex-1" />
              <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            </>
          ) : isExternal ? (
            <>
              <Button size="sm" className="gap-1.5" onClick={() => onRegisterExternal(event)}>
                <ExternalLink className="size-3.5" /> Register on {event.provider}
              </Button>
              <div className="flex-1" />
              <p className="text-xs text-muted-foreground">Registration is handled by the external provider</p>
            </>
          ) : (
            <>
              <Button size="sm" onClick={() => { onEnrol(); onClose() }}>
                Enrol
              </Button>
              <div className="flex-1" />
              <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Calendar View ───────────────────────────────────────────────────────────

function CalendarView({ events, onEventClick }) {
  const [calendarDate, setCalendarDate] = useState(() => new Date(2026, 2, 1)) // March 2026

  const year = calendarDate.getFullYear()
  const month = calendarDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7 // Monday-start

  const today = new Date()
  const isToday = (d) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === d

  const eventsByDay = useMemo(() => {
    const calYear = calendarDate.getFullYear()
    const calMonth = calendarDate.getMonth()
    const map = {}
    events.forEach(ev => {
      const d = getEventDate(ev)
      if (d.getFullYear() === calYear && d.getMonth() === calMonth) {
        const day = d.getDate()
        if (!map[day]) map[day] = []
        map[day].push(ev)
      }
    })
    return map
  }, [events, calendarDate])

  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setCalendarDate(new Date(year, month - 1, 1))}>
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-sm font-semibold text-foreground">{MONTH_NAMES[month]} {year}</span>
        <Button variant="ghost" size="sm" onClick={() => setCalendarDate(new Date(year, month + 1, 1))}>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <span key={d} className="text-xs font-medium text-muted-foreground py-2">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {blanks.map(i => <div key={`blank-${i}`} className="min-h-[80px]" />)}
        {days.map(day => {
          const dayEvents = eventsByDay[day] || []
          return (
            <div
              key={day}
              className={`min-h-[80px] rounded-[8px] border p-1.5 ${isToday(day) ? 'border-brand-300 bg-brand-50/30' : 'border-[#ecf2f5] bg-white'} ${dayEvents.length > 0 ? 'cursor-pointer hover:bg-muted/20' : ''}`}
            >
              <span className={`text-xs font-medium block mb-1 ${isToday(day) ? 'text-brand-700' : 'text-muted-foreground'}`}>{day}</span>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 2).map(ev => (
                  <div
                    key={ev.id}
                    onClick={() => onEventClick(ev)}
                    className={`text-xs leading-tight px-1 py-0.5 rounded truncate cursor-pointer ${
                      ev._type === 'completed' ? 'bg-brand-50 text-brand-700' :
                      ev._type === 'suggested' ? 'bg-indigo-50 text-indigo-700' :
                      'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {ev.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <span className="text-xs text-muted-foreground px-1">+{dayEvents.length - 2} more</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-4 pt-2">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs text-muted-foreground">Booked / Upcoming</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-indigo-400" />
          <span className="text-xs text-muted-foreground">Suggested</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-brand-400" />
          <span className="text-xs text-muted-foreground">Completed</span>
        </div>
      </div>
    </div>
  )
}

// ─── Shared Controls Bar ─────────────────────────────────────────────────────

function FilterBar({ searchQuery, setSearchQuery, categoryFilter, setCategoryFilter, categories, placeholder }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder || 'Search events...'}
          className="h-9 pl-9 bg-white"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 bg-white">
            {categoryFilter === 'all' ? 'All Categories' : categoryFilter}
            <ChevronDown className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setCategoryFilter('all')}>All Categories</DropdownMenuItem>
          {categories.map(cat => (
            <DropdownMenuItem key={cat} onClick={() => setCategoryFilter(cat)}>{cat}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// ─── Event List Renderer ─────────────────────────────────────────────────────

function EventList({ events, groups, viewMode, onEventClick, waitlistedIds = [] }) {
  const renderEventRow = (ev) => {
    const isCompleted = ev._type === 'completed'
    const evCategories = ev.categories || (ev.category ? [ev.category] : [])
    const isFull = ev.isEthika && ev.capacity && ev.registered >= ev.capacity
    const spotsLeft = ev.isEthika && ev.capacity ? Math.max(0, ev.capacity - ev.registered) : null
    const isWaitlisted = waitlistedIds.includes(ev.id)
    return (
      <div
        key={`${ev._type}-${ev.id}`}
        className="flex items-center gap-3 rounded-[8px] border border-[#ecf2f5] bg-white px-3.5 py-2.5 hover:bg-muted/20 transition-colors cursor-pointer"
        onClick={() => onEventClick(ev)}
      >
        <div className="flex items-center justify-center rounded-[8px] shrink-0 w-10 h-10 bg-[#f5f5f5]">
          {isCompleted
            ? <CheckCircle2 className="size-4 text-brand-500" />
            : <Calendar className="size-4 text-muted-foreground" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground tracking-[-0.15px] leading-5 truncate">{ev.title}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-muted-foreground">
              {isCompleted
                ? `${ev.completedDate} · ${ev.hours} pts`
                : `${formatMonthDay(ev)} · ${ev.time || 'TBC'}`
              }
            </span>
            {!isCompleted && <span className="text-xs text-muted-foreground">{ev.provider}</span>}
            {spotsLeft !== null && spotsLeft > 0 && spotsLeft <= 10 && (
              <span className="text-xs text-amber-600 font-medium">{spotsLeft} spots left</span>
            )}
            {isFull && (
              <span className="text-xs text-red-600 font-medium">Full{ev.waitlistCount > 0 ? ` · ${ev.waitlistCount} waitlisted` : ''}</span>
            )}
          </div>
          {evCategories.length > 0 && (
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {evCategories.map(cat => (
                <Badge key={cat} variant={getCategoryBadgeVariant(cat)}>{cat}</Badge>
              ))}
            </div>
          )}
          {ev._type === 'suggested' && ev.relevance && (
            <p className="inline-flex items-center gap-1 text-xs text-indigo-500 mt-0.5"><Sparkles className="size-3 shrink-0" />{ev.relevance}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="points">
            {ev._type !== 'suggested' ? '+' : ''}{ev.cpdPoints || ev.cpdHours}pts
          </Badge>
          {isCompleted ? (
            <Badge variant={ev.badge === 'Certified' ? 'status-certified' : 'status-complete'}>
              {ev.badge}
            </Badge>
          ) : isWaitlisted ? (
            <Badge variant="status-waitlisted">
              <Clock className="size-3" /> Waitlisted
            </Badge>
          ) : isFull && !ev.status ? (
            <Badge variant="status-waitlist">
              <Users className="size-3" /> Waitlist
            </Badge>
          ) : (
            <Badge variant={ev.status === 'Booked' ? 'status-attending' : 'status-rsvp'}>
              {ev.status === 'Booked' && <Check className="size-3" />}
              {ev.status === 'Booked' ? 'Attending' : 'RSVP'}
            </Badge>
          )}
        </div>
      </div>
    )
  }

  if (viewMode === 'calendar') {
    return (
      <CalendarView events={events} onEventClick={onEventClick} />
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="size-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No events match your filters.</p>
      </div>
    )
  }

  // If groups are provided, render grouped
  if (groups) {
    return (
      <div className="space-y-5">
        {Object.entries(groups).map(([label, items]) => items.length > 0 && (
          <div key={label} className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            {items.map(renderEventRow)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {events.map(renderEventRow)}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CPDEventsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [viewMode, setViewMode] = useState('list')
  const [activeTab, setActiveTab] = useState('upcoming')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [enrolledIds, setEnrolledIds] = useState(() => UPCOMING_WORKSHOPS.filter(w => w.status === 'Booked').map(w => w.id))
  const [waitlistedIds, setWaitlistedIds] = useState([])
  const [returnPromptEvent, setReturnPromptEvent] = useState(null)
  const pendingExternalRef = useRef(null)

  // Listen for visibility change — when user returns from external registration tab
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === 'visible' && pendingExternalRef.current) {
        const event = pendingExternalRef.current
        pendingExternalRef.current = null
        setSelectedEvent(event)
        setReturnPromptEvent(event)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const handleRegisterExternal = useCallback((event) => {
    pendingExternalRef.current = event
    window.open(event.registrationUrl, '_blank')
  }, [])

  const handleConfirmExternal = useCallback((event) => {
    setEnrolledIds(prev => [...prev, event.id])
    setReturnPromptEvent(null)
    setSelectedEvent(null)
  }, [])

  const handleDismissReturnPrompt = useCallback(() => {
    setReturnPromptEvent(null)
  }, [])

  const upcomingEvents = useMemo(() => buildUpcomingEvents(), [])
  const suggestedEvents = useMemo(() => buildSuggestedEvents(), [])
  const completedEvents = useMemo(() => buildCompletedEvents(), [])

  // Extract unique categories from all events (using categories array with fallback)
  const categories = useMemo(() => {
    const cats = new Set()
    ;[...upcomingEvents, ...suggestedEvents, ...completedEvents].forEach(ev => {
      const evCats = ev.categories || (ev.category ? [ev.category] : [])
      evCats.forEach(c => cats.add(c))
    })
    return Array.from(cats).sort()
  }, [upcomingEvents, suggestedEvents, completedEvents])

  // Filtered lists per tab
  const filteredUpcoming = useMemo(() => {
    return upcomingEvents.filter(ev => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const catStr = (ev.categories || [ev.category]).filter(Boolean).join(' ').toLowerCase()
        if (!(ev.title || '').toLowerCase().includes(q) && !(ev.provider || '').toLowerCase().includes(q) && !catStr.includes(q)) return false
      }
      if (categoryFilter !== 'all') {
        const evCats = ev.categories || (ev.category ? [ev.category] : [])
        if (!evCats.includes(categoryFilter)) return false
      }
      return true
    })
  }, [upcomingEvents, searchQuery, categoryFilter])

  const filteredSuggested = useMemo(() => {
    return suggestedEvents.filter(ev => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const catStr = (ev.categories || [ev.category]).filter(Boolean).join(' ').toLowerCase()
        if (!(ev.title || '').toLowerCase().includes(q) && !(ev.provider || '').toLowerCase().includes(q) && !catStr.includes(q)) return false
      }
      if (categoryFilter !== 'all') {
        const evCats = ev.categories || (ev.category ? [ev.category] : [])
        if (!evCats.includes(categoryFilter)) return false
      }
      return true
    })
  }, [suggestedEvents, searchQuery, categoryFilter])

  const filteredCompleted = useMemo(() => {
    return completedEvents.filter(ev => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const catStr = (ev.categories || [ev.category]).filter(Boolean).join(' ').toLowerCase()
        if (!(ev.title || '').toLowerCase().includes(q) && !(ev.provider || '').toLowerCase().includes(q) && !catStr.includes(q)) return false
      }
      if (categoryFilter !== 'all') {
        const evCats = ev.categories || (ev.category ? [ev.category] : [])
        if (!evCats.includes(categoryFilter)) return false
      }
      return true
    })
  }, [completedEvents, searchQuery, categoryFilter])

  // Group upcoming into This Week / Later
  const upcomingGroups = useMemo(() => {
    const today = new Date()
    const endOfWeek = new Date(today)
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()))
    const groups = { 'This Week': [], 'Later': [] }
    filteredUpcoming.forEach(ev => {
      const d = getEventDate(ev)
      if (d <= endOfWeek) groups['This Week'].push(ev)
      else groups['Later'].push(ev)
    })
    return groups
  }, [filteredUpcoming])

  // All events combined for calendar view
  const allFilteredEvents = useMemo(() => {
    return [...filteredUpcoming, ...filteredSuggested, ...filteredCompleted]
  }, [filteredUpcoming, filteredSuggested, filteredCompleted])

  const filterProps = { searchQuery, setSearchQuery, categoryFilter, setCategoryFilter, categories }

  const TAB_TRIGGER_CLASS = "h-8 rounded-full text-sm px-3 py-1.5 gap-1.5 border border-transparent data-[state=active]:bg-[#153e40] data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:text-[#153e40] data-[state=inactive]:bg-[#f5f5f5]"

  return (
    <div className="flex flex-1 overflow-hidden bg-white">
      <div className="flex-1 overflow-auto px-6 pt-8 pb-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Back link */}
          <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-muted-foreground" onClick={() => navigate('/learn/cpd')}>
            <ArrowLeft className="size-3.5" /> CPD Tracker
          </Button>

          {/* Title row + view toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-[9px]">
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">CPD Events</h1>
              <p className="text-sm text-muted-foreground">Browse, search and manage your CPD events</p>
            </div>
            <div className="flex items-center rounded-md border border-[#e5e7eb] bg-[#f9fafb] p-0.5">
              <button
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <List className="size-3.5" /> List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${viewMode === 'calendar' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <CalendarDays className="size-3.5" /> Calendar
              </button>
            </div>
          </div>

          {/* ── List View with Tabs ──────────────────────────────── */}
          {viewMode === 'list' ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-auto bg-transparent p-0 gap-2 mb-4">
                <TabsTrigger value="upcoming" className={TAB_TRIGGER_CLASS}>
                  Upcoming
                  <span className={`inline-flex items-center justify-center size-5 rounded-full text-[11px] font-semibold leading-none ${activeTab === 'upcoming' ? 'bg-white/20' : 'bg-[#e5e7eb] text-[#374151]'}`}>{filteredUpcoming.length}</span>
                </TabsTrigger>
                <TabsTrigger value="find" className={TAB_TRIGGER_CLASS}>
                  Find Events
                  <span className={`inline-flex items-center justify-center size-5 rounded-full text-[11px] font-semibold leading-none ${activeTab === 'find' ? 'bg-white/20' : 'bg-[#e5e7eb] text-[#374151]'}`}>{filteredSuggested.length}</span>
                </TabsTrigger>
                <TabsTrigger value="past" className={TAB_TRIGGER_CLASS}>
                  Past
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="mt-0 space-y-5">
                <FilterBar {...filterProps} placeholder="Search upcoming events..." />
                <EventList
                  events={filteredUpcoming}
                  groups={upcomingGroups}
                  viewMode="list"
                  onEventClick={setSelectedEvent}
                  waitlistedIds={waitlistedIds}
                />
              </TabsContent>

              <TabsContent value="past" className="mt-0 space-y-5">
                <FilterBar {...filterProps} placeholder="Search past events..." />
                <EventList
                  events={filteredCompleted}
                  viewMode="list"
                  onEventClick={setSelectedEvent}
                  waitlistedIds={waitlistedIds}
                />
              </TabsContent>

              <TabsContent value="find" className="mt-0 space-y-5">
                <FilterBar {...filterProps} placeholder="Search recommended events..." />
                <EventList
                  events={filteredSuggested}
                  viewMode="list"
                  onEventClick={setSelectedEvent}
                  waitlistedIds={waitlistedIds}
                />
              </TabsContent>
            </Tabs>
          ) : (
            /* ── Calendar View (all events) ─────────────────────── */
            <div className="space-y-5">
              <FilterBar {...filterProps} placeholder="Search events..." />
              <div className="rounded-[6px] border border-[#E2E8F0] bg-white p-6">
                <CalendarView events={allFilteredEvents} onEventClick={setSelectedEvent} />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Event Detail Overlay */}
      {selectedEvent && createPortal(
        <EventDetailOverlay
          event={selectedEvent}
          enrolled={enrolledIds.includes(selectedEvent.id)}
          waitlisted={waitlistedIds.includes(selectedEvent.id)}
          returnPromptEvent={returnPromptEvent}
          onClose={() => { setSelectedEvent(null); setReturnPromptEvent(null) }}
          onEnrol={() => setEnrolledIds(prev => [...prev, selectedEvent.id])}
          onDeEnrol={() => setEnrolledIds(prev => prev.filter(id => id !== selectedEvent.id))}
          onJoinWaitlist={() => setWaitlistedIds(prev => [...prev, selectedEvent.id])}
          onLeaveWaitlist={() => setWaitlistedIds(prev => prev.filter(id => id !== selectedEvent.id))}
          onRegisterExternal={handleRegisterExternal}
          onConfirmExternal={handleConfirmExternal}
          onDismissReturnPrompt={handleDismissReturnPrompt}
        />,
        document.body
      )}
    </div>
  )
}
