import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { isEnabled } from '@/config/flags'
import { useReviewCyclesEnabled } from '@/lib/reviewCycleSettings'
import {
  Search, FileText, Shield, BookOpen, ScrollText, Scale,
  ChevronDown, ChevronRight, X, Download, ExternalLink, Play,
  FileEdit, Link2, Lock, ListTodo, UserCheck, AlertTriangle, Clock, CheckCircle2,
  Info, Sparkles, ArrowLeft, GraduationCap, ChevronUp, GitBranch, Settings,
  Folder, FolderMinus,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import tenant from '@/config/tenant'
import { getResourceSave, saveResource, unsaveResource } from '@/lib/vaultSaves'

const t = tenant.pages.resource

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const month = d.toLocaleDateString('en-AU', { month: 'short' })
  return `${month} ${d.getDate()}, ${d.getFullYear()}`
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RESOURCE_TYPE_ICONS = {
  policy: Shield,
  template: FileText,
  playbook: BookOpen,
  article: ScrollText,
  legislation: Scale,
  guide: BookOpen,
}

const RESOURCE_TYPE_COLORS = {
  template:    { bg: 'bg-brand-green-100', text: 'text-brand-green-900' },
  policy:      { bg: 'bg-cyan-100',        text: 'text-cyan-900' },
  playbook:    { bg: 'bg-indigo-100',      text: 'text-indigo-900' },
  article:     { bg: 'bg-amber-100',       text: 'text-amber-900' },
  legislation: { bg: 'bg-orange-100',      text: 'text-orange-900' },
  guide:       { bg: 'bg-purple-100',      text: 'text-purple-900' },
}

const TYPE_LABELS = {
  policy: 'Policy', template: 'Template', playbook: 'Playbook',
  article: 'Article', legislation: 'Legislation', guide: 'Guide',
}

const SOURCE_LABELS = {
  ethika: 'Ethika',
  org: 'Organisation',
  community: 'Community',
}

const CLASSIFICATION_LABELS = Object.fromEntries(
  (t.classifications || []).map(c => [c.id, c.label])
)

function WordIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#185ABD" />
      <path d="M6.5 8.5h2l1.1 5.5L11 8.5h2l1.4 5.5L15.5 8.5h2L15.7 16h-2.1l-1.4-5.4L10.8 16H8.7L6.5 8.5z" fill="white" />
    </svg>
  )
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

function FilterSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border/60 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-medium text-foreground py-1 hover:text-foreground/80 transition-colors"
      >
        {title}
        {open ? <ChevronUp className="size-3.5 text-muted-foreground" /> : <ChevronDown className="size-3.5 text-muted-foreground" />}
      </button>
      {open && <div className="mt-2 space-y-1.5">{children}</div>}
    </div>
  )
}

function FilterCheckbox({ label, checked, onCheckedChange, count }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} className="size-4" />
      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1">{label}</span>
      {count !== undefined && <span className="text-sm text-muted-foreground/60">{count}</span>}
    </label>
  )
}

