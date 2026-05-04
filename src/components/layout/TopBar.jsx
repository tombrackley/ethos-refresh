import { Bell, Search, Sparkles, ChevronDown, User, LogOut } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import tenant from '@/config/tenant'

const sectionOf = (page) => {
  if (page.startsWith('Admin:')) return 'Admin'
  if (page === 'Profile') return 'Account'
  const orgPages = ['Control', 'Comply', 'Govern', 'Company Register', 'Matters', 'Respond', 'Meet', 'MatterDetail']
  const knowledgePages = ['Vault', 'Resource Library', 'Talent']
  const youPages = ['Insights', 'Learn', 'Learn:CPD', 'Learn:Journeys', 'Community']
  if (orgPages.includes(page)) return 'Org'
  if (knowledgePages.includes(page)) return 'Knowledge'
  if (youPages.includes(page)) return 'You'
  return 'Settings'
}

export function TopBar({ activePage, pageTitle, onNavigate }) {
  const section = sectionOf(activePage)
  const displayTitle = pageTitle || (activePage.startsWith('Admin:') ? activePage.replace('Admin:', '') : activePage)

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
      {/* Sidebar toggle */}
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />

      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-muted-foreground text-sm hover:text-foreground">
              {section}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {activePage === 'MatterDetail' && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink className="text-muted-foreground text-sm hover:text-foreground">
                  Matters
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm font-medium">{displayTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Search — centred */}
      <div className="flex flex-1 justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search anything..."
            className="pl-9 pr-10 h-9 bg-muted/50 border-border text-sm"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden select-none items-center gap-1 rounded border border-border bg-background px-1.5 text-xs font-mono text-muted-foreground sm:flex">
            K
          </kbd>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* AI button */}
        <Button variant="ghost" size="sm" className="gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <Sparkles className="size-4 text-brand-600" />
          <span className="hidden sm:inline">Ethika AI</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative size-9 text-muted-foreground hover:text-foreground">
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-brand-500" />
        </Button>

        {/* User avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5 pl-1 pr-2">
              <Avatar className="size-7">
                <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                  {tenant.user?.initials ?? 'TB'}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-2">
              <p className="text-sm font-medium text-foreground">{tenant.user?.name ?? 'Tom Bradley'}</p>
              <p className="text-xs text-muted-foreground">{tenant.user?.email ?? 'tom@blackmores.com'}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onNavigate?.('Profile')} className="gap-2 text-sm">
              <User className="size-4" /> Edit profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-sm text-destructive">
              <LogOut className="size-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
