import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Download, ChevronDown, Calendar,
} from 'lucide-react'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const DATE_RANGES = ['Last 30 days', 'Last 90 days', 'Last 12 months', 'All time']

const TABS = ['Registrations', 'Activity', 'Completions', 'Engagement']

const TYPE_BADGES = {
  'Learning Journey': 'bg-teal-50 text-teal-700',
  'CPD Event':        'bg-amber-50 text-amber-700',
  'Knowledge Centre': 'bg-blue-50 text-blue-700',
  'Handbook':         'bg-purple-50 text-purple-700',
}

const STATUS_COLORS = {
  Enrolled:   'bg-emerald-50 text-emerald-700',
  Waitlisted: 'bg-amber-50 text-amber-700',
  Completed:  'bg-blue-50 text-blue-700',
  Withdrawn:  'bg-gray-100 text-gray-600',
}

const REGISTRATIONS = [
  { name: 'Sarah Chen',    program: 'Corporate Governance Fundamentals', type: 'Learning Journey', date: '15 Jan 2026', status: 'Enrolled' },
  { name: 'David Park',    program: 'AML Compliance Workshop',           type: 'CPD Event',        date: '18 Jan 2026', status: 'Enrolled' },
  { name: 'James Wilson',  program: 'Data Privacy Masterclass',          type: 'Learning Journey', date: '10 Jan 2026', status: 'Completed' },
  { name: 'Laura Singh',   program: 'Board Effectiveness Seminar',      type: 'CPD Event',        date: '20 Jan 2026', status: 'Waitlisted' },
  { name: 'John Jones',    program: 'ESG & Sustainability Reporting',    type: 'Learning Journey', date: '5 Jan 2026',  status: 'Enrolled' },
  { name: 'Margaret Chen', program: 'Corporate Governance Masterclass',  type: 'CPD Event',        date: '12 Jan 2026', status: 'Enrolled' },
  { name: 'Sue Smith',     program: 'AML Compliance Essentials',         type: 'Learning Journey', date: '8 Jan 2026',  status: 'Completed' },
  { name: 'David Park',    program: 'Risk Management Framework',         type: 'Knowledge Centre', date: '22 Jan 2026', status: 'Enrolled' },
]

const RECENT_ACTIVITY = [
  { user: 'Sarah Chen',    action: 'Viewed',          content: 'Duties Handbook: Core Statutory Duties',     datetime: '10 Mar 2026, 9:15am' },
  { user: 'David Park',    action: 'Completed Quiz',  content: 'Banking Regulation Course',                  datetime: '10 Mar 2026, 8:42am' },
  { user: 'James Wilson',  action: 'Started Module',  content: 'Data Privacy Masterclass: Module 3',         datetime: '9 Mar 2026, 4:30pm' },
  { user: 'Laura Singh',   action: 'Downloaded',      content: 'ESG Reporting Guide',                        datetime: '9 Mar 2026, 2:15pm' },
  { user: 'John Jones',    action: 'Completed Quiz',  content: 'Duties Handbook: Introduction',              datetime: '9 Mar 2026, 11:00am' },
  { user: 'Margaret Chen', action: 'Viewed',          content: 'AI Governance Framework',                    datetime: '8 Mar 2026, 3:45pm' },
  { user: 'Sue Smith',     action: 'Started Journey', content: 'AML Compliance Essentials',                  datetime: '8 Mar 2026, 10:20am' },
  { user: 'David Park',    action: 'Viewed',          content: 'Risk Management Framework',                  datetime: '7 Mar 2026, 1:30pm' },
]

const COMPLETIONS = [
  { name: 'James Wilson',  program: 'Data Privacy Masterclass',           type: 'Learning Journey', progress: 100, date: '22 Feb 2026',  score: '92%' },
  { name: 'Sue Smith',     program: 'AML Compliance Essentials',          type: 'Learning Journey', progress: 100, date: '1 Mar 2026',   score: '88%' },
  { name: 'Sarah Chen',    program: 'Corporate Governance Fundamentals',  type: 'Learning Journey', progress: 75,  date: 'In Progress',  score: '85%' },
  { name: 'David Park',    program: 'Banking Regulation Course',          type: 'Knowledge Centre', progress: 60,  date: 'In Progress',  score: '78%' },
  { name: 'John Jones',    program: 'ESG & Sustainability Reporting',     type: 'Learning Journey', progress: 45,  date: 'In Progress',  score: '--' },
  { name: 'Laura Singh',   program: 'Board Effectiveness Case Studies',   type: 'Knowledge Centre', progress: 100, date: '5 Mar 2026',   score: '91%' },
  { name: 'Margaret Chen', program: 'Duties Handbook Quiz',               type: 'Handbook',         progress: 100, date: '8 Mar 2026',   score: '95%' },
  { name: 'David Park',    program: 'AML Compliance Workshop',            type: 'CPD Event',        progress: 100, date: '28 Feb 2026',  score: '82%' },
]

