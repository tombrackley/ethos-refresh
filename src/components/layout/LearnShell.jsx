import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Overview',          to: '/learn',          end: true },
  { label: 'Learning Journeys', to: '/learn/journeys' },
  { label: 'CPD Tracker',       to: '/learn/cpd' },
  { label: 'Skills Profile',    to: '/learn/skills' },
]

export function LearnShell() {
  return (
    <div className="flex flex-1 flex-col overflow-auto bg-white">
      <div className="shrink-0 px-6 pt-6">
        <h1 className="text-[28px] leading-[30px] tracking-[-1.12px] font-normal text-[#0A0A0A]">Learn</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Learning journeys, CPD and skills — keep your team sharp.
        </p>
      </div>

      <div className="sticky top-0 z-20 bg-white shrink-0 mt-5">
        <div className="px-6">
          <div className="border-b border-border">
            <nav className="flex items-center gap-1 overflow-x-auto -mb-px">
              {TABS.map((tab) => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end}
                  className={({ isActive }) =>
                    cn(
                      'whitespace-nowrap px-3 py-2.5 text-sm font-medium border-b-2 transition-colors',
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

      <div className="flex flex-1 min-h-0">
        <Outlet />
      </div>
    </div>
  )
}
