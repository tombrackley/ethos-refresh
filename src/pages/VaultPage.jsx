import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, FileText, Upload, CheckCircle2, X, ChevronDown, ChevronUp, RotateCcw, Users, Lock, Plug, Plug2, Search, Folder, ChevronRight, ArrowLeft, Sparkles, Check } from 'lucide-react'
import { SiGoogledrive, SiBox, SiDropbox } from 'react-icons/si'
import { TbBrandOnedrive } from 'react-icons/tb'
import FileManager, { Permissions, ItemView, Details, Column, Toolbar, Item, FileSelectionItem, ContextMenu, ContextMenuItem } from 'devextreme-react/file-manager'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import tenant from '@/config/tenant'
import { readResourceSaves } from '@/lib/vaultSaves'
import 'devextreme/dist/css/dx.light.css'

const t = tenant.pages.vault

const STAGES = t.stages
const FOLDERS = t.folders
const FILES = t.files
const SUGGESTION_LIMIT = 4
const UNDO_WINDOW_MS = 5000
const ROLES = ['Board Member', 'Company Secretary', 'Org Admin', 'User']
const UPLOADER_NAMES = {
  RR: 'Robert Ramsay',
  JW: 'James Whitfield',
  SM: 'Sarah Mitchell',
  KL: 'Kate Lovell',
}
const CURRENT_USER_NAME = 'Tom Bradley'

/* DMS providers. Only SharePoint is available in this prototype; the rest
   show as "Coming soon" and are disabled on the picker. */
const DMS_PROVIDERS = [
  { id: 'sharepoint',  name: 'SharePoint',     vendor: 'Microsoft', available: true  },
  { id: 'onedrive',    name: 'OneDrive',       vendor: 'Microsoft', available: false },
  { id: 'gdrive',      name: 'Google Drive',   vendor: 'Google',    available: false },
  { id: 'box',         name: 'Box',            vendor: 'Box',       available: false },
  { id: 'dropbox',     name: 'Dropbox',        vendor: 'Dropbox',   available: false },
]

/* Brand colors approximate the official product palette. */
const PROVIDER_BRAND = {
  sharepoint: { color: '#036C70' },
  onedrive:   { color: '#0364B8' },
  gdrive:     { color: '#1FA463' },
  box:        { color: '#0061D5' },
  dropbox:    { color: '#0061FF' },
}

function SharePointGlyph({ className }) {
  // SharePoint doesn't ship with react-icons; hand-drawn stylised "S" as a
  // recognisable placeholder in the brand teal.
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M13.5 4a6.5 6.5 0 0 0-6.264 4.784A4.5 4.5 0 0 0 8.75 17.5h.25a6.5 6.5 0 0 0 4.5-11.5V4Zm-1.6 2.55a1.45 1.45 0 0 1 1 2.47l-.09.08c-.35.3-.6.5-.6.85 0 .25.2.45.5.6l.4.2c.9.4 1.2 1 1.2 1.75 0 1.05-.85 1.8-2 1.8a2.7 2.7 0 0 1-1.4-.4l.3-1a2 2 0 0 0 1.1.35c.45 0 .75-.2.75-.55 0-.25-.15-.4-.55-.6l-.45-.2c-.85-.4-1.2-.95-1.2-1.7 0-.95.8-1.65 1.94-1.7Z"/>
    </svg>
  )
}

function ProviderBrandIcon({ providerId, className }) {
  switch (providerId) {
    case 'sharepoint': return <SharePointGlyph className={className} />
    case 'onedrive':   return <TbBrandOnedrive className={className} />
    case 'gdrive':     return <SiGoogledrive className={className} />
    case 'box':        return <SiBox className={className} />
    case 'dropbox':    return <SiDropbox className={className} />
    default:           return null
  }
}

/* Mock SharePoint site tree. Shape mirrors what a dev would get from
   Microsoft Graph — each node is either a folder (`items` children) or
   a file (with id, owner, modified, ext). Dev replaces this with Graph
   calls: /sites → /drives → /root/children. */
const SHAREPOINT_ROOT = {
  name: 'Your SharePoint',
  items: [
    {
      type: 'folder', name: 'Corporate',
      items: [
        { type: 'file', id: 'sp-cr-1', name: 'Constitution v4.pdf',        modified: '2026-02-12', owner: 'Sarah Mitchell' },
        { type: 'file', id: 'sp-cr-2', name: 'Shareholder Register.xlsx',   modified: '2026-03-20', owner: 'Robert Ramsay' },
        { type: 'file', id: 'sp-cr-3', name: 'Directors Register.xlsx',     modified: '2026-01-08', owner: 'Robert Ramsay' },
        { type: 'file', id: 'sp-cr-4', name: 'Delegation of Authority.pdf', modified: '2025-11-19', owner: 'James Whitfield' },
        {
          type: 'folder', name: 'AGM',
          items: [
            { type: 'file', id: 'sp-cr-5', name: '2025 AGM Minutes.pdf',   modified: '2025-11-04', owner: 'Kate Lovell' },
            { type: 'file', id: 'sp-cr-6', name: '2024 AGM Minutes.pdf',   modified: '2024-11-06', owner: 'Kate Lovell' },
          ],
        },
      ],
    },
    {
      type: 'folder', name: 'Board',
      items: [
        { type: 'file', id: 'sp-bd-1', name: 'Board Charter 2026.docx',      modified: '2026-03-02', owner: 'James Whitfield' },
        { type: 'file', id: 'sp-bd-2', name: 'Audit Committee Charter.pdf',  modified: '2026-02-22', owner: 'Sarah Mitchell' },
        { type: 'file', id: 'sp-bd-3', name: 'Risk Committee Charter.pdf',   modified: '2026-02-22', owner: 'Sarah Mitchell' },
        { type: 'file', id: 'sp-bd-4', name: 'Board Evaluation 2025.pdf',    modified: '2025-12-18', owner: 'Robert Ramsay' },
      ],
    },
    {
      type: 'folder', name: 'Policies',
      items: [
        { type: 'file', id: 'sp-pol-1', name: 'Privacy Policy v4.pdf',              modified: '2026-03-18', owner: 'Robert Ramsay' },
        { type: 'file', id: 'sp-pol-2', name: 'Code of Ethics 2026.pdf',            modified: '2026-01-30', owner: 'Sarah Mitchell' },
        { type: 'file', id: 'sp-pol-3', name: 'Whistleblower Protection Policy.pdf', modified: '2025-10-11', owner: 'James Whitfield' },
        { type: 'file', id: 'sp-pol-4', name: 'Acceptable Use Policy.docx',         modified: '2025-09-22', owner: 'Kate Lovell' },
      ],
    },
    {
      type: 'folder', name: 'Contracts',
      items: [
        { type: 'file', id: 'sp-ct-1', name: 'Master Services Agreement Template.docx', modified: '2026-02-28', owner: 'Sarah Mitchell' },
        { type: 'file', id: 'sp-ct-2', name: 'Supplier Agreement 2025.pdf',             modified: '2025-12-04', owner: 'James Whitfield' },
        { type: 'file', id: 'sp-ct-3', name: 'Office Lease — Sydney HQ.pdf',            modified: '2025-07-11', owner: 'Robert Ramsay' },
      ],
    },
    {
      type: 'folder', name: 'Compliance',
      items: [
        { type: 'file', id: 'sp-cmp-1', name: 'AML-CTF Framework.pdf',            modified: '2026-01-14', owner: 'Kate Lovell' },
        { type: 'file', id: 'sp-cmp-2', name: 'Sanctions Screening Procedure.docx', modified: '2025-11-27', owner: 'Kate Lovell' },
        { type: 'file', id: 'sp-cmp-3', name: 'Annual Compliance Report 2025.pdf', modified: '2025-12-30', owner: 'Sarah Mitchell' },
      ],
    },
  ],
}

