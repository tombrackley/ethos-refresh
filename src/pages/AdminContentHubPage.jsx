import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus, Search, ChevronDown, X, MoreHorizontal, Pencil, Trash2,
  Eye, CheckCircle2, Archive, Link2,
} from 'lucide-react'

// ─── Type Badge Config ───────────────────────────────────────────────────────

const TYPE_STYLES = {
  'Handbook Topic':  'bg-purple-50 text-purple-700 border-purple-200',
  'KC Article':      'bg-blue-50 text-blue-700 border-blue-200',
  'KC Framework':    'bg-blue-50 text-blue-700 border-blue-200',
  'KC Course':       'bg-blue-50 text-blue-700 border-blue-200',
  'KC Guide':        'bg-blue-50 text-blue-700 border-blue-200',
  'CPD Event':       'bg-orange-50 text-orange-700 border-orange-200',
  'Learning Element':'bg-teal-50 text-teal-700 border-teal-200',
}

const STATUS_STYLES = {
  Published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Live:      'bg-emerald-50 text-emerald-700 border-emerald-200',
  Draft:     'bg-amber-50 text-amber-700 border-amber-200',
  Archived:  'bg-gray-50 text-gray-500 border-gray-200',
  'In Review': 'bg-blue-50 text-blue-700 border-blue-200',
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const CONTENT_ITEMS = [
  { id: 1,  title: 'Welcome to Duties Handbook',          type: 'Handbook Topic',   status: 'Published', visibility: 'All Users',      updatedAt: '08 Mar 2026', updatedBy: 'Sarah Chen' },
  { id: 2,  title: 'Recent Legislative Changes',          type: 'Handbook Topic',   status: 'Published', visibility: 'All Users',      updatedAt: '06 Mar 2026', updatedBy: 'James Wilson' },
  { id: 3,  title: 'Duty of Care and Diligence',          type: 'Handbook Topic',   status: 'Published', visibility: 'All Users',      updatedAt: '04 Mar 2026', updatedBy: 'Sarah Chen' },
  { id: 4,  title: 'AI Governance Framework',             type: 'KC Framework',     status: 'Published', visibility: 'All Users',      updatedAt: '07 Mar 2026', updatedBy: 'Priya Patel' },
  { id: 5,  title: 'Banking Regulation Course',           type: 'KC Course',        status: 'Published', visibility: 'Specific Roles', updatedAt: '03 Mar 2026', updatedBy: 'David Kim' },
  { id: 6,  title: 'ESG & Sustainability Reporting Module', type: 'KC Article',     status: 'Draft',     visibility: 'Admins Only',    updatedAt: '09 Mar 2026', updatedBy: 'Emily Watson' },
  { id: 7,  title: 'Risk Management Framework',           type: 'KC Framework',     status: 'Published', visibility: 'All Users',      updatedAt: '01 Mar 2026', updatedBy: 'Rachel Adams' },
  { id: 8,  title: 'Data Privacy & Protection Guide',     type: 'KC Guide',         status: 'Published', visibility: 'All Users',      updatedAt: '28 Feb 2026', updatedBy: 'Priya Patel' },
  { id: 9,  title: 'Corporate Governance Masterclass',    type: 'CPD Event',        status: 'Live',      visibility: 'All Users',      updatedAt: '10 Mar 2026', updatedBy: 'James Wilson' },
  { id: 10, title: 'AML Compliance Workshop',             type: 'CPD Event',        status: 'Draft',     visibility: 'Specific Roles', updatedAt: '08 Mar 2026', updatedBy: 'David Kim' },
  { id: 11, title: 'Board Effectiveness Seminar',         type: 'CPD Event',        status: 'Published', visibility: 'Board Members',  updatedAt: '05 Mar 2026', updatedBy: 'Sarah Chen' },
  { id: 12, title: 'Governance Handbook Reading',          type: 'Learning Element', status: 'Published', visibility: 'All Users',      updatedAt: '02 Mar 2026', updatedBy: 'Emily Watson' },
  { id: 13, title: 'Risk Assessment Workshop',            type: 'Learning Element', status: 'In Review', visibility: 'All Users',      updatedAt: '09 Mar 2026', updatedBy: 'Rachel Adams' },
  { id: 14, title: 'Conflicts of Interest Overview',      type: 'Handbook Topic',   status: 'Draft',     visibility: 'Admins Only',    updatedAt: '07 Mar 2026', updatedBy: 'James Wilson' },
  { id: 15, title: 'Whistleblower Protection Guide',      type: 'KC Guide',         status: 'Archived',  visibility: 'All Users',      updatedAt: '15 Feb 2026', updatedBy: 'Priya Patel' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminContentHubPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [statusFilter, setStatusFilter] = useState('All')
  const [editingItem, setEditingItem] = useState(null)
  const [editorTab, setEditorTab] = useState('content')

  const filtered = CONTENT_ITEMS.filter(item => {
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter !== 'All Types') {
      const typeMap = {
        'Handbook Topics': 'Handbook Topic',
        'Knowledge Centre': ['KC Article', 'KC Framework', 'KC Course', 'KC Guide'],
        'CPD Events': 'CPD Event',
        'Learning Elements': 'Learning Element',
      }
      const match = typeMap[typeFilter]
      if (Array.isArray(match)) {
        if (!match.includes(item.type)) return false
      } else if (item.type !== match) return false
    }
    if (statusFilter !== 'All') {
      if (statusFilter === 'Published/Live') {
        if (item.status !== 'Published' && item.status !== 'Live') return false
      } else if (item.status !== statusFilter) return false
    }
    return true
  })

  const totalItems = CONTENT_ITEMS.length
  const publishedCount = CONTENT_ITEMS.filter(i => i.status === 'Published' || i.status === 'Live').length
  const draftCount = CONTENT_ITEMS.filter(i => i.status === 'Draft').length
  const reviewCount = CONTENT_ITEMS.filter(i => i.status === 'In Review').length

  // ── Editor Overlay ──
  if (editingItem) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-border/60 shrink-0">
          {/* Left: close + item info */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setEditingItem(null); setEditorTab('content') }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <p className="text-sm font-medium text-foreground leading-tight">{editingItem.title}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${TYPE_STYLES[editingItem.type]}`}>
                {editingItem.type}
              </span>
            </div>
          </div>

          {/* Center: tabs */}
          <div className="flex items-center bg-muted/50 rounded-lg p-0.5">
            <button
              onClick={() => setEditorTab('content')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                editorTab === 'content' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Edit Content
            </button>
            <button
              onClick={() => setEditorTab('settings')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                editorTab === 'settings' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Settings
            </button>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <Eye className="size-4" /> Preview
            </Button>
            <Button variant="outline" size="sm">Save Draft</Button>
            <Button size="sm" className="gap-1.5"><CheckCircle2 className="size-4" /> Publish</Button>
          </div>
        </div>

        {/* Editor content */}
        {editorTab === 'content' ? (
          <div className="flex-1 overflow-auto flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center gap-1 px-5 py-2.5 border-b border-border/60 shrink-0">
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg></button>
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 009-9 9 9 0 016 2.3L21 13"/></svg></button>
              <div className="w-px h-5 bg-border/60 mx-1" />
              <select className="h-8 rounded border border-border bg-background px-2 text-xs text-foreground cursor-pointer focus:outline-none">
                <option>Paragraph</option>
                <option>Heading 1</option>
                <option>Heading 2</option>
                <option>Heading 3</option>
              </select>
              <select className="h-8 w-14 rounded border border-border bg-background px-2 text-xs text-foreground cursor-pointer focus:outline-none ml-1">
                <option>16</option>
                <option>14</option>
                <option>18</option>
                <option>20</option>
                <option>24</option>
              </select>
              <div className="w-px h-5 bg-border/60 mx-1" />
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-foreground font-bold text-sm">B</button>
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-foreground italic text-sm">I</button>
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-foreground underline text-sm">U</button>
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-foreground line-through text-sm">S</button>
              <div className="w-px h-5 bg-border/60 mx-1" />
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground"><Link2 className="size-4" /></button>
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></button>
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></button>
              <div className="w-px h-5 bg-border/60 mx-1" />
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg></button>
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg></button>
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg></button>
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg></button>
              <div className="w-px h-5 bg-border/60 mx-1" />
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/><line x1="4" y1="6" x2="4" y2="18"/></svg></button>
              <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/><line x1="20" y1="6" x2="20" y2="18"/></svg></button>
            </div>

            {/* Editable content area */}
            <div className="flex-1 overflow-auto">
              <div className="max-w-3xl mx-auto py-10 px-6">
                <div
                  className="prose prose-sm max-w-none focus:outline-none min-h-[500px]"
                  contentEditable
                  suppressContentEditableWarning
                >
                  <h1>{editingItem.title}</h1>
                  <p>
                    Lorem ipsum dolor sit amet consectetur. Rhoncus eget tortor fusce amet sit sollicitudin
                    tristique. Non dictum nulla tristique aenean placerat ac dictum non. Quis a sed congue
                    consectetur volutpat. Est magna sapien non nunc.
                  </p>
                  <p>
                    Sollicitudin nec feugiat nisi sed. Pretium est lacinia ullamcorper nibh et tempus mus arcu
                    adipiscing. Sed purus risus sed sapien gravida. Id etiam nisi amet viverra et. Integer natoque
                    quis luctus cursus neque sit lacus aliquam nec. In quis mi a morbi nullam dui tincidunt.
                  </p>
                  <h3>Key Points</h3>
                  <p>
                    Ullamcorper fermentum senectus eget sed nulla curabitur. Integer aliquet tincidunt viverra orci
                    nisi ante adipiscing pharetra diam. Mi purus erat quis praesent consectetur.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Settings tab */
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-xl mx-auto space-y-6">
              <h2 className="text-lg font-medium text-foreground">Content Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Visibility</label>
                  <select className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <option>All Users</option>
                    <option>Admins Only</option>
                    <option>Board Members</option>
                    <option>Specific Roles</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Category / Type</label>
                  <div className="h-9 rounded-md border border-border bg-muted/30 px-3 flex items-center">
                    <span className="text-sm text-muted-foreground">{editingItem.type}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Published Date</label>
                  <Input type="date" defaultValue="2026-03-08" className="h-9 text-sm" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Tags</label>
                  <Input placeholder="Add tags separated by commas..." className="h-9 text-sm" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Main List View ──
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Content Hub</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage and publish all platform content</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 divide-x divide-border/60 border border-border/60 rounded overflow-hidden bg-white">
        {[
          { label: 'Total Items', value: totalItems },
          { label: 'Published', value: publishedCount, accent: true },
          { label: 'Drafts', value: draftCount },
          { label: 'Pending Review', value: reviewCount },
        ].map(s => (
          <div key={s.label} className="px-5 py-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{s.label}</p>
            <p className={`text-2xl font-medium ${s.accent ? 'text-brand-700' : 'text-foreground'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search content..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 h-9">
              {typeFilter} <ChevronDown className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {['All Types', 'Handbook Topics', 'Knowledge Centre', 'CPD Events', 'Learning Elements'].map(t => (
              <DropdownMenuItem key={t} onClick={() => setTypeFilter(t)}>{t}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 h-9">
              {statusFilter === 'All' ? 'All Statuses' : statusFilter} <ChevronDown className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {['All', 'Published/Live', 'Draft', 'Archived'].map(s => (
              <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)}>{s}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1" />

        <Button size="sm" className="gap-1.5 h-9">
          <Plus className="size-4" /> New Content
        </Button>
      </div>

      {/* Content table */}
      <div className="border border-border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-medium">Title</TableHead>
              <TableHead className="font-medium">Type</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Visibility</TableHead>
              <TableHead className="font-medium">Last Updated</TableHead>
              <TableHead className="font-medium">Updated By</TableHead>
              <TableHead className="font-medium w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(item => (
              <TableRow key={item.id} className="group">
                <TableCell className="font-medium text-foreground">{item.title}</TableCell>
                <TableCell>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${TYPE_STYLES[item.type]}`}>
                    {item.type}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[item.status]}`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.visibility}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.updatedAt}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.updatedBy}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingItem(item)} className="gap-2">
                        <Pencil className="size-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Eye className="size-4" /> Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <CheckCircle2 className="size-4" /> Change Visibility
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-red-600">
                        {item.status === 'Archived' ? <Trash2 className="size-4" /> : <Archive className="size-4" />}
                        {item.status === 'Archived' ? 'Delete' : 'Archive'}
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
  )
}
