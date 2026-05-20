import { NavLink, Outlet } from 'react-router-dom'
import { ShellPrompts } from '@/components/layout/ShellPrompts'
import { useAskEthos } from '@/context/useAskEthos'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Matters',           to: '/matters', end: true },
  { label: 'Respond',           to: '/respond' },
  { label: 'Meet',              to: '/meet' },
  { label: 'Time & Efficiency', to: '/work/time-efficiency' },
]

const WORK_PROMPTS = [
  { id: 'summarise', label: 'Summarise my **matters** and priorities', prompt: 'Summarise my matters and priorities' },
  { id: 'at-risk',   label: '**Matters at risk** and what to do next' },
  { id: 'wip',       label: 'Insights on **WIP and billing** opportunities' },
  { id: 'capacity',  label: 'Team **capacity** and reallocation suggestions' },
  { id: 'deadlines', label: 'Upcoming **deadlines** this week' },
  { id: 'meetings',  label: 'Prep for my next **client meetings**' },
  { id: 'time',      label: '**Time entries** missing or unbilled' },
  { id: 'response',  label: 'Drafts pending in **Respond**' },
]

export function WorkShell() {
  const { open: openEthos } = useAskEthos()

  function handlePromptClick(prompt) {
    if (prompt.prompt) openEthos(prompt.prompt)
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-white">
      <div className="shrink-0 px-6 pt-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-[28px] leading-[30px] tracking-[-1.12px] font-normal text-[#0A0A0A]">Work</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Matters, responses, meetings and time — your day-to-day work.
          </p>
          <ShellPrompts prompts={WORK_PROMPTS} onPromptClick={handlePromptClick} />
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

      <div className="flex flex-1 min-h-0">
        <Outlet />
      </div>
    </div>
  )
}
