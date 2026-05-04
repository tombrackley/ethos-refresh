import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, TrendingDown, Minus,
  Sparkles, X, ListChecks, Flag,
  Clock, Users, Landmark, ChevronRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AiSummaryBar } from '@/components/shared/AiSummaryBar'
import Feature from '@/components/Feature'
import tenant from '@/config/tenant'

const t = tenant.pages.govern

const AI_POINTS    = t.aiPoints ?? []
const AI_ACTIONS   = t.aiActions ?? []
const PRIORITIES   = t.priorities ?? []
const KPIS         = t.kpis ?? []
const BOARDS       = t.boards ?? []

const priorityStyle = {
  High:   'border-amber-300 bg-amber-50 text-amber-700',
  Medium: 'border-slate-200 bg-slate-50 text-slate-600',
  Low:    'border-slate-200 bg-slate-50 text-slate-400',
}

const MONTH_INDEX = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 }

function parseMeetingDate(str) {
  // Format: "28 Mar 2026"
  const [day, mon, year] = (str ?? '').split(' ')
  const m = MONTH_INDEX[mon]
  if (m == null || !day || !year) return null
  return new Date(Number(year), m, Number(day))
}

function Delta({ dir, delta, invert }) {
  const up   = invert ? 'text-destructive' : 'text-emerald-700'
  const down = invert ? 'text-emerald-700' : 'text-destructive'
  if (!delta) return null
  if (dir === 'up')   return <span className={`flex items-center gap-0.5 text-xs ${up}`}><TrendingUp className="size-3" />{delta}</span>
  if (dir === 'down') return <span className={`flex items-center gap-0.5 text-xs ${down}`}><TrendingDown className="size-3" />{delta}</span>
  return <span className="flex items-center gap-0.5 text-xs text-muted-foreground"><Minus className="size-3" />{delta}</span>
}

function GovernAiPanel({ onClose }) {
  return (
    <div className="flex flex-col w-[380px] shrink-0 border-l border-border overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-brand-600" />
          <span className="text-sm font-medium text-foreground">Governance Analysis</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="size-7 text-muted-foreground">
          <X className="size-4" />
        </Button>
      </div>

      <div className="flex-1 px-5 py-4 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ListChecks className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Suggested Actions</h3>
            <Badge variant="secondary" className="text-xs h-4 px-1.5 ml-auto">{AI_ACTIONS.length} items</Badge>
          </div>
          <div className="space-y-2">
            {AI_ACTIONS.map(a => (
              <div key={a.title} className="rounded-lg border border-border p-3.5 space-y-1.5 hover:bg-muted/40 transition-colors cursor-pointer">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <Badge variant="outline" className={`text-xs h-4 px-1.5 shrink-0 ${priorityStyle[a.priority]}`}>
                    {a.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Flag className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Priorities Overview</h3>
          </div>
          <div>
            {PRIORITIES.map(p => (
              <div key={p.label} className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`size-1.5 rounded-full shrink-0 ${p.urgency === 'High' ? 'bg-amber-400' : p.urgency === 'Medium' ? 'bg-muted-foreground/40' : 'bg-muted-foreground/20'}`} />
                  <p className="text-xs text-foreground truncate">{p.label}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{p.due}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GovernPage() {
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const upcomingMeetings = [...BOARDS]
    .filter(b => b.nextMeeting)
    .sort((a, b) => {
      const da = parseMeetingDate(a.nextMeeting)
      const db = parseMeetingDate(b.nextMeeting)
      if (!da) return 1
      if (!db) return -1
      return da - db
    })
    .slice(0, 4)

  const totalMembers = BOARDS.reduce((n, b) => n + (b.memberCount ?? 0), 0)
  const committees = BOARDS.filter(b => /committee/i.test(b.name))

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Govern</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Governance health, upcoming meetings, and open actions across all boards.
              </p>
            </div>
          </div>

          {/* AI Summary */}
          <Feature flag="FEATURE_AI_SUMMARY_BAR">
            <AiSummaryBar points={AI_POINTS} onOpenDrawer={() => setDrawerOpen(true)} />
          </Feature>

          {/* KPI row */}
          <div className="grid grid-cols-4 divide-x divide-border/60 border border-border/60 rounded overflow-hidden bg-white">
            {KPIS.map(k => (
              <div key={k.label} className="px-5 py-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">{k.label}</p>
                <p className={`font-medium tracking-tight mb-1.5 ${k.primary ? 'text-3xl text-brand-800' : 'text-2xl text-foreground'}`}>{k.value}</p>
                <Delta dir={k.dir} delta={k.delta} invert={k.invert} />
              </div>
            ))}
          </div>

          {/* Main + right rail */}
          <div className="flex gap-6">
            {/* Governance tasks */}
            <div className="flex-1 min-w-0 border border-border/60 rounded bg-white overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <ListChecks className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Governance Tasks</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                  View all <ChevronRight className="size-3.5" />
                </Button>
              </div>
              <div className="px-5 py-4 space-y-2">
                {PRIORITIES.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No tasks.</p>
                ) : PRIORITIES.map(p => (
                  <div key={p.label} className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 hover:bg-muted/40 transition-colors cursor-pointer">
                    <Badge variant="outline" className={`text-xs h-5 px-1.5 shrink-0 ${priorityStyle[p.urgency]}`}>
                      {p.urgency.toUpperCase()}
                    </Badge>
                    <p className="flex-1 text-sm font-medium text-foreground min-w-0 truncate">{p.label}</p>
                    <span className="text-xs text-muted-foreground shrink-0">{p.due}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming board meetings */}
            <aside className="w-80 shrink-0 border border-border/60 rounded bg-white overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Upcoming Board Meetings</p>
                </div>
              </div>
              <div className="px-5 py-4 space-y-2">
                {upcomingMeetings.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No upcoming meetings.</p>
                ) : upcomingMeetings.map(b => (
                  <div
                    key={b.id}
                    onClick={() => navigate(`/govern/boards/${b.id}`)}
                    className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{b.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{b.cadence}</p>
                    </div>
                    <span className="text-xs text-foreground/80 shrink-0">{b.nextMeeting}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          {/* Governance structure */}
          <div className="border border-border/60 rounded bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Landmark className="size-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Governance Structure</p>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border/60">
              <div className="px-5 py-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Boards & Committees</p>
                <p className="text-2xl font-medium text-foreground">{BOARDS.length}</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Members</p>
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-muted-foreground" />
                  <p className="text-2xl font-medium text-foreground">{totalMembers}</p>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Committees</p>
                {committees.length === 0 ? (
                  <p className="text-sm text-muted-foreground">None</p>
                ) : (
                  <ul className="space-y-1">
                    {committees.map(c => (
                      <li key={c.id} className="text-sm text-foreground truncate">{c.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* AI analysis push panel */}
      <div className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${drawerOpen ? 'w-[380px]' : 'w-0'}`}>
        <GovernAiPanel onClose={() => setDrawerOpen(false)} />
      </div>
    </div>
  )
}
