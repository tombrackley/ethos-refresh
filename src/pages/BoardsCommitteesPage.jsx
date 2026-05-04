import { useNavigate } from 'react-router-dom'
import { Users, Calendar, Landmark, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import tenant from '@/config/tenant'

const BOARDS_COMMITTEES = tenant.pages.govern.boardsCommittees ?? []

const HEALTH_DOT = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-400',
  red:   'bg-destructive',
}

const HEALTH_LABEL = {
  green: 'Healthy',
  amber: 'Needs attention',
  red:   'At risk',
}

const TYPE_BADGE = {
  Board:     'border-brand-200 bg-brand-50 text-brand-800',
  Committee: 'border-slate-200 bg-slate-50 text-slate-700',
}

function BoardCommitteeCard({ entry, onClick }) {
  const TypeIcon = entry.type === 'Board' ? Landmark : Users
  return (
    <div
      onClick={onClick}
      className="group rounded-lg border border-border/60 bg-white overflow-hidden cursor-pointer hover:shadow-md hover:border-border transition-all"
    >
      <div className="px-5 py-4 border-b border-border/60 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="size-9 rounded-md bg-muted flex items-center justify-center shrink-0">
            <TypeIcon className="size-4 text-muted-foreground" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-medium text-foreground leading-tight truncate">{entry.name}</h3>
            <Badge variant="outline" className={`mt-1.5 text-xs h-5 px-1.5 ${TYPE_BADGE[entry.type] ?? ''}`}>
              {entry.type}
            </Badge>
          </div>
        </div>
        <span
          className={`size-2.5 rounded-full shrink-0 mt-2 ${HEALTH_DOT[entry.health] ?? 'bg-muted'}`}
          title={HEALTH_LABEL[entry.health] ?? 'Unknown'}
          aria-label={HEALTH_LABEL[entry.health] ?? 'Unknown'}
        />
      </div>

      <div className="px-5 py-4 space-y-2.5">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="size-3.5 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">Jurisdiction</span>
          <span className="ml-auto text-foreground">{entry.jurisdiction}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="size-3.5 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">Members</span>
          <span className="ml-auto text-foreground">{entry.memberCount}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="size-3.5 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">Next meeting</span>
          <span className="ml-auto text-foreground">{entry.nextMeeting}</span>
        </div>
      </div>
    </div>
  )
}

export default function BoardsCommitteesPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Boards &amp; Committees</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Organisation boards and committees with composition, meeting cadence, and current health.
              </p>
            </div>
          </div>

          {BOARDS_COMMITTEES.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
              <p className="text-sm text-muted-foreground">No boards or committees configured.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BOARDS_COMMITTEES.map(entry => (
                <BoardCommitteeCard
                  key={entry.id}
                  entry={entry}
                  onClick={() => navigate(`/govern/boards/${entry.id}`)}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
