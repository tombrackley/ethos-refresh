import { useState } from 'react'
import {
  ChevronDown, ChevronRight, FileText, Clock, Check, CheckCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import tenant from '@/config/tenant'

const PAPERS = tenant.pages.govern.boardPapers ?? []
const MEETINGS = tenant.pages.govern.meetings ?? []

const READ_STYLE = {
  Unread:       { dot: 'bg-blue-500',    label: 'Unread',       Icon: null },
  Read:         { dot: 'bg-emerald-500', label: 'Read',         Icon: Check },
  Acknowledged: { dot: 'bg-emerald-600', label: 'Acknowledged', Icon: CheckCheck },
}

function ReadIndicator({ status }) {
  const s = READ_STYLE[status] ?? READ_STYLE.Unread
  if (s.Icon) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
        <s.Icon className="size-3.5" /> {s.label}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-blue-600">
      <span className={`size-1.5 rounded-full ${s.dot}`} /> {s.label}
    </span>
  )
}

export function BoardPapersDirectorView({ boardId }) {
  const [expanded, setExpanded] = useState(() => new Set())

  const meetings = MEETINGS
    .filter(m => m.status !== 'Completed')
    .filter(m => !boardId || m.boardId === boardId)

  if (meetings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">No upcoming meetings.</p>
      </div>
    )
  }

  function toggle(id) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-3">
      {meetings.map(m => {
        const papers = PAPERS.filter(p => p.meetingId === m.id)
        const isOpen = expanded.has(m.id)
        return (
          <div key={m.id} className="border border-border/60 rounded bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => toggle(m.id)}
              className="w-full flex items-center justify-between gap-3 px-5 py-3 hover:bg-muted/30 transition-colors text-left"
            >
              <div className="flex items-center gap-2 min-w-0">
                {isOpen ? <ChevronDown className="size-4 text-muted-foreground shrink-0" /> : <ChevronRight className="size-4 text-muted-foreground shrink-0" />}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.dateTime}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{papers.length} paper{papers.length === 1 ? '' : 's'}</span>
            </button>

            {isOpen && (
              <div className="border-t border-border/60 px-5 py-3 space-y-2">
                {papers.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">No papers yet.</p>
                ) : papers.map(p => (
                  <div key={p.id} className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5">
                    <FileText className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {p.readingTime} min read
                        </span>
                        <ReadIndicator status={p.readStatus} />
                      </div>
                    </div>
                    {p.readStatus !== 'Acknowledged' && (
                      <Button size="sm" variant="outline" className="h-7 text-xs shrink-0">
                        Mark as understood
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
