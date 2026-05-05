import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar, Clock, MapPin, FileText, Files, FileCheck2, CheckCircle2, Plus, Users, Hourglass,
} from 'lucide-react'
import tenant from '@/config/tenant'

// ─── Data ─────────────────────────────────────────────────────────────────────

const t = tenant.pages.meet

const SUMMARY_POINTS = t.summaryPoints
const UPCOMING = t.upcoming
const PAST = t.past

// ─── Sub-components ───────────────────────────────────────────────────────────

function DocCell({ available, Icon }) {
  return (
    <div className="w-[100px] flex justify-center shrink-0">
      {available
        ? <div className="flex size-9 items-center justify-center rounded-lg bg-brand-100">
            <Icon className="size-4 text-brand-700" />
          </div>
        : <span className="text-muted-foreground/40 text-base leading-none mt-2">—</span>
      }
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MeetPage() {
  const [tab, setTab] = useState('upcoming')
  const meetings = tab === 'upcoming' ? UPCOMING : PAST

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-end">
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 h-9 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              View Live Meeting
            </button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-sm">
              <Calendar className="size-4" /> Calendar
            </Button>
            <Button size="sm" className="h-9 gap-1.5 text-sm">
              <Plus className="size-4" /> Schedule Meeting
            </Button>
          </div>
        </div>

        {/* Meetings Overview */}
        <div className="border border-border/60 rounded overflow-hidden bg-white">
          <div className="px-5 py-3 border-b border-border/60">
            <p className="text-sm font-medium text-foreground">Meetings Overview</p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-border/60">

            {/* Stats + Efficiency */}
            <div className="col-span-2 p-5 space-y-5">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Time in meetings</p>
                  <p className="text-3xl font-semibold text-foreground tabular-nums">2.5hr</p>
                  <p className="text-xs text-muted-foreground mt-1">avg. last 30 days</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Actions Complete</p>
                  <p className="text-3xl font-semibold text-foreground tabular-nums">3</p>
                  <p className="text-xs text-muted-foreground mt-1">avg. last 30 days</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Meeting Efficiency Rating</p>
                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 rounded px-2.5 py-1 text-xs font-medium">
                  <CheckCircle2 className="size-3.5" /> Good
                </span>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Strong preparation and focused agendas are improving decision speed.
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Meetings Summary</p>
              <ul className="space-y-2.5">
                {SUMMARY_POINTS.map((pt, i) => (
                  <li key={i} className="flex gap-2 items-start text-xs text-foreground/80 leading-relaxed">
                    <span className="mt-1.5 size-1 rounded-full bg-muted-foreground/40 shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Your Meetings */}
        <div className="border border-border/60 rounded overflow-hidden bg-white">

          {/* Card header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
            <p className="text-sm font-medium text-foreground">Your Meetings</p>
          </div>

          {/* Tabs + filter */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
            <div className="flex items-center gap-1">
              {['upcoming', 'past'].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 h-7 rounded-full text-xs font-medium capitalize transition-colors ${
                    tab === t
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 border border-border rounded px-3 h-7 text-xs text-muted-foreground hover:bg-muted transition-colors">
              <Calendar className="size-3.5" /> Next 30 days
            </button>
          </div>

          {/* Column headers */}
          <div className="flex items-center px-5 py-2 border-b border-border/60">
            <div className="flex items-center gap-4 flex-1">
              <span className="text-xs font-medium text-muted-foreground w-[72px] shrink-0">Date</span>
              <span className="text-xs font-medium text-muted-foreground">Details</span>
            </div>
            <span className="text-xs font-medium text-muted-foreground w-[100px] text-center shrink-0">Agenda</span>
            <span className="text-xs font-medium text-muted-foreground w-[100px] text-center shrink-0">Board Pack</span>
            <span className="text-xs font-medium text-muted-foreground w-[100px] text-center shrink-0">Minutes</span>
          </div>

          {/* Meeting rows */}
          <div className="divide-y divide-border/60">
            {meetings.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 cursor-pointer transition-colors"
              >
                {/* Date block */}
                <div className="flex flex-col items-center justify-center border border-border/60 rounded w-[72px] py-2 shrink-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground leading-none">{m.month}</span>
                  <span className="text-2xl font-bold text-foreground leading-tight tabular-nums">{m.day}</span>
                  <span className="text-xs text-muted-foreground leading-none">{m.year}</span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                    {m.type && (
                      <Badge variant="outline" className="text-xs h-4 px-1.5 shrink-0">{m.type}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3 shrink-0" /> {m.time}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3 shrink-0" /> {m.location}
                    </span>
                    {m.attendees != null && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="size-3 shrink-0" /> {m.attendees}
                      </span>
                    )}
                    {m.ageDays != null && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Hourglass className="size-3 shrink-0" />
                        {tab === 'upcoming' ? `in ${m.ageDays}d` : `${m.ageDays}d ago`}
                      </span>
                    )}
                    {m.status && (
                      <Badge variant="outline" className="text-xs h-4 px-1.5">{m.status}</Badge>
                    )}
                  </div>
                </div>

                {/* Doc availability */}
                <DocCell available={m.hasAgenda}     Icon={FileText}   />
                <DocCell available={m.hasBoardPack}  Icon={Files}      />
                <DocCell available={m.hasMinutes}    Icon={FileCheck2} />
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  )
}
