import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PATH_TO_PAGE } from '@/lib/routes'
import tenant from '@/config/tenant'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AskEthosSparkle } from '@/components/AskEthosSparkle'
import { useAskEthos } from '@/context/useAskEthos'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, Settings, UserCog, LogOut, PanelLeft, ChevronRight } from 'lucide-react'
import { IconBell } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconBell'
import { IconCalendar1 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconCalendar1'
import { useSidebar } from '@/components/ui/sidebar'

// Pages whose content area is plain white — the topbar should match.
const WHITE_BG_PATHS = new Set(['/vault'])
// Sections where every sub-route renders on a white shell.
const WHITE_BG_PREFIXES = ['/home', '/control', '/comply', '/govern', '/matters', '/respond', '/meet', '/work', '/learn', '/knowledge', '/insights']

function topbarBgClass(pathname) {
  if (WHITE_BG_PATHS.has(pathname)) return 'bg-white'
  if (WHITE_BG_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return 'bg-white'
  return 'bg-background'
}

export function TopBar({ onLogout }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { open: openEthos } = useAskEthos()
  const { toggleSidebar, setOpen } = useSidebar()
  const pageLabel = (PATH_TO_PAGE[pathname] ?? '').replace(/^Admin:/, '')

  // Close sidebar by default on insights routes; restore on leaving.
  const prevPath = useRef(pathname)
  useEffect(() => {
    const wasInsights = prevPath.current.startsWith('/insights')
    const nowInsights = pathname.startsWith('/insights')
    if (!wasInsights && nowInsights) setOpen(false)
    else if (wasInsights && !nowInsights) setOpen(true)
    prevPath.current = pathname
  }, [pathname, setOpen])

  // Breadcrumb mode for insight detail page (/insights/:id).
  const insightDetailMatch = pathname.match(/^\/insights\/([^/]+)$/)
  const detailId = insightDetailMatch?.[1]
  const detailTitle = detailId
    ? (tenant.pages?.insights?.briefingItems ?? []).find(b => b.id === detailId)?.title
    : null

  return (
    <header className={`flex h-11 shrink-0 items-center justify-between border-b border-[#EFEFEF] px-4 ${topbarBgClass(pathname)}`}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground/60 hover:bg-muted hover:text-foreground transition-colors"
        >
          <PanelLeft className="size-4" />
        </button>
        {detailTitle ? (
          <div className="flex items-center gap-1.5 text-sm">
            <button
              type="button"
              onClick={() => navigate('/insights')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Insights
            </button>
            <ChevronRight className="size-3.5 text-muted-foreground/60" />
            <span className="font-medium text-foreground truncate max-w-[420px]">{detailTitle}</span>
          </div>
        ) : pageLabel && (
          <span className="text-sm font-medium text-foreground">{pageLabel}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => openEthos()}
          className="relative inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-[0.6rem] border border-border bg-white px-2.5 h-8 text-sm font-medium text-foreground shadow-none transition-colors duration-75 hover:bg-accent hover:border-foreground/20 active:bg-accent/80 active:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:bg-white disabled:text-muted-foreground disabled:border-border disabled:opacity-50"
        >
          <AskEthosSparkle className="size-4" />
          Ask Ethos
        </button>
        <button
          type="button"
          aria-label="Calendar"
          className="relative inline-flex size-8 items-center justify-center rounded-[0.6rem] border border-border bg-white text-foreground shadow-none transition-colors duration-75 hover:bg-accent hover:border-foreground/20 active:bg-accent/80 active:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <IconCalendar1 className="size-4 [&_path]:stroke-2" />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex size-8 items-center justify-center rounded-[0.6rem] border border-border bg-white text-foreground shadow-none transition-colors duration-75 hover:bg-accent hover:border-foreground/20 active:bg-accent/80 active:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <IconBell className="size-4 [&_path]:stroke-2" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-blue-500 ring-2 ring-white" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Account menu"
              className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Avatar className="size-8 rounded-full border border-border">
                <AvatarFallback className="bg-brand-green-100 text-foreground text-xs font-semibold rounded-full">
                  {tenant.user?.initials ?? 'TB'}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-2">
              <p className="text-sm font-medium text-foreground">{tenant.user?.name ?? 'Tom Bradley'}</p>
              <p className="text-xs text-muted-foreground">{tenant.user?.email ?? 'tom@blackmores.com'}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')} className="gap-2 text-sm">
              <User className="size-4" /> Edit profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')} className="gap-2 text-sm">
              <Settings className="size-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/admin/organisation-profile')} className="gap-2 text-sm">
              <UserCog className="size-4" /> Admin
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="gap-2 text-sm text-destructive">
              <LogOut className="size-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </header>
  )
}