function FilterSidebar({ resources, filters, setFilters }) {
  const counts = useMemo(() => {
    const c = { types: {}, categories: {}, sources: {} }
    resources.forEach(r => {
      c.types[r.resource_type] = (c.types[r.resource_type] || 0) + 1
      c.categories[r.category] = (c.categories[r.category] || 0) + 1
      c.sources[r.source] = (c.sources[r.source] || 0) + 1
    })
    return c
  }, [resources])

  const toggleFilter = (key, value) => {
    setFilters(prev => {
      const set = new Set(prev[key])
      if (set.has(value)) set.delete(value)
      else set.add(value)
      return { ...prev, [key]: set }
    })
  }

  const activeCount = filters.types.size + filters.categories.size + filters.sources.size

  return (
    <div className="w-56 shrink-0 pr-5 border-r border-border/60">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-foreground">Filters</p>
        {activeCount > 0 && (
          <button
            onClick={() => setFilters({ types: new Set(), categories: new Set(), sources: new Set() })}
            className="text-xs text-brand-600 hover:text-brand-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Content Type" defaultOpen>
        {t.contentTypes.filter(ct => ct.id !== 'all').map(ct => (
          <FilterCheckbox
            key={ct.id}
            label={ct.label}
            checked={filters.types.has(ct.id)}
            onCheckedChange={() => toggleFilter('types', ct.id)}
            count={counts.types[ct.id] || 0}
          />
        ))}
      </FilterSection>

      <FilterSection title="Category" defaultOpen>
        {t.categories.filter(c => c.id !== 'all').map(c => (
          <FilterCheckbox
            key={c.id}
            label={c.label}
            checked={filters.categories.has(c.id)}
            onCheckedChange={() => toggleFilter('categories', c.id)}
            count={counts.categories[c.id] || 0}
          />
        ))}
      </FilterSection>

      <FilterSection title="Source">
        {t.sources.filter(s => s.id !== 'all').map(s => (
          <FilterCheckbox
            key={s.id}
            label={s.label}
            checked={filters.sources.has(s.id)}
            onCheckedChange={() => toggleFilter('sources', s.id)}
            count={counts.sources[s.id] || 0}
          />
        ))}
      </FilterSection>
    </div>
  )
}

// ─── Resource Card ────────────────────────────────────────────────────────────

function ResourceCard({ resource, onClick, reviewCyclesEnabled }) {
  const TypeIcon = RESOURCE_TYPE_ICONS[resource.resource_type] || FileText
  const colors = RESOURCE_TYPE_COLORS[resource.resource_type] || RESOURCE_TYPE_COLORS.guide
  const visibleTags = resource.tags.slice(0, 3)
  const overflowCount = resource.tags.length - 3
  const reviewStatus = reviewCyclesEnabled ? getReviewStatus(resource) : 'none'

  return (
    <button
      onClick={onClick}
      className="flex flex-col text-left border border-border/60 rounded-xl p-5 bg-white hover:border-brand-200 hover:shadow-sm transition-all group h-full"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className={cn('flex size-10 items-center justify-center rounded-lg shrink-0', colors.bg)}>
            <TypeIcon className={cn('size-5', colors.text)} strokeWidth={1.5} />
          </div>
          <Badge variant={`resource-${resource.resource_type}`} className="capitalize text-[11px]">{TYPE_LABELS[resource.resource_type] || resource.resource_type}</Badge>
          {resource.classification && CLASSIFICATION_LABELS[resource.classification] && (
            <Badge variant={`classification-${resource.classification}`} className="text-[11px]">
              <Lock className="size-3" />
              {CLASSIFICATION_LABELS[resource.classification]}
            </Badge>
          )}
        </div>
        {reviewStatus === 'overdue' && (
          <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 shrink-0">
            <AlertTriangle className="size-3" />
            Overdue
          </span>
        )}
        {reviewStatus === 'upcoming' && (
          <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5 shrink-0">
            <Clock className="size-3" />
            Review soon
          </span>
        )}
      </div>

      <p className="text-[15px] font-medium text-foreground leading-snug mb-1.5 line-clamp-2">{resource.title}</p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-2">{resource.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {visibleTags.map(tag => (
          <span key={tag} className="text-[11px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">{tag}</span>
        ))}
        {overflowCount > 0 && (
          <span className="text-[11px] text-muted-foreground/50 px-1 py-0.5">+{overflowCount}</span>
        )}
      </div>

      <div className="pt-3 border-t border-border/40 flex items-center justify-between">
        <span className="text-xs text-muted-foreground/70">{SOURCE_LABELS[resource.source]} · {formatDate(resource.last_updated)}</span>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/30 cursor-default">
              <GitBranch className="size-3" />
              0 workflows
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Workflow usage tracking — available when Work module launches</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </button>
  )
}

// ─── Active Filter Chips ──────────────────────────────────────────────────────