/* Flatten the tree for search. Returns every file with its full path. */
function flattenDmsFiles(node, path = []) {
  const here = path.concat(node.name)
  const files = []
  for (const item of node.items || []) {
    if (item.type === 'folder') {
      files.push(...flattenDmsFiles({ name: item.name, items: item.items }, here))
    } else {
      files.push({ ...item, path: here })
    }
  }
  return files
}

function dmsNodeAt(path) {
  let node = SHAREPOINT_ROOT
  for (let i = 1; i < path.length; i++) {
    const next = (node.items || []).find((it) => it.type === 'folder' && it.name === path[i])
    if (!next) return null
    node = next
  }
  return node
}

/* Token-match every unfulfilled suggestion across all folders against the
   mocked DMS tree. Returns a map of placeholderId → best DMS file match.
   Each DMS file is used at most once — if two suggestions match the same
   file, the higher-scoring one wins. */
function aiMatchSuggestions(folders, uploads, dismissals) {
  const allDmsFiles = flattenDmsFiles(SHAREPOINT_ROOT)
  const scored = []
  folders.forEach((folder) => {
    const ff = folderFulfillment(folder, uploads, dismissals)
    ff.suggested.forEach((s) => {
      if (ff.effective.has(s.id)) return
      const tokens = s.label.toLowerCase().split(/\s+/).filter((t) => t.length > 2)
      for (const f of allDmsFiles) {
        const hay = f.name.toLowerCase()
        let score = 0
        for (const t of tokens) if (hay.includes(t)) score += 1
        if (score > 0) scored.push({ placeholderId: s.id, folder: folder.name, file: f, score })
      }
    })
  })
  scored.sort((a, b) => b.score - a.score)
  const usedFileIds = new Set()
  const usedPlaceholders = new Set()
  const matches = []
  for (const row of scored) {
    if (usedFileIds.has(row.file.id) || usedPlaceholders.has(row.placeholderId)) continue
    usedFileIds.add(row.file.id)
    usedPlaceholders.add(row.placeholderId)
    matches.push(row)
  }
  return matches
}

/* Pick a deterministic sample PDF to back each DMS file for preview. */
const DMS_SAMPLE_PDFS = [
  'aml-ctf-policy.pdf',
  'board-governance-policy.pdf',
  'conflict-of-interest-playbook.pdf',
  'corporations-act-key-provisions.pdf',
  'data-breach-playbook.pdf',
  'erm-guide.pdf',
  'modern-slavery-guide.pdf',
  'nda-template.pdf',
  'whistleblower-policy.pdf',
]
function dmsSamplePdf(id) {
  let hash = 0
  for (const c of id) hash = (hash * 31 + c.charCodeAt(0)) >>> 0
  return `/sample-documents/${DMS_SAMPLE_PDFS[hash % DMS_SAMPLE_PDFS.length]}`
}

function accessForFile(fileAccess, fileKey) {
  return fileAccess[fileKey] ?? { mode: 'all', roles: [] }
}

function accessSummary(access) {
  if (access.mode === 'all') return 'Everyone'
  if (access.roles.length === 0) return 'No access'
  if (access.roles.length === 1) return access.roles[0]
  return `${access.roles.length} roles`
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]))
}

function relativeTime(date) {
  if (!date) return ''
  const d = date instanceof Date ? date.getTime() : new Date(date).getTime()
  if (isNaN(d)) return ''
  const diff = Date.now() - d
  if (diff < 30_000) return 'just now'
  if (diff < 60_000) return `${Math.max(1, Math.floor(diff / 1_000))}s ago`
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  return `${Math.floor(diff / 86_400_000)}d ago`
}

function parseModified(str) {
  const d = new Date(str)
  return isNaN(d) ? new Date() : d
}

function sizeFromId(id) {
  return 12_000 + (id * 37_000) % 480_000
}

/* Returns per-folder suggestion state:
   - uploaded: user-uploaded fulfilments
   - seeded:   seed files that fulfil a placeholder
   - dismissed: user dismissed (not applicable / already uploaded manually)
   - effective: union of all three — counts toward "done" */
function folderFulfillment(folder, uploads, dismissals) {
  const suggested = folder.suggested || []
  const suggestedIds = new Set(suggested.map((s) => s.id))
  const seedFiles = FILES.filter((f) => f.folder === folder.name)
  const seeded = new Set(
    seedFiles.map((f) => f.fulfills).filter((id) => id && suggestedIds.has(id)),
  )
  const uploaded = new Set(Object.keys(uploads).filter((id) => suggestedIds.has(id)))
  const dismissed = new Set([...dismissals].filter((id) => suggestedIds.has(id)))
  const effective = new Set([...seeded, ...uploaded, ...dismissed])
  return { suggested, seeded, uploaded, dismissed, effective }
}

function vaultStats(folders, uploads, dismissals) {
  let total = 0, done = 0
  folders.forEach((folder) => {
    const { suggested, effective } = folderFulfillment(folder, uploads, dismissals)
    total += suggested.length
    done += effective.size
  })
  return { total, done }
}

/* Round-robin across folders — one item from the largest-gap folder, then
   one from the next, etc. Surfaces variety rather than burying everything
   behind the most incomplete folder. */
function topUnfulfilled(folders, uploads, dismissals, limit) {
  const queues = folders
    .map((folder) => {
      const { suggested, effective } = folderFulfillment(folder, uploads, dismissals)
      return { folder, missing: suggested.filter((s) => !effective.has(s.id)) }
    })
    .filter((q) => q.missing.length > 0)
    .sort((a, b) => {
      if (b.missing.length !== a.missing.length) return b.missing.length - a.missing.length
      return a.folder.name.localeCompare(b.folder.name)
    })
    .map((q) => ({ ...q, missing: [...q.missing] }))

  const rows = []
  while (rows.length < limit && queues.some((q) => q.missing.length > 0)) {
    for (const q of queues) {
      if (q.missing.length === 0) continue
      const s = q.missing.shift()
      rows.push({ id: s.id, label: s.label, folderName: q.folder.name })
      if (rows.length >= limit) break
    }
  }
  return rows
}

function countTotalUnfulfilled(folders, uploads, dismissals) {
  return folders.reduce((acc, f) => {
    const { suggested, effective } = folderFulfillment(f, uploads, dismissals)
    return acc + (suggested.length - effective.size)
  }, 0)
}

