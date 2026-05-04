import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown, ChevronRight, Send, Plug, ExternalLink, Sparkles,
  AlertCircle, ArrowUpRight, CheckCircle2, Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const NEUTRAL_PILL = 'border-border/60 bg-muted/40 text-muted-foreground'
const OUTSTANDING_PILL = 'border-red-200 bg-red-50 text-red-700'

const STATUS_PILL = {
  'Not Submitted': OUTSTANDING_PILL,
  'Drafting':      NEUTRAL_PILL,
  'CoSec Review':  NEUTRAL_PILL,
  'Submitted':     NEUTRAL_PILL,
  'In Pack':       'border-border/60 bg-muted/40 text-foreground',
}

const TYPE_PILL = {
  Decision:    NEUTRAL_PILL,
  Information: NEUTRAL_PILL,
  Discussion:  NEUTRAL_PILL,
}

const SOURCE_PILL = NEUTRAL_PILL

const MONTH_INDEX = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }

function parseMeetingDate(str) {
  const [day, mon, yearAndTime] = (str ?? '').split(' ')
  if (!day || !mon || !yearAndTime) return null
  const year = yearAndTime.replace(/,$/, '')
  const m = MONTH_INDEX[mon]
  if (m == null) return null
  return new Date(Number(year), m, Number(day))
}

function daysFromNow(d) {
  if (!d) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  return Math.round((target - today) / (1000 * 60 * 60 * 24))
}

