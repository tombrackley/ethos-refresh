import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { PATH_TO_PAGE } from '@/lib/routes'
import { isEnabled } from '@/config/flags'
import tenant from '@/config/tenant'
import { useRecentPages } from '@/hooks/useRecentPages'
import { cn } from '@/lib/utils'
import { Clock, ArrowUp, ArrowDown, CornerDownLeft } from 'lucide-react'
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
import { IconSettingsGear1 } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconSettingsGear1'
import { IconPlugin1 } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconPlugin1'
import { IconUser } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconUser'
import { IconSparkleCentral } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconSparkleCentral'
import { IconCalendar1 } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconCalendar1'

const ICON_FOR_PAGE = {
  Control: IconSpeedDots,
  Comply: IconShieldCheck3,
  Govern: IconLaw,
  Work: IconTasks,
  Respond: IconTasks,
  Meet: IconTasks,
  'Time & Efficiency': IconTasks,
  Vault: IconShortcut,
  'Resource Library': IconBooks,
  Talent: IconPeopleIdCard,
  Insights: IconLightbulbGlow,
  Learn: IconGraduateCap,
  'Learning Journeys': IconGraduateCap,
  'Knowledge Centre': IconBooks,
  'CPD Tracker': IconGraduateCap,
  'CPD Events': IconGraduateCap,
  'Skills Profile': IconGraduateCap,
  Community: IconTeam,
  Settings: IconSettingsGear1,
  Integrations: IconPlugin1,
  Profile: IconUser,
}

const NAV_PAGES = [
  'Control', 'Comply', 'Govern', 'Work', 'Respond', 'Meet', 'Time & Efficiency',
  'Legislation & Regulatory Landscape', 'Obligations Register', 'Contracts & Obligations',
  'Conflict Management', 'Risk & Controls', 'Incidents & Breaches', 'Audit & Evidence',
  'Boards & Committees', 'Govern Meetings', 'Board Papers', 'Policies & Procedures',
  'Delegations of Authority', 'Company Register',
  'Vault', 'Resource Library', 'Talent',
  'Insights', 'Learn', 'Learning Journeys', 'Knowledge Centre', 'CPD Tracker', 'CPD Events', 'Skills Profile',
  'Community',
  'Profile', 'Settings', 'Integrations',
]

const PAGE_FLAG_MAP = {
  Control: 'PAGE_CONTROL', Comply: 'PAGE_COMPLY', Work: 'PAGE_WORK',
  Respond: 'PAGE_WORK_RESPOND', Meet: 'PAGE_WORK_MEET', 'Time & Efficiency': 'PAGE_WORK_TIME_EFFICIENCY',
  Govern: 'PAGE_GOVERN',
  'Boards & Committees': 'PAGE_GOVERN_BOARDS_COMMITTEES', 'Govern Meetings': 'PAGE_GOVERN_MEETINGS',
  'Board Papers': 'PAGE_GOVERN_BOARD_PAPERS', 'Policies & Procedures': 'PAGE_GOVERN_POLICIES',
  'Delegations of Authority': 'PAGE_GOVERN_DELEGATIONS', 'Company Register': 'PAGE_GOVERN_COMPANY_REGISTER',
  Vault: 'PAGE_VAULT', 'Resource Library': 'PAGE_RESOURCES', Talent: 'PAGE_TALENT',
  Insights: 'PAGE_INSIGHTS', Learn: 'PAGE_LEARN', 'Learning Journeys': 'PAGE_LEARN_JOURNEYS',
  'Knowledge Centre': 'PAGE_LEARN_KNOWLEDGE_CENTRE', 'CPD Tracker': 'PAGE_LEARN_CPD',
  'CPD Events': 'PAGE_LEARN_CPD_EVENTS', 'Skills Profile': 'PAGE_LEARN_SKILLS',
  Community: 'PAGE_COMMUNITY', Settings: 'PAGE_SETTINGS', Integrations: 'PAGE_INTEGRATIONS',
  Profile: 'PAGE_PROFILE',
  'Legislation & Regulatory Landscape': 'PAGE_COMPLY_LEGISLATION', 'Obligations Register': 'PAGE_COMPLY_OBLIGATIONS',
  'Contracts & Obligations': 'PAGE_COMPLY_CONTRACTS', 'Conflict Management': 'PAGE_COMPLY_CONFLICTS',
  'Risk & Controls': 'PAGE_COMPLY_RISK', 'Incidents & Breaches': 'PAGE_COMPLY_INCIDENTS',
  'Audit & Evidence': 'PAGE_COMPLY_AUDIT',
}

