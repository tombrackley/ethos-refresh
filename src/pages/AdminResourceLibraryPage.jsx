import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReviewCyclesEnabled } from '@/lib/reviewCycleSettings'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus, Search, X, MoreHorizontal, Pencil, Eye, Trash2, Download,
  CircleDashed, Upload, Link2, Video, Loader2, Sparkles,
  AlertTriangle, Clock, CheckCircle2,
} from 'lucide-react'
import tenant from '@/config/tenant'

const t = tenant.pages.resource

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_LABELS = {
  policy: 'Policy', template: 'Template', playbook: 'Playbook',
  article: 'Article', legislation: 'Legislation', guide: 'Guide',
}

const CATEGORY_LABELS = Object.fromEntries(
  t.categories.filter(c => c.id !== 'all').map(c => [c.id, c.label])
)

const INPUT_TYPE_OPTIONS = [
  { id: 'file-pdf', label: 'File (PDF)' },
  { id: 'file-docx', label: 'File (Word)' },
  { id: 'external-url', label: 'External URL' },
  { id: 'video-url', label: 'Video URL' },
]

const INPUT_TYPE_ICONS = {
  'file-pdf': Upload, 'file-docx': Upload, 'external-url': Link2, 'video-url': Video,
}

// Sample related learning items for the selector
const RELATED_LEARNING_OPTIONS = [
  { kc_id: 'kc-governance', title: 'Board Governance Fundamentals', type: 'Course', estimated_time: '3 hrs' },
  { kc_id: 'kc-duties', title: 'Director Duties Deep Dive', type: 'Learning Module', estimated_time: '2 hrs' },
  { kc_id: 'kc-risk', title: 'Risk Management Framework', type: 'Course', estimated_time: '2.5 hrs' },
  { kc_id: 'kc-ethics', title: 'Ethics & Professional Standards', type: 'Course', estimated_time: '2 hrs' },
  { kc_id: 'kc-privacy', title: 'Privacy & Data Protection', type: 'Course', estimated_time: '2 hrs' },
  { kc_id: 'kc-aml', title: 'AML/CTF Compliance', type: 'Course', estimated_time: '3.5 hrs' },
]

const REVIEW_FREQUENCY_OPTIONS = [
  { id: '3 months', label: 'Every 3 months' },
  { id: '6 months', label: 'Every 6 months' },
  { id: '12 months', label: 'Every 12 months' },
  { id: '24 months', label: 'Every 24 months' },
]

const CLASSIFICATION_OPTIONS = t.classifications || []

// Sample reviewers — would come from org user directory in production
const REVIEWER_OPTIONS = [
  { id: 'u-tb', name: 'Tom Bradley', role: 'Admin', initials: 'TB' },
  { id: 'u-jw', name: 'James Whitfield', role: 'General Counsel', initials: 'JW' },
  { id: 'u-sm', name: 'Sarah Mitchell', role: 'Senior Legal Counsel', initials: 'SM' },
  { id: 'u-pn', name: 'Priya Nair', role: 'Privacy & Compliance Manager', initials: 'PN' },
  { id: 'u-mr', name: 'Marcus Reid', role: 'Regulatory Specialist', initials: 'MR' },
  { id: 'u-cm', name: 'Claire Morrison', role: 'Employment Lawyer', initials: 'CM' },
  { id: 'u-tbk', name: 'Tom Barker', role: 'Risk & Policy Advisor', initials: 'TB' },
  { id: 'u-ao', name: 'Aisha Okonkwo', role: 'ESG & Compliance Lead', initials: 'AO' },
]

const TODAY = new Date('2026-04-18')

function getReviewStatus(resource) {
  if (!resource.review_frequency) return 'none'
  if (!resource.review_due) return 'none'
  const due = new Date(resource.review_due)
  const daysUntil = Math.floor((due - TODAY) / (1000 * 60 * 60 * 24))
  if (daysUntil < 0) return 'overdue'
  if (daysUntil <= 30) return 'upcoming'
  return 'on-track'
}