/* Build the FileManager tree from tenant seed data + runtime uploads. */
function buildFileSystem(folders, baseFiles, uploads, dmsDirectAdditions = {}, resourceSaves = {}) {
  return folders.map((folder) => {
    const { suggested, effective } = folderFulfillment(folder, uploads, new Set())

    const realSeedFiles = baseFiles
      .filter((f) => f.folder === folder.name)
      .map((f) => ({
        name: f.name,
        isDirectory: false,
        size: sizeFromId(f.id),
        dateModified: parseModified(f.modified),
        uploader: UPLOADER_NAMES[f.uploader] ?? f.uploader,
        viewerId: `vault-${f.id}`,
        fileKey: `vault-${f.id}`,
      }))

    const uploadedFiles = Object.entries(uploads)
      .filter(([id]) => suggested.some((s) => s.id === id))
      .map(([id, info]) => ({
        name: info.name,
        isDirectory: false,
        size: info.size ?? 0,
        dateModified: info.modifiedAt,
        uploader: info.source === 'sharepoint' ? 'SharePoint' : CURRENT_USER_NAME,
        blobUrl: info.url,
        viewerId: info.source === 'sharepoint' ? undefined : undefined,
        dmsUrl: info.source === 'sharepoint' ? dmsSamplePdf(info.dmsId ?? id) : undefined,
        source: info.source,
        lastSyncedAt: info.lastSyncedAt,
        fileKey: id,
      }))

    const dmsFolderAdditions = (dmsDirectAdditions[folder.name] || []).map((f) => ({
      name: f.name,
      isDirectory: false,
      size: 0,
      dateModified: new Date(f.modified || Date.now()),
      uploader: 'SharePoint',
      dmsUrl: dmsSamplePdf(f.id),
      source: 'sharepoint',
      lastSyncedAt: f.lastSyncedAt,
      fileKey: `dms-${f.id}`,
    }))

    const resourceItems = Object.entries(resourceSaves)
      .filter(([, save]) => save.folderName === folder.name)
      .map(([resourceId, save]) => {
        const ext = (save.fileType || 'pdf').toLowerCase()
        const displayName = save.title?.toLowerCase().endsWith(`.${ext}`)
          ? save.title
          : `${save.title}.${ext}`
        return {
          name: displayName,
          isDirectory: false,
          size: 0,
          dateModified: new Date(save.savedAt),
          uploader: 'Resource Library',
          viewerId: resourceId,
          source: 'resource-library',
          fileKey: `resource-${resourceId}`,
        }
      })

    const completion = suggested.length ? effective.size / suggested.length : null
    const items = [...realSeedFiles, ...uploadedFiles, ...dmsFolderAdditions, ...resourceItems]

    return {
      name: folder.name,
      isDirectory: true,
      completion,
      fileCount: items.length,
      items,
    }
  })
}

function completionTone(pct) {
  if (pct >= 80) return 'bg-emerald-500'
  if (pct >= 60) return 'bg-brand-500'
  if (pct >= 40) return 'bg-amber-500'
  return 'bg-rose-500'
}

/* DX FileManager's Details column strips all non-whitelisted props
   (see __internal/.../item_list.details.js — only alignment/caption/
   dataField/dataType/hidingPriority/sortIndex/sortOrder/visible/
   visibleIndex/width survive). So cellRender is ignored. We inject the
   progress bar markup into cells via MutationObserver, matching columns
   by aria-colindex which is consistent across header and row cells. */
function renderCompletionCells(root) {
  if (!root) return
  const headers = root.querySelectorAll('.dx-datagrid-headers [role="columnheader"]')
  let targetColIndex = null
  headers.forEach((h) => {
    if (/^completion$/i.test(h.textContent.trim())) {
      targetColIndex = h.getAttribute('aria-colindex')
    }
  })
  if (!targetColIndex) return

  const cells = root.querySelectorAll(
    `.dx-datagrid-rowsview .dx-data-row [aria-colindex="${targetColIndex}"]`,
  )
  cells.forEach((cell) => {
    if (cell.querySelector('[data-ethos-bar="1"]')) return
    const row = cell.closest('.dx-data-row')
    const isParentFolderRow = row?.classList.contains('dx-filemanager-parent-directory-item')
    const raw = cell.textContent.trim()
    if (isParentFolderRow || !raw) {
      cell.innerHTML = '<span data-ethos-bar="1" class="text-xs text-muted-foreground/40">—</span>'
      return
    }
    const num = parseFloat(raw)
    if (isNaN(num)) return
    const pct = num <= 1 ? Math.round(num * 100) : Math.round(num)
    const tone = completionTone(pct)
    cell.innerHTML = `
      <div data-ethos-bar="1" class="flex items-center gap-2">
        <div class="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
          <div class="h-full rounded-full ${tone}" style="width:${pct}%"></div>
        </div>
        <span class="text-xs text-muted-foreground tabular-nums">${pct}%</span>
      </div>
    `
  })
}

/* Inject styled access pills into the Access column cells. Each cell's
   contents become a clickable button tagged with data-access-file-key;
   a global click listener reads that and opens the modal. State changes
   to `fileAccess` tear down the observer and re-inject, so the summary
   stays in sync. Parent-folder (..) rows are shown as an em dash. */
function renderAccessCells(root, ctx) {
  if (!root) return
  const { currentFolder, fileAccess } = ctx
  if (!currentFolder) return

  const headers = root.querySelectorAll('.dx-datagrid-headers [role="columnheader"]')
  let colIdx = null
  headers.forEach((h) => {
    if (/^access$/i.test(h.textContent.trim())) colIdx = h.getAttribute('aria-colindex')
  })
  if (!colIdx) return

  const itemsByName = new Map(currentFolder.items.map((i) => [i.name, i]))

  const cells = root.querySelectorAll(
    `.dx-datagrid-rowsview .dx-data-row [aria-colindex="${colIdx}"]`,
  )
  cells.forEach((cell) => {
    const row = cell.closest('.dx-data-row')
    if (row?.classList.contains('dx-filemanager-parent-directory-item')) {
      if (cell.dataset.ethosAccessState !== 'parent') {
        cell.dataset.ethosAccessState = 'parent'
        cell.innerHTML = '<span class="text-xs text-muted-foreground/40">—</span>'
      }
      return
    }
    const fileName = row?.querySelector('.dx-filemanager-details-item-name')?.textContent.trim()
    const item = fileName ? itemsByName.get(fileName) : null
    if (!item?.fileKey) return
    const access = accessForFile(fileAccess, item.fileKey)
    const state = JSON.stringify({ k: item.fileKey, a: access })
    if (cell.dataset.ethosAccessState === state) return
    cell.dataset.ethosAccessState = state
    const isRestricted = access.mode === 'roles'
    const summary = accessSummary(access)
    const icon = isRestricted
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11V7a5 5 0 0 1 10 0v4"/><rect x="5" y="11" width="14" height="10" rx="2"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
    const toneCls = isRestricted
      ? 'text-brand-900 border-brand-300 bg-brand-50/50'
      : 'text-muted-foreground border-transparent'
    cell.innerHTML = `
      <button type="button"
        data-access-file-key="${escapeHtml(item.fileKey)}"
        data-access-file-name="${escapeHtml(item.name)}"
        class="inline-flex items-center gap-1.5 text-xs rounded border ${toneCls} hover:border-brand-300 hover:bg-brand-100/60 hover:text-brand-900 px-1.5 py-0.5 transition-colors"
      >${icon}<span>${escapeHtml(summary)}</span></button>
    `
  })
}

/* Decorate the Source cell for DMS-sourced files: keeps the "SharePoint"
   label but adds a small "synced X ago" pill beneath it. Non-DMS rows are
   left alone (plain text is fine). */
