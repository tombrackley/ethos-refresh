import { useMemo, useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Trash2, Plus, ChevronDown,
  ExternalLink, Loader2, Cloud,
} from 'lucide-react'
import { SiBox, SiDropbox, SiGoogledrive } from 'react-icons/si'
import { TbBrandOnedrive } from 'react-icons/tb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import tenant from '@/config/tenant'

const VAULT = tenant.pages.vault ?? {}
const TENANT_CATEGORIES = VAULT.categories ?? []
const FILES = VAULT.files ?? []

/* SharePoint brand glyph (consistent with VaultPage). */
function SharepointGlyph({ className }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M22.16 5a8.5 8.5 0 0 0-8.41 7.27 7 7 0 0 0-6.5 6.95 6.92 6.92 0 0 0 .54 2.7A6 6 0 0 0 13.5 28h.06a8.51 8.51 0 0 0 8.6-2.4 8.49 8.49 0 0 0 0-12 8.5 8.5 0 0 0 0-8.6Z" />
    </svg>
  )
}

const PROVIDERS = [
  { id: 'sharepoint', name: 'SharePoint',   color: '#036C70', Icon: SharepointGlyph },
  { id: 'onedrive',   name: 'OneDrive',     color: '#0364B8', Icon: TbBrandOnedrive },
  { id: 'gdrive',     name: 'Google Drive', color: '#1FA463', Icon: SiGoogledrive   },
  { id: 'box',        name: 'Box',          color: '#0061D5', Icon: SiBox           },
  { id: 'dropbox',    name: 'Dropbox',      color: '#0061FF', Icon: SiDropbox       },
]

/* Default integration state. SharePoint connected by default to match the
 * Connected pill in the Vault populated header. */
const INITIAL_INTEGRATIONS = [
  { id: 'sharepoint', status: 'connected',     lastSync: '4 minutes ago' },
  { id: 'onedrive',   status: 'not-connected' },
  { id: 'gdrive',     status: 'not-connected' },
  { id: 'box',        status: 'not-connected' },
  { id: 'dropbox',    status: 'not-connected' },
]

function slugify(name, taken) {
  const base = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'category'
  let candidate = base
  let n = 2
  while (taken.has(candidate)) { candidate = `${base}-${n}`; n++ }
  return candidate
}

/* ───────────── Categories ───────────── */

function InlineEditableText({ value, onChange, className, placeholder, autoFocus }) {
  const [editing, setEditing] = useState(autoFocus)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef(null)

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])
  useEffect(() => { setDraft(value) }, [value])

  function commit() {
    if (draft.trim() !== value) onChange(draft.trim())
    setEditing(false)
  }
  function cancel() {
    setDraft(value)
    setEditing(false)
  }

  if (editing) {
    return (
      <Input
        ref={inputRef}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') { e.preventDefault(); commit() }
          if (e.key === 'Escape') { e.preventDefault(); cancel() }
        }}
        placeholder={placeholder}
        className={cn('h-7 text-sm', className)}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={cn(
        'text-left rounded px-1 -mx-1 hover:bg-muted/40 transition-colors',
        !value && 'text-muted-foreground italic',
        className,
      )}
    >
      {value || placeholder}
    </button>
  )
}

function RadioDot({ checked, tone = 'brand' }) {
  return (
    <span
      className={cn(
        'size-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors',
        checked
          ? tone === 'destructive' ? 'border-destructive' : 'border-brand-700'
          : 'border-muted-foreground/40',
      )}
    >
      {checked && (
        <span className={cn('size-1.5 rounded-full', tone === 'destructive' ? 'bg-destructive' : 'bg-brand-700')} />
      )}
    </span>
  )
}