function ActiveFilters({ filters, setFilters }) {
  const chips = []

  const labelMaps = {
    types: Object.fromEntries(t.contentTypes.map(c => [c.id, c.label])),
    categories: Object.fromEntries(t.categories.map(c => [c.id, c.label])),
    sources: Object.fromEntries(t.sources.map(c => [c.id, c.label])),
  }

  for (const [key, set] of Object.entries(filters)) {
    for (const value of set) {
      chips.push({ key, value, label: labelMaps[key]?.[value] || value })
    }
  }

  if (chips.length === 0) return null

  const removeChip = (key, value) => {
    setFilters(prev => {
      const next = new Set(prev[key])
      next.delete(value)
      return { ...prev, [key]: next }
    })
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {chips.map(chip => (
        <span
          key={`${chip.key}-${chip.value}`}
          className="inline-flex items-center gap-1 text-xs text-foreground bg-brand-50 border border-brand-200 rounded-full px-2 py-0.5"
        >
          {chip.label}
          <button onClick={() => removeChip(chip.key, chip.value)} className="hover:text-brand-700 transition-colors">
            <X className="size-3" />
          </button>
        </span>
      ))}
    </div>
  )
}

// ─── Resource Detail View ─────────────────────────────────────────────────────

const FLAG_TOOLTIPS = {
  warning: 'Action required — review overdue or attention needed',
  neutral: 'Contextual guidance — additional context for this resource',
  ai: 'AI compliance notes are a placeholder and will be available in a later release',
}