function renderSourceCells(root, ctx) {
  if (!root) return
  const { currentFolder } = ctx
  if (!currentFolder) return

  const headers = root.querySelectorAll('.dx-datagrid-headers [role="columnheader"]')
  let colIdx = null
  headers.forEach((h) => {
    if (/^source$/i.test(h.textContent.trim())) colIdx = h.getAttribute('aria-colindex')
  })
  if (!colIdx) return

  const itemsByName = new Map(currentFolder.items.map((i) => [i.name, i]))
  const cells = root.querySelectorAll(
    `.dx-datagrid-rowsview .dx-data-row [aria-colindex="${colIdx}"]`,
  )
  cells.forEach((cell) => {
    const row = cell.closest('.dx-data-row')
    if (row?.classList.contains('dx-filemanager-parent-directory-item')) return
    const fileName = row?.querySelector('.dx-filemanager-details-item-name')?.textContent.trim()
    const item = fileName ? itemsByName.get(fileName) : null
    if (!item || item.source !== 'sharepoint') {
      // Non-DMS: make sure we haven't previously decorated this cell
      if (cell.dataset.ethosSourceState) {
        cell.dataset.ethosSourceState = ''
        cell.innerHTML = escapeHtml(String(item?.uploader ?? ''))
      }
      return
    }
    const synced = relativeTime(item.lastSyncedAt)
    const state = `sp:${synced}`
    if (cell.dataset.ethosSourceState === state) return
    cell.dataset.ethosSourceState = state
    cell.innerHTML = `
      <div class="flex flex-col gap-0.5 leading-tight">
        <span class="text-sm text-foreground">SharePoint</span>
        <span class="inline-flex items-center gap-1 text-[10px] font-medium text-brand-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9"/><path d="M21 3v6h-6"/></svg>
          Synced ${escapeHtml(synced)}
        </span>
      </div>
    `
  })
}

function AccessModal({ open, fileName, initial, onClose, onSave }) {
  const [mode, setMode] = useState('all')
  const [roles, setRoles] = useState([])

  useEffect(() => {
    if (open && initial) {
      setMode(initial.mode)
      setRoles(initial.roles)
    }
  }, [open, initial])

  if (!open) return null
  const canSave = mode === 'all' || roles.length > 0

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-lg border bg-background shadow-lg p-5 space-y-4">
        <div>
          <p className="text-base font-semibold text-foreground">Manage access</p>
          <p className="text-sm text-muted-foreground mt-0.5 truncate">{fileName}</p>
        </div>

        <div className="space-y-2">
          <label className="flex items-start gap-2.5 rounded-md border border-border p-3 cursor-pointer hover:bg-muted/50 transition-colors aria-checked:border-brand-300 aria-checked:bg-brand-50/50" aria-checked={mode === 'all'}>
            <input type="radio" name="access-mode" className="mt-0.5 accent-brand-800" checked={mode === 'all'} onChange={() => setMode('all')} />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <Users className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Everyone</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Any user with access to the vault can view this file.</p>
            </div>
          </label>
          <label className="flex items-start gap-2.5 rounded-md border border-border p-3 cursor-pointer hover:bg-muted/50 transition-colors aria-checked:border-brand-300 aria-checked:bg-brand-50/50" aria-checked={mode === 'roles'}>
            <input type="radio" name="access-mode" className="mt-0.5 accent-brand-800" checked={mode === 'roles'} onChange={() => setMode('roles')} />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <Lock className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Specific roles only</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Restrict viewing to the selected roles.</p>
            </div>
          </label>
        </div>

        {mode === 'roles' && (
          <div className="pl-3 space-y-2">
            {ROLES.map((role) => (
              <label key={role} className="flex items-center gap-2 cursor-pointer py-0.5">
                <Checkbox
                  checked={roles.includes(role)}
                  onCheckedChange={(checked) => {
                    setRoles((prev) => (checked ? [...prev, role] : prev.filter((r) => r !== role)))
                  }}
                />
                <span className="text-sm text-foreground">{role}</span>
              </label>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            disabled={!canSave}
            onClick={() => onSave({ mode, roles: mode === 'roles' ? roles : [] })}
          >Save</Button>
        </div>
      </div>
    </div>
  )
}

function SuggestionRow({ item, showFolder, dmsConnected, onUpload, onDmsPick, onDismiss }) {
  const uploadButton = dmsConnected ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2 gap-1 text-xs border-brand-300 text-brand-900 hover:bg-brand-100/60 hover:text-brand-900"
        >
          <Upload className="size-3.5" /> Upload
          <ChevronDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 z-[2001]">
        <DropdownMenuItem onClick={() => onUpload(item.id)}>
          <Upload className="size-3.5 mr-2" /> From computer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDmsPick(item)}>
          <Plug2 className="size-3.5 mr-2" /> From SharePoint
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button
      size="sm"
      variant="outline"
      className="h-7 px-2 gap-1 text-xs border-brand-300 text-brand-900 hover:bg-brand-100/60 hover:text-brand-900"
      onClick={() => onUpload(item.id)}
    >
      <Upload className="size-3.5" /> Upload
    </Button>
  )
  return (
    <li className="flex items-center justify-between gap-2 rounded-md border border-dashed border-brand-200 bg-brand-50/30 px-3 py-2">
      <div className="flex items-center gap-2 min-w-0">
        <FileText className="size-4 text-brand-700 shrink-0" />
        {showFolder && (
          <Badge variant="secondary" className="bg-muted text-muted-foreground text-[10px] font-medium px-1.5 h-5 shrink-0 border-0">
            {item.folderName}
          </Badge>
        )}
        <span className="text-sm text-foreground italic truncate">{item.label}</span>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        {uploadButton}
        <Button
          size="icon"
          variant="ghost"
          className="size-7 text-muted-foreground hover:text-foreground"
          title="Dismiss — I've uploaded this or it's not applicable"
          onClick={() => onDismiss(item.id, item.label)}
        >
          <X className="size-3.5" />
        </Button>
      </div>
    </li>
  )
}

function SuggestionsPanel({ folder, uploads, dismissals, onUpload, onDismiss, dmsConnected, onDmsPick, onAiAutoMatch }) {
  const aiButton = dmsConnected ? (
    <Button
      size="sm"
      variant="outline"
      className="h-7 px-2.5 gap-1.5 text-xs border-brand-300 text-brand-900 hover:bg-brand-100/60 hover:text-brand-900"
      onClick={onAiAutoMatch}
    >
      <Sparkles className="size-3.5" /> Search SharePoint with AI
    </Button>
  ) : null
  if (folder) {
    const { suggested, effective } = folderFulfillment(folder, uploads, dismissals)
    if (suggested.length === 0) return null
    const unfulfilled = suggested.filter((s) => !effective.has(s.id))
    if (unfulfilled.length === 0) {
      return (
        <div className="flex items-center gap-2 text-sm text-emerald-900">
          <CheckCircle2 className="size-4 text-emerald-600" />
          All required documents for <span className="font-medium">{folder.name}</span> are uploaded.
        </div>
      )
    }
    const shown = unfulfilled.slice(0, SUGGESTION_LIMIT)
    return (
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Suggested Uploads</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {effective.size} of {suggested.length} done in {folder.name} · showing {shown.length} of {unfulfilled.length} outstanding
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {aiButton}
            <Badge variant="secondary" className="border border-amber-300 bg-amber-50 text-amber-900 text-[11px] font-medium px-1.5 h-5">
              {unfulfilled.length} missing
            </Badge>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-2">
          {shown.map((s) => (
            <SuggestionRow
              key={s.id}
              item={{ id: s.id, label: s.label, folderName: folder.name }}
              showFolder={false}
              dmsConnected={dmsConnected}
              onUpload={onUpload}
              onDmsPick={onDmsPick}
              onDismiss={onDismiss}
            />
          ))}
        </ul>
      </div>
    )
  }

  // Root mode — cross-folder
  const totalUnfulfilled = countTotalUnfulfilled(FOLDERS, uploads, dismissals)
  if (totalUnfulfilled === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-900">
        <CheckCircle2 className="size-4 text-emerald-600" />
        All required documents across your vault are uploaded.
      </div>
    )
  }
  const top = topUnfulfilled(FOLDERS, uploads, dismissals, SUGGESTION_LIMIT)
  const { total, done } = vaultStats(FOLDERS, uploads, dismissals)
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Suggested Uploads</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {done} of {total} done across your vault · showing {top.length} of {totalUnfulfilled} outstanding
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {aiButton}
          <Badge variant="secondary" className="border border-amber-300 bg-amber-50 text-amber-900 text-[11px] font-medium px-1.5 h-5">
            {totalUnfulfilled} missing
          </Badge>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {top.map((item) => (
          <SuggestionRow
            key={`${item.folderName}::${item.id}`}
            item={item}
            showFolder
            dmsConnected={dmsConnected}
            onUpload={onUpload}
            onDmsPick={onDmsPick}
            onDismiss={onDismiss}
          />
        ))}
      </ul>
    </div>
  )
}

