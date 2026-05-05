import tenant from '@/config/tenant'
import { ComplianceStatusBadge } from '@/components/shared/ComplianceStatusBadge'
import { GetStartedRail } from './home/GetStartedRail'
import { KanbanColumn } from './home/KanbanColumn'
import { CardForKind } from './home/cards'
import { getUpcoming, getRecommended, getToDo } from './home/data'

function greetingPrefix() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function HomePage() {
  const firstName = tenant.user?.name?.split(' ')[0] ?? 'there'
  const upcoming = getUpcoming()
  const recommended = getRecommended()
  const todo = getToDo()

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-7xl px-6 py-6 space-y-6">
        <header className="space-y-3">
          <ComplianceStatusBadge />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {greetingPrefix()}, {firstName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Here&apos;s what&apos;s happening today.
            </p>
          </div>
        </header>

        <GetStartedRail />

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <KanbanColumn title="Upcoming" count={upcoming.length} viewAllHref="/govern/meetings">
            {upcoming.map((item, i) => (
              <CardForKind key={`up-${i}`} kind={item.kind} record={item.record} />
            ))}
          </KanbanColumn>

          <KanbanColumn title="Recommended" count={recommended.length} viewAllHref="/insights">
            {recommended.map((item, i) => (
              <CardForKind key={`rec-${i}`} kind={item.kind} record={item.record} />
            ))}
          </KanbanColumn>

          <KanbanColumn title="To Do" count={todo.length} viewAllHref="/work/time-efficiency">
            {todo.map((item, i) => (
              <CardForKind key={`todo-${i}`} kind={item.kind} record={item.record} />
            ))}
          </KanbanColumn>
        </section>
      </div>
    </div>
  )
}