function CategoryRow({ category, fileCount, otherCategories, autoFocus, onUpdate, onRemove }) {
  const [confirming, setConfirming] = useState(false)
  // 'move' | 'remove' — applies only when fileCount > 0
  const [mode, setMode] = useState('move')
  const [reassignToId, setReassignToId] = useState(null)

  const hasFiles = fileCount > 0
  const canReassign = otherCategories.length > 0

  function startConfirm() {
    setMode(canReassign ? 'move' : 'remove')
    setReassignToId(canReassign ? otherCategories[0].id : null)
    setConfirming(true)
  }

  function commitRemove() {
    if (!hasFiles) {
      onRemove(undefined, undefined)
    } else if (mode === 'move') {
      onRemove('move', reassignToId)
    } else {
      onRemove('remove', null)
    }
    setConfirming(false)
  }

  function cancel() {
    setConfirming(false)
  }

  const reassignTarget = otherCategories.find(c => c.id === reassignToId)

  return (
    <div className="rounded-lg border border-border bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0 space-y-0.5">
          <InlineEditableText
            value={category.name}
            onChange={name => onUpdate({ ...category, name })}
            autoFocus={autoFocus}
            placeholder="Category name"
            className="text-sm font-medium text-foreground block w-full"
          />
          <InlineEditableText
            value={category.description ?? ''}
            onChange={description => onUpdate({ ...category, description })}
            placeholder="Add a description"
            className="text-xs text-muted-foreground block w-full"
          />
        </div>
        <Badge variant="outline" className="shrink-0 h-6 px-2 text-xs">
          {fileCount} {fileCount === 1 ? 'file' : 'files'}
        </Badge>
        {!confirming && (
          <button
            type="button"
            onClick={startConfirm}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
            aria-label="Remove category"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>

      {confirming && (
        <div className="mt-3 pt-3 border-t border-border/60 space-y-3">
          {hasFiles ? (
            <>
              <p className="text-sm text-foreground">
                <span className="font-medium">{fileCount}</span> {fileCount === 1 ? 'file is' : 'files are'} in this category. Choose what happens to {fileCount === 1 ? 'it' : 'them'}.
              </p>

              <div className="space-y-2">
                {/* Option 1 — Move */}
                {canReassign && (
                  <button
                    type="button"
                    onClick={() => setMode('move')}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-colors',
                      mode === 'move'
                        ? 'border-brand-700 bg-brand-50'
                        : 'border-border bg-white hover:bg-muted/30',
                    )}
                  >
                    <RadioDot checked={mode === 'move'} />
                    <span className="text-sm text-foreground flex-1 flex items-center gap-2 flex-wrap">
                      Move {fileCount === 1 ? 'it' : 'them'} to
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setMode('move') }}
                            className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-2 py-1 text-sm font-medium text-foreground hover:bg-muted/50"
                          >
                            {reassignTarget?.name ?? '—'}
                            <ChevronDown className="size-3 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          {otherCategories.map(c => (
                            <DropdownMenuItem
                              key={c.id}
                              onSelect={() => { setReassignToId(c.id); setMode('move') }}
                              className="text-sm"
                            >
                              {c.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </span>
                  </button>
                )}

                {/* Option 2 — Remove from vault */}
                <button
                  type="button"
                  onClick={() => setMode('remove')}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-colors',
                    mode === 'remove'
                      ? 'border-destructive/60 bg-destructive/5'
                      : 'border-border bg-white hover:bg-muted/30',
                  )}
                >
                  <RadioDot checked={mode === 'remove'} tone="destructive" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">Remove {fileCount === 1 ? 'it' : 'them all'} from the vault</p>
                    <p className="text-xs text-muted-foreground">
                      The {fileCount === 1 ? 'file' : `${fileCount} files`} will be deleted along with the category.
                    </p>
                  </div>
                </button>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={cancel}>Cancel</Button>
                <Button
                  size="sm"
                  variant={mode === 'remove' ? 'outline' : 'default'}
                  onClick={commitRemove}
                  className={mode === 'remove'
                    ? 'border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive'
                    : ''}
                >
                  Remove category
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-sm text-foreground">
                Remove <span className="font-medium">{category.name}</span>?
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={commitRemove}
                  className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  Confirm remove
                </Button>
                <Button size="sm" variant="ghost" onClick={cancel}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CategoriesSection({ categories, fileCounts, onUpdate, onRemove, onAdd }) {
  const [pendingFocus, setPendingFocus] = useState(null) // id of newly added row

  function handleAdd() {
    const taken = new Set(categories.map(c => c.id))
    const id = slugify('new-category', taken)
    onAdd({ id, name: 'New category', description: '' })
    setPendingFocus(id)
  }

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-base font-medium text-foreground">Foundational Categories</h2>
        <p className="text-sm text-muted-foreground mt-1">
          The categories Ethos uses to understand your organisation. Add, rename or remove them. When you remove a category that has documents, you&rsquo;ll be asked where to move them first.
        </p>
      </div>
      <div className="space-y-2">
        {categories.map((cat, idx) => (
          <CategoryRow
            key={cat.id}
            category={cat}
            fileCount={fileCounts[cat.id] ?? 0}
            otherCategories={categories.filter(c => c.id !== cat.id)}
            autoFocus={pendingFocus === cat.id}
            onUpdate={updated => onUpdate(idx, updated)}
            onRemove={(reassignToId) => onRemove(idx, reassignToId)}
          />
        ))}
      </div>
      <Button size="sm" variant="outline" onClick={handleAdd} className="gap-1.5">
        <Plus className="size-3.5" />
        Add category
      </Button>
    </section>
  )
}

/* ───────────── Integrations ───────────── */

function StatusPill({ status }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'h-6 gap-1.5 px-2 font-medium',
        status === 'connected'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-slate-200 bg-slate-50 text-slate-600',
      )}
    >
      <span className={cn('size-1.5 rounded-full', status === 'connected' ? 'bg-emerald-500' : 'bg-slate-300')} />
      {status === 'connected' ? 'Connected' : 'Not connected'}
    </Badge>
  )
}

