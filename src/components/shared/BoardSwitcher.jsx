import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronDown, Check, Search, Layers } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import tenant from '@/config/tenant'
import { cn } from '@/lib/utils'
import { getActiveBoardId } from '@/lib/govern'

const BOARDS = tenant.pages.govern?.boards ?? []

export function BoardSwitcher() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')

  const activeId = getActiveBoardId(searchParams)
  const isAll = activeId === 'all'
  const activeBoard = useMemo(() => BOARDS.find(b => b.id === activeId), [activeId])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return BOARDS
    return BOARDS.filter(b => b.name.toLowerCase().includes(q))
  }, [query])

  function selectBoard(id) {
    const next = new URLSearchParams(searchParams)
    next.set('board', id)
    setSearchParams(next, { replace: true })
    setQuery('')
  }

  const label = isAll ? 'All boards' : activeBoard?.name ?? 'Select board'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 border-input bg-white px-3 text-sm font-medium text-foreground hover:bg-muted/40"
        >
          {isAll && <Layers className="size-4 text-muted-foreground" />}
          <span className="truncate max-w-[260px]">{label}</span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72 p-0">
        <div className="border-b border-border/60 p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search boards…"
              className="h-8 pl-7 text-sm shadow-none"
            />
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-xs text-muted-foreground">No matches.</p>
          ) : (
            filtered.map(b => {
              const checked = b.id === activeId
              return (
                <DropdownMenuItem
                  key={b.id}
                  onSelect={() => selectBoard(b.id)}
                  className={cn(
                    'cursor-pointer',
                    checked && 'bg-brand-50/40 text-brand-800 focus:bg-brand-50/70',
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{b.name}</div>
                    {b.type && (
                      <div className="text-xs text-muted-foreground truncate">{b.type}</div>
                    )}
                  </div>
                  {checked && <Check className="size-4 text-brand-700" />}
                </DropdownMenuItem>
              )
            })
          )}
        </div>

        <DropdownMenuSeparator />

        <div className="p-1">
          <DropdownMenuItem
            onSelect={() => selectBoard('all')}
            className={cn(
              'cursor-pointer',
              isAll && 'bg-brand-50/40 text-brand-800 focus:bg-brand-50/70',
            )}
          >
            <Layers className="size-4 text-muted-foreground" />
            <span className="flex-1">All boards</span>
            {isAll && <Check className="size-4 text-brand-700" />}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
