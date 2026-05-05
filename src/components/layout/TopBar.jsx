import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PATH_TO_PAGE } from '@/lib/routes'
import tenant from '@/config/tenant'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AskEthosDrawer } from '@/components/AskEthosDrawer'
import { AskEthosSparkle } from '@/components/AskEthosSparkle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, Settings, UserCog, LogOut } from 'lucide-react'
import { IconBell } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconBell'
import { IconCalendar1 } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconCalendar1'

// Pages whose content area is plain white — the topbar should match.
const WHITE_BG_PATHS = new Set(['/home', '/vault'])
// Sections where every sub-route renders on a white shell.
const WHITE_BG_PREFIXES = ['/comply', '/govern', '/matters', '/respond', '/meet', '/work', '/learn', '/knowledge']

function topbarBgClass(pathname) {
  if (WHITE_BG_PATHS.has(pathname)) return 'bg-white'
  if (WHITE_BG_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return 'bg-white'
  return 'bg-background'
}

// Display overrides for awkward leaf names (parent prefix duplicated, etc).
const BREADCRUMB_OVERRIDES = {
  'Govern Meetings': 'Meetings',
}

function displayLabel(label) {
  if (!label) return ''
  if (label.startsWith('Admin:')) return label.replace('Admin:', '')
  return BREADCRUMB_OVERRIDES[label] ?? label
}

function breadcrumbsFromPath(pathname) {
  if (pathname === '/' && PATH_TO_PAGE['/']) {
    return [{ label: PATH_TO_PAGE['/'], path: '/' }]
  }

  const segments = pathname.split('/').filter(Boolean)
  const crumbs = []

  // Admin routes always read "Admin / <Page>". The Admin root has no route, so
  // its crumb falls back to the first admin page.
  if (segments[0] === 'admin') {
    crumbs.push({ label: 'Admin', path: '/admin/organisation-profile' })
    const tryPath = '/' + segments.join('/')
    const label = PATH_TO_PAGE[tryPath]
    if (label) crumbs.push({ label: displayLabel(label), path: tryPath })
    return crumbs
  }

  for (let i = 1; i <= segments.length; i++) {
    const tryPath = '/' + segments.slice(0, i).join('/')
    const label = PATH_TO_PAGE[tryPath]
    if (label) crumbs.push({ label: displayLabel(label), path: tryPath })
  }

  return crumbs.filter((c, i) => c.label !== crumbs[i - 1]?.label)
}

export function TopBar({ onLogout }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [askEthosOpen, setAskEthosOpen] = useState(false)
  const crumbs = breadcrumbsFromPath(pathname)

  return (
    <header className={`flex h-11 shrink-0 items-center justify-between border-b border-[#EFEFEF] px-4 ${topbarBgClass(pathname)}`}>
      <nav aria-label="Breadcrumb" className="flex items-center text-xs font-medium text-[#A1A1A1]">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <span key={`${c.path}-${i}`} className="flex items-center">
              {i > 0 && <span className="mx-1.5 text-[#A1A1A1]/60">/</span>}
              {isLast ? (
                <span className="text-foreground/70" aria-current="page">{c.label}</span>
              ) : (
                <Link to={c.path} className="hover:text-foreground transition-colors">
                  {c.label}
                </Link>
              )}
            </span>
          )
        })}
      </nav>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setAskEthosOpen(true)}
          className="inline-flex h-7 items-center gap-1 rounded-lg border border-border bg-white px-2 text-sm font-medium text-foreground tracking-tight hover:bg-accent transition-colors"
        >
          <AskEthosSparkle className="size-4" />
          Ask Ethos
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="text-muted-foreground/70 hover:text-foreground transition-colors"
        >
          <IconBell className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Calendar"
          className="text-muted-foreground/70 hover:text-foreground transition-colors"
        >
          <IconCalendar1 className="size-4" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Account menu"
              className="rounded-[10px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Avatar className="size-8 rounded-[10px] border border-[#F5F5F5]">
                <AvatarFallback className="bg-brand-green-100 text-foreground text-xs font-semibold rounded-[10px]">
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

      <AskEthosDrawer open={askEthosOpen} onOpenChange={setAskEthosOpen} />
    </header>
  )
}