function IntegrationRow({ provider, integration, onConnect, onDisconnect }) {
  const [connecting, setConnecting] = useState(false)
  const [confirmingDisconnect, setConfirmingDisconnect] = useState(false)
  const { Icon } = provider
  const isConnected = integration.status === 'connected'

  function handleConnect() {
    setConnecting(true)
    setTimeout(() => {
      setConnecting(false)
      onConnect()
    }, 1500)
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-white px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex size-9 items-center justify-center rounded-md bg-muted/40 shrink-0">
          <Icon className="size-5" style={{ color: provider.color }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{provider.name}</p>
          {isConnected && integration.lastSync ? (
            <p className="text-xs text-muted-foreground">Last sync {integration.lastSync}</p>
          ) : (
            <p className="text-xs text-muted-foreground">Not connected</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <StatusPill status={integration.status} />
        {isConnected ? (
          confirmingDisconnect ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground mr-1">Disconnect?</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => { onDisconnect(); setConfirmingDisconnect(false) }}
                className="h-7 px-2 text-xs border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                Yes
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirmingDisconnect(false)} className="h-7 px-2 text-xs">
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfirmingDisconnect(true)}
              className="min-w-[96px]"
            >
              Disconnect
            </Button>
          )
        ) : (
          <Button
            size="sm"
            onClick={handleConnect}
            disabled={connecting}
            className="min-w-[96px] gap-1.5"
          >
            {connecting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Connecting…
              </>
            ) : (
              <>
                <Cloud className="size-3.5" />
                Connect
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

function IntegrationsSection({ integrations, onConnect, onDisconnect }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-base font-medium text-foreground">Document System Integrations</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Connect Ethos to your existing document storage. Ethos reads your folders for analysis — it never modifies them.
        </p>
      </div>
      <div className="space-y-2">
        {PROVIDERS.map(p => {
          const integration = integrations.find(i => i.id === p.id) ?? { id: p.id, status: 'not-connected' }
          return (
            <IntegrationRow
              key={p.id}
              provider={p}
              integration={integration}
              onConnect={() => onConnect(p.id)}
              onDisconnect={() => onDisconnect(p.id)}
            />
          )
        })}
      </div>
    </section>
  )
}

/* ───────────── Page ───────────── */

export default function AdminVaultPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState(TENANT_CATEGORIES)
  const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS)
  // Local-only mutations made when the user removes a category that has
  // files in it. Either:
  //  - reassign the file to a new categoryId, or
  //  - remove the file from the vault entirely.
  const [fileReassignments, setFileReassignments] = useState({})
  const [removedFileIds, setRemovedFileIds] = useState(() => new Set())

  // File counts factor in any reassignments + removals the user has made.
  const fileCounts = useMemo(() => {
    const counts = {}
    FILES.forEach(f => {
      if (removedFileIds.has(f.id)) return
      const id = fileReassignments[f.id] ?? f.categoryId
      counts[id] = (counts[id] ?? 0) + 1
    })
    return counts
  }, [fileReassignments, removedFileIds])

  function updateCategory(idx, updated) {
    setCategories(prev => prev.map((c, i) => i === idx ? updated : c))
  }

  function removeCategory(idx, mode, reassignToId) {
    const removed = categories[idx]
    if (!removed) return
    // Compute the live category id for each file (factoring in prior reassignments).
    const fileCurrentCat = (f) => fileReassignments[f.id] ?? f.categoryId
    if (mode === 'move' && reassignToId) {
      setFileReassignments(prev => {
        const next = { ...prev }
        FILES.forEach(f => {
          if (removedFileIds.has(f.id)) return
          if (fileCurrentCat(f) === removed.id) next[f.id] = reassignToId
        })
        return next
      })
    } else if (mode === 'remove') {
      setRemovedFileIds(prev => {
        const next = new Set(prev)
        FILES.forEach(f => {
          if (next.has(f.id)) return
          if (fileCurrentCat(f) === removed.id) next.add(f.id)
        })
        return next
      })
    }
    setCategories(prev => prev.filter((_, i) => i !== idx))
  }

  function addCategory(cat) {
    setCategories(prev => [...prev, cat])
  }

  function connectIntegration(id) {
    setIntegrations(prev => prev.map(i =>
      i.id === id ? { ...i, status: 'connected', lastSync: 'Just now' } : i,
    ))
  }

  function disconnectIntegration(id) {
    setIntegrations(prev => prev.map(i =>
      i.id === id ? { id: i.id, status: 'not-connected' } : i,
    ))
  }

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="mx-auto max-w-[1080px] px-8 py-8 space-y-8">
        <header className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Vault</h1>
            <p className="mt-2 text-sm text-foreground/80 max-w-[720px]">
              Manage the foundational categories and document systems that power Ethos&rsquo;s understanding of your organisation.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/vault')}
            className="gap-1.5"
          >
            <ExternalLink className="size-3.5" />
            View Vault
          </Button>
        </header>

        <CategoriesSection
          categories={categories}
          fileCounts={fileCounts}
          onUpdate={updateCategory}
          onRemove={removeCategory}
          onAdd={addCategory}
        />

        <IntegrationsSection
          integrations={integrations}
          onConnect={connectIntegration}
          onDisconnect={disconnectIntegration}
        />
      </div>
    </div>
  )
}
