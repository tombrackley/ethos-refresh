import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import tenant from '@/config/tenant'
import { PAGE_TO_PATH } from '@/lib/routes'
import { isEnabled } from '@/config/flags'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ChevronDown,
  ChevronLeft,
  ChevronsUpDown,
  Search,
  PanelLeftClose,
} from 'lucide-react'
import { IconHomeRoof } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconHomeRoof'
import { IconSpeedDots } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconSpeedDots'
import { IconShieldCheck3 } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconShieldCheck3'
import { IconLaw } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconLaw'
import { IconTasks } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconTasks'
import { IconShortcut } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconShortcut'
import { IconBooks } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconBooks'
import { IconPeopleIdCard } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconPeopleIdCard'
import { IconLightbulbGlow } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconLightbulbGlow'
import { IconGraduateCap } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconGraduateCap'
import { IconTeam } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconTeam'

const COMPLY_SUB_ITEMS = tenant.complySubItems
const COMPLY_PAGES = COMPLY_SUB_ITEMS.map(i => i.page)

const GOVERN_SUB_ITEMS = [
  { title: 'Overview', page: 'Govern' },
  { title: 'Boards & Committees', page: 'Boards & Committees' },
  { title: 'Meetings', page: 'Govern Meetings' },
  { title: 'Board Papers', page: 'Board Papers' },
  { title: 'Policies & Procedures', page: 'Policies & Procedures' },
  { title: 'Delegations of Authority', page: 'Delegations of Authority' },
  { title: 'Company Register', page: 'Company Register' },
]
const GOVERN_PAGES = GOVERN_SUB_ITEMS.map(i => i.page)

const WORK_SUB_ITEMS = [
  { title: tenant.nav.work, page: 'Work' },
  { title: 'Respond', page: 'Respond' },
  { title: 'Meet', page: 'Meet' },
  { title: 'Time & Efficiency', page: 'Time & Efficiency' },
]
const WORK_PAGES = WORK_SUB_ITEMS.map(i => i.page)

const LEARN_SUB_ITEMS = [
  { title: 'Overview', page: 'Learn' },
  { title: 'Learning Journeys', page: 'Learning Journeys' },
  { title: 'CPD Tracker', page: 'CPD Tracker' },
  { title: 'Skills Profile', page: 'Skills Profile' },
]
const LEARN_PAGES = LEARN_SUB_ITEMS.map(i => i.page)

const navGroups = [
  {
    label: 'ORG',
    items: [
      { title: 'Control',  icon: IconSpeedDots },
      { title: 'Comply',   icon: IconShieldCheck3, page: 'Comply', activePages: ['Comply', ...COMPLY_PAGES] },
      { title: 'Govern',   icon: IconLaw, page: 'Govern', activePages: ['Govern', ...GOVERN_PAGES] },
      { title: 'Work',     icon: IconTasks, page: 'Work', activePages: WORK_PAGES },
    ],
  },
  {
    label: 'KNOWLEDGE',
    items: [
      { title: 'Vault',            icon: IconShortcut },
      { title: 'Resource Library', icon: IconBooks, page: 'Resource Library' },
      { title: 'Talent',           icon: IconPeopleIdCard },
    ],
  },
  {
    label: 'YOU',
    items: [
      { title: 'Insights',         icon: IconLightbulbGlow },
      { title: 'Learn',            icon: IconGraduateCap, page: 'Learn', activePages: ['Learn', ...LEARN_PAGES] },
      { title: 'Knowledge Centre', icon: IconBooks, page: 'Knowledge Centre' },
      { title: 'Community',        icon: IconTeam },
    ],
  },
]