function getInputType(resource) {
  if (resource.input_type) return resource.input_type
  if (resource.file_type === 'DOCX') return 'file-docx'
  if (resource.file_type === 'PDF') return 'file-pdf'
  return 'file-pdf'
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const month = d.toLocaleDateString('en-AU', { month: 'short' })
  return `${month} ${d.getDate()}, ${d.getFullYear()}`
}

// ─── Shared Form Modal ────────────────────────────────────────────────────────

const AVAILABLE_TAGS = [
  'AML', 'ASIC', 'Board', 'Compliance', 'Conflicts', 'Contracts', 'Commercial',
  'Corporations Act', 'CTF', 'Data Breach', 'Data Protection', 'Directors',
  'Due Diligence', 'Employment', 'ERM', 'ESG', 'Ethics', 'Financial Crime',
  'Framework', 'Governance', 'HR', 'Incident Response', 'ISO 31000',
  'Legislation', 'Modern Slavery', 'NDA', 'OAIC', 'PIA', 'Policy', 'Privacy',
  'Regulatory Guide', 'Risk', 'Risk Management', 'Supply Chain',
  'Third Party', 'Vendor', 'Whistleblower',
]

const CATEGORY_OPTIONS = t.categories.filter(c => c.id !== 'all')

const EMPTY_FORM = {
  title: '',
  description: '',
  categories: [],
  resource_type: 'policy',
  classification: '',
  input_type: 'file-pdf',
  url: '',
  purpose: '',
  when_to_use: '',
  preview_text: '',
  tags: [],
  key_clauses: '',
  compliance_note: '',
  review_enabled: false,
  review_frequency: '6 months',
  review_assigned_to: null,
  related_learning: [],
  status: 'draft',
}

function formFromResource(r) {
  // Support both single category (legacy) and multi-category
  const cats = r.categories || (r.category ? [r.category] : [])
  return {
    title: r.title || '',
    description: r.description || '',
    categories: cats,
    resource_type: r.resource_type || 'policy',
    classification: r.classification || '',
    input_type: getInputType(r),
    url: r.external_url || r.video_url || '',
    purpose: r.purpose || '',
    when_to_use: (r.when_to_use || []).join('\n'),
    preview_text: r.preview_text || '',
    tags: r.tags || [],
    key_clauses: (r.key_clauses || []).map(c => `${c.name} (${c.clause_ref}): ${c.description}`).join('\n'),
    compliance_note: r.compliance_flags?.find(f => f.type === 'neutral')?.message || '',
    review_enabled: !!r.review_frequency,
    review_frequency: r.review_frequency || '6 months',
    review_assigned_to: r.review_assigned_to || null,
    related_learning: r.related_learning || [],
    status: r.status || 'draft',
  }
}

const TEXTAREA_CLASS = 'w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring resize-none'
const HINT_CLASS = 'text-xs text-muted-foreground/70 mt-1'

function UserSelect({ users, selected, onChange, searchPlaceholder }) {
  const [search, setSearch] = useState('')
  const selectedUser = selected ? users.find(u => u.id === selected) : null
  const filtered = search.trim()
    ? users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) && u.id !== selected)
    : []

  if (selectedUser) {
    return (
      <div className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/30 text-sm">
        <div>
          <span className="font-medium text-foreground">{selectedUser.name}</span>
          <span className="text-muted-foreground/70 ml-2">{selectedUser.role}</span>
        </div>
        <button onClick={() => onChange(null)} className="text-muted-foreground hover:text-foreground">
          <X className="size-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={searchPlaceholder} className="pl-9 h-9 text-sm" />
      </div>
      {search.trim() && (
        <div className="border border-border rounded-md bg-white max-h-[140px] overflow-y-auto">
          {filtered.map(u => (
            <button key={u.id} onClick={() => { onChange(u.id); setSearch('') }} className="w-full flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-muted/30 transition-colors text-left">
              <span className="font-medium">{u.name}</span>
              <span className="text-xs text-muted-foreground/70 shrink-0 ml-2">{u.role}</span>
            </button>
          ))}
          {filtered.length === 0 && <p className="px-3 py-2 text-xs text-muted-foreground/70">No matches</p>}
        </div>
      )}
    </div>
  )
}

