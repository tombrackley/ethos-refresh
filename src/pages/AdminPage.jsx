import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { adminCategories } from '@/config/adminNav'
import { PAGE_TO_PATH } from '@/lib/routes'
import { useReviewCyclesEnabled, setReviewCyclesEnabled } from '@/lib/reviewCycleSettings'
import LearningJourneysPage from './AdminLearningJourneysPage'
import AdminCPDPage from './AdminCPDPage'
import AdminCPDEventsPage from './AdminCPDEventsPage'
import AdminTeamCapabilityPage from './AdminTeamCapabilityPage'
import AdminRolesPage from './AdminRolesPage'
import AdminKnowledgeCentrePage from './AdminKnowledgeCentrePage'
import AdminResourceLibraryPage from './AdminResourceLibraryPage'
import AdminVaultPage from './AdminVaultPage'
import AdminCPDRegimesPage from './AdminCPDRegimesPage'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import tenant from '@/config/tenant'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus, Search, CirclePlus, X, MoreHorizontal, Pencil, Trash2,
  ShieldCheck, UserX, ChevronRight, ChevronDown, Building2, Users, Globe, Mail,
  FileText, ExternalLink, Link2, CheckCircle2, CircleDashed, AlertCircle, Clock,
  CreditCard, Download, Eye, Upload, GripVertical, History, Target, UserPlus, Archive,
} from 'lucide-react'

// ─── Shared ──────────────────────────────────────────────────────────────────

const ROLE_STYLE = {
  Admin:  'bg-[#faf5ff] text-[#581c87] border-[#e9d5ff]',
  Editor: 'bg-[#eff6ff] text-[#1e3a8a] border-[#bfdbfe]',
  User:   'bg-[#f9fafb] text-[#374151] border-[#e5e7eb]',
}

// ─── Team Overview ───────────────────────────────────────────────────────────

const TEAM_MEMBERS = [
  { id: 1,  name: 'John Jones',    email: 'john@email.com',      role: 'Admin',  boards: 'All', status: 'Active',   memberSince: '30 Jun, 2025', lastLogin: '28 Dec, 2025 at...' },
  { id: 2,  name: 'Sue Smith',     email: 'sue@email.com',       role: 'Admin',  boards: 'All', status: 'Active',   memberSince: '30 Jun, 2025', lastLogin: '28 Dec, 2025 at...' },
  { id: 3,  name: 'James Wilson',  email: 'james@email.com',     role: 'Editor', boards: '5',   status: 'Active',   memberSince: '30 Jun, 2025', lastLogin: '27 Dec, 2025 at...' },
  { id: 4,  name: 'Sarah Chen',    email: 'sarah@email.com',     role: 'User',   boards: '3',   status: 'Active',   memberSince: '30 Jun, 2025', lastLogin: '28 Dec, 2025 at...' },
  { id: 5,  name: 'David Park',    email: 'david@email.com',     role: 'User',   boards: '3',   status: 'Active',   memberSince: '30 Jun, 2025', lastLogin: '28 Dec, 2025 at...' },
  { id: 6,  name: 'Laura Singh',   email: 'laura@email.com',     role: 'User',   boards: '3',   status: 'Active',   memberSince: '15 Jul, 2025', lastLogin: '26 Dec, 2025 at...' },
  { id: 7,  name: 'Margaret Chen', email: 'margaret@email.com',  role: 'User',   boards: '3',   status: 'Active',   memberSince: '15 Jul, 2025', lastLogin: '28 Dec, 2025 at...' },
  { id: 8,  name: 'Tom Bradley',   email: 'tom@email.com',       role: 'User',   boards: '2',   status: 'Active',   memberSince: '01 Aug, 2025', lastLogin: '28 Dec, 2025 at...' },
  { id: 9,  name: 'Rachel Green',  email: 'rachel@email.com',    role: 'User',   boards: '3',   status: 'Active',   memberSince: '01 Aug, 2025', lastLogin: '22 Dec, 2025 at...' },
  { id: 10, name: 'Mike Ross',     email: 'mike@email.com',      role: 'User',   boards: '0',   status: 'Inactive', memberSince: '30 Jun, 2025', lastLogin: '15 Nov, 2025 at...' },
]

function TeamOverviewPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 10
  const totalUsers = 50

  const filtered = TEAM_MEMBERS.filter((u) => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage team members and their access</p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-4" /> Invite user
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        {search && (
          <button onClick={() => setSearch('')} className="flex items-center gap-1 text-sm text-foreground hover:text-muted-foreground transition-colors">
            Reset <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground w-[280px]">User</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Role</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Boards</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Member since</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Last Login</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`h-6 rounded-[6px] text-xs font-medium leading-5 ${ROLE_STYLE[user.role]}`}>{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`h-6 rounded-[6px] text-xs font-medium leading-5 bg-[#f9fafb] text-[#374151] border-[#e5e7eb]`}>{user.boards}</Badge>
                </TableCell>
                <TableCell>
                  <span className={`text-sm ${user.status === 'Active' ? 'text-brand-500' : 'text-muted-foreground'}`}>{user.status}</span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.memberSince}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 text-muted-foreground"><MoreHorizontal className="size-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2 text-sm"><Pencil className="size-3.5" /> Edit user</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-sm"><ShieldCheck className="size-3.5" /> Change role</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-sm"><UserX className="size-3.5" /> Deactivate</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-sm text-destructive"><Trash2 className="size-3.5" /> Remove user</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, totalUsers)} of {totalUsers}</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <Button variant="outline" size="sm" disabled={page * perPage >= totalUsers} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  )
}

// ─── Organisation Profile ────────────────────────────────────────────────────