// Map sidebar page names to feature flag keys
const PAGE_FLAG_MAP = {
  'Control': 'PAGE_CONTROL',
  'Comply': 'PAGE_COMPLY',
  'Matters': 'PAGE_WORK',
  'Respond': 'PAGE_WORK_RESPOND',
  'Meet': 'PAGE_WORK_MEET',
  'Time & Efficiency': 'PAGE_WORK_TIME_EFFICIENCY',
  'Govern': 'PAGE_GOVERN',
  'Boards & Committees': 'PAGE_GOVERN_BOARDS_COMMITTEES',
  'Govern Meetings': 'PAGE_GOVERN_MEETINGS',
  'Board Papers': 'PAGE_GOVERN_BOARD_PAPERS',
  'Policies & Procedures': 'PAGE_GOVERN_POLICIES',
  'Delegations of Authority': 'PAGE_GOVERN_DELEGATIONS',
  'Company Register': 'PAGE_GOVERN_COMPANY_REGISTER',
  'Vault': 'PAGE_VAULT',
  'Resource Library': 'PAGE_RESOURCES',
  'Talent': 'PAGE_TALENT',
  'Insights': 'PAGE_INSIGHTS',
  'Learn': 'PAGE_LEARN',
  'Learning Journeys': 'PAGE_LEARN_JOURNEYS',
  'Knowledge Centre': 'PAGE_LEARN_KNOWLEDGE_CENTRE',
  'CPD Tracker': 'PAGE_LEARN_CPD',
  'Skills Profile': 'PAGE_LEARN_SKILLS',
  'Community': 'PAGE_COMMUNITY',
  'Integrations': 'PAGE_INTEGRATIONS',
  'Settings': 'PAGE_SETTINGS',
  'Admin:Organisation Profile': 'PAGE_ADMIN_ORG_PROFILE',
  'Admin:Users': 'PAGE_ADMIN_USERS',
  'Admin:Privacy & Security': 'PAGE_ADMIN_PRIVACY_SECURITY',
  'Admin:Billing': 'PAGE_ADMIN_BILLING',
  'Admin:AI Settings': 'PAGE_ADMIN_AI_SETTINGS',
  'Admin:Integrations': 'PAGE_ADMIN_INTEGRATIONS',
  'Admin:Vault': 'PAGE_ADMIN_VAULT',
  'Admin:Resources': 'PAGE_ADMIN_RESOURCES',
  'Admin:Talent': 'PAGE_ADMIN_TALENT',
  'Admin:Activity & Logs': 'PAGE_ADMIN_ACTIVITY_LOGS',
  'Admin:Performance': 'PAGE_ADMIN_PERFORMANCE',
  'Admin:Reporting': 'PAGE_ADMIN_REPORTING',
  'Admin:Govern': 'PAGE_ADMIN_GOVERN',
  'Admin:Govern Settings': 'PAGE_ADMIN_GOVERN_SETTINGS',
  'Admin:Comply': 'PAGE_ADMIN_COMPLY',
  'Admin:Obligations': 'PAGE_ADMIN_OBLIGATIONS',
  'Admin:Risk Framework': 'PAGE_ADMIN_RISK_FRAMEWORK',
  'Admin:Work': 'PAGE_ADMIN_WORK',
  'Admin:Matter Types': 'PAGE_ADMIN_MATTER_TYPES',
  'Admin:Workflows': 'PAGE_ADMIN_WORKFLOWS',
  'Admin:Learning Journeys': 'PAGE_ADMIN_LEARNING_JOURNEYS',
  'Admin:CPD Management': 'PAGE_ADMIN_CPD_MANAGEMENT',
  'Admin:CPD Regimes': 'PAGE_ADMIN_CPD_REGIMES',
  'Admin:CPD Events': 'PAGE_ADMIN_CPD_EVENTS',
  'Admin:Team Capability': 'PAGE_ADMIN_TEAM_CAPABILITY',
  'Admin:Knowledge Centre': 'PAGE_ADMIN_KNOWLEDGE_CENTRE',
  'Profile': 'PAGE_PROFILE',
  // Comply sub-items
  'Legislation & Regulatory Landscape': 'PAGE_COMPLY_LEGISLATION',
  'Obligations Register': 'PAGE_COMPLY_OBLIGATIONS',
  'Contracts & Obligations': 'PAGE_COMPLY_CONTRACTS',
  'Conflict Management': 'PAGE_COMPLY_CONFLICTS',
  'Risk & Controls': 'PAGE_COMPLY_RISK',
  'Incidents & Breaches': 'PAGE_COMPLY_INCIDENTS',
  'Audit & Evidence': 'PAGE_COMPLY_AUDIT',
}

function isPageEnabled(pageName) {
  const flag = PAGE_FLAG_MAP[pageName]
  if (!flag) return true // no flag = always show
  return isEnabled(flag)
}

import { adminParentGroups } from '@/config/adminNav'

