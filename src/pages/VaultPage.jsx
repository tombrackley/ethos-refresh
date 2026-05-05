import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  FileText, FileSpreadsheet, Image as ImageIcon, Presentation,
  Sparkles, Upload, X, ArrowLeft, ChevronDown, Check,
  Wand2, Eye, EyeOff, Settings, Search, Plus, MoreHorizontal,
  FolderOpen, Zap,
} from 'lucide-react'
import { SiBox, SiDropbox, SiGoogledrive } from 'react-icons/si'
import { TbBrandOnedrive } from 'react-icons/tb'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import tenant from '@/config/tenant'

const t = tenant.pages.vault ?? {}
const STATUS = t.status ?? {}
const CATEGORIES = t.categories ?? []
const FILES = t.files ?? []

const FILE_TYPE_ICONS = {
  document:     FileText,
  image:        ImageIcon,
  spreadsheet:  FileSpreadsheet,
  presentation: Presentation,
}

/* Display-format label per file. Documents default to PDF; templates and
 * agreements are typically distributed as DOCX. Spreadsheets/images/decks
 * map cleanly to their typical formats. */
function fileFormat(file) {
  if (file.type === 'spreadsheet')  return 'XLSX'
  if (file.type === 'image')        return 'PNG'
  if (file.type === 'presentation') return 'PPTX'
  if (/template|standard|agreement|\bMSA\b|playbook|attestation log/i.test(file.name)) return 'DOCX'
  return 'PDF'
}

/* Provenance label. Most foundational docs flow from the connected DMS
 * (SharePoint in the prototype); user-authored templates are Upload. */
function fileSource(file) {
  if (/template|standard|playbook|attestation log/i.test(file.name)) return 'Upload'
  return 'SharePoint'
}

const FILE_STATUS = {
  healthy: {
    label: 'Healthy',
    bg: 'bg-emerald-100',
    text: 'text-[#151D2B]',
    description: 'This document is current and reflects the latest version Ethos is using.',
  },
  stale: {
    label: 'Stale',
    bg: 'bg-amber-100',
    text: 'text-[#151D2B]',
    description: 'This document hasn\'t been reviewed in a while. Confirm it\'s still accurate or upload a refreshed version.',
  },
  check: {
    label: 'Check Required',
    bg: 'bg-rose-100',
    text: 'text-[#151D2B]',
    description: 'Ethos has flagged this document for review — content may need verification or an update.',
  },
}

/* Maturity-stage definitions for the status hero card.
 * Gradient palette tracks the Figma: dark teal → mint → cyan → grey. */
const STAGES = [
  { label: 'Baseline',     gradient: 'from-[#005b71] to-[#38a388]' },
  { label: 'Good',         gradient: 'from-[#38a489] to-[#6ee7b7]' },
  { label: 'Excellent',    gradient: 'from-[#6ee7b7] to-[#2fffff]' },
  { label: 'Supercharged', gradient: null }, // greyed
]

/* ───────────────────── Empty-state DMS providers ───────────────────── */

function SharepointGlyph({ className }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M22.16 5a8.5 8.5 0 0 0-8.41 7.27 7 7 0 0 0-6.5 6.95 6.92 6.92 0 0 0 .54 2.7A6 6 0 0 0 13.5 28h.06a8.51 8.51 0 0 0 8.6-2.4 8.49 8.49 0 0 0 0-12 8.5 8.5 0 0 0 0-8.6Z" />
    </svg>
  )
}

const DMS_PROVIDERS = [
  { id: 'sharepoint', name: 'SharePoint',   color: '#036C70', Icon: SharepointGlyph },
  { id: 'onedrive',   name: 'OneDrive',     color: '#0364B8', Icon: TbBrandOnedrive },
  { id: 'gdrive',     name: 'Google Drive', color: '#1FA463', Icon: SiGoogledrive   },
  { id: 'box',        name: 'Box',          color: '#0061D5', Icon: SiBox           },
  { id: 'dropbox',    name: 'Dropbox',      color: '#0061FF', Icon: SiDropbox       },
]

const MOCK_DROP_FILES = [
  { name: 'Company Constitution',                  category: 'governing',  confidence: 97 },
  { name: 'Shareholders Deed (2024 Amendment)',     category: 'governing',  confidence: 96 },
  { name: 'Board Charter v3',                       category: 'governing',  confidence: 94 },
  { name: 'Audit & Risk Committee Charter',         category: 'governing',  confidence: 93 },
  { name: 'Delegations of Authority Matrix',       category: 'governing',  confidence: 91 },
  { name: 'Code of Conduct',                        category: 'policies',   confidence: 98 },
  { name: 'Conflict of Interest Policy',            category: 'policies',   confidence: 96 },
  { name: 'Whistleblower Policy',                   category: 'policies',   confidence: 95 },
  { name: 'Anti-Bribery & Corruption Policy',       category: 'policies',   confidence: 92 },
  { name: 'Privacy Policy v3',                      category: 'policies',   confidence: 94 },
  { name: 'Risk Management Framework v2',           category: 'frameworks', confidence: 96 },
  { name: 'Risk Appetite Statement FY26',           category: 'frameworks', confidence: 93 },
  { name: 'Compliance Management Framework',        category: 'frameworks', confidence: 91 },
  { name: 'Cyber Security Framework',               category: 'frameworks', confidence: 88 },
  { name: 'ESG Framework',                          category: 'frameworks', confidence: 64 },
  { name: 'Strategic Plan FY26-28',                 category: 'strategy',   confidence: 95 },
  { name: 'Annual Report FY25',                     category: 'strategy',   confidence: 97 },
  { name: 'Modern Slavery Statement FY25',          category: 'strategy',   confidence: 92 },
  { name: 'Sustainability Report FY25',             category: 'strategy',   confidence: 89 },
  { name: 'Audit & Risk Committee Annual Report',   category: 'strategy',   confidence: 90 },
]

const DMS_FOLDER_MAPPING = [
  { folder: 'Constitution & Governing Documents', target: 'governing',  docs: 12 },
  { folder: 'Board & Committee Charters',          target: 'governing',  docs: 8  },
  { folder: 'Policies & Code of Conduct',          target: 'policies',   docs: 47 },
  { folder: 'Risk & Compliance Frameworks',        target: 'frameworks', docs: 24 },
  { folder: 'Strategy & Annual Reporting',         target: 'strategy',   docs: 18 },
  { folder: 'Misc & Archive',                       target: null,         docs: 56 },
]