function VaultStatusCard({
  vaultDone, vaultTotal,
  folder, uploads, dismissals,
  onUpload, onDismiss,
  expanded, onToggle,
  dmsConnected, onDmsPick, onAiAutoMatch,
}) {
  const totalUnfulfilled = folder
    ? (() => {
        const { suggested, effective } = folderFulfillment(folder, uploads, dismissals)
        return suggested.length - effective.size
      })()
    : countTotalUnfulfilled(FOLDERS, uploads, dismissals)

  return (
    <div className="rounded-lg border border-brand-200 bg-brand-50/50">
      {/* Thin strip — always visible */}
      <div className="px-4 py-2.5 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="rounded-md bg-brand-800 p-1 text-white">
            <ShieldCheck className="size-3.5" />
          </div>
          <span className="text-sm font-semibold text-foreground">Vault Status</span>
          <Badge variant="secondary" className="border border-brand-300 bg-brand-100 text-brand-900 text-[11px] font-medium px-1.5 h-5">
            Effective
          </Badge>
        </div>
        <div className="flex-1 flex items-center gap-1.5" aria-label="Vault maturity progress">
          {STAGES.map((stage, i) => (
            <div
              key={i}
              title={stage.label}
              className={cn(
                'flex-1 h-1.5 rounded-full',
                stage.current  ? 'bg-brand-800'
                : stage.filled ? 'bg-brand-500'
                : 'bg-brand-200',
              )}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground tabular-nums shrink-0">
          {vaultDone} of {vaultTotal} required documents uploaded
        </span>
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center gap-1 text-xs font-medium text-brand-800 hover:text-brand-900 rounded px-1.5 py-0.5 hover:bg-brand-100/60 transition-colors shrink-0"
        >
          {expanded ? 'Hide' : 'View'} suggestions
          {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-brand-200 bg-background rounded-b-lg px-4 py-3">
          {totalUnfulfilled === 0 && !folder ? (
            <SuggestionsPanel folder={null} uploads={uploads} dismissals={dismissals} onUpload={onUpload} onDismiss={onDismiss} dmsConnected={dmsConnected} onDmsPick={onDmsPick} onAiAutoMatch={onAiAutoMatch} />
          ) : (
            <SuggestionsPanel folder={folder} uploads={uploads} dismissals={dismissals} onUpload={onUpload} onDismiss={onDismiss} dmsConnected={dmsConnected} onDmsPick={onDmsPick} onAiAutoMatch={onAiAutoMatch} />
          )}
        </div>
      )}
    </div>
  )
}

function UndoToast({ item, onUndo }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-md bg-foreground text-background shadow-lg px-4 py-2.5 animate-in slide-in-from-bottom-4 duration-200">
      <div className="text-sm">
        Dismissed <span className="font-medium">&ldquo;{item.label}&rdquo;</span>
      </div>
      <button
        onClick={onUndo}
        className="inline-flex items-center gap-1 text-sm font-medium text-background/90 hover:text-background underline underline-offset-2"
      >
        <RotateCcw className="size-3.5" /> Undo
      </button>
    </div>
  )
}

function AiAutoMatchModal({ open, steps, currentStep, matchCount, onClose }) {
  if (!open) return null
  const done = currentStep >= steps.length
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-foreground/40" onClick={done ? onClose : undefined} />
      <div className="relative w-full max-w-md rounded-lg border bg-background shadow-lg p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            'rounded-md p-2 text-white shrink-0',
            done ? 'bg-emerald-600' : 'bg-brand-800',
          )}>
            {done ? <CheckCircle2 className="size-4" /> : <Sparkles className="size-4" />}
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-foreground">
              {done ? 'AI finished' : 'Searching SharePoint with AI'}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {done
                ? matchCount > 0
                  ? `Added ${matchCount} matched ${matchCount === 1 ? 'document' : 'documents'} from SharePoint.`
                  : 'No matching documents found in your SharePoint.'
                : 'We\'re reviewing your SharePoint for required documents.'}
            </p>
          </div>
        </div>

        <ul className="space-y-2 pl-1">
          {steps.map((label, i) => {
            const isDone = i < currentStep
            const isActive = i === currentStep && !done
            return (
              <li key={i} className="flex items-center gap-2.5 text-sm">
                <div className={cn(
                  'size-4 shrink-0 flex items-center justify-center rounded-full',
                  isDone ? 'bg-emerald-600 text-white'
                  : isActive ? 'text-brand-800'
                  : 'text-muted-foreground/50',
                )}>
                  {isDone
                    ? <Check className="size-3" />
                    : isActive
                      ? <div className="size-3 rounded-full border-2 border-brand-800/30 border-t-brand-800 animate-spin" />
                      : <div className="size-1.5 rounded-full bg-current" />}
                </div>
                <span className={cn(
                  isDone ? 'text-foreground'
                  : isActive ? 'text-foreground font-medium'
                  : 'text-muted-foreground',
                )}>{label}</span>
              </li>
            )
          })}
        </ul>

        {done && (
          <div className="flex items-center justify-end pt-2 border-t border-border">
            <Button size="sm" onClick={onClose}>Done</Button>
          </div>
        )}
      </div>
    </div>
  )
}

function DmsConnectBanner({ connection, onConnect, onDisconnect }) {
  if (connection) {
    const brand = PROVIDER_BRAND[connection.provider]
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-2.5 flex items-center gap-3">
        <div
          className="rounded-md size-7 flex items-center justify-center text-white shrink-0"
          style={{ backgroundColor: brand?.color ?? '#059669' }}
        >
          <ProviderBrandIcon providerId={connection.provider} className="size-4" />
        </div>
        <p className="text-sm text-emerald-900 flex-1">
          Connected to <span className="font-medium">{connection.providerName ?? 'SharePoint'}</span>. You can now add files directly from your document management system.
        </p>
        <button
          onClick={onDisconnect}
          className="text-xs text-emerald-800 hover:text-emerald-900 font-medium rounded px-2 py-1 hover:bg-emerald-100/80"
        >
          Disconnect
        </button>
      </div>
    )
  }
  return (
    <div className="rounded-lg border border-brand-200 bg-background px-4 py-2.5 flex items-center gap-3">
      <div className="rounded-md bg-brand-800 p-1 text-white shrink-0">
        <Plug className="size-3.5" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">Connect your document management system</p>
        <p className="text-xs text-muted-foreground mt-0.5">Pull files directly from SharePoint, OneDrive, Drive, Box, or Dropbox.</p>
      </div>
      <Button size="sm" variant="outline" className="border-brand-300 text-brand-900 hover:bg-brand-100/60 hover:text-brand-900" onClick={onConnect}>
        Connect
      </Button>
    </div>
  )
}

