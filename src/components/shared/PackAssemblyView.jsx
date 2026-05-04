import { useMemo } from 'react'
import { PackAssemblyCard } from './PackAssemblyCard'
import tenant from '@/config/tenant'

const MEETINGS = tenant.pages.govern.meetings ?? []
const PAPERS = tenant.pages.govern.boardPapers ?? []

const MONTH_INDEX = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }

function meetingDate(str) {
  const [day, mon, yearAndTime] = (str ?? '').split(' ')
  if (!day || !mon || !yearAndTime) return null
  const year = yearAndTime.replace(/,$/, '')
  const m = MONTH_INDEX[mon]
  if (m == null) return null
  return new Date(Number(year), m, Number(day))
}

export function PackAssemblyView({ boardId, meetingId }) {
  const meetings = useMemo(() => {
    if (meetingId) {
      const m = MEETINGS.find(x => x.id === meetingId)
      return m ? [m] : []
    }
    return MEETINGS
      .filter(m => m.status !== 'Completed')
      .filter(m => !boardId || m.boardId === boardId)
      .slice()
      .sort((a, b) => {
        const da = meetingDate(a.dateTime)
        const db = meetingDate(b.dateTime)
        if (!da) return 1
        if (!db) return -1
        return da - db
      })
  }, [boardId, meetingId])

  if (meetings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          {meetingId ? 'Meeting not found.' : 'No upcoming meetings.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {meetings.map(m => (
        <PackAssemblyCard
          key={m.id}
          meeting={m}
          papers={PAPERS}
          initiallyExpanded={Boolean(meetingId)}
        />
      ))}
    </div>
  )
}