/* Smart Sync — what Ethos finds and suggests after analysing the connected
 * source. ~18 entries, mostly high-confidence with a couple of amber outliers
 * to demo the confidence bar. Grouped client-side by category. */
const SMART_SYNC_SUGGESTIONS = [
  // Governing Documents
  { name: 'Company Constitution',                     category: 'governing',  confidence: 96 },
  { name: 'Shareholders Deed (2024 Amendment)',        category: 'governing',  confidence: 94 },
  { name: 'Board Charter v3',                          category: 'governing',  confidence: 92 },
  { name: 'Audit & Risk Committee Charter',            category: 'governing',  confidence: 88 },
  { name: 'Delegations of Authority Matrix',           category: 'governing',  confidence: 91 },
  // Policies
  { name: 'Code of Conduct',                           category: 'policies',   confidence: 98 },
  { name: 'Conflict of Interest Policy',               category: 'policies',   confidence: 95 },
  { name: 'Whistleblower Policy',                      category: 'policies',   confidence: 93 },
  { name: 'Anti-Bribery & Corruption Policy',          category: 'policies',   confidence: 64 },
  { name: 'Privacy Policy v3',                         category: 'policies',   confidence: 94 },
  // Frameworks
  { name: 'Risk Management Framework v2',              category: 'frameworks', confidence: 96 },
  { name: 'Risk Appetite Statement FY26',              category: 'frameworks', confidence: 90 },
  { name: 'Compliance Management Framework',           category: 'frameworks', confidence: 89 },
  { name: 'Cyber Security Framework',                  category: 'frameworks', confidence: 86 },
  // Strategy & Reporting
  { name: 'Strategic Plan FY26-28',                    category: 'strategy',   confidence: 95 },
  { name: 'Annual Report FY25',                        category: 'strategy',   confidence: 97 },
  { name: 'Modern Slavery Statement FY25',             category: 'strategy',   confidence: 91 },
  { name: 'Sustainability Report FY25',                category: 'strategy',   confidence: 68 },
]

const INDUSTRIES = [
  'Electrical wholesale & distribution',
  'Insurance & claims management',
  'Health & wellness',
  'Legal practice — corporate',
  'Migration practice',
  'Foundation / non-profit',
  'Financial services (APRA-regulated)',
  'Other',
]
const SIZES = ['Under 50 employees', '50–500 employees', '500–5,000 employees', '5,000+ employees']
const GOVERNANCE_FRAMEWORKS = [
  'ASIC / Corporations Act',
  'APRA',
  'ACNC',
  'ACCC / Australian Consumer Law',
  'OAIC / Privacy Act',
  'WHS Act',
  'Modern Slavery Act',
  'ASX-listed obligations',
  'AASB S2 / climate',
  'MARA',
  'TGA',
  'Other',
]

/* ───────────────────── Populated view ───────────────────── */

function VaultHeader({ onPreviewEmpty, onOpenSettings, emptyToggleLabel }) {
  return (
    <header className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Vault</h1>
        <p className="mt-2 text-sm text-foreground/80">
          Manage the access Ethos has to your organisation’s foundational documents
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPreviewEmpty}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <EyeOff className="size-3.5" /> {emptyToggleLabel ?? 'Preview empty state'}
        </button>
        <div className="inline-flex h-8 items-center gap-2 rounded-[10px] bg-white border border-border px-3">
          <img src="/sharepoint-icon.png" alt="" className="h-3 w-auto" />
          <span className="text-xs font-medium text-foreground">Connected</span>
        </div>
        <Button size="sm" variant="outline" onClick={onOpenSettings} className="h-8 gap-1.5">
          <Settings className="size-3.5" />
          Settings
        </Button>
      </div>
    </header>
  )
}

function StatusHeroCard({ status, mode = 'populated', uploadedCount = 0, baselineCount = 0 }) {
  const isEmpty = mode === 'empty'
  const headline = isEmpty ? "Let's set up your vault" : `Status: ${status.label || '—'}`
  const body = isEmpty
    ? `Add the foundational documents Ethos needs to understand your organisation. ${
        uploadedCount > 0
          ? `You're ${uploadedCount} of ${baselineCount} suggested documents in — every upload sharpens Ethos's recommendations.`
          : `Each one you add unlocks more accurate risk and compliance recommendations.`
      }`
    : status.body
  const currentIdx = isEmpty ? 0 : STAGES.findIndex(s => s.label === status.label)
  return (
    <div className="rounded-xl bg-[#f3fffa] p-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className={cn('size-3 rounded', isEmpty ? 'bg-emerald-200' : 'bg-emerald-300')} />
          <p className="text-base font-medium text-foreground">{headline}</p>
        </div>
        {!isEmpty && status.lastSynced ? (
          <p className="text-xs text-muted-foreground">{status.lastSynced}</p>
        ) : null}
      </div>
      {body ? (
        <p className="max-w-[800px] text-sm text-foreground">{body}</p>
      ) : null}
      <StageBar currentIdx={currentIdx} />
    </div>
  )
}