function fileTypeLabel(name) {
  const i = name.lastIndexOf('.')
  return i === -1 ? 'FILE' : name.slice(i + 1).toUpperCase()
}

function SharePointPickerModal({ open, initialSearch, onClose, onAdd }) {
  const [path, setPath] = useState([SHAREPOINT_ROOT.name])
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState(new Set())

  useEffect(() => {
    if (open) {
      setPath([SHAREPOINT_ROOT.name])
      setSearch(initialSearch ?? '')
      setSelectedIds(new Set())
    }
  }, [open, initialSearch])

  if (!open) return null

  const isSearching = search.trim().length > 0
  const currentNode = dmsNodeAt(path)
  const currentFolders = !isSearching
    ? (currentNode?.items || []).filter((it) => it.type === 'folder')
    : []
  const searchTokens = search.toLowerCase().split(/\s+/).filter(Boolean)
  const visibleFiles = isSearching
    ? flattenDmsFiles(SHAREPOINT_ROOT).filter((f) => {
        const haystack = (f.name + ' ' + f.path.join(' ')).toLowerCase()
        return searchTokens.some((t) => haystack.includes(t))
      })
    : (currentNode?.items || [])
        .filter((it) => it.type === 'file')
        .map((f) => ({ ...f, path }))

  function toggleFile(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function enterFolder(name) {
    setPath((prev) => [...prev, name])
  }

  function goUp() {
    setPath((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }

  function crumbTo(idx) {
    setPath((prev) => prev.slice(0, idx + 1))
  }

  const selectedFiles = flattenDmsFiles(SHAREPOINT_ROOT).filter((f) => selectedIds.has(f.id))

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
      <div className="relative w-full max-w-3xl h-[600px] rounded-lg border bg-background shadow-lg flex flex-col">
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-base font-semibold text-foreground">Add from SharePoint</p>
              <p className="text-sm text-muted-foreground mt-0.5">Browse or search for files to add to your vault.</p>
            </div>
            <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
              <X className="size-4" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-muted/30 px-2.5 h-9 focus-within:border-brand-300 focus-within:bg-background transition-colors">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your SharePoint..."
              className="flex-1 text-sm outline-none bg-transparent placeholder:text-muted-foreground"
            />
            {isSearching && (
              <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground">
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Breadcrumb (only in browse mode) */}
        {!isSearching && (
          <div className="px-5 py-2 border-b border-border flex items-center gap-1 text-sm">
            {path.length > 1 && (
              <button onClick={goUp} className="p-1 rounded hover:bg-muted text-muted-foreground mr-1">
                <ArrowLeft className="size-4" />
              </button>
            )}
            {path.map((seg, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                <button
                  onClick={() => crumbTo(i)}
                  className={cn(
                    'px-1.5 py-0.5 rounded hover:bg-muted',
                    i === path.length - 1 ? 'text-foreground font-medium' : 'text-muted-foreground',
                  )}
                >
                  {seg}
                </button>
                {i < path.length - 1 && <ChevronRight className="size-3 text-muted-foreground" />}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {isSearching && visibleFiles.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">No files match &ldquo;{search}&rdquo;.</div>
          )}

          {currentFolders.length > 0 && (
            <ul className="divide-y divide-border">
              {currentFolders.map((folder) => (
                <li key={folder.name}>
                  <button
                    onClick={() => enterFolder(folder.name)}
                    className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-muted/50 text-left"
                  >
                    <Folder className="size-4 text-brand-700 shrink-0" />
                    <span className="text-sm font-medium text-foreground flex-1">{folder.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(folder.items || []).length} item{(folder.items || []).length === 1 ? '' : 's'}
                    </span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {visibleFiles.length > 0 && (
            <ul className="divide-y divide-border">
              {visibleFiles.map((file) => {
                const checked = selectedIds.has(file.id)
                return (
                  <li key={file.id}>
                    <label className="flex items-center gap-3 px-5 py-2.5 hover:bg-muted/40 cursor-pointer">
                      <Checkbox checked={checked} onCheckedChange={() => toggleFile(file.id)} />
                      <FileText className="size-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{file.name}</p>
                        {isSearching && (
                          <p className="text-xs text-muted-foreground truncate">
                            {file.path.join(' / ')}
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground tracking-wide shrink-0 bg-muted rounded px-1.5 py-0.5">
                        {fileTypeLabel(file.name)}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0 w-24 text-right">
                        {file.modified}
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          )}

          {!isSearching && currentFolders.length === 0 && visibleFiles.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">This folder is empty.</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {selectedIds.size === 0 ? 'Select files to add' : `${selectedIds.size} selected`}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" disabled={selectedIds.size === 0} onClick={() => onAdd(selectedFiles)}>
              Add {selectedIds.size > 0 ? `${selectedIds.size} file${selectedIds.size === 1 ? '' : 's'}` : ''}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProviderPickerModal({ open, onClose, onConnect }) {
  const [connectingId, setConnectingId] = useState(null)
  useEffect(() => {
    if (!open) setConnectingId(null)
  }, [open])

  function pick(provider) {
    if (!provider.available || connectingId) return
    setConnectingId(provider.id)
    setTimeout(() => {
      onConnect(provider)
      setConnectingId(null)
    }, 1000)
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-foreground/40" onClick={connectingId ? undefined : onClose} />
      <div className="relative w-full max-w-md rounded-lg border bg-background shadow-lg p-5 space-y-4">
        <div>
          <p className="text-base font-semibold text-foreground">Connect document management system</p>
          <p className="text-sm text-muted-foreground mt-0.5">Pick a provider to link with your vault.</p>
        </div>

        <div className="space-y-2">
          {DMS_PROVIDERS.map((p) => {
            const isConnecting = connectingId === p.id
            const brand = PROVIDER_BRAND[p.id]
            return (
              <button
                key={p.id}
                type="button"
                disabled={!p.available || (connectingId && !isConnecting)}
                onClick={() => pick(p)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-md border border-border px-3 py-2.5 text-left transition-colors',
                  p.available
                    ? 'hover:bg-muted/50 hover:border-brand-300 cursor-pointer'
                    : 'opacity-60 cursor-not-allowed',
                )}
              >
                <div
                  className="rounded-md size-9 flex items-center justify-center shrink-0 text-white"
                  style={{ backgroundColor: brand?.color ?? '#64748B' }}
                >
                  <ProviderBrandIcon providerId={p.id} className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.vendor}</p>
                </div>
                {!p.available && (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground text-[10px] font-medium border-0">
                    Coming soon
                  </Badge>
                )}
                {isConnecting && (
                  <div className="text-xs text-brand-800 font-medium flex items-center gap-1.5">
                    <div className="size-3 rounded-full border-2 border-brand-800/30 border-t-brand-800 animate-spin" />
                    Connecting…
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose} disabled={!!connectingId}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}

export default function VaultPage() {
  const navigate = useNavigate()
  const fmRef = useRef(null)
  const [currentFolderName, setCurrentFolderName] = useState(null)
  const [uploads, setUploads] = useState({})
  const [dismissals, setDismissals] = useState(() => new Set())
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(false)
  const [dismissToast, setDismissToast] = useState(null)
  const [fileAccess, setFileAccess] = useState({})
  const [accessModalFor, setAccessModalFor] = useState(null)
  const [dmsConnection, setDmsConnection] = useState(null) // { provider: 'sharepoint', connectedAt } | null
  const [providerPickerOpen, setProviderPickerOpen] = useState(false)
  const [dmsPicker, setDmsPicker] = useState(null) // { context, initialSearch } | null — context = { kind: 'suggestion'|'folder', placeholderId?, folderName? }
  // DMS files added directly into a folder (not fulfilling a suggestion).
  // Shape: { [folderName]: [{ id, name, path, modified, owner }] }
  const [dmsDirectAdditions, setDmsDirectAdditions] = useState({})
  const [aiRun, setAiRun] = useState(null) // { currentStep, matchCount } | null
  const [syncToast, setSyncToast] = useState(null) // { name, at } | null
  // Resources saved to Vault from the Resource Library (shared via session storage).
  // We load on mount and re-read whenever the window regains focus so cross-page saves reflect.
  const [resourceSaves, setResourceSaves] = useState(() => readResourceSaves())

  const fileSystem = useMemo(
    () => buildFileSystem(FOLDERS, FILES, uploads, dmsDirectAdditions, resourceSaves),
    [uploads, dmsDirectAdditions, resourceSaves],
  )

  // Re-read resource saves when the window regains focus (handles saves made
  // on another page).
  useEffect(() => {
    const refresh = () => setResourceSaves(readResourceSaves())
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [])

  const currentFolder = useMemo(
    () => (currentFolderName ? FOLDERS.find((f) => f.name === currentFolderName) ?? null : null),
    [currentFolderName],
  )

  const currentFolderTree = useMemo(
    () => fileSystem.find((f) => f.name === currentFolderName) ?? null,
    [fileSystem, currentFolderName],
  )

  const stats = useMemo(
    () => vaultStats(FOLDERS, uploads, dismissals),
    [uploads, dismissals],
  )

  useEffect(() => {
    const root = fmRef.current
    if (!root) return
    let scheduled = false
    const schedule = () => {
      if (scheduled) return
      scheduled = true
      queueMicrotask(() => {
        scheduled = false
        renderCompletionCells(root)
        renderAccessCells(root, { currentFolder: currentFolderTree, fileAccess })
        renderSourceCells(root, { currentFolder: currentFolderTree })
      })
    }
    schedule()
    const observer = new MutationObserver(schedule)
    observer.observe(root, { childList: true, subtree: true, characterData: true })
    return () => observer.disconnect()
  }, [currentFolderTree, fileAccess])

  // Delegated click handler for the access pill injected into rows.
  useEffect(() => {
    const root = fmRef.current
    if (!root) return
    const onClick = (e) => {
      const btn = e.target.closest?.('[data-access-file-key]')
      if (!btn || !root.contains(btn)) return
      e.preventDefault()
      e.stopPropagation()
      setAccessModalFor({
        fileKey: btn.dataset.accessFileKey,
        fileName: btn.dataset.accessFileName,
      })
    }
    root.addEventListener('click', onClick, true)
    return () => root.removeEventListener('click', onClick, true)
  }, [])

  // Auto-dismiss the Undo toast after the undo window elapses.
  useEffect(() => {
    if (!dismissToast) return
    const tid = setTimeout(() => setDismissToast(null), UNDO_WINDOW_MS)
    return () => clearTimeout(tid)
  }, [dismissToast])

  // Sync toast auto-dismisses after 3s.
  useEffect(() => {
    if (!syncToast) return
    const tid = setTimeout(() => setSyncToast(null), 3000)
    return () => clearTimeout(tid)
  }, [syncToast])

  function handleDirectoryChanged(e) {
    const path = e?.directory?.path ?? e?.component?.getCurrentDirectory?.()?.path ?? ''
    setCurrentFolderName(path || null)
  }

  function handleSuggestedUpload(placeholderId) {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      const url = URL.createObjectURL(file)
      setUploads((prev) => ({
        ...prev,
        [placeholderId]: {
          name: file.name,
          size: file.size,
          modifiedAt: new Date(file.lastModified || Date.now()),
          url,
        },
      }))
    }
    input.click()
  }

  function openFileSystemItem(item) {
    if (!item) return
    const data = item.dataItem ?? item
    if (data?.viewerId) {
      navigate(`/view/${data.viewerId}`)
      return
    }
    const url = data?.blobUrl || data?.dmsUrl
    if (url) {
      const q = new URLSearchParams({
        url,
        title: data.name ?? item.name ?? 'Document',
        type: 'pdf',
      })
      navigate(`/view/uploaded?${q.toString()}`)
    }
  }

  function handleFileOpened(e) {
    openFileSystemItem(e.file)
  }

  function handleAiAutoMatch() {
    if (aiRun) return
    const steps = [
      'Connecting to SharePoint',
      'Scanning your documents',
      'Matching against required documents',
      'Uploading matched files',
    ]
    setAiRun({ currentStep: 0, matchCount: 0, steps })
    const matches = aiMatchSuggestions(FOLDERS, uploads, dismissals)
    // Advance through steps; apply matches when we reach the upload step
    let step = 0
    const tick = () => {
      step += 1
      if (step === 3) {
        // On the "Uploading matched files" step, actually apply
        setUploads((prev) => {
          const next = { ...prev }
          const now = new Date()
          for (const m of matches) {
            next[m.placeholderId] = {
              name: m.file.name,
              size: 0,
              modifiedAt: new Date(m.file.modified || now),
              source: 'sharepoint',
              dmsId: m.file.id,
              lastSyncedAt: now,
            }
          }
          return next
        })
      }
      setAiRun((prev) => prev && { ...prev, currentStep: step, matchCount: matches.length })
      if (step < steps.length) {
        setTimeout(tick, 700)
      }
    }
    setTimeout(tick, 700)
  }

  function handleDmsFilesAdded(files, context) {
    if (!files?.length) return
    const now = new Date()
    const stamped = files.map((f) => ({ ...f, lastSyncedAt: now }))
    if (context?.kind === 'suggestion' && context.placeholderId) {
      // Only first file fulfils the placeholder; extras become direct additions
      const [first, ...rest] = stamped
      setUploads((prev) => ({
        ...prev,
        [context.placeholderId]: {
          name: first.name,
          size: 0,
          modifiedAt: new Date(first.modified || now),
          source: 'sharepoint',
          dmsId: first.id,
          lastSyncedAt: now,
        },
      }))
      if (rest.length && context.folderName) {
        setDmsDirectAdditions((prev) => ({
          ...prev,
          [context.folderName]: [...(prev[context.folderName] || []), ...rest],
        }))
      }
      return
    }
    if (context?.kind === 'folder' && context.folderName) {
      setDmsDirectAdditions((prev) => ({
        ...prev,
        [context.folderName]: [...(prev[context.folderName] || []), ...stamped],
      }))
    }
  }

  function handleToolbarItemClick(e) {
    if (e.itemData?.options?.text === 'Open') {
      const selected = e.component?.getSelectedItems?.()?.[0]
      if (selected && !selected.isDirectory) openFileSystemItem(selected)
      return
    }
    if (e.itemData?.options?.text === 'Add from SharePoint') {
      if (currentFolderName) {
        setDmsPicker({ context: { kind: 'folder', folderName: currentFolderName }, initialSearch: '' })
      }
    }
  }

  function handleContextMenuItemClick(e) {
    if (e.itemData?.text === 'Open') {
      const item = e.fileSystemItem
      if (item && !item.isDirectory) openFileSystemItem(item)
      return
    }
    if (e.itemData?.text === 'Re-sync') {
      const data = e.fileSystemItem?.dataItem
      if (data?.source !== 'sharepoint') return
      resyncDmsFile(data)
    }
  }

  function handleContextMenuShowing(e) {
    const items = e.component?.option('contextMenu.items') ?? []
    // Re-sync is only meaningful for DMS-sourced files.
    const data = e.fileSystemItem?.dataItem
    const isDms = data?.source === 'sharepoint'
    // Filter via e.items (newer DX) if exposed
    if (Array.isArray(e.items)) {
      e.items = e.items.filter((it) => it.text !== 'Re-sync' || isDms)
    }
  }

  function resyncDmsFile(data) {
    const now = new Date()
    const fileKey = data.fileKey
    if (!fileKey) return
    if (fileKey.startsWith('dms-')) {
      // Direct DMS addition — update in dmsDirectAdditions
      setDmsDirectAdditions((prev) => {
        const next = { ...prev }
        for (const folderName of Object.keys(next)) {
          next[folderName] = next[folderName].map((f) =>
            `dms-${f.id}` === fileKey ? { ...f, lastSyncedAt: now } : f,
          )
        }
        return next
      })
    } else {
      // Suggestion fulfilment — update in uploads
      setUploads((prev) => {
        if (!prev[fileKey]) return prev
        return { ...prev, [fileKey]: { ...prev[fileKey], lastSyncedAt: now } }
      })
    }
    setSyncToast({ name: data.name, at: now })
  }

  function handleDismiss(placeholderId, label) {
    setDismissals((prev) => new Set(prev).add(placeholderId))
    // Fresh key ensures the toast effect re-runs even if the same id fires twice.
    setDismissToast({ id: placeholderId, label, key: Date.now() })
  }

  function handleUndoDismiss() {
    setDismissToast((current) => {
      if (!current) return null
      setDismissals((prev) => {
        const next = new Set(prev)
        next.delete(current.id)
        return next
      })
      return null
    })
  }

  const atRoot = !currentFolderName

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Vault</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{t.description}</p>
          </div>
          {dmsConnection ? (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => setDmsConnection(null)}
            >
              <Plug2 className="size-4" />
              Disconnect {dmsConnection.providerName ?? 'SharePoint'}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => setProviderPickerOpen(true)}
            >
              <Plug className="size-4" />
              Connect File Storage
            </Button>
          )}
        </div>

        {/* Vault Status — thin strip + expandable suggestions */}
        <VaultStatusCard
          vaultDone={stats.done}
          vaultTotal={stats.total}
          folder={currentFolder}
          uploads={uploads}
          dismissals={dismissals}
          onUpload={handleSuggestedUpload}
          onDismiss={handleDismiss}
          expanded={suggestionsExpanded}
          onToggle={() => setSuggestionsExpanded((v) => !v)}
          dmsConnected={!!dmsConnection}
          onAiAutoMatch={handleAiAutoMatch}
          onDmsPick={(suggestion) => {
            // Find the folder this suggestion belongs to
            const folderForSuggestion = FOLDERS.find((f) =>
              (f.suggested || []).some((s) => s.id === suggestion.id),
            )
            setDmsPicker({
              context: {
                kind: 'suggestion',
                placeholderId: suggestion.id,
                folderName: folderForSuggestion?.name,
              },
              initialSearch: suggestion.label,
            })
          }}
        />

        {/* File Manager */}
        <div ref={fmRef} className="ethos-filemanager">
          <FileManager
            fileSystemProvider={fileSystem}
            height={620}
            onCurrentDirectoryChanged={handleDirectoryChanged}
            onSelectedFileOpened={handleFileOpened}
            onToolbarItemClick={handleToolbarItemClick}
            onContextMenuItemClick={handleContextMenuItemClick}
            onContextMenuShowing={handleContextMenuShowing}
          >
            <Permissions create copy move delete rename upload download />
            <ItemView mode="details" showParentFolder>
              <Details>
                <Column dataField="thumbnail" width={56} />
                <Column dataField="name" caption="Name" />
                <Column dataField="fileCount" caption="Files" alignment="left" width={80} visible={atRoot} />
                <Column dataField="completion" caption="Completion" alignment="left" width={160} visible={atRoot} />
                <Column dataField="dateModified" caption="Last modified" visible={!atRoot} />
                <Column dataField="access" caption="Access" alignment="left" width={160} visible={!atRoot} />
                <Column dataField="uploader" caption="Source" visible={!atRoot} />
                <Column dataField="isDirectory" caption="Is Directory" visible={false} />
              </Details>
            </ItemView>
            <Toolbar>
              <Item name="showNavPane" visible />
              <Item name="create" />
              <Item name="upload" />
              <Item
                widget="dxButton"
                visible={!!dmsConnection && !atRoot}
                options={{ text: 'Add from SharePoint', icon: 'globe', stylingMode: 'text' }}
                locateInMenu="never"
              />
              <Item name="refresh" />
              <Item name="separator" />
              <Item name="switchView" />
              <FileSelectionItem
                widget="dxButton"
                options={{ text: 'Open', icon: 'find', stylingMode: 'text' }}
                locateInMenu="never"
              />
              <FileSelectionItem name="separator" />
              <FileSelectionItem name="rename" />
              <FileSelectionItem name="separator" />
              <FileSelectionItem name="delete" />
              <FileSelectionItem name="move" />
              <FileSelectionItem name="copy" />
              <FileSelectionItem name="download" />
              <FileSelectionItem name="separator" />
              <FileSelectionItem name="clearSelection" />
            </Toolbar>
            <ContextMenu>
              <ContextMenuItem text="Open" icon="find" />
              <ContextMenuItem text="Re-sync" icon="refresh" beginGroup />
              <ContextMenuItem name="rename" beginGroup />
              <ContextMenuItem name="delete" />
              <ContextMenuItem name="move" />
              <ContextMenuItem name="copy" />
              <ContextMenuItem name="download" />
              <ContextMenuItem name="refresh" />
            </ContextMenu>
          </FileManager>
        </div>

      </div>

      {dismissToast && <UndoToast item={dismissToast} onUndo={handleUndoDismiss} />}

      {syncToast && (
        <div className="fixed bottom-6 right-6 z-[2000] flex items-center gap-3 rounded-md bg-foreground text-background shadow-lg px-4 py-2.5 animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <div className="text-sm">
            Re-synced <span className="font-medium">&ldquo;{syncToast.name}&rdquo;</span> from SharePoint
          </div>
        </div>
      )}

      <AccessModal
        open={!!accessModalFor}
        fileName={accessModalFor?.fileName}
        initial={accessModalFor ? accessForFile(fileAccess, accessModalFor.fileKey) : null}
        onClose={() => setAccessModalFor(null)}
        onSave={(next) => {
          setFileAccess((prev) => ({ ...prev, [accessModalFor.fileKey]: next }))
          setAccessModalFor(null)
        }}
      />

      <ProviderPickerModal
        open={providerPickerOpen}
        onClose={() => setProviderPickerOpen(false)}
        onConnect={(provider) => {
          setDmsConnection({ provider: provider.id, providerName: provider.name, connectedAt: new Date() })
          setProviderPickerOpen(false)
        }}
      />

      <SharePointPickerModal
        open={!!dmsPicker}
        initialSearch={dmsPicker?.initialSearch ?? ''}
        onClose={() => setDmsPicker(null)}
        onAdd={(files) => {
          handleDmsFilesAdded(files, dmsPicker?.context)
          setDmsPicker(null)
        }}
      />

      <AiAutoMatchModal
        open={!!aiRun}
        steps={aiRun?.steps ?? []}
        currentStep={aiRun?.currentStep ?? 0}
        matchCount={aiRun?.matchCount ?? 0}
        onClose={() => setAiRun(null)}
      />
    </div>
  )
}
