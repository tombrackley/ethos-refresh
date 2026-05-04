import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Sparkles, ChevronLeft, X, CalendarDays, Users, Mail, FileText, ListChecks,
  Check, ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import tenant from '@/config/tenant'
import { IntegrationStatusBanner } from '@/components/shared/IntegrationStatusBanner'
import { AnnualWorkProgramRail } from '@/components/shared/AnnualWorkProgramRail'
import { AgendaItemCard } from '@/components/shared/AgendaItemCard'

const MEETINGS = tenant.pages.govern?.meetings ?? []
const AWP_ITEMS = tenant.pages.govern?.annualWorkProgram ?? []

const NEUTRAL_PILL = 'border-border/60 bg-muted/40 text-muted-foreground'
const OUTSTANDING_PILL = 'border-red-200 bg-red-50 text-red-700'

const TYPE_STYLE = {
  Decision:    NEUTRAL_PILL,
  Information: NEUTRAL_PILL,
  Discussion:  NEUTRAL_PILL,
}
const PAPER_STYLE = {
  'Not Submitted': OUTSTANDING_PILL,
  'Drafting':      NEUTRAL_PILL,
  'CoSec Review':  NEUTRAL_PILL,
  'Submitted':     NEUTRAL_PILL,
  'In Pack':       'border-border/60 bg-muted/40 text-foreground',
}
const SOURCE_FALLBACK = NEUTRAL_PILL
const SOURCE_STYLE = new Proxy({}, { get: () => SOURCE_FALLBACK })

const MONTH_INDEX = { Jan:1, Feb:2, Mar:3, Apr:4, May:5, Jun:6, Jul:7, Aug:8, Sep:9, Oct:10, Nov:11, Dec:12 }

function parseMonthYear(dateTime) {
  // Expected format: "14 May 2026, 9:00am"
  const m = (dateTime ?? '').match(/^\d+\s+(\w+)\s+(\d{4})/)
  if (!m) return { month: null, year: null }
  return { month: MONTH_INDEX[m[1]] ?? null, year: Number(m[2]) }
}

function suggestionIcon(source) {
  if (/policy|cps/i.test(source)) return FileText
  if (/minutes/i.test(source))    return ListChecks
  if (/action|email|delegation/i.test(source)) return Mail
  return Sparkles
}

function NotFound({ onBack }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-10">
      <p className="text-sm text-muted-foreground">Meeting not found.</p>
      <Button variant="outline" size="sm" onClick={onBack}>
        <ChevronLeft className="size-4" /> Back to meetings
      </Button>
    </div>
  )
}