// Derive activePage name from current URL path
function useActivePage() {
  const { pathname } = useLocation()
  // Check admin routes
  if (pathname.startsWith('/admin/')) {
    const slug = pathname.replace('/admin/', '')
    const slugToAdmin = {
      'organisation-profile':'Admin:Organisation Profile',
      'users':             'Admin:Users',
      'privacy-security':  'Admin:Privacy & Security',
      'billing':           'Admin:Billing',
      'ai-settings':       'Admin:AI Settings',
      'integrations':      'Admin:Integrations',
      'vault':             'Admin:Vault',
      'resources':         'Admin:Resources',
      'talent':            'Admin:Talent',
      'activity-logs':     'Admin:Activity & Logs',
      'performance':       'Admin:Performance',
      'reporting':         'Admin:Reporting',
      'govern':            'Admin:Govern',
      'govern-settings':   'Admin:Govern Settings',
      'comply':            'Admin:Comply',
      'obligations':       'Admin:Obligations',
      'risk-framework':    'Admin:Risk Framework',
      'work':              'Admin:Work',
      'matter-types':      'Admin:Matter Types',
      'workflows':         'Admin:Workflows',
      'learning-journeys': 'Admin:Learning Journeys',
      'cpd-management':    'Admin:CPD Management',
      'cpd-regimes':       'Admin:CPD Regimes',
      'cpd-events':        'Admin:CPD Events',
      'team-capability':   'Admin:Team Capability',
      'knowledge-centre':  'Admin:Knowledge Centre',
    }
    return slugToAdmin[slug] || 'Admin:Organisation Profile'
  }
  // Check exact path matches (longest first for /comply/*, /govern/*, /learn/*)
  const sorted = Object.entries(PAGE_TO_PATH)
    .filter(([, path]) => !path.startsWith('/admin'))
    .map(([page, path]) => [path, page])
    .sort((a, b) => b[0].length - a[0].length)
  for (const [path, page] of sorted) {
    if (pathname === path) return page
  }
  return 'Control'
}

