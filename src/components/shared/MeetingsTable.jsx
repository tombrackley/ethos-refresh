import { Badge } from '@/components/ui/badge'
import tenant from '@/config/tenant'

const MEETINGS = tenant.pages.govern.meetings ?? []
const BOARDS = tenant.pages.govern.boards ?? []
const BOARDS_COMMITTEES = tenant.pages.govern.boardsCommittees ?? []

const STATUS_STYLE = {
  Scheduled:     'border-slate-200 bg-slate-50 text-slate-700',
  'In Progress': 'border-amber-300 bg-amber-50 text-amber-700',
  Completed:     'border-emerald-200 bg-emerald-50 text-emerald-700',
}

const TYPE_STYLE = {
  Board:     'border-brand-200 bg-brand-50 text-brand-800',
  Committee: 'border-slate-200 bg-slate-50 text-slate-700',
  AGM:       'border-amber-200 bg-amber-50 text-amber-800',
}

const MINUTES_STYLE = {
  Pending: 'text-muted-foreground',
  Draft:   'text-amber-700',
  Final:   'text-emerald-700',
}

function boardName(boardId) {
  const fromBoards = BOARDS.find(b => b.id === boardId)
  if (fromBoards) return fromBoards.name
  const fromBC = BOARDS_COMMITTEES.find(b => b.id === boardId)
  if (fromBC) return fromBC.name
  return boardId
}

export function MeetingsTable({ boardId, onRowClick }) {
  const rows = boardId ? MEETINGS.filter(m => m.boardId === boardId) : MEETINGS

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">No meetings.</p>
      </div>
    )
  }

  return (
    <div className="border border-border/60 rounded bg-white overflow-hidden">
      <div className="grid grid-cols-12 gap-3 px-5 py-2 border-b border-border/60 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
        <div className="col-span-4">Meeting</div>
        {!boardId && <div className="col-span-2">Board</div>}
        <div className={boardId ? 'col-span-3' : 'col-span-2'}>Date / time</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-2">Status</div>
        <div className={boardId ? 'col-span-2' : 'col-span-1'}>Minutes</div>
      </div>
      <div>
        {rows.map(m => (
          <div
            key={m.id}
            onClick={onRowClick ? () => onRowClick(m) : undefined}
            className={`grid grid-cols-12 gap-3 items-center px-5 py-3 border-b border-border/40 last:border-0 text-sm ${onRowClick ? 'cursor-pointer hover:bg-muted/30 transition-colors' : ''}`}
          >
            <div className="col-span-4">
              <p className="text-foreground font-medium truncate">{m.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.attendees} attendees</p>
            </div>
            {!boardId && (
              <div className="col-span-2 text-muted-foreground truncate">{boardName(m.boardId)}</div>
            )}
            <div className={`${boardId ? 'col-span-3' : 'col-span-2'} text-muted-foreground`}>{m.dateTime}</div>
            <div className="col-span-1">
              <Badge variant="outline" className={`text-xs h-5 px-1.5 ${TYPE_STYLE[m.type] ?? ''}`}>{m.type}</Badge>
            </div>
            <div className="col-span-2">
              <Badge variant="outline" className={`text-xs h-5 px-1.5 ${STATUS_STYLE[m.status] ?? ''}`}>{m.status}</Badge>
            </div>
            <div className={`${boardId ? 'col-span-2' : 'col-span-1'} ${MINUTES_STYLE[m.minutes] ?? 'text-muted-foreground'}`}>
              {m.minutes}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