function ComplianceFlag({ flag }) {
  // Blue 'info' confirmation flags are hidden; AI notes use a disabled placeholder style.
  if (flag.type === 'info') return null

  const config = {
    warning: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', iconColor: 'text-amber-500' },
    neutral: { icon: Info, bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', iconColor: 'text-gray-400' },
    ai: { icon: Sparkles, bg: 'bg-blue-50', border: 'border-blue-200 border-dashed', text: 'text-blue-800', iconColor: 'text-blue-500' },
  }
  const c = config[flag.type] || config.neutral
  const FlagIcon = c.icon

  return (
    <Tooltip delayDuration={400}>
      <TooltipTrigger asChild>
        <div
          aria-disabled={flag.disabled || undefined}
          className={cn(
            'flex items-start gap-2 rounded-lg border px-3 py-2.5 cursor-default',
            flag.disabled && 'opacity-75 cursor-not-allowed',
            c.bg,
            c.border,
          )}
        >
          <FlagIcon className={cn('size-4 shrink-0 mt-0.5', c.iconColor)} />
          <div>
            <p className={cn('text-sm leading-relaxed', c.text)}>{flag.message}</p>
            {flag.disabled && (
              <p className="text-xs text-blue-700/70 mt-1">Placeholder only - coming soon</p>
            )}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>{FLAG_TOOLTIPS[flag.type] || FLAG_TOOLTIPS.neutral}</p>
      </TooltipContent>
    </Tooltip>
  )
}

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

function getComplianceFlags(resource) {
  const flags = (resource.compliance_flags || []).filter(f => f.type !== 'info')
  // Auto-generate amber warning if review is overdue
  if (resource.review_frequency && resource.review_due) {
    const due = new Date(resource.review_due)
    const now = new Date('2026-04-18')
    if (due < now) {
      const overdueDays = Math.floor((now - due) / (1000 * 60 * 60 * 24))
      flags.unshift({
        type: 'warning',
        message: `Review overdue — was due ${formatDate(resource.review_due)} (${overdueDays} days ago). Review frequency: ${resource.review_frequency}.`,
      })
    }
  }
  flags.push({
    type: 'ai',
    disabled: true,
    message: 'AI compliance note will surface automated observations about regulatory alignment and potential gaps for this resource.',
  })
  return flags
}

function ResourceDetail({ resource, onBack, onNavigateCategory, reviewCyclesEnabled }) {
  const navigate = useNavigate()
  const [previewTab, setPreviewTab] = useState('preview')
  const [reviewed, setReviewed] = useState(false)
  const [vaultSave, setVaultSave] = useState(() => getResourceSave(resource.id))
  const [vaultPickerOpen, setVaultPickerOpen] = useState(false)
  const [vaultFlash, setVaultFlash] = useState(null) // { kind: 'saved'|'removed', folderName? }
  const TypeIcon = RESOURCE_TYPE_ICONS[resource.resource_type] || FileText
  const colors = RESOURCE_TYPE_COLORS[resource.resource_type] || RESOURCE_TYPE_COLORS.guide
  const inputType = getInputType(resource)
  const reviewStatus = reviewCyclesEnabled ? getReviewStatus(resource) : 'none'

  // Reset when switching between resources
  useEffect(() => {
    setVaultSave(getResourceSave(resource.id))
    setVaultFlash(null)
  }, [resource.id])

  function handleSaveToVault(folderName) {
    const entry = saveResource(resource.id, folderName, {
      title: resource.title,
      resourceType: resource.resource_type,
      fileType: resource.file_type,
    })
    setVaultSave(entry)
    setVaultPickerOpen(false)
    setVaultFlash({ kind: 'saved', folderName })
    setTimeout(() => setVaultFlash(null), 4000)
  }

  function handleRemoveFromVault() {
    unsaveResource(resource.id)
    setVaultSave(null)
    setVaultFlash({ kind: 'removed' })
    setTimeout(() => setVaultFlash(null), 4000)
  }

  return (
    <div className="flex-1 overflow-auto px-6 pt-[60px] pb-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-4" />
          Back to resources
        </button>

        {/* Header */}
        <div className="space-y-5">
          <div className={cn('flex size-11 items-center justify-center rounded', colors.bg)}>
            <TypeIcon className={cn('size-6', colors.text)} strokeWidth={1.5} />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-[9px] flex-wrap">
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">{resource.title}</h1>
              <Badge variant="category" className="capitalize">{resource.resource_type}</Badge>
              {resource.classification && CLASSIFICATION_LABELS[resource.classification] && (
                <Badge variant={`classification-${resource.classification}`}>
                  <Lock className="size-3" />
                  {CLASSIFICATION_LABELS[resource.classification]}
                </Badge>
              )}
              {reviewStatus === 'overdue' && !reviewed && (
                <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                  <AlertTriangle className="size-3" />
                  Review overdue
                </span>
              )}
              {reviewStatus === 'upcoming' && !reviewed && (
                <span className="inline-flex items-center gap-1 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">
                  <Clock className="size-3" />
                  Review due soon
                </span>
              )}
              {reviewed && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                  <CheckCircle2 className="size-3" />
                  Reviewed
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{resource.description}</p>
          </div>

          <div className="flex items-center gap-2.5">
            <Avatar className="size-8">
              <AvatarFallback className="text-xs bg-gray-200 text-gray-500">
                {resource.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground leading-tight">{resource.author.name}</p>
              <p className="text-xs text-muted-foreground leading-tight">{resource.author.role} · updated {(() => {
                const d = new Date(resource.last_updated)
                const now = new Date()
                const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24))
                if (diff === 0) return 'today'
                if (diff === 1) return '1d ago'
                if (diff < 30) return `${diff}d ago`
                if (diff < 60) return '1mo ago'
                return `${Math.floor(diff / 30)}mo ago`
              })()}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Two-column layout */}
        <div className="flex gap-8">
          {/* Left column — Summary + Document Preview */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Panel 1 — Resource Summary */}
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-foreground">Resource Summary</h2>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Purpose</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{resource.purpose}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">When to Use</h3>
                <ul className="space-y-1.5">
                  {resource.when_to_use.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-brand-600 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Linked Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {resource.linked_categories.map(cat => (
                    <Badge
                      key={cat}
                      variant="category"
                      className="cursor-pointer hover:bg-brand-100 transition-colors"
                      onClick={() => onNavigateCategory?.(cat)}
                    >{cat}</Badge>
                  ))}
                </div>
              </div>

              {/* Risk & Compliance Notes — auto-generated warnings + manual neutral notes */}
              {(() => {
                const flags = getComplianceFlags(resource)
                return flags.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">Risk & Compliance Notes</h3>
                    <div className="space-y-3">
                      {flags.map((flag, i) => (
                        <ComplianceFlag key={i} flag={flag} />
                      ))}
                    </div>
                  </div>
                ) : null
              })()}
            </div>

            <Separator />

            {/* Document Preview — adapts by input type */}
            {(inputType === 'file-pdf' || inputType === 'file-docx') ? (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground">Document Preview</h2>
                <Tabs value={previewTab} onValueChange={setPreviewTab}>
                  <TabsList className="h-9 bg-muted/50 p-0.5 rounded-lg gap-0.5">
                    <TabsTrigger value="preview" className="h-8 rounded-md text-sm px-4">Preview</TabsTrigger>
                    <TabsTrigger value="clauses" className="h-8 rounded-md text-sm px-4">Key Clauses</TabsTrigger>
                    <TabsTrigger value="versions" className="h-8 rounded-md text-sm px-4">Version History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="mt-4">
                    <div className="border border-border/60 rounded-lg p-5 bg-slate-50">
                      <div className="flex items-center gap-3 mb-5">
                        <span className="text-sm font-medium text-foreground">Version {resource.version}</span>
                        <Separator orientation="vertical" className="h-4" />
                        {resource.page_count && <span className="text-sm text-muted-foreground">{resource.page_count} pages</span>}
                        {resource.page_count && <Separator orientation="vertical" className="h-4" />}
                        <span className="text-sm text-muted-foreground">{resource.file_type} · {resource.file_size}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground mb-3">Document Sections</p>
                        {resource.sections.map(section => (
                          <div key={section.number} className="flex items-center gap-3 py-2 px-3 rounded hover:bg-white transition-colors">
                            <span className="text-sm font-medium text-brand-700 w-6 shrink-0">{section.number}</span>
                            <span className="text-sm text-foreground">{section.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="clauses" className="mt-4 space-y-3">
                    {resource.key_clauses.map((clause, i) => (
                      <div key={i} className="border border-border/60 rounded-lg p-4 bg-slate-50">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm font-semibold text-foreground">{clause.name}</p>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{clause.clause_ref}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{clause.description}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="versions" className="mt-4">
                    <div className="space-y-3">
                      {resource.versions.map((v, i) => (
                        <div key={i} className="border border-border/60 rounded-lg p-4 bg-slate-50">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-sm font-semibold text-foreground">v{v.number}</span>
                            {v.current && <Badge variant="resource-approved">Current</Badge>}
                            <span className="text-sm text-muted-foreground">{v.date}</span>
                          </div>
                          <p className="text-sm text-gray-700">{v.summary}</p>
                          <p className="text-xs text-muted-foreground/60 mt-1.5">By {v.author}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (inputType === 'external-url' || inputType === 'video-url') ? (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground">Resource Details</h2>
                <Tabs value={previewTab} onValueChange={setPreviewTab}>
                  <TabsList className="h-9 bg-muted/50 p-0.5 rounded-lg gap-0.5">
                    <TabsTrigger value="preview" className="h-8 rounded-md text-sm px-4">Preview</TabsTrigger>
                    <TabsTrigger value="versions" className="h-8 rounded-md text-sm px-4">Version History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="mt-4">
                    <div className="border border-border/60 rounded-lg p-5 bg-slate-50">
                      <p className="text-sm text-gray-700 leading-relaxed">{resource.preview_text || resource.purpose}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="versions" className="mt-4">
                    <div className="space-y-3">
                      {resource.versions.map((v, i) => (
                        <div key={i} className="border border-border/60 rounded-lg p-4 bg-slate-50">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-sm font-semibold text-foreground">v{v.number}</span>
                            {v.current && <Badge variant="resource-approved">Current</Badge>}
                            <span className="text-sm text-muted-foreground">{v.date}</span>
                          </div>
                          <p className="text-sm text-gray-700">{v.summary}</p>
                          <p className="text-xs text-muted-foreground/60 mt-1.5">By {v.author}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : null}
          </div>

          {/* Right column — Actions, Related Learning */}
          <div className="w-96 shrink-0 space-y-4 sticky top-6 self-start">
            {/* Actions panel */}
            <div className="border border-border/60 rounded-lg bg-gray-50/50 p-5 space-y-3">
              <h2 className="text-base font-semibold text-foreground">Actions</h2>
              <div className="space-y-1">
                {[
                  { icon: FileEdit, label: 'Use in Drafting', module: 'Work' },
                  { icon: Link2, label: 'Link to Matter / Project', module: 'Work' },
                ].map(action => (
                  <Tooltip key={action.label} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-muted-foreground/50 cursor-default text-left">
                        <action.icon className="size-4 shrink-0" />
                        {action.label}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Available when {action.module} module launches</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                {/* Save to Vault — active */}
                <button
                  type="button"
                  onClick={vaultSave ? handleRemoveFromVault : () => setVaultPickerOpen(true)}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted/50 text-left transition-colors"
                >
                  {vaultSave
                    ? <FolderMinus className="size-4 shrink-0 text-emerald-700" />
                    : <Lock className="size-4 shrink-0" />}
                  {vaultSave ? 'Remove from Vault' : 'Save to Vault'}
                </button>
                {vaultFlash?.kind === 'saved' && (
                  <div className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50/60 px-3 py-2 text-xs text-emerald-900">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p>Saved to <span className="font-medium">{vaultFlash.folderName}</span> in your Vault.</p>
                  </div>
                )}
                {vaultFlash?.kind === 'removed' && (
                  <div className="flex items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                    <Info className="size-4 shrink-0 mt-0.5" />
                    <p>Removed from your Vault.</p>
                  </div>
                )}
                {[
                  { icon: ListTodo, label: 'Create Task', module: 'Work' },
                  { icon: UserCheck, label: 'Assign for Review', module: 'Work' },
                ].map(action => (
                  <Tooltip key={action.label} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-muted-foreground/50 cursor-default text-left">
                        <action.icon className="size-4 shrink-0" />
                        {action.label}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Available when {action.module} module launches</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
              {/* Mark as Reviewed — only when review cycles enabled and resource needs review */}
              {reviewCyclesEnabled && (reviewStatus === 'overdue' || reviewStatus === 'upcoming') && !reviewed && (
                <Button variant="outline" className="w-full gap-1.5 text-emerald-700 border-emerald-200 hover:bg-emerald-50" onClick={() => setReviewed(true)}>
                  <CheckCircle2 className="size-4" />
                  Mark as Reviewed
                </Button>
              )}
              {/* Primary action(s) — adapt by input type */}
              <div className="space-y-3">
                {(inputType === 'file-pdf' || inputType === 'file-docx') && (
                  <Button className="w-full">
                    <Download className="size-4" />
                    Download
                  </Button>
                )}
                {inputType === 'file-pdf' && (
                  <Button variant="outline" className="w-full" onClick={() => navigate(`/view/${resource.id}`)}>
                    <ExternalLink className="size-4" />
                    View
                  </Button>
                )}
                {inputType === 'file-docx' && (
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <span tabIndex={0} className="block">
                        <Button variant="outline" disabled className="w-full pointer-events-none">
                          <WordIcon className="size-4" />
                          Open in Word
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Open in Word — coming soon</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {inputType === 'external-url' && (
                  <Button className="w-full" onClick={() => navigate(`/view/${resource.id}`)}>
                    <ExternalLink className="size-4" />
                    View
                  </Button>
                )}
                {inputType === 'video-url' && (
                  <Button className="w-full" onClick={() => navigate(`/view/${resource.id}`)}>
                    <Play className="size-4" />
                    Watch
                  </Button>
                )}
              </div>
            </div>

            {/* Related Learning */}
            {resource.related_learning?.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-foreground">Related Learning</h2>
                <div className="space-y-2">
                  {resource.related_learning.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 py-2 hover:bg-slate-50 rounded-md px-2 transition-colors cursor-pointer"
                    >
                      <div className="flex size-7 items-center justify-center rounded shrink-0 bg-amber-100">
                        <GraduationCap className="size-3.5 text-amber-900" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.type} · {item.estimated_time}</p>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground/40 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <VaultFolderPickerModal
        open={vaultPickerOpen}
        resourceTitle={resource.title}
        onClose={() => setVaultPickerOpen(false)}
        onSave={handleSaveToVault}
      />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function VaultFolderPickerModal({ open, resourceTitle, onClose, onSave }) {
  const folders = tenant.pages.vault?.folders ?? []
  const [selected, setSelected] = useState(null)
  useEffect(() => {
    if (!open) setSelected(null)
  }, [open])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-lg border bg-background shadow-lg flex flex-col max-h-[80vh]">
        <div className="px-5 pt-4 pb-3 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-base font-semibold text-foreground">Save to Vault</p>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">{resourceTitle}</p>
            </div>
            <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2">
          <ul className="divide-y divide-border">
            {folders.map((folder) => {
              const isSelected = selected === folder.name
              return (
                <li key={folder.name}>
                  <button
                    type="button"
                    onClick={() => setSelected(folder.name)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-md transition-colors',
                      isSelected
                        ? 'bg-brand-50/60 border border-brand-300'
                        : 'border border-transparent hover:bg-muted/50',
                    )}
                  >
                    <Folder className="size-4 text-brand-700 shrink-0" />
                    <span className="text-sm font-medium text-foreground flex-1">{folder.name}</span>
                    {isSelected && <CheckCircle2 className="size-4 text-brand-700" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="px-5 py-3 border-t border-border flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {selected ? `Saving to "${selected}"` : 'Choose a folder'}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" disabled={!selected} onClick={() => onSave(selected)}>
              Save to Vault
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResourceLibraryPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [reviewFilter, setReviewFilter] = useState('all')
  const reviewCyclesEnabled = useReviewCyclesEnabled()
  const [filters, setFilters] = useState({
    types: new Set(),
    categories: new Set(),
    sources: new Set(),
  })

  const filtered = useMemo(() => {
    return t.resources.filter(r => {
      // End users only see Published (approved) resources
      if (r.status !== 'approved') return false
      if (filters.types.size > 0 && !filters.types.has(r.resource_type)) return false
      if (filters.categories.size > 0 && !filters.categories.has(r.category)) return false
      if (filters.sources.size > 0 && !filters.sources.has(r.source)) return false
      if (reviewFilter !== 'all' && reviewCyclesEnabled) {
        if (getReviewStatus(r) !== reviewFilter) return false
      }
      if (search) {
        const q = search.toLowerCase()
        return r.title.toLowerCase().includes(q) ||
               r.description.toLowerCase().includes(q) ||
               r.tags.some(tag => tag.toLowerCase().includes(q))
      }
      return true
    })
  }, [search, filters, reviewFilter, reviewCyclesEnabled])

  const reviewCounts = useMemo(() => {
    if (!reviewCyclesEnabled) return null
    const approved = t.resources.filter(r => r.status === 'approved')
    const counts = { overdue: 0, upcoming: 0, 'on-track': 0 }
    approved.forEach(r => {
      const status = getReviewStatus(r)
      if (status !== 'none') counts[status]++
    })
    return counts
  }, [reviewCyclesEnabled])

  // Build a reverse map from category label to category ID for clickable tags
  const categoryLabelToId = useMemo(() => {
    const map = {}
    t.categories.forEach(c => { map[c.label.toLowerCase()] = c.id })
    return map
  }, [])

  // Derive selected resource from URL param
  const resourceId = searchParams.get('id')
  const selectedResource = resourceId ? t.resources.find(r => r.id === resourceId) : null

  const selectResource = (resource) => {
    setSearchParams({ id: resource.id })
  }

  const clearSelection = () => {
    setSearchParams({})
  }

  const handleNavigateCategory = (categoryLabel) => {
    const catId = categoryLabelToId[categoryLabel.toLowerCase()]
    if (catId) {
      setFilters(prev => ({ ...prev, categories: new Set([catId]) }))
    }
    clearSelection()
  }

  // Detail view
  if (selectedResource) {
    return <ResourceDetail resource={selectedResource} onBack={clearSelection} onNavigateCategory={handleNavigateCategory} reviewCyclesEnabled={reviewCyclesEnabled} />
  }

  // Browse view
  const activeFilterCount = filters.types.size + filters.categories.size + filters.sources.size

  return (
    <div className="flex-1 overflow-auto px-6 pt-[60px] pb-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Resource Library</h1>
            <p className="text-sm text-muted-foreground mt-[9px]">Policies, templates, playbooks and operational guides — ready to use.</p>
          </div>
          {isEnabled('PAGE_ADMIN') && (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => navigate('/admin/resources')}
            >
              <Settings className="size-4" />
              Manage Resources
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search resources by title, description or tags..."
              className="pl-9 h-9"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="size-3.5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Review dashboard */}
        {reviewCyclesEnabled && reviewCounts && (reviewCounts.overdue > 0 || reviewCounts.upcoming > 0) && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setReviewFilter(reviewFilter === 'overdue' ? 'all' : 'overdue')}
              className={cn('flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors',
                reviewFilter === 'overdue' ? 'border-amber-300 bg-amber-50' : 'border-border/60 hover:bg-muted/30'
              )}
            >
              <AlertTriangle className="size-4 text-amber-500" />
              <span className="font-semibold text-foreground">{reviewCounts.overdue}</span>
              <span className="text-muted-foreground">overdue</span>
            </button>
            <button
              onClick={() => setReviewFilter(reviewFilter === 'upcoming' ? 'all' : 'upcoming')}
              className={cn('flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors',
                reviewFilter === 'upcoming' ? 'border-blue-300 bg-blue-50' : 'border-border/60 hover:bg-muted/30'
              )}
            >
              <Clock className="size-4 text-blue-500" />
              <span className="font-semibold text-foreground">{reviewCounts.upcoming}</span>
              <span className="text-muted-foreground">upcoming</span>
            </button>
            {reviewFilter !== 'all' && (
              <button onClick={() => setReviewFilter('all')} className="text-xs text-brand-600 hover:text-brand-700 transition-colors ml-1">
                Clear
              </button>
            )}
          </div>
        )}

        {/* Active filter chips */}
        <ActiveFilters filters={filters} setFilters={setFilters} />

        {/* Content area */}
        <div className="flex gap-6">
          {/* Filter sidebar */}
          <FilterSidebar resources={t.resources} filters={filters} setFilters={setFilters} />

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? 'resource' : 'resources'}
                {activeFilterCount > 0 && ` (${activeFilterCount} ${activeFilterCount === 1 ? 'filter' : 'filters'} active)`}
                {search && ` matching "${search}"`}
              </p>
            </div>

            {/* Resource grid/list */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {filtered.map(r => (
                    <ResourceCard key={r.id} resource={r} reviewCyclesEnabled={reviewCyclesEnabled} onClick={() => selectResource(r)} />
                  ))}
                </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <BookOpen className="size-8 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No resources match your filters</p>
                <button
                  onClick={() => {
                    setFilters({ types: new Set(), categories: new Set(), sources: new Set() })
                    setSearch('')
                  }}
                  className="text-xs text-brand-600 hover:text-brand-700 mt-2 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