const PAGE_TO_PATH = Object.fromEntries(Object.entries(PATH_TO_PAGE).map(([p, n]) => [n, p]))

function visiblePages(pages) {
  return pages
    .filter((page) => {
      const flag = PAGE_FLAG_MAP[page]
      if (flag && !isEnabled(flag)) return false
      return PAGE_TO_PATH[page] !== undefined
    })
    .map((page) => ({ page, path: PAGE_TO_PATH[page] }))
}

function StatusDot({ tone }) {
  const map = {
    red: 'bg-red-500',
    amber: 'bg-amber-500',
    green: 'bg-emerald-500',
    gray: 'bg-gray-300',
    outline: 'border border-gray-300 bg-transparent',
  }
  return <span className={cn('size-2 rounded-full shrink-0', map[tone] || map.gray)} />
}

function severityToTone(severity) {
  if (!severity) return 'gray'
  const s = severity.toLowerCase()
  if (s === 'critical') return 'red'
  if (s === 'high' || s === 'major') return 'amber'
  if (s === 'medium') return 'amber'
  if (s === 'low' || s === 'closed' || s === 'resolved') return 'outline'
  return 'gray'
}

function severityBadge(severity) {
  if (!severity) return null
  const variantMap = {
    Critical: 'priority-critical',
    High: 'priority-high',
    Major: 'priority-high',
    Medium: 'urgency-medium',
    Low: 'urgency-low',
  }
  const variant = variantMap[severity] || 'urgency-low'
  return <Badge variant={variant}>{severity}</Badge>
}

function ragToTone(rag, status) {
  if (rag === 'red') return 'red'
  if (rag === 'amber') return 'amber'
  if (rag === 'green') return 'green'
  if (status === 'Mitigated' || status === 'Monitored') return 'outline'
  return 'gray'
}

function statusBadge(status) {
  if (!status) return null
  const variantMap = {
    Overdue: 'priority-critical',
    Blocked: 'priority-critical',
    'At Risk': 'priority-high',
    'On Track': 'urgency-low',
  }
  const variant = variantMap[status] || 'urgency-low'
  return <Badge variant={variant}>{status}</Badge>
}

function RecordItem({ value, onSelect, tone, id, title, badge }) {
  return (
    <CommandItem value={value} onSelect={onSelect} className="gap-2.5">
      <StatusDot tone={tone} />
      {id && <span className="font-mono text-[11px] text-muted-foreground tabular-nums shrink-0">{id}</span>}
      <span className="truncate">{title}</span>
      {badge && <span className="ml-auto">{badge}</span>}
    </CommandItem>
  )
}

export function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate()
  const recent = useRecentPages()
useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  function go(path) {
    onOpenChange(false)
    navigate(path)
  }

  function run(fn) {
    onOpenChange(false)
    fn()
  }

  const navPages = visiblePages(NAV_PAGES)

  const records = useMemo(() => {
    const matters = tenant?.pages?.control?.matters ?? []
    const policies = tenant?.pages?.govern?.policies ?? []
    const boardPapers = tenant?.pages?.govern?.boardPapers ?? []
    const incidents = tenant?.pages?.comply?.incidents ?? []
    return { matters, policies, boardPapers, incidents }
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Actions">
          <CommandItem value="ask ethos assistant ai" onSelect={() => run(() => { /* hook up later */ })}>
            <IconSparkleCentral className="size-4 text-emerald-500" />
            <span>Ask Ethos</span>
          </CommandItem>
          <CommandItem value="upcoming meetings" onSelect={() => go('/meet')}>
            <IconCalendar1 className="size-4 text-muted-foreground" />
            <span>Upcoming meetings</span>
          </CommandItem>
          <CommandItem value="view tasks" onSelect={() => go('/matters')}>
            <IconTasks className="size-4 text-muted-foreground" />
            <span>View tasks</span>
          </CommandItem>
        </CommandGroup>

        {recent.length > 0 && (
          <CommandGroup heading="Recent">
            {recent.map((r) => {
              const Icon = ICON_FOR_PAGE[r.page]
              return (
                <CommandItem key={r.path} value={`recent ${r.page} ${r.path}`} onSelect={() => go(r.path)}>
                  {Icon ? <Icon className="size-4 text-muted-foreground" /> : <Clock className="size-4 text-muted-foreground" />}
                  <span>{r.page}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>
        )}

        {navPages.length > 0 && (
          <CommandGroup heading="Navigation">
            {navPages.map(({ page, path }) => {
              const Icon = ICON_FOR_PAGE[page]
              return (
                <CommandItem key={path} value={`go to ${page} ${path}`} onSelect={() => go(path)}>
                  {Icon && <Icon className="size-4 text-muted-foreground" />}
                  <span>Go to {page}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>
        )}

        <CommandSeparator />

        {records.matters.length > 0 && isEnabled('PAGE_WORK') && (
          <CommandGroup heading="Matters">
            {records.matters.map((m, i) => {
              const tone =
                m.status === 'On Hold' ? 'amber'
                : m.status === 'Active' ? 'green'
                : m.status === 'Review' ? 'amber'
                : 'gray'
              return (
                <RecordItem
                  key={`matter-${i}`}
                  value={`matter ${m.name} ${m.client ?? ''} ${m.type ?? ''} ${m.status ?? ''}`}
                  onSelect={() => go('/matters')}
                  tone={tone}
                  title={m.name}
                  badge={m.status && <Badge variant="outline" className="text-muted-foreground">{m.status}</Badge>}
                />
              )
            })}
          </CommandGroup>
        )}

        {records.incidents.length > 0 && isEnabled('PAGE_COMPLY_INCIDENTS') && (
          <CommandGroup heading="Incidents">
            {records.incidents.map((inc) => (
              <RecordItem
                key={`inc-${inc.id}`}
                value={`incident ${inc.id} ${inc.title} ${inc.client ?? ''} ${inc.severity ?? ''}`}
                onSelect={() => go('/comply/incidents')}
                tone={severityToTone(inc.severity)}
                id={inc.id}
                title={inc.title}
                badge={severityBadge(inc.severity)}
              />
            ))}
          </CommandGroup>
        )}

        {records.policies.length > 0 && isEnabled('PAGE_GOVERN_POLICIES') && (
          <CommandGroup heading="Policies">
            {records.policies.map((p) => (
              <RecordItem
                key={`policy-${p.id}`}
                value={`policy ${p.id} ${p.name} ${p.stage ?? ''} ${p.status ?? ''}`}
                onSelect={() => go('/govern/policies')}
                tone={ragToTone(p.rag, p.status)}
                id={p.id.toUpperCase()}
                title={p.name}
                badge={statusBadge(p.status)}
              />
            ))}
          </CommandGroup>
        )}

        {records.boardPapers.length > 0 && isEnabled('PAGE_GOVERN_BOARD_PAPERS') && (
          <CommandGroup heading="Board Papers">
            {records.boardPapers.map((bp) => (
              <RecordItem
                key={`bp-${bp.id}`}
                value={`board paper ${bp.id} ${bp.title} ${bp.responsibleOfficer?.name ?? ''}`}
                onSelect={() => go('/govern/board-papers')}
                tone={bp.blocked ? 'red' : 'gray'}
                id={bp.id.toUpperCase()}
                title={bp.title}
                badge={bp.stage && <Badge variant="outline" className="text-muted-foreground">{bp.stage}</Badge>}
              />
            ))}
          </CommandGroup>
        )}
      </CommandList>

      <div className="flex items-center justify-end gap-3 border-t px-3 py-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <kbd className="inline-flex size-4 items-center justify-center rounded border bg-background"><ArrowUp className="size-2.5" /></kbd>
          <kbd className="inline-flex size-4 items-center justify-center rounded border bg-background"><ArrowDown className="size-2.5" /></kbd>
          To navigate
        </span>
        <span className="inline-flex items-center gap-1">
          <kbd className="inline-flex h-4 items-center justify-center rounded border bg-background px-1"><CornerDownLeft className="size-2.5" /></kbd>
          To select
        </span>
        <span className="inline-flex items-center gap-1">
          <kbd className="inline-flex h-4 items-center justify-center rounded border bg-background px-1 font-mono">esc</kbd>
          To close
        </span>
      </div>
    </CommandDialog>
  )
}