function StageBar({ currentIdx }) {
  return (
    <div className="relative pt-2">
      <div className="flex h-3.5 gap-[3px]">
        {STAGES.map((s, idx) => (
          <div
            key={s.label}
            className={cn(
              'flex-1',
              idx === 0 && 'rounded-l-[2px]',
              idx === STAGES.length - 1 && 'rounded-r-[2px]',
              s.gradient
                ? `bg-gradient-to-r ${s.gradient}`
                : 'bg-[#d9d9d9] opacity-25',
            )}
          />
        ))}
      </div>
      <div className="relative h-6 mt-1.5">
        {STAGES.map((s, i) => {
          const left = `${((i + 0.5) / STAGES.length) * 100}%`
          const isCurrent = i === currentIdx
          if (!isCurrent && i === currentIdx) return null
          return (
            <div
              key={s.label}
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
              style={{ left }}
            >
              {isCurrent ? (
                <div className="size-0 border-x-[5px] border-x-transparent border-b-[6px] border-b-foreground/70 -mt-0.5" />
              ) : null}
              <span className={cn(
                'text-sm leading-6',
                isCurrent ? 'font-medium text-foreground/85' : 'text-foreground/60',
              )}>
                {s.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SearchAddRow({ search, onSearchChange, onAdd }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search vault"
          className="h-8 pl-9"
        />
      </div>
      <Button size="sm" onClick={onAdd} className="h-8 gap-1.5 bg-[#005c58] hover:bg-[#004a47]">
        <Plus className="size-3.5" />
        Add Files
      </Button>
    </div>
  )
}

function CategoryChips({ categories, selectedId, onSelect, files, hasFilters, onClearFilters }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {categories.map(c => {
        const count = files.filter(f => f.categoryId === c.id).length
        const active = selectedId === c.id

        return (
          <Tooltip key={c.id} delayDuration={150}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onSelect(active ? null : c.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 h-8 border transition-colors',
                  active
                    ? 'bg-[#dffff2] border-[rgba(14,95,91,0.5)]'
                    : 'bg-muted/60 hover:bg-muted border-transparent',
                )}
              >
                <span className={cn(
                  'text-sm font-medium tracking-[-0.28px]',
                  active ? 'text-[#0e5f5b]' : 'text-foreground',
                )}>
                  {c.name}
                </span>
                <span className={cn(
                  'text-xs',
                  active ? 'text-[rgba(14,95,91,0.5)]' : 'text-muted-foreground',
                )}>
                  {count}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="font-medium">{c.name}</p>
              <p className="text-[11px] opacity-90">
                {count > 0
                  ? `${count} ${count === 1 ? 'document' : 'documents'}`
                  : 'No documents yet'}
              </p>
            </TooltipContent>
          </Tooltip>
        )
      })}
      {hasFilters ? (
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <X className="size-3" />
          Clear
        </button>
      ) : null}
    </div>
  )
}

function FileRow({ file, categoryName, onEdit, onRemove }) {
  const Icon = FILE_TYPE_ICONS[file.type] ?? FileText
  const status = FILE_STATUS[file.status] ?? FILE_STATUS.healthy
  return (
    <TableRow className="group hover:bg-muted/20">
      <TableCell className="px-3 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon className="size-5 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {fileFormat(file)} <span className="opacity-60">·</span> {fileSource(file)}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-3 py-2.5">
        <Tooltip delayDuration={150}>
          <TooltipTrigger asChild>
            <span
              className={cn(
                'inline-flex items-center justify-center rounded-[4px] px-1.5 py-0.5 cursor-help',
                'text-[12px] font-medium uppercase',
                status.bg, status.text,
              )}
              style={{ fontFamily: '"Roboto Mono", ui-monospace, SFMono-Regular, Menlo, monospace' }}
            >
              {status.label}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="font-medium">{status.label}</p>
            <p className="text-[11px] opacity-90">{status.description}</p>
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell className="px-3 py-2.5">
        <span className="inline-flex items-center justify-center rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
          {categoryName ?? '—'}
        </span>
      </TableCell>
      <TableCell className="px-3 py-2.5">
        <span className="text-sm text-muted-foreground">{file.lastUpdated}</span>
      </TableCell>
      <TableCell className="px-3 py-2.5">
        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
            Open
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="More actions"
              >
                <MoreHorizontal className="size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onSelect={() => onEdit?.(file)} className="text-sm">
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => onRemove?.(file)}
                className="text-sm text-destructive focus:text-destructive"
              >
                Remove from vault
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  )
}

function SuggestionRow({ name, onUpload }) {
  return (
    <TableRow className="group hover:bg-muted/20">
      <TableCell className="px-3 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <FileText className="size-5 text-muted-foreground/50 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground/55 truncate">{name}</p>
            <p className="text-xs text-muted-foreground/70 truncate">Not yet uploaded</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-3 py-2.5">
        <span
          className="inline-flex items-center justify-center rounded-[4px] px-1.5 py-0.5 text-[12px] font-medium uppercase bg-slate-100 text-slate-500"
          style={{ fontFamily: '"Roboto Mono", ui-monospace, SFMono-Regular, Menlo, monospace' }}
        >
          Suggested
        </span>
      </TableCell>
      <TableCell className="px-3 py-2.5" />
      <TableCell className="px-3 py-2.5">
        <span className="text-sm text-muted-foreground/60">—</span>
      </TableCell>
      <TableCell className="px-3 py-2.5">
        <div className="flex items-center justify-end gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1" onClick={onUpload}>
            <Upload className="size-3" /> Upload
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

function CategorySection({ category, files, suggestions, categoryNameById, onEdit, onRemove, onAdd }) {
  const total = files.length + suggestions.length
  if (total === 0) return null
  return (
    <section className="rounded-[10px] border border-border/70 bg-white overflow-hidden">
      <header className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border/70">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-foreground">{category.name}</h3>
            <span className="text-xs text-muted-foreground">
              {files.length} uploaded
              {suggestions.length > 0 ? ` · ${suggestions.length} suggested` : ''}
            </span>
          </div>
          {category.description ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{category.description}</p>
          ) : null}
        </div>
        <Button size="sm" variant="outline" className="gap-1.5 shrink-0" onClick={onAdd}>
          <Plus className="size-3.5" /> Add to {category.name}
        </Button>
      </header>
      <Table className="table-fixed">
        <colgroup>
          <col style={{ width: '38%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '17%' }} />
          <col style={{ width: '18%' }} />
          <col style={{ width: '12%' }} />
        </colgroup>
        <TableBody>
          {files.map(f => (
            <FileRow
              key={f.id}
              file={f}
              categoryName={categoryNameById[f.categoryId]}
              onEdit={onEdit}
              onRemove={onRemove}
            />
          ))}
          {suggestions.map((s, i) => (
            <SuggestionRow key={`sug-${category.id}-${i}`} name={s.name} onUpload={onAdd} />
          ))}
        </TableBody>
      </Table>
    </section>
  )
}

function FileTable({ files, totalRows, categoryNameById, onEdit, onRemove }) {
  // Reserve space for the full unfiltered set so the table doesn't reflow
  // when chips/search filter rows out. ~56px per row + 40px for the header.
  const minHeight = totalRows * 56 + 40
  return (
    <div style={{ minHeight }}>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="px-3 py-2 text-[13px] w-[38%]">
              <span className="inline-flex items-center gap-1">File Name <ChevronDown className="size-3 text-muted-foreground" /></span>
            </TableHead>
            <TableHead className="px-3 py-2 text-[13px] w-[15%]">Status</TableHead>
            <TableHead className="px-3 py-2 text-[13px] w-[17%]">Category</TableHead>
            <TableHead className="px-3 py-2 text-[13px] w-[18%]">Last updated</TableHead>
            <TableHead className="px-3 py-2 w-[12%]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.length > 0 ? (
            files.map(f => (
              <FileRow
                key={f.id}
                file={f}
                categoryName={categoryNameById[f.categoryId]}
                onEdit={onEdit}
                onRemove={onRemove}
              />
            ))
          ) : (
            <TableRow className="hover:bg-transparent border-0">
              <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                No files match the current filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

/* ───────────── Edit file overlay ───────────── */

function EditFileOverlay({ file, categories, onClose, onSave }) {
  const [categoryId, setCategoryId] = useState(file.categoryId)
  const Icon = FILE_TYPE_ICONS[file.type] ?? FileText

  return (
    <ModalShell open={true} onClose={onClose} width="max-w-md">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <p className="text-sm font-medium text-foreground">Edit document</p>
        <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>

      <div className="px-5 py-5 space-y-5 overflow-auto">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
          <Icon className="size-5 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">Last updated {file.lastUpdated}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground uppercase tracking-wider">Category</label>
          <div className="space-y-1.5">
            {categories.map(c => {
              const active = c.id === categoryId
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoryId(c.id)}
                  className={cn(
                    'w-full flex items-center gap-2.5 rounded-md border px-3 py-2 text-left text-sm transition-colors',
                    active
                      ? 'border-brand-700 bg-brand-50'
                      : 'border-border bg-white hover:border-brand-300 hover:bg-muted/30',
                  )}
                >
                  <FolderOpen className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="flex-1 font-medium text-foreground">{c.name}</span>
                  {active ? <Check className="size-4 text-brand-700" /> : null}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border px-5 py-3 bg-background">
        <p className="text-xs text-muted-foreground">
          {categoryId === file.categoryId ? 'No changes to save' : 'Category will be updated'}
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            disabled={categoryId === file.categoryId}
            onClick={() => onSave(file.id, categoryId)}
          >
            Save
          </Button>
        </div>
      </div>
    </ModalShell>
  )
}

function PopulatedView({ empty = false, onPreviewEmpty, onPreviewPopulated, onAddFiles, onAddCategory, onOpenSettings }) {
  const [selectedChipId, setSelectedChipId] = useState(null)
  const [search, setSearch] = useState('')
  const [editingFile, setEditingFile] = useState(null)
  // Local edits + soft-removals — keep changes within the session without
  // mutating the tenant config source data.
  const [fileEdits, setFileEdits] = useState({})
  const [removedIds, setRemovedIds] = useState(() => new Set())

  const categoryNameById = useMemo(
    () => Object.fromEntries(CATEGORIES.map(c => [c.id, c.name])),
    [],
  )

  const liveFiles = useMemo(() => {
    if (empty) return []
    return FILES
      .filter(f => !removedIds.has(f.id))
      .map(f => fileEdits[f.id] ? { ...f, categoryId: fileEdits[f.id] } : f)
  }, [empty, fileEdits, removedIds])

  // Suggested baseline documents grouped by category — pulled from the same
  // mock list used by the upload flow so the empty state mirrors what users
  // see when Ethos does the categorisation for them.
  const suggestionsByCategory = useMemo(() => {
    const uploadedNames = new Set(liveFiles.map(f => f.name.toLowerCase()))
    const map = {}
    for (const s of MOCK_DROP_FILES) {
      if (uploadedNames.has(s.name.toLowerCase())) continue
      ;(map[s.category] ??= []).push(s)
    }
    return map
  }, [liveFiles])

  const totalSuggested = MOCK_DROP_FILES.length

  const visibleCategories = useMemo(() => {
    return selectedChipId ? CATEGORIES.filter(c => c.id === selectedChipId) : CATEGORIES
  }, [selectedChipId])

  const sectionsData = useMemo(() => {
    const q = search.trim().toLowerCase()
    return visibleCategories.map(c => {
      const files = liveFiles
        .filter(f => f.categoryId === c.id)
        .filter(f => !q || f.name.toLowerCase().includes(q))
      const suggestions = (suggestionsByCategory[c.id] ?? [])
        .filter(s => !q || s.name.toLowerCase().includes(q))
      return { category: c, files, suggestions }
    })
  }, [visibleCategories, liveFiles, suggestionsByCategory, search])

  function handleEdit(file) {
    setEditingFile(file)
  }

  function handleSaveEdit(fileId, newCategoryId) {
    setFileEdits(prev => ({ ...prev, [fileId]: newCategoryId }))
    setEditingFile(null)
  }

  function handleRemove(file) {
    setRemovedIds(prev => {
      const next = new Set(prev)
      next.add(file.id)
      return next
    })
  }

  return (
    <div className="space-y-6">
      <VaultHeader onPreviewEmpty={empty ? onPreviewPopulated : onPreviewEmpty} onOpenSettings={onOpenSettings} emptyToggleLabel={empty ? 'Preview filled state' : undefined} />
      <StatusHeroCard
        status={STATUS}
        mode={empty ? 'empty' : 'populated'}
        uploadedCount={liveFiles.length}
        baselineCount={totalSuggested}
      />
      <SearchAddRow search={search} onSearchChange={setSearch} onAdd={onAddFiles} />
      <CategoryChips
        categories={CATEGORIES}
        selectedId={selectedChipId}
        onSelect={setSelectedChipId}
        files={liveFiles}
        hasFilters={Boolean(selectedChipId) || search.length > 0}
        onClearFilters={() => { setSelectedChipId(null); setSearch('') }}
      />
      <div className="space-y-4">
        {sectionsData.map(({ category, files, suggestions }) => (
          <CategorySection
            key={category.id}
            category={category}
            files={files}
            suggestions={suggestions}
            categoryNameById={categoryNameById}
            onEdit={handleEdit}
            onRemove={handleRemove}
            onAdd={() => onAddCategory(category)}
          />
        ))}
      </div>
      {editingFile ? (
        <EditFileOverlay
          file={editingFile}
          categories={CATEGORIES}
          onClose={() => setEditingFile(null)}
          onSave={handleSaveEdit}
        />
      ) : null}
    </div>
  )
}

/* ───────────── Empty state — drop zone + DMS rail + starter pack ───────────── */

function DropZone({ onDrop, helper }) {
  const [over, setOver] = useState(false)
  const inputRef = useRef(null)
  const helperText = helper ?? 'Ethos will automatically sort them into Governing Documents, Policies, Frameworks and Strategy & Reporting.'
  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={e => { e.preventDefault(); setOver(false); onDrop() }}
      className={cn(
        'group w-full rounded-xl border-2 border-dashed bg-white px-8 py-14 text-center transition-all',
        over ? 'border-brand-700 bg-brand-50/50' : 'border-border hover:border-brand-400 hover:bg-muted/30',
      )}
    >
      <input ref={inputRef} type="file" multiple className="hidden" onChange={onDrop} />
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-50 text-brand-800 transition-transform group-hover:scale-105">
        <Upload className="size-6" />
      </div>
      <p className="mt-5 text-base font-medium text-foreground">Drop your documents here</p>
      <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto">{helperText}</p>
      <div className="mt-5 inline-flex items-center gap-2">
        <Button size="sm" type="button" onClick={e => { e.stopPropagation(); inputRef.current?.click() }}>
          Choose files
        </Button>
        <span className="text-xs text-muted-foreground">or drag and drop</span>
      </div>
    </button>
  )
}

function DmsCard({ provider, onClick }) {
  const { Icon } = provider
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-white px-4 py-4 transition-all hover:border-brand-400 hover:bg-muted/20"
    >
      <Icon className="size-7" style={{ color: provider.color }} />
      <span className="text-xs font-medium text-foreground">{provider.name}</span>
    </button>
  )
}

function EmptyStateChecklist({ categories, onAddCategory }) {
  const descriptions = {
    governing:  'Constitution, deeds, board charter, delegations of authority',
    policies:   'Code of conduct, conflict of interest, whistleblower, privacy',
    frameworks: 'Risk management, compliance, cyber security, ESG',
    strategy:   'Strategic plan, annual report, modern slavery, sustainability',
  }
  return (
    <div className="rounded-xl bg-[#F8FAFF] p-6 space-y-4">
      <div>
        <p className="text-base font-medium text-foreground">Setup Ethos Vault</p>
        <p className="mt-2 text-sm text-foreground max-w-[800px]">
          Upload foundational documents across these four areas. This gives Ethos the baseline it needs to support automated risk and compliance recommendations.
        </p>
      </div>
      <ul className="space-y-2">
        {categories.map(cat => (
          <li
            key={cat.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-[#f5f5f5] bg-white px-4 py-3"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="size-8 rounded-full bg-[#f7f7f7] border border-border shrink-0" />
              <div className="min-w-0">
                <p className="text-base font-medium text-foreground">{cat.name}</p>
                <p className="text-xs text-foreground">{descriptions[cat.id] ?? ''}</p>
                <p className="mt-2 text-xs text-muted-foreground">0 files</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddCategory(cat)}
              className="min-w-[80px] border-[rgba(10,10,10,0.1)] bg-white text-[#393939] hover:bg-muted/30 hover:text-[#393939]"
            >
              Add {cat.name}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SmartSyncCta({ onClick }) {
  return (
    <div className="rounded-[10px] border border-[#dbd5ff] bg-[#faf9ff] p-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex size-6 items-center justify-center rounded bg-[#ffd6ff] shrink-0">
          <Sparkles className="size-4 text-[#7a3aa0]" />
        </div>
        <p className="text-sm leading-5 text-foreground min-w-0">
          <span className="font-medium">Quick Vault Sync:</span>
          <span className="text-foreground/60"> Ethos will scan your document system and automatically make suggestions on vault requirements</span>
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={onClick}
        className="shrink-0 min-w-[80px] border-[rgba(10,10,10,0.1)] bg-white text-[#393939] hover:bg-muted/30 hover:text-[#393939]"
      >
        <Sparkles className="size-3.5 opacity-50" />
        Quick Scan
      </Button>
    </div>
  )
}

function VaultEmptyState({ onAddCategory, onSmartSync, onPreviewPopulated }) {
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Vault</h1>
          <p className="mt-2 text-sm text-foreground/80">
            Manage the access Ethos has to your organisation&rsquo;s foundational documents
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onPreviewPopulated}
          className="min-w-[80px] border-[rgba(10,10,10,0.1)] bg-white text-[#393939] hover:bg-muted/30 hover:text-[#393939]"
        >
          <Eye className="size-3.5" /> Preview populated state
        </Button>
      </header>

      <EmptyStateChecklist categories={CATEGORIES} onAddCategory={onAddCategory} />

      <SmartSyncCta onClick={onSmartSync} />
    </div>
  )
}

/* ───────────── Categorising loader ───────────── */

function CategorisingLoader({ count }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setProgress(p => Math.min(100, p + 4)), 80)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand-800 animate-pulse">
        <Sparkles className="size-7" />
      </div>
      <p className="mt-6 text-base font-medium text-foreground">Categorising {count} documents</p>
      <p className="mt-1.5 text-sm text-muted-foreground">Ethos is reading and sorting your files…</p>
      <div className="mt-6 h-1.5 w-72 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-brand-700 transition-all duration-150" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

/* ───────────── Confirmation sheet (C) ───────────── */

function CategoryDropdown({ value, onChange, options }) {
  const current = options.find(c => c.id === value)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/50">
          {current?.name ?? '—'}
          <ChevronDown className="size-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        {options.map(c => (
          <DropdownMenuItem key={c.id} onSelect={() => onChange(c.id)} className="text-xs">
            <span className="flex-1">{c.name}</span>
            {c.id === value ? <Check className="size-3.5 text-brand-700" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ConfirmCategorisation({ files, onBack, onConfirm }) {
  const [items, setItems] = useState(files)
  const lowConfidence = items.filter(i => i.confidence < 80).length

  function setCategory(idx, cat) {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, category: cat, overridden: true } : it))
  }

  return (
    <div className="space-y-6">
      <header>
        <Button size="sm" variant="ghost" onClick={onBack} className="gap-1.5 -ml-2 mb-3 text-muted-foreground">
          <ArrowLeft className="size-3.5" /> Back
        </Button>
        <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Review categorisation</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ethos categorised {items.length} documents.
          {lowConfidence > 0 && (
            <span className="ml-1 text-amber-700">{lowConfidence} {lowConfidence === 1 ? 'item' : 'items'} need a closer look.</span>
          )}
        </p>
      </header>

      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-5 py-2.5 border-b border-border bg-muted/30 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <div className="col-span-6">Document</div>
          <div className="col-span-3">Category</div>
          <div className="col-span-2">Confidence</div>
          <div className="col-span-1" />
        </div>
        {items.map((it, idx) => {
          const low = it.confidence < 80
          return (
            <div key={it.name} className="grid grid-cols-12 gap-3 items-center px-5 py-3 border-b border-border last:border-b-0 hover:bg-muted/20">
              <div className="col-span-6 flex items-center gap-3 min-w-0">
                <div className="flex size-7 items-center justify-center rounded bg-muted text-muted-foreground shrink-0">
                  <FileText className="size-3.5" />
                </div>
                <p className="text-sm text-foreground truncate">{it.name}</p>
              </div>
              <div className="col-span-3 flex items-center gap-2">
                <FileText className="size-3.5 text-brand-800" />
                <CategoryDropdown
                  value={it.category}
                  onChange={cat => setCategory(idx, cat)}
                  options={CATEGORIES}
                />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <div className="h-1 w-14 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn('h-full rounded-full', low ? 'bg-amber-500' : 'bg-emerald-500')}
                    style={{ width: `${it.confidence}%` }}
                  />
                </div>
                <span className={cn('text-xs', low ? 'text-amber-700' : 'text-muted-foreground')}>
                  {it.confidence}%
                </span>
              </div>
              <div className="col-span-1 flex justify-end">
                {it.overridden ? (
                  <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-brand-200 bg-brand-50 text-brand-700">
                    Edited
                  </Badge>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">All documents will be added to your Vault and tagged by source.</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onBack}>Cancel</Button>
          <Button size="sm" onClick={onConfirm}>Confirm and finish</Button>
        </div>
      </div>
    </div>
  )
}

/* ───────────── DMS scan modal (D) ───────────── */

function ModalShell({ open, onClose, children, width = 'max-w-2xl' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
      <div className={cn('relative w-full rounded-xl border border-border bg-background shadow-xl flex flex-col max-h-[85vh] overflow-hidden', width)}>
        {children}
      </div>
    </div>
  )
}

function DmsScanModal({ provider, open, onClose, onConfirm }) {
  if (!provider) return null
  return (
    <DmsScanModalInner
      key={provider.id}
      provider={provider}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}

function DmsScanModalInner({ provider, open, onClose, onConfirm }) {
  const [phase, setPhase] = useState('scanning') // scanning | review
  useEffect(() => {
    const id = setTimeout(() => setPhase('review'), 1800)
    return () => clearTimeout(id)
  }, [])

  const { Icon } = provider

  return (
    <ModalShell open={open} onClose={onClose}>
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Icon className="size-5" style={{ color: provider.color }} />
          <p className="text-sm font-medium text-foreground">Connect {provider.name}</p>
        </div>
        <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>

      {phase === 'scanning' ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex size-14 items-center justify-center rounded-full bg-brand-50 text-brand-800 animate-pulse">
            <Sparkles className="size-6" />
          </div>
          <p className="mt-5 text-base font-medium text-foreground">Scanning {provider.name}…</p>
          <p className="mt-1.5 text-sm text-muted-foreground">Reading your folder structure</p>
        </div>
      ) : (
        <>
          <div className="px-5 py-4 border-b border-border bg-muted/20">
            <p className="text-sm text-foreground">
              Found <span className="font-medium">412 documents</span> across <span className="font-medium">18 folders</span>.
            </p>
            <p className="text-xs text-muted-foreground mt-1">Review the proposed mapping below — Ethos will sync these on confirmation.</p>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-12 gap-3 px-5 py-2.5 border-b border-border bg-muted/30 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sticky top-0">
              <div className="col-span-5">Source folder</div>
              <div className="col-span-5">Mapped to</div>
              <div className="col-span-2 text-right">Documents</div>
            </div>
            {DMS_FOLDER_MAPPING.map(row => {
              const target = CATEGORIES.find(c => c.id === row.target)
              return (
                <div key={row.folder} className="grid grid-cols-12 gap-3 items-center px-5 py-3 border-b border-border last:border-b-0 hover:bg-muted/20">
                  <div className="col-span-5 flex items-center gap-2 min-w-0">
                    <FolderOpen className="size-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground truncate">{row.folder}</span>
                  </div>
                  <div className="col-span-5 flex items-center gap-2 min-w-0">
                    {target ? (
                      <>
                        <FileText className="size-3.5 text-brand-800" />
                        <span className="text-sm text-foreground truncate">{target.name}</span>
                      </>
                    ) : (
                      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 text-[10px] h-5 px-1.5">
                        Unmapped — review manually
                      </Badge>
                    )}
                  </div>
                  <div className="col-span-2 text-right text-sm text-muted-foreground">{row.docs}</div>
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between border-t border-border px-5 py-3 bg-background">
            <p className="text-xs text-muted-foreground">You can re-run mapping any time after connecting.</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={onClose}>Cancel</Button>
              <Button size="sm" onClick={onConfirm}>Confirm mapping</Button>
            </div>
          </div>
        </>
      )}
    </ModalShell>
  )
}

/* ───────────── Starter pack modal (F) ───────────── */

function StarterPackModal({ open, onClose, onApply }) {
  const [industry, setIndustry] = useState(INDUSTRIES[0])
  const [size, setSize] = useState(SIZES[2])
  const [frameworks, setFrameworks] = useState(new Set(['ASIC / Corporations Act', 'OAIC / Privacy Act', 'WHS Act']))

  function toggleFramework(fw) {
    setFrameworks(prev => {
      const next = new Set(prev)
      if (next.has(fw)) next.delete(fw); else next.add(fw)
      return next
    })
  }

  return (
    <ModalShell open={open} onClose={onClose} width="max-w-xl">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Wand2 className="size-5 text-brand-800" />
          <p className="text-sm font-medium text-foreground">Tell Ethos about your organisation</p>
        </div>
        <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>

      <div className="px-5 py-5 space-y-5 overflow-auto">
        <p className="text-sm text-muted-foreground">
          Three quick questions and Ethos will pre-populate your Vault with the foundation categories we expect.
        </p>

        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground uppercase tracking-wider">Industry</label>
          <div className="grid grid-cols-2 gap-2">
            {INDUSTRIES.map(i => (
              <button
                key={i}
                type="button"
                onClick={() => setIndustry(i)}
                className={cn(
                  'rounded-md border px-3 py-2 text-left text-sm transition-colors',
                  i === industry ? 'border-brand-700 bg-brand-50 text-foreground' : 'border-border bg-white text-muted-foreground hover:border-brand-300 hover:bg-muted/30',
                )}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground uppercase tracking-wider">Organisation size</label>
          <div className="grid grid-cols-2 gap-2">
            {SIZES.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={cn(
                  'rounded-md border px-3 py-2 text-left text-sm transition-colors',
                  s === size ? 'border-brand-700 bg-brand-50 text-foreground' : 'border-border bg-white text-muted-foreground hover:border-brand-300 hover:bg-muted/30',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground uppercase tracking-wider">Governance frameworks that apply</label>
          <div className="flex flex-wrap gap-1.5">
            {GOVERNANCE_FRAMEWORKS.map(fw => {
              const active = frameworks.has(fw)
              return (
                <button
                  key={fw}
                  type="button"
                  onClick={() => toggleFramework(fw)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs transition-colors',
                    active ? 'border-brand-700 bg-brand-700 text-white' : 'border-border bg-white text-muted-foreground hover:border-brand-300',
                  )}
                >
                  {fw}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border px-5 py-3 bg-background">
        <p className="text-xs text-muted-foreground">Ethos will pre-fill 14 expected policies, 6 contracts and 4 register items.</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={() => onApply({ industry, size, frameworks: [...frameworks] })}>Apply starter pack</Button>
        </div>
      </div>
    </ModalShell>
  )
}

/* ───────────── Smart Sync modal ───────────── */

function SmartSyncModal({ open, onClose, onConfirm, alreadyConnected = false }) {
  if (!open) return null
  return (
    <SmartSyncModalInner
      key="smart-sync"
      onClose={onClose}
      onConfirm={onConfirm}
      alreadyConnected={alreadyConnected}
    />
  )
}

function SmartSyncModalInner({ onClose, onConfirm, alreadyConnected }) {
  const [phase, setPhase] = useState(alreadyConnected ? 'analysing' : 'connect')
  const [provider, setProvider] = useState(null)
  // Pre-check every suggestion by default; user can uncheck.
  const [selectedNames, setSelectedNames] = useState(
    () => new Set(SMART_SYNC_SUGGESTIONS.map(s => s.name)),
  )

  function handleConnect(p) {
    setProvider(p)
    setPhase('analysing')
  }

  // Drive the analysing → review transition automatically.
  useEffect(() => {
    if (phase !== 'analysing') return
    const id = setTimeout(() => setPhase('review'), 2400)
    return () => clearTimeout(id)
  }, [phase])

  function toggleName(name) {
    setSelectedNames(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name); else next.add(name)
      return next
    })
  }

  function toggleCategory(catId) {
    const items = SMART_SYNC_SUGGESTIONS.filter(s => s.category === catId)
    const allSelected = items.every(i => selectedNames.has(i.name))
    setSelectedNames(prev => {
      const next = new Set(prev)
      items.forEach(i => allSelected ? next.delete(i.name) : next.add(i.name))
      return next
    })
  }

  const grouped = useMemo(() => {
    return CATEGORIES.map(c => ({
      ...c,
      items: SMART_SYNC_SUGGESTIONS.filter(s => s.category === c.id),
    })).filter(g => g.items.length > 0)
  }, [])

  const total = SMART_SYNC_SUGGESTIONS.length
  const selectedCount = selectedNames.size

  return (
    <ModalShell open={true} onClose={onClose} width="max-w-3xl">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-[#ffd6ff]">
            <Sparkles className="size-4 text-[#7a3aa0]" />
          </div>
          <p className="text-sm font-medium text-foreground">Quick Vault Sync</p>
        </div>
        <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>

      {phase === 'connect' && (
        <div className="px-5 py-5 space-y-4 overflow-auto">
          <div>
            <p className="text-sm font-medium text-foreground">Connect a source to scan</p>
            <p className="text-xs text-muted-foreground mt-1">
              Ethos will read your folder structure to identify foundational documents — nothing is moved or modified.
            </p>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {DMS_PROVIDERS.map(p => (
              <DmsCard key={p.id} provider={p} onClick={() => handleConnect(p)} />
            ))}
          </div>
        </div>
      )}

      {phase === 'analysing' && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand-800 animate-pulse">
            <Sparkles className="size-7" />
          </div>
          <p className="mt-6 text-base font-medium text-foreground">
            Analysing {provider ? provider.name : 'your folders'}…
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Identifying foundational documents and proposing categories.
          </p>
          <div className="mt-6 h-1.5 w-72 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-brand-700 animate-pulse" style={{ width: '70%' }} />
          </div>
        </div>
      )}

      {phase === 'review' && (
        <>
          <div className="px-5 py-4 border-b border-border bg-muted/20">
            <p className="text-sm text-foreground">
              Found <span className="font-medium">{total} foundational documents</span>.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              All are selected by default. Uncheck any you don't want Ethos to use, then confirm.
            </p>
          </div>
          <div className="flex-1 overflow-auto">
            {grouped.map(group => {
              const allSelected = group.items.every(i => selectedNames.has(i.name))
              const someSelected = group.items.some(i => selectedNames.has(i.name))
              return (
                <div key={group.id} className="border-b border-border last:border-b-0">
                  <div className="flex items-center gap-2 px-5 py-2 bg-muted/30">
                    <Checkbox
                      checked={allSelected ? true : (someSelected ? 'indeterminate' : false)}
                      onCheckedChange={() => toggleCategory(group.id)}
                      className="size-3.5"
                    />
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {group.name} <span className="opacity-70">· {group.items.length}</span>
                    </p>
                  </div>
                  {group.items.map(item => {
                    const checked = selectedNames.has(item.name)
                    const low = item.confidence < 80
                    return (
                      <label
                        key={item.name}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 cursor-pointer"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleName(item.name)}
                          className="size-4"
                        />
                        <FileText className="size-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">PDF · SharePoint</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="h-1 w-14 overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn('h-full rounded-full', low ? 'bg-amber-500' : 'bg-emerald-500')}
                              style={{ width: `${item.confidence}%` }}
                            />
                          </div>
                          <span className={cn('text-xs', low ? 'text-amber-700' : 'text-muted-foreground')}>
                            {item.confidence}%
                          </span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between border-t border-border px-5 py-3 bg-background">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{selectedCount}</span> of {total} selected
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={onClose}>Cancel</Button>
              <Button size="sm" disabled={selectedCount === 0} onClick={onConfirm}>
                Add {selectedCount} to Vault
              </Button>
            </div>
          </div>
        </>
      )}
    </ModalShell>
  )
}

/* ───────────── Add Files modal — overlay variant of the empty-state flow ───────────── */

function AddFilesModal({ open, onClose, onConnectDms, onStarterPack, category }) {
  if (!open) return null
  return (
    <AddFilesModalInner
      key={category?.id ?? 'general'}
      onClose={onClose}
      onConnectDms={onConnectDms}
      onStarterPack={onStarterPack}
      category={category}
    />
  )
}

function AddFilesModalInner({ onClose, onConnectDms, onStarterPack, category }) {
  // Phases:
  //   choose       — drop zone + DMS rail (entry state)
  //   categorising — unscoped flow only: AI sorting loader
  //   confirming   — unscoped flow only: review categorisation table
  //   adding       — category-locked flow only: brief "uploading" beat
  const [phase, setPhase] = useState('choose')

  // When a category is locked (per-category Add), every dropped file goes
  // straight to that category — no categorisation step needed.
  const filesForConfirm = useMemo(() => {
    return MOCK_DROP_FILES
  }, [])

  // Number of files for the per-category "adding" beat (varied per demo).
  const droppedCount = 4

  const headerTitle = category ? `Add ${category.name}` : 'Add files to your vault'
  const dropHelper = category
    ? `Drop your ${category.name.toLowerCase()} here — Ethos will add them to the ${category.name} section.`
    : 'Ethos will automatically sort them into Governing Documents, Policies, Frameworks and Strategy & Reporting.'

  function handleDrop() {
    if (category) {
      // Per-category Add: no categorisation step, brief upload beat then close.
      setPhase('adding')
      setTimeout(() => onClose(), 1500)
    } else {
      setPhase('categorising')
      setTimeout(() => setPhase('confirming'), 2400)
    }
  }

  function handleConfirm() {
    onClose()
  }

  return (
    <ModalShell open={true} onClose={onClose} width="max-w-3xl">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-brand-50 text-brand-800">
            <Plus className="size-4" />
          </div>
          <p className="text-sm font-medium text-foreground">{headerTitle}</p>
        </div>
        <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>

      {phase === 'choose' && (
        <div className="overflow-auto px-5 py-5 space-y-6">
          <DropZone onDrop={handleDrop} helper={dropHelper} />

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">Or connect a source</span>
              <span className="text-xs text-muted-foreground">— Ethos will scan and map your existing folders</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-5 gap-3">
              {DMS_PROVIDERS.map(p => (
                <DmsCard key={p.id} provider={p} onClick={() => onConnectDms(p)} />
              ))}
            </div>
          </div>

          {!category && (
            <div className="rounded-lg border border-border bg-muted/30 px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-800 shrink-0">
                  <Wand2 className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Don't have documents to add yet?</p>
                  <p className="text-xs text-muted-foreground">Tell Ethos about your organisation and we'll suggest a starter pack.</p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={onStarterPack}>Get started</Button>
            </div>
          )}
        </div>
      )}

      {phase === 'categorising' && (
        <CategorisingLoader count={filesForConfirm.length} />
      )}

      {phase === 'confirming' && (
        <div className="overflow-auto px-5 py-5">
          <ConfirmCategorisation
            files={filesForConfirm}
            onBack={() => setPhase('choose')}
            onConfirm={handleConfirm}
          />
        </div>
      )}

      {phase === 'adding' && category && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex size-14 items-center justify-center rounded-full bg-brand-50 text-brand-800 animate-pulse">
            <Upload className="size-6" />
          </div>
          <p className="mt-5 text-base font-medium text-foreground">
            Adding {droppedCount} {droppedCount === 1 ? 'document' : 'documents'} to {category.name}…
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">Uploading your files</p>
          <div className="mt-6 h-1.5 w-72 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-brand-700 animate-pulse" style={{ width: '75%' }} />
          </div>
        </div>
      )}
    </ModalShell>
  )
}

/* ───────────── Page (state machine) ───────────── */

export default function VaultPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const forceEmpty = searchParams.get('vault') === 'empty'

  const [dmsProvider, setDmsProvider] = useState(null)
  const [starterOpen, setStarterOpen] = useState(false)
  const [addFilesOpen, setAddFilesOpen] = useState(false)
  const [addFilesCategory, setAddFilesCategory] = useState(null) // null = unscoped (populated "Add Files")
  const [smartSyncOpen, setSmartSyncOpen] = useState(false)
  const [smartSyncConnected, setSmartSyncConnected] = useState(false)

  const mode = forceEmpty ? 'empty' : 'populated'

  function goPreviewEmpty() {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set('vault', 'empty')
      return next
    })
  }

  function goPopulated() {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.delete('vault')
      return next
    })
  }

  function openAddFiles(category = null) {
    setAddFilesCategory(category)
    setAddFilesOpen(true)
  }

  function closeAddFiles() {
    setAddFilesOpen(false)
    setAddFilesCategory(null)
  }

  function openDms(provider) {
    setDmsProvider(provider)
  }

  function confirmDms() {
    setDmsProvider(null)
    closeAddFiles()
    goPopulated()
  }

  function applyStarter() {
    setStarterOpen(false)
    closeAddFiles()
    goPopulated()
  }

  function confirmSmartSync() {
    setSmartSyncOpen(false)
    setSmartSyncConnected(true)
    goPopulated()
  }

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="mx-auto max-w-[1180px] px-8 py-8">
        <PopulatedView
          empty={mode === 'empty'}
          onPreviewEmpty={goPreviewEmpty}
          onPreviewPopulated={goPopulated}
          onAddFiles={() => openAddFiles(null)}
          onAddCategory={(cat) => openAddFiles(cat)}
          onOpenSettings={() => navigate('/admin/vault')}
        />

        <AddFilesModal
          open={addFilesOpen}
          onClose={closeAddFiles}
          onConnectDms={openDms}
          onStarterPack={() => setStarterOpen(true)}
          category={addFilesCategory}
        />
        <SmartSyncModal
          open={smartSyncOpen}
          onClose={() => setSmartSyncOpen(false)}
          onConfirm={confirmSmartSync}
          alreadyConnected={smartSyncConnected}
        />
        <DmsScanModal
          provider={dmsProvider}
          open={!!dmsProvider}
          onClose={() => setDmsProvider(null)}
          onConfirm={confirmDms}
        />
        <StarterPackModal
          open={starterOpen}
          onClose={() => setStarterOpen(false)}
          onApply={applyStarter}
        />
      </div>
    </div>
  )
}
