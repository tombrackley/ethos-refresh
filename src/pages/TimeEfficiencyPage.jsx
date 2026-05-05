import { useState } from 'react'
import EthosAIPanel from '@/components/EthosAIPanel'
import Feature from '@/components/Feature'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Clock, Play, Pause, Plus, X, Sparkles, AlertTriangle, Timer, Briefcase,
  Users, TrendingUp, Zap, BarChart3, FileText, Pencil, ChevronDown,
} from 'lucide-react'
import tenant from '@/config/tenant'

const TIME_ENTRY = tenant.pages.timeEntry ?? { todayEntries: [], matters: [], weeklyGrid: { matters: [], daily: [] } }

// ─── Mock Data ──────────────────────────────────────────────────────────────

const EFFORT_MATTERS = [
  { name: 'Henderson v Clarke', client: 'Henderson Group', team: 4, hours: 142, maxHours: 200, badges: ['Rising'] },
  { name: 'Apex Acquisition', client: 'Apex Partners', team: 3, hours: 98, maxHours: 200 },
  { name: 'Meridian Compliance Review', client: 'Meridian Corp', team: 2, hours: 76, maxHours: 200, badges: ['Rising', 'Near limit'] },
  { name: 'Stanton IP Portfolio', client: 'Stanton Technologies', team: 2, hours: 54, maxHours: 200 },
  { name: 'Blackwood Estate', client: 'Blackwood Family Trust', team: 2, hours: 41, maxHours: 200 },
  { name: 'Grafton Development', client: 'Grafton Group', team: 3, hours: 37, maxHours: 200 },
]

const TEAM_MEMBERS = [
  { name: 'Sarah Mitchell', initials: 'SM', role: 'Senior Associate', matters: 8, workload: 95, tasksDue: 12, capacity: 'Overloaded' },
  { name: 'James Wong', initials: 'JW', role: 'Partner', matters: 6, workload: 72, tasksDue: 5, capacity: 'High' },
  { name: 'Emma Richardson', initials: 'ER', role: 'Associate', matters: 5, workload: 58, tasksDue: 8, capacity: 'Balanced' },
  { name: 'David Park', initials: 'DP', role: 'Senior Associate', matters: 7, workload: 91, tasksDue: 14, capacity: 'Overloaded' },
  { name: 'Lisa Chen', initials: 'LC', role: 'Associate', matters: 4, workload: 55, tasksDue: 3, capacity: 'Balanced' },
  { name: 'Michael Torres', initials: 'MT', role: 'Partner', matters: 5, workload: 74, tasksDue: 6, capacity: 'High' },
  { name: 'Rachel Adams', initials: 'RA', role: 'Junior Associate', matters: 3, workload: 42, tasksDue: 4, capacity: 'Balanced' },
  { name: 'Thomas Gray', initials: 'TG', role: 'Senior Associate', matters: 9, workload: 97, tasksDue: 16, capacity: 'Overloaded' },
]

const UNRECORDED_ITEMS = [
  { matter: 'Henderson v Clarke', confidence: 'High', desc: '14 emails sent/received, 3 document reviews', hours: 4.5 },
  { matter: 'Apex Acquisition', confidence: 'High', desc: 'Due diligence document drafting and revisions', hours: 6.2 },
  { matter: 'Meridian Compliance Review', confidence: 'Medium', desc: 'Regulatory document analysis and annotations', hours: 3.0 },
  { matter: 'Stanton IP Portfolio', confidence: 'Medium', desc: 'Patent correspondence and research emails', hours: 2.8 },
  { matter: 'Blackwood Estate', confidence: 'High', desc: 'Trust deed drafting and client briefing notes', hours: 5.1 },
]

const RECENT_ENTRIES = [
  { matter: 'Henderson v Clarke', desc: 'Client call and follow-up correspondence', duration: '1h 45m', date: 'Today' },
  { matter: 'Apex Acquisition', desc: 'Document review — due diligence pack', duration: '2h 10m', date: 'Today' },
  { matter: 'Meridian Compliance Review', desc: 'Regulatory update drafting', duration: '0h 30m', date: 'Yesterday' },
]

