import { HomeCard } from './HomeCard'
import { IconCalendar1 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconCalendar1'
import { IconTasks } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconTasks'
import { IconShieldCheck3 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconShieldCheck3'
import { IconBooks } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconBooks'
import { IconGraduateCap } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconGraduateCap'
import { IconLightbulbGlow } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconLightbulbGlow'
import { IconTeam } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconTeam'

export function MeetingCard({ record: m }) {
  return (
    <HomeCard
      icon={IconCalendar1}
      accent="blue"
      title={m.name}
      subtitle={[m.dateTime, m.type].filter(Boolean).join(' · ')}
      badge={m.status}
      badgeVariant="status-rsvp"
      to="/govern/meetings"
    />
  )
}

export function EventCard({ record: e }) {
  const date = [e.month, e.day].filter(Boolean).join(' ')
  const subtitle = [date, e.time, e.location].filter(Boolean).join(' · ')
  return (
    <HomeCard
      icon={IconCalendar1}
      accent="purple"
      title={e.name}
      subtitle={subtitle}
      badge={e.type}
      badgeVariant="status-suggested"
      to="/meet"
    />
  )
}

export function TaskCard({ record: t }) {
  const accent = t.priority === 'Critical' ? 'red' : t.priority === 'High' ? 'amber' : 'slate'
  const badgeVariant = t.priority === 'Critical' ? 'priority-critical' : t.priority === 'High' ? 'priority-high' : 'urgency-low'
  const subtitle = [t.due && `Due ${t.due}`, t.assignee].filter(Boolean).join(' · ')
  return (
    <HomeCard
      icon={IconTasks}
      accent={accent}
      title={t.task}
      subtitle={subtitle}
      badge={t.priority}
      badgeVariant={badgeVariant}
      to="/work/time-efficiency"
    />
  )
}

export function PolicyCard({ record: p }) {
  const accent = p.rag === 'red' ? 'red' : p.rag === 'amber' ? 'amber' : 'green'
  const subtitle = [p.stage, p.daysAtStage != null && `${p.daysAtStage}d`].filter(Boolean).join(' · ')
  return (
    <HomeCard
      icon={IconShieldCheck3}
      accent={accent}
      title={p.name}
      subtitle={subtitle}
      badge={p.status || p.stage}
      badgeVariant="resource-under-review"
      to="/govern/policies"
    />
  )
}

export function BoardPaperCard({ record: bp }) {
  const accent = bp.blocked ? 'red' : 'slate'
  const subtitle = [bp.stage, bp.readingTime != null && `${bp.readingTime} min read`].filter(Boolean).join(' · ')
  return (
    <HomeCard
      icon={IconBooks}
      accent={accent}
      title={bp.title}
      subtitle={subtitle}
      badge={bp.stage}
      badgeVariant="status-draft"
      to="/govern/board-papers"
    />
  )
}

export function WorkshopCard({ record: w }) {
  const date = [w.month, w.day].filter(Boolean).join(' ')
  const subtitle = [date, w.cpdPoints != null && `${w.cpdPoints} CPD`].filter(Boolean).join(' · ')
  return (
    <HomeCard
      icon={IconGraduateCap}
      accent="purple"
      title={w.title}
      subtitle={subtitle}
      badge={w.matchScore != null ? `${w.matchScore}% match` : 'Suggested'}
      badgeVariant="status-suggested"
      to="/learn/cpd/events"
    />
  )
}

export function BriefingCard({ record: b }) {
  const subtitle = [b.source, b.readTime].filter(Boolean).join(' · ')
  const isCritical = b.priority === 'High Priority' || b.impact_level === 'high'
  return (
    <HomeCard
      icon={IconLightbulbGlow}
      accent="amber"
      title={b.title}
      subtitle={subtitle}
      badge={b.priority || (b.impact_level === 'high' ? 'High impact' : 'Insight')}
      badgeVariant={isCritical ? 'priority-critical' : 'priority-high'}
      to="/insights"
    />
  )
}

export function CommunityPostCard({ record: p }) {
  const subtitle = [p.author, p.replies != null && `${p.replies} replies`].filter(Boolean).join(' · ')
  return (
    <HomeCard
      icon={IconTeam}
      accent="cyan"
      title={p.title}
      subtitle={subtitle}
      badge={p.type}
      badgeVariant="category-cyan"
      to="/community"
    />
  )
}

const CARD_BY_KIND = {
  meeting: MeetingCard,
  event: EventCard,
  task: TaskCard,
  policy: PolicyCard,
  paper: BoardPaperCard,
  workshop: WorkshopCard,
  briefing: BriefingCard,
  post: CommunityPostCard,
}

export function CardForKind({ kind, record }) {
  const Cmp = CARD_BY_KIND[kind]
  if (!Cmp) return null
  return <Cmp record={record} />
}
