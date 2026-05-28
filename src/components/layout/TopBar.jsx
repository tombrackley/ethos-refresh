import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PATH_TO_PAGE } from '@/lib/routes'
import { NOTIFICATIONS } from '@/lib/notifications'
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
import { User, Settings, UserCog, LogOut, PanelLeft, ChevronRight, X } from 'lucide-react'
import { IconBell } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconBell'
import { IconCalendar1 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconCalendar1'
import { useSidebar } from '@/components/ui/sidebar'

// Pages whose content area is plain white — the topbar should match.
const WHITE_BG_PATHS = new Set(['/vault', '/resources', '/notifications'])
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
  const { toggleSidebar } = useSidebar()
  const [notifOpen, setNotifOpen] = useState(false)
  const pageLabel = (PATH_TO_PAGE[pathname] ?? '').replace(/^Admin:/, '')

  // Breadcrumb mode for insight detail page (/insights/:id).
  const insightDetailMatch = pathname.match(/^\/insights\/([^/]+)$/)
  const detailId = insightDetailMatch?.[1]
  const detailTitle = detailId
    ? (tenant.pages?.insights?.briefingItems ?? []).find(b => b.id === detailId)?.title
    : null

  return (
    <header className={`relative flex h-11 shrink-0 items-center justify-between border-b border-[#EFEFEF] px-4 ${topbarBgClass(pathname)}`}>
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
          Ask
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
          onClick={() => setNotifOpen(o => !o)}
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

      {notifOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
          <NotificationsPopover onClose={() => setNotifOpen(false)} />
        </>
      )}
    </header>
  )
}

function NotificationsPopover({ onClose }) {
  const navigate = useNavigate()
  return (
    <div className="absolute right-2 top-full mt-2 z-50 w-[420px] overflow-hidden rounded-xl border border-border bg-white shadow-lg">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => { onClose(); navigate('/notifications') }}
            className="rounded-md px-2 py-1 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            View all
          </button>
          <button
            type="button"
            aria-label="Close notifications"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
      <div className="max-h-[520px] overflow-y-auto">
        {NOTIFICATIONS.map((n, i) => (
          n.featured ? (
            <FeaturedNotification key={n.id} {...n} isLast={i === NOTIFICATIONS.length - 1} />
          ) : (
            <CompactNotification key={n.id} {...n} isLast={i === NOTIFICATIONS.length - 1} />
          )
        ))}
      </div>
    </div>
  )
}

function NotifAvatar({ sender }) {
  if (sender) {
    const initials = sender.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-700">
        {initials}
      </span>
    )
  }
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-white overflow-hidden">
      <img src={tenant.icon} alt="" className="size-4 rounded-sm" />
    </span>
  )
}

function UnreadDot({ visible }) {
  return (
    <span className={`mt-1.5 size-2 shrink-0 rounded-full ${visible ? 'bg-blue-500' : 'bg-transparent'}`} />
  )
}

function FeaturedNotification({ sender, title, body, time, read, isLast }) {
  return (
    <div className={`flex gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50 ${!isLast ? 'border-b border-border' : ''}`}>
      <NotifAvatar sender={sender} />
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        <div>
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          <p className="mt-1 text-sm text-slate-600 leading-relaxed">{body}</p>
        </div>
        <div className="aspect-[16/9] w-full rounded-lg bg-slate-100" />
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
      <UnreadDot visible={!read} />
    </div>
  )
}

function CompactNotification({ sender, title, body, time, read, isLast, noThumbnail }) {
  return (
    <div className={`flex gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50 ${!isLast ? 'border-b border-border' : ''}`}>
      <NotifAvatar sender={sender} />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600 leading-relaxed">{body}</p>
        <span className="mt-2 block text-xs text-muted-foreground">{time}</span>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <UnreadDot visible={!read} />
        {!noThumbnail && <div className="size-20 rounded-lg bg-slate-100" />}
      </div>
    </div>
  )
}
