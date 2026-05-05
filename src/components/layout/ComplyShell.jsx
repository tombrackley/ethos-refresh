import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Overview',    to: '/comply',              end: true },
  { label: 'Legislation', to: '/comply/legislation' },
  { label: 'Obligations', to: '/comply/obligations' },
  { label: 'Contracts',   to: '/comply/contracts' },
  { label: 'Conflicts',   to: '/comply/conflicts' },
  { label: 'Risk',        to: '/comply/risk' },
  { label: 'Incidents',   to: '/comply/incidents' },
  { label: 'Audit',       to: '/comply/audit' },
]

export function ComplyShell() {
  return (
    <div className="flex flex-1 flex-col overflow-auto bg-white">
      <div className="shrink-0 px-6 pt-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-[28px] leading-[30px] tracking-[-1.12px] font-normal text-[#0A0A0A]">Comply</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Obligations, contracts, conflicts, risk and audit — across the firm.
          </p>
        </div>
      </div>

      <div className="sticky top-0 z-20 bg-white shrink-0 mt-5">
        <div className="px-6">
          <div className="mx-auto max-w-7xl">
          <div className="border-b border-border">
            <nav className="flex items-center gap-1 overflow-x-auto -mb-px">
              {TABS.map((tab, index) => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end}
                  className={({ isActive }) =>
                    cn(
                      'whitespace-nowrap py-2.5 text-sm font-medium border-b-2 transition-colors',
                      index === 0 ? 'pr-3' : 'px-3',
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