function ChipSelector({ items, selected, onAdd, onRemove, searchPlaceholder, renderLabel }) {
  const [search, setSearch] = useState('')
  const filtered = search.trim()
    ? items.filter(item => {
        const label = typeof renderLabel === 'function' ? renderLabel(item) : item
        return label.toLowerCase().includes(search.toLowerCase()) && !selected.includes(item)
      })
    : []

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={searchPlaceholder} className="pl-9 h-9 text-sm" />
      </div>
      {search.trim() && (
        <div className="border border-border rounded-md bg-white max-h-[140px] overflow-y-auto">
          {filtered.map(item => {
            const label = typeof renderLabel === 'function' ? renderLabel(item) : item
            return (
              <button key={label} onClick={() => { onAdd(item); setSearch('') }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/30 transition-colors text-left">
                {label}
              </button>
            )
          })}
          {filtered.length === 0 && <p className="px-3 py-2 text-xs text-muted-foreground/70">No matches</p>}
        </div>
      )}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map(item => {
            const label = typeof renderLabel === 'function' ? renderLabel(item) : item
            return (
              <span key={label} className="inline-flex items-center gap-1 text-xs font-medium text-foreground bg-muted rounded-full px-2.5 h-6">
                {label}
                <button onClick={() => onRemove(item)} className="text-muted-foreground hover:text-foreground"><X className="size-3" /></button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ResourceFormModal({ mode, initialData, locked, reviewCyclesEnabled, onClose, onSubmit }) {
  const [form, setForm] = useState(
    mode === 'edit' ? formFromResource(initialData) : { ...EMPTY_FORM, categories: [], tags: [] }
  )
  const [rlSearch, setRlSearch] = useState('')

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const isFileType = form.input_type === 'file-pdf' || form.input_type === 'file-docx'
  const isUrlType = form.input_type === 'external-url' || form.input_type === 'video-url'

  const handleSubmit = () => {
    if (!form.title.trim()) return
    onSubmit(form)
    onClose()
  }

  const addRelatedLearning = (item) => {
    if (!form.related_learning.some(r => r.kc_id === item.kc_id)) {
      set('related_learning', [...form.related_learning, item])
    }
    setRlSearch('')
  }

  const removeRelatedLearning = (kcId) => {
    set('related_learning', form.related_learning.filter(r => r.kc_id !== kcId))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[640px] max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0">
          <h2 className="text-lg font-semibold text-foreground">{mode === 'edit' ? 'Edit Resource' : 'Add Resource'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X className="size-5" /></button>
        </div>
        {locked && (
          <div className="flex items-center gap-2.5 px-6 py-3 bg-violet-50 border-b border-violet-200 shrink-0">
            <Loader2 className="size-4 text-violet-600 animate-spin" />
            <p className="text-sm text-violet-700">AI is processing this document. Fields will be populated automatically when complete.</p>
          </div>
        )}
        <div className={`flex-1 overflow-y-auto px-6 py-5 space-y-6 ${locked ? 'opacity-60 pointer-events-none' : ''}`}>

          {/* ── General ─────────────────────────────────────────── */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">General</p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Title</label>
                <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Enter resource title" className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Brief description of the resource" className={TEXTAREA_CLASS} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Resource Type</label>
                  <select value={form.resource_type} onChange={e => set('resource_type', e.target.value)} className="w-full h-9 rounded-md border border-border bg-white px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring">
                    {t.contentTypes.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Classification <span className="font-normal text-muted-foreground/60">(optional)</span></label>
                  <select value={form.classification} onChange={e => set('classification', e.target.value)} className="w-full h-9 rounded-md border border-border bg-white px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="">None</option>
                    {CLASSIFICATION_OPTIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Categories</label>
                <ChipSelector
                  items={CATEGORY_OPTIONS.filter(c => !form.categories.includes(c.id))}
                  selected={form.categories.map(id => CATEGORY_OPTIONS.find(c => c.id === id)).filter(Boolean)}
                  onAdd={(cat) => set('categories', [...form.categories, cat.id])}
                  onRemove={(cat) => set('categories', form.categories.filter(id => id !== cat.id))}
                  searchPlaceholder="Search categories..."
                  renderLabel={(cat) => cat.label}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border/40" />

          {/* ── Content Source ───────────────────────────────────── */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Content Source</p>
            <div className="grid grid-cols-2 gap-3">
              {INPUT_TYPE_OPTIONS.map(opt => {
                const Icon = INPUT_TYPE_ICONS[opt.id]
                return (
                  <button key={opt.id} onClick={() => set('input_type', opt.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm text-left transition-colors ${
                      form.input_type === opt.id ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-border/60 text-muted-foreground hover:bg-muted/30'
                    }`}>
                    <Icon className="size-4 shrink-0" />
                    {opt.label}
                  </button>
                )
              })}
            </div>
            {isFileType && (
              <div className="border-2 border-dashed border-border/60 rounded-lg px-4 py-6 text-center">
                <Upload className="size-6 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Drag and drop a file, or click to browse</p>
                <p className="text-xs text-muted-foreground/60 mt-1">{form.input_type === 'file-pdf' ? 'PDF' : 'DOCX'} files accepted</p>
              </div>
            )}
            {form.input_type === 'external-url' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">External URL</label>
                <Input value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://..." className="h-9 text-sm" />
              </div>
            )}
            {form.input_type === 'video-url' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Video URL</label>
                <Input value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://youtube.com/..." className="h-9 text-sm" />
              </div>
            )}
          </div>

          <div className="border-t border-border/40" />

          {/* ── Resource Summary ─────────────────────────────────── */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Resource Summary</p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Purpose</label>
                <textarea value={form.purpose} onChange={e => set('purpose', e.target.value)} rows={3} placeholder={isFileType ? 'Leave blank to auto-generate from uploaded document' : 'Describe what this resource is for'} className={TEXTAREA_CLASS} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">When to Use</label>
                <textarea value={form.when_to_use} onChange={e => set('when_to_use', e.target.value)} rows={3} placeholder="One scenario per line" className={TEXTAREA_CLASS} />
                <p className={HINT_CLASS}>One item per line — shown as a bullet list on the detail page</p>
              </div>
              {isUrlType && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Preview Text</label>
                  <textarea value={form.preview_text} onChange={e => set('preview_text', e.target.value)} rows={3} placeholder="Detailed description for the Preview tab" className={TEXTAREA_CLASS} />
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-border/40" />

          {/* ── Tags & Key Clauses ──────────────────────────────── */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Tags{isFileType ? ' & Key Clauses' : ''}</p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Tags</label>
                {isFileType && form.tags.length === 0 && (
                  <p className={HINT_CLASS}>Leave blank to auto-suggest from uploaded document</p>
                )}
                <ChipSelector
                  items={AVAILABLE_TAGS.filter(tag => !form.tags.includes(tag))}
                  selected={form.tags}
                  onAdd={(tag) => set('tags', [...form.tags, tag])}
                  onRemove={(tag) => set('tags', form.tags.filter(t => t !== tag))}
                  searchPlaceholder="Search or add tags..."
                  renderLabel={(tag) => tag}
                />
              </div>
              {isFileType && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Key Clauses</label>
                  <textarea value={form.key_clauses} onChange={e => set('key_clauses', e.target.value)} rows={3} placeholder="Leave blank to auto-extract from uploaded document" className={TEXTAREA_CLASS} />
                  <p className={HINT_CLASS}>One clause per line — format: Name (Ref): Description</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-border/40" />

          {/* ── Risk & Compliance Notes ──────────────────────────── */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Risk & Compliance Notes</p>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Contextual Guidance</label>
              <textarea value={form.compliance_note} onChange={e => set('compliance_note', e.target.value)} rows={2} placeholder="Optional guidance note for this resource" className={TEXTAREA_CLASS} />
              <p className={HINT_CLASS}>Shown as a grey note on the detail page. Amber review-overdue warnings are auto-generated.</p>
            </div>
          </div>

          <div className="border-t border-border/40" />

          {/* ── Related Learning ─────────────────────────────────── */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Related Learning</p>
            <div className="space-y-2">
              <div className="relative">
                <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input value={rlSearch} onChange={e => setRlSearch(e.target.value)} placeholder="Search Knowledge Centre items..." className="pl-9 h-9 text-sm" />
              </div>
              {rlSearch.trim() && (
                <div className="border border-border rounded-md bg-white max-h-[140px] overflow-y-auto">
                  {RELATED_LEARNING_OPTIONS
                    .filter(o => o.title.toLowerCase().includes(rlSearch.toLowerCase()) && !form.related_learning.some(r => r.kc_id === o.kc_id))
                    .map(o => (
                      <button key={o.kc_id} onClick={() => addRelatedLearning(o)} className="w-full flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-muted/30 transition-colors text-left">
                        <span>{o.title}</span>
                        <span className="text-xs text-muted-foreground/70 shrink-0 ml-2">{o.type} · {o.estimated_time}</span>
                      </button>
                    ))}
                  {RELATED_LEARNING_OPTIONS.filter(o => o.title.toLowerCase().includes(rlSearch.toLowerCase()) && !form.related_learning.some(r => r.kc_id === o.kc_id)).length === 0 && (
                    <p className="px-3 py-2 text-xs text-muted-foreground/70">No matching items</p>
                  )}
                </div>
              )}
              {form.related_learning.length > 0 && (
                <div className="space-y-1">
                  {form.related_learning.map(item => (
                    <div key={item.kc_id} className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/30 text-sm">
                      <div>
                        <span className="font-medium text-foreground">{item.title}</span>
                        <span className="text-muted-foreground/70 ml-2">{item.type} · {item.estimated_time}</span>
                      </div>
                      <button onClick={() => removeRelatedLearning(item.kc_id)} className="text-muted-foreground hover:text-foreground"><X className="size-3.5" /></button>
                    </div>
                  ))}
                </div>
              )}
              {form.related_learning.length === 0 && !rlSearch && (
                <p className="text-xs text-muted-foreground/70">No linked Knowledge Centre items. Search above to add.</p>
              )}
            </div>
          </div>

          <div className="border-t border-border/40" />

          {/* ── Review & Status ──────────────────────────────────── */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">{reviewCyclesEnabled ? 'Review & Status' : 'Status'}</p>
            {reviewCyclesEnabled && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-foreground">Review Cycle</label>
                    <p className="text-xs text-muted-foreground/70">Flag this resource for regular review</p>
                  </div>
                  <Switch checked={form.review_enabled} onCheckedChange={v => set('review_enabled', v)} />
                </div>
                {form.review_enabled && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Review Frequency</label>
                      <select value={form.review_frequency} onChange={e => set('review_frequency', e.target.value)} className="w-full h-9 rounded-md border border-border bg-white px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring">
                        {REVIEW_FREQUENCY_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Review Assigned To <span className="font-normal text-muted-foreground/60">(optional)</span></label>
                      <UserSelect
                        users={REVIEWER_OPTIONS}
                        selected={form.review_assigned_to}
                        onChange={(id) => set('review_assigned_to', id)}
                        searchPlaceholder="Search users..."
                      />
                    </div>
                  </>
                )}
              </>
            )}
            {mode === 'edit' && (
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-foreground">Published</label>
                  <p className="text-xs text-muted-foreground/70">Make this resource visible to end users</p>
                </div>
                <Switch checked={form.status === 'approved'} onCheckedChange={v => set('status', v ? 'approved' : 'draft')} />
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border/60 shrink-0 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!form.title.trim() || locked}>
            {mode === 'edit' ? 'Save Changes' : 'Create Resource'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// Simulated AI-generated content for the prototype
const AI_GENERATED = {
  purpose: 'This document establishes the policies and procedures for the organisation. It provides a structured framework that aligns with regulatory requirements and industry best practices.',
  when_to_use: ['When establishing or reviewing organisational procedures', 'During compliance audits and regulatory reviews', 'As a reference for onboarding new team members'],
  tags: ['Policy', 'Compliance', 'Governance'],
  key_clauses: [
    { name: 'Scope & Application', description: 'Defines who is covered by this document and under what circumstances it applies.', clause_ref: 'Section 1' },
    { name: 'Roles & Responsibilities', description: 'Outlines accountability for implementation, oversight and review.', clause_ref: 'Section 2' },
    { name: 'Compliance Requirements', description: 'References applicable legislation, regulations and standards.', clause_ref: 'Section 3' },
  ],
}

export default function AdminResourceLibraryPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [resources, setResources] = useState(t.resources)
  const [editingResource, setEditingResource] = useState(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [processingIds, setProcessingIds] = useState(new Set())
  const reviewCyclesEnabled = useReviewCyclesEnabled()

  const startAiProcessing = useCallback((resourceId) => {
    setProcessingIds(prev => new Set(prev).add(resourceId))
    // Simulate AI processing with a 4-second delay
    setTimeout(() => {
      setResources(prev => prev.map(r => {
        if (r.id !== resourceId) return r
        return {
          ...r,
          ai_assisted: true,
          purpose: r.purpose || AI_GENERATED.purpose,
          when_to_use: r.when_to_use?.length > 0 ? r.when_to_use : AI_GENERATED.when_to_use,
          tags: r.tags?.length > 0 ? r.tags : AI_GENERATED.tags,
          key_clauses: r.key_clauses?.length > 0 ? r.key_clauses : AI_GENERATED.key_clauses,
        }
      }))
      setProcessingIds(prev => {
        const next = new Set(prev)
        next.delete(resourceId)
        return next
      })
    }, 4000)
  }, [])

  const handleCreate = (form) => {
    const categoryLabels = form.categories.map(id => CATEGORY_LABELS[id]).filter(Boolean)
    const isFileType = form.input_type === 'file-pdf' || form.input_type === 'file-docx'
    const needsAi = isFileType && (!form.purpose.trim() || form.tags.length === 0)
    const id = `rl-${Date.now()}`
    const newResource = {
      id,
      title: form.title.trim(),
      description: form.description.trim(),
      resource_type: form.resource_type,
      classification: form.classification || null,
      category: form.categories[0] || '',
      categories: form.categories,
      tags: form.tags,
      jurisdiction: null,
      author: { name: 'Tom Bradley', role: 'Admin' },
      source: 'org',
      status: 'draft',
      ai_assisted: false,
      input_type: form.input_type,
      external_url: form.input_type === 'external-url' ? form.url : undefined,
      video_url: form.input_type === 'video-url' ? form.url : undefined,
      file_type: form.input_type === 'file-pdf' ? 'PDF' : form.input_type === 'file-docx' ? 'DOCX' : null,
      file_size: null,
      last_updated: new Date().toISOString().split('T')[0],
      review_frequency: form.review_enabled ? form.review_frequency : null,
      review_assigned_to: form.review_enabled ? form.review_assigned_to : null,
      review_due: form.review_enabled ? null : null,
      version: '1.0',
      page_count: null,
      purpose: form.purpose,
      preview_text: form.preview_text || undefined,
      when_to_use: form.when_to_use.split('\n').map(s => s.trim()).filter(Boolean),
      linked_categories: categoryLabels,
      compliance_flags: form.compliance_note.trim() ? [{ type: 'neutral', message: form.compliance_note.trim() }] : [],
      key_clauses: [],
      sections: [],
      versions: [{ number: '1.0', date: new Date().toISOString().split('T')[0], author: 'Tom Bradley', summary: 'Initial version.', current: true }],
      related_learning: form.related_learning,
    }
    setResources(prev => [newResource, ...prev])
    if (needsAi) startAiProcessing(id)
  }

  const handleSaveEdit = (form) => {
    const categoryLabels = form.categories.map(id => CATEGORY_LABELS[id]).filter(Boolean)
    setResources(prev => prev.map(r => {
      if (r.id !== editingResource.id) return r
      return {
        ...r,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.categories[0] || r.category,
        categories: form.categories,
        resource_type: form.resource_type,
        classification: form.classification || null,
        input_type: form.input_type,
        status: form.status,
        review_frequency: form.review_enabled ? form.review_frequency : null,
        review_assigned_to: form.review_enabled ? form.review_assigned_to : null,
        purpose: form.purpose,
        preview_text: form.preview_text || undefined,
        when_to_use: form.when_to_use.split('\n').map(s => s.trim()).filter(Boolean),
        linked_categories: categoryLabels,
        tags: form.tags,
        compliance_flags: form.compliance_note.trim()
          ? [...(r.compliance_flags || []).filter(f => f.type !== 'neutral'), { type: 'neutral', message: form.compliance_note.trim() }]
          : (r.compliance_flags || []).filter(f => f.type !== 'neutral'),
        related_learning: form.related_learning,
        last_updated: new Date().toISOString().split('T')[0],
      }
    }))
  }

  const handleDelete = (id) => {
    setResources(prev => prev.filter(r => r.id !== id))
  }

  const filtered = useMemo(() => {
    return resources.filter(r => {
      if (search.trim() && !r.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [resources, search])

  const publishedCount = resources.filter(r => r.status === 'approved').length
  const draftCount = resources.filter(r => r.status === 'draft').length

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Resource Library</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage resource library content</p>
          </div>
          <Button className="gap-1.5" onClick={() => setCreateModalOpen(true)}>
            <Plus className="size-4" /> Add Resource
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Total items</span>
            <span className="font-semibold text-foreground">{resources.length}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Published</span>
            <span className="font-semibold text-foreground">{publishedCount}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="size-2 rounded-full bg-gray-400" />
            <span className="text-muted-foreground">Draft</span>
            <span className="font-semibold text-foreground">{draftCount}</span>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title..." className="pl-9" />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(item => {
                const isProcessing = processingIds.has(item.id)
                return (
                  <TableRow key={item.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setEditingResource(item)}>
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-brand-700 hover:underline">{item.title}</span>
                        {isProcessing && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-violet-600 bg-violet-50 border border-violet-200 rounded-full px-2 py-0.5 shrink-0">
                            <Loader2 className="size-3 animate-spin" />
                            AI processing
                          </span>
                        )}
                        {!isProcessing && item.ai_assisted && (
                          <Sparkles className="size-3.5 text-violet-400 shrink-0" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={`resource-${item.resource_type}`} className="capitalize">{TYPE_LABELS[item.resource_type] || item.resource_type}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{CATEGORY_LABELS[item.category] || item.category || '—'}</TableCell>
                    <TableCell>
                      {item.status === 'approved' ? (
                        <Badge variant="status-published">
                          <img src="/solid-check.svg" alt="" className="size-3" /> Published
                        </Badge>
                      ) : (
                        <Badge variant="status-draft">
                          <CircleDashed className="size-3.5 text-gray-400" /> Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(item.last_updated)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={e => { e.stopPropagation(); setEditingResource(item) }}><Pencil className="size-4 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={e => { e.stopPropagation(); navigate(`/resources?id=${item.id}`) }}><Eye className="size-4 mr-2" /> View</DropdownMenuItem>
                          {(getInputType(item) === 'file-pdf' || getInputType(item) === 'file-docx') && (
                            <DropdownMenuItem onClick={e => e.stopPropagation()}><Download className="size-4 mr-2" /> Download</DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive" onClick={e => { e.stopPropagation(); handleDelete(item.id) }}><Trash2 className="size-4 mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No resources match your search.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create Resource Modal */}
      {createModalOpen && (
        <ResourceFormModal
          mode="create"
          reviewCyclesEnabled={reviewCyclesEnabled}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreate}
        />
      )}

      {/* Edit Resource Modal */}
      {editingResource && (
        <ResourceFormModal
          mode="edit"
          initialData={editingResource}
          locked={processingIds.has(editingResource.id)}
          reviewCyclesEnabled={reviewCyclesEnabled}
          onClose={() => setEditingResource(null)}
          onSubmit={handleSaveEdit}
        />
      )}
    </>
  )
}