const ENGAGEMENT_DATA = [
  { content: 'Duties Handbook',                    type: 'Handbook',         views: 342, avgTime: '18 min', quizRate: '89%', score: 9.2 },
  { content: 'Corporate Governance Fundamentals',  type: 'Learning Journey', views: 256, avgTime: '32 min', quizRate: '76%', score: 8.8 },
  { content: 'AML Compliance Workshop',            type: 'CPD Event',        views: 198, avgTime: '45 min', quizRate: '92%', score: 8.5 },
  { content: 'AI Governance Framework',            type: 'Knowledge Centre', views: 167, avgTime: '12 min', quizRate: '--',  score: 7.9 },
  { content: 'Data Privacy Masterclass',           type: 'Learning Journey', views: 145, avgTime: '28 min', quizRate: '81%', score: 7.6 },
  { content: 'Banking Regulation Course',          type: 'Knowledge Centre', views: 132, avgTime: '15 min', quizRate: '68%', score: 7.2 },
  { content: 'Risk Management Framework',          type: 'Knowledge Centre', views: 98,  avgTime: '8 min',  quizRate: '--',  score: 6.8 },
  { content: 'ESG Reporting Module',               type: 'Knowledge Centre', views: 54,  avgTime: '6 min',  quizRate: '45%', score: 5.1 },
]

// ─── Badge Helper ─────────────────────────────────────────────────────────────

function TypeBadge({ type }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${TYPE_BADGES[type] || 'bg-gray-100 text-gray-700'}`}>
      {type}
    </span>
  )
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

// ─── Summary Card ─────────────────────────────────────────────────────────────

function SummaryCard({ label, value }) {
  return (
    <div className="border border-border/60 rounded px-5 py-4 bg-white">
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">{label}</p>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminLearnReportingPage() {
  const [activeTab, setActiveTab] = useState('Registrations')
  const [dateRange, setDateRange] = useState('Last 30 days')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Learn Reporting</h1>
          <p className="text-sm text-muted-foreground mt-1">Track registrations, activity, completion, and engagement across learning programs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="size-3.5 mr-1.5" />
            Export Report
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="size-3.5 mr-1.5" />
                {dateRange}
                <ChevronDown className="size-3.5 ml-1.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {DATE_RANGES.map(r => (
                <DropdownMenuItem key={r} onClick={() => setDateRange(r)}>{r}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 divide-x divide-border/60 border border-border/60 rounded overflow-hidden bg-white">
        <div className="px-5 py-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Active Learners</p>
          <p className="text-2xl font-semibold text-foreground tracking-tight">47</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">+12%</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Avg. Completion Rate</p>
          <p className="text-2xl font-semibold text-brand-700 tracking-tight">73%</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Total CPD Hours Logged</p>
          <p className="text-2xl font-semibold text-foreground tracking-tight">1,284</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Engagement Score</p>
          <p className="text-2xl font-semibold text-foreground tracking-tight">8.2/10</p>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex items-center gap-1 border-b border-border pb-0">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-2 text-sm font-medium rounded-t transition-colors ${
              activeTab === tab
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─── Registrations Tab ──────────────────────────────────────────── */}
      {activeTab === 'Registrations' && (
        <div className="border border-border rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>Name</TableHead>
                <TableHead>Program / Event</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Registered Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {REGISTRATIONS.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.program}</TableCell>
                  <TableCell><TypeBadge type={r.type} /></TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ─── Activity Tab ───────────────────────────────────────────────── */}
      {activeTab === 'Activity' && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            <SummaryCard label="Logins This Period" value="342" />
            <SummaryCard label="Content Views" value="1,205" />
            <SummaryCard label="Quiz Attempts" value="189" />
          </div>

          {/* Recent Activity table */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Recent Activity</h3>
            <div className="border border-border rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Date / Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_ACTIVITY.map((a, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{a.user}</TableCell>
                      <TableCell>{a.action}</TableCell>
                      <TableCell>{a.content}</TableCell>
                      <TableCell className="text-muted-foreground">{a.datetime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* ─── Completions Tab ────────────────────────────────────────────── */}
      {activeTab === 'Completions' && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            <SummaryCard label="Journeys Completed" value="23" />
            <SummaryCard label="Quizzes Passed" value="156" />
            <SummaryCard label="CPD Requirements Met" value="38/47 members" />
          </div>

          {/* Completion Details table */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Completion Details</h3>
            <div className="border border-border rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>Name</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Completed Date</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COMPLETIONS.map((c, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.program}</TableCell>
                      <TableCell><TypeBadge type={c.type} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Progress value={c.progress} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">{c.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className={c.date === 'In Progress' ? 'text-muted-foreground italic' : ''}>{c.date}</TableCell>
                      <TableCell className="tabular-nums">{c.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* ─── Engagement Tab ─────────────────────────────────────────────── */}
      {activeTab === 'Engagement' && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            <SummaryCard label="Avg. Time per Session" value="24 min" />
            <SummaryCard label="Most Popular Content" value="Duties Handbook" />
            <SummaryCard label="Least Engaged" value="ESG Reporting Module" />
          </div>

          {/* Engagement by Content table */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Engagement by Content</h3>
            <div className="border border-border rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>Content</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Avg. Time Spent</TableHead>
                    <TableHead>Quiz Completion Rate</TableHead>
                    <TableHead>Engagement Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ENGAGEMENT_DATA.map((e, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{e.content}</TableCell>
                      <TableCell><TypeBadge type={e.type} /></TableCell>
                      <TableCell className="tabular-nums">{e.views}</TableCell>
                      <TableCell>{e.avgTime}</TableCell>
                      <TableCell className="tabular-nums">{e.quizRate}</TableCell>
                      <TableCell className="tabular-nums">{e.score}/10</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