function OrganisationSettingsPage() {
  const [editingCompany, setEditingCompany] = useState(false)
  const [companyDetails, setCompanyDetails] = useState({
    'Company name': 'Blackmores Group Ltd',
    'ABN / ACN': '63 009 713 437',
    'Industry': 'Health & Wellness',
    'Company type': 'Public Company (ASX Listed)',
    'Jurisdiction': 'Australia',
    'Financial year end': '30 June',
  })

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-foreground">Organisation Profile</h2>
      <div className="border border-border/60 rounded-lg overflow-hidden bg-white">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
          <p className="text-sm font-medium text-foreground">Company Details</p>
          {editingCompany ? (
            <Button size="sm" className="text-xs gap-1 h-7" onClick={() => setEditingCompany(false)}>Save</Button>
          ) : (
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7" onClick={() => setEditingCompany(true)}>Edit <Pencil className="size-3" /></Button>
          )}
        </div>
        <div>
          {[
            { label: 'Company name', desc: 'Registered legal entity name' },
            { label: 'ABN / ACN', desc: 'Australian Business Number' },
            { label: 'Industry', desc: 'Primary industry classification' },
            { label: 'Company type', desc: 'Corporate structure' },
            { label: 'Jurisdiction', desc: 'Primary operating jurisdiction' },
            { label: 'Financial year end', desc: 'End of financial reporting period' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between px-5 py-3 border-b border-border/60 last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              {editingCompany ? (
                <Input
                  value={companyDetails[item.label]}
                  onChange={e => setCompanyDetails(prev => ({ ...prev, [item.label]: e.target.value }))}
                  className="h-8 w-64 text-sm"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{companyDetails[item.label]}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Activity & Logs ─────────────────────────────────────────────────────────

const ACTIVITY_LOG = [
  { id: 1, user: 'John Jones',    action: 'Updated handbook section',     target: 'Core Statutory Duties',     time: '2 hours ago',  type: 'content' },
  { id: 2, user: 'Sue Smith',     action: 'Invited new user',             target: 'rachel@email.com',          time: '3 hours ago',  type: 'user' },
  { id: 3, user: 'James Wilson',  action: 'Completed quiz',               target: 'Key Trends & Updates',      time: '5 hours ago',  type: 'engagement' },
  { id: 4, user: 'Sarah Chen',    action: 'Marked topic as understood',   target: 'Fiduciary Duties',          time: '6 hours ago',  type: 'engagement' },
  { id: 5, user: 'System',        action: 'Handbook auto-updated',        target: 'Corporations Act 2001',     time: '1 day ago',    type: 'system' },
  { id: 6, user: 'David Park',    action: 'Exported compliance report',   target: 'Q4 2025 Report',           time: '1 day ago',    type: 'content' },
  { id: 7, user: 'Sue Smith',     action: 'Changed user role',            target: 'James Wilson → Editor',     time: '2 days ago',   type: 'user' },
  { id: 8, user: 'John Jones',    action: 'Updated billing plan',         target: 'Professional → Enterprise', time: '3 days ago',   type: 'billing' },
  { id: 9, user: 'Laura Singh',   action: 'Added comment',                target: 'Key Trends & Updates',      time: '3 days ago',   type: 'engagement' },
  { id: 10, user: 'System',       action: 'Integration sync completed',   target: 'ASIC Connect',              time: '4 days ago',   type: 'system' },
]

const TYPE_STYLE = {
  content:    'bg-blue-100 text-blue-700',
  user:       'bg-brand-100 text-brand-800',
  engagement: 'bg-emerald-100 text-emerald-700',
  system:     'bg-muted text-muted-foreground',
  billing:    'bg-amber-100 text-amber-700',
}

function ActivityLogsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState(null)

  const filtered = ACTIVITY_LOG.filter((entry) => {
    if (search && !entry.user.toLowerCase().includes(search.toLowerCase()) && !entry.action.toLowerCase().includes(search.toLowerCase()) && !entry.target.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter && entry.type !== typeFilter) return false
    return true
  })

  const hasFilters = search || typeFilter

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Activity & Logs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Monitor all activity across the platform</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5"><Download className="size-4" /> Export</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search activity..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 text-sm h-9"><CirclePlus className="size-3.5" /> Type</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {['content', 'user', 'engagement', 'system', 'billing'].map(t => (
              <DropdownMenuItem key={t} onClick={() => setTypeFilter(t)} className="capitalize">{t}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {hasFilters && (
          <button onClick={() => { setSearch(''); setTypeFilter(null) }} className="flex items-center gap-1 text-sm text-foreground hover:text-muted-foreground transition-colors">
            Reset <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Log table */}
      <div className="border border-border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground w-[180px]">User</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Action</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Target</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground w-[100px]">Type</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground w-[120px]">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((entry) => (
              <TableRow key={entry.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-7">
                      <AvatarFallback className={"bg-muted text-muted-foreground text-xs font-medium"}>
                        {entry.user === 'System' ? 'SY' : entry.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-foreground">{entry.user}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-foreground">{entry.action}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{entry.target}</TableCell>
                <TableCell>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${TYPE_STYLE[entry.type]}`}>{entry.type}</span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{entry.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// ─── Integrations ────────────────────────────────────────────────────────────

const INTEGRATIONS = [
  { name: 'ASIC Connect',         desc: 'Regulatory filings and company data sync',       status: 'connected', lastSync: '2 hours ago' },
  { name: 'Xero',                 desc: 'Financial data and compliance reporting',         status: 'connected', lastSync: '1 day ago' },
  { name: 'Microsoft 365',        desc: 'Email, calendar, and document integration',       status: 'connected', lastSync: '30 min ago' },
  { name: 'Slack',                desc: 'Notifications and team communication',            status: 'available', lastSync: null },
  { name: 'DocuSign',             desc: 'Electronic signatures for board resolutions',     status: 'available', lastSync: null },
]

function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Integrations</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Connect third-party services to streamline your workflow</p>
      </div>

      <div className="space-y-3">
        {INTEGRATIONS.map((int) => (
          <div key={int.name} className="flex items-center justify-between border border-border/60 rounded-lg px-5 py-4 bg-white hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
                <ExternalLink className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{int.name}</p>
                <p className="text-xs text-muted-foreground">{int.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {int.lastSync && <span className="text-xs text-muted-foreground">Last sync: {int.lastSync}</span>}
              {int.status === 'connected' ? (
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">Connected</Badge>
              ) : (
                <Button variant="outline" size="sm">Connect</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Plan & Billing ──────────────────────────────────────────────────────────

function PlanBillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Plan & Billing</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your subscription, invoices, and payment methods</p>
      </div>

      {/* Current plan */}
      <div className="border border-border/60 rounded-lg overflow-hidden bg-white">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <CreditCard className="size-4 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Current Plan</p>
          </div>
          <Button variant="outline" size="sm" className="text-xs h-7">Upgrade plan</Button>
        </div>
        <div className="px-5 py-5 space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-foreground">Professional</span>
            <Badge variant="outline" className="text-xs bg-brand-100 text-brand-800 border-brand-200">Active</Badge>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Monthly cost</p>
              <p className="text-sm font-medium text-foreground">$299 / month</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Billing cycle</p>
              <p className="text-sm font-medium text-foreground">Annual (paid monthly)</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Next invoice</p>
              <p className="text-sm font-medium text-foreground">1 Jan, 2026</p>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Seats used</span>
              <span className="text-sm text-foreground font-medium">10 of 25</span>
            </div>
            <Progress value={40} className="h-2" />
          </div>
        </div>
      </div>

      {/* Payment method */}
      <div className="border border-border/60 rounded-lg overflow-hidden bg-white">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
          <p className="text-sm font-medium text-foreground">Payment Method</p>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">Update <Pencil className="size-3" /></Button>
        </div>
        <div className="px-5 py-4 flex items-center gap-4">
          <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
            <CreditCard className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Visa ending in 4242</p>
            <p className="text-xs text-muted-foreground">Expires 12/2027</p>
          </div>
        </div>
      </div>

      {/* Recent invoices */}
      <div className="border border-border/60 rounded-lg overflow-hidden bg-white">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
          <p className="text-sm font-medium text-foreground">Recent Invoices</p>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">View all <ChevronRight className="size-3.5" /></Button>
        </div>
        <div>
          {[
            { date: '1 Dec, 2025', amount: '$299.00', status: 'Paid' },
            { date: '1 Nov, 2025', amount: '$299.00', status: 'Paid' },
            { date: '1 Oct, 2025', amount: '$299.00', status: 'Paid' },
          ].map((inv, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-sm text-foreground">{inv.date}</span>
                <span className="text-sm text-muted-foreground">{inv.amount}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{inv.status}</span>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7"><Download className="size-3" /> PDF</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Work Settings ─────────────────────────────────────────────────────────

function WorkSettingsPage() {
  const reviewCyclesEnabled = useReviewCyclesEnabled()

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-foreground">Work Settings</h2>
      <div className="border border-border/60 rounded-lg overflow-hidden bg-white">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
          <div>
            <p className="text-sm font-medium text-foreground">Review Cycles</p>
            <p className="text-xs text-muted-foreground">Track and manage regular review schedules for resources across your organisation</p>
          </div>
          <Switch checked={reviewCyclesEnabled} onCheckedChange={setReviewCyclesEnabled} />
        </div>
        <div className="px-5 py-4 space-y-4">
          {reviewCyclesEnabled ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3 py-2">
                <div className="size-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Review tracking is active</p>
                  <p className="text-xs text-muted-foreground">Resources flagged for review will show overdue and upcoming warnings on the Resource Library browse page. You can set review frequency per resource when adding or editing.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 py-2">
              <div className="size-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                <CircleDashed className="size-3.5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Review tracking is disabled</p>
                <p className="text-xs text-muted-foreground">No review warnings will be shown, no review dates tracked, and review-related fields will be hidden from resource forms.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── AI Settings ────────────────────────────────────────────────────────────

function AISettingsPage() {
  const [aiEnabled, setAiEnabled] = useState(true)
  const [aiSuggestions, setAiSuggestions] = useState(true)
  const [aiSummarisation, setAiSummarisation] = useState(true)

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-foreground">AI Settings</h2>
      <div className="border border-border/60 rounded-lg overflow-hidden bg-white">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
          <div>
            <p className="text-sm font-medium text-foreground">AI Assistant</p>
            <p className="text-xs text-muted-foreground">Enable or disable the Ethos AI assistant across your organisation</p>
          </div>
          <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
        </div>
        <div className="px-5 py-4 space-y-4">
          {aiEnabled && (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2.5 border-b border-border/60">
                <div>
                  <p className="text-sm font-medium text-foreground">AI-powered suggestions</p>
                  <p className="text-xs text-muted-foreground">Recommend learning content, tasks, and actions based on user activity</p>
                </div>
                <Switch checked={aiSuggestions} onCheckedChange={setAiSuggestions} />
              </div>
              <div className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-medium text-foreground">AI summarisation</p>
                  <p className="text-xs text-muted-foreground">Generate summaries of board papers, compliance documents, and reports</p>
                </div>
                <Switch checked={aiSummarisation} onCheckedChange={setAiSummarisation} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border border-border/60 rounded-lg overflow-hidden bg-muted/30">
        <div className="px-5 py-3 border-b border-border/60">
          <p className="text-sm font-medium text-foreground">How your data is used</p>
        </div>
        <div className="px-5 py-4 space-y-4">
          {[
            { title: 'Your data stays private', desc: 'Organisation data is never used to train AI models. All processing occurs in isolated environments scoped to your organisation.' },
            { title: 'No third-party sharing', desc: 'Your data is not shared with any third parties. AI responses are generated in real-time and not stored beyond your session.' },
            { title: 'Enterprise-grade security', desc: 'All AI interactions are encrypted in transit and at rest. We comply with SOC 2 Type II and Australian Privacy Principles.' },
          ].map((item, i) => (
            <div key={i} className={`flex items-start gap-3 py-2 ${i < 2 ? 'border-b border-border/60' : ''}`}>
              <div className="size-6 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="size-3.5 text-brand-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Govern ─────────────────────────────────────────────────────────────────

const BOARDS = [
  { name: "Blackmore's Australia Pty Ltd", flag: '🇦🇺', users: 21, status: 'Active' },
  { name: 'Kirin Australia Pty Ltd',       flag: '🇦🇺', users: 21, status: 'Active' },
  { name: "Blackmore's Singapore",         flag: '🇸🇬', users: 21, status: 'Active' },
  { name: 'Blackmores China',              flag: '🇨🇳', users: 21, status: 'Active' },
  { name: 'Malaysia',                      flag: '🇲🇾', users: 21, status: 'Active' },
  { name: 'Vietnam',                       flag: '🇻🇳', users: 21, status: 'Active' },
  { name: 'Thailand',                      flag: '🇹🇭', users: 21, status: 'Active' },
  { name: 'New Zealand',                   flag: '🇳🇿', users: 21, status: 'Archived' },
]

const COUNTRIES = [
  { flag: '🇦🇺', name: 'Australia' },
  { flag: '🇳🇿', name: 'New Zealand' },
  { flag: '🇸🇬', name: 'Singapore' },
  { flag: '🇨🇳', name: 'China' },
  { flag: '🇲🇾', name: 'Malaysia' },
  { flag: '🇻🇳', name: 'Vietnam' },
  { flag: '🇹🇭', name: 'Thailand' },
  { flag: '🇬🇧', name: 'United Kingdom' },
  { flag: '🇺🇸', name: 'United States' },
]

const ENTITY_TYPES = ['Pty Ltd', 'Ltd', 'Inc', 'LLC', 'Partnership', 'Trust', 'Sole Trader']

function AddBoardOverlay({ board, onClose }) {
  const isEditing = !!board
  const countryFromFlag = board ? COUNTRIES.find(c => c.flag === board.flag)?.name || 'Australia' : 'Australia'
  const [country, setCountry] = useState(countryFromFlag)
  const [entityType, setEntityType] = useState(board?.entityType || '')
  const [companyId, setCompanyId] = useState(board?.companyId || '')
  const [entityName, setEntityName] = useState(board?.name || '')
  const [tradingName, setTradingName] = useState(board?.tradingName || '')

  const selectClassName = "h-10 w-full rounded-md border border-input bg-white px-3 pr-8 text-sm text-foreground cursor-pointer focus:outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px] shadow-xs"

  return createPortal(
    <div className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col">
      <div className="p-6">
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="size-5" />
        </button>
      </div>
      <div className="flex-1 flex items-start justify-center overflow-auto pt-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">{isEditing ? 'Edit Board Details' : 'Add a new board'}</h1>
            <p className="text-sm text-muted-foreground mt-1.5">{isEditing ? 'Update the details for this board' : 'Set up a new entity board within your organisation'}</p>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Country</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)} className={selectClassName}>
                {COUNTRIES.map(c => (
                  <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Entity type</label>
              <select value={entityType} onChange={(e) => setEntityType(e.target.value)} className={selectClassName}>
                <option value="">Select</option>
                {ENTITY_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Company Identifier</label>
              <Input value={companyId} onChange={(e) => setCompanyId(e.target.value)} placeholder="Enter company identifier" className="h-10" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Entity Name</label>
              <Input value={entityName} onChange={(e) => setEntityName(e.target.value)} placeholder="Eg. Acme Medicine Pty Ltd" className="h-10" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Trading Name</label>
              <Input value={tradingName} onChange={(e) => setTradingName(e.target.value)} placeholder="Eg. Acme" className="h-10" />
            </div>
          </div>

          <Button className="w-full h-10" onClick={onClose}>Continue</Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function AdminGovernPage() {
  const [search, setSearch] = useState('')
  const [showAddBoard, setShowAddBoard] = useState(false)
  const [editingBoard, setEditingBoard] = useState(null)

  const filtered = BOARDS.filter(b => {
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Boards</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage the organisations that are using Ethika</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search boards" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => setShowAddBoard(true)}>
            <Plus className="size-4" /> Add Board
          </Button>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">Name</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Users</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((board) => (
                <TableRow key={board.name} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{board.flag}</span>
                      <span className="text-sm font-medium text-foreground">{board.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{board.users}</TableCell>
                  <TableCell>
                    <span className={`text-sm ${board.status === 'Active' ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                      {board.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingBoard(board)} className="gap-2 text-sm">
                          <Pencil className="size-3.5" /> Edit board details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-sm">
                          <Users className="size-3.5" /> View users
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-sm">
                          <UserPlus className="size-3.5" /> Invite user
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-sm text-destructive">
                          <Archive className="size-3.5" /> Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {showAddBoard && <AddBoardOverlay onClose={() => setShowAddBoard(false)} />}
      {editingBoard && <AddBoardOverlay board={editingBoard} onClose={() => setEditingBoard(null)} />}
    </div>
  )
}

// ─── Placeholder ────────────────────────────────────────────────────────────

function AdminPlaceholderPage({ title, description }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{description || 'This module is coming soon.'}</p>
      </div>
      <div className="border border-dashed border-border/60 rounded-lg p-12 text-center">
        <p className="text-sm text-muted-foreground">Coming soon</p>
      </div>
    </div>
  )
}

// ─── Page Map & Main ─────────────────────────────────────────────────────────

const ADMIN_PAGES = {
  // Organisation
  'Organisation Profile': () => <OrganisationSettingsPage />,
  'Users':             () => <TeamOverviewPage />,
  'Privacy & Security':() => <AdminPlaceholderPage title="Privacy & Security" description="Manage security settings and privacy controls" />,
  'Billing':           () => <PlanBillingPage />,
  'AI Settings':       () => <AISettingsPage />,
  'Integrations':      () => <IntegrationsPage />,
  'Vault':             () => <AdminVaultPage />,
  'Resources':         () => <AdminResourceLibraryPage />,
  'Knowledge Settings': () => <AdminPlaceholderPage title="Knowledge Settings" description="Configure knowledge module settings and content" />,
  'Talent':            () => <AdminPlaceholderPage title="Talent" description="Configure talent module settings" />,
  'Activity & Logs':   () => <ActivityLogsPage />,
  'Performance':       () => <AdminPlaceholderPage title="Performance" description="Performance monitoring and analytics" />,
  'Reporting':         () => <AdminPlaceholderPage title="Reporting" description="Reporting dashboard and exports" />,
  // Modules
  'Govern':            () => <AdminGovernPage />,
  'Govern Settings':   () => <AdminPlaceholderPage title="Governance Settings" description="Configure governance framework and compliance standards" />,
  'Comply':            () => <AdminPlaceholderPage title="Compliance Settings" description="Configure compliance module settings and content" />,
  'Obligations':       () => <AdminPlaceholderPage title="Obligations" description="Manage compliance obligations and requirements" />,
  'Risk Framework':    () => <AdminPlaceholderPage title="Risk Framework" description="Configure risk assessment framework and controls" />,
  'Work':              () => <WorkSettingsPage />,
  'Matter Types':      () => <AdminPlaceholderPage title="Matter Types" description="Define and manage matter type categories" />,
  'Workflows':         () => <AdminPlaceholderPage title="Workflows" description="Configure workflow templates and automation rules" />,
  'Learning Journeys': () => <LearningJourneysPage />,
  'CPD Management':    () => <AdminCPDPage />,
  'CPD Regimes':       () => <AdminCPDRegimesPage />,
  'CPD Events':        () => <AdminCPDEventsPage />,
  'Team Capability':   () => <AdminTeamCapabilityPage />,
  'Role Profiles':     () => <AdminRolesPage />,
  'Knowledge Centre':  () => <AdminKnowledgeCentrePage />,
}

const SLUG_TO_PAGE = {
  'organisation-profile':'Organisation Profile',
  'users':             'Users',
  'privacy-security':  'Privacy & Security',
  'billing':           'Billing',
  'ai-settings':       'AI Settings',
  'integrations':      'Integrations',
  'vault':             'Vault',
  'resources':         'Resources',
  'knowledge-settings': 'Knowledge Settings',
  'talent':            'Talent',
  'activity-logs':     'Activity & Logs',
  'performance':       'Performance',
  'reporting':         'Reporting',
  'govern':            'Govern',
  'govern-settings':   'Govern Settings',
  'comply':            'Comply',
  'obligations':       'Obligations',
  'risk-framework':    'Risk Framework',
  'work':              'Work',
  'matter-types':      'Matter Types',
  'workflows':         'Workflows',
  'learning-journeys': 'Learning Journeys',
  'cpd-management':    'CPD Management',
  'cpd-regimes':       'CPD Regimes',
  'cpd-events':        'CPD Events',
  'team-capability':   'Team Capability',
  'role-profiles':     'Role Profiles',
  'knowledge-centre':  'Knowledge Centre',
}

function AdminChildSidebar({ activePage }) {
  const navigate = useNavigate()

  const activeCategory = adminCategories.find(cat =>
    cat.items.some(item => {
      const page = item.page ?? `Admin:${item.title}`
      return page === `Admin:${activePage}`
    })
  ) || adminCategories[0]

  const handleNavigate = (page) => {
    const path = PAGE_TO_PATH[page]
    if (path) navigate(path)
  }

  if (activeCategory.items.length < 1) return null

  return (
    <div className="w-[220px] shrink-0 border-r border-border/60 bg-white overflow-y-auto py-4 px-3">
      <p className="text-[13px] font-medium text-foreground px-2 mb-3">{activeCategory.label}</p>
      <nav className="space-y-0.5">
        {activeCategory.items.map((item) => {
          const page = item.page ?? `Admin:${item.title}`
          const isActive = `Admin:${activePage}` === page
          return (
            <button
              key={item.title}
              onClick={() => handleNavigate(page)}
              className={`w-full text-left px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                isActive
                  ? 'bg-sidebar-accent font-medium text-foreground'
                  : 'text-foreground/60 hover:text-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              {item.title}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default function AdminPage() {
  const { pathname } = useLocation()
  const slug = pathname.replace('/admin/', '')
  const subPage = SLUG_TO_PAGE[slug] || 'Organisation Profile'
  const PageComponent = ADMIN_PAGES[subPage] || ADMIN_PAGES['Organisation Profile']

  return (
    <div className="flex flex-1 overflow-hidden">
      <AdminChildSidebar activePage={subPage} />
      <div className="flex-1 overflow-auto p-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <PageComponent />
        </div>
      </div>
    </div>
  )
}
