import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Sparkles, ChevronLeft, Check, CalendarDays, Users, Download, ArrowRight,
  CircleCheck, Circle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import tenant from '@/config/tenant'
import { cn } from '@/lib/utils'

const MEETINGS = tenant.pages.govern?.meetings ?? []

function NotFound({ onBack, message }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-10">
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" onClick={onBack}>
        <ChevronLeft className="size-4" /> Back to meetings
      </Button>
    </div>
  )
}

function StatusBanner() {
  return (
    <div className="shrink-0 border-b border-blue-200/60 bg-blue-50/60 px-6 py-2.5 flex items-center gap-2 text-xs text-blue-900">
      <Sparkles className="size-3.5 text-blue-700 shrink-0" />
      <span>
        <strong className="font-medium">AI draft generated</strong> · awaiting your review before routing to CEO
      </span>
    </div>
  )
}

function AgendaSidebar({ sections }) {
  return (
    <aside className="w-56 shrink-0 border-r border-border/60 bg-muted/20 overflow-y-auto">
      <div className="px-4 pt-4 pb-2">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Agenda</p>
      </div>
      <ul className="px-2 pb-4 space-y-0.5">
        {sections.map(s => (
          <li key={s.id}>
            <div className="flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-white/60 transition-colors">
              {s.approved ? (
                <CircleCheck className="size-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
              ) : (
                <Circle className="size-4 text-muted-foreground/40 shrink-0 mt-0.5" strokeWidth={2} />
              )}
              <div className="min-w-0 flex-1">
                <p className={cn(
                  'text-xs leading-snug',
                  s.approved ? 'text-foreground' : 'text-muted-foreground',
                )}>
                  <span className="font-medium tabular-nums">{s.number}.</span> {s.title}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}

function Run({ run }) {
  if (run.kind === 'insert') {
    return <span className="text-teal-700 underline decoration-teal-300 decoration-from-font underline-offset-2">{run.text}</span>
  }
  if (run.kind === 'delete') {
    return <span className="text-rose-600 line-through">{run.text}</span>
  }
  return <span>{run.text}</span>
}

function Paragraph({ runs }) {
  return (
    <p className="text-sm text-foreground leading-relaxed">
      {runs.map((run, i) => <Run key={i} run={run} />)}
    </p>
  )
}

function MinutesDocument({ meeting, minutes }) {
  return (
    <div className="max-w-3xl mx-auto bg-white border border-border/60 rounded-lg shadow-xs my-6 px-12 py-10 space-y-6">
      <div className="border-b border-border/60 pb-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Minutes — Draft</p>
        <h2 className="text-xl font-semibold text-foreground mt-1">{meeting.name}</h2>
        <p className="text-xs text-muted-foreground mt-1">{meeting.dateTime} · {meeting.attendees} attendees</p>
      </div>

      {minutes.sections.map(section => (
        <section key={section.id} className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">
            <span className="tabular-nums text-muted-foreground mr-1.5">{section.number}.</span>
            {section.title}
          </h3>

          {section.highlight ? (
            <div className="relative rounded-md border-l-2 border-blue-300 bg-blue-50/60 px-3 py-2 my-2">
              <div className="space-y-2">
                {section.paragraphs.map((para, i) => <Paragraph key={i} runs={para} />)}
              </div>
              {section.comment && (
                <div className="mt-2 inline-flex items-center gap-1 rounded border border-blue-200 bg-white px-2 py-1 text-[11px] text-blue-700 shadow-xs">
                  <Sparkles className="size-3 shrink-0" />
                  {section.comment}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {section.paragraphs.map((para, i) => <Paragraph key={i} runs={para} />)}
            </div>
          )}
        </section>
      ))}
    </div>
  )
}

const STEP_DOT = {
  in_review: 'bg-brand-700 ring-4 ring-brand-100',
  pending:   'bg-muted-foreground/30',
  done:      'bg-emerald-500',
}

const STEP_LABEL = {
  in_review: 'In Review',
  pending:   'Pending',
  done:      'Approved',
}

const STEP_LABEL_STYLE = {
  in_review: 'text-brand-700',
  pending:   'text-muted-foreground',
  done:      'text-emerald-700',
}

function ReviewWorkflowPanel({ minutes }) {
  return (
    <aside className="w-[320px] shrink-0 border-l border-border/60 bg-muted/20 overflow-y-auto">
      <div className="p-5 space-y-6">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Review workflow
          </p>
          <ol className="space-y-1">
            {minutes.workflow.map((step, idx) => {
              const isLast = idx === minutes.workflow.length - 1
              return (
                <li key={step.id} className="flex gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <span className={cn('size-3 rounded-full shrink-0', STEP_DOT[step.state])} />
                    {!isLast && <span className="w-px flex-1 bg-border/60 my-1 min-h-6" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium text-foreground leading-snug">{step.title}</p>
                    <p className={cn('text-xs mt-0.5', STEP_LABEL_STYLE[step.state])}>
                      {STEP_LABEL[step.state]}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        {minutes.confidence && (
          <div>
            <Badge
              variant="outline"
              className="h-6 px-2 text-[11px] border-emerald-200 bg-emerald-50 text-emerald-800 gap-1"
            >
              <Sparkles className="size-3" /> Draft quality: {minutes.confidence}
            </Badge>
          </div>
        )}

        {minutes.draftReadyAfter && (
          <p className="text-xs text-muted-foreground border-t border-border/60 pt-4">
            Draft ready {minutes.draftReadyAfter} after meeting ended
          </p>
        )}
      </div>
    </aside>
  )
}

export default function MeetingMinutesPage() {
  const { meetingId } = useParams()
  const navigate = useNavigate()
  const meeting = useMemo(() => MEETINGS.find(m => m.id === meetingId), [meetingId])

  if (!meeting) {
    return <NotFound onBack={() => navigate('/govern/meetings')} message="Meeting not found." />
  }
  if (!meeting.minutesDraft) {
    return <NotFound onBack={() => navigate(`/govern/meetings/${meeting.id}`)} message="Minutes not available for this meeting." />
  }

  const minutes = meeting.minutesDraft

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header bar */}
      <div className="shrink-0 border-b border-border/60 bg-background px-6 py-4">
        <button
          type="button"
          onClick={() => navigate('/govern/meetings')}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2"
        >
          <ChevronLeft className="size-3.5" /> All meetings
        </button>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {meeting.name} — Minutes Draft
            </h1>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3" /> {meeting.dateTime}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-3" /> {meeting.attendees} attendees
              </span>
            </div>
          </div>
        </div>
      </div>

      <StatusBanner />

      {/* 3-column body */}
      <div className="flex flex-1 overflow-hidden">
        <AgendaSidebar sections={minutes.sections} />

        <main className="flex-1 flex flex-col overflow-hidden bg-muted/30">
          <div className="flex-1 overflow-auto px-6">
            <MinutesDocument meeting={meeting} minutes={minutes} />
          </div>

          <div className="shrink-0 border-t border-border/60 bg-background px-6 py-3 flex items-center justify-end gap-2">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Download className="size-4" /> Download draft
            </Button>
            <Button size="sm" className="gap-1.5">
              <Check className="size-4" /> Approve and route to CEO
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </main>

        <ReviewWorkflowPanel minutes={minutes} />
      </div>
    </div>
  )
}