const PRODUCTIVITY_INSIGHTS = [
  { title: 'Manual status update emails', type: 'Low-Value Activity', impact: '~32 hrs/month', desc: 'Approximately 8 hours per week spent on routine status update emails across 12 matters.', matters: 'Multiple matters' },
  { title: 'Repeated document formatting', type: 'Repeat Task', impact: '~18 hrs/month', desc: 'Template-based documents being reformatted manually instead of using automation.', matters: 'Henderson v Clarke, Apex Acquisition' },
  { title: 'Client onboarding data entry', type: 'Automation Opportunity', impact: '~12 hrs/month', desc: 'KYC and client intake forms could be pre-populated using AI extraction from correspondence.', matters: 'Multiple matters' },
  { title: 'Meridian Compliance Review exceeding estimate', type: 'Exceeding Estimate', impact: '+29 hrs over estimate', desc: 'Actual effort is 38% above the original scope estimate. Consider re-scoping or flagging to client.', matters: 'Meridian Compliance Review' },
  { title: 'Meeting notes and task extraction', type: 'Automation Opportunity', impact: '~10 hrs/month', desc: 'AI agents could automatically extract action items from meeting recordings and calendar events.', matters: 'Multiple matters' },
]

const TABS = ['Time Entry', 'Effort Overview', 'Team Capacity', 'Unrecorded Work', 'Time Tracking', 'Productivity']

const AI_SUGGESTIONS = [
  { tab: 'all', type: 'risk', typeLabel: 'Capacity Risk', title: 'Status reporting overhead', description: 'Team is spending approximately 12% of recorded effort on manual status updates. Consider automated matter summaries.', priority: 'high', source: 'Effort Intelligence', status: 'new' },
  { tab: 'all', type: 'insight', typeLabel: 'Automation', title: 'Document assembly for Apex', description: 'Repetitive clauses identified in Apex Acquisition drafting. An AI agent could reduce drafting time by ~40%.', priority: 'high', source: 'Effort Intelligence', status: 'new' },
  { tab: 'all', type: 'risk', typeLabel: 'Capacity Risk', title: 'Sarah Mitchell at risk', description: 'Workload at 95% with 12 tasks due. Recommend redistributing 2 Henderson matters to Emma Richardson (55% capacity).', priority: 'high', source: 'Effort Intelligence', status: 'new' },
  { tab: 'all', type: 'insight', typeLabel: 'Insight', title: 'Henderson consuming 2x expected effort', description: 'Henderson v Clarke has consumed 142 of 200 budgeted hours with 40% of scope remaining. Flag for partner review.', priority: 'medium', source: 'Effort Intelligence', status: 'new' },
  { tab: 'all', type: 'insight', typeLabel: 'Automation', title: 'Email triage automation', description: '34% of emails across matters are routine acknowledgements and auto-categorise and suggest responses.', priority: 'medium', source: 'Effort Intelligence', status: 'new' },
  { tab: 'all', type: 'risk', typeLabel: 'Capacity Risk', title: 'Thomas Gray overloaded', description: '9 active matters at 97% capacity. Two matters due for completion next week — monitor closely.', priority: 'medium', source: 'Effort Intelligence', status: 'review' },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

function capacityColor(status) {
  if (status === 'Overloaded') return 'bg-red-100 text-red-700 border-red-200'
  if (status === 'High') return 'bg-amber-100 text-amber-700 border-amber-200'
  return 'bg-emerald-100 text-emerald-700 border-emerald-200'
}

function workloadBarColor(workload) {
  if (workload >= 90) return 'bg-red-500'
  if (workload >= 70) return 'bg-amber-500'
  return 'bg-emerald-500'
}

function insightTypeBadgeClass(type) {
  if (type === 'Low-Value Activity') return 'bg-amber-50 text-amber-700 border-amber-200'
  if (type === 'Repeat Task') return 'bg-blue-50 text-blue-700 border-blue-200'
  if (type === 'Automation Opportunity') return 'bg-purple-50 text-purple-700 border-purple-200'
  if (type === 'Exceeding Estimate') return 'bg-red-50 text-red-700 border-red-200'
  return 'bg-gray-50 text-gray-700 border-gray-200'
}

// ─── Page Component ─────────────────────────────────────────────────────────

export default function TimeEfficiencyPage() {
  const [activeTab, setActiveTab] = useState('Time Entry')

  return (
    <div className="flex flex-1">
      <div className="flex-1 px-6 pt-[60px] pb-6">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* ── Gradient Hero ─────────────────────────────────────── */}
          <div className="relative -mx-6 -mt-[60px] px-6 pt-[60px] pb-6">
            <div className="pointer-events-none absolute inset-0 left-[calc(-50vw+50%)] w-screen bg-gradient-to-b from-[rgba(209,250,229,0.1)] to-[#F9FAFB]" />
            <div className="relative space-y-6">

              {/* Header row */}
              <div className="flex items-end justify-end">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="h-6 gap-1 text-xs">
                    <Clock className="size-3" /> RescueTime
                  </Badge>
                  <Badge variant="outline" className="h-6 gap-1 text-xs">
                    <FileText className="size-3" /> Xero
                  </Badge>
                  <Badge variant="outline" className="h-6 gap-1 text-xs">
                    <Briefcase className="size-3" /> Microsoft 365 Calendar
                  </Badge>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-6 border-b border-border">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                      activeTab === tab
                        ? 'border-foreground text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Tab Content ───────────────────────────────────────── */}
          {activeTab === 'Time Entry' && <TimeEntryTab />}
          {activeTab === 'Effort Overview' && <EffortOverviewTab />}
          {activeTab === 'Team Capacity' && <TeamCapacityTab />}
          {activeTab === 'Unrecorded Work' && <UnrecordedWorkTab />}
          {activeTab === 'Time Tracking' && <TimeTrackingTab />}
          {activeTab === 'Productivity' && <ProductivityTab />}

        </div>
      </div>

      <Feature flag="FEATURE_AI_PANEL">
        <EthosAIPanel
          subtitle="Effort intelligence"
          contextLine={<>Showing <span className="font-semibold text-foreground">6 suggestions</span> based on team workload, effort data, and productivity patterns.</>}
          tabs={[
            { key: 'all', label: 'All', filter: () => true },
          ]}
          suggestions={AI_SUGGESTIONS}
        />
      </Feature>
    </div>
  )
}

