import { useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { AiSummaryBar } from '@/components/shared/AiSummaryBar'
import { MeetingsTable } from '@/components/shared/MeetingsTable'
import { BoardPapersDirectorView } from '@/components/shared/BoardPapersDirectorView'
import Feature from '@/components/Feature'
import {
  ChevronLeft, FileText, CheckCircle2, Megaphone,
  Clock, Users, ListChecks, Sparkles, X, Flag,
  Calendar, MapPin, Landmark,
} from 'lucide-react'
import tenant from '@/config/tenant'

const t = tenant.pages.govern
const BOARDS = t.boards ?? []
const BOARDS_COMMITTEES = t.boardsCommittees ?? []
const AI_POINTS = t.aiPoints ?? []
const AI_ACTIONS = t.aiActions ?? []

const priorityStyle = {
  High:   'border-amber-300 bg-amber-50 text-amber-700',
  Medium: 'border-slate-200 bg-slate-50 text-slate-600',
  Low:    'border-slate-200 bg-slate-50 text-slate-400',
}

const HEALTH_DOT = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-400',
  red:   'bg-destructive',
}

const ACTIVITY = [
  { kind: 'paper',        title: 'Q1 Financial pack circulated',          actor: 'David Park',      when: '2h ago' },
  { kind: 'action',       title: 'Whistleblower policy review approved',   actor: 'Sarah Mitchell',  when: 'Yesterday' },
  { kind: 'announcement', title: 'Chair update: ASIC consultation submitted', actor: 'Margaret Chen', when: '2 days ago' },
  { kind: 'paper',        title: 'Risk appetite statement (draft v3)',     actor: 'Laura Singh',     when: '3 days ago' },
  { kind: 'action',       title: 'Director independence declarations completed', actor: 'David Park', when: '4 days ago' },
  { kind: 'paper',        title: 'Strategy offsite minutes uploaded',      actor: 'James Whitfield', when: '5 days ago' },
  { kind: 'announcement', title: 'New committee member onboarded',          actor: 'Margaret Chen',   when: '1 week ago' },
]

const ACTIVITY_ICON = {
  paper:        FileText,
  action:       CheckCircle2,
  announcement: Megaphone,
}

const ACTIVITY_TONE = {
  paper:        'text-brand-700 bg-brand-50',
  action:       'text-emerald-700 bg-emerald-50',
  announcement: 'text-amber-700 bg-amber-50',
}

const QUICK_TILES = [
  { id: 'documents', label: 'Documents', icon: FileText,    count: 38 },
  { id: 'actions',   label: 'Actions',   icon: ListChecks,  count: 7  },
  { id: 'members',   label: 'Members',   icon: Users,       count: 9  },
]

const TAB_VALUES = ['home', 'stakeholders', 'meetings', 'documents', 'actions', 'announcements']
const TAB_LABELS = {
  home:          'Home',
  stakeholders:  'Stakeholder Map',
  meetings:      'Meetings',
  documents:     'Documents',
  actions:       'Actions',
  announcements: 'Announcements',
}

function findBoard(id) {
  return BOARDS.find(b => b.id === id) ?? BOARDS_COMMITTEES.find(b => b.id === id) ?? null
}

function buildUpcomingMeetings(board) {
  if (!board) return []
  const seed = board.nextMeeting ? [{ label: 'Regular meeting', date: board.nextMeeting }] : []
  return [
    ...seed,
    { label: 'Strategy session',           date: '08 May 2026' },
    { label: 'Audit & risk update',         date: '22 May 2026' },
    { label: 'Quarterly governance review', date: '12 Jun 2026' },
  ].slice(0, 4)
}

function ActivityItem({ item }) {
  const Icon = ACTIVITY_ICON[item.kind] ?? FileText
  const tone = ACTIVITY_TONE[item.kind] ?? ACTIVITY_TONE.paper
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/60 last:border-0">
      <div className={`size-7 rounded-md flex items-center justify-center shrink-0 ${tone}`}>
        <Icon className="size-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground leading-snug">{item.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{item.actor} · {item.when}</p>
      </div>
    </div>
  )
}

