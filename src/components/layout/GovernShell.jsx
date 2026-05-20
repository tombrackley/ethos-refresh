import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { ChevronDown, Settings } from 'lucide-react'
import { IconGlobe } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconGlobe'
import { IconUserGroup } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconUserGroup'
import { cn } from '@/lib/utils'
import tenant from '@/config/tenant'
import { Button } from '@/components/ui/button'
import { ShellPrompts } from '@/components/layout/ShellPrompts'
import { useAskEthos } from '@/context/useAskEthos'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

const TABS = [
  { label: 'Overview',    to: '/govern',                   end: true },
  { label: 'Meetings',    to: '/govern/meetings' },
  { label: 'Papers',      to: '/govern/board-papers' },
  { label: 'Policies',    to: '/govern/policies' },
  { label: 'Delegations', to: '/govern/delegations' },
  { label: 'Register',    to: '/govern/company-register' },
]

const GOVERN_PROMPTS = [
  { id: 'summarise',   label: 'Summarise **governance** and open board actions', prompt: 'Summarise governance and open board actions' },
  { id: 'papers',      label: 'Status of **board papers** for upcoming meeting' },
  { id: 'policies',    label: 'Overdue **policy reviews** and owners' },
  { id: 'resolutions', label: 'Outstanding **board resolutions**' },
  { id: 'delegations', label: '**Delegations** approaching expiry' },
  { id: 'agenda',      label: 'Draft **agenda** for next board meeting' },
  { id: 'duties',      label: 'Director **duties** check this quarter' },
  { id: 'committees',  label: '**Committee** action items overdue' },
]

const ALL_BOARDS_OPTION = { id: '__all__', name: 'All boards' }

// flag-icons supports `uk` as an alias for `gb` so any 2-letter ISO code works.
function BoardIcon({ id }) {
  if (id === '__all__') return <IconGlobe className="size-4 text-muted-foreground shrink-0" />
  if (typeof id === 'string' && /^[a-z]{2}$/.test(id)) {
    return (
      <span
        className={`fi fi-${id} shrink-0 rounded-[2px] block`}
        style={{ width: '20px', height: '15px', backgroundSize: 'cover' }}
      />
    )
  }
  return <IconUserGroup className="size-4 text-muted-foreground shrink-0" />
}

function BoardSelector({ selected, onSelect, options, minimal = false }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center text-sm font-medium text-foreground transition-colors shrink-0',
            minimal
              ? 'gap-2 px-3 py-2.5 border-b-2 border-transparent -mb-px hover:text-foreground/80'
              : 'h-10 min-w-[220px] gap-2.5 rounded-lg border border-border bg-white pl-3.5 pr-2.5 hover:bg-accent'
          )}
        >
          <BoardIcon id={selected.id} />
          <span className={cn('text-left', !minimal && 'flex-1')}>{selected.name}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[260px]">
        {options.map((b) => (
          <DropdownMenuItem
            key={b.id}
            onClick={() => onSelect(b)}
            className={cn('gap-2.5 text-sm', selected.id === b.id && 'bg-accent font-medium')}
          >
            <BoardIcon id={b.id} />
            <span>{b.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function GovernShell() {
  const { pathname } = useLocation()
  const boards = tenant?.pages?.govern?.boards ?? []
  const options = [ALL_BOARDS_OPTION, ...boards]
  const [selectedBoard, setSelectedBoard] = useState(ALL_BOARDS_OPTION)
  const { open: openEthos } = useAskEthos()

  function handlePromptClick(prompt) {
    if (prompt.prompt) openEthos(prompt.prompt)
  }

  const BOARDS_HIDDEN_PATHS = ['/govern/delegations', '/govern/company-register']
  const showBoardSelector = boards.length > 0 && !BOARDS_HIDDEN_PATHS.includes(pathname)

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-white">
      <div className="shrink-0 px-6 pt-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[28px] leading-[30px] tracking-[-1.12px] font-normal text-[#0A0A0A]">Govern</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Boards, meetings, papers and policies — your governance backbone.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="inline-flex h-8 items-center gap-2 rounded-[10px] bg-white border border-border px-3">
                <img src="/diligent-logo.jpeg" alt="Diligent" className="size-4 rounded-sm object-cover" />
                <span className="text-xs font-medium text-foreground">Connected</span>
              </div>
              <Button size="sm" variant="outline" className="h-8 gap-1.5">
                <Settings className="size-3.5" />
                Settings
              </Button>
            </div>
          </div>
          <ShellPrompts prompts={GOVERN_PROMPTS} onPromptClick={handlePromptClick} />
        </div>
      </div>

      <div className="sticky top-0 z-20 bg-white shrink-0 mt-5">
        <div className="px-6">
          <div className="mx-auto max-w-7xl">
            <div className="border-b border-border">
              <nav className="flex items-center gap-6 overflow-x-auto -mb-px">
                {TABS.map((tab) => (
                  <NavLink
                    key={tab.to}
                    to={tab.to}
                    end={tab.end}
                    className={({ isActive }) =>
                      cn(
                        'whitespace-nowrap py-2.5 text-sm font-medium border-b-2 transition-colors',
                        isActive
                          ? 'border-foreground text-foreground'
                          : 'border-transparent text-foreground/80 hover:text-foreground hover:border-border'
                      )
                    }
                  >
                    {tab.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {showBoardSelector && (
        <div className="shrink-0 px-6 pt-4">
          <div className="mx-auto max-w-7xl">
            <BoardSelector selected={selectedBoard} onSelect={setSelectedBoard} options={options} />
          </div>
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        <Outlet />
      </div>
    </div>
  )
}