function formatTime() {
  const now = new Date()
  return now.toLocaleString('en-AU', {
    day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

function firstName(fullName) {
  return (fullName ?? '').split(' ')[0] || ''
}

function AgendaRow({ item, papersById, meetingId, onChase }) {
  const navigate = useNavigate()
  const matchingPaper = papersById.get(item.id) ?? null
  const isOutstanding = item.paperStatus === 'Not Submitted'
  const days = item.daysOutstanding
  const hasReminders = (item.reminderCount ?? 0) > 0

  return (
    <div className="grid grid-cols-12 gap-3 items-center px-5 py-3 border-b border-border/40 last:border-0 text-sm">
      <div className="col-span-4 min-w-0">
        <p className="text-foreground font-medium truncate">{item.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className={cn('text-[10px] h-4 px-1.5', TYPE_PILL[item.type])}>
            {item.type}
          </Badge>
          <Badge variant="outline" className={cn('text-[10px] h-4 px-1.5', SOURCE_PILL)}>
            {item.source}
          </Badge>
        </div>
      </div>

      <div className="col-span-2 flex items-center gap-2 min-w-0">
        <Avatar className="size-6 shrink-0">
          <AvatarFallback className="text-[10px]">{item.officer?.initials}</AvatarFallback>
        </Avatar>
        <span className="text-foreground truncate">{item.officer?.name}</span>
      </div>

      <div className="col-span-2">
        <Badge variant="outline" className={cn('text-xs h-5 px-1.5', STATUS_PILL[item.paperStatus])}>
          {item.paperStatus}
        </Badge>
      </div>

      <div className="col-span-2 text-xs text-muted-foreground">
        {isOutstanding && days != null ? (
          <div className="space-y-0.5">
            <div className={cn('flex items-center gap-1', days > 7 && 'text-red-600 font-medium')}>
              <Clock className="size-3" />
              {days}d outstanding
            </div>
            {hasReminders && (
              <div className="flex items-center gap-1 text-[11px]">
                <Sparkles className="size-2.5 text-brand-600" />
                Last chase {item.lastReminderDays}d ago · {item.reminderCount} sent
              </div>
            )}
          </div>
        ) : item.paperStatus === 'In Pack' ? (
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="size-3" /> In pack
          </span>
        ) : (
          <span>—</span>
        )}
      </div>

      <div className="col-span-2 text-right">
        {isOutstanding ? (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1"
            onClick={(e) => { e.stopPropagation(); onChase?.(item) }}
          >
            <Send className="size-3" />
            Chase {firstName(item.officer?.name)}
          </Button>
        ) : matchingPaper ? (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs gap-1"
            onClick={(e) => { e.stopPropagation(); navigate(`/govern/board-papers/${matchingPaper.id}`) }}
          >
            View paper <ExternalLink className="size-3" />
          </Button>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs gap-1"
            onClick={(e) => { e.stopPropagation(); navigate(`/govern/meetings/${meetingId}`) }}
          >
            Open agenda <ExternalLink className="size-3" />
          </Button>
        )}
      </div>
    </div>
  )
}

export function PackAssemblyCard({ meeting, papers, initiallyExpanded = false }) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(initiallyExpanded)
  const [pushedAt, setPushedAt] = useState(null)
  const [chaseToast, setChaseToast] = useState(null)

  const agenda = meeting.agenda ?? []
  const date = parseMeetingDate(meeting.dateTime)
  const daysUntil = daysFromNow(date)

  const meetingPapers = useMemo(
    () => (papers ?? []).filter(p => p.meetingId === meeting.id),
    [papers, meeting.id],
  )
  const papersById = useMemo(() => {
    const m = new Map()
    for (const p of meetingPapers) m.set(p.agendaId ?? p.id, p)
    return m
  }, [meetingPapers])

  const counts = useMemo(() => {
    const buckets = { 'Not Submitted': 0, 'Drafting': 0, 'CoSec Review': 0, 'Submitted': 0, 'In Pack': 0 }
    for (const item of agenda) {
      buckets[item.paperStatus] = (buckets[item.paperStatus] ?? 0) + 1
    }
    return buckets
  }, [agenda])

  const total = agenda.length
  const outstanding = counts['Not Submitted']
  const received = total - outstanding
  const isComplete = total > 0 && outstanding === 0

  const sources = useMemo(() => {
    const seen = new Set()
    return agenda.map(a => a.source).filter(s => s && !seen.has(s) && (seen.add(s), true))
  }, [agenda])

  const outstandingByOfficer = useMemo(() => {
    const m = new Map()
    for (const item of agenda) {
      if (item.paperStatus !== 'Not Submitted') continue
      const key = item.officer?.name ?? 'Unassigned'
      m.set(key, (m.get(key) ?? 0) + 1)
    }
    return m
  }, [agenda])

  function onBulkChase() {
    if (outstanding === 0) return
    const summary = [...outstandingByOfficer.entries()]
      .map(([name, n]) => `${name} (${n})`)
      .join(', ')
    setChaseToast(`Reminders queued: ${summary}. Auto-send window opens in 5 minutes.`)
    setTimeout(() => setChaseToast(null), 6000)
  }

  function onPush() {
    if (!isComplete) return
    setPushedAt(formatTime())
  }

  function onSingleChase(item) {
    setChaseToast(`Reminder queued for ${item.officer?.name} (${item.title}).`)
    setTimeout(() => setChaseToast(null), 6000)
  }

  // Empty-agenda placeholder
  if (total === 0) {
    return (
      <div className="border border-dashed border-border/70 rounded-lg bg-white">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{meeting.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {meeting.dateTime}
              {daysUntil != null && daysUntil >= 0 && ` · ${daysUntil} day${daysUntil === 1 ? '' : 's'} until meeting`}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 shrink-0"
            onClick={() => navigate(`/govern/meetings/${meeting.id}`)}
          >
            Open meeting <ArrowUpRight className="size-3.5" />
          </Button>
        </div>
        <div className="border-t border-border/40 px-5 py-3 bg-muted/20">
          <p className="text-xs text-muted-foreground">Agenda not set yet — open the meeting to plan it.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-border/60 rounded-lg bg-white overflow-hidden">
      <div className="px-5 py-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-base font-medium text-foreground truncate">{meeting.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {meeting.dateTime}
              {daysUntil != null && daysUntil >= 0 && (
                <> · <span className="text-foreground">{daysUntil} day{daysUntil === 1 ? '' : 's'} until meeting</span></>
              )}
            </p>
          </div>
          <p className="text-sm text-muted-foreground shrink-0">
            <span className="font-medium text-foreground">{received}</span> of <span className="font-medium text-foreground">{total}</span> papers received
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {outstanding > 0 && (
            <Badge variant="outline" className={cn('text-xs h-5 px-2 gap-1', OUTSTANDING_PILL)}>
              <AlertCircle className="size-3" />
              {outstanding} outstanding
            </Badge>
          )}
          {counts['Drafting'] > 0 && (
            <Badge variant="outline" className={cn('text-xs h-5 px-2', NEUTRAL_PILL)}>
              {counts['Drafting']} drafting
            </Badge>
          )}
          {counts['CoSec Review'] > 0 && (
            <Badge variant="outline" className={cn('text-xs h-5 px-2', NEUTRAL_PILL)}>
              {counts['CoSec Review']} in CoSec review
            </Badge>
          )}
          {counts['Submitted'] > 0 && (
            <Badge variant="outline" className={cn('text-xs h-5 px-2', NEUTRAL_PILL)}>
              {counts['Submitted']} submitted
            </Badge>
          )}
          {counts['In Pack'] > 0 && (
            <Badge variant="outline" className={cn('text-xs h-5 px-2', NEUTRAL_PILL)}>
              {counts['In Pack']} in pack
            </Badge>
          )}
        </div>

        {sources.length > 0 && (
          <p className="text-xs text-muted-foreground truncate">
            <span className="text-muted-foreground/70">Sources: </span>
            {sources.join(' · ')}
          </p>
        )}

        {meeting.integration?.name && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Plug className="size-3 shrink-0" />
            <span>Pack will sync to {meeting.integration.name} on push</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-border/40 bg-muted/20">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="size-3 text-brand-600" />
          Auto-chase enabled · AI assistant last sent reminders 1 day ago
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={outstanding === 0}
            onClick={onBulkChase}
            className="gap-1.5"
          >
            <Send className="size-3.5" />
            Send chase reminders{outstanding > 0 ? ` (${outstanding})` : ''}
          </Button>
          {pushedAt ? (
            <Badge variant="outline" className="h-8 px-3 gap-1.5 border-emerald-200 bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="size-3.5" />
              Pushed to Diligent · {pushedAt}
            </Badge>
          ) : (
            <Button
              size="sm"
              disabled={!isComplete}
              onClick={onPush}
              title={!isComplete ? `${outstanding} paper${outstanding === 1 ? '' : 's'} still outstanding` : undefined}
              className="gap-1.5"
            >
              <Plug className="size-3.5" />
              Push to Diligent
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/govern/meetings/${meeting.id}`)}
            className="gap-1.5"
          >
            Open agenda <ExternalLink className="size-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setExpanded(v => !v)}
            className="gap-1.5"
          >
            {expanded ? (
              <>Hide assembly <ChevronDown className="size-3.5" /></>
            ) : (
              <>Open assembly <ChevronRight className="size-3.5" /></>
            )}
          </Button>
        </div>
      </div>

      {chaseToast && (
        <div className="border-t border-border/40 px-5 py-2.5 bg-blue-50/70 text-xs text-blue-900 flex items-center gap-2">
          <Sparkles className="size-3.5 text-blue-700 shrink-0" />
          {chaseToast}
        </div>
      )}

      {expanded && (
        <div className="border-t border-border/40">
          <div className="grid grid-cols-12 gap-3 px-5 py-2 border-b border-border/60 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
            <div className="col-span-4">Paper</div>
            <div className="col-span-2">Owner</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Days / Chases</div>
            <div className="col-span-2 text-right">Action</div>
          </div>
          {agenda.map(item => (
            <AgendaRow
              key={item.id}
              item={item}
              papersById={papersById}
              meetingId={meeting.id}
              onChase={onSingleChase}
            />
          ))}
        </div>
      )}
    </div>
  )
}