function PlaceholderTab({ label }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground mt-1">Coming soon.</p>
    </div>
  )
}

function BoardActions({ priorities }) {
  if (priorities.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">No actions.</p>
      </div>
    )
  }
  return (
    <div className="border border-border/60 rounded bg-white overflow-hidden">
      <div className="px-5 py-4 space-y-2">
        {priorities.map(p => (
          <div key={p.label} className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5">
            <Badge variant="outline" className={`text-xs h-5 px-1.5 shrink-0 ${priorityStyle[p.urgency]}`}>
              {p.urgency.toUpperCase()}
            </Badge>
            <p className="flex-1 text-sm font-medium text-foreground min-w-0 truncate">{p.label}</p>
            <span className="text-xs text-muted-foreground shrink-0">{p.due}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function GovernAiPanel({ onClose }) {
  return (
    <div className="flex flex-col w-[380px] shrink-0 border-l border-border overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-brand-600" />
          <span className="text-sm font-medium text-foreground">Board Analysis</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="size-7 text-muted-foreground">
          <X className="size-4" />
        </Button>
      </div>
      <div className="flex-1 px-5 py-4 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Flag className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Suggested Actions</h3>
            <Badge variant="secondary" className="text-xs h-4 px-1.5 ml-auto">{AI_ACTIONS.length} items</Badge>
          </div>
          <div className="space-y-2">
            {AI_ACTIONS.map(a => (
              <div key={a.title} className="rounded-lg border border-border p-3.5 space-y-1.5">
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
      </div>
    </div>
  )
}

export default function BoardDetailPage() {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const board = findBoard(boardId)
  if (!board) return <Navigate to="/govern/boards-committees" replace />

  const upcomingMeetings = buildUpcomingMeetings(board)
  const memberCount = board.memberCount ?? QUICK_TILES.find(q => q.id === 'members')?.count ?? 0
  const quickTiles = QUICK_TILES.map(tile =>
    tile.id === 'members' ? { ...tile, count: memberCount } : tile,
  )

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Back link */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/govern/boards-committees')}
            className="gap-1 -ml-2 h-7 text-muted-foreground"
          >
            <ChevronLeft className="size-3.5" /> All boards &amp; committees
          </Button>

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground truncate">
                  {board.name}
                </h1>
                {board.health && (
                  <span
                    className={`size-2.5 rounded-full shrink-0 ${HEALTH_DOT[board.health] ?? 'bg-muted'}`}
                    title={board.health}
                  />
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {board.type && (
                  <Badge variant="outline" className="text-xs h-5 px-1.5">{board.type}</Badge>
                )}
                {board.jurisdiction && (
                  <span className="flex items-center gap-1"><MapPin className="size-3" /> {board.jurisdiction}</span>
                )}
                {board.cadence && (
                  <span className="flex items-center gap-1"><Calendar className="size-3" /> {board.cadence}</span>
                )}
                {memberCount > 0 && (
                  <span className="flex items-center gap-1"><Users className="size-3" /> {memberCount} members</span>
                )}
              </div>
              {board.description && (
                <p className="text-sm text-muted-foreground mt-2 max-w-3xl">{board.description}</p>
              )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="home" className="w-full">
            <TabsList variant="line" className="border-b border-border w-full justify-start">
              {TAB_VALUES.map(v => (
                <TabsTrigger key={v} value={v} className="h-9 px-4 text-sm grow-0 basis-auto">
                  {TAB_LABELS[v]}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Home — board portal landing */}
            <TabsContent value="home" className="mt-6 focus-visible:outline-none">
              <div className="grid grid-cols-12 gap-6">

                {/* Left: Activity feed */}
                <section className="col-span-4 border border-border/60 rounded bg-white overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                    <p className="text-sm font-medium text-foreground">Activity</p>
                    <span className="text-xs text-muted-foreground">{ACTIVITY.length} updates</span>
                  </div>
                  <div className="px-5 py-2">
                    {ACTIVITY.map((item, i) => (
                      <ActivityItem key={i} item={item} />
                    ))}
                  </div>
                </section>

                {/* Centre: Insight line + about */}
                <section className="col-span-5 space-y-6">
                  <Feature flag="FEATURE_AI_SUMMARY_BAR">
                    <AiSummaryBar
                      points={AI_POINTS}
                      onOpenDrawer={() => setDrawerOpen(true)}
                    />
                  </Feature>

                  <div className="border border-border/60 rounded bg-white overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                      <div className="flex items-center gap-2">
                        <Landmark className="size-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">About</p>
                      </div>
                    </div>
                    <div className="px-5 py-4 space-y-3 text-sm">
                      {board.description && (
                        <p className="text-muted-foreground leading-relaxed">{board.description}</p>
                      )}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {board.type && (
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Type</p>
                            <p className="text-foreground mt-0.5">{board.type}</p>
                          </div>
                        )}
                        {board.jurisdiction && (
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Jurisdiction</p>
                            <p className="text-foreground mt-0.5">{board.jurisdiction}</p>
                          </div>
                        )}
                        {board.cadence && (
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Cadence</p>
                            <p className="text-foreground mt-0.5">{board.cadence}</p>
                          </div>
                        )}
                        {memberCount > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Members</p>
                            <p className="text-foreground mt-0.5">{memberCount}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Right: Upcoming meetings + Quick access */}
                <aside className="col-span-3 space-y-6">
                  <div className="border border-border/60 rounded bg-white overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">Upcoming meetings</p>
                      </div>
                    </div>
                    <div className="px-5 py-3 space-y-2">
                      {upcomingMeetings.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">No meetings scheduled.</p>
                      ) : upcomingMeetings.map((m, i) => (
                        <div key={i} className="flex items-start justify-between gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5">
                          <p className="text-sm text-foreground min-w-0 truncate">{m.label}</p>
                          <span className="text-xs text-muted-foreground shrink-0">{m.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Quick access</p>
                    <div className="grid grid-cols-3 gap-2">
                      {quickTiles.map(tile => {
                        const Icon = tile.icon
                        return (
                          <button
                            key={tile.id}
                            type="button"
                            className="flex flex-col items-start gap-2 rounded-lg border border-border/60 bg-white px-3 py-3 hover:bg-muted/40 transition-colors text-left"
                          >
                            <Icon className="size-4 text-muted-foreground" />
                            <div>
                              <p className="text-lg font-medium text-foreground leading-none">{tile.count}</p>
                              <p className="text-xs text-muted-foreground mt-1">{tile.label}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </aside>

              </div>
            </TabsContent>

            <TabsContent value="stakeholders" className="mt-6 focus-visible:outline-none">
              <PlaceholderTab label="Stakeholder Map" />
            </TabsContent>
            <TabsContent value="meetings" className="mt-6 focus-visible:outline-none">
              <MeetingsTable
                boardId={board.id}
                onRowClick={(m) => navigate(m.minutesDraft ? `/govern/meetings/${m.id}/minutes` : `/govern/meetings/${m.id}`)}
              />
            </TabsContent>
            <TabsContent value="documents" className="mt-6 focus-visible:outline-none">
              <BoardPapersDirectorView boardId={board.id} />
            </TabsContent>
            <TabsContent value="actions" className="mt-6 focus-visible:outline-none">
              <BoardActions priorities={t.priorities ?? []} />
            </TabsContent>
            <TabsContent value="announcements" className="mt-6 focus-visible:outline-none">
              <PlaceholderTab label="Announcements" />
            </TabsContent>
          </Tabs>

        </div>
      </div>

      {/* AI analysis push panel */}
      <div className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${drawerOpen ? 'w-[380px]' : 'w-0'}`}>
        <GovernAiPanel onClose={() => setDrawerOpen(false)} />
      </div>
    </div>
  )
}
