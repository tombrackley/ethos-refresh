import { useState, useMemo, forwardRef } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Search, ChevronDown, ChevronLeft, ChevronRight, Calendar, Clock, MapPin,
  Building2, Tag, Sparkles, ExternalLink, X, CheckCircle2,
} from 'lucide-react'
import tenant, { getCategoryBadgeVariant } from '@/config/tenant'
import { cn } from '@/lib/utils'

// ─── Tenant Data ─────────────────────────────────────────────────────────────

const t = tenant.pages.learn

const LIBRARY_EVENTS = [
  ...t.upcomingWorkshops.map(w => ({ ...w, _source: 'upcoming' })),
  ...t.suggestedWorkshops.map(w => ({ ...w, _source: 'suggested' })),
]

// Location filter options — Online + countries the platform supports.
const LOCATION_OPTIONS = [
  { value: 'Online',         label: 'Online' },
  { value: 'Australia',      label: 'Australia' },
  { value: 'New Zealand',    label: 'New Zealand' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'United States',  label: 'United States' },
  { value: 'Singapore',      label: 'Singapore' },
  { value: 'Hong Kong',      label: 'Hong Kong' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTH_MAP = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 }
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const DEMO_TODAY = new Date(2026, 2, 11)

function startOfWeekMon(d) {
  const x = new Date(d)
  const wd = (x.getDay() + 6) % 7
  x.setDate(x.getDate() - wd)
  x.setHours(0, 0, 0, 0)
  return x
}

const THIS_WEEK_START = startOfWeekMon(DEMO_TODAY)
const THIS_WEEK_END = (() => { const d = new Date(THIS_WEEK_START); d.setDate(d.getDate() + 6); d.setHours(23, 59, 59, 999); return d })()
const NEXT_WEEK_START = (() => { const d = new Date(THIS_WEEK_START); d.setDate(d.getDate() + 7); return d })()
const NEXT_WEEK_END = (() => { const d = new Date(THIS_WEEK_START); d.setDate(d.getDate() + 13); d.setHours(23, 59, 59, 999); return d })()

function getEventDate(w) {
  if (w.month && w.day && w.year) {
    return new Date(parseInt(w.year), MONTH_MAP[w.month.toUpperCase()] ?? 0, parseInt(w.day))
  }
  return new Date()
}

const dateKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
const sameDay = (a, b) => a && b && dateKey(a) === dateKey(b)
const getCategories = (ev) => ev.categories || (ev.category ? [ev.category] : [])
const isFree = (ev) => !ev.price || ev.price === 0
const formatPrice = (ev) => (isFree(ev) ? 'Free' : `$${ev.price}`)
const isRegistered = (ev) => ev.status === 'Booked'

// ─── Event Detail Overlay ────────────────────────────────────────────────────

function EventDetailOverlay({ event, onClose }) {
  const isExternal = !!event.registrationUrl
  const eventCategories = getCategories(event)
  const eventRegimes = event.regimes || []
  const dateDisplay = event.month
    ? `${event.month.charAt(0) + event.month.slice(1).toLowerCase()} ${parseInt(event.day, 10)}, ${event.year}`
    : null

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
          <div className="flex items-center gap-2 flex-wrap">
            {event.type && (
              <span className="inline-flex items-center h-7 px-2.5 rounded-md border border-[#e5e7eb] bg-[#f9fafb] text-sm font-medium text-[#374151]">
                {event.type}
              </span>
            )}
            <span className={`inline-flex items-center h-7 px-2.5 rounded-md text-sm font-medium ${isFree(event) ? 'border border-emerald-200 bg-emerald-50 text-emerald-800' : 'border border-[#e5e7eb] bg-white text-[#374151]'}`}>
              {formatPrice(event)}
            </span>
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
          </div>

          {event.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
          )}

          <Separator />

          <div className="rounded-lg border border-purple-200 bg-purple-50/60 px-4 py-3.5 space-y-2.5">
            <p className="text-sm font-medium text-purple-900 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-purple-500" />
              What you'll achieve
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                <span className="text-sm text-purple-900">{event.cpdPoints ?? event.cpdHours} CPD points toward your requirements</span>
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
              {event.relevance && (
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-purple-900">{event.relevance}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-2 px-6 py-4 border-t border-border shrink-0">
          {isExternal ? (
            <>
              <Button size="sm" className="gap-1.5" onClick={() => window.open(event.registrationUrl, '_blank')}>
                <ExternalLink className="size-3.5" /> Register on {event.provider}
              </Button>
              <div className="flex-1" />
              <p className="text-xs text-muted-foreground">Registration is handled by the external provider</p>
            </>
          ) : (
            <>
              <div className="flex-1" />
              <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Event Row ───────────────────────────────────────────────────────────────

function EventRow({ event, onClick }) {
  const eventCategories = getCategories(event)
  return (
    <div
      className="flex items-center gap-3 rounded-[8px] border border-[#ecf2f5] bg-white px-3.5 py-2.5 hover:bg-muted/20 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center rounded-[8px] shrink-0 size-12 bg-[#f5f5f5]">
        <span className="text-xs font-semibold uppercase leading-none text-muted-foreground">
          {event.month}
        </span>
        <span className="text-base font-semibold leading-tight text-foreground">
          {event.day}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground tracking-[-0.15px] leading-5 truncate">{event.title}</p>
        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
          <span className="text-xs text-muted-foreground">{event.time || 'TBC'}</span>
          <span className="text-xs text-muted-foreground">{event.provider}</span>
          {event.location && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3 shrink-0" />{event.location}
            </span>
          )}
        </div>
        {eventCategories.length > 0 && (
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            {eventCategories.map(cat => (
              <Badge key={cat} variant={getCategoryBadgeVariant(cat)}>{cat}</Badge>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant="points">{event.cpdPoints || event.cpdHours}pts</Badge>
        <Badge variant={isFree(event) ? 'status-complete' : 'cpd'}>{formatPrice(event)}</Badge>
      </div>
    </div>
  )
}

// ─── Sort Dropdown ───────────────────────────────────────────────────────────

const PILL_BASE = 'inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border text-sm font-medium transition-colors'

const PillTrigger = forwardRef(function PillTrigger({ label, value, active, ...props }, ref) {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(PILL_BASE, active ? 'border-brand-700 bg-brand-50/50' : 'border-border bg-white hover:bg-muted/40')}
    >
      <span className="text-muted-foreground">{label}:</span>
      <span className={active ? 'text-brand-800' : 'text-foreground'}>{value}</span>
      <ChevronDown className="size-4 text-muted-foreground -mr-1.5" />
    </button>
  )
})

// Pill-trigger single-select dropdown for the top filter bar. Options can be
// either strings or { value, label } objects.
function PillSelect({ label, allLabel, value, options, onSelect }) {
  const items = options.map(o => (typeof o === 'string' ? { value: o, label: o } : o))
  const display = value === 'all' ? 'All' : (items.find(i => i.value === value)?.label ?? value)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <PillTrigger label={label} value={display} active={value !== 'all'} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuItem onClick={() => onSelect('all')}>{allLabel}</DropdownMenuItem>
        {items.map(item => (
          <DropdownMenuItem key={item.value} onClick={() => onSelect(item.value)}>{item.label}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Pill-trigger multi-select dropdown for the top filter bar.
function PillMultiSelect({ label, options, selected, onToggle, onClear }) {
  const count = selected.length
  const value = count === 0 ? 'All' : count === 1 ? selected[0] : `${count} selected`
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <PillTrigger label={label} value={value} active={count > 0} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60 max-h-[280px] overflow-y-auto">
        {options.map(opt => (
          <DropdownMenuItem
            key={opt}
            onSelect={(e) => { e.preventDefault(); onToggle(opt) }}
            className="gap-2"
          >
            <Checkbox checked={selected.includes(opt)} className="pointer-events-none" />
            <span className="flex-1">{opt}</span>
          </DropdownMenuItem>
        ))}
        {count > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onClear} className="text-muted-foreground">Clear selection</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Calendar Sidebar ────────────────────────────────────────────────────────

function CalendarSidebar({ selectedDate, onSelect, highlightedDateKeys }) {
  const [viewDate, setViewDate] = useState(selectedDate || DEMO_TODAY)
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7
  const cells = [
    ...Array.from({ length: firstDayOfWeek }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50 transition-colors"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-semibold text-foreground">{MONTH_NAMES[month]} {year}</span>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50 transition-colors"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-xs text-muted-foreground font-medium mb-1">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i} className="py-1">{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
        {cells.map((d, i) => {
          if (!d) return <span key={i} className="py-1" />
          const cellDate = new Date(year, month, d)
          const k = dateKey(cellDate)
          const isToday = k === dateKey(DEMO_TODAY)
          const isSelected = selectedDate && k === dateKey(selectedDate)
          const isHighlighted = highlightedDateKeys.has(k)
          return (
            <button
              key={i}
              onClick={() => onSelect(isSelected ? null : cellDate)}
              className={cn(
                'py-1 rounded-[4px] aspect-square flex items-center justify-center cursor-pointer hover:bg-muted/40 transition-colors',
                isSelected && 'bg-[#153e40] text-white font-medium hover:bg-[#153e40]',
                !isSelected && isToday && 'ring-1 ring-inset ring-slate-300 font-medium',
                !isSelected && !isToday && isHighlighted && 'bg-emerald-50 text-emerald-700 font-medium',
              )}
            >
              {d}
            </button>
          )
        })}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-300" />
          <span className="text-xs text-muted-foreground">Matching events</span>
        </span>
        {selectedDate && (
          <button
            onClick={() => onSelect(null)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LearningEventsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [categoryFilters, setCategoryFilters] = useState([])
  const [typeFilters, setTypeFilters] = useState([])
  const [priceFilter, setPriceFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState(null)
  const [registeredOnly, setRegisteredOnly] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const categories = useMemo(() => {
    const cats = new Set()
    LIBRARY_EVENTS.forEach(ev => getCategories(ev).forEach(c => cats.add(c)))
    return Array.from(cats).sort()
  }, [])
  const types = useMemo(
    () => [...new Set(LIBRARY_EVENTS.map(e => e.type).filter(Boolean))],
    []
  )

  const toggleCategory = (c) => setCategoryFilters(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  const toggleType = (ty) => setTypeFilters(prev => prev.includes(ty) ? prev.filter(x => x !== ty) : [...prev, ty])

  // Apply every filter EXCEPT date — this determines which dates the calendar
  // lights up. The calendar reflects "events that match my other filters".
  const eventsMatchingNonDateFilters = useMemo(() => {
    return LIBRARY_EVENTS.filter(ev => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const catStr = getCategories(ev).join(' ').toLowerCase()
        if (
          !(ev.title || '').toLowerCase().includes(q) &&
          !(ev.provider || '').toLowerCase().includes(q) &&
          !catStr.includes(q)
        ) return false
      }
      if (locationFilter === 'Online' && ev.location !== 'Online') return false
      // Country selection — for the prototype we treat any non-Online value as
      // "in-person" matching. Real city→country mapping comes later.
      if (locationFilter !== 'all' && locationFilter !== 'Online' && ev.location === 'Online') return false
      if (categoryFilters.length && !getCategories(ev).some(c => categoryFilters.includes(c))) return false
      if (typeFilters.length && !typeFilters.includes(ev.type)) return false
      if (priceFilter === 'Free' && !isFree(ev)) return false
      if (priceFilter === 'Paid' && isFree(ev)) return false
      if (registeredOnly && !isRegistered(ev)) return false
      return true
    })
  }, [searchQuery, locationFilter, categoryFilters, typeFilters, priceFilter, registeredOnly])

  const highlightedDateKeys = useMemo(
    () => new Set(eventsMatchingNonDateFilters.map(ev => dateKey(getEventDate(ev)))),
    [eventsMatchingNonDateFilters]
  )

  const filteredEvents = useMemo(() => {
    const list = dateFilter
      ? eventsMatchingNonDateFilters.filter(ev => sameDay(getEventDate(ev), dateFilter))
      : eventsMatchingNonDateFilters
    return [...list].sort((a, b) => getEventDate(a) - getEventDate(b))
  }, [eventsMatchingNonDateFilters, dateFilter])

  // When no specific day is chosen, bucket the list by recency.
  const useGroups = !dateFilter
  const groups = useMemo(() => {
    if (!useGroups) return null
    const g = { 'This Week': [], 'Next Week': [], 'Later': [] }
    filteredEvents.forEach(ev => {
      const d = getEventDate(ev)
      if (d >= THIS_WEEK_START && d <= THIS_WEEK_END) g['This Week'].push(ev)
      else if (d >= NEXT_WEEK_START && d <= NEXT_WEEK_END) g['Next Week'].push(ev)
      else g['Later'].push(ev)
    })
    return g
  }, [filteredEvents, useGroups])

  return (
    <div className="flex flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto bg-background px-8 pt-[52px] pb-6">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-[28px] leading-[30px] tracking-[-1.12px] font-normal text-[#0A0A0A]">Learning Events</h1>

          <div className="mt-6 space-y-4">
            {/* Top filter bar */}
            <div className="space-y-3">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events..."
                  className="h-9 pl-9 bg-white"
                />
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <PillSelect
                  label="Location"
                  allLabel="All locations"
                  value={locationFilter}
                  options={LOCATION_OPTIONS}
                  onSelect={setLocationFilter}
                />
                <PillMultiSelect
                  label="Category"
                  options={categories}
                  selected={categoryFilters}
                  onToggle={toggleCategory}
                  onClear={() => setCategoryFilters([])}
                />
                <PillMultiSelect
                  label="Type"
                  options={types}
                  selected={typeFilters}
                  onToggle={toggleType}
                  onClear={() => setTypeFilters([])}
                />
                <PillSelect
                  label="Price"
                  allLabel="All prices"
                  value={priceFilter}
                  options={['Free', 'Paid']}
                  onSelect={setPriceFilter}
                />
                <label className="ml-auto flex items-center gap-2 cursor-pointer select-none">
                  <Switch checked={registeredOnly} onCheckedChange={setRegisteredOnly} />
                  <span className="text-sm text-muted-foreground">Registered only</span>
                </label>
              </div>
            </div>

            {/* Content: events list + calendar rail */}
            <div className="flex gap-6">
              <div className="flex-1 min-w-0">
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="size-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No events match your filters.</p>
                  </div>
                ) : useGroups ? (
                  <div className="space-y-5">
                    {Object.entries(groups).map(([label, items]) => items.length > 0 && (
                      <div key={label} className="space-y-2">
                        <p className="text-xs font-mono font-semibold tracking-normal text-muted-foreground/60 uppercase">{label}</p>
                        {items.map(ev => (
                          <EventRow key={ev.id} event={ev} onClick={() => setSelectedEvent(ev)} />
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredEvents.map(ev => (
                      <EventRow key={ev.id} event={ev} onClick={() => setSelectedEvent(ev)} />
                    ))}
                  </div>
                )}
              </div>

              <aside className="w-[280px] shrink-0">
                <CalendarSidebar
                  selectedDate={dateFilter}
                  onSelect={setDateFilter}
                  highlightedDateKeys={highlightedDateKeys}
                />
              </aside>
            </div>
          </div>

        </div>
      </div>

      {selectedEvent && createPortal(
        <EventDetailOverlay event={selectedEvent} onClose={() => setSelectedEvent(null)} />,
        document.body
      )}
    </div>
  )
}