function SuggestionsPanel({ suggestions, onClose }) {
  return (
    <div className="flex flex-col w-[380px] shrink-0 border-l border-border bg-background overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-blue-600" />
          <span className="text-sm font-medium text-foreground">AI Agenda Builder</span>
          <Badge variant="outline" className="h-4 px-1.5 text-[10px] border-blue-200 bg-blue-50 text-blue-800">
            {suggestions.length} suggestions
          </Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="size-7 text-muted-foreground">
          <X className="size-4" />
        </Button>
      </div>

      <div className="flex-1 px-5 py-4 space-y-3">
        {suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No suggestions right now.</p>
        ) : suggestions.map(s => {
          const Icon = suggestionIcon(s.source)
          return (
            <div
              key={s.id}
              className="rounded-lg border border-border bg-white p-3.5 space-y-2.5 hover:border-blue-200 transition-colors"
            >
              <div className="flex items-start gap-2">
                <Icon className="size-3.5 text-blue-600 mt-0.5 shrink-0" />
                <p className="text-sm text-foreground leading-snug flex-1">{s.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="h-4 px-1.5 text-[10px] text-muted-foreground">
                  {s.source}
                </Badge>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button size="sm" variant="outline" className="h-7 text-xs border-blue-200 text-blue-800 hover:bg-blue-50">
                  <Check className="size-3" /> Accept
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground">
                  Dismiss
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function MeetingAgendaPage() {
  const { meetingId } = useParams()
  const navigate = useNavigate()

  const meeting = useMemo(() => MEETINGS.find(m => m.id === meetingId), [meetingId])
  const [drawerOpen, setDrawerOpen] = useState(true)

  if (!meeting) {
    return <NotFound onBack={() => navigate('/govern/meetings')} />
  }

  const { month, year } = parseMonthYear(meeting.dateTime)
  const integration = meeting.integration
  const agenda = meeting.agenda ?? []
  const suggestions = meeting.aiSuggestions ?? []
  const totalPapers = agenda.length
  const outstandingPapers = agenda.filter(a => a.paperStatus === 'Not Submitted').length
  const receivedPapers = totalPapers - outstandingPapers

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Top integration banner */}
      {integration && (
        <IntegrationStatusBanner name={integration.name} message={integration.message} />
      )}

      {/* Body: rail + canvas + suggestions */}
      <div className="flex flex-1 overflow-hidden">
        <AnnualWorkProgramRail items={AWP_ITEMS} currentMonth={month} year={year} />

        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-6">

            {/* Back link */}
            <button
              type="button"
              onClick={() => navigate('/govern/meetings')}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-3.5" /> All meetings
            </button>

            {/* Header */}
            <header className="space-y-1.5">
              <h1 className="text-2xl font-medium tracking-tight text-foreground">{meeting.name}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" /> {meeting.dateTime}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-3.5" /> {meeting.attendees} attendees
                </span>
                <Badge variant="outline" className="h-5 px-2 text-[11px] border-brand-200 bg-brand-50 text-brand-800">
                  {meeting.type}
                </Badge>
              </div>
              {totalPapers > 0 && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{receivedPapers}</span> of <span className="font-medium text-foreground">{totalPapers}</span> papers received
                  {outstandingPapers > 0 && <> · <span className="text-red-600">{outstandingPapers} outstanding</span></>}
                  {' '}— track in the{' '}
                  <button
                    type="button"
                    onClick={() => navigate(`/govern/board-papers?meeting=${meeting.id}`)}
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    Board Pack Compiler
                  </button>
                </p>
              )}
            </header>

            {/* Draft agenda heading + AI button */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-foreground">Draft agenda</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {agenda.length} {agenda.length === 1 ? 'agenda item' : 'agenda items'} · same {agenda.length} {agenda.length === 1 ? 'paper' : 'papers'} in the pack
                </p>
              </div>
              <Button
                onClick={() => setDrawerOpen(o => !o)}
                className="h-9 gap-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                <Sparkles className="size-4" />
                AI Agenda Builder
                {suggestions.length > 0 && (
                  <Badge className="h-5 px-1.5 text-[10px] bg-white/20 text-white border-0 hover:bg-white/20">
                    Suggested items: {suggestions.length}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Agenda items */}
            <div className="space-y-3">
              {agenda.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
                  <p className="text-sm text-muted-foreground">No agenda items yet. Use AI Agenda Builder to populate.</p>
                </div>
              ) : agenda.map((item, idx) => (
                <AgendaItemCard
                  key={item.id}
                  index={idx}
                  item={item}
                  typeStyle={TYPE_STYLE}
                  paperStyle={PAPER_STYLE}
                  sourceStyle={SOURCE_STYLE}
                />
              ))}
            </div>

            {/* Bottom-right primary action */}
            <div className="flex justify-end pt-2">
              <Button
                className="h-10 gap-2"
                onClick={() => navigate(`/govern/board-papers?meeting=${meeting.id}`)}
              >
                Open Board Pack Compiler <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </main>

        {/* AI suggestions pull-out */}
        <div
          className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${drawerOpen ? 'w-[380px]' : 'w-0'}`}
        >
          <SuggestionsPanel suggestions={suggestions} onClose={() => setDrawerOpen(false)} />
        </div>
      </div>
    </div>
  )
}