// ─── Tab: Time Entry ────────────────────────────────────────────────────────

function formatDuration(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function TimeEntryTab() {
  const [entries, setEntries] = useState(TIME_ENTRY.todayEntries)
  const [running, setRunning] = useState(false)
  const [timerMatterId, setTimerMatterId] = useState(TIME_ENTRY.matters[0]?.id ?? null)
  const [timerDescription, setTimerDescription] = useState('')
  const [timerBillable, setTimerBillable] = useState(true)

  const totalMins = entries.reduce((n, e) => n + e.durationMinutes, 0)
  const billableMins = entries.filter(e => e.billable).reduce((n, e) => n + e.durationMinutes, 0)

  const timerMatter = TIME_ENTRY.matters.find(m => m.id === timerMatterId)

  function toggleBillable(id) {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, billable: !e.billable } : e))
  }

  return (
    <div className="space-y-6">

      {/* Top: entries left, timer right */}
      <div className="flex gap-6">

        {/* Today's entries */}
        <div className="flex-1 min-w-0 rounded-lg border border-border/60 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
            <div>
              <p className="text-sm font-medium text-foreground">Today's entries</p>
              <p className="text-xs text-muted-foreground">{formatDuration(totalMins)} total · {formatDuration(billableMins)} billable</p>
            </div>
            <Button size="sm" variant="outline" className="gap-1.5">
              <Plus className="size-3.5" /> Add entry
            </Button>
          </div>
          <div className="divide-y divide-border/60">
            {entries.length === 0 ? (
              <p className="text-sm text-muted-foreground p-6 text-center">No entries yet today.</p>
            ) : entries.map(e => (
              <div key={e.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{e.matterName}</p>
                  <p className="text-xs text-muted-foreground truncate">{e.description}</p>
                </div>
                <span className="text-sm text-foreground tabular-nums shrink-0">{formatDuration(e.durationMinutes)}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs ${e.billable ? 'text-emerald-700' : 'text-muted-foreground'}`}>{e.billable ? 'Billable' : 'Non-billable'}</span>
                  <Switch checked={e.billable} onCheckedChange={() => toggleBillable(e.id)} />
                </div>
                <Button variant="ghost" size="icon" className="size-7 shrink-0">
                  <Pencil className="size-3.5 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="w-[320px] shrink-0 rounded-lg border border-border/60 bg-white overflow-hidden">
          <div className="px-5 py-3 border-b border-border/60">
            <p className="text-sm font-medium text-foreground">Timer</p>
          </div>
          <div className="px-5 py-5 space-y-4">
            <div className="text-center">
              <p className="text-4xl font-medium tracking-tight tabular-nums text-foreground">
                {running ? '00:14:32' : '00:00:00'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{running ? 'Recording…' : 'Idle'}</p>
            </div>
            <Button
              onClick={() => setRunning(r => !r)}
              size="lg"
              className={`w-full gap-2 ${running ? 'bg-destructive hover:bg-destructive/90' : ''}`}
            >
              {running ? <Pause className="size-4" /> : <Play className="size-4" />}
              {running ? 'Stop' : 'Start'}
            </Button>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Matter</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between gap-2">
                    <span className="truncate">{timerMatter ? timerMatter.name : 'Select matter…'}</span>
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72">
                  {TIME_ENTRY.matters.map(m => (
                    <DropdownMenuItem key={m.id} onClick={() => setTimerMatterId(m.id)}>
                      <div>
                        <p className="text-sm">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.client}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</p>
              <Input
                value={timerDescription}
                onChange={e => setTimerDescription(e.target.value)}
                placeholder="What are you working on?"
                className="h-8 text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Billable</span>
              <Switch checked={timerBillable} onCheckedChange={setTimerBillable} />
            </div>
          </div>
        </div>

      </div>

      {/* Weekly summary grid */}
      <div className="rounded-lg border border-border/60 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
          <div>
            <p className="text-sm font-medium text-foreground">Weekly summary</p>
            <p className="text-xs text-muted-foreground">Week of {TIME_ENTRY.weeklyGrid.weekOf}</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 border-b border-border/60">
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider w-1/3">Matter</th>
                {TIME_ENTRY.weeklyGrid.daily.map(d => (
                  <th key={d.day} className="text-right px-3 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <div>{d.day}</div>
                    <div className="text-[10px] text-muted-foreground/60 normal-case font-normal">{d.date}</div>
                  </th>
                ))}
                <th className="text-right px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody>
              {TIME_ENTRY.weeklyGrid.matters.map(m => {
                const total = TIME_ENTRY.weeklyGrid.daily.reduce((n, d) => n + (d.hoursByMatter[m.id] ?? 0), 0)
                return (
                  <tr key={m.id} className="border-b border-border/40 last:border-0">
                    <td className="px-5 py-3 font-medium text-foreground truncate">{m.name}</td>
                    {TIME_ENTRY.weeklyGrid.daily.map(d => {
                      const h = d.hoursByMatter[m.id] ?? 0
                      return (
                        <td key={d.day} className={`px-3 py-3 text-right tabular-nums ${h > 0 ? 'text-foreground' : 'text-muted-foreground/40'}`}>
                          {h > 0 ? h.toFixed(1) : '—'}
                        </td>
                      )
                    })}
                    <td className="px-5 py-3 text-right font-medium tabular-nums text-foreground">{total.toFixed(1)}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-muted/30 border-t border-border/60">
                <td className="px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Daily total</td>
                {TIME_ENTRY.weeklyGrid.daily.map(d => {
                  const total = Object.values(d.hoursByMatter).reduce((a, b) => a + b, 0)
                  return (
                    <td key={d.day} className="px-3 py-2.5 text-right tabular-nums font-medium text-foreground">
                      {total > 0 ? total.toFixed(1) : '—'}
                    </td>
                  )
                })}
                <td className="px-5 py-2.5 text-right font-medium tabular-nums text-foreground">
                  {TIME_ENTRY.weeklyGrid.daily.reduce((n, d) => n + Object.values(d.hoursByMatter).reduce((a, b) => a + b, 0), 0).toFixed(1)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  )
}

// ─── Tab: Effort Overview ───────────────────────────────────────────────────

function EffortOverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="flex gap-4">
        <StatCard icon={Clock} value="1,247 hrs" label="Total Effort This Period" sublabel="Across 38 active matters" />
        <StatCard icon={AlertTriangle} value="~62 hrs" label="Unrecorded Work Detected" sublabel="AI estimated from activity" />
        <StatCard icon={Users} value="3 of 12" label="Capacity Pressure" sublabel="Team members overloaded" />
        <StatCard icon={Zap} value="78%" label="Effort Efficiency" sublabel="Recorded vs estimated total" />
      </div>

      {/* Highest Effort Matters */}
      <div className="rounded-[6px] border border-[#E2E8F0] bg-white p-6 space-y-6">
        <h2 className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">Highest Effort Matters</h2>
        <div className="space-y-4">
          {EFFORT_MATTERS.map((m) => (
            <div key={m.name} className="flex items-center gap-4">
              <div className="w-[240px] shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{m.name}</span>
                  {m.badges?.map((b) => (
                    <Badge key={b} variant="outline" className="h-5 text-[10px] px-1.5 border-amber-200 bg-amber-50 text-amber-700">
                      {b}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{m.client} · {m.team} team members</p>
              </div>
              <div className="flex-1 flex items-center gap-3">
                <div className="flex-1 h-2.5 rounded-full bg-[#f5f5f5] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-700 transition-all"
                    style={{ width: `${(m.hours / m.maxHours) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground w-16 text-right">{m.hours} hrs</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Team Capacity ─────────────────────────────────────────────────────

function TeamCapacityTab() {
  return (
    <div className="rounded-[6px] border border-[#E2E8F0] bg-white p-6 space-y-6">
      <h2 className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">Team Capacity</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[240px]">Team Member</TableHead>
            <TableHead className="text-center">Matters</TableHead>
            <TableHead className="w-[200px]">Workload</TableHead>
            <TableHead className="text-center">Tasks Due</TableHead>
            <TableHead>Capacity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {TEAM_MEMBERS.map((m) => (
            <TableRow key={m.name}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback className="text-xs bg-brand-100 text-brand-800">{m.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center text-sm">{m.matters}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-[#f5f5f5] overflow-hidden">
                    <div className={`h-full rounded-full ${workloadBarColor(m.workload)}`} style={{ width: `${m.workload}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{m.workload}%</span>
                </div>
              </TableCell>
              <TableCell className="text-center text-sm">{m.tasksDue}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`h-6 text-xs px-2 ${capacityColor(m.capacity)}`}>
                  {m.capacity}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ─── Tab: Unrecorded Work ───────────────────────────────────────────────────

function UnrecordedWorkTab() {
  const totalUnrecorded = UNRECORDED_ITEMS.reduce((sum, i) => sum + i.hours, 0)

  return (
    <div className="space-y-6">
      {/* Summary banner */}
      <div className="rounded-[6px] bg-[#153e40] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-emerald-300" />
          <span className="text-sm font-medium text-white">~62 hours of unrecorded effort detected across 5 matters this period</span>
        </div>
        <Progress value={(totalUnrecorded / 62) * 100} className="h-2 bg-white/20 [&>div]:bg-emerald-400" />
        <p className="text-xs text-white/70">{totalUnrecorded.toFixed(1)} hours identified from email, document, and calendar activity</p>
      </div>

      {/* Detected items */}
      <div className="rounded-[6px] border border-[#E2E8F0] bg-white p-6 space-y-4">
        <h2 className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">Detected Unrecorded Activity</h2>
        <div className="space-y-3">
          {UNRECORDED_ITEMS.map((item) => (
            <div key={item.matter} className="flex items-center gap-4 rounded-lg border border-[#E2E8F0] p-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{item.matter}</span>
                  <Badge
                    variant="outline"
                    className={`h-5 text-[10px] px-1.5 ${
                      item.confidence === 'High'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700'
                    }`}
                  >
                    {item.confidence} confidence
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <span className="text-sm font-medium text-foreground shrink-0">{item.hours}h</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button variant="outline" size="sm" className="h-7 text-xs">Add to Tasks</Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">Log Time</Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                  <X className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Time Tracking ─────────────────────────────────────────────────────

function TimeTrackingTab() {
  return (
    <div className="space-y-6">
      {/* Timer card */}
      <div className="rounded-[6px] border border-[#E2E8F0] bg-white p-6 space-y-6">
        <div className="flex flex-col items-center gap-6">
          {/* Large timer */}
          <div className="flex items-center gap-6">
            <span className="text-5xl font-light tracking-widest text-foreground font-mono">00:00:00</span>
            <button className="flex items-center justify-center size-14 rounded-full bg-brand-800 text-white hover:bg-brand-900 transition-colors">
              <Play className="size-6 ml-0.5" />
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 w-full max-w-lg">
            <div className="flex-1">
              <Input placeholder="Link to Matter" className="h-9" />
            </div>
            <div className="flex-1">
              <Input placeholder="Notes" className="h-9" />
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
              <Plus className="size-3.5" /> Manual Entry
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">Use where no external time recording system is connected.</p>
        </div>
      </div>

      {/* Recent entries */}
      <div className="rounded-[6px] border border-[#E2E8F0] bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">Recent Entries</h2>
          <span className="text-sm text-muted-foreground">Today: <span className="font-medium text-foreground">3h 55m</span></span>
        </div>
        <div className="space-y-3">
          {RECENT_ENTRIES.map((entry, idx) => (
            <div key={idx} className="flex items-center gap-4 rounded-lg border border-[#E2E8F0] p-4">
              <Timer className="size-4 text-muted-foreground shrink-0" />
              <div className="flex-1 space-y-0.5">
                <p className="text-sm font-medium text-foreground">{entry.matter}</p>
                <p className="text-xs text-muted-foreground">{entry.desc}</p>
              </div>
              <span className="text-sm font-medium text-foreground shrink-0">{entry.duration}</span>
              <span className="text-xs text-muted-foreground shrink-0">{entry.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Productivity ──────────────────────────────────────────────────────

function ProductivityTab() {
  return (
    <div className="rounded-[6px] border border-[#E2E8F0] bg-white p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">Productivity Insights</h2>
        <p className="text-sm text-muted-foreground">Opportunities to reduce low-value effort and improve overall efficiency.</p>
      </div>
      <div className="space-y-4">
        {PRODUCTIVITY_INSIGHTS.map((item) => (
          <div key={item.title} className="rounded-lg border border-[#E2E8F0] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{item.title}</span>
                <Badge variant="outline" className={`h-5 text-[10px] px-1.5 ${insightTypeBadgeClass(item.type)}`}>
                  {item.type}
                </Badge>
              </div>
              <span className="text-sm font-medium text-foreground">{item.impact}</span>
            </div>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
            <p className="text-xs text-muted-foreground">Related: <span className="font-medium text-foreground">{item.matters}</span></p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({ icon, value, label, sublabel }) {
  const IconComp = icon
  return (
    <div className="flex-1 rounded-[8px] border border-[#f5f5f5] bg-white p-4 space-y-1">
      <div className="flex items-center gap-2">
        <IconComp className="size-4 text-muted-foreground" />
        <span className="text-[17px] font-medium text-foreground">{value}</span>
      </div>
      <p className="text-xs text-[rgba(10,10,10,0.6)]">{label}</p>
      <p className="text-xs text-[rgba(10,10,10,0.6)]">{sublabel}</p>
    </div>
  )
}
