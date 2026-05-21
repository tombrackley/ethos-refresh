import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import tenant from '@/config/tenant'
import { PAGE_TO_PATH } from '@/lib/routes'
import { isEnabled } from '@/config/flags'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
import { GetStartedWidget } from '@/components/launch/GetStartedWidget'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ArrowLeftRight,
  ChevronDown,
  ChevronLeft,
  Search,
} from 'lucide-react'
import { IconHomeRoof } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconHomeRoof'
import { IconShieldCheck3 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconShieldCheck3'
import { IconLaw } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconLaw'
import { IconTasks } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconTasks'
import { IconLightbulbGlow } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconLightbulbGlow'
import { IconGraduateCap } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconGraduateCap'
import { IconSettingsGear1 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconSettingsGear1'
import { IconTeam } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconTeam'
import { IconAtom } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconAtom'

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
  { title: 'Knowledge Centre', page: 'Knowledge Centre' },
]
const LEARN_PAGES = LEARN_SUB_ITEMS.map(i => i.page)

const TOP_ITEMS = [
  { title: 'Home',      icon: IconHomeRoof,       page: 'Home' },
  { title: 'Insights',  icon: IconLightbulbGlow,  page: 'Insights' },
  { title: 'Core',      icon: IconAtom,           page: 'Core',  tourKey: 'core' },
  { title: 'Community', icon: IconTeam,           page: 'Community' },
  { title: 'Manage',    icon: IconSettingsGear1,  page: 'Admin:Organisation Profile', tourKey: 'manage' },
]

const CORE_ITEMS = [
  { title: 'Comply', icon: IconShieldCheck3, page: 'Comply', subItems: COMPLY_SUB_ITEMS, activePages: ['Comply', ...COMPLY_PAGES], iconBg: 'bg-blue-200',    iconColor: 'text-blue-900' },
  { title: 'Govern', icon: IconLaw,          page: 'Govern', subItems: GOVERN_SUB_ITEMS, activePages: ['Govern', ...GOVERN_PAGES], iconBg: 'bg-violet-200',  iconColor: 'text-violet-900' },
  { title: 'Work',   icon: IconTasks,        page: 'Work',   subItems: WORK_SUB_ITEMS,   activePages: WORK_PAGES,                  iconBg: 'bg-amber-200',   iconColor: 'text-amber-900' },
  { title: 'Learn',  icon: IconGraduateCap,  page: 'Learn',  subItems: LEARN_SUB_ITEMS,  activePages: ['Learn', ...LEARN_PAGES],   iconBg: 'bg-emerald-200', iconColor: 'text-emerald-900', tourKey: 'spaces' },
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
  'Core': 'PAGE_VAULT',
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

// Launch-demo mode hides everything except a small set of items.
const LAUNCH_TOP_VISIBLE = new Set(['Home', 'Insights', 'Core', 'Manage'])
const LAUNCH_CORE_VISIBLE = new Set(['Learn'])

function getDemoMode() {
  try {
    const stored = sessionStorage.getItem('ethos_auth')
    if (stored) return JSON.parse(stored).demo ?? null
  } catch { /* ignore */ }
  return null
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

  const handleNavigate = (page) => {
    if (collapsed) toggleSidebar()
    const path = PAGE_TO_PATH[page]
    if (path) navigate(path)
  }

  // Filter nav items by feature flags + launch-demo mode
  const demoMode = getDemoMode()
  const filteredTopItems = useMemo(
    () => TOP_ITEMS.filter(item => {
      if (!isPageEnabled(item.page ?? item.title)) return false
      if (demoMode === 'launch' && !LAUNCH_TOP_VISIBLE.has(item.title)) return false
      return true
    }),
    [demoMode]
  )
  const filteredCoreItems = useMemo(
    () => CORE_ITEMS
      .filter(item => {
        if (!isPageEnabled(item.page ?? item.title)) return false
        if (demoMode === 'launch' && !LAUNCH_CORE_VISIBLE.has(item.title)) return false
        return true
      })
      .map(item => ({
        ...item,
        subItems: item.subItems?.filter(sub => isPageEnabled(sub.page)) ?? [],
      })),
    [demoMode]
  )

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
      <SidebarHeader className="px-3 pt-4 pb-0 gap-4 group-data-[collapsible=icon]:px-2">
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
              <div className="flex w-full items-center gap-2 group-data-[collapsible=icon]:justify-center">
                <img
                  src={tenant.icon}
                  alt={tenant.appName}
                  className="rounded-sm object-cover shrink-0"
                  style={{ width: 28, height: 28, minWidth: 28, minHeight: 28 }}
                />
                <span className="text-[18px] font-medium tracking-[-0.03em] text-foreground group-data-[collapsible=icon]:hidden">
                  {tenant.appName}
                </span>
                <button
                  type="button"
                  aria-label="Switch workspace"
                  className="ml-auto flex size-7 items-center justify-center rounded-md text-muted-foreground/70 hover:bg-sidebar-accent hover:text-foreground transition-colors shrink-0 group-data-[collapsible=icon]:hidden"
                >
                  <ArrowLeftRight className="size-4" />
                </button>
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>

        {!isAdminMode && (
          <button
            type="button"
            onClick={onSearchClick}
            aria-label="Open command palette"
            className="flex h-8 w-full items-center gap-2 rounded-md border border-border bg-background px-2.5 text-sm text-muted-foreground hover:bg-accent transition-colors group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!w-8 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!mx-auto"
          >
            <Search className="size-4 shrink-0" />
            <span className="flex-1 text-left group-data-[collapsible=icon]:hidden">Search</span>
            <kbd className="inline-flex h-5 items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground group-data-[collapsible=icon]:hidden">⌘K</kbd>
          </button>
        )}
      </SidebarHeader>


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
          {/* Flat nav — top items, divider, core items with colored icon boxes */}
          <SidebarContent className="gap-0">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0">
                  {filteredTopItems.map((item) => {
                    const itemActive = item.activePages
                      ? item.activePages.includes(activePage)
                      : activePage === (item.page ?? item.title)
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={itemActive}
                          onClick={() => handleNavigate(item.page ?? item.title)}
                          data-tour={item.tourKey}
                          className="gap-2.5 text-sidebar-nav-muted font-medium data-[active=true]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!mx-auto"
                        >
                          <item.icon className="size-4 shrink-0 [&_path]:stroke-2" />
                          <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-mono tracking-normal text-muted-foreground/60 font-semibold">
                SPACES
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0">
                  {filteredCoreItems.map((item) => {
                    const itemActive = item.activePages
                      ? item.activePages.includes(activePage)
                      : activePage === (item.page ?? item.title)
                    const hasSubs = item.subItems && item.subItems.length > 0
                    const isOpen = openMenus[item.title] ?? false
                    const buttonClassName = "gap-2 text-sidebar-nav-muted font-medium data-[active=true]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!p-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!mx-auto"
                    const iconBox = (
                      <span className={cn('flex size-6 items-center justify-center rounded-md shrink-0', item.iconBg)}>
                        <item.icon className={cn('size-3.5 [&_path]:stroke-2', item.iconColor)} />
                      </span>
                    )

                    // Collapsed mode with sub-items: show a popover dropdown to the right.
                    if (collapsed && hasSubs) {
                      return (
                        <SidebarMenuItem key={item.title}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <SidebarMenuButton
                                tooltip={item.title}
                                isActive={itemActive}
                                className={buttonClassName}
                              >
                                {iconBox}
                                <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                              </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start" className="min-w-48">
                              <DropdownMenuLabel className="flex items-center gap-2">
                                {iconBox}
                                <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {item.subItems.map(sub => (
                                <DropdownMenuItem
                                  key={sub.title}
                                  onClick={() => handleNavigate(sub.page)}
                                  className={cn('text-sm', activePage === sub.page && 'bg-accent font-medium')}
                                >
                                  {sub.title}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </SidebarMenuItem>
                      )
                    }

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={itemActive}
                          onClick={() => {
                            if (hasSubs) toggleMenu(item.title)
                            handleNavigate(item.page ?? item.title)
                          }}
                          data-tour={item.tourKey}
                          className={buttonClassName}
                        >
                          {iconBox}
                          <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                          {hasSubs && (
                            <ChevronDown
                              className={cn(
                                'ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[collapsible=icon]:hidden',
                                isOpen && 'rotate-180'
                              )}
                            />
                          )}
                        </SidebarMenuButton>
                        {hasSubs && isOpen && (
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
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </>
      )}

      {demoMode === 'launch' && !isAdminMode && (
        <SidebarFooter className="px-3 pb-3 group-data-[collapsible=icon]:px-2">
          <GetStartedWidget />
        </SidebarFooter>
      )}

      <SidebarRail />
    </Sidebar>
  )
}