export function AppSidebar({ onSearchClick }) {
  const navigate = useNavigate()
  const { toggleSidebar, state } = useSidebar()
  const collapsed = state === 'collapsed'
  const activePage = useActivePage()
  const [selectedBoard, setSelectedBoard] = useState(tenant.boards?.[0] ?? null)

  const handleNavigate = (page) => {
    if (collapsed) toggleSidebar()
    const path = PAGE_TO_PATH[page]
    if (path) navigate(path)
  }

  // Filter nav items by feature flags
  const filteredNavGroups = useMemo(() => {
    return navGroups.map(group => {
      const items = group.items
        .map(item => {
          const pageName = item.page ?? item.dashPage ?? item.title
          // For items with sub-items, filter the sub-items first
          if (item.subItems) {
            const filteredSubs = item.subItems.filter(sub => isPageEnabled(sub.page))
            if (filteredSubs.length === 0) return null
            return { ...item, subItems: filteredSubs }
          }
          // Simple items — check if the page is enabled
          if (!isPageEnabled(pageName)) return null
          return item
        })
        .filter(Boolean)
      if (items.length === 0) return null
      return { ...group, items }
    }).filter(Boolean)
  }, [])

const _filteredAdminNavGroups = useMemo(() => {
    return []
  }, [])

  const isAdminMode = activePage.startsWith('Admin:')
  const [openMenus, setOpenMenus] = useState(() => {
    const initial = {}
    if (COMPLY_PAGES.includes(activePage)) initial['Comply'] = true
    if (GOVERN_PAGES.includes(activePage)) initial['Govern'] = true
    if (WORK_PAGES.includes(activePage)) initial['Work'] = true
    if (LEARN_PAGES.includes(activePage)) initial['Learn'] = true
    return initial
  })

  const toggleMenu = (key) => setOpenMenus(o => ({ ...o, [key]: !o[key] }))

  return (
    <Sidebar collapsible="icon">
      {/* Header — logo or back button */}
      <SidebarHeader className="px-3 pt-4 pb-0 gap-4">
        <SidebarMenu>
          <SidebarMenuItem>
            {isAdminMode ? (
              <SidebarMenuButton
                size="lg"
                tooltip="Back"
                onClick={() => handleNavigate('Control')}
                className="gap-2 px-1"
              >
                <ChevronLeft className="size-4 shrink-0" />
                <span className="font-semibold text-sm group-data-[collapsible=icon]:hidden">Admin</span>
              </SidebarMenuButton>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <img src={tenant.logo} alt={tenant.appName} className={cn(tenant.logoClassName || 'h-7 w-auto', 'group-data-[collapsible=icon]:hidden')} />
                  <img src={tenant.icon} alt={tenant.appName} className="hidden group-data-[collapsible=icon]:block rounded-lg object-cover" style={{ width: 32, height: 32, minWidth: 32, minHeight: 32 }} />
                </div>
                <div className="flex items-center gap-0.5 group-data-[collapsible=icon]:hidden">
                  <button onClick={toggleSidebar} className="size-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors">
                    <PanelLeftClose className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>

        {!isAdminMode && (
          <button
            type="button"
            onClick={onSearchClick}
            aria-label="Open command palette"
            className="flex h-8 w-full items-center gap-2 rounded-md border border-border bg-background px-2.5 text-sm text-muted-foreground hover:bg-accent transition-colors group-data-[collapsible=icon]:hidden"
          >
            <Search className="size-4" />
            <span className="flex-1 text-left">Search</span>
            <kbd className="inline-flex h-5 items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">⌘K</kbd>
          </button>
        )}
      </SidebarHeader>

      {/* Board selector (multi-entity tenants) */}
      {tenant.boards && !isAdminMode && (
        <div className="px-3 pb-2 group-data-[collapsible=icon]:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center justify-between gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-left text-sm hover:bg-accent transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  <img src={tenant.icon} alt="" className="shrink-0 rounded" style={{ width: 24, height: 24 }} />
                  <span className="truncate text-foreground">{selectedBoard?.label}</span>
                </div>
                <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
              {tenant.boards.map((board) => (
                <DropdownMenuItem
                  key={board.id}
                  onClick={() => setSelectedBoard(board)}
                  className={cn('text-sm', selectedBoard?.id === board.id && 'bg-accent font-medium')}
                >
                  {board.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {isAdminMode ? (
        <>
          {/* Admin parent nav — grouped categories */}
          <SidebarContent>
            {adminParentGroups.map((group) => (
              <SidebarGroup key={group.label} className="py-1">
                <SidebarGroupLabel className="text-xs font-mono tracking-normal text-muted-foreground/60 font-semibold">
                  {group.label}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-0">
                    {group.categories.map((cat) => {
                      const catPages = cat.items.map(i => i.page ?? `Admin:${i.title}`)
                      const isActive = catPages.includes(activePage)
                      return (
                        <SidebarMenuItem key={cat.label}>
                          <SidebarMenuButton
                            tooltip={cat.label}
                            isActive={isActive}
                            onClick={() => {
                              const firstPage = cat.items[0].page ?? `Admin:${cat.items[0].title}`
                              handleNavigate(firstPage)
                            }}
                            className="gap-2.5 text-sidebar-nav-muted font-medium data-[active=true]:text-sidebar-accent-foreground"
                          >
                            {cat.icon && <cat.icon className="size-4 shrink-0" />}
                            <span className="text-sm">{cat.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </>
      ) : (
        <>
          {/* Regular nav groups */}
          <SidebarContent className="gap-0">
            {/* Ungrouped: Home */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Home"
                      isActive={activePage === 'Home'}
                      onClick={() => handleNavigate('Home')}
                      className="gap-2.5 text-sidebar-nav-muted font-medium data-[active=true]:text-sidebar-accent-foreground"
                    >
                      <IconHomeRoof className="size-4 shrink-0" />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {filteredNavGroups.map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel className="text-xs font-mono tracking-normal text-muted-foreground/60 font-semibold">
                  {group.label}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-0">
                    {group.items.map((item) => {
                      if (item.subItems) {
                        const subPages = item.subItems.map(s => s.page)
                        const isActive = subPages.includes(activePage)
                        const isOpen = openMenus[item.title] ?? false
                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                              tooltip={item.title}
                              isActive={isActive}
                              onClick={() => {
                                toggleMenu(item.title)
                                if (item.dashPage && !openMenus[item.title]) handleNavigate(item.dashPage)
                              }}
                              className="gap-2.5 text-sidebar-nav-muted font-medium data-[active=true]:text-sidebar-accent-foreground"
                            >
                              <item.icon className="size-4 shrink-0" />
                              <span>{item.title}</span>
                              <ChevronDown className={`ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            </SidebarMenuButton>
                            {isOpen && (
                              <SidebarMenuSub className="gap-0">
                                {item.subItems.map(sub => (
                                  <SidebarMenuSubItem key={sub.title}>
                                    <SidebarMenuSubButton
                                      isActive={activePage === sub.page}
                                      onClick={() => handleNavigate(sub.page)}
                                      className="text-muted-foreground/95"
                                    >
                                      <span>{sub.title}</span>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            )}
                          </SidebarMenuItem>
                        )
                      }

                      const itemActive = item.activePages
                        ? item.activePages.includes(activePage)
                        : activePage === (item.page ?? item.title)
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            tooltip={item.title}
                            isActive={itemActive}
                            onClick={() => handleNavigate(item.page ?? item.title)}
                            className="gap-2.5 text-sidebar-nav-muted font-medium data-[active=true]:text-sidebar-accent-foreground"
                          >
                            <item.icon className="size-4 shrink-0" />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </>
      )}

      <SidebarRail />
    </Sidebar>
  )
}
